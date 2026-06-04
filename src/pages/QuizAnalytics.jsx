import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { 
  Trophy, 
  TrendingUp, 
  Clock, 
  Award, 
  BarChart3, 
  Download,
  Eye,
  Coins,
  Target,
  BookOpen,
  Calendar,
  Medal
} from 'lucide-react';
import axiosInstance from '../utils/axios';
import ApiRoutes from '../routes/routes';
import { useApiCall } from '../hooks';

const QuizAnalytics = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const { execute } = useApiCall();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchAnalytics();
  }, [isAuthenticated, navigate]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching analytics from:', ApiRoutes.quizzes.analytics);
      
      const response = await execute(async () => {
        const res = await axiosInstance.get(ApiRoutes.quizzes.analytics);
        return res.data;
      });
      
      console.log('📊 Analytics response:', response);
      setAnalytics(response.data);
    } catch (error) {
      console.error('❌ Error fetching analytics:', error);
      // Set empty analytics to show the "no data" state properly
      setAnalytics({
        overview: {
          totalQuizzes: 0,
          passedQuizzes: 0,
          failedQuizzes: 0,
          averageScore: 0,
          passRate: 0,
          jbpCoins: 0,
          totalJbpEarned: 0
        },
        topicPerformance: {},
        recentSubmissions: [],
        allSubmissions: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (submissionId) => {
    navigate(`/quiz/report/${submissionId}`);
  };

  const handleDownloadReport = async (submissionId, quizTitle) => {
    try {
      const response = await axiosInstance.get(`/api/v1/quizzes/report/${submissionId}/pdf`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${quizTitle}_Report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report. Please try again.');
    }
  };

  // New function to handle certificate download
  const handleDownloadCertificate = async (submissionId, quizTitle) => {
    try {
      const response = await axiosInstance.get(`/api/v1/quizzes/certificate/${submissionId}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${quizTitle}_Certificate.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      // Check if it's a 400 error (certificate only available for passed quizzes)
      if (error.response?.status === 400) {
        alert('Certificate is only available for passed quizzes (60% or higher).');
      } else {
        alert('Failed to download certificate. Please try again.');
      }
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPassedColor = (passed) => {
    return passed ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const filteredSubmissions = analytics?.allSubmissions?.filter(submission => 
    selectedTopic === 'all' || submission.topic === selectedTopic
  ) || [];

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen xalora-grid-bg flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
            <p className="text-gray-600">You need to be logged in to view quiz analytics.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen xalora-grid-bg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!analytics) {
    return (
      <Layout>
        <div className="min-h-screen xalora-grid-bg flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-md">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Quiz Data</h2>
            <p className="text-gray-600 mb-6">You haven't taken any quizzes yet.</p>
            <button
              onClick={() => navigate('/quiz')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-200"
            >
              Take Your First Quiz
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const { overview, topicPerformance, recentSubmissions } = analytics;

  return (
    <Layout>
      <div className="min-h-screen xalora-grid-bg py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Quiz Analytics</h1>
            <p className="text-gray-600">Track your progress and earn rewards</p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl border border-indigo-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">Total Quizzes</p>
                  <p className="text-3xl font-bold text-indigo-900 mt-2">{overview.totalQuizzes}</p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-indigo-200">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Pass Rate</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">{overview.passRate}%</p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-green-200">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Average Score</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">{overview.averageScore}%</p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-blue-200">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border border-amber-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">JBP Coins</p>
                  <p className="text-3xl font-bold text-amber-900 mt-2">{overview.jbpCoins}</p>
                  <p className="text-xs text-amber-700 mt-2">+{overview.totalJbpEarned} earned</p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-amber-200">
                  <Coins className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Topic Performance */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                  <BarChart3 className="h-5 w-5 text-indigo-600" />
                </div>
                Topic Performance
              </h3>
              <div className="space-y-5">
                {Object.entries(topicPerformance).map(([topic, performance]) => (
                  <div key={topic} className="pb-4 last:pb-0 last:border-b-0 border-b border-gray-100">
                    <div className="flex justify-between items-baseline mb-3">
                      <span className="font-semibold text-gray-900">{topic}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColor(performance.averageScore)}`}>
                        {performance.averageScore}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mb-2 font-medium">
                      <span>Attempted: {performance.attempted}</span>
                      <span>Passed: {performance.passed}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${(performance.passed / performance.attempted) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Performance */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <div className="p-2 bg-amber-100 rounded-lg mr-3">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                Recent Attempts
              </h3>
              <div className="space-y-3">
                {recentSubmissions.slice(0, 5).map((submission) => (
                  <div key={submission.id} className="flex justify-between items-center p-3.5 bg-gradient-to-r from-gray-50 to-transparent rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{submission.quizTitle}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{submission.topic}</p>
                    </div>
                    <div className="text-right ml-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getScoreColor(submission.score)}`}>
                        {submission.score}%
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* All Quiz Attempts */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <Trophy className="h-5 w-5 text-purple-600" />
                </div>
                All Attempts
              </h3>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="border border-gray-300 bg-white text-gray-900 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto"
              >
                <option value="all">All Topics</option>
                {Object.keys(topicPerformance).map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Quiz
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Topic
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSubmissions.map((submission, idx) => (
                    <tr key={submission.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition-colors`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{submission.quizTitle}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1.5 inline-flex text-xs font-bold rounded-full bg-indigo-100 text-indigo-700">
                          {submission.topic}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex ${getScoreColor(submission.score)}`}>
                          {submission.score}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex ${getPassedColor(submission.passed)}`}>
                          {submission.passed ? '✓ Passed' : '✗ Failed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleViewReport(submission.id)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                            title="View Report"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadReport(submission.id, submission.quizTitle)}
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Download PDF Report"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          {submission.passed && (
                            <button
                              onClick={() => handleDownloadCertificate(submission.id, submission.quizTitle)}
                              className="p-1.5 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                              title="Download Certificate"
                            >
                              <Medal className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredSubmissions.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No quiz attempts found for the selected topic.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuizAnalytics;
