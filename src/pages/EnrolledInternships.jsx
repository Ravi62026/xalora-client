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
      case 'enrolled': return 'bg-blue-900/30 text-blue-400 border border-blue-700/50';
      case 'submitted': return 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/50';
      case 'completed': return 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/50';
      case 'rejected': return 'bg-red-900/30 text-red-400 border border-red-700/50';
      default: return 'bg-gray-900/30 text-gray-400 border border-gray-700/50';
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-white/70">Loading your internships...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        {/* Header */}
        <div className="bg-white/5 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">My Internships</h1>
                <p className="mt-2 text-sm sm:text-base text-gray-300">Track your internship progress and manage submissions</p>
              </div>
              <Link
                to="/internships"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center text-sm sm:text-base shadow-lg shadow-emerald-900/20"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Browse More
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {enrollments.length === 0 ? (
            <div className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No internships enrolled</h3>
              <p className="text-gray-400 mb-6">Start your internship journey by enrolling in available opportunities.</p>
              <Link
                to="/internships"
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors inline-block"
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
                  <div key={enrollment._id} className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 shadow-lg hover:border-emerald-500/30 transition-all">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                            {internship.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enrollment.status)} flex items-center shadow-sm`}>
                              {getStatusIcon(enrollment.status)}
                              <span className="ml-1">
                                {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                              </span>
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700">
                              {internship.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between text-sm text-gray-300 mb-2">
                          <span>Progress</span>
                          <span>{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Deadline */}
                      <div className="flex items-center justify-between mb-6 bg-black/20 p-3 rounded-lg">
                        <div className="flex items-center text-sm text-gray-300">
                          <Clock className="w-4 h-4 mr-2 text-emerald-400" />
                          <span className={daysRemaining < 3 ? "text-red-400 font-medium" : "text-gray-300"}>
                            {daysRemaining > 0
                              ? `${daysRemaining} days remaining`
                              : daysRemaining === 0
                                ? 'Due today'
                                : `${Math.abs(daysRemaining)} days overdue`
                            }
                          </span>
                        </div>
                        <div className="text-sm text-gray-400">
                          Due: <span className="text-white">{new Date(enrollment.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        {enrollment.status === 'enrolled' && (
                          <Link
                            to={`/internships/submit/${enrollment._id}`}
                            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-xl hover:bg-emerald-500 transition-colors flex items-center justify-center font-medium shadow-lg shadow-emerald-900/20"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Submit Project
                          </Link>
                        )}

                        {enrollment.status === 'submitted' && (
                          <div className="w-full bg-yellow-900/20 border border-yellow-500/30 text-yellow-200 py-2 px-4 rounded-xl flex items-center justify-center">
                            <AlertCircle className="w-4 h-4 mr-2 text-yellow-400" />
                            Awaiting Review
                          </div>
                        )}

                        {enrollment.status === 'completed' && (
                          <div className="space-y-3">
                            <div className="w-full bg-emerald-900/20 border border-emerald-500/30 text-emerald-200 py-2 px-4 rounded-xl flex items-center justify-center">
                              <Award className="w-4 h-4 mr-2 text-emerald-400" />
                              Completed Successfully
                            </div>
                            <button
                              onClick={() => window.open(ApiRoutes.internships.downloadCertificate(enrollment.submissionId || enrollment._id), '_blank')}
                              className="w-full bg-purple-600 text-white py-2 px-4 rounded-xl hover:bg-purple-500 transition-colors flex items-center justify-center font-medium shadow-lg shadow-purple-900/20"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download Certificate
                            </button>
                          </div>
                        )}

                        {enrollment.status === 'rejected' && (
                          <div className="space-y-3">
                            <div className="w-full bg-red-900/20 border border-red-500/30 text-red-200 py-2 px-4 rounded-xl flex items-center justify-center">
                              <AlertCircle className="w-4 h-4 mr-2 text-red-400" />
                              Submission Rejected
                            </div>
                            <Link
                              to={`/internships/submit/${enrollment._id}`}
                              className="w-full bg-emerald-600 text-white py-2 px-4 rounded-xl hover:bg-emerald-500 transition-colors flex items-center justify-center font-medium shadow-lg shadow-emerald-900/20"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Resubmit Project
                            </Link>
                          </div>
                        )}

                        {/* Offer Letter Button - Available for all enrolled users */}
                        <button
                          onClick={() => window.open(ApiRoutes.internships.downloadOfferLetter(enrollment._id), '_blank')}
                          className="w-full bg-white/5 text-white border border-white/10 py-2 px-4 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center font-medium"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Offer Letter
                        </button>
                      </div>

                      {/* Tech Stack */}
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex flex-wrap gap-2">
                          {internship.techStack.slice(0, 4).map((tech) => (
                            <span key={tech} className="px-2 py-1 bg-purple-900/30 text-purple-300 border border-purple-500/30 text-xs rounded-md">
                              {tech}
                            </span>
                          ))}
                          {internship.techStack.length > 4 && (
                            <span className="px-2 py-1 bg-gray-800 text-gray-400 border border-gray-700 text-xs rounded-md">
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
            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Internship Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-black/20 rounded-xl">
                  <div className="text-2xl font-bold text-purple-400">{enrollments.length}</div>
                  <div className="text-sm text-gray-400">Total Enrolled</div>
                </div>
                <div className="text-center p-4 bg-black/20 rounded-xl">
                  <div className="text-2xl font-bold text-blue-400">
                    {enrollments.filter(e => e.status === 'enrolled').length}
                  </div>
                  <div className="text-sm text-gray-400">In Progress</div>
                </div>
                <div className="text-center p-4 bg-black/20 rounded-xl">
                  <div className="text-2xl font-bold text-yellow-400">
                    {enrollments.filter(e => e.status === 'submitted').length}
                  </div>
                  <div className="text-sm text-gray-400">Under Review</div>
                </div>
                <div className="text-center p-4 bg-black/20 rounded-xl">
                  <div className="text-2xl font-bold text-emerald-400">
                    {enrollments.filter(e => e.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-400">Completed</div>
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