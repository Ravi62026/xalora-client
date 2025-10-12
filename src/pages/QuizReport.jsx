import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import {
  ArrowLeft,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  BookOpen,
  TrendingUp,
  AlertCircle,
  Award,
  Lightbulb,
  Medal
} from "lucide-react";
import axiosInstance from "../utils/axios";
import { useApiCall } from "../hooks";

const QuizReport = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExplanations, setShowExplanations] = useState(false);
  const { execute } = useApiCall();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchReport();
  }, [isAuthenticated, navigate, submissionId]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await execute(async () => {
        const res = await axiosInstance.get(
          `/api/v1/quizzes/report/${submissionId}`
        );
        return res.data;
      });
      setReport(response.data);
    } catch (error) {
      console.error("Error fetching report:", error);
      navigate("/quiz/analytics");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/quizzes/report/${submissionId}/pdf`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${report.quiz.title}_Report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    }
  };

  // New function to handle certificate download
  const handleDownloadCertificate = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/quizzes/certificate/${submissionId}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${report.quiz.title}_Certificate.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading certificate:", error);
      // Check if it's a 400 error (certificate only available for passed quizzes)
      if (error.response?.status === 400) {
        alert('Certificate is only available for passed quizzes (60% or higher).');
      } else {
        alert("Failed to download certificate. Please try again.");
      }
    }
  };

  const getAnswerIcon = (isCorrect, userAnswer) => {
    if (userAnswer === -1) {
      return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
    return isCorrect ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  const getAnswerColor = (isCorrect, userAnswer) => {
    if (userAnswer === -1) return "border-gray-300 bg-gray-50";
    return isCorrect
      ? "border-green-300 bg-green-50"
      : "border-red-300 bg-red-50";
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen bg-transparent flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Please Login
            </h2>
            <p className="text-gray-300">
              You need to be logged in to view quiz reports.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-transparent flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading quiz report...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!report) {
    return (
      <Layout>
        <div className="min-h-screen bg-transparent flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Report Not Found
            </h2>
            <p className="text-gray-300 mb-6">
              The quiz report you're looking for doesn't exist.
            </p>
            <button
              onClick={() => navigate("/quiz/analytics")}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Quiz Analytics
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const { quiz, performance, questionAnalysis, summary } = report;

  return (
    <Layout>
      <div className="min-h-screen bg-transparent py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/quiz/analytics")}
                className="mr-4 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                title="Back to Quiz Analytics"
              >
                <ArrowLeft className="h-5 w-5 text-gray-300" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {quiz.title} - Report
                </h1>
                <p className="text-gray-300">
                  {quiz.topic} •{" "}
                  {new Date(performance.submittedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
              {/* Certificate download button - only show for passed quizzes */}
              {performance.passed && (
                <button
                  onClick={handleDownloadCertificate}
                  className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  <Medal className="h-4 w-4 mr-2" />
                  Download Certificate
                </button>
              )}
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-md p-6 mb-8 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Performance Summary
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div
                  className={`text-3xl font-bold mb-2 ${
                    performance.passed ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {performance.score}%
                </div>
                <p className="text-sm text-gray-300">Final Score</p>
                {performance.passed && (
                  <div className="flex items-center justify-center mt-2">
                    <Award className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-xs text-yellow-400">
                      +10 JBP Coins (after sharing on LinkedIn)
                    </span>
                  </div>
                )}
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {performance.correctAnswers}/{performance.totalQuestions}
                </div>
                <p className="text-sm text-gray-300">Correct Answers</p>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {formatTime(performance.timeTaken)}
                </div>
                <p className="text-sm text-gray-300">Time Taken</p>
              </div>

              <div className="text-center">
                <div
                  className={`text-3xl font-bold mb-2 ${
                    performance.passed ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {performance.passed ? "PASSED" : "FAILED"}
                </div>
                <p className="text-sm text-gray-300">Status</p>
                <p className="text-xs text-gray-400 mt-1">Required: 60%</p>
              </div>
            </div>
          </div>

          {/* Summary Insights */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-md p-6 mb-8 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Performance Insights
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-green-300 mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Strengths
                </h3>
                <div className="space-y-1">
                  {[...new Set(summary.strengths)]
                    .slice(0, 3)
                    .map((strength, index) => (
                      <span
                        key={index}
                        className="inline-block bg-green-800/50 text-green-200 text-xs px-2 py-1 rounded-full mr-1 mb-1"
                      >
                        {strength}
                      </span>
                    ))}
                </div>
              </div>

              <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-red-300 mb-2 flex items-center">
                  <XCircle className="h-4 w-4 mr-2" />
                  Areas to Improve
                </h3>
                <div className="space-y-1">
                  {[...new Set(summary.weaknesses)]
                    .slice(0, 3)
                    .map((weakness, index) => (
                      <span
                        key={index}
                        className="inline-block bg-red-800/50 text-red-200 text-xs px-2 py-1 rounded-full mr-1 mb-1"
                      >
                        {weakness}
                      </span>
                    ))}
                </div>
              </div>

              <div className="bg-gray-700/50 border border-gray-600/50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-200 mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Statistics
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Unanswered:</span>
                    <span className="font-medium text-white">{summary.unanswered}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Accuracy:</span>
                    <span className="font-medium text-white">
                      {Math.round(
                        (performance.correctAnswers /
                          performance.totalQuestions) *
                          100
                      )}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Question Analysis */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-md p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Question-wise Analysis
              </h2>
              <button
                onClick={() => setShowExplanations(!showExplanations)}
                className="flex items-center px-3 py-2 text-sm bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                {showExplanations ? "Hide" : "Show"} Explanations
              </button>
            </div>

            <div className="space-y-6">
              {questionAnalysis.map((question, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-6 ${getAnswerColor(
                    question.isCorrect,
                    question.userAnswer
                  )}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        {getAnswerIcon(question.isCorrect, question.userAnswer)}
                        <span className="ml-2 font-semibold text-white">
                          Question {question.questionNumber}
                        </span>
                        <span className="ml-2 text-xs bg-gray-700 text-gray-200 px-2 py-1 rounded-full">
                          {question.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-200 mb-4">
                        {question.questionText}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-300 mb-2">
                        Your Answer:
                      </p>
                      <p
                        className={`text-sm p-2 rounded ${
                          question.userAnswer === -1
                            ? "bg-gray-700 text-gray-400 italic"
                            : question.isCorrect
                            ? "bg-green-900/50 text-green-200"
                            : "bg-red-900/50 text-red-200"
                        }`}
                      >
                        {question.userAnswerText}
                      </p>
                    </div>

                    {!question.isCorrect && (
                      <div>
                        <p className="text-sm font-medium text-gray-300 mb-2">
                          Correct Answer:
                        </p>
                        <p className="text-sm p-2 rounded bg-green-900/50 text-green-200">
                          {question.correctAnswerText}
                        </p>
                      </div>
                    )}
                  </div>

                  {showExplanations && question.explanation && (
                    <div className="mt-4 p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Lightbulb className="h-4 w-4 text-blue-300 mr-2" />
                        <span className="font-medium text-blue-200">
                          Explanation
                        </span>
                      </div>
                      <p className="text-blue-100 text-sm">
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => navigate("/quiz/analytics")}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Quiz Analytics
            </button>
            <button
              onClick={() => navigate("/quiz")}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Take Another Quiz
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuizReport;