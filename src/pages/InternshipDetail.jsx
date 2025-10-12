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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading internship details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!internship) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Internship Not Found</h2>
            <p className="text-gray-600">The internship you're looking for doesn't exist.</p>
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
              onClick={() => navigate('/internships')}
              className="flex items-center text-purple-600 hover:text-purple-800 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Internships
            </button>

            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{internship.title}</h1>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(internship.difficulty)}`}>
                    {internship.difficulty}
                  </span>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {internship.duration} days
                  </div>
                </div>
              </div>

              {enrollmentStatus && (
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(enrollmentStatus.status)}`}>
                    {enrollmentStatus.status.charAt(0).toUpperCase() + enrollmentStatus.status.slice(1)}
                  </span>
                  {enrollmentStatus.status === 'enrolled' && (
                    <p className="text-sm text-gray-600 mt-1">
                      Deadline: {new Date(enrollmentStatus.deadline).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Subscription Error Message */}
          {subscriptionError && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Lock className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {subscriptionError}{' '}
                    <button 
                      onClick={() => navigate('/pricing')}
                      className="font-medium underline hover:text-red-600"
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
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Internship</h2>
                <p className="text-gray-700 leading-relaxed">{internship.description}</p>
              </div>

              {/* Tech Stack */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {internship.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Requirements */}
              {internship.projectRequirementsPdf && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Requirements</h2>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <BookOpen className="w-5 h-5 text-gray-500 mr-3" />
                      <span className="text-gray-700">Project Requirements Document</span>
                    </div>
                    <button
                      onClick={() => downloadPdf(internship.projectRequirementsPdf, 'project-requirements.pdf')}
                      className="flex items-center text-purple-600 hover:text-purple-800"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </button>
                  </div>
                </div>
              )}

              {/* HLD Document */}
              {internship.hldPdf && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">High-Level Design</h2>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <BookOpen className="w-5 h-5 text-gray-500 mr-3" />
                      <span className="text-gray-700">HLD Document</span>
                    </div>
                    <button
                      onClick={() => downloadPdf(internship.hldPdf, 'hld-document.pdf')}
                      className="flex items-center text-purple-600 hover:text-purple-800"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Enrollment Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollment</h3>
                
                {!user ? (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">Login to enroll in this internship</p>
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                    >
                      Login
                    </button>
                  </div>
                ) : subscriptionError ? (
                  <div className="text-center">
                    <Lock className="w-12 h-12 text-red-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">Subscription required</p>
                    <button
                      onClick={() => navigate('/pricing')}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-md hover:from-purple-700 hover:to-indigo-700 transition-all"
                    >
                      Upgrade Plan
                    </button>
                  </div>
                ) : enrollmentStatus ? (
                  <div>
                    <div className="flex items-center text-green-600 mb-3">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span className="font-medium">Already Enrolled</span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="font-medium">{enrollmentStatus.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Enrolled on:</span>
                        <span>{new Date(enrollmentStatus.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Deadline:</span>
                        <span>{new Date(enrollmentStatus.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {enrollmentStatus.status === 'enrolled' && (
                      <button
                        onClick={() => navigate(`/internships/submit/${enrollmentStatus._id}`)}
                        className="w-full mt-4 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center"
                      >
                        Submit Project
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-md hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center"
                  >
                    {enrolling ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enrolling...
                      </>
                    ) : (
                      'Enroll Now'
                    )}
                  </button>
                )}
              </div>

              {/* Internship Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-3" />
                    <span>Duration: {internship.duration} days</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-3" />
                    <span>Difficulty: {internship.difficulty}</span>
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