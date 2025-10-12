import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { CheckCircle, XCircle, Clock, Code } from 'lucide-react';
import axios from '../../utils/axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DSAAnalytics = () => {
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    solved: 0,
    attempted: 0,
    easy: 0,
    medium: 0,
    hard: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDSAData();
    
    // Listen for localStorage changes to update stats in real-time
    const handleStorageChange = () => {
      console.log('localStorage changed, refreshing DSA stats...');
      fetchDSAData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events when localStorage is updated from same tab
    window.addEventListener('solvedProblemsUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('solvedProblemsUpdated', handleStorageChange);
    };
  }, []);

  const fetchDSAData = async () => {
    try {
      console.log('Fetching problems and user status...');
      // Reduce limit to improve loading time
      const response = await axios.get('/api/v1/problems', { 
        params: { limit: 400 } // Reduced from 1000 to 50
      });
      console.log('Problems response:', response.data);
      
      // Extract problems array with multiple fallbacks
      let problemsData = [];
      if (response.data?.data?.problems && Array.isArray(response.data.data.problems)) {
        problemsData = response.data.data.problems;
      } else if (response.data?.problems && Array.isArray(response.data.problems)) {
        problemsData = response.data.problems;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        problemsData = response.data.data;
      }

      console.log('Parsed problems array:', problemsData.length, 'problems');
      
      // Check localStorage for solved problems as fallback
      const solvedProblems = JSON.parse(localStorage.getItem('solvedProblems') || '[]');
      
      // Filter by userStatus (with localStorage fallback)
      const solvedCount = Array.isArray(problemsData) ? problemsData.filter(p => {
        return p.userStatus === 'Solved' || solvedProblems.includes(p._id);
      }).length : 0;
      
      const attemptedCount = Array.isArray(problemsData) ? problemsData.filter(p => {
        return p.userStatus === 'Attempted' && !solvedProblems.includes(p._id);
      }).length : 0;
      
      setProblems(Array.isArray(problemsData) ? problemsData.slice(0, 10) : []); // Recent 10 problems
      
      // Calculate stats by difficulty
      const easy = Array.isArray(problemsData) ? problemsData.filter(p => p.difficulty === 'easy' || p.difficulty === 'Easy').length : 0;
      const medium = Array.isArray(problemsData) ? problemsData.filter(p => p.difficulty === 'medium' || p.difficulty === 'Medium').length : 0;
      const hard = Array.isArray(problemsData) ? problemsData.filter(p => p.difficulty === 'hard' || p.difficulty === 'Hard').length : 0;

      setStats({
        total: problemsData.length,
        solved: solvedCount,
        attempted: attemptedCount,
        easy,
        medium,
        hard
      });
      
      console.log('DSA Stats:', {
        total: problemsData.length,
        solved: solvedCount,
        attempted: attemptedCount,
        solvedProblemsFromStorage: solvedProblems
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching DSA data:', error);
      console.error('Error details:', error.response?.data);
      setLoading(false);
    }
  };

  const difficultyData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [{
      label: 'Problems by Difficulty',
      data: [stats.easy, stats.medium, stats.hard],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      borderRadius: 8
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">DSA Problems Analytics</h1>
        <button
          onClick={fetchDSAData}
          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Total Problems</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats.total}</h3>
            </div>
            <Code className="w-12 h-12 text-blue-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Solved</p>
              <h3 className="text-3xl font-bold text-green-400 mt-1">{stats.solved}</h3>
            </div>
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
        </div>

        {/* <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Attempted</p>
              <h3 className="text-3xl font-bold text-orange-400 mt-1">{stats.attempted}</h3>
            </div>
            <Clock className="w-12 h-12 text-orange-400" />
          </div>
        </div> */}
      </div>

      {/* Chart and Recent Problems */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Difficulty Distribution</h3>
          <div className="h-80">
            <Bar 
              data={difficultyData}
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
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Problems</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {problems.length > 0 ? (
              problems.map((problem, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-white">{problem.title}</h4>
                    <p className="text-xs text-gray-300 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        problem.difficulty === 'easy' || problem.difficulty === 'Easy' ? 'bg-green-900/50 text-green-300' :
                        problem.difficulty === 'medium' || problem.difficulty === 'Medium' ? 'bg-yellow-900/50 text-yellow-300' :
                        'bg-red-900/50 text-red-300'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </p>
                  </div>
                  {problem.userStatus === 'Solved' ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : problem.userStatus === 'Attempted' ? (
                    <Clock className="w-5 h-5 text-orange-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-8">No problems found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSAAnalytics;