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

const QUESTION_TYPE_LABELS = {
  theory: "Theory",
  quirks: "Quirks",
  debugging: "Debugging",
  guess_output: "Guess Output",
  code: "Code",
  scenario: "Scenario",
  mcq: "MCQ",
};

const formatQuestionType = (value) =>
  QUESTION_TYPE_LABELS[value] || (value ? value.replace(/_/g, " ") : "Theory");

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
      if (error.response?.status === 400) {
        alert('Certificate is only available for passed quizzes (60% or higher).');
      } else {
        alert("Failed to download certificate. Please try again.");
      }
    }
  };

  const getAnswerIcon = (isCorrect, userAnswer) => {
    if (userAnswer === -1) {
      return <AlertCircle className="h-5 w-5 text-slate-400" />;
    }
    return isCorrect ? (
      <CheckCircle className="h-5 w-5 text-emerald-500" />
    ) : (
      <XCircle className="h-5 w-5 text-rose-500" />
    );
  };

  const getAnswerColor = (isCorrect, userAnswer) => {
    if (userAnswer === -1) return "border-slate-200 bg-slate-50";
    return isCorrect
      ? "border-emerald-100 bg-emerald-50/30"
      : "border-rose-100 bg-rose-50/30";
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
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Please Login
            </h2>
            <p className="text-slate-600">
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-500">Loading quiz report...</p>
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
            <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Report Not Found
            </h2>
            <p className="text-slate-600 mb-6">
              The quiz report you're looking for doesn't exist.
            </p>
            <button
              onClick={() => navigate("/quiz/analytics")}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-bold"
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
                className="mr-4 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                title="Back to Quiz Analytics"
              >
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-3xl font-black text-slate-900">
                  {quiz.title} - Report
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  {quiz.topic} •{" "}
                  {new Date(performance.submittedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm shadow-sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
              {performance.passed && (
                <button
                  onClick={handleDownloadCertificate}
                  className="flex items-center px-4 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold text-sm shadow-sm"
                >
                  <Medal className="h-4 w-4 mr-2" />
                  Download Certificate
                </button>
              )}
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-white/80 border border-slate-200 rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
              Performance Summary
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center border-r border-slate-100 last:border-0">
                <div
                  className={`text-3xl font-black mb-2 ${
                    performance.passed ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {performance.score}%
                </div>
                <p className="text-sm font-medium text-slate-500">Final Score</p>
                {performance.passed && (
                  <div className="flex items-center justify-center mt-2">
                    <Award className="h-4 w-4 text-amber-500 mr-1" />
                    <span className="text-[11px] font-medium text-amber-600">
                      +10 JBP Coins (Share on LinkedIn)
                    </span>
                  </div>
                )}
              </div>

              <div className="text-center border-r border-slate-100 last:border-0">
                <div className="text-3xl font-black text-indigo-600 mb-2">
                  {performance.correctAnswers}/{performance.totalQuestions}
                </div>
                <p className="text-sm font-medium text-slate-500">Correct Answers</p>
              </div>

              <div className="text-center border-r border-slate-100 last:border-0">
                <div className="text-3xl font-black text-purple-600 mb-2">
                  {formatTime(performance.timeTaken)}
                </div>
                <p className="text-sm font-medium text-slate-500">Time Taken</p>
              </div>

              <div className="text-center">
                <div
                  className={`text-3xl font-black mb-2 ${
                    performance.passed ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {performance.passed ? "PASSED" : "FAILED"}
                </div>
                <p className="text-sm font-medium text-slate-500">Status</p>
                <p className="text-xs text-slate-400 mt-1">Required: 60%</p>
              </div>
            </div>
          </div>

          {/* Summary Insights */}
          <div className="bg-white/80 border border-slate-200 rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <Target className="h-5 w-5 mr-2 text-indigo-600" />
              Performance Insights
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">
                <h3 className="font-bold text-emerald-800 mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-emerald-600" />
                  Strengths
                </h3>
                <div className="space-y-1">
                  {[...new Set(summary.strengths)]
                    .slice(0, 3)
                    .map((strength, index) => (
                      <span
                        key={index}
                        className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full mr-1 mb-1 font-semibold"
                      >
                        {strength}
                      </span>
                    ))}
                </div>
              </div>

              <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4">
                <h3 className="font-bold text-rose-800 mb-2 flex items-center">
                  <XCircle className="h-4 w-4 mr-2 text-rose-600" />
                  Areas to Improve
                </h3>
                <div className="space-y-1">
                  {[...new Set(summary.weaknesses)]
                    .slice(0, 3)
                    .map((weakness, index) => (
                      <span
                        key={index}
                        className="inline-block bg-rose-100 text-rose-800 text-xs px-2.5 py-1 rounded-full mr-1 mb-1 font-semibold"
                      >
                        {weakness}
                      </span>
                    ))}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <h3 className="font-bold text-slate-800 mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-slate-600" />
                  Statistics
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Unanswered:</span>
                    <span className="font-bold text-slate-800">{summary.unanswered}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Accuracy:</span>
                    <span className="font-bold text-slate-800">
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
          <div className="bg-white/80 border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-indigo-600" />
                Question-wise Analysis
              </h2>
              <button
                onClick={() => setShowExplanations(!showExplanations)}
                className="flex items-center px-3 py-2 text-xs font-bold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
                {showExplanations ? "Hide" : "Show"} Explanations
              </button>
            </div>

            <div className="space-y-6">
              {questionAnalysis.map((question, index) => (
                <div
                  key={index}
                  className={`border rounded-xl p-6 ${getAnswerColor(
                    question.isCorrect,
                    question.userAnswer
                  )}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        {getAnswerIcon(question.isCorrect, question.userAnswer)}
                        <span className="ml-2 font-bold text-slate-800">
                          Question {question.questionNumber}
                        </span>
                        <span className="ml-2 text-xs bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded-full border border-cyan-100 font-semibold">
                          {formatQuestionType(question.questionType)}
                        </span>
                        <span className="ml-2 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                          {question.difficulty}
                        </span>
                      </div>
                      <p className="text-slate-700 text-sm font-medium mb-4 leading-relaxed">
                        {question.questionText}
                      </p>
                      {question.codeSnippet && (
                        <div className="mb-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-cyan-400">Code Canvas</span>
                            {question.language && (
                              <span className="text-[11px] text-slate-500 font-semibold">{question.language}</span>
                            )}
                          </div>
                          <pre className="overflow-x-auto whitespace-pre-wrap text-sm leading-6 text-slate-100">
                            <code>{question.codeSnippet}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                        Your Answer:
                      </p>
                      <p
                        className={`text-sm p-2.5 rounded-lg font-medium border ${
                          question.userAnswer === -1
                            ? "bg-slate-100 text-slate-400 italic border-slate-200"
                            : question.isCorrect
                            ? "bg-emerald-50/50 text-emerald-800 border-emerald-100"
                            : "bg-rose-50/50 text-rose-800 border-rose-100"
                        }`}
                      >
                        {question.userAnswerText}
                      </p>
                    </div>

                    {!question.isCorrect && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                          Correct Answer:
                        </p>
                        <p className="text-sm p-2.5 rounded-lg font-medium bg-emerald-50/50 text-emerald-800 border border-emerald-100">
                          {question.correctAnswerText}
                        </p>
                      </div>
                    )}
                  </div>

                  {showExplanations && question.explanation && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                      <div className="flex items-center mb-2">
                        <Lightbulb className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="font-bold text-blue-800">
                          Explanation
                        </span>
                      </div>
                      <p className="text-blue-900 text-sm leading-relaxed">
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
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors text-sm shadow-sm"
            >
              Back to Quiz Analytics
            </button>
            <button
              onClick={() => navigate("/quiz")}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors text-sm shadow-md shadow-indigo-100"
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
