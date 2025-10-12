import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { useApiCall } from "../hooks";
import axiosInstance from "../utils/axios";
import ApiRoutes from "../routes/routes";

// Import tab components
import AnalysisTab from "../components/ResumeAI/AnalysisTab";
import QATab from "../components/ResumeAI/QATab";
import InterviewTab from "../components/ResumeAI/InterviewTab";
import ImprovementsTab from "../components/ResumeAI/ImprovementsTab";
import ImprovedResumeTab from "../components/ResumeAI/ImprovedResumeTab";
import CreateResumeTab from "../components/ResumeAI/CreateResumeTab";

const ResumeAI = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { sessionId: urlSessionId } = useParams();
  const { execute } = useApiCall();

  // Main state
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [customJD, setCustomJD] = useState("");
  const [evaluationMethod, setEvaluationMethod] = useState("role");
  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [sessionRestored, setSessionRestored] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState("analysis");

  // Loading states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(false);

  // Debug function to track tab changes (memoized to prevent re-renders)
  const handleTabChange = useCallback((newTab) => {
    console.log(`🔄 Tab changing from "${activeTab}" to "${newTab}"`);
    setActiveTab(newTab);
  }, [activeTab]);

  // Fetch roles on mount
  useEffect(() => {
    fetchRoles();
    if (isAuthenticated) {
      fetchHistory();
    }
  }, [isAuthenticated]);

  // Load analysis if URL has sessionId
  useEffect(() => {
    if (urlSessionId && isAuthenticated && !currentSession) {
      loadPreviousAnalysis(urlSessionId);
    }
  }, [urlSessionId, isAuthenticated, currentSession]);

  // Auto-redirect after analysis completion
  useEffect(() => {
    if (analysisResult && analysisResult.sessionId && !currentSession) {
      // Only redirect if we're not already on the correct session page
      const currentPath = window.location.pathname;
      const expectedPath = `/resume-ai/${analysisResult.sessionId}`;

      if (currentPath !== expectedPath) {
        console.log("🔄 Auto-redirecting to analysis results:", expectedPath);
        navigate(expectedPath, { replace: true });
      }
    }
  }, [analysisResult, currentSession, navigate]);

  // Debug effect to monitor state changes
  useEffect(() => {
    console.log("🔍 State updated:", {
      currentSession,
      analysisResult: analysisResult ? "HAS_DATA" : "NO_DATA",
      isAnalyzing,
      isLoadingSession,
      activeTab
    });
  }, [currentSession, analysisResult, isAnalyzing, isLoadingSession, activeTab]);

  const fetchRoles = async () => {
    try {
      const response = await execute(async () => {
        const res = await axiosInstance.get(ApiRoutes.resumeAI.getRoles);
        return res.data;
      });
      setRoles(response.data.roles || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await execute(async () => {
        const res = await axiosInstance.get(ApiRoutes.resumeAI.getHistory);
        return res.data;
      });
      setHistory(response.data.analyses || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "resume") {
      setResumeFile(file);
    } else if (type === "jd") {
      setJdFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeFile) {
      alert("Please select a resume file");
      return;
    }

    if (evaluationMethod === "role" && !selectedRole) {
      alert("Please select a role");
      return;
    }

    if (evaluationMethod === "custom_jd" && !customJD.trim()) {
      alert("Please enter job description text");
      return;
    }

    if (evaluationMethod === "jd_file" && !jdFile) {
      alert("Please select a job description file");
      return;
    }

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("resumeFile", resumeFile);

      if (evaluationMethod === "role") {
        formData.append("roleName", selectedRole);
      } else if (evaluationMethod === "custom_jd") {
        formData.append("jdText", customJD);
      } else if (evaluationMethod === "jd_file") {
        formData.append("jdFile", jdFile);
      }

      const response = await execute(async () => {
        const res = await axiosInstance.post(
          ApiRoutes.resumeAI.analyze,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            timeout: 180000, // 3 minute timeout for resume analysis
          }
        );
        return res.data;
      });

      const sessionId = response.data.sessionId || response.data.session_id;
      const analysisData = response.data;

      console.log("📨 Received response for session:", sessionId);
      console.log("📊 Response data:", analysisData);

      // Check if analysis is actually complete or still in progress
      const hasAnalysisResults = analysisData.overall_score !== undefined ||
                                analysisData.overallScore !== undefined ||
                                (analysisData.skill_scores && Object.keys(analysisData.skill_scores).length > 0) ||
                                (analysisData.strengths && analysisData.strengths.length > 0);

      console.log("🔍 Initial response check:", {
        hasAnalysisResults,
        responseKeys: Object.keys(analysisData),
        overall_score: analysisData.overall_score,
        skill_scores: analysisData.skill_scores,
        strengths: analysisData.strengths
      });

      if (hasAnalysisResults) {
        // Analysis is complete, process the results
        console.log("✅ Analysis complete, processing results");

        // Immediately navigate to the session URL
        console.log("🔄 Navigating to session URL:", `/resume-ai/${sessionId}`);
        navigate(`/resume-ai/${sessionId}`, { replace: true });

        // Ensure the response structure matches what the UI expects
        const formattedAnalysisData = {
          sessionId: sessionId,
          overallScore: analysisData.overall_score || analysisData.overallScore || 0,
          selected: analysisData.selected || false,
          reasoning: analysisData.reasoning || "",
          strengths: analysisData.strengths || [],
          missingSkills: analysisData.missing_skills || [],
          skillScores: analysisData.skill_scores || {},
          detailedWeaknesses: analysisData.detailed_weaknesses || [],
          resumeText: analysisData.resume_text || ""
        };

        console.log("📋 Formatted analysis data:", formattedAnalysisData);
        setAnalysisResult(formattedAnalysisData);
        setCurrentSession(sessionId);
        handleTabChange("analysis");

        // Restore AI session for interactive features (Q&A, Improvements, etc.)
        console.log("🔄 Restoring AI session for interactive features...");
        try {
          await axiosInstance.post(
            ApiRoutes.resumeAI.restoreSession(sessionId)
          );
          setSessionRestored(true);
          console.log("✅ AI session restored successfully");
        } catch (restoreError) {
          console.warn("⚠️ Could not restore AI session:", restoreError.message);
          setSessionRestored(false);
        }

        // Show results
        setTimeout(() => {
          console.log("🚀 Analysis complete, showing results for session:", sessionId);
          setIsAnalyzing(false);
        }, 300);

      } else {
        // Analysis is still in progress, poll for results
        console.log("⏳ Analysis still in progress, polling for results...");

        // Immediately navigate to the session URL
        console.log("🔄 Navigating to session URL:", `/resume-ai/${sessionId}`);
        navigate(`/resume-ai/${sessionId}`, { replace: true });

        // Start polling after a short delay with timeout
        let pollCount = 0;
        const maxPolls = 720; // Max 1 hour (720 * 5 seconds)

        const checkForResults = async () => {
          pollCount++;

          if (pollCount > maxPolls) {
            console.error("❌ Analysis polling timeout after 1 hour");
            setIsAnalyzing(false);

            // Show a more helpful error message with options
            const userChoice = window.confirm(
              "Analysis is taking longer than expected (1+ hour). " +
              "This might be due to:\n\n" +
              "• Very complex resume content\n" +
              "• Server overload\n" +
              "• Network connectivity issues\n\n" +
              "Would you like to:\n" +
              "• Click OK to wait even longer\n" +
              "• Click Cancel to go back to the form"
            );

            if (userChoice) {
              // Reset polling counter and continue
              pollCount = 0;
              setTimeout(checkForResults, 5000); // Continue with 5 second intervals
            } else {
              // Go back to form
              return;
            }
            return;
          }

          try {
            const pollResponse = await axiosInstance.get(
              ApiRoutes.resumeAI.getAnalysis(sessionId),
              {
                timeout: 60000 // 60 second timeout per request
              }
            );

            const pollData = pollResponse.data;

            // Check if analysis is complete by looking for any of these fields
            const hasOverallScore = pollData.analysisResult?.overall_score !== undefined;
            const hasSkillScores = pollData.analysisResult?.skill_scores &&
                                   (Object.keys(pollData.analysisResult.skill_scores).length > 0 ||
                                    Array.isArray(pollData.analysisResult.skill_scores));
            const hasStrengths = pollData.analysisResult?.strengths &&
                                Array.isArray(pollData.analysisResult.strengths) &&
                                pollData.analysisResult.strengths.length > 0;

            console.log(`🔍 Polling check (${pollCount}/${maxPolls}):`, {
              hasOverallScore,
              hasSkillScores,
              hasStrengths,
              analysisResult: pollData.analysisResult ? "EXISTS" : "MISSING"
            });

            if (hasOverallScore || hasSkillScores || hasStrengths) {
              console.log("✅ Polling found complete analysis!");

              const formattedAnalysisData = {
                sessionId: sessionId,
                overallScore: pollData.analysisResult?.overall_score || 0,
                selected: pollData.analysisResult?.selected || false,
                reasoning: pollData.analysisResult?.reasoning || "",
                strengths: pollData.analysisResult?.strengths || [],
                missingSkills: pollData.analysisResult?.missing_skills || [],
                skillScores: pollData.analysisResult?.skill_scores || {},
                detailedWeaknesses: pollData.analysisResult?.detailed_weaknesses || [],
                resumeText: pollData.analysisResult?.resume_text || ""
              };

              console.log("📋 Formatted analysis data:", formattedAnalysisData);
              setAnalysisResult(formattedAnalysisData);
              setCurrentSession(sessionId);
              handleTabChange("analysis");

              // Restore AI session for interactive features (Q&A, Improvements, etc.)
              console.log("🔄 Restoring AI session for interactive features...");
              try {
                await axiosInstance.post(
                  ApiRoutes.resumeAI.restoreSession(sessionId)
                );
                setSessionRestored(true);
                console.log("✅ AI session restored successfully");
              } catch (restoreError) {
                console.warn("⚠️ Could not restore AI session:", restoreError.message);
                setSessionRestored(false);
              }
      
              setTimeout(() => {
                console.log("🚀 Polling complete, showing results");
                setIsAnalyzing(false);
              }, 300);

            } else {
              // Still no results, keep polling
              console.log(`⏳ Still no results, polling again in 5 seconds... (${pollCount}/${maxPolls})`);
              setTimeout(checkForResults, 5000);
            }

          } catch (pollError) {
            console.error("❌ Error polling for results:", pollError);
            if (pollCount < maxPolls) {
              console.log("🔄 Retrying poll in 5 seconds...");
              setTimeout(checkForResults, 5000);
            } else {
              setIsAnalyzing(false);
              alert("Error retrieving analysis results. Please try again.");
            }
          }
        };

        // Start polling immediately (after 2 seconds)
        setTimeout(checkForResults, 2000);
      }
      
      fetchHistory();
    } catch (error) {
      console.error("Error analyzing resume:", error);
      setIsAnalyzing(false);
    }
  };

  const loadPreviousAnalysis = async (sessionId) => {
    try {
      setIsLoadingSession(true);
      setSessionRestored(false);
      navigate(`/resume-ai/${sessionId}`);

      console.log("🚀 Loading analysis for session:", sessionId);

      // Make both API calls in parallel to reduce loading time
      const [analysisResponse, restoreResponse] = await Promise.allSettled([
        execute(async () => {
          const res = await axiosInstance.get(
            ApiRoutes.resumeAI.getAnalysis(sessionId)
          );
          return res.data;
        }),
        axiosInstance.post(ApiRoutes.resumeAI.restoreSession(sessionId))
      ]);

      // Handle analysis response
      if (analysisResponse.status === 'fulfilled') {
        const analysis = analysisResponse.value.data;
        
        setAnalysisResult({
          sessionId: analysis.sessionId,
          overallScore: analysis.analysisResult?.overallScore,
          selected: analysis.analysisResult?.selected,
          reasoning: analysis.analysisResult?.reasoning,
          strengths: analysis.analysisResult?.strengths || [],
          missingSkills: analysis.analysisResult?.missingSkills || [],
          skillScores: analysis.analysisResult?.skillScores || {},
          detailedWeaknesses: analysis.analysisResult?.detailedWeaknesses || [],
        });
        setCurrentSession(sessionId);
        handleTabChange("analysis");
        console.log("✅ Analysis loaded successfully, sessionId:", sessionId);
      } else {
        console.error("❌ Failed to load analysis:", analysisResponse.reason);
      }

      // Handle restore response
      if (restoreResponse.status === 'fulfilled') {
        const hasActualText = restoreResponse.value.data?.data?.hasActualResumeText;
        setSessionRestored(hasActualText);
        console.log("✅ Session restore:", hasActualText ? "Success" : "Limited functionality");
      } else {
        console.warn("⚠️ Could not restore AI session:", restoreResponse.reason?.message);
        setSessionRestored(false);
      }

      setShowHistory(false);
    } catch (error) {
      console.error("Error loading analysis:", error);
    } finally {
      setIsLoadingSession(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">
              Please Login
            </h2>
            <p className="text-white/80 mb-6">
              You need to be logged in to use the Resume AI feature.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg"
            >
              Go to Login
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">Resume AI</h1>
                <p className="mt-2 text-white/70">
                  Get AI-powered analysis and improvements for your resume
                </p>
              </div>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors duration-300 border border-white/20 flex items-center"
              >
                {showHistory ? "Hide History" : "Show History"}
              </button>
            </div>
          </div>

          {/* Analysis Form */}
          {!currentSession && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-6">Analyze Your Resume</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Resume File
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/30 rounded-lg cursor-pointer bg-gray-900/50 hover:bg-gray-900/70 transition-colors duration-300">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-white/70"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-white/70">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-white/50">PDF, DOC, DOCX (MAX. 10MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "resume")}
                        accept=".pdf,.doc,.docx"
                      />
                    </label>
                  </div>
                  {resumeFile && (
                    <p className="mt-2 text-sm text-emerald-400">
                      Selected: {resumeFile.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Evaluation Method
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="role-method"
                        name="evaluation-method"
                        type="radio"
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-700 bg-gray-900"
                        checked={evaluationMethod === "role"}
                        onChange={() => setEvaluationMethod("role")}
                      />
                      <label
                        htmlFor="role-method"
                        className="ml-3 block text-sm font-medium text-white/90"
                      >
                        By Role
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="custom-jd-method"
                        name="evaluation-method"
                        type="radio"
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-700 bg-gray-900"
                        checked={evaluationMethod === "custom_jd"}
                        onChange={() => setEvaluationMethod("custom_jd")}
                      />
                      <label
                        htmlFor="custom-jd-method"
                        className="ml-3 block text-sm font-medium text-white/90"
                      >
                        Custom Job Description
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="jd-file-method"
                        name="evaluation-method"
                        type="radio"
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-700 bg-gray-900"
                        checked={evaluationMethod === "jd_file"}
                        onChange={() => setEvaluationMethod("jd_file")}
                      />
                      <label
                        htmlFor="jd-file-method"
                        className="ml-3 block text-sm font-medium text-white/90"
                      >
                        Job Description File
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {evaluationMethod === "role" && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Select Role
                  </label>
                  <select
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white transition-all duration-300"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="" className="bg-gray-900">Select a role</option>
                    {roles.map((role) => (
                      <option key={role} value={role} className="bg-gray-900">
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {evaluationMethod === "custom_jd" && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Job Description
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-500 transition-all duration-300"
                    placeholder="Paste the job description here..."
                    value={customJD}
                    onChange={(e) => setCustomJD(e.target.value)}
                  />
                </div>
              )}

              {evaluationMethod === "jd_file" && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Job Description File
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/30 rounded-lg cursor-pointer bg-gray-900/50 hover:bg-gray-900/70 transition-colors duration-300">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-white/70"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-white/70">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-white/50">PDF, DOC, DOCX (MAX. 10MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "jd")}
                        accept=".pdf,.doc,.docx"
                      />
                    </label>
                  </div>
                  {jdFile && (
                    <p className="mt-2 text-sm text-emerald-400">
                      Selected: {jdFile.name}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-8">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !resumeFile || (evaluationMethod === "role" && !selectedRole) || (evaluationMethod === "custom_jd" && !customJD.trim()) || (evaluationMethod === "jd_file" && !jdFile)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </div>
                  ) : (
                    "Analyze Resume"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Analysis Loading Indicator */}
          {isAnalyzing && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 p-8 mb-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-white mb-2">AI Analysis in Progress</h3>
                <p className="text-white/70">Our AI is analyzing your resume against the selected role requirements. This may take up to 1 hour for complex analyses...</p>
                <p className="text-sm text-emerald-400 mt-2">Please don't close this page. Results will appear automatically when ready.</p>
                <div className="mt-4 bg-white/5 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full animate-pulse" style={{width: '60%'}}></div>
                </div>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoadingSession && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 p-8 mb-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-white mb-2">Loading Resume Analysis</h3>
                <p className="text-white/70">Please wait while we load your analysis data...</p>
                <div className="mt-4 bg-white/5 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full animate-pulse" style={{width: '60%'}}></div>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          {currentSession && !isLoadingSession && !isAnalyzing && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 overflow-hidden">
              <div className="border-b border-white/10">
                <nav className="flex overflow-x-auto">
                  <button
                    onClick={() => handleTabChange("analysis")}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-300 whitespace-nowrap ${
                      activeTab === "analysis"
                        ? "border-emerald-500 text-emerald-400 bg-emerald-900/20"
                        : "border-transparent text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Analysis
                  </button>
                  <button
                    onClick={() => handleTabChange("qa")}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-300 whitespace-nowrap ${
                      activeTab === "qa"
                        ? "border-emerald-500 text-emerald-400 bg-emerald-900/20"
                        : "border-transparent text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Q&A
                  </button>
                  <button
                    onClick={() => handleTabChange("interview")}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-300 whitespace-nowrap ${
                      activeTab === "interview"
                        ? "border-emerald-500 text-emerald-400 bg-emerald-900/20"
                        : "border-transparent text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Interview Prep
                  </button>
                  <button
                    onClick={() => handleTabChange("improvements")}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-300 whitespace-nowrap ${
                      activeTab === "improvements"
                        ? "border-emerald-500 text-emerald-400 bg-emerald-900/20"
                        : "border-transparent text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Improvements
                  </button>
                  <button
                    onClick={() => handleTabChange("improved")}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-300 whitespace-nowrap ${
                      activeTab === "improved"
                        ? "border-emerald-500 text-emerald-400 bg-emerald-900/20"
                        : "border-transparent text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Improved Resume
                  </button>
                  <button
                    onClick={() => handleTabChange("create")}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-300 whitespace-nowrap ${
                      activeTab === "create"
                        ? "border-emerald-500 text-emerald-400 bg-emerald-900/20"
                        : "border-transparent text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Create Resume
                  </button>
                </nav>
              </div>
              <div className="p-6">
                {activeTab === "analysis" && (
                  <AnalysisTab
                    analysisResult={analysisResult}
                    currentSession={currentSession}
                    onTabChange={handleTabChange}
                  />
                )}
                {activeTab === "qa" && (
                  <QATab
                    currentSession={currentSession}
                    sessionRestored={sessionRestored}
                  />
                )}
                {activeTab === "interview" && (
                  <InterviewTab
                    currentSession={currentSession}
                    sessionRestored={sessionRestored}
                  />
                )}
                {activeTab === "improvements" && (
                  <ImprovementsTab
                    currentSession={currentSession}
                    selectedRole={selectedRole}
                    onTabChange={handleTabChange}
                    isActive={activeTab === "improvements"}
                  />
                )}
                {activeTab === "improved" && (
                  <ImprovedResumeTab
                    currentSession={currentSession}
                    roles={roles}
                    sessionRestored={sessionRestored}
                    isActive={activeTab === "improved"}
                  />
                )}
                {activeTab === "create" && (
                  <CreateResumeTab
                    currentSession={currentSession}
                    sessionRestored={sessionRestored}
                  />
                )}
              </div>
            </div>
          )}

          {/* History Panel */}
          {showHistory && (
            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">Analysis History</h2>
              {history.length === 0 ? (
                <p className="text-white/70">No analysis history found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {history.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-emerald-400/30 transition-all duration-300 cursor-pointer"
                      onClick={() => loadPreviousAnalysis(item.sessionId)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-white">{item.roleName || "Custom JD"}</h3>
                          <p className="text-sm text-white/70 mt-1">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-emerald-400 font-semibold">
                          {item.analysisResult?.overallScore || "N/A"}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ResumeAI;