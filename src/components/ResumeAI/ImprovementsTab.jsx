import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axios";
import ApiRoutes from "../../routes/routes";

const ImprovementsTab = ({ currentSession, selectedRole, isActive = true }) => {
  const [improvements, setImprovements] = useState({});
  const [loading, setLoading] = useState(false);
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

  // Load existing improvements when component mounts (lazy loading)
  useEffect(() => {
    if (currentSession && isActive) {
      // Add a small delay to prevent all tabs from loading simultaneously
      const timer = setTimeout(() => {
        loadExistingImprovements();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setLoadingExisting(false);
    }
  }, [currentSession, isActive]);

  const loadExistingImprovements = async () => {
    try {
      setLoadingExisting(true);

      // Reduced timeout for faster loading
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), 5000)
      );

      const apiPromise = axiosInstance.get(
        ApiRoutes.resumeAI.getAnalysis(currentSession)
      );

      const res = await Promise.race([apiPromise, timeoutPromise]);

      // Handle different response structures
      const analysis = res.data.data || res.data;
      if (
        analysis &&
        analysis.improvements &&
        Object.keys(analysis.improvements).length > 0
      ) {
        // Convert Map to Object if needed
        const existingImprovements = analysis.improvements;
        setImprovements(existingImprovements);
        console.log("✅ Loaded existing improvements:", existingImprovements);
      } else {
        console.log("📝 No existing improvements found - ready to generate");
      }
    } catch (error) {
      if (error.message === "Request timeout") {
        console.log("⏱️ Loading timeout - showing generate button");
      } else {
        console.error("Error loading existing improvements:", error);
      }
      // Don't show error to user, just log it
    } finally {
      setLoadingExisting(false);
    }
  };

  const handleGetImprovements = async () => {
    setLoading(true);
    try {
      console.log("🚀 Requesting improvements for session:", currentSession);
      
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
        },
        {
          timeout: 180000, // 3 minute timeout for improvements generation
        }
      );

      console.log("✅ Improvements response received:", res.data);
      
      // Handle different response structures
      const improvementsData = res.data.data?.improvements || res.data.improvements || {};
      
      console.log("📋 Parsed improvements:", improvementsData);
      
      if (Object.keys(improvementsData).length === 0) {
        console.warn("⚠️ No improvements data in response");
        alert("No improvements were generated. Please try again.");
        return;
      }
      
      setImprovements(improvementsData);
      console.log("✅ Improvements set successfully");
    } catch (error) {
      console.error("❌ Error getting improvements:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      alert(`Failed to get improvements: ${errorMessage}\n\nPlease try again or load from history.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveImprovements = () => {
    const text = Object.entries(improvements)
      .map(([area, details]) => {
        let content = `${area}\n${"=".repeat(area.length)}\n\n`;
        if (details.description) {
          content += `${details.description}\n\n`;
        }
        if (details.specific && details.specific.length > 0) {
          content += "Specific Suggestions:\n";
          details.specific.forEach((suggestion, i) => {
            content += `${i + 1}. ${suggestion}\n`;
          });
        }
        return content;
      })
      .join("\n\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume_improvements_${currentSession}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          ✨ Resume Improvements
        </h2>
        {Object.keys(improvements).length > 0 && (
          <button
            onClick={handleSaveImprovements}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm border border-emerald-500/30"
          >
            💾 Save Improvements
          </button>
        )}
      </div>

      {loadingExisting ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-white/70">Loading existing improvements...</p>
        </div>
      ) : Object.keys(improvements).length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-6">
            <div className="text-6xl mb-4">✨</div>
            <p className="text-lg text-white/80 mb-2">
              Get personalized improvement suggestions
            </p>
            <p className="text-sm text-white/60">
              AI will analyze your resume and provide specific recommendations
            </p>
          </div>
          <button
            onClick={handleGetImprovements}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-8 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-500/30"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Analyzing...
              </div>
            ) : (
              "🚀 Generate Improvements"
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(improvements).map(([area, details]) => (
            <div
              key={area}
              className="border border-white/20 rounded-lg p-6 bg-white/10 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {area}
                </h3>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full border border-emerald-400/30">
                  Improvement Area
                </span>
              </div>

              {details.description && (
                <div className="mb-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-white/90">{details.description}</p>
                </div>
              )}

              {details.specific && details.specific.length > 0 && (
                <div>
                  <h4 className="font-medium text-white mb-3 flex items-center">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                    Specific Suggestions:
                  </h4>
                  <ul className="space-y-2">
                    {details.specific.map((suggestion, index) => (
                      <li
                        key={index}
                        className="flex items-start p-3 bg-white/5 rounded-lg border border-white/10"
                      >
                        <span className="flex-shrink-0 w-6 h-6 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 border border-emerald-400/30">
                          {index + 1}
                        </span>
                        <span className="text-white/90 flex-1">
                          {suggestion}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}

          {/* Regenerate Button */}
          <div className="text-center pt-4">
            <button
              onClick={handleGetImprovements}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 border border-emerald-500/30"
            >
              {loading ? "Regenerating..." : "🔄 Regenerate Improvements"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImprovementsTab;
