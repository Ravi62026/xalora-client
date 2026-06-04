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
      case 'enrolled': return 'bg-blue-100 text-blue-700';
      case 'submitted': return 'bg-amber-100 text-amber-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
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
        <div className="min-h-screen xalora-grid-bg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading your internships...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen xalora-grid-bg">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">My Internships</h1>
                <p className="text-gray-600">Track progress and manage your submissions</p>
              </div>
              <Link
                to="/internships"
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 w-fit"
              >
                <BookOpen className="w-4 h-4" />
                Browse More
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {enrollments.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-100 shadow-sm">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No internships enrolled</h3>
              <p className="text-gray-600 mb-6">Start your internship journey by enrolling in available opportunities.</p>
              <Link
                to="/internships"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all inline-block font-semibold shadow-md hover:shadow-lg"
              >
                Browse Internships
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {enrollments.map((enrollment) => {
                const internship = enrollment.internshipId;
                if (!internship) {
                  return null;
                }

                const daysRemaining = getDaysRemaining(enrollment.deadline);
                const progressPercentage = getProgressPercentage(enrollment);

                return (
                  <div key={enrollment._id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-6">
                      {/* Header */}
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-1">
                          {internship.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-1 rounded text-xs font-bold ${getStatusColor(enrollment.status)} flex items-center`}>
                            {getStatusIcon(enrollment.status)}
                            <span className="ml-1">
                              {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                            </span>
                          </span>
                          <span className="px-2.5 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                            {internship.difficulty}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                          <span>Progress</span>
                          <span>{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Deadline */}
                      <div className="flex items-center justify-between mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="flex items-center text-sm text-gray-700 font-medium">
                          <Clock className="w-4 h-4 mr-2 text-indigo-600" />
                          <span className={daysRemaining < 3 ? "text-red-600 font-semibold" : "text-gray-700"}>
                            {daysRemaining > 0
                              ? `${daysRemaining} days left`
                              : daysRemaining === 0
                                ? 'Due today'
                                : `${Math.abs(daysRemaining)} days overdue`
                            }
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="text-gray-900 font-semibold">{new Date(enrollment.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2.5">
                        {enrollment.status === 'enrolled' && (
                          <Link
                            to={`/internships/submit/${enrollment._id}`}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center font-semibold shadow-md hover:shadow-lg text-sm"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Submit Project
                          </Link>
                        )}

                        {enrollment.status === 'submitted' && (
                          <div className="w-full bg-amber-50 border border-amber-200 text-amber-800 py-2.5 px-4 rounded-lg flex items-center justify-center font-semibold text-sm">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Awaiting Review
                          </div>
                        )}

                        {enrollment.status === 'completed' && (
                          <div className="space-y-2.5">
                            <div className="w-full bg-green-50 border border-green-200 text-green-800 py-2.5 px-4 rounded-lg flex items-center justify-center font-semibold text-sm">
                              <Award className="w-4 h-4 mr-2" />
                              Completed Successfully
                            </div>
                            <button
                              onClick={() => window.open(ApiRoutes.internships.downloadCertificate(enrollment.submissionId || enrollment._id), '_blank')}
                              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center font-semibold shadow-md hover:shadow-lg text-sm"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download Certificate
                            </button>
                          </div>
                        )}

                        {enrollment.status === 'rejected' && (
                          <div className="space-y-2.5">
                            <div className="w-full bg-red-50 border border-red-200 text-red-800 py-2.5 px-4 rounded-lg flex items-center justify-center font-semibold text-sm">
                              <AlertCircle className="w-4 h-4 mr-2" />
                              Submission Rejected
                            </div>
                            <Link
                              to={`/internships/submit/${enrollment._id}`}
                              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center font-semibold shadow-md hover:shadow-lg text-sm"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Resubmit Project
                            </Link>
                          </div>
                        )}

                        <button
                          onClick={() => window.open(ApiRoutes.internships.downloadOfferLetter(enrollment._id), '_blank')}
                          className="w-full bg-white border border-gray-300 text-gray-900 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center font-semibold text-sm"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Offer Letter
                        </button>
                      </div>

                      {/* Tech Stack */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex flex-wrap gap-2">
                          {internship.techStack.slice(0, 4).map((tech) => (
                            <span key={tech} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs rounded font-medium">
                              {tech}
                            </span>
                          ))}
                          {internship.techStack.length > 4 && (
                            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium">
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
            <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Internship Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-700">{enrollments.length}</div>
                  <div className="text-sm text-purple-600 font-medium mt-1">Total Enrolled</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-700">
                    {enrollments.filter(e => e.status === 'enrolled').length}
                  </div>
                  <div className="text-sm text-blue-600 font-medium mt-1">In Progress</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                  <div className="text-2xl font-bold text-amber-700">
                    {enrollments.filter(e => e.status === 'submitted').length}
                  </div>
                  <div className="text-sm text-amber-600 font-medium mt-1">Under Review</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-700">
                    {enrollments.filter(e => e.status === 'completed').length}
                  </div>
                  <div className="text-sm text-green-600 font-medium mt-1">Completed</div>
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