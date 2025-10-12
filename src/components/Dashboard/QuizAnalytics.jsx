import { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Trophy, Target, TrendingUp, Award } from 'lucide-react';
import axios from '../../utils/axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const QuizAnalytics = () => {
  const [quizData, setQuizData] = useState([]);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    highestScore: 0,
    totalAttempts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizData();
  }, []);

  const fetchQuizData = async () => {
    try {
      console.log('Fetching quiz submissions...');
      // Add timeout to prevent hanging requests
      const response = await Promise.race([
        axios.get('/api/v1/quizzes/submissions'),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        )
      ]);
      console.log('Quiz response:', response.data);
      
      // Extract submissions array with multiple fallbacks
      let submissions = [];
      if (response.data?.submissions && Array.isArray(response.data.submissions)) {
        submissions = response.data.submissions;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        submissions = response.data.data;
      }

      console.log('Parsed submissions array:', submissions.length, 'submissions');
      
      // Limit to recent 10 submissions to improve performance
      const recentSubmissions = Array.isArray(submissions) ? submissions.slice(0, 10) : [];
      
      // Extract quiz names from populated quizId field
      const submissionsWithQuizNames = recentSubmissions.map((submission) => {
        // Check if quizId is populated
        let quizTitle = 'Unknown Quiz';
        
        if (submission.quizId && typeof submission.quizId === 'object') {
          // quizId is populated with quiz details
          quizTitle = submission.quizId.title || 'Unknown Quiz';
        } else if (submission.quiz && typeof submission.quiz === 'object') {
          // Alternative field name
          quizTitle = submission.quiz.title || 'Unknown Quiz';
        } else if (submission.quizTitle) {
          // Direct title field
          quizTitle = submission.quizTitle;
        }
        
        return {
          ...submission,
          quizTitle
        };
      });
      
      setQuizData(submissionsWithQuizNames);
      
      if (Array.isArray(submissions) && submissions.length > 0) {
        const scores = submissions.map(s => s.score || 0);
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        const maxScore = Math.max(...scores);
        
        setStats({
          totalQuizzes: submissions.length,
          averageScore: Math.round(avgScore),
          highestScore: Math.round(maxScore),
          totalAttempts: submissions.length
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching quiz data:', error);
      console.error('Error details:', error.response?.data);
      setLoading(false);
    }
  };

  const scoreData = {
    labels: quizData.map((q, i) => q.quizTitle || `Quiz ${i + 1}`),
    datasets: [{
      label: 'Score %',
      data: quizData.map(q => q.score || 0),
      borderColor: 'rgb(168, 85, 247)',
      backgroundColor: 'rgba(168, 85, 247, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Quiz Analytics</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Total Quizzes</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats.totalQuizzes}</h3>
            </div>
            <Trophy className="w-10 h-10 text-purple-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Average Score</p>
              <h3 className="text-3xl font-bold text-blue-400 mt-1">{stats.averageScore}%</h3>
            </div>
            <Target className="w-10 h-10 text-blue-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Highest Score</p>
              <h3 className="text-3xl font-bold text-green-400 mt-1">{stats.highestScore}%</h3>
            </div>
            <Award className="w-10 h-10 text-green-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Total Attempts</p>
              <h3 className="text-3xl font-bold text-orange-400 mt-1">{stats.totalAttempts}</h3>
            </div>
            <TrendingUp className="w-10 h-10 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Score Trend Chart */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Score Trend</h3>
        <div className="h-80">
          {quizData.length > 0 ? (
            <Line 
              data={scoreData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                  legend: { 
                    display: false,
                    labels: {
                      color: '#e2e8f0' // Light gray text for legend
                    }
                  } 
                },
                scales: {
                  y: { 
                    beginAtZero: true, 
                    max: 100, 
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    ticks: {
                      color: '#e2e8f0' // Light gray text for ticks
                    }
                  },
                  x: { 
                    grid: { display: false },
                    ticks: {
                      color: '#e2e8f0' // Light gray text for ticks
                    }
                  }
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">No quiz data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Quiz Results */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Quiz Results</h3>
        <div className="space-y-3">
          {quizData.length > 0 ? (
            quizData.map((quiz, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => window.location.href = `/quiz/report/${quiz._id}`}
              >
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {quiz.quizTitle || `Quiz ${index + 1}`}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(quiz.submittedAt || quiz.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${
                    quiz.score >= 80 ? 'text-green-600' :
                    quiz.score >= 60 ? 'text-blue-600' :
                    quiz.score >= 40 ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    {quiz.score}%
                  </p>
                  <p className="text-xs text-gray-500">
                    {quiz.correctAnswers}/{quiz.totalQuestions} correct
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No quiz attempts yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizAnalytics;