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
        <div className="min-h-screen xalora-grid-bg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading internship details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!internship) {
    return (
      <Layout>
        <div className="min-h-screen xalora-grid-bg flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-md">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Internship Not Found</h2>
            <p className="text-gray-600">The internship you're looking for doesn't exist.</p>
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
            <button
              onClick={() => navigate('/internships')}
              className="flex items-center text-indigo-600 hover:text-indigo-700 mb-6 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Internships
            </button>

            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{internship.title}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-3 py-1 rounded text-xs font-semibold ${getDifficultyColor(internship.difficulty)}`}>
                    {internship.difficulty}
                  </span>
                  <div className="flex items-center text-gray-600 text-sm font-medium">
                    <Clock className="w-4 h-4 mr-2" />
                    {internship.duration} days
                  </div>
                </div>
              </div>

              {enrollmentStatus && (
                <div className="w-full sm:w-auto text-left sm:text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-600 text-sm font-medium">Status:</span>
                    <span className={`px-3 py-1 rounded text-xs font-bold ${getStatusColor(enrollmentStatus.status)}`}>
                      {enrollmentStatus.status.charAt(0).toUpperCase() + enrollmentStatus.status.slice(1)}
                    </span>
                  </div>
                  {enrollmentStatus.status === 'enrolled' && (
                    <p className="text-sm text-gray-600 mt-1">
                      Deadline: <span className="text-gray-900 font-semibold">{new Date(enrollmentStatus.deadline).toLocaleDateString()}</span>
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
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Lock className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">
                    {subscriptionError}{' '}
                    <button
                      onClick={() => navigate('/pricing')}
                      className="font-semibold underline hover:text-red-900 transition-colors"
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
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About This Internship</h2>
                <p className="text-gray-600 leading-relaxed">{internship.description}</p>
              </div>

              {/* Tech Stack */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {internship.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Requirements */}
              {internship.projectRequirementsPdf && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Project Requirements</h2>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-4 border border-gray-100">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg mr-3">
                        <BookOpen className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="text-gray-900 font-semibold">Project Requirements Document</span>
                    </div>
                    <button
                      onClick={() => downloadPdf(internship.projectRequirementsPdf, 'project-requirements.pdf')}
                      className="w-full sm:w-auto flex items-center justify-center text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 py-2.5 rounded-lg transition-all font-semibold"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </div>
                </div>
              )}

              {/* HLD Document */}
              {internship.hldPdf && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">High-Level Design</h2>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-4 border border-gray-100">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-gray-900 font-semibold">HLD Document</span>
                    </div>
                    <button
                      onClick={() => downloadPdf(internship.hldPdf, 'hld-document.pdf')}
                      className="w-full sm:w-auto flex items-center justify-center text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-4 py-2.5 rounded-lg transition-all font-semibold"
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
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <span className="bg-green-100 p-2 rounded-lg mr-3">
                    <Users className="w-5 h-5 text-green-600" />
                  </span>
                  Enrollment
                </h3>

                {!user ? (
                  <div className="text-center">
                    <p className="text-gray-600 mb-6 font-medium">Login to enroll in this internship</p>
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg transition-all font-semibold shadow-md hover:shadow-lg"
                    >
                      Login to Enroll
                    </button>
                  </div>
                ) : subscriptionError ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-red-600" />
                    </div>
                    <p className="text-gray-900 mb-6 font-semibold">Premium subscription required</p>
                    <button
                      onClick={() => navigate('/pricing')}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-md hover:shadow-lg"
                    >
                      Upgrade Plan
                    </button>
                  </div>
                ) : enrollmentStatus ? (
                  <div>
                    <div className="flex items-center bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
                      <span className="font-semibold text-green-700">You are enrolled!</span>
                    </div>
                    <div className="space-y-4 text-sm mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span className="font-medium">Status</span>
                        <span className={`font-semibold ${enrollmentStatus.status === 'completed' ? 'text-green-600' : 'text-gray-900'}`}>
                          {enrollmentStatus.status.charAt(0).toUpperCase() + enrollmentStatus.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span className="font-medium">Enrolled on</span>
                        <span className="text-gray-900 font-semibold">{new Date(enrollmentStatus.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span className="font-medium">Deadline</span>
                        <span className="text-gray-900 font-semibold">{new Date(enrollmentStatus.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {enrollmentStatus.status === 'enrolled' && (
                      <button
                        onClick={() => navigate(`/internships/submit/${enrollmentStatus._id}`)}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold shadow-md hover:shadow-lg flex items-center justify-center group"
                      >
                        Submit Project
                        <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 text-sm mb-6 text-center font-medium">
                      Enroll now to start working on this project. You'll get access to all resources instantly.
                    </p>
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg flex items-center justify-center"
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
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm">Duration: <span className="text-gray-900 font-semibold">{internship.duration} days</span></span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm">Difficulty: <span className="text-gray-900 font-semibold capitalize">{internship.difficulty}</span></span>
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