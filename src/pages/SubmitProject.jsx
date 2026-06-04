import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import ApiRoutes from "../routes/routes";
import Layout from "../components/Layout";
import { ArrowLeft, Github, Youtube, FileText, AlertCircle, CheckCircle } from "lucide-react";

const SubmitProject = () => {
  const { enrollmentId } = useParams();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    githubUrl: "",
    youtubeUrl: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchEnrollmentDetails();
  }, [enrollmentId]);

  const fetchEnrollmentDetails = async () => {
    try {
      setLoading(true);

      const enrollmentResponse = await axios.get(`${ApiRoutes.internships.getEnrolled}?_t=${Date.now()}`);
      const enrollmentData = enrollmentResponse.data.data.find((e) => e._id === enrollmentId);

      if (!enrollmentData) {
        throw new Error("Enrollment not found");
      }

      setEnrollment(enrollmentData);

      try {
        const submissionResponse = await axios.get(`${ApiRoutes.internships.getSubmission(enrollmentId)}?_t=${Date.now()}`);
        setSubmission(submissionResponse.data.data);
        setFormData({
          githubUrl: submissionResponse.data.data.githubUrl || "",
          youtubeUrl: submissionResponse.data.data.youtubeUrl || "",
        });
      } catch (error) {
        // No submission yet, that's fine.
      }
    } catch (error) {
      console.error("Error fetching details:", error);
      alert("Failed to load submission details");
      navigate("/internships/enrolled");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.githubUrl.trim()) {
      newErrors.githubUrl = "GitHub repository URL is required";
    } else if (!/^https:\/\/github\.com\/.*$/.test(formData.githubUrl)) {
      newErrors.githubUrl = "Please enter a valid GitHub URL";
    }

    if (!formData.youtubeUrl.trim()) {
      newErrors.youtubeUrl = "YouTube video URL is required";
    } else if (!/^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/.test(formData.youtubeUrl)) {
      newErrors.youtubeUrl = "Please enter a valid YouTube URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await axios.post(ApiRoutes.internships.submit, {
        enrollmentId,
        githubUrl: formData.githubUrl.trim(),
        youtubeUrl: formData.youtubeUrl.trim(),
      });

      alert("Project submitted successfully! You will be notified once it's reviewed.");
      navigate("/internships/enrolled");
    } catch (error) {
      console.error("Error submitting project:", error);
      alert("Failed to submit project. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen xalora-grid-bg flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600" />
            <p className="mt-4 text-gray-600 font-medium">Loading submission details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!enrollment) {
    return (
      <Layout>
        <div className="min-h-screen xalora-grid-bg flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-md">
            <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
            <h2 className="mb-2 text-xl font-bold text-gray-900">Enrollment Not Found</h2>
            <p className="text-gray-600">The enrollment you're trying to access doesn't exist.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const isRejected = submission && submission.status === "rejected";
  const canSubmit = enrollment.status === "enrolled" || isRejected;

  const statusStyles =
    submission?.status === "approved"
      ? "bg-emerald-500/10 border-emerald-400/20 text-emerald-200"
      : submission?.status === "pending"
      ? "bg-amber-500/10 border-amber-400/20 text-amber-200"
      : "bg-rose-500/10 border-rose-400/20 text-rose-200";

  return (
    <Layout>
      <div className="min-h-screen xalora-grid-bg">
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <button
              onClick={() => navigate("/internships/enrolled")}
              className="mb-6 inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors font-semibold"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to My Internships
            </button>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Submit Project</h1>
            <p className="text-gray-600">{enrollment.internshipId.title}</p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {submission && (
            <div className={`mb-8 rounded-lg border p-4 ${
              submission.status === "approved"
                ? "bg-green-50 border-green-200 text-green-900"
                : submission.status === "pending"
                ? "bg-amber-50 border-amber-200 text-amber-900"
                : "bg-red-50 border-red-200 text-red-900"
            }`}>
              <div className="flex items-start gap-3">
                {submission.status === "approved" ? (
                  <CheckCircle className="mt-0.5 h-5 w-5 text-green-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h3 className="font-bold">
                    {submission.status === "pending" && "Submission Under Review"}
                    {submission.status === "approved" && "Submission Approved!"}
                    {submission.status === "rejected" && "Submission Rejected"}
                  </h3>
                  <p className="mt-1 text-sm">
                    Submitted on <span className="font-semibold">{new Date(submission.submittedAt).toLocaleDateString()}</span>
                  </p>
                  {submission.adminComments && (
                    <div className="mt-3 rounded-lg border border-current border-opacity-20 bg-white bg-opacity-50 p-3">
                      <p className="text-sm">
                        <strong className="mb-1 block">Feedback:</strong> {submission.adminComments}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {canSubmit ? (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 xl:grid-cols-5 xl:gap-8">
              <aside className="xl:col-span-2 rounded-lg border border-gray-200 bg-white shadow-sm p-6">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-indigo-100 rounded-lg flex-shrink-0">
                    <FileText className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Submission Requirements</h3>
                    <ul className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold mt-0.5">•</span>
                        <span>Upload your complete project code to GitHub</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold mt-0.5">•</span>
                        <span>Create a demo video showcasing your project</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold mt-0.5">•</span>
                        <span>Upload the video to YouTube and provide the link</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold mt-0.5">•</span>
                        <span>Ensure your repository is public</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold mt-0.5">•</span>
                        <span>Include a README.md with project documentation</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </aside>

              <section className="xl:col-span-3 space-y-6 rounded-lg border border-gray-200 bg-white shadow-sm p-6">
                <div>
                  <label className="mb-2.5 block text-sm font-semibold text-gray-900">
                    GitHub Repository URL <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Github className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => handleInputChange("githubUrl", e.target.value)}
                      className={`w-full rounded-lg border-b-2 bg-transparent pl-10 pr-4 py-2.5 text-gray-900 placeholder-gray-500 transition-all focus:outline-none ${
                        errors.githubUrl ? "border-b-red-600 focus:border-b-red-600" : "border-b-gray-300 focus:border-b-indigo-600"
                      }`}
                      placeholder="https://github.com/username/project-name"
                      required
                    />
                  </div>
                  {errors.githubUrl && <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.githubUrl}</p>}
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-semibold text-gray-900">
                    YouTube Demo Video URL <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Youtube className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="url"
                      value={formData.youtubeUrl}
                      onChange={(e) => handleInputChange("youtubeUrl", e.target.value)}
                      className={`w-full rounded-lg border-b-2 bg-transparent pl-10 pr-4 py-2.5 text-gray-900 placeholder-gray-500 transition-all focus:outline-none ${
                        errors.youtubeUrl ? "border-b-red-600 focus:border-b-red-600" : "border-b-gray-300 focus:border-b-indigo-600"
                      }`}
                      placeholder="https://youtube.com/watch?v=VIDEO_ID"
                      required
                    />
                  </div>
                  {errors.youtubeUrl && <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.youtubeUrl}</p>}
                </div>

                <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end sm:gap-4">
                  <button
                    type="button"
                    onClick={() => navigate("/internships/enrolled")}
                    className="rounded-lg border border-gray-300 bg-white text-gray-900 px-6 py-3 font-semibold transition-all hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 font-semibold shadow-md hover:shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        {isRejected ? "Resubmit Project" : "Submit Project"}
                      </>
                    )}
                  </button>
                </div>
              </section>
            </form>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-8 text-center">
              <AlertCircle className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                {enrollment.status === "submitted" ? "Submission Under Review" : "Cannot Submit Project"}
              </h3>
              <p className="mx-auto mb-8 max-w-md text-gray-600 font-medium">
                {enrollment.status === "submitted"
                  ? "Your project is currently being reviewed by our team. You will be notified once the review is complete."
                  : "You are not eligible to submit a project for this internship at this time."}
              </p>
              <button
                onClick={() => navigate("/internships/enrolled")}
                className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 font-semibold transition-all hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg"
              >
                Back to My Internships
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SubmitProject;
