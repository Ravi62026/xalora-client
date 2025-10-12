import React from 'react';
import { useEffect, useState } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { TrendingUp, Code, Trophy, Briefcase, Target } from 'lucide-react';
import axios from '../../utils/axios';
import subscriptionService from '../../services/subscriptionService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StatCard = ({ title, value, icon, color, trend }) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-300 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white">{value}</h3>
        {trend && (
          <p className="text-sm text-green-400 mt-2 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </p>
        )}
      </div>
      <div className={`p-4 rounded-lg ${color}`}>
        {React.createElement(icon, { className: "w-8 h-8 text-white" })}
      </div>
    </div>
  </div>
);

const SubscriptionCard = ({ subscription }) => {
  if (!subscription) return null;

  const getPlanDetails = () => {
    const plans = {
      "spark": {
        name: "Xalora Spark",
        color: "bg-gray-500"
      },
      "pulse": {
        name: "Xalora Pulse",
        color: "bg-blue-500"
      },
      "nexus": {
        name: "Xalora Nexus",
        color: "bg-purple-500"
      },
      "infinity": {
        name: "Xalora Infinity",
        color: "bg-amber-500"
      }
    };
    
    return plans[subscription.planId] || plans["spark"];
  };

  const planDetails = getPlanDetails();
  const endDate = subscription.endDate ? new Date(subscription.endDate) : null;
  const daysLeft = endDate ? Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Subscription</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${planDetails.color}`}>
          {planDetails.name}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-300">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Monthly Plan</span>
        </div>
        
        {endDate && (
          <div className="flex items-center text-sm text-gray-300">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Expires on: {endDate.toLocaleDateString()}</span>
          </div>
        )}
        
        {daysLeft > 0 && (
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-green-400">{daysLeft} days remaining</span>
          </div>
        )}
        
        {daysLeft <= 0 && (
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-red-400">Subscription expired</span>
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <a 
          href="/pricing" 
          className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center"
        >
          Manage subscription
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
};

const OverviewAnalytics = () => {
  const [stats, setStats] = useState({
    totalProblems: 0,
    totalQuizzes: 0,
    totalInternships: 0,
    totalSubmissions: 0
  });
  const [weeklyActivity, setWeeklyActivity] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [progressData, setProgressData] = useState({ solved: 0, attempted: 0, unattempted: 0 });
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverviewData();
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const subscriptionData = await subscriptionService.getCurrentSubscription();
      setSubscription(subscriptionData.data);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    }
  };

  const fetchOverviewData = async () => {
    try {
      console.log('Fetching overview data...');
      
      // Fetch all data in parallel to reduce loading time
      const [problemsRes, quizRes, internshipsRes] = await Promise.all([
        axios.get('/api/v1/problems', { params: { limit: 100 } }).catch(() => ({ data: { problems: [] } })),
        axios.get('/api/v1/quizzes/submissions').catch(() => ({ data: { submissions: [] } })),
        axios.get('/api/v1/internships/user/enrollments').catch(() => ({ data: { enrollments: [] } }))
      ]);

      console.log('Problems response:', problemsRes.data);
      console.log('Quizzes:', quizRes.data);
      console.log('Internships:', internshipsRes.data);

      // Extract problems array with multiple fallbacks
      let problems = [];
      if (problemsRes.data?.data?.problems && Array.isArray(problemsRes.data.data.problems)) {
        problems = problemsRes.data.data.problems;
      } else if (problemsRes.data?.problems && Array.isArray(problemsRes.data.problems)) {
        problems = problemsRes.data.problems;
      } else if (problemsRes.data?.data && Array.isArray(problemsRes.data.data)) {
        problems = problemsRes.data.data;
      }

      console.log('Parsed problems array:', problems.length, 'problems');

      // Extract quizzes array
      let quizzes = [];
      if (quizRes.data?.submissions && Array.isArray(quizRes.data.submissions)) {
        quizzes = quizRes.data.submissions;
      } else if (quizRes.data?.data && Array.isArray(quizRes.data.data)) {
        quizzes = quizRes.data.data;
      }

      // Extract internships array
      let internships = [];
      if (internshipsRes.data?.data && Array.isArray(internshipsRes.data.data)) {
        internships = internshipsRes.data.data;
      } else if (internshipsRes.data?.enrollments && Array.isArray(internshipsRes.data.enrollments)) {
        internships = internshipsRes.data.enrollments;
      }

      console.log('Parsed data:', {
        problemsCount: problems.length,
        quizzesCount: quizzes.length,
        internshipsCount: internships.length
      });

      // Check localStorage for solved problems as fallback (like in DSAAnalytics)
      const solvedProblems = JSON.parse(localStorage.getItem('solvedProblems') || '[]');
      
      // Count solved and attempted problems based on userStatus (with localStorage fallback)
      const solvedProblemsCount = Array.isArray(problems) ? problems.filter(p => {
        return p.userStatus === 'Solved' || solvedProblems.includes(p._id);
      }).length : 0;
      
      const attemptedProblemsCount = Array.isArray(problems) ? problems.filter(p => {
        return p.userStatus === 'Attempted' && !solvedProblems.includes(p._id);
      }).length : 0;

      setStats({
        totalProblems: solvedProblemsCount,
        totalQuizzes: Array.isArray(quizzes) ? quizzes.length : 0,
        totalInternships: Array.isArray(internships) ? internships.length : 0,
        totalSubmissions: attemptedProblemsCount + solvedProblemsCount // Total attempted problems (both attempted and solved)
      });

      // Calculate weekly activity (last 7 days)
      const today = new Date();
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (6 - i));
        return date.toDateString();
      });

      const activityByDay = last7Days.map(day => {
        const dayProblems = Array.isArray(problems) ? problems.filter(p => {
          if (p.solvedAt) {
            return new Date(p.solvedAt).toDateString() === day;
          }
          return false;
        }).length : 0;

        const dayQuizzes = Array.isArray(quizzes) ? quizzes.filter(q => {
          if (q.submittedAt || q.createdAt) {
            return new Date(q.submittedAt || q.createdAt).toDateString() === day;
          }
          return false;
        }).length : 0;

        return dayProblems + dayQuizzes;
      });

      setWeeklyActivity(activityByDay);

      // Calculate progress data - remove attempted from the chart
      const totalProblemsCount = Array.isArray(problems) ? problems.length : 0;
      const unattemptedCount = totalProblemsCount - solvedProblemsCount;
      
      setProgressData({
        solved: solvedProblemsCount,
        attempted: 0, // Not used in chart anymore
        unattempted: unattemptedCount > 0 ? unattemptedCount : 0
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching overview data:', error);
      console.error('Error details:', error.response?.data);
      setLoading(false);
    }
  };

  const activityChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Activity (Problems + Quizzes)',
        data: weeklyActivity,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const performanceData = {
    labels: ['Solved', 'Not Started'], // Remove 'Attempted' from labels
    datasets: [{
      data: [progressData.solved, progressData.unattempted], // Remove attempted from data
      backgroundColor: ['#10b981', '#e5e7eb'],
      borderWidth: 0
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
      <h1 className="text-3xl font-bold text-white mb-8">Overview</h1>
      
      {/* Stats Grid - Removed the Problems Attempted card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Problems Solved"
          value={stats.totalProblems}
          icon={Code}
          color="bg-blue-500"
          trend="+12% this week"
        />
        <StatCard
          title="Quizzes Taken"
          value={stats.totalQuizzes}
          icon={Trophy}
          color="bg-purple-500"
          trend="+8% this week"
        />
        <StatCard
          title="Internships Enrolled"
          value={stats.totalInternships}
          icon={Briefcase}
          color="bg-green-500"
        />
        <SubscriptionCard subscription={subscription} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Weekly Activity</h3>
          <div className="h-80">
            <Line 
              data={activityChartData} 
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
          <h3 className="text-lg font-semibold text-white mb-4">Overall Progress</h3>
          <div className="h-80 flex items-center justify-center">
            <Doughnut 
              data={performanceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                  legend: { 
                    position: 'bottom',
                    labels: {
                      color: '#e2e8f0', // Light gray text for legend
                      padding: 20
                    }
                  } 
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewAnalytics;