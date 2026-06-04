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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Internship Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase">Total</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-green-600 uppercase">Active</p>
              <h3 className="text-3xl font-bold text-green-600 mt-2">{stats.active}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-600 uppercase">Completed</p>
              <h3 className="text-3xl font-bold text-purple-600 mt-2">{stats.completed}</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-600 uppercase">Pending</p>
              <h3 className="text-3xl font-bold text-amber-600 mt-2">{stats.pending}</h3>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <XCircle className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Your Internships</h3>
        <div className="space-y-3">
          {internships.length > 0 ? (
            internships.map((internship, index) => (
              <div key={index} className="p-4 bg-gray-50 border border-gray-100 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900">
                      {internship.internshipTitle || 'Internship'}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {internship.company || 'Company Name'}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Enrolled: {new Date(internship.enrolledAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded text-xs font-bold ml-4 whitespace-nowrap ${
                    internship.status === 'completed' ? 'bg-green-100 text-green-700' :
                    internship.status === 'active' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {internship.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 py-8 font-medium">No internships enrolled yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InternshipAnalytics;