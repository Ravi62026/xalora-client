import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../utils/axios';
import ApiRoutes from '../routes/routes';
import Layout from '../components/Layout';
import { Search, Filter, Calendar, Users, Clock, BookOpen, ChevronRight } from 'lucide-react';

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    techStack: '',
    search: '',
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalInternships: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [enrolledInternships, setEnrolledInternships] = useState(new Set());

  const { user } = useSelector(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInternships();
    if (user) {
      fetchEnrolledInternships();
    }
  }, [filters, user]);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.difficulty !== 'all') params.append('difficulty', filters.difficulty);
      if (filters.techStack) params.append('techStack', filters.techStack);
      if (filters.search) params.append('search', filters.search);
      params.append('page', filters.page);
      params.append('limit', filters.limit);

      // Add cache-busting parameter to prevent browser caching
      params.append('_t', Date.now());

      // Use the proper API route instead of direct axios call
      const response = await axios.get(`${ApiRoutes.internships.getAll}?${params}`);

      // Log cache information for debugging
      console.log('Internships API Response:', response);
      if (response.data.message && response.data.message.includes('cached')) {
        console.log('🎯 Data served from server cache');
      } else {
        console.log('🔄 Fresh data fetched from database');
      }

      setInternships(response.data.data.internships);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error fetching internships:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledInternships = async () => {
    try {
      // Add cache-busting parameter to prevent browser caching
      const response = await axios.get(`${ApiRoutes.internships.getEnrolled}?_t=${Date.now()}`);

      // Log cache information for debugging
      console.log('Enrolled Internships API Response:', response);
      if (response.data.message && response.data.message.includes('cached')) {
        console.log('🎯 Enrolled internships served from server cache');
      } else {
        console.log('🔄 Fresh enrolled internships fetched from database');
      }

      const enrolledIds = new Set(response.data.data.map(enrollment => enrollment.internshipId._id));
      setEnrolledInternships(enrolledIds);
    } catch (error) {
      console.error('Error fetching enrolled internships:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 })); // Reset to first page when filters change
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-900/30 text-green-400 border border-green-700';
      case 'intermediate': return 'bg-yellow-900/30 text-yellow-400 border border-yellow-700';
      case 'advanced': return 'bg-red-900/30 text-red-400 border border-red-700';
      default: return 'bg-gray-900/30 text-gray-400 border border-gray-700';
    }
  };

  const techStackOptions = [
    'React', 'Node.js', 'Python', 'Java', 'JavaScript', 'MongoDB',
    'SQL', 'AWS', 'Docker', 'Git', 'HTML/CSS', 'Flutter'
  ];

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-white/70">Loading internships...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Internship Portal</h1>
                <p className="mt-2 text-sm sm:text-base text-emerald-100">Discover and enroll in exciting internship opportunities</p>
              </div>
              <div className="flex space-x-4">
                <Link
                  to="/internships/enrolled"
                  className="bg-white text-emerald-600 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors flex items-center shadow-lg text-sm sm:text-base"
                >
                  <Users className="w-4 h-4 mr-2" />
                  My Internships
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 mb-8 border border-white/10">
            {/* Added onSubmit handler to prevent form submission */}
            <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-white/70" />
                <input
                  type="text"
                  placeholder="Search internships..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-500 transition-all duration-300"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>

              {/* Difficulty Filter */}
              <div>
                <select
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white transition-all duration-300"
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                >
                  <option value="all" className="bg-gray-900">All Difficulties</option>
                  <option value="beginner" className="bg-gray-900">Beginner</option>
                  <option value="intermediate" className="bg-gray-900">Intermediate</option>
                  <option value="advanced" className="bg-gray-900">Advanced</option>
                </select>
              </div>

              {/* Tech Stack Filter */}
              <div>
                <select
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white transition-all duration-300"
                  value={filters.techStack}
                  onChange={(e) => handleFilterChange('techStack', e.target.value)}
                >
                  <option value="" className="bg-gray-900">All Technologies</option>
                  {techStackOptions.map(tech => (
                    <option key={tech} value={tech} className="bg-gray-900">{tech}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <div>
                <button
                  type="button"  // Added type="button" to prevent form submission
                  onClick={() => setFilters({ difficulty: 'all', techStack: '', search: '', page: 1, limit: 12 })}
                  className="w-full px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors border border-white/20"
                >
                  Clear Filters
                </button>
              </div>
            </form>
          </div>

          {/* Internships Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {internships.map((internship) => (
              <div
                key={internship._id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/10 hover:border-emerald-400/30 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                onClick={() => navigate(`/internships/${internship._id}`)}
              >
                <div className="p-5 sm:p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-white line-clamp-1">{internship.title}</h3>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(internship.difficulty)}`}>
                      {internship.difficulty}
                    </span>
                  </div>

                  <p className="text-white/70 mb-4 line-clamp-3 text-sm">{internship.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {internship.techStack?.slice(0, 3).map((tech, index) => (
                      <span key={index} className="px-2 py-1 bg-emerald-900/30 text-emerald-300 text-xs rounded-full border border-emerald-700">
                        {tech}
                      </span>
                    ))}
                    {internship.techStack?.length > 3 && (
                      <span className="px-2 py-1 bg-gray-900/30 text-gray-300 text-xs rounded-full border border-gray-700">
                        +{internship.techStack.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center text-sm text-white/70 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{internship.duration} weeks</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-emerald-400 font-semibold text-sm sm:text-base">
                      {internship.stipend ? `₹${internship.stipend}/month` : 'Unpaid'}
                    </div>
                    <button
                      className="flex items-center text-emerald-400 hover:text-emerald-300 transition-colors duration-300 text-sm sm:text-base"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/internships/${internship._id}`);
                      }}
                    >
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>

                {enrolledInternships.has(internship._id) && (
                  <div className="px-6 py-3 bg-emerald-900/30 border-t border-emerald-700">
                    <div className="flex items-center text-emerald-400 text-sm">
                      <Users className="w-4 h-4 mr-2" />
                      <span>Enrolled</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8 pb-8">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className={`px-4 py-2 rounded-lg ${pagination.hasPrevPage
                      ? "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                      : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                    } transition-all duration-300`}
                >
                  Previous
                </button>
                {[...Array(pagination.totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg ${page === pagination.currentPage
                          ? "bg-emerald-600 text-white border border-emerald-500"
                          : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                        } transition-all duration-300`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className={`px-4 py-2 rounded-lg ${pagination.hasNextPage
                      ? "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                      : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                    } transition-all duration-300`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Internships;