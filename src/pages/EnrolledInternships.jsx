import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../utils/axios';
import ApiRoutes from '../routes/routes';
import Layout from '../components/Layout';
import {
  Calendar,
  Clock,
  Download,
  FileText,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Award,
  ChevronRight
} from 'lucide-react';

const EnrolledInternships = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector(state => state.user);

  useEffect(() => {
    if (user) {
      fetchEnrollments();
    }
  }, [user]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      // Add cache-busting parameter to prevent browser caching
      const response = await axios.get(`${ApiRoutes.internships.getEnrolled}?_t=${Date.now()}`);
      
      // Log cache information for debugging
      console.log('Enrollments API Response:', response);
      
      setEnrollments(response.data.data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'enrolled': return 'bg-blue-100 text-blue-800';
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'enrolled': return <BookOpen className="w-4 h-4" />;
      case 'submitted': return <FileText className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getDaysRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressPercentage = (enrollment) => {
    // Add null check for internshipId
    if (!enrollment.internshipId) {
      return 0;
    }
    
    const totalDays = enrollment.internshipId.duration;
    const enrolledDate = new Date(enrollment.enrolledAt);
    const now = new Date();
    const elapsedDays = Math.floor((now - enrolledDate) / (1000 * 60 * 60 * 24));
    return Math.min((elapsedDays / totalDays) * 100, 100);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your internships...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Internships</h1>
                <p className="mt-2 text-gray-600">Track your internship progress and manage submissions</p>
              </div>
              <Link
                to="/internships"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Browse More
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {enrollments.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No internships enrolled</h3>
              <p className="text-gray-600 mb-6">Start your internship journey by enrolling in available opportunities.</p>
              <Link
                to="/internships"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Browse Internships
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {enrollments.map((enrollment) => {
                const internship = enrollment.internshipId;
                // Add null check for internship
                if (!internship) {
                  return null; // Skip rendering if internship data is missing
                }
                
                const daysRemaining = getDaysRemaining(enrollment.deadline);
                const progressPercentage = getProgressPercentage(enrollment);

                return (
                  <div key={enrollment._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {internship.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enrollment.status)} flex items-center`}>
                              {getStatusIcon(enrollment.status)}
                              <span className="ml-1">
                                {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                              </span>
                            </span>
                            <span className="text-sm text-gray-500">
                              {internship.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Deadline */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>
                            {daysRemaining > 0
                              ? `${daysRemaining} days remaining`
                              : daysRemaining === 0
                              ? 'Due today'
                              : `${Math.abs(daysRemaining)} days overdue`
                            }
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Due: {new Date(enrollment.deadline).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        {enrollment.status === 'enrolled' && (
                          <Link
                            to={`/internships/submit/${enrollment._id}`}
                            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Submit Project
                          </Link>
                        )}

                        {enrollment.status === 'submitted' && (
                          <div className="w-full bg-yellow-50 border border-yellow-200 text-yellow-800 py-2 px-4 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Awaiting Review
                          </div>
                        )}

                        {enrollment.status === 'completed' && (
                          <div className="space-y-2">
                            <div className="w-full bg-green-50 border border-green-200 text-green-800 py-2 px-4 rounded-lg flex items-center justify-center">
                              <Award className="w-4 h-4 mr-2" />
                              Completed Successfully
                            </div>
                            <button
                              onClick={() => window.open(ApiRoutes.internships.downloadCertificate(enrollment.submissionId || enrollment._id), '_blank')}
                              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download Certificate
                            </button>
                          </div>
                        )}

                        {enrollment.status === 'rejected' && (
                          <div className="space-y-2">
                            <div className="w-full bg-red-50 border border-red-200 text-red-800 py-2 px-4 rounded-lg flex items-center justify-center">
                              <AlertCircle className="w-4 h-4 mr-2" />
                              Submission Rejected
                            </div>
                            <Link
                              to={`/internships/submit/${enrollment._id}`}
                              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Resubmit Project
                            </Link>
                          </div>
                        )}

                        {/* Offer Letter Button - Available for all enrolled users */}
                        <button
                          onClick={() => window.open(ApiRoutes.internships.downloadOfferLetter(enrollment._id), '_blank')}
                          className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Offer Letter
                        </button>
                      </div>

                      {/* Tech Stack */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex flex-wrap gap-1">
                          {internship.techStack.slice(0, 4).map((tech) => (
                            <span key={tech} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-md">
                              {tech}
                            </span>
                          ))}
                          {internship.techStack.length > 4 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                              +{internship.techStack.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Stats Summary */}
          {enrollments.length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Internship Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{enrollments.length}</div>
                  <div className="text-sm text-gray-600">Total Enrolled</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {enrollments.filter(e => e.status === 'enrolled').length}
                  </div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {enrollments.filter(e => e.status === 'submitted').length}
                  </div>
                  <div className="text-sm text-gray-600">Under Review</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {enrollments.filter(e => e.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EnrolledInternships;