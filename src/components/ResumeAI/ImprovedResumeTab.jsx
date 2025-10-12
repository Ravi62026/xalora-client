import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import axiosInstance from "../../utils/axios";
import ApiRoutes from "../../routes/routes";

const ImprovedResumeTab = ({ currentSession, roles, isActive = true }) => {
  const [improveMethod, setImproveMethod] = useState("role");
  const [improveRole, setImproveRole] = useState("");
  const [improveJD, setImproveJD] = useState("");
  const [improveJDFile, setImproveJDFile] = useState(null);
  const [improvedResume, setImprovedResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [outputFormat, setOutputFormat] = useState("markdown");
  const [templateName, setTemplateName] = useState("autoCV");
  const [templates, setTemplates] = useState({});
  const [showConfig, setShowConfig] = useState(true);
  const [loadingExisting, setLoadingExisting] = useState(true);

  // Fallback to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loadingExisting) {
        console.warn("⏱️ Loading timeout reached, stopping loading state");
        setLoadingExisting(false);
      }
    }, 8000); // 8 second timeout

    return () => clearTimeout(timeout);
  }, [loadingExisting]);
  const [viewMode, setViewMode] = useState("formatted");
  const [activeTab, setActiveTab] = useState("resume");

  // Load existing improved resume and templates when component mounts (lazy loading)
  useEffect(() => {
    if (currentSession && isActive) {
      // Add a small delay to prevent all tabs from loading simultaneously
      const timer = setTimeout(() => {
        loadExistingImprovedResume();
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setLoadingExisting(false);
    }
    loadTemplates();
  }, [currentSession, isActive]);

  const loadTemplates = async () => {
    try {
      console.log("🔄 Loading templates...");
      const res = await axiosInstance.get(ApiRoutes.resumeAI.getTemplates);
      const templatesData = res.data.data?.templates || res.data.templates || {};
      console.log("✅ Templates loaded:", templatesData);
      setTemplates(templatesData);
    } catch (error) {
      console.error("❌ Error loading templates:", error);
      // Set default templates if API fails
      setTemplates({
        autoCV: {
          name: "AutoCV",
          description: "Clean and professional template",
          features: ["ATS-friendly", "Modern design", "Compact layout"]
        },
        RenderCVEngineeringResumes: {
          name: "Engineering Resume",
          description: "Optimized for technical roles",
          features: ["Technical focus", "Skills highlight", "Project showcase"]
        }
      });
    }
  };

  const loadExistingImprovedResume = async () => {
    try {
      setLoadingExisting(true);
      
      // Reduced timeout for faster loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 5000)
      );
      
      const apiPromise = axiosInstance.get(
        ApiRoutes.resumeAI.getAnalysis(currentSession)
      );
      
      const res = await Promise.race([apiPromise, timeoutPromise]);

      // Handle different response structures
      const analysis = res.data.data || res.data;
      if (analysis && analysis.improvedResume && analysis.improvedResume.trim()) {
        setImprovedResume(analysis.improvedResume);
        setCoverLetter(analysis.coverLetter || "");
        setOutputFormat(analysis.outputFormat || "markdown");
        setTemplateName(analysis.templateName || "autoCV");
        setShowConfig(false); // Show existing resume instead of config
        console.log("✅ Loaded existing improved resume");
      } else {
        console.log("📄 No existing improved resume found - ready to generate");
      }
    } catch (error) {
      if (error.message === 'Request timeout') {
        console.log("⏱️ Loading timeout - showing configuration");
      } else {
        console.error("Error loading existing improved resume:", error);
      }
      // Don't show error to user, just log it
    } finally {
      setLoadingExisting(false);
    }
  };

  const handleFileChange = (e) => {
    setImproveJDFile(e.target.files[0]);
  };

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

    setLoading(true);
    try {
      let highlightSkills = "";

      if (improveMethod === "role") {
        highlightSkills = improveRole;
      } else if (improveMethod === "custom_jd") {
        highlightSkills = improveJD;
      } else if (improveMethod === "jd_file") {
        const fileContent = await improveJDFile.text();
        highlightSkills = fileContent;
      }

      const res = await axiosInstance.post(
        ApiRoutes.resumeAI.getImprovedResume(currentSession),
        {
          targetRole: improveRole || "",
          highlightSkills,
          outputFormat,
          templateName,
        }
      );

      setImprovedResume(res.data.data.improvedResume || "");
      setCoverLetter(res.data.data.coverLetter || "");
      setShowConfig(false);
    } catch (error) {
      console.error("Error generating improved resume:", error);
      alert(
        "Failed to generate improved resume. Please try loading this analysis again from history."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResume = async () => {
    try {
      // Save to database first
      await axiosInstance.post(
        ApiRoutes.resumeAI.saveImprovedResume(currentSession),
        {
          improvedResume,
        }
      );

      // Download resume file
      const fileExtension = outputFormat === "latex" ? "tex" : outputFormat === "markdown" ? "md" : "txt";
      const mimeType = outputFormat === "latex" ? "text/x-tex" : outputFormat === "markdown" ? "text/markdown" : "text/plain";
      
      const blob = new Blob([improvedResume], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `improved_resume_${currentSession}.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert("Resume saved to database and downloaded successfully!");
    } catch (error) {
      console.error("Error saving resume:", error);
      // Still allow download even if save fails
      const fileExtension = outputFormat === "latex" ? "tex" : outputFormat === "markdown" ? "md" : "txt";
      const mimeType = outputFormat === "latex" ? "text/x-tex" : outputFormat === "markdown" ? "text/markdown" : "text/plain";
      
      const blob = new Blob([improvedResume], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `improved_resume_${currentSession}.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert("Downloaded successfully! (Database save failed)");
    }
  };

  const handleSaveCoverLetter = async () => {
    if (!coverLetter) {
      alert("No cover letter available to download");
      return;
    }

    try {
      const blob = new Blob([coverLetter], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cover_letter_${currentSession}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert("Cover letter downloaded successfully!");
    } catch (error) {
      console.error("Error downloading cover letter:", error);
      alert("Failed to download cover letter");
    }
  };

  const handleCopyResume = () => {
    navigator.clipboard.writeText(improvedResume);
    alert("Resume copied to clipboard!");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">📄 Improved Resume</h2>
        {improvedResume && (
          <div className="flex gap-2 flex-wrap">
            {outputFormat !== "latex" && (
              <button
                onClick={() =>
                  setViewMode(viewMode === "formatted" ? "raw" : "formatted")
                }
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
              >
                👁️ {viewMode === "formatted" ? "Raw Text" : "Formatted"}
              </button>
            )}
            <button
              onClick={handleCopyResume}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm border border-emerald-500/30"
            >
              📋 Copy Resume
            </button>
            <button
              onClick={handleSaveResume}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm border border-emerald-500/30"
            >
              💾 Save Resume
            </button>
            {coverLetter && (
              <button
                onClick={handleSaveCoverLetter}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
              >
                📄 Save Cover Letter
              </button>
            )}
            <button
              onClick={() => {
                setShowConfig(true);
                setImprovedResume("");
                setCoverLetter("");
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              🔄 New
            </button>
          </div>
        )}
      </div>

      {loadingExisting ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-white/70">Loading existing improved resume...</p>
        </div>
      ) : showConfig ? (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">
            Configure Improved Resume
          </h3>
          <p className="text-sm text-white/70 mb-6">
            Choose how you want to optimize your resume. The AI will enhance
            your existing content without adding fake information.
          </p>

          {/* Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-3">
              Optimization Method:
            </label>
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer p-3 border border-white/30 rounded-lg hover:bg-white/10 transition-colors bg-white/5">
                <input
                  type="radio"
                  name="improveMethod"
                  value="role"
                  checked={improveMethod === "role"}
                  onChange={(e) => setImproveMethod(e.target.value)}
                  className="mr-3 text-emerald-400"
                />
                <div>
                  <span className="font-medium text-white">Predefined Role</span>
                  <p className="text-xs text-white/60">
                    Optimize for a specific job role
                  </p>
                </div>
              </label>
              <label className="flex items-center cursor-pointer p-3 border border-white/30 rounded-lg hover:bg-white/10 transition-colors bg-white/5">
                <input
                  type="radio"
                  name="improveMethod"
                  value="custom_jd"
                  checked={improveMethod === "custom_jd"}
                  onChange={(e) => setImproveMethod(e.target.value)}
                  className="mr-3 text-emerald-400"
                />
                <div>
                  <span className="font-medium text-white">Custom Job Description</span>
                  <p className="text-xs text-white/60">
                    Paste a job description to optimize for
                  </p>
                </div>
              </label>
              <label className="flex items-center cursor-pointer p-3 border border-white/30 rounded-lg hover:bg-white/10 transition-colors bg-white/5">
                <input
                  type="radio"
                  name="improveMethod"
                  value="jd_file"
                  checked={improveMethod === "jd_file"}
                  onChange={(e) => setImproveMethod(e.target.value)}
                  className="mr-3 text-emerald-400"
                />
                <div>
                  <span className="font-medium text-white">Job Description File</span>
                  <p className="text-xs text-white/60">
                    Upload a JD file to optimize for
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Role Selection */}
          {improveMethod === "role" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2">
                Select Target Role:
              </label>
              <select
                value={improveRole}
                onChange={(e) => setImproveRole(e.target.value)}
                className="w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/10 text-white"
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
          {improveMethod === "custom_jd" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2">
                Job Description Text:
              </label>
              <textarea
                value={improveJD}
                onChange={(e) => setImproveJD(e.target.value)}
                rows={8}
                placeholder="Paste the job description here..."
                className="w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/10 text-white placeholder-white/50"
              />
            </div>
          )}

          {/* JD File Upload */}
          {improveMethod === "jd_file" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2">
                Upload Job Description File:
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/10 text-white"
              />
              {improveJDFile && (
                <p className="mt-2 text-sm text-green-600">
                  ✅ {improveJDFile.name} selected
                </p>
              )}
            </div>
          )}

          {/* Output Format Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-3">
              Output Format:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="flex items-center cursor-pointer p-3 border border-white/30 rounded-lg hover:bg-white/10 transition-colors bg-white/5">
                <input
                  type="radio"
                  name="outputFormat"
                  value="markdown"
                  checked={outputFormat === "markdown"}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="mr-3 text-emerald-400"
                />
                <div>
                  <span className="font-medium text-white">📝 Markdown</span>
                  <p className="text-xs text-white/60">Clean, readable format</p>
                </div>
              </label>
              <label className="flex items-center cursor-pointer p-3 border border-white/30 rounded-lg hover:bg-white/10 transition-colors bg-white/5">
                <input
                  type="radio"
                  name="outputFormat"
                  value="text"
                  checked={outputFormat === "text"}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="mr-3 text-emerald-400"
                />
                <div>
                  <span className="font-medium text-white">📄 Plain Text</span>
                  <p className="text-xs text-white/60">ATS-friendly format</p>
                </div>
              </label>
              <label className="flex items-center cursor-pointer p-3 border border-white/30 rounded-lg hover:bg-white/10 transition-colors bg-white/5">
                <input
                  type="radio"
                  name="outputFormat"
                  value="latex"
                  checked={outputFormat === "latex"}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="mr-3 text-emerald-400"
                />
                <div>
                  <span className="font-medium text-white">📐 LaTeX</span>
                  <p className="text-xs text-white/60">Professional PDF</p>
                </div>
              </label>
            </div>
          </div>

          {/* Template Selection (only for LaTeX) */}
          {outputFormat === "latex" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-3">
                Resume Template:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {Object.entries(templates).map(([key, template]) => (
                  <label key={key} className="flex items-start cursor-pointer p-4 border border-white/30 rounded-lg hover:bg-white/10 transition-colors bg-white/5">
                    <input
                      type="radio"
                      name="templateName"
                      value={key}
                      checked={templateName === key}
                      onChange={(e) => setTemplateName(e.target.value)}
                      className="mr-3 mt-1 text-emerald-400"
                    />
                    <div>
                      <span className="font-medium block text-white">{template.name}</span>
                      <p className="text-xs text-white/70 mt-1">{template.description}</p>
                      <div className="mt-2">
                        {template.features?.map((feature, idx) => (
                          <span key={idx} className="inline-block bg-emerald-500/20 text-emerald-300 text-xs px-2 py-1 rounded mr-1 mb-1 border border-emerald-400/30">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerateImprovedResume}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating Improved Resume & Cover Letter... (This may take 60-90 seconds)
              </div>
            ) : (
              `🚀 Generate Improved Resume & Cover Letter (${outputFormat.toUpperCase()}${outputFormat === "latex" ? ` - ${templates[templateName]?.name || templateName}` : ""})`
            )}
          </button>

          <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-400/30 rounded-lg">
            <p className="text-sm text-emerald-300">
              <strong>Note:</strong> The AI will enhance your existing resume
              content without adding fake information. It will improve wording,
              add quantifiable metrics where applicable, and optimize for ATS
              systems. A cover letter will also be generated if a target role is specified.
              Target score: 90+
            </p>
            <div className="mt-2 text-xs text-emerald-300">
              <strong>Formats:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li><strong>Markdown:</strong> Clean, readable format perfect for online viewing</li>
                <li><strong>Plain Text:</strong> ATS-optimized format for job applications</li>
                <li><strong>LaTeX:</strong> Professional PDF-ready format with beautiful typography</li>
              </ul>
              <div className="mt-2 p-2 bg-emerald-500/20 border border-emerald-400/40 rounded">
                <strong>🎯 1-Page Optimization:</strong> All formats are optimized to fit within 1 page for professional standards. Content is automatically condensed while maintaining impact.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Score Indicator */}
          <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-300">
                  ✅ Improved Resume Generated
                </p>
                <p className="text-xs text-emerald-400 mt-1">
                  Optimized for ATS and target role - Expected score: 90+
                  {coverLetter && " | Cover letter included"}
                </p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("resume")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "resume"
                    ? "border-emerald-500 text-emerald-400"
                    : "border-transparent text-white/70 hover:text-white hover:border-white/30"
                }`}
              >
                📄 Resume ({outputFormat.toUpperCase()})
              </button>
              {coverLetter && (
                <button
                  onClick={() => setActiveTab("cover-letter")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "cover-letter"
                      ? "border-emerald-500 text-emerald-400"
                      : "border-transparent text-white/70 hover:text-white hover:border-white/30"
                  }`}
                >
                  📝 Cover Letter
                </button>
              )}
            </nav>
          </div>

          {/* Content Display */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 max-h-[600px] overflow-y-auto">
            {activeTab === "resume" ? (
              // Resume Display
              <>
                {outputFormat === "latex" || viewMode === "raw" ? (
                  // LaTeX code display or Raw text
                  <div>
                    <div className="mb-3 text-xs text-white/70 bg-white/10 px-3 py-1 rounded border border-white/20">
                      {outputFormat === "latex"
                        ? `LaTeX Code (${templateName} template)`
                        : `Raw ${outputFormat.toUpperCase()} Text`}
                    </div>
                    <pre className="whitespace-pre-wrap text-sm text-white/90 font-mono leading-relaxed bg-white/5 p-4 rounded border border-white/20">
                      {improvedResume}
                    </pre>
                  </div>
                ) : (
                  // Markdown rendered display
                  <div>
                    <div className="mb-3 text-xs text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded border border-emerald-400/30">
                      Formatted Resume Preview
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-2xl font-bold text-white mb-4 text-center border-b-2 border-white/30 pb-3">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-lg font-semibold text-white mb-3 mt-6 border-l-4 border-emerald-400 pl-3 bg-emerald-500/10 py-2">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-md font-medium text-white/90 mb-2 mt-4 text-emerald-300">
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="text-white/90 mb-3 leading-relaxed">
                              {children}
                            </p>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
                              {children}
                            </ul>
                          ),
                          li: ({ children }) => (
                            <li className="text-white/90">{children}</li>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-white">
                              {children}
                            </strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic text-white/80">{children}</em>
                          ),
                        }}
                      >
                        {improvedResume}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Cover Letter Display
              <div>
                <div className="mb-3 text-xs text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded border border-emerald-400/30">
                  Cover Letter Preview
                </div>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-xl font-bold text-white mb-4 text-center">
                          {children}
                        </h1>
                      ),
                      p: ({ children }) => (
                        <p className="text-white/90 mb-4 leading-relaxed">
                          {children}
                        </p>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-white">
                          {children}
                        </strong>
                      ),
                    }}
                  >
                    {coverLetter}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImprovedResumeTab;
