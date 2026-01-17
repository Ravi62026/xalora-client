import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../utils/axios';
import ApiRoutes from '../routes/routes';
import Layout from '../components/Layout';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  Users,
  CheckCircle,
  AlertCircle,
  BookOpen,
  ChevronRight,
  Lock
} from 'lucide-react';

const InternshipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [subscriptionError, setSubscriptionError] = useState(null);

  const { user } = useSelector(state => state.user);

  useEffect(() => {
    fetchInternship();
    if (user) {
      checkEnrollmentStatus();
    }
  }, [id, user]);

  const fetchInternship = async () => {
    try {
      setLoading(true);
      // Add cache-busting parameter to prevent browser caching
      const response = await axios.get(`${ApiRoutes.internships.getById(id)}?_t=${Date.now()}`);

      // Log cache information for debugging
      console.log('Internship Detail API Response:', response);

      setInternship(response.data.data);
    } catch (error) {
      console.error('Error fetching internship:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    try {
      // Add cache-busting parameter to prevent browser caching
      const response = await axios.get(`${ApiRoutes.internships.getEnrolled}?_t=${Date.now()}`);

      // Log cache information for debugging
      console.log('Enrollment Status API Response:', response);

      const enrollment = response.data.data.find(e => e.internshipId._id === id);
      setEnrollmentStatus(enrollment);
    } catch (error) {
      // Check if it's a subscription error
      if (error.response?.data?.redirectToPricing) {
        setSubscriptionError(error.response.data.message);
      }
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setEnrolling(true);
      // Use the proper API route instead of direct axios call
      await axios.post(ApiRoutes.internships.enroll(id));
      await checkEnrollmentStatus(); // Refresh status
      setSubscriptionError(null);
    } catch (error) {
      // Check if it's a subscription error
      if (error.response?.data?.redirectToPricing) {
        setSubscriptionError(error.response.data.message);
        // Redirect to pricing page after a short delay
        setTimeout(() => {
          navigate('/pricing');
        }, 3000);
      } else {
        console.error('Error enrolling:', error);
        alert('Failed to enroll. Please try again.');
      }
    } finally {
      setEnrolling(false);
    }
  };

  const downloadPdf = (url, filename) => {
    // For Google Drive links, convert to direct download
    const fileId = url.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
    if (fileId) {
      const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.click();
    } else {
      window.open(url, '_blank');
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-white/70">Loading internship details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!internship) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Internship Not Found</h2>
            <p className="text-gray-400">The internship you're looking for doesn't exist.</p>
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
            <button
              onClick={() => navigate('/internships')}
              className="flex items-center text-emerald-400 hover:text-emerald-300 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Internships
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">{internship.title}</h1>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(internship.difficulty).replace('bg-gray-100', 'bg-gray-800').replace('text-gray-800', 'text-gray-300 border-gray-700')}`}>
                    {internship.difficulty}
                  </span>
                  <div className="flex items-center text-gray-300 text-sm">
                    <Clock className="w-4 h-4 mr-1.5 text-emerald-500" />
                    {internship.duration} days
                  </div>
                </div>
              </div>

              {enrollmentStatus && (
                <div className="w-full md:w-auto text-left md:text-right bg-white/5 md:bg-transparent p-4 md:p-0 rounded-lg md:rounded-none">
                  <div className="flex items-center md:justify-end gap-2 mb-1">
                    <span className="text-gray-400 text-sm">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(enrollmentStatus.status)}`}>
                      {enrollmentStatus.status.charAt(0).toUpperCase() + enrollmentStatus.status.slice(1)}
                    </span>
                  </div>
                  {enrollmentStatus.status === 'enrolled' && (
                    <p className="text-sm text-gray-400 mt-1">
                      Deadline: <span className="text-white">{new Date(enrollmentStatus.deadline).toLocaleDateString()}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Subscription Error Message */}
          {subscriptionError && (
            <div className="bg-red-900/20 border-l-4 border-red-500 p-4 mb-8 backdrop-blur-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Lock className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-200">
                    {subscriptionError}{' '}
                    <button
                      onClick={() => navigate('/pricing')}
                      className="font-medium underline hover:text-white transition-colors"
                    >
                      Upgrade your plan
                    </button>{' '}
                    to access internships.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Description */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-white mb-4">About This Internship</h2>
                <p className="text-gray-300 leading-relaxed">{internship.description}</p>
              </div>

              {/* Tech Stack */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-white mb-4">Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {internship.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-emerald-900/30 text-emerald-300 border border-emerald-500/30 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Requirements */}
              {internship.projectRequirementsPdf && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-white mb-4">Project Requirements</h2>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-black/20 rounded-xl gap-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-500/20 rounded-lg mr-3">
                        <BookOpen className="w-5 h-5 text-purple-400" />
                      </div>
                      <span className="text-gray-200 font-medium">Project Requirements Document</span>
                    </div>
                    <button
                      onClick={() => downloadPdf(internship.projectRequirementsPdf, 'project-requirements.pdf')}
                      className="w-full sm:w-auto flex items-center justify-center text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </div>
                </div>
              )}

              {/* HLD Document */}
              {internship.hldPdf && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-white mb-4">High-Level Design</h2>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-black/20 rounded-xl gap-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-500/20 rounded-lg mr-3">
                        <BookOpen className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="text-gray-200 font-medium">HLD Document</span>
                    </div>
                    <button
                      onClick={() => downloadPdf(internship.hldPdf, 'hld-document.pdf')}
                      className="w-full sm:w-auto flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Enrollment Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                  <span className="bg-emerald-500/10 p-2 rounded-lg mr-3">
                    <Users className="w-5 h-5 text-emerald-400" />
                  </span>
                  Enrollment
                </h3>

                {!user ? (
                  <div className="text-center">
                    <p className="text-gray-400 mb-6">Login to enroll in this internship</p>
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full bg-emerald-600 text-white py-3 px-4 rounded-xl hover:bg-emerald-500 transition-all font-semibold shadow-lg shadow-emerald-900/20"
                    >
                      Login to Enroll
                    </button>
                  </div>
                ) : subscriptionError ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-gray-300 mb-6">Premium subscription required</p>
                    <button
                      onClick={() => navigate('/pricing')}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all font-semibold shadow-lg shadow-purple-900/20"
                    >
                      Upgrade Plan
                    </button>
                  </div>
                ) : enrollmentStatus ? (
                  <div>
                    <div className="flex items-center bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6">
                      <CheckCircle className="w-6 h-6 text-emerald-400 mr-3 flex-shrink-0" />
                      <span className="font-medium text-emerald-100">You are enrolled!</span>
                    </div>
                    <div className="space-y-4 text-sm mb-6">
                      <div className="flex justify-between text-gray-400">
                        <span>Status</span>
                        <span className={`font-medium ${enrollmentStatus.status === 'completed' ? 'text-green-400' : 'text-white'}`}>
                          {enrollmentStatus.status.charAt(0).toUpperCase() + enrollmentStatus.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Enrolled on</span>
                        <span className="text-white">{new Date(enrollmentStatus.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Deadline</span>
                        <span className="text-white">{new Date(enrollmentStatus.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {enrollmentStatus.status === 'enrolled' && (
                      <button
                        onClick={() => navigate(`/internships/submit/${enrollmentStatus._id}`)}
                        className="w-full bg-emerald-600 text-white py-3 px-4 rounded-xl hover:bg-emerald-500 transition-all font-semibold shadow-lg shadow-emerald-900/20 flex items-center justify-center group"
                      >
                        Submit Project
                        <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-400 text-sm mb-6 text-center">
                      Enroll now to start working on this project. You'll get access to all resources instantly.
                    </p>
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full bg-emerald-600 text-white py-3 px-4 rounded-xl hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg shadow-emerald-900/20 flex items-center justify-center"
                    >
                      {enrolling ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2"></div>
                          Enrolling...
                        </>
                      ) : (
                        'Enroll Now'
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Internship Details */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4">Quick Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-300">
                    <div className="p-2 bg-blue-500/10 rounded-lg mr-3">
                      <Calendar className="w-4 h-4 text-blue-400" />
                    </div>
                    <span>Duration: <span className="text-white font-medium">{internship.duration} days</span></span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="p-2 bg-purple-500/10 rounded-lg mr-3">
                      <Users className="w-4 h-4 text-purple-400" />
                    </div>
                    <span>Difficulty: <span className="text-white font-medium capitalize">{internship.difficulty}</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InternshipDetail;