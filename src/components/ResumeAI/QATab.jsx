import { useState } from "react";
import axiosInstance from "../../utils/axios";
import ApiRoutes from "../../routes/routes";

const QATab = ({ currentSession }) => {
  const [question, setQuestion] = useState("");
  const [qaHistory, setQaHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debug session ID
  console.log("🔍 QATab currentSession:", currentSession);

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      alert("Please enter a question");
      return;
    }

    if (!currentSession) {
      alert("Session not available. Please try refreshing the page.");
      return;
    }

    setLoading(true);
    try {
      console.log("🚀 Asking question for session:", currentSession);
      const res = await axiosInstance.post(
        ApiRoutes.resumeAI.askQuestion(currentSession),
        {
          question: question.trim(),
        },
        {
          timeout: 120000, // 2 minute timeout for Q&A
        }
      );

      console.log("✅ Q&A response received:", res.data);
      
      const answer = res.data.data?.answer || res.data.answer || "No answer received";
      
      setQaHistory([
        ...qaHistory,
        { question: question.trim(), answer },
      ]);
      setQuestion("");
    } catch (error) {
      console.error("❌ Error asking question:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      alert(`Failed to get answer: ${errorMessage}\n\nPlease try again or reload from history.`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">💬 Q&A</h2>

      {/* Q&A History */}
      <div className="flex-1 mb-6 space-y-4 overflow-y-auto max-h-[500px] pr-2">
        {qaHistory.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No questions asked yet</p>
            <p className="text-sm">
              Ask anything about your resume analysis below!
            </p>
          </div>
        ) : (
          qaHistory.map((qa, index) => (
            <div key={index} className="space-y-3">
              {/* Question */}
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white rounded-lg px-4 py-3 max-w-[80%]">
                  <p className="text-sm font-medium mb-1">You asked:</p>
                  <p>{qa.question}</p>
                </div>
              </div>

              {/* Answer */}
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-3 max-w-[80%]">
                  <p className="text-sm font-medium mb-1 text-blue-600">
                    AI Answer:
                  </p>
                  <p className="whitespace-pre-wrap">{qa.answer}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Question Input */}
      <div className="border-t pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ask a question about your resume:
        </label>
        <div className="flex gap-2">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={2}
            placeholder="e.g., What are my strongest technical skills? How can I improve my experience section?"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
          <button
            onClick={handleAskQuestion}
            disabled={loading || !question.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              </div>
            ) : (
              "Ask"
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default QATab;
