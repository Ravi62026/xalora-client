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
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-amber-100 text-amber-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const techStackOptions = [
    'React', 'Node.js', 'Python', 'Java', 'JavaScript', 'MongoDB',
    'SQL', 'AWS', 'Docker', 'Git', 'HTML/CSS', 'Flutter'
  ];

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen xalora-grid-bg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading internships...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen xalora-grid-bg">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Internships</h1>
                <p className="text-gray-600">Discover and enroll in project-based learning opportunities</p>
              </div>
              <Link
                to="/internships/enrolled"
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 w-fit"
              >
                <Users className="w-4 h-4" />
                My Internships
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 sm:p-6 mb-8">
            <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search internships..."
                  className="w-full rounded-lg border-b-2 border-gray-300 bg-transparent pl-10 pr-4 py-2.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-600 transition-all duration-200"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>

              {/* Difficulty Filter */}
              <select
                className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              >
                <option value="all">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              {/* Tech Stack Filter */}
              <select
                className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                value={filters.techStack}
                onChange={(e) => handleFilterChange('techStack', e.target.value)}
              >
                <option value="">All Technologies</option>
                {techStackOptions.map(tech => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
              </select>

              {/* Clear Filters */}
              <button
                type="button"
                onClick={() => setFilters({ difficulty: 'all', techStack: '', search: '', page: 1, limit: 12 })}
                className="rounded-lg border border-gray-200 bg-white text-gray-900 px-4 py-2.5 hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Reset
              </button>
            </form>
          </div>

          {/* Internships Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {internships.map((internship) => (
              <div
                key={internship._id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/internships/${internship._id}`)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">{internship.title}</h3>
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap ${getDifficultyColor(internship.difficulty)}`}>
                      {internship.difficulty}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{internship.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {internship.techStack?.slice(0, 3).map((tech, index) => (
                      <span key={index} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs rounded font-medium">
                        {tech}
                      </span>
                    ))}
                    {internship.techStack?.length > 3 && (
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium">
                        +{internship.techStack.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{internship.duration} days</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-indigo-600 text-sm">
                      {internship.stipend ? `₹${internship.stipend}/month` : 'Unpaid'}
                    </div>
                    <button
                      className="flex items-center text-indigo-600 hover:text-indigo-700 transition-colors duration-200 text-sm font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/internships/${internship._id}`);
                      }}
                    >
                      View
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>

                {enrolledInternships.has(internship._id) && (
                  <div className="px-6 py-3 bg-green-50 border-t border-green-100">
                    <div className="flex items-center text-green-700 text-sm font-medium">
                      <Users className="w-4 h-4 mr-2" />
                      <span>✓ Enrolled</span>
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
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all ${pagination.hasPrevPage
                      ? "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                    }`}
                >
                  Previous
                </button>
                {[...Array(pagination.totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2.5 rounded-lg font-medium transition-all ${page === pagination.currentPage
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border border-indigo-600"
                          : "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all ${pagination.hasNextPage
                      ? "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                    }`}
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
