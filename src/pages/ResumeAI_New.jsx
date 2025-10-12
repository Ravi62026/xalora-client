import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { useApiCall } from "../hooks";
import axiosInstance from "../utils/axios";
import ApiRoutes from "../routes/routes";

const ResumeAI = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { sessionId: urlSessionId } = useParams();
  const { loading, error, execute } = useApiCall();

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
  const [activeTab, setActiveTab] = useState("analysis"); // analysis, qa, interview, improvements, improved-resume

  // Q&A state
  const [question, setQuestion] = useState("");
  const [qaHistory, setQaHistory] = useState([]);
  const [qaLoading, setQaLoading] = useState(false);

  // Interview Questions state
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [questionCategories, setQuestionCategories] = useState({
    Experience: true,
    Technical: true,
    Behavioral: true,
    Coding: true,
    Project: true,
  });
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("medium");
  const [interviewLoading, setInterviewLoading] = useState(false);

  // Improvements state
  const [improvements, setImprovements] = useState({});
  const [improvementsLoading, setImprovementsLoading] = useState(false);

  // Improved Resume state
  const [improvedResume, setImprovedResume] = useState("");
  const [improveMethod, setImproveMethod] = useState("role"); // role, custom_jd, jd_file
  const [improveRole, setImproveRole] = useState("");
  const [improveJD, setImproveJD] = useState("");
  const [improveJDFile, setImproveJDFile] = useState(null);
  const [improvedResumeLoading, setImprovedResumeLoading] = useState(false);

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
    if (analysisResult && analysisResult.sessionId && !urlSessionId) {
      navigate(`/resume-ai/${analysisResult.sessionId}`, { replace: true });
    }
  }, [analysisResult, urlSessionId, navigate]);

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
    } else if (type === "improve-jd") {
      setImproveJDFile(file);
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
            // Don't set Content-Type for FormData - let browser set it with boundary
          }
        );
        return res.data;
      });

      setAnalysisResult(response.data);
      setCurrentSession(response.data.sessionId);
      setSessionRestored(true);
      
      // Redirect to the session URL
      navigate(`/resume-ai/${response.data.sessionId}`);
      
      fetchHistory();
    } catch (error) {
      console.error("Error analyzing resume:", error);
    }
  };

  const loadPreviousAnalysis = async (sessionId) => {
    try {
      setSessionRestored(false);
      navigate(`/resume-ai/${sessionId}`);

      const response = await execute(async () => {
        const res = await axiosInstance.get(
          ApiRoutes.resumeAI.getAnalysis(sessionId)
        );
        return res.data;
      });

      const analysis = response.data;

      // Restore AI session
      try {
        const restoreResponse = await axiosInstance.post(
          ApiRoutes.resumeAI.restoreSession(sessionId)
        );

        const hasActualText = restoreResponse.data?.data?.hasActualResumeText;

        if (hasActualText) {
          setSessionRestored(true);
        } else {
          setSessionRestored(false);
        }
      } catch (restoreError) {
        setSessionRestored(false);
      }

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
      setShowHistory(false);
    } catch (error) {
      console.error("Error loading analysis:", error);
    }
  };

  // Q&A Functions
  const handleAskQuestion = async () => {
    if (!question.trim()) {
      alert("Please enter a question");
      return;
    }

    setQaLoading(true);
    try {
      const response = await execute(async () => {
        const res = await axiosInstance.post(
          ApiRoutes.resumeAI.askQuestion(currentSession),
          {
            question: question.trim(),
          }
        );
        return res.data;
      });

      setQaHistory([
        ...qaHistory,
        { question: question.trim(), answer: response.data.answer },
      ]);
      setQuestion("");
    } catch (error) {
      console.error("Error asking question:", error);
      alert(
        "Failed to get answer. Please try loading this analysis again from history."
      );
    } finally {
      setQaLoading(false);
    }
  };

  // Interview Questions Functions
  const handleGenerateInterviewQuestions = async () => {
    const selectedCategories = Object.keys(questionCategories).filter(
      (cat) => questionCategories[cat]
    );

    if (selectedCategories.length === 0) {
      alert("Please select at least one question category");
      return;
    }

    setInterviewLoading(true);
    try {
      const response = await execute(async () => {
        const res = await axiosInstance.post(
          ApiRoutes.resumeAI.generateInterviewQuestions(currentSession),
          {
            questionTypes: selectedCategories,
            difficulty,
            numQuestions: parseInt(numQuestions),
          }
        );
        return res.data;
      });

      setInterviewQuestions(response.data.questions || []);
    } catch (error) {
      console.error("Error generating interview questions:", error);
      alert(
        "Failed to generate questions. Please try loading this analysis again from history."
      );
    } finally {
      setInterviewLoading(false);
    }
  };

  // Improvements Functions
  const handleGetImprovements = async () => {
    setImprovementsLoading(true);
    try {
      const response = await execute(async () => {
        const res = await axiosInstance.post(
          ApiRoutes.resumeAI.improveResume(currentSession),
          {
            improvementAreas: [
              "Skills Highlighting",
              "Experience Enhancement",
              "Format Optimization",
              "Achievement Quantification",
              "ATS Optimization",
            ],
            targetRole: selectedRole || "",
          }
        );
        return res.data;
      });

      setImprovements(response.data.improvements || {});
    } catch (error) {
      console.error("Error getting improvements:", error);
      alert(
        "Failed to get improvements. Please try loading this analysis again from history."
      );
    } finally {
      setImprovementsLoading(false);
    }
  };

  // Improved Resume Functions
  const handleGenerateImprovedResume = async () => {
    if (improveMethod === "role" && !improveRole) {
      alert("Please select a target role");
      return;
    }

    if (improveMethod === "custom_jd" && !improveJD.trim()) {
      alert("Please enter job description text");
      return;
    }

    if (improveMethod === "jd_file" && !improveJDFile) {
      alert("Please select a job description file");
      return;
    }

    setImprovedResumeLoading(true);
    try {
      let highlightSkills = "";

      if (improveMethod === "role") {
        highlightSkills = improveRole;
      } else if (improveMethod === "custom_jd") {
        highlightSkills = improveJD;
      } else if (improveMethod === "jd_file") {
        // Read file content
        const fileContent = await improveJDFile.text();
        highlightSkills = fileContent;
      }

      const response = await execute(async () => {
        const res = await axiosInstance.post(
          ApiRoutes.resumeAI.getImprovedResume(currentSession),
          {
            targetRole: improveRole || "",
            highlightSkills,
          }
        );
        return res.data;
      });

      setImprovedResume(response.data.improvedResume || "");
    } catch (error) {
      console.error("Error generating improved resume:", error);
      alert(
        "Failed to generate improved resume. Please try loading this analysis again from history."
      );
    } finally {
      setImprovedResumeLoading(false);
    }
  };

  const handleSaveImprovedResume = () => {
    const blob = new Blob([improvedResume], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `improved_resume_${currentSession}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Please Login
            </h2>
            <p className="text-gray-600">
              You need to be logged in to use Resume AI.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
            >
              Login Now
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🤖 Resume AI Assistant
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI-powered resume analysis, Q&A, interview prep, and resume
              improvement
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Panel - Upload & Analysis */}
            <div className="lg:col-span-3">
              {/* Tab Navigation */}
              {analysisResult && (
                <div className="bg-white rounded-2xl shadow-xl mb-6 border border-slate-200">
                  <div className="flex border-b border-gray-200 overflow-x-auto">
                    <button
                      onClick={() => setActiveTab("analysis")}
                      className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                        activeTab === "analysis"
                          ? "border-b-2 border-purple-600 text-purple-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      📊 Analysis Results
                    </button>
                    <button
                      onClick={() => setActiveTab("qa")}
                      className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                        activeTab === "qa"
                          ? "border-b-2 border-purple-600 text-purple-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      💬 Q&A
                    </button>
                    <button
                      onClick={() => setActiveTab("interview")}
                      className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                        activeTab === "interview"
                          ? "border-b-2 border-purple-600 text-purple-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      🎤 Interview Questions
                    </button>
                    <button
                      onClick={() => setActiveTab("improvements")}
                      className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                        activeTab === "improvements"
                          ? "border-b-2 border-purple-600 text-purple-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      ✨ Improvements
                    </button>
                    <button
                      onClick={() => setActiveTab("improved-resume")}
                      className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                        activeTab === "improved-resume"
                          ? "border-b-2 border-purple-600 text-purple-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      📄 Improved Resume
                    </button>
                  </div>
                </div>
              )}

              {/* Upload Section - Show when no analysis */}
              {!analysisResult && (
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    📄 Analyze Your Resume
                  </h2>

                  {/* Resume Upload */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Resume (PDF, DOC, DOCX, TXT)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => handleFileChange(e, "resume")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    {resumeFile && (
                      <p className="mt-2 text-sm text-green-600">
                        ✅ {resumeFile.name} selected
                      </p>
                    )}
                  </div>

                  {/* Evaluation Method */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Choose Evaluation Method
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="evaluationMethod"
                          value="role"
                          checked={evaluationMethod === "role"}
                          onChange={(e) => setEvaluationMethod(e.target.value)}
                          className="mr-3 text-purple-600"
                        />
                        <span>Predefined Role</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="evaluationMethod"
                          value="custom_jd"
                          checked={evaluationMethod === "custom_jd"}
                          onChange={(e) => setEvaluationMethod(e.target.value)}
                          className="mr-3 text-purple-600"
                        />
                        <span>Custom Job Description (Text)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="evaluationMethod"
                          value="jd_file"
                          checked={evaluationMethod === "jd_file"}
                          onChange={(e) => setEvaluationMethod(e.target.value)}
                          className="mr-3 text-purple-600"
                        />
                        <span>Job Description File</span>
                      </label>
                    </div>
                  </div>

                  {/* Role Selection */}
                  {evaluationMethod === "role" && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Role
                      </label>
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="">Choose a role...</option>
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Custom JD Text */}
                  {evaluationMethod === "custom_jd" && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Description Text
                      </label>
                      <textarea
                        value={customJD}
                        onChange={(e) => setCustomJD(e.target.value)}
                        rows={6}
                        placeholder="Paste the job description here..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  )}

                  {/* JD File Upload */}
                  {evaluationMethod === "jd_file" && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Job Description File
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => handleFileChange(e, "jd")}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                      {jdFile && (
                        <p className="mt-2 text-sm text-green-600">
                          ✅ {jdFile.name} selected
                        </p>
                      )}
                    </div>
                  )}

                  {/* Analyze Button */}
                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Analyzing Resume...
                      </div>
                    ) : (
                      "🚀 Analyze Resume"
                    )}
                  </button>

                  {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                      {error}
                    </div>
                  )}
                </div>
              )}

              {/* Tab Content */}
              {analysisResult && (
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                  {/* Session Status */}
                  {urlSessionId && sessionRestored && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 text-sm">
                        <strong>✅ Session Restored:</strong> All interactive
                        features are available!
                      </p>
                    </div>
                  )}

                  {urlSessionId && !sessionRestored && (
                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-amber-800 text-sm">
                        <strong>⚠️ Note:</strong> This is an old analysis.
                        Some features may not work. Upload a new resume for full
                        functionality.
                      </p>
                    </div>
                  )}

                  {/* Analysis Results Tab */}
                  {activeTab === "analysis" && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        📊 Analysis Results
                      </h2>

                      {/* Overall Score */}
                      <div className="text-center mb-8">
                        <div
                          className={`text-6xl font-bold mb-2 ${
                            analysisResult.overallScore >= 75
                              ? "text-green-600"
                              : analysisResult.overallScore >= 50
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {analysisResult.overallScore}%
                        </div>
                        <div
                          className={`text-lg font-semibold ${
                            analysisResult.selected
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {analysisResult.selected
                            ? "✅ SELECTED"
                            : "❌ NOT SELECTED"}
                        </div>
                        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                          {analysisResult.reasoning}
                        </p>
                      </div>

                      {/* Strengths and Weaknesses */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                          <h3 className="text-lg font-bold text-green-600 mb-4">
                            💪 Strengths
                          </h3>
                          {analysisResult.strengths?.length > 0 ? (
                            <ul className="space-y-2">
                              {analysisResult.strengths.map((strength, index) => (
                                <li key={index} className="flex items-center">
                                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                  <span className="text-gray-700">{strength}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500">
                              No specific strengths identified
                            </p>
                          )}
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-red-600 mb-4">
                            🎯 Areas for Improvement
                          </h3>
                          {analysisResult.missingSkills?.length > 0 ? (
                            <ul className="space-y-2">
                              {analysisResult.missingSkills.map((skill, index) => (
                                <li key={index} className="flex items-center">
                                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                                  <span className="text-gray-700">{skill}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500">
                              No missing skills identified
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Skill Scores */}
                      {analysisResult.skillScores &&
                        Object.keys(analysisResult.skillScores).length > 0 && (
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                              📈 Skill Breakdown
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {Object.entries(analysisResult.skillScores).map(
                                ([skill, score]) => (
                                  <div
                                    key={skill}
                                    className="bg-gray-50 p-4 rounded-lg"
                                  >
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="text-sm font-medium text-gray-700">
                                        {skill}
                                      </span>
                                      <span className="text-sm font-bold text-gray-900">
                                        {score}/10
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div
                                        className={`h-2 rounded-full ${
                                          score >= 7
                                            ? "bg-green-500"
                                            : score >= 5
                                            ? "bg-yellow-500"
                                            : "bg-red-500"
                                        }`}
                                        style={{ width: `${(score / 10) * 100}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {/* Action Buttons */}
                      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button
                          onClick={() => setActiveTab("qa")}
                          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                        >
                          💬 Ask Questions
                        </button>
                        <button
                          onClick={() => setActiveTab("interview")}
                          className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                        >
                          🎤 Interview Prep
                        </button>
                        <button
                          onClick={() => setActiveTab("improvements")}
                          className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                        >
                          ✨ Get Tips
                        </button>
                        <button
                          onClick={() => setActiveTab("improved-resume")}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                        >
                          📄 Improve Resume
                        </button>
                      </div>
                    </div>
                  )}
