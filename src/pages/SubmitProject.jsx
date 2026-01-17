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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-white/70">Loading submission details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!enrollment) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Enrollment Not Found</h2>
            <p className="text-gray-400">The enrollment you're trying to access doesn't exist.</p>
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        {/* Header */}
        <div className="bg-white/5 backdrop-blur-md border-b border-white/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
              onClick={() => navigate('/internships/enrolled')}
              className="flex items-center text-emerald-400 hover:text-emerald-300 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Internships
            </button>

            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Submit Project</h1>
                <p className="text-gray-300">{enrollment.internshipId.title}</p>
              </div>

              {submission && (
                <div className="w-full sm:w-auto text-left sm:text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${submission.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/50' :
                      submission.status === 'approved' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/50' :
                        'bg-red-900/30 text-red-400 border border-red-700/50'
                    }`}>
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8">
              {/* Submission Status */}
              {submission && (
                <div className={`mb-8 p-4 rounded-xl border ${submission.status === 'pending' ? 'bg-yellow-900/10 border-yellow-500/30' :
                    submission.status === 'approved' ? 'bg-emerald-900/10 border-emerald-500/30' :
                      'bg-red-900/10 border-red-500/30'
                  }`}>
                  <div className="flex items-start">
                    {submission.status === 'pending' && <AlertCircle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />}
                    {submission.status === 'approved' && <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />}
                    {submission.status === 'rejected' && <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />}

                    <div>
                      <h3 className={`font-semibold ${submission.status === 'pending' ? 'text-yellow-400' :
                          submission.status === 'approved' ? 'text-emerald-400' :
                            'text-red-400'
                        }`}>
                        {submission.status === 'pending' && 'Submission Under Review'}
                        {submission.status === 'approved' && 'Submission Approved!'}
                        {submission.status === 'rejected' && 'Submission Rejected'}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Submitted on <span className="text-gray-300">{new Date(submission.submittedAt).toLocaleDateString()}</span>
                      </p>
                      {submission.adminComments && (
                        <div className="mt-3 p-3 bg-black/20 rounded-lg">
                          <p className="text-sm text-gray-300">
                            <strong className="text-white block mb-1">Feedback:</strong> {submission.adminComments}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Submission Form */}
              {canSubmit && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-5">
                    <div className="flex items-start">
                      <FileText className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-blue-300">Submission Requirements</h3>
                        <ul className="text-sm text-blue-200/80 mt-2 space-y-1.5">
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      GitHub Repository URL <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Github className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                      <input
                        type="url"
                        value={formData.githubUrl}
                        onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 bg-black/20 border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all ${errors.githubUrl ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10'
                          }`}
                        placeholder="https://github.com/username/project-name"
                        required
                      />
                    </div>
                    {errors.githubUrl && (
                      <p className="mt-1 text-sm text-red-400 pl-1">{errors.githubUrl}</p>
                    )}
                  </div>

                  {/* YouTube URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      YouTube Demo Video URL <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Youtube className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                      <input
                        type="url"
                        value={formData.youtubeUrl}
                        onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 bg-black/20 border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all ${errors.youtubeUrl ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10'
                          }`}
                        placeholder="https://youtube.com/watch?v=VIDEO_ID"
                        required
                      />
                    </div>
                    {errors.youtubeUrl && (
                      <p className="mt-1 text-sm text-red-400 pl-1">{errors.youtubeUrl}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => navigate('/internships/enrolled')}
                      className="px-6 py-3 bg-white/5 text-gray-300 border border-white/10 rounded-xl hover:bg-white/10 transition-colors font-medium text-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold shadow-lg shadow-emerald-900/20"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2"></div>
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
                <div className="text-center py-8 sm:py-12">
                  <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    {enrollment.status === 'submitted' ? 'Submission Under Review' : 'Cannot Submit Project'}
                  </h3>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    {enrollment.status === 'submitted'
                      ? 'Your project is currently being reviewed by our team. You will be notified once the review is complete.'
                      : 'You are not eligible to submit a project for this internship at this time.'
                    }
                  </p>
                  <button
                    onClick={() => navigate('/internships/enrolled')}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-500 transition-colors font-medium shadow-lg shadow-emerald-900/20"
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