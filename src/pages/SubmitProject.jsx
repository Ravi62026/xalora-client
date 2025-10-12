import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../utils/axios';
import ApiRoutes from '../routes/routes';
import Layout from '../components/Layout';
import { ArrowLeft, Github, Youtube, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const SubmitProject = () => {
  const { enrollmentId } = useParams();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    githubUrl: '',
    youtubeUrl: ''
  });
  const [errors, setErrors] = useState({});

  // eslint-disable-next-line no-unused-vars
  const { user } = useSelector(state => state.user);

  useEffect(() => {
    fetchEnrollmentDetails();
  }, [enrollmentId]);

  const fetchEnrollmentDetails = async () => {
    try {
      setLoading(true);

      // Fetch enrollment details using proper API route with cache-busting
      const enrollmentResponse = await axios.get(`${ApiRoutes.internships.getEnrolled}?_t=${Date.now()}`);
      const enrollmentData = enrollmentResponse.data.data.find(e => e._id === enrollmentId);

      if (!enrollmentData) {
        throw new Error('Enrollment not found');
      }

      setEnrollment(enrollmentData);

      // Check if already submitted using proper API route with cache-busting
      try {
        const submissionResponse = await axios.get(`${ApiRoutes.internships.getSubmission(enrollmentId)}?_t=${Date.now()}`);
        setSubmission(submissionResponse.data.data);
        setFormData({
          githubUrl: submissionResponse.data.data.githubUrl || '',
          youtubeUrl: submissionResponse.data.data.youtubeUrl || ''
        });
      } catch (error) {
        // No submission yet, that's fine
      }
    } catch (error) {
      console.error('Error fetching details:', error);
      alert('Failed to load submission details');
      navigate('/internships/enrolled');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.githubUrl.trim()) {
      newErrors.githubUrl = 'GitHub repository URL is required';
    } else if (!/^https:\/\/github\.com\/.*$/.test(formData.githubUrl)) {
      newErrors.githubUrl = 'Please enter a valid GitHub URL';
    }

    if (!formData.youtubeUrl.trim()) {
      newErrors.youtubeUrl = 'YouTube video URL is required';
    } else if (!/^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/.test(formData.youtubeUrl)) {
      newErrors.youtubeUrl = 'Please enter a valid YouTube URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      // Use proper API route for submission
      await axios.post(ApiRoutes.internships.submit, {
        enrollmentId,
        githubUrl: formData.githubUrl.trim(),
        youtubeUrl: formData.youtubeUrl.trim()
      });

      alert('Project submitted successfully! You will be notified once it\'s reviewed.');
      navigate('/internships/enrolled');
    } catch (error) {
      console.error('Error submitting project:', error);
      alert('Failed to submit project. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading submission details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!enrollment) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Enrollment Not Found</h2>
            <p className="text-gray-600">The enrollment you're trying to access doesn't exist.</p>
          </div>
        </div>
      </Layout>
    );
  }

  // eslint-disable-next-line no-unused-vars
  const isSubmitted = submission && submission.status !== 'rejected';
  const isRejected = submission && submission.status === 'rejected';
  const canSubmit = enrollment.status === 'enrolled' || isRejected;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
              onClick={() => navigate('/internships/enrolled')}
              className="flex items-center text-purple-600 hover:text-purple-800 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Internships
            </button>

            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Submit Project</h1>
                <p className="mt-2 text-gray-600">{enrollment.internshipId.title}</p>
              </div>

              {submission && (
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              {/* Submission Status */}
              {submission && (
                <div className={`mb-6 p-4 rounded-lg ${
                  submission.status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
                  submission.status === 'approved' ? 'bg-green-50 border-green-200' :
                  'bg-red-50 border-red-200'
                } border`}>
                  <div className="flex items-center">
                    {submission.status === 'pending' && <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />}
                    {submission.status === 'approved' && <CheckCircle className="w-5 h-5 text-green-600 mr-2" />}
                    {submission.status === 'rejected' && <AlertCircle className="w-5 h-5 text-red-600 mr-2" />}

                    <div>
                      <h3 className="font-medium text-gray-900">
                        {submission.status === 'pending' && 'Submission Under Review'}
                        {submission.status === 'approved' && 'Submission Approved!'}
                        {submission.status === 'rejected' && 'Submission Rejected'}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Submitted on {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>
                      {submission.adminComments && (
                        <p className="text-sm text-gray-700 mt-2">
                          <strong>Admin Comments:</strong> {submission.adminComments}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Submission Form */}
              {canSubmit && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <FileText className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-blue-900">Submission Requirements</h3>
                        <ul className="text-sm text-blue-800 mt-2 space-y-1">
                          <li>• Upload your complete project code to GitHub</li>
                          <li>• Create a demo video showcasing your project</li>
                          <li>• Upload the video to YouTube and provide the link</li>
                          <li>• Ensure your repository is public</li>
                          <li>• Include a README.md with project documentation</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* GitHub URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GitHub Repository URL *
                    </label>
                    <div className="relative">
                      <Github className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="url"
                        value={formData.githubUrl}
                        onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          errors.githubUrl ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="https://github.com/username/project-name"
                        required
                      />
                    </div>
                    {errors.githubUrl && (
                      <p className="mt-1 text-sm text-red-600">{errors.githubUrl}</p>
                    )}
                  </div>

                  {/* YouTube URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      YouTube Demo Video URL *
                    </label>
                    <div className="relative">
                      <Youtube className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="url"
                        value={formData.youtubeUrl}
                        onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          errors.youtubeUrl ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="https://youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID"
                        required
                      />
                    </div>
                    {errors.youtubeUrl && (
                      <p className="mt-1 text-sm text-red-600">{errors.youtubeUrl}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => navigate('/internships/enrolled')}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 mr-2" />
                          {isRejected ? 'Resubmit Project' : 'Submit Project'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Cannot Submit Message */}
              {!canSubmit && (
                <div className="text-center py-8">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    {enrollment.status === 'submitted' ? 'Submission Under Review' : 'Cannot Submit Project'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {enrollment.status === 'submitted'
                      ? 'Your project is currently being reviewed by our team. You will be notified once the review is complete.'
                      : 'You are not eligible to submit a project for this internship at this time.'
                    }
                  </p>
                  <button
                    onClick={() => navigate('/internships/enrolled')}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Back to My Internships
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubmitProject;