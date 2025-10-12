import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Layout,
  CodeEditor,
  AuthDebugger,
} from "../components";
import { useApiCall } from "../hooks";
import problemService from "../services/problemService";
import * as compilerService from "../services/compilerService";
import aiService from "../services/aiService";
import subscriptionService from "../services/subscriptionService";
import socketService from "../services/socketService";
import {
  getVerdictColor,
  getVerdictIcon,
  getVerdictDescription,
  formatConstraints,
} from "../utils/verdictUtils";
import ReactMarkdown from "react-markdown";

const Problem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, error, execute } = useApiCall();
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [executionResult, setExecutionResult] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [input, setInput] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [leftActiveTab, setLeftActiveTab] = useState("description"); // description, submissions
  const [rightActiveTab, setRightActiveTab] = useState("code"); // code, result, review
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Remove local isAuthenticated state and use Redux state instead
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [debugLogs, setDebugLogs] = useState([]);
  const [errorMarkers, setErrorMarkers] = useState([]); // New state for error markers


  // Import useSelector to access Redux state
  const { isAuthenticated } = useSelector((state) => state.user);

  // Debug logging function
  const addDebugLog = (message, data = null) => {
    const timestamp = new Date().toLocaleTimeString();
    // Use timestamp for unique ID to avoid React key conflicts
    const logId = `debug-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const logEntry = {
      id: logId,
      timestamp,
      message,
      data: data ? JSON.stringify(data, null, 2) : null,
    };

    setDebugLogs((prev) => [logEntry, ...prev.slice(0, 9)]); // Keep last 10 logs
    // Only log to console in development mode
    if (import.meta.env.DEV) {
      console.log(`Xalora [${timestamp}]: ${message}`, data || "");
    }
  };

  const languages = [
    // { value: "js", label: "JavaScript" },
    { value: "py", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "c", label: "C" },
    // { value: "cs", label: "C#" },
    { value: "go", label: "Go" },
    { value: "rs", label: "Rust" },
    // { value: "php", label: "PHP" },
    { value: "rb", label: "Ruby" },
  ];

  const getLanguageTemplate = (language) => {
    const templates = {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() { 
    // Your code here
    
    return 0;
}`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    // Your code here
    
    return 0;
}`,
      py: `def solution():
    # Your code here
    pass

if __name__ == "__main__":
    solution()`,
      java: `import java.util.*;
import java.io.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        // Your code here
        
        sc.close();
    }
}`,
      go: `package main

import (
    "fmt"
)

func main() {
    // Your code here
    
}`,
      rs: `use std::io;

fn main() {
    // Your code here
    
}`,
      rb: `# Your code here

`,
    };
    return templates[language] || "// Start coding here";
  };

  useEffect(() => {
    const fetchProblem = async () => {
      await execute(
        () => problemService.getProblemById(id),
        (response) => {
          if (response.success) {
            setProblem(response.data);
            
            // Check if problem is solved (from localStorage or backend)
            const solvedProblems = JSON.parse(localStorage.getItem('solvedProblems') || '[]');
            const isLocalSolved = solvedProblems.includes(id);
            
            // If problem is marked as solved locally or in backend, show solved status
            if (isLocalSolved || response.data.userStatus === "Solved") {
              setExecutionResult({
                success: true,
                message: "All test cases passed!",
                verdict: "Accepted",
                testCasesPassed: response.data.totalTestCases || 0,
                totalTestCases: response.data.totalTestCases || 0,
                passed: true,
              });
            }
          }
        }
      );
    };

    if (id) {
      fetchProblem();
    }
  }, [id, execute]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      // Only fetch submissions if user is authenticated
      if (id && isAuthenticated) {
        setLoadingSubmissions(true);
        try {
          const response = await problemService.getProblemSubmissions(id);
          if (response.success) {
            setSubmissions(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch submissions:", error);
        } finally {
          setLoadingSubmissions(false);
        }
      }
    };

    fetchSubmissions();
  }, [id, isAuthenticated]);

  // Initialize with template and update when language changes
  useEffect(() => {
    setCode(getLanguageTemplate(selectedLanguage));
  }, [selectedLanguage]);

  // Socket.IO integration for real-time updates
  useEffect(() => {
    if (isAuthenticated) {
      // Connect to socket with auth token
      const token = localStorage.getItem('accessToken');
      if (token) {
        socketService.connect(token);

        // Listen for submission updates
        socketService.on('submission-update', (update) => {
          console.log('🔌 Real-time submission update:', update);
          console.log('🌐 Load Balancer: Real-time update received via WebSocket');
          console.log('⚡ Queue System: Submission processed by compiler instance');
          setExecutionResult({
            success: update.verdict === "Accepted",
            message: update.verdict === "Accepted" ? "All test cases passed!" : `Result: ${update.verdict}`,
            verdict: update.verdict,
            testCasesPassed: update.testCasesPassed,
            totalTestCases: update.totalTestCases,
            executionTime: update.executionTime,
            memory: update.memory,
            status: "completed",
            results: update.results || [],
            summary: update.summary || {
              total: update.totalTestCases,
              passed: update.testCasesPassed,
              failed: update.totalTestCases - update.testCasesPassed,
            },
          });
          setRightActiveTab("result");
        });

        // Listen for submission results
        socketService.on('submission-result', (result) => {
          console.log('🔌 Real-time submission result:', result);
          setExecutionResult({
            success: result.verdict === "Accepted",
            message: result.verdict === "Accepted" ? "All test cases passed!" : `Result: ${result.verdict}`,
            verdict: result.verdict,
            testCasesPassed: result.testCasesPassed,
            totalTestCases: result.totalTestCases,
            executionTime: result.executionTime,
            memory: result.memory,
            status: "completed",
            results: result.results || [],
            summary: result.summary || {
              total: result.totalTestCases,
              passed: result.testCasesPassed,
              failed: result.totalTestCases - result.testCasesPassed,
            },
          });
          setRightActiveTab("result");
        });
      }
    }

    // Cleanup on unmount
    return () => {
      socketService.off('submission-update');
      socketService.off('submission-result');
    };
  }, [isAuthenticated]);

  const handleLoadTemplate = () => {
    const confirmLoad = window.confirm(
      "This will replace your current code with the template. Are you sure?"
    );
    if (confirmLoad) {
      setCode(getLanguageTemplate(selectedLanguage));
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-500";
      case "Medium":
        return "text-yellow-500";
      case "Hard":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  // Function to parse compiler errors and create markers
  const parseCompilerError = (error, language, errorInfo = null) => {
    // If we have structured error info from backend, use it
    if (errorInfo && errorInfo.line) {
      return [
        {
          startLineNumber: errorInfo.line,
          startColumn: errorInfo.column || 1,
          endLineNumber: errorInfo.line,
          endColumn: errorInfo.column ? errorInfo.column + 1 : 1000,
          message: errorInfo.message,
          severity: "error",
        },
      ];
    }

    // Fallback to client-side parsing
    if (!error) return [];

    const markers = [];

    // Parse different types of errors based on language
    switch (language) {
      case "cpp":
      case "c": {
        // Parse GCC/Clang errors
        const gccErrorRegex = /[^:]+:(\d+):(\d+):\s*(.*)/g;
        let match;
        while ((match = gccErrorRegex.exec(error)) !== null) {
          const [, line, column, message] = match;
          markers.push({
            startLineNumber: parseInt(line),
            startColumn: parseInt(column),
            endLineNumber: parseInt(line),
            endColumn: parseInt(column) + 1,
            message: message.trim(),
            severity: "error",
          });
        }
        break;
      }

      case "java": {
        // Parse Java compiler errors
        const javaErrorRegex = /[^:]+:(\d+):\s*(.*)/g;
        let match;
        while ((match = javaErrorRegex.exec(error)) !== null) {
          const [, line, message] = match;
          markers.push({
            startLineNumber: parseInt(line),
            startColumn: 1,
            endLineNumber: parseInt(line),
            endColumn: 1000,
            message: message.trim(),
            severity: "error",
          });
        }
        break;
      }

      case "py": {
        // Parse Python errors
        const pythonErrorRegex = /File ".*", line (\d+)/g;
        let match;
        while ((match = pythonErrorRegex.exec(error)) !== null) {
          const [, line] = match;
          // Extract error message (next line after "File" line)
          const errorLines = error.split("\n");
          const lineIndex = errorLines.findIndex((l) =>
            l.includes(`line ${line}`)
          );
          const errorMessage =
            lineIndex < errorLines.length - 1
              ? errorLines[lineIndex + 1]
              : "Syntax Error";

          markers.push({
            startLineNumber: parseInt(line),
            startColumn: 1,
            endLineNumber: parseInt(line),
            endColumn: 1000,
            message: errorMessage.trim(),
            severity: "error",
          });
        }
        break;
      }

      default: {
        // For other languages, try to find line numbers in error message
        const genericLineRegex = /line[^\d]*(\d+)|:(\d+):/gi;
        let match;
        while ((match = genericLineRegex.exec(error)) !== null) {
          const line = match[1] || match[2];
          if (line) {
            markers.push({
              startLineNumber: parseInt(line),
              startColumn: 1,
              endLineNumber: parseInt(line),
              endColumn: 1000,
              message: "Syntax error",
              severity: "error",
            });
          }
        }
      }
    }

    return markers;
  };

  const handleRunCode = async () => {
    addDebugLog("🚀 RUN CODE - Button clicked", {
      codeLength: code.length,
      language: selectedLanguage,
      hasInput: !!input,
      authenticated: isAuthenticated,
    });

    if (!code.trim()) {
      addDebugLog("❌ RUN CODE - No code provided");
      alert("Please write some code first!");
      return;
    }

    if (!isAuthenticated) {
      addDebugLog("❌ RUN CODE - User not authenticated");
      alert("Please login to run and submit code!");
      return;
    }

    addDebugLog("⏳ RUN CODE - Starting execution...");
    setExecuting(true);
    setExecutionResult(null);

    try {
      console.log("📡 RUN CODE - Calling compiler service with:", {
        codeLength: code.length,
        language: selectedLanguage,
        inputLength: input.length,
      });

      const result = await compilerService.executeCode(
        code,
        selectedLanguage,
        input
      );

      // Parse errors and set markers
      if (result.error) {
        const markers = parseCompilerError(
          result.error,
          selectedLanguage,
          result.errorInfo
        );
        setErrorMarkers(markers);
      } else {
        setErrorMarkers([]); // Clear markers if no error
      }

      setExecutionResult({
        success: result.success,
        message: result.message,
        output: result.output,
        error: result.error,
        verdict: result.verdict,
        errorInfo: result.errorInfo,
      });
      setRightActiveTab("result");
      console.log("🎯 RUN CODE - UI updated with results");
    } catch (error) {
      console.log("❌ RUN CODE - Error occurred:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        stack: error.stack,
      });

      // Try to parse error from the exception
      let errorMessage = error.response?.data?.error || error.message;
      const markers = parseCompilerError(
        errorMessage,
        selectedLanguage,
        error.response?.data?.errorInfo
      );
      setErrorMarkers(markers);

      setExecutionResult({
        success: false,
        message: error.response?.data?.message || "Failed to execute code",
        error: errorMessage,
        errorInfo: error.response?.data?.errorInfo,
      });
      setRightActiveTab("result");
    } finally {
      setExecuting(false);
      console.log("🏁 RUN CODE - Execution completed");
    }
  };

  const handleSubmitSolution = async () => {
    console.log("🚀 SUBMIT - Button clicked");
    console.log("📝 Code length:", code.length);
    console.log("🔤 Selected language:", selectedLanguage);
    console.log("🆔 Problem ID:", id);
    console.log("🔐 User authenticated:", isAuthenticated);
    // Log submit details only in development
    if (import.meta.env.DEV) {
      console.table({
        Function: "handleSubmitSolution",
        "Problem ID": id,
        "Code Length": code.length,
        Language: selectedLanguage,
        Authenticated: isAuthenticated,
      });
    }

    if (!code.trim()) {
      console.log("❌ SUBMIT - No code provided");
      alert("Please write some code first!");
      return;
    }

    if (!isAuthenticated) {
      console.log("❌ SUBMIT - User not authenticated");
      alert("Please login to submit your solution!");
      // Redirect to login page
      navigate("/login");
      return;
    }

    console.log("⏳ SUBMIT - Starting submission...");
    console.log("🌐 Load Balancer: Submitting solution to server via API");
    setExecuting(true);
    setExecutionResult(null);

    try {
      console.log("📡 SUBMIT - Calling problem service with:", {
        problemId: id,
        codeLength: code.length,
        language: selectedLanguage,
      });

      const result = await problemService.submitSolution({
        problemId: id,
        code,
        language: selectedLanguage,
      });

      console.log("🌐 Load Balancer: Received response from server, processing via queue system");

      console.log("📥 SUBMIT - Problem service response:", {
        success: result.success,
        message: result.message,
        hasData: !!result.data,
        dataKeys: result.data ? Object.keys(result.data) : [],
        passed: result.data?.passed,
        totalTests: result.data?.summary?.total,
        passedTests: result.data?.summary?.passed,
      });

      if (result.success) {
        console.log("✅ SUBMIT - Submission successful");

        // Handle new queue-based response format
        const submissionData = result.data;
        const isAccepted = submissionData.verdict === "Accepted";

        // If still processing, show a better message
        if (submissionData.verdict === "Processing") {
          setExecutionResult({
            success: false,
            message: "Your submission is being processed. This may take a few moments...",
            verdict: "Processing",
            testCasesPassed: 0,
            totalTestCases: submissionData.totalTestCases || 0,
            executionTime: 0,
            memory: 0,
            passed: false,
            results: [],
            summary: {
              total: submissionData.totalTestCases || 0,
              passed: 0,
              failed: submissionData.totalTestCases || 0,
            },
          });
        } else {
          setExecutionResult({
            success: submissionData.success,
            message: result.message,
            verdict: submissionData.verdict,
            testCasesPassed: submissionData.testCasesPassed,
            totalTestCases: submissionData.totalTestCases,
            executionTime: submissionData.executionTime,
            memory: submissionData.memory,
            passed: isAccepted,
            results: submissionData.results || [],
            // Create summary for compatibility
            summary: submissionData.summary || {
              total: submissionData.totalTestCases,
              passed: submissionData.testCasesPassed,
              failed:
                submissionData.totalTestCases - submissionData.testCasesPassed,
            },
          });

          // If problem is solved, store it locally for immediate UI update
          if (isAccepted) {
            console.log("🎉 Problem solved! Updating local storage...");
            const solvedProblems = JSON.parse(localStorage.getItem('solvedProblems') || '[]');
            if (!solvedProblems.includes(id)) {
              solvedProblems.push(id);
              localStorage.setItem('solvedProblems', JSON.stringify(solvedProblems));
              
              // Dispatch custom event to notify other components
              window.dispatchEvent(new CustomEvent('solvedProblemsUpdated'));
            }
          }
        }
        setRightActiveTab("result");

        console.log("🔄 SUBMIT - Refreshing submissions list...");
        // Refresh submissions after successful submission
        const submissionsResponse = await problemService.getProblemSubmissions(
          id
        );
        if (submissionsResponse.success) {
          console.log(
            "✅ SUBMIT - Submissions refreshed:",
            submissionsResponse.data.length
          );
          setSubmissions(submissionsResponse.data);
        } else {
          console.log(
            "❌ SUBMIT - Failed to refresh submissions:",
            submissionsResponse.message
          );
        }

        // Automatically run AI review after successful submission
        try {
          console.log("🤖 AI REVIEW - Starting automatic review...");
          const aiResult = await aiService.reviewCode(code, selectedLanguage);
          if (aiResult.success) {
            setReviewResult(aiResult.data.review);
            setRightActiveTab("review");
            console.log("✅ AI REVIEW - Review generated successfully");
          }
        } catch (aiError) {
          console.log(
            "❌ AI REVIEW - Failed to generate review:",
            aiError.message
          );
        }
      } else {
        console.log("❌ SUBMIT - Submission failed:", result.message);

        // Handle failed submission with new format
        const submissionData = result.data;
        const execResult = {
          success: false,
          message: result.message,
          verdict: submissionData.verdict || "Runtime Error",
          testCasesPassed: submissionData.testCasesPassed || 0,
          totalTestCases: submissionData.totalTestCases || 0,
          executionTime: submissionData.executionTime || 0,
          memory: submissionData.memory || 0,
          passed: false,
          error: submissionData.error,
          errorInfo: submissionData.errorInfo,
          // Create summary for compatibility
          summary: {
            total: submissionData.totalTestCases || 0,
            passed: submissionData.testCasesPassed || 0,
            failed:
              (submissionData.totalTestCases || 0) -
              (submissionData.testCasesPassed || 0),
          },
        };

        setExecutionResult(execResult);
        setRightActiveTab("result");

        // Parse errors and set markers for compilation errors
        if (result.data.error || result.data.errorInfo) {
          const markers = parseCompilerError(
            result.data.error,
            selectedLanguage,
            result.data.errorInfo
          );
          setErrorMarkers(markers);
        } else {
          setErrorMarkers([]); // Clear markers if no error
        }

        // Automatically run AI review with error information
        try {
          console.log(
            "🤖 AI REVIEW - Starting automatic review with error info..."
          );
          const aiResult = await aiService.reviewCode(
            code,
            selectedLanguage,
            execResult
          );
          if (aiResult.success) {
            setReviewResult(aiResult.data.review);
            setRightActiveTab("review");
            console.log(
              "✅ AI REVIEW - Review generated successfully with error analysis"
            );
          }
        } catch (aiError) {
          console.log(
            "❌ AI REVIEW - Failed to generate review:",
            aiError.message
          );
        }
      }
    } catch (error) {
      console.log("❌ SUBMIT - Error occurred:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        stack: error.stack,
      });

      // Try to parse error from the exception
      let errorMessage =
        error.response?.data?.message || "Failed to submit solution";
      let errorData = error.response?.data || {};

      const execResult = {
        success: false,
        message: errorMessage,
        // Include error details for better feedback
        error: errorData.error,
        errorInfo: errorData.errorInfo,
      };

      setExecutionResult(execResult);
      setRightActiveTab("result");

      // Parse errors and set markers
      if (errorData.error || errorData.errorInfo) {
        const markers = parseCompilerError(
          errorData.error,
          selectedLanguage,
          errorData.errorInfo
        );
        setErrorMarkers(markers);
      } else {
        setErrorMarkers([]); // Clear markers if no error
      }

      // Automatically run AI review with error information
      try {
        console.log(
          "🤖 AI REVIEW - Starting automatic review with error info..."
        );
        const aiResult = await aiService.reviewCode(
          code,
          selectedLanguage,
          execResult
        );
        if (aiResult.success) {
          setReviewResult(aiResult.data.review);
          setRightActiveTab("review");
          console.log(
            "✅ AI REVIEW - Review generated successfully with error analysis"
          );
        }
      } catch (aiError) {
        console.log(
          "❌ AI REVIEW - Failed to generate review:",
          aiError.message
        );
      }
    } finally {
      setExecuting(false);
      console.log("🏁 SUBMIT - Submission completed");
    }
  };

  const handleViewCode = (submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const handleGetReview = async () => {
    if (!code.trim()) {
      alert("Please write some code first!");
      return;
    }

    if (!isAuthenticated) {
      alert("Please login to use the AI code review feature!");
      return;
    }

    setReviewLoading(true);
    setReviewResult(null);

    try {
      // First, get AI usage info to check if user has remaining requests
      const aiUsage = await subscriptionService.getAIUsageInfo();
      
      // Check if user has remaining requests
      if (aiUsage.requestsRemaining <= 0) {
        alert(`You've reached your daily AI request limit (${aiUsage.requestsLimit}). Please try again tomorrow or upgrade your plan for more requests.`);
        setTimeout(() => {
          if (typeof navigate === 'function') {
            navigate('/pricing');
          } else {
            window.location.href = '/pricing';
          }
        }, 1000);
        setReviewLoading(false);
        return;
      }

      const result = await aiService.reviewCode(code, selectedLanguage);
      if (result.success) {
        setReviewResult(result.data.review);
        setRightActiveTab("review");
      } else {
        // Check if it's a subscription error
        if (result.message && result.message.includes("upgrade")) {
          alert("AI code review is not available in your current plan. Please upgrade to unlock this feature.");
          setTimeout(() => {
            if (typeof navigate === 'function') {
              navigate('/pricing');
            } else {
              window.location.href = '/pricing';
            }
          }, 1000);
        } else {
          alert(result.message || "Failed to get code review");
        }
      }
    } catch (error) {
      // Check if it's a subscription error
      if (error.response?.data?.redirectToPricing) {
        alert("AI code review is not available in your current plan. Please upgrade to unlock this feature.");
        setTimeout(() => {
          if (typeof navigate === 'function') {
            navigate('/pricing');
          } else {
            window.location.href = '/pricing';
          }
        }, 1000);
      } else {
        alert(error.message || "Failed to get code review");
      }
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !problem) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
            {error || "Problem not found"}
          </div>
        </div>
      </Layout>
    );
  }

  // Function to get language-specific help tips
  const getLanguageHelpTips = (language) => {
    const tips = {
      cpp: [
        "C++ requires semicolons at the end of statements",
        "Include headers with #include<library>",
        "Use 'using namespace std;' to avoid prefixing standard library objects",
        "Remember to declare the main function as 'int main()'",
        "Match all opening braces { with closing braces }",
        "Declare variables before using them",
      ],
      c: [
        "C requires semicolons at the end of statements",
        "Include headers with #include<library>",
        "Remember to declare the main function as 'int main()'",
        "Match all opening braces { with closing braces }",
        "Declare variables at the beginning of blocks",
        "Use proper format specifiers in scanf/printf",
      ],
      java: [
        "Java class names must match the filename",
        "All code must be inside a class",
        "Use proper import statements for external libraries",
        "Match all opening braces { with closing braces }",
        "Declare the main method as 'public static void main(String[] args)'",
        "End statements with semicolons",
      ],
      py: [
        "Python uses indentation instead of braces for code blocks",
        "Use consistent indentation (spaces or tabs, but not both)",
        "Function definitions start with 'def'",
        "Use colons : at the end of if/for/while statements",
        "Import modules with 'import module_name'",
        "Comments start with #",
      ],
    };

    return tips[language] || [];
  };

  // Function to extract code from AI review
  const extractCodeFromReview = (review) => {
    // Look for code blocks in the review
    const codeBlockRegex = /```\w*\s*([\s\S]*?)```/g;
    const matches = [];
    let match;

    while ((match = codeBlockRegex.exec(review)) !== null) {
      matches.push(match[1].trim());
    }

    // Return the last code block as it's likely the fixed version
    return matches.length > 0 ? matches[matches.length - 1] : null;
  };

  // Function to insert AI-suggested code into editor
  const insertAICodeIntoEditor = () => {
    if (!reviewResult) return;

    const suggestedCode = extractCodeFromReview(reviewResult);
    if (suggestedCode) {
      const confirmInsert = window.confirm(
        "This will replace your current code with the AI-suggested version. Are you sure?"
      );
      if (confirmInsert) {
        setCode(suggestedCode);
        alert("AI-suggested code has been inserted into the editor!");
      }
    } else {
      alert("No code suggestions found in the AI review.");
    }
  };

  // Function to insert specific code snippet into editor
  const insertCodeSnippetIntoEditor = (codeSnippet) => {
    const confirmInsert = window.confirm(
      "Insert this code snippet into the editor?"
    );
    if (confirmInsert) {
      setCode(codeSnippet);
      alert("Code snippet inserted!");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Problem Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-semibold text-gray-900">
                    {problem.title}
                  </h1>
                  <span
                    className={`px-2.5 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                      problem.difficulty
                    )}`}
                  >
                    {problem.difficulty}
                  </span>
                  {/* Solved Badge in Title */}
                  {executionResult?.verdict === "Accepted" && (
                    <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold rounded-full shadow-md flex items-center gap-1">
                      <span>✅</span>
                      SOLVED
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                  <span>Submissions: {submissions.length}</span>
                </div>
              </div>
              <Link
                to="/problems"
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Problems
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Problem Description */}
            <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Tabs */}
              <div className="bg-white rounded-lg shadow sticky top-0 z-10">
                <div className="border-b">
                  <nav className="flex">
                    <button
                      onClick={() => setLeftActiveTab("description")}
                      className={`px-4 py-3 text-sm font-medium border-b-2 ${
                        leftActiveTab === "description"
                          ? "border-purple-500 text-purple-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Description
                    </button>
                    <button
                      onClick={() => setLeftActiveTab("submissions")}
                      className={`px-4 py-3 text-sm font-medium border-b-2 ${
                        leftActiveTab === "submissions"
                          ? "border-purple-500 text-purple-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Submissions
                    </button>
                  </nav>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  {leftActiveTab === "description" ? (
                    <div className="space-y-6">
                      <div className="prose max-w-none">
                        <p className="whitespace-pre-wrap">
                          {problem.description}
                        </p>
                      </div>

                      {problem.constraints && (
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Constraints:
                          </h3>
                          <p className="text-gray-600 whitespace-pre-wrap">
                            {problem.constraints}
                          </p>
                          {problem.structuredConstraints && (
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mt-3">
                              <h4 className="text-sm font-medium text-purple-800 mb-2">
                                Limits
                              </h4>
                              <div className="flex flex-wrap gap-3 text-sm text-purple-700">
                                {formatConstraints(
                                  problem.structuredConstraints
                                )?.map((constraint, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-purple-100 rounded"
                                  >
                                    {constraint}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {problem.sampleTestCases?.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-3">
                            Examples:
                          </h3>
                          <div className="space-y-4">
                            {problem.sampleTestCases.map((testCase, index) => (
                              <div
                                key={index}
                                className="bg-gray-50 rounded-lg p-4"
                              >
                                <p className="font-medium text-gray-700 mb-2">
                                  Example {index + 1}:
                                </p>
                                <div className="space-y-2">
                                  <div className="bg-white rounded border p-3">
                                    <p className="text-sm font-medium text-gray-700">
                                      Input:
                                    </p>
                                    <pre className="mt-1 text-sm text-gray-600">
                                      {testCase.input}
                                    </pre>
                                  </div>
                                  <div className="bg-white rounded border p-3">
                                    <p className="text-sm font-medium text-gray-700">
                                      Output:
                                    </p>
                                    <pre className="mt-1 text-sm text-gray-600">
                                      {testCase.output}
                                    </pre>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {loadingSubmissions ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        </div>
                      ) : submissions.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                  Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                  Language
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                  Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                  Memory
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                  Submitted
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {submissions.map((submission) => (
                                <tr
                                  key={submission._id}
                                  className="hover:bg-gray-50"
                                >
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div
                                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getVerdictColor(
                                        submission.status
                                      )}`}
                                    >
                                      <span className="mr-1">
                                        {getVerdictIcon(submission.status)}
                                      </span>
                                      {submission.status}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {submission.language}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {submission.executionTime}
                                    ms
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {submission.memory}
                                    KB
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(
                                      submission.createdAt
                                    ).toLocaleString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                      onClick={() => handleViewCode(submission)}
                                      className="text-purple-600 hover:text-purple-900"
                                    >
                                      View Code
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 py-8">
                          No submissions yet
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Code Editor */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow">
                {/* Code Editor Tabs */}
                <div className="border-b">
                  <nav className="flex">
                    <button
                      onClick={() => setRightActiveTab("code")}
                      className={`px-4 py-3 text-sm font-medium border-b-2 ${
                        rightActiveTab === "code"
                          ? "border-purple-500 text-purple-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Code
                    </button>
                    <button
                      onClick={() => setRightActiveTab("result")}
                      className={`px-4 py-3 text-sm font-medium border-b-2 ${
                        rightActiveTab === "result"
                          ? "border-purple-500 text-purple-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Results
                    </button>
                    <button
                      onClick={() => setRightActiveTab("review")}
                      className={`px-4 py-3 text-sm font-medium border-b-2 ${
                        rightActiveTab === "review"
                          ? "border-purple-500 text-purple-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      AI Review
                    </button>
                  </nav>
                </div>

                <div className="p-6">
                  {rightActiveTab === "code" ? (
                    <>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Language
                          </label>
                          <button
                            onClick={handleLoadTemplate}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
                            title="Load template for selected language"
                          >
                            Load Template
                          </button>
                        </div>
                        <select
                          value={selectedLanguage}
                          onChange={(e) => setSelectedLanguage(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          {languages.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                              {lang.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Code Editor
                          </label>
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() =>
                                setEditorTheme(
                                  editorTheme === "vs-dark"
                                    ? "light"
                                    : "vs-dark"
                                )
                              }
                              className="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                            >
                              {editorTheme === "vs-dark" ? (
                                <>
                                  <svg
                                    className="w-3 h-3"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 011.414 0zM4 11a1 1 0 100-2H3a1 1 0 000 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 011.414 0zM4 11a1 1 0 100-2H3a1 1 0 000 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 011.414 0zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span>Light</span>
                                </>
                              ) : (
                                <>
                                  <svg
                                    className="w-3 h-3"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                  </svg>
                                  <span>Dark</span>
                                </>
                              )}
                            </button>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span>Ctrl+Enter to run</span>
                              <span>•</span>
                              <span>Ctrl+Shift+Enter to submit</span>
                            </div>
                          </div>
                        </div>
                        <CodeEditor
                          value={code}
                          onChange={setCode}
                          language={selectedLanguage}
                          height="400px"
                          theme={editorTheme}
                          className="focus-within:ring-2 focus-within:ring-purple-500"
                          errorMarkers={errorMarkers} // Pass error markers to editor

                        />

                        {/* Language-specific tips */}
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="text-sm font-medium text-blue-800 mb-2">
                            Language Tips:
                          </h4>
                          <ul className="text-xs text-blue-700 list-disc pl-5 space-y-1">
                            {getLanguageHelpTips(selectedLanguage).map(
                              (tip, index) => (
                                <li key={index}>{tip}</li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Custom Input
                        </label>
                        <textarea
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          className="w-full h-24 font-mono text-sm rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
                          placeholder="Enter custom input for testing..."
                          spellCheck="false"
                        />
                      </div>

                      <div className="flex justify-between mt-4">
                        <div className="space-x-2">
                          <button
                            onClick={handleRunCode}
                            disabled={executing}
                            data-action="run-code"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                          >
                            {executing ? "Running..." : "Run Code"}
                          </button>
                          <button
                            onClick={handleSubmitSolution}
                            disabled={executing}
                            data-action="submit-code"
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                          >
                            {executing ? "Submitting..." : "Submit"}
                          </button>
                        </div>
                        <button
                          onClick={handleGetReview}
                          disabled={reviewLoading}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          {reviewLoading
                            ? "Getting Review..."
                            : "Get AI Review"}
                        </button>
                      </div>
                    </>
                  ) : rightActiveTab === "result" ? (
                    /* Execution Result Tab */
                    <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                      {executionResult ? (
                        <div
                          className={`rounded-lg p-4 ${
                            executionResult.success
                              ? "bg-green-50"
                              : "bg-red-50"
                          }`}
                        >
                          <h3 className="text-sm font-medium text-gray-900 mb-4">
                            Execution Result
                          </h3>
                          <p
                            className={`font-medium ${
                              executionResult.success
                                ? "text-green-700"
                                : "text-red-700"
                            }`}
                          >
                            {executionResult.message}
                          </p>

                          {/* Solved Badge - Show when problem is solved */}
                          {executionResult.verdict === "Accepted" && (
                            <div className="mt-4 p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg border-2 border-green-400 shadow-lg">
                              <div className="flex items-center justify-center space-x-3">
                                <span className="text-3xl">🎉</span>
                                <div className="text-center">
                                  <h3 className="text-xl font-bold">SOLVED!</h3>
                                  <p className="text-green-100 text-sm">Congratulations! You've successfully solved this problem.</p>
                                </div>
                                <span className="text-3xl">✅</span>
                              </div>
                            </div>
                          )}

                          {/* New Verdict Display for Queue-based Results */}
                          {executionResult.verdict && executionResult.verdict !== "Processing" && (
                            <div className="mt-4 p-4 bg-white border rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <span
                                    className={`text-2xl ${getVerdictColor(
                                      executionResult.verdict
                                    )}`}
                                  >
                                    {getVerdictIcon(executionResult.verdict)}
                                  </span>
                                  <div>
                                    <h4
                                      className={`text-lg font-semibold ${getVerdictColor(
                                        executionResult.verdict
                                      )}`}
                                    >
                                      {executionResult.verdict}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {executionResult.testCasesPassed || 0} of{" "}
                                      {executionResult.totalTestCases || 0} test
                                      cases passed
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right text-sm text-gray-500">
                                  {executionResult.executionTime && (
                                    <p>
                                      Time: {executionResult.executionTime}ms
                                    </p>
                                  )}
                                  {executionResult.memory && (
                                    <p>Memory: {executionResult.memory}KB</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Processing State */}
                          {executionResult.verdict === "Processing" && (
                            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
                                <div>
                                  <h4 className="text-lg font-semibold text-yellow-800">
                                    Processing Submission
                                  </h4>
                                  <p className="text-sm text-yellow-700">
                                    Your code is being evaluated against test cases...
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Verdict Description */}
                          {executionResult.verdict && (
                            <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                              <p className="text-sm text-purple-700">
                                <strong>What this means:</strong>{" "}
                                {getVerdictDescription(executionResult.verdict)}
                              </p>
                            </div>
                          )}

                          {/* Enhanced Error Display */}
                          {executionResult.error && (
                            <div className="mt-4">
                              <h4 className="font-medium text-red-700 mb-2">
                                Error Details:
                              </h4>
                              <div className="bg-white rounded border border-red-100 p-3">
                                {errorMarkers.length > 0 ? (
                                  <div className="space-y-3">
                                    {errorMarkers.map((marker, index) => (
                                      <div
                                        key={index}
                                        className="flex items-start"
                                      >
                                        <div className="flex-shrink-0 mt-1">
                                          <svg
                                            className="h-5 w-5 text-red-500"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        </div>
                                        <div className="ml-3">
                                          <p className="font-medium text-red-700">
                                            Line {marker.startLineNumber}:{" "}
                                            {marker.message}
                                          </p>
                                          <div className="mt-2 text-sm text-gray-600">
                                            <p>
                                              {marker.message.includes(
                                                "expected"
                                              )
                                                ? "You're missing a required character or keyword. Check for missing semicolons, brackets, or keywords."
                                                : marker.message.includes(
                                                    "undeclared"
                                                  )
                                                ? "You're using a variable that hasn't been declared. Make sure to declare all variables before using them."
                                                : marker.message.includes(
                                                    "syntax"
                                                  )
                                                ? "There's a syntax error in your code. Check for proper formatting, missing punctuation, or incorrect keywords."
                                                : "Check line " +
                                                  marker.startLineNumber +
                                                  " for errors."}
                                            </p>
                                            <p className="mt-1 italic">
                                              Tip: Hover over the red marker in
                                              the editor to see the exact error
                                              location.
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <pre className="font-mono text-sm text-red-600 whitespace-pre-wrap overflow-x-auto">
                                    {executionResult.error}
                                  </pre>
                                )}

                                {/* Additional Help for Common Errors */}
                                {executionResult.error && (
                                  <div className="mt-4 pt-3 border-t border-red-100">
                                    <h5 className="font-medium text-gray-700 mb-2">
                                      Common Solutions:
                                    </h5>
                                    <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                                      {executionResult.error.includes(
                                        "expected ';'"
                                      ) && (
                                        <li>
                                          Missing semicolon at the end of a
                                          statement
                                        </li>
                                      )}
                                      {executionResult.error.includes(
                                        "expected '('"
                                      ) && (
                                        <li>
                                          Missing opening parenthesis in
                                          function call or control statement
                                        </li>
                                      )}
                                      {executionResult.error.includes(
                                        "expected ')'"
                                      ) && (
                                        <li>
                                          Missing closing parenthesis in
                                          function call or control statement
                                        </li>
                                      )}
                                      {executionResult.error.includes(
                                        "expected '{'"
                                      ) && (
                                        <li>
                                          Missing opening brace for code block
                                        </li>
                                      )}
                                      {executionResult.error.includes(
                                        "expected '}'"
                                      ) && (
                                        <li>
                                          Missing closing brace for code block
                                        </li>
                                      )}
                                      {executionResult.error.includes(
                                        "not declared"
                                      ) && (
                                        <li>
                                          Using a variable that hasn't been
                                          declared
                                        </li>
                                      )}
                                      <li>
                                        Check for proper indentation and
                                        formatting
                                      </li>
                                      <li>
                                        Ensure all brackets and parentheses are
                                        properly closed
                                      </li>
                                    </ul>
                                  </div>
                                )}

                                {/* Language-specific help */}
                                <div className="mt-4 pt-3 border-t border-red-100">
                                  <h5 className="font-medium text-gray-700 mb-2">
                                    Language-Specific Help:
                                  </h5>
                                  <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                                    {getLanguageHelpTips(selectedLanguage)
                                      .slice(0, 3)
                                      .map((tip, index) => (
                                        <li key={index}>{tip}</li>
                                      ))}
                                    <li className="font-medium">
                                      See the editor panel for more tips
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}

                          {executionResult.output && (
                            <div className="mt-4">
                              <h4 className="font-medium text-gray-900 mb-2">
                                Output:
                              </h4>
                              <pre className="bg-white rounded border p-3 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                                {executionResult.output}
                              </pre>
                            </div>
                          )}

                          {executionResult.results && (
                            <div className="mt-4">
                              <h4 className="font-medium text-gray-900 mb-2">
                                Test Results:
                              </h4>
                              <div className="mb-2">
                                <p className="text-sm text-gray-600">
                                  Passed {executionResult.summary.passed}
                                  of {executionResult.summary.total}
                                  test cases
                                  {executionResult.summary.maxMemory &&
                                    ` • Memory: ${executionResult.summary.maxMemory}KB`}
                                  {executionResult.summary.totalExecutionTime &&
                                    ` • Time: ${executionResult.summary.totalExecutionTime}ms`}
                                </p>
                              </div>
                              <div className="space-y-2">
                                {executionResult.results
                                  .filter((result) => !result.passed)
                                  .map((result, index) => (
                                    <div
                                      key={index}
                                      className="bg-white rounded border border-red-200 p-3"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                        <span className="font-medium">
                                          {result.verdict || "Failed Test Case"}
                                        </span>
                                        {result.verdict && (
                                          <span className="ml-2">
                                            {getVerdictIcon(result.verdict)}
                                          </span>
                                        )}
                                      </div>
                                      {result.verdict && (
                                        <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-700">
                                          {getVerdictDescription(
                                            result.verdict
                                          )}
                                        </div>
                                      )}
                                      {/* Display detailed error information for failed test cases */}
                                      {result.error && (
                                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                                          <p className="font-medium">
                                            Error Details:
                                          </p>
                                          <pre className="mt-1 whitespace-pre-wrap">
                                            {result.actualOutput}
                                          </pre>
                                        </div>
                                      )}
                                      <div className="mt-2 text-sm space-y-2">
                                        <div className="bg-gray-50 p-2 rounded">
                                          <p className="font-medium text-gray-700">
                                            Input:
                                          </p>
                                          <pre className="mt-1 text-gray-600 whitespace-pre-wrap">
                                            {result.input}
                                          </pre>
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded">
                                          <p className="font-medium text-gray-700">
                                            Expected Output:
                                          </p>
                                          <pre className="mt-1 text-gray-600 whitespace-pre-wrap">
                                            {result.expectedOutput}
                                          </pre>
                                        </div>
                                        <div className="bg-red-50 p-2 rounded">
                                          <p className="font-medium text-red-700">
                                            Your Output:
                                          </p>
                                          <pre className="mt-1 text-red-600 whitespace-pre-wrap">
                                            {result.actualOutput}
                                          </pre>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 py-8">
                          No results yet. Run or submit your code to see
                          results.
                        </div>
                      )}
                    </div>
                  ) : (
                    // AI Review Tab
                    <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                      {reviewResult ? (
                        <div className="bg-white rounded-lg shadow-lg">
                          {/* Header with Insert All Button */}
                          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-4 rounded-t-lg">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                              <div>
                                <h3 className="text-xl font-bold text-white">
                                  AI Code Review & Suggestions
                                </h3>
                                <p className="text-purple-100 text-sm mt-1">
                                  Detailed analysis with actionable improvements
                                </p>
                              </div>
                              <button
                                onClick={insertAICodeIntoEditor}
                                className="bg-white text-purple-600 hover:bg-gray-100 font-semibold py-2 px-4 rounded-lg flex items-center transition-all duration-200 transform hover:scale-105 shadow-md"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 mr-2"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Insert All Suggestions
                              </button>
                            </div>
                          </div>

                          <div className="prose prose-sm max-w-none p-4">
                            <div className="markdown-content text-gray-700 overflow-x-auto">
                              <ReactMarkdown
                                components={{
                                  // Custom component for code blocks with insert buttons
                                  code({
                                    inline,
                                    className,
                                    children,
                                    ...props
                                  }) {
                                    const match = /language-(\w+)/.exec(
                                      className || ""
                                    );
                                    const codeContent = String(
                                      children
                                    ).replace(/\n$/, "");

                                    if (!inline && match) {
                                      return (
                                        <div className="relative group my-4">
                                          <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto mt-2 mb-4 border border-gray-700">
                                            <code
                                              className={className}
                                              {...props}
                                            >
                                              {children}
                                            </code>
                                          </pre>
                                          <button
                                            onClick={() =>
                                              insertCodeSnippetIntoEditor(
                                                codeContent
                                              )
                                            }
                                            className="absolute top-2 right-2 bg-purple-600 text-white px-3 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-purple-700 shadow-md"
                                          >
                                            Insert
                                          </button>
                                        </div>
                                      );
                                    }

                                    return (
                                      <code
                                        className={`${
                                          className || ""
                                        } bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded`}
                                        {...props}
                                      >
                                        {children}
                                      </code>
                                    );
                                  },
                                  // Custom styling for headings
                                  h1: ({ ...props }) => (
                                    <h1
                                      className="text-2xl font-bold text-purple-800 border-b-2 border-purple-200 pb-2 mt-6 mb-4"
                                      {...props}
                                    />
                                  ),
                                  h2: ({ ...props }) => (
                                    <h2
                                      className="text-xl font-semibold text-indigo-700 mt-6 mb-3 pb-1 border-b border-indigo-100"
                                      {...props}
                                    />
                                  ),
                                  h3: ({ ...props }) => (
                                    <h3
                                      className="text-lg font-medium text-gray-800 mt-4 mb-2"
                                      {...props}
                                    />
                                  ),
                                  // Custom styling for lists
                                  ul: ({ ...props }) => (
                                    <ul
                                      className="list-disc list-inside space-y-2 text-gray-700 ml-4"
                                      {...props}
                                    />
                                  ),
                                  ol: ({ ...props }) => (
                                    <ol
                                      className="list-decimal list-inside space-y-2 text-gray-700 ml-4"
                                      {...props}
                                    />
                                  ),
                                  // Custom styling for paragraphs
                                  p: ({ ...props }) => (
                                    <p
                                      className="text-gray-700 mb-3 leading-relaxed"
                                      {...props}
                                    />
                                  ),
                                  // Custom styling for blockquotes
                                  blockquote: ({ ...props }) => (
                                    <blockquote
                                      className="border-l-4 border-purple-500 pl-4 italic text-gray-600 bg-purple-50 p-3 rounded-r my-4"
                                      {...props}
                                    />
                                  ),
                                  // Custom styling for tables
                                  table: ({ ...props }) => (
                                    <table
                                      className="min-w-full divide-y divide-gray-200 my-4"
                                      {...props}
                                    />
                                  ),
                                  thead: ({ ...props }) => (
                                    <thead className="bg-gray-50" {...props} />
                                  ),
                                  th: ({ ...props }) => (
                                    <th
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      {...props}
                                    />
                                  ),
                                  td: ({ ...props }) => (
                                    <td
                                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                      {...props}
                                    />
                                  ),
                                }}
                              >
                                {reviewResult
                                  .replace(/\\n/g, "\n")
                                  .replace(/^```/, "")
                                  .replace(/\n```$/, "")
                                  .replace(/\n\n\n+/g, "\n\n")
                                  .trim()}
                              </ReactMarkdown>
                            </div>
                          </div>

                          {/* Additional AI Actions */}
                          <div className="bg-gray-50 p-4 border-t border-gray-200 rounded-b-lg">
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={insertAICodeIntoEditor}
                                className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium py-2 px-4 rounded-lg flex items-center transition-colors shadow-sm"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 mr-2"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Insert All Suggestions
                              </button>
                              <button
                                onClick={handleGetReview}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg flex items-center transition-colors shadow-sm"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 mr-2"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Regenerate Review
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="inline-block p-4 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full mb-4">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-12 w-12 text-purple-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                              />
                            </svg>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            AI Code Review
                          </h3>
                          <p className="text-gray-500 mb-4">
                            Submit your code to get detailed analysis, bug
                            detection, and improvement suggestions from our AI.
                          </p>
                          <button
                            onClick={() => handleSubmitSolution()}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium py-2 px-6 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-md"
                          >
                            Submit for AI Review
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Code Viewing Modal */}
        {isModalOpen && selectedSubmission && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Modal panel */}
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full ">
                {/* Header */}
                <div className="bg-gray-100 px-4 py-3 sm:px-6 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    Submission Code -{" "}
                    {selectedSubmission.language.toUpperCase()}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Code content */}
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="w-full">
                    <div className="h-[calc(100vh-300px)]">
                      <CodeEditor
                        value={selectedSubmission.code}
                        language={selectedSubmission.language}
                        height="100%"
                        theme={editorTheme}
                        readOnly={true}
                        className="h-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-100 px-4 py-3 sm:px-6 flex flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:text-sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add login prompt */}
        {!isAuthenticated && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Please{" "}
                  <Link to="/login" className="font-medium underline">
                    login
                  </Link>{" "}
                  to run and submit code.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Debug Panel */}
        {debugLogs.length > 0 && (
          <div className="fixed bottom-4 right-4 w-96 max-h-64 bg-gray-900 text-green-400 rounded-lg shadow-lg overflow-hidden z-50">
            <div className="bg-gray-800 px-3 py-2 flex justify-between items-center">
              <span className="text-sm font-medium">Debug Logs</span>
              <button
                onClick={() => setDebugLogs([])}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Clear
              </button>
            </div>
            <div className="p-3 overflow-y-auto max-h-48 text-xs font-mono">
              {debugLogs.map((log) => (
                <div
                  key={log.id}
                  className="mb-2 border-b border-gray-700 pb-1"
                >
                  <div className="text-yellow-400">
                    [{log.timestamp}] {log.message}
                  </div>
                  {log.data && (
                    <div className="text-gray-300 mt-1 pl-2">{log.data}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <AuthDebugger />
    </Layout>
  );
};

export default Problem;
