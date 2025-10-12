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
        <div className="min-h-screen bg-transparent flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Please Login</h2>
            <p className="text-gray-300">You need to be logged in to view quiz analytics.</p>
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
            <p className="text-gray-300">Loading analytics...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!analytics) {
    return (
      <Layout>
        <div className="min-h-screen bg-transparent flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">No Quiz Data</h2>
            <p className="text-gray-300 mb-6">You haven't taken any quizzes yet.</p>
            <button
              onClick={() => navigate('/quiz')}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
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
      <div className="min-h-screen bg-transparent py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Quiz Analytics Dashboard</h1>
                <p className="text-gray-300">Track your quiz performance and earn JBP coins!</p>
              </div>
              <button
                onClick={async () => {
                  try {
                    const response = await axiosInstance.get(ApiRoutes.quizzes.debugSubmissions);
                    console.log('🔍 DEBUG RESPONSE:', response.data);
                    alert('Debug info logged to console. Check browser dev tools.');
                  } catch (error) {
                    console.error('Debug error:', error);
                    alert('Debug failed. Check console for errors.');
                  }
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
              >
                🔍 Debug Submissions
              </button>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-md p-6 border border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Total Quizzes</p>
                  <p className="text-2xl font-bold text-white">{overview.totalQuizzes}</p>
                </div>
                <BookOpen className="h-8 w-8 text-purple-400" />
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-md p-6 border border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Pass Rate</p>
                  <p className="text-2xl font-bold text-green-400">{overview.passRate}%</p>
                </div>
                <Target className="h-8 w-8 text-green-400" />
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-md p-6 border border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Average Score</p>
                  <p className="text-2xl font-bold text-blue-400">{overview.averageScore}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-md p-6 border border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">JBP Coins</p>
                  <p className="text-2xl font-bold text-yellow-400">{overview.jbpCoins}</p>
                  <p className="text-xs text-gray-400">Earned: {overview.totalJbpEarned}</p>
                </div>
                <Coins className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Topic Performance */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-md p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Topic Performance
              </h3>
              <div className="space-y-4">
                {Object.entries(topicPerformance).map(([topic, performance]) => (
                  <div key={topic} className="border-b border-gray-600 pb-3 last:border-b-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-white">{topic}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(performance.averageScore)}`}>
                        {performance.averageScore}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-300">
                      <span>Attempted: {performance.attempted}</span>
                      <span>Passed: {performance.passed}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${(performance.passed / performance.attempted) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Performance */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-md p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Recent Performance
              </h3>
              <div className="space-y-3">
                {recentSubmissions.slice(0, 5).map((submission) => (
                  <div key={submission.id} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-white text-sm">{submission.quizTitle}</p>
                      <p className="text-xs text-gray-300">{submission.topic}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(submission.score)}`}>
                        {submission.score}%
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* All Quiz Attempts */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-md p-6 border border-gray-700/50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                All Quiz Attempts
              </h3>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="border border-gray-600 bg-gray-700 text-white rounded-md px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
              >
                <option value="all">All Topics</option>
                {Object.keys(topicPerformance).map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-600">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Quiz
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Topic
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800/50 divide-y divide-gray-600">
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{submission.quizTitle}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-900/50 text-purple-300">
                          {submission.topic}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(submission.score)}`}>
                          {submission.score}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPassedColor(submission.passed)}`}>
                          {submission.passed ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewReport(submission.id)}
                            className="text-purple-400 hover:text-purple-300 flex items-center"
                            title="View Report"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadReport(submission.id, submission.quizTitle)}
                            className="text-blue-400 hover:text-blue-300 flex items-center"
                            title="Download PDF Report"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          {/* Certificate download button - only show for passed quizzes */}
                          {submission.passed && (
                            <button
                              onClick={() => handleDownloadCertificate(submission.id, submission.quizTitle)}
                              className="text-yellow-400 hover:text-yellow-300 flex items-center"
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
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No quiz attempts found for the selected topic.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuizAnalytics;