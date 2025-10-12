import { useEffect, useState } from 'react';
import { Briefcase, CheckCircle, Clock, XCircle } from 'lucide-react';
import axios from '../../utils/axios';

const InternshipAnalytics = () => {
  const [internships, setInternships] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInternshipData();
  }, []);

  const fetchInternshipData = async () => {
    try {
      console.log('Fetching internship enrollments...');
      // Add timeout to prevent hanging requests
      const response = await Promise.race([
        axios.get('/api/v1/internships/user/enrollments'),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        )
      ]);
      console.log('Internship response:', response.data);
      
      const enrollments = response.data?.enrollments || response.data?.data || [];
      
      // Limit to recent internships to improve performance
      const recentEnrollments = Array.isArray(enrollments) ? enrollments.slice(0, 20) : [];
      
      setInternships(recentEnrollments);
      
      const active = recentEnrollments.filter(e => e.status === 'active').length;
      const completed = recentEnrollments.filter(e => e.status === 'completed').length;
      const pending = recentEnrollments.filter(e => e.status === 'pending').length;

      setStats({
        total: recentEnrollments.length,
        active,
        completed,
        pending
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching internship data:', error);
      console.error('Error details:', error.response?.data);
      setLoading(false);
    }
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
      <h1 className="text-3xl font-bold text-white mb-8">Internship Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Total</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats.total}</h3>
            </div>
            <Briefcase className="w-10 h-10 text-blue-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Active</p>
              <h3 className="text-3xl font-bold text-green-400 mt-1">{stats.active}</h3>
            </div>
            <Clock className="w-10 h-10 text-green-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Completed</p>
              <h3 className="text-3xl font-bold text-purple-400 mt-1">{stats.completed}</h3>
            </div>
            <CheckCircle className="w-10 h-10 text-purple-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Pending</p>
              <h3 className="text-3xl font-bold text-orange-400 mt-1">{stats.pending}</h3>
            </div>
            <XCircle className="w-10 h-10 text-orange-400" />
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Your Internships</h3>
        <div className="space-y-4">
          {internships.length > 0 ? (
            internships.map((internship, index) => (
              <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-white">
                      {internship.internshipTitle || 'Internship'}
                    </h4>
                    <p className="text-sm text-gray-300 mt-1">
                      {internship.company || 'Company Name'}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Enrolled: {new Date(internship.enrolledAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    internship.status === 'completed' ? 'bg-green-900/50 text-green-300' :
                    internship.status === 'active' ? 'bg-blue-900/50 text-blue-300' :
                    'bg-orange-900/50 text-orange-300'
                  }`}>
                    {internship.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 py-8">No internships enrolled yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InternshipAnalytics;