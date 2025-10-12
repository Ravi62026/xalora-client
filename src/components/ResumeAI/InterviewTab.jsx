import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axios";
import ApiRoutes from "../../routes/routes";

const InterviewTab = ({ currentSession }) => {
  const [questionCategories, setQuestionCategories] = useState({
    Experience: true,
    Technical: true,
    Behavioral: true,
    Coding: true,
    Project: true,
  });
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("medium");
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(true);

  // Debug session ID
  console.log("🔍 InterviewTab currentSession:", currentSession);

  // Load existing questions when component mounts
  useEffect(() => {
    if (currentSession) {
      loadExistingQuestions();
    }
  }, [currentSession]);

  const loadExistingQuestions = async () => {
    try {
      setLoadingExisting(true);
      const res = await axiosInstance.get(
        ApiRoutes.resumeAI.getAnalysis(currentSession)
      );
      
      const analysis = res.data.data;
      if (analysis.interviewQuestions && analysis.interviewQuestions.length > 0) {
        // Convert database format to display format
        const existingQuestions = analysis.interviewQuestions.map(q => [
          q.questionType,
          q.question
        ]);
        setInterviewQuestions(existingQuestions);
        console.log("✅ Loaded existing questions:", existingQuestions);
      }
    } catch (error) {
      console.error("Error loading existing questions:", error);
    } finally {
      setLoadingExisting(false);
    }
  };

  const handleGenerateQuestions = async () => {
    const selectedCategories = Object.keys(questionCategories).filter(
      (cat) => questionCategories[cat]
    );

    if (selectedCategories.length === 0) {
      alert("Please select at least one question category");
      return;
    }

    if (!currentSession) {
      alert("Session not available. Please try refreshing the page.");
      return;
    }

    setLoading(true);
    try {
      console.log("🚀 Generating questions for session:", currentSession);
      const res = await axiosInstance.post(
        ApiRoutes.resumeAI.generateInterviewQuestions(currentSession),
        {
          questionTypes: selectedCategories,
          difficulty,
          numQuestions: parseInt(numQuestions),
        },
        {
          timeout: 120000, // 2 minute timeout for interview questions
        }
      );

      console.log("✅ Interview Questions Response:", res.data);
      
      const questions = res.data.data?.questions || res.data.questions || [];
      
      if (questions.length === 0) {
        console.warn("⚠️ No questions in response");
        alert("No questions were generated. Please try again.");
        return;
      }
      
      setInterviewQuestions(questions);
      console.log("✅ Questions set successfully:", questions.length);
    } catch (error) {
      console.error("❌ Error generating interview questions:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      alert(`Failed to generate questions: ${errorMessage}\n\nPlease try again or reload from history.`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCategory = (category) => {
    setQuestionCategories({
      ...questionCategories,
      [category]: !questionCategories[category],
    });
  };

  // Group questions by category
  const groupedQuestions = {};
  
  console.log("🔍 Interview Questions Data:", interviewQuestions);
  console.log("🔍 Interview Questions Type:", typeof interviewQuestions);
  console.log("🔍 Interview Questions Length:", interviewQuestions?.length);
  
  if (Array.isArray(interviewQuestions)) {
    interviewQuestions.forEach((item, index) => {
      console.log(`🔍 Question ${index}:`, item);
      
      // Handle different response formats
      let category, question;
      
      if (Array.isArray(item) && item.length >= 2) {
        // Format: [category, question]
        [category, question] = item;
      } else if (typeof item === 'object' && item.questionType && item.question) {
        // Format: {questionType, question}
        category = item.questionType;
        question = item.question;
      } else {
        console.warn("🔍 Unknown question format:", item);
        return;
      }
      
      if (!groupedQuestions[category]) {
        groupedQuestions[category] = [];
      }
      groupedQuestions[category].push(question);
    });
  }

  const categoryIcons = {
    Experience: "💼",
    Technical: "💻",
    Behavioral: "🧠",
    Coding: "⌨️",
    Project: "🚀",
  };

  const categoryColors = {
    Experience: "bg-blue-100 text-blue-800 border-blue-200",
    Technical: "bg-purple-100 text-purple-800 border-purple-200",
    Behavioral: "bg-green-100 text-green-800 border-green-200",
    Coding: "bg-orange-100 text-orange-800 border-orange-200",
    Project: "bg-pink-100 text-pink-800 border-pink-200",
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🎤 Interview Questions
      </h2>

      {/* Configuration Panel */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Configure Questions
        </h3>

        {/* Question Categories */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Question Categories:
          </label>
          <div className="flex flex-wrap gap-3">
            {Object.keys(questionCategories).map((category) => (
              <label
                key={category}
                className="flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={questionCategories[category]}
                  onChange={() => handleToggleCategory(category)}
                  className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  {categoryIcons[category]} {category}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Number of Questions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions:
            </label>
            <input
              type="number"
              min="5"
              max="20"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level:
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateQuestions}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Generating Questions...
            </div>
          ) : (
            "🎯 Generate Interview Questions"
          )}
        </button>
      </div>

      {/* Questions Display */}
      {loadingExisting ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading existing questions...</p>
        </div>
      ) : interviewQuestions.length > 0 ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Interview Questions ({interviewQuestions.length})
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const text = interviewQuestions
                    .map(([cat, q], i) => `${i + 1}. [${cat}] ${q}`)
                    .join("\n\n");
                  navigator.clipboard.writeText(text);
                  alert("Questions copied to clipboard!");
                }}
                className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                📋 Copy All
              </button>
              <button
                onClick={handleGenerateQuestions}
                disabled={loading}
                className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                🔄 Generate New
              </button>
            </div>
          </div>

          {Object.entries(groupedQuestions).map(([category, questions]) => (
            <div key={category} className="border border-gray-200 rounded-lg p-4">
              <h4
                className={`text-md font-semibold mb-3 px-3 py-1 rounded inline-block ${categoryColors[category]}`}
              >
                {categoryIcons[category]} {category} Questions ({questions.length})
              </h4>
              <div className="space-y-3 mt-3">
                {questions.map((question, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start">
                      <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold text-sm mr-3">
                        {index + 1}
                      </span>
                      <p className="text-gray-800 flex-1">{question}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-lg mb-2">No questions generated yet</p>
          <p className="text-sm">
            Configure your preferences above and click "Generate Interview
            Questions"
          </p>
        </div>
      )}
    </div>
  );
};

export default InterviewTab;
