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

  const pageShell =
    "min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_22%),linear-gradient(180deg,#020617_0%,#0f172a_55%,#020617_100%)]";

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
        <div className={`${pageShell} flex items-center justify-center`}>
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-400" />
            <p className="mt-4 text-white/70">Loading submission details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!enrollment) {
    return (
      <Layout>
        <div className={`${pageShell} flex items-center justify-center`}>
          <div className="text-center">
            <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
            <h2 className="mb-2 text-xl font-semibold text-white">Enrollment Not Found</h2>
            <p className="text-slate-400">The enrollment you're trying to access doesn't exist.</p>
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
      <div className={pageShell}>
        <div className="border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <button
              onClick={() => navigate("/internships/enrolled")}
              className="mb-6 inline-flex items-center rounded-full border border-cyan-400/15 bg-cyan-400/5 px-4 py-2 text-cyan-300 transition-colors hover:bg-cyan-400/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to My Internships
            </button>

            <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300">
              Project Submission
            </span>
            <h1 className="mt-4 text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">Submit Project</h1>
            <p className="mt-2 text-slate-300">{enrollment.internshipId.title}</p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {submission && (
            <div className={`mb-8 rounded-2xl border p-4 ${statusStyles}`}>
              <div className="flex items-start gap-3">
                {submission.status === "approved" ? (
                  <CheckCircle className="mt-0.5 h-5 w-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="mt-0.5 h-5 w-5 text-amber-400" />
                )}
                <div>
                  <h3 className="font-semibold">
                    {submission.status === "pending" && "Submission Under Review"}
                    {submission.status === "approved" && "Submission Approved!"}
                    {submission.status === "rejected" && "Submission Rejected"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-300">
                    Submitted on <span className="text-white">{new Date(submission.submittedAt).toLocaleDateString()}</span>
                  </p>
                  {submission.adminComments && (
                    <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/35 p-3">
                      <p className="text-sm text-slate-300">
                        <strong className="mb-1 block text-white">Feedback:</strong> {submission.adminComments}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {canSubmit ? (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 xl:grid-cols-5 xl:gap-8">
              <aside className="xl:col-span-2 rounded-3xl border border-cyan-400/15 bg-white/[0.05] p-5 shadow-[0_24px_80px_rgba(2,6,23,0.28)] backdrop-blur-xl sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-3">
                    <FileText className="h-5 w-5 text-cyan-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-100">Submission Requirements</h3>
                    <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-300">
                      <li>• Upload your complete project code to GitHub</li>
                      <li>• Create a demo video showcasing your project</li>
                      <li>• Upload the video to YouTube and provide the link</li>
                      <li>• Ensure your repository is public</li>
                      <li>• Include a README.md with project documentation</li>
                    </ul>
                  </div>
                </div>
              </aside>

              <section className="xl:col-span-3 space-y-6 rounded-3xl border border-white/10 bg-white/[0.05] p-5 shadow-[0_24px_80px_rgba(2,6,23,0.28)] backdrop-blur-xl sm:p-6 lg:p-8">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    GitHub Repository URL <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Github className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => handleInputChange("githubUrl", e.target.value)}
                      className={`w-full rounded-2xl border bg-slate-950/60 pl-10 pr-4 py-3 text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/20 ${
                        errors.githubUrl ? "border-rose-500/50" : "border-white/10 focus:border-cyan-400/30"
                      }`}
                      placeholder="https://github.com/username/project-name"
                      required
                    />
                  </div>
                  {errors.githubUrl && <p className="mt-1 pl-1 text-sm text-rose-400">{errors.githubUrl}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    YouTube Demo Video URL <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Youtube className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                    <input
                      type="url"
                      value={formData.youtubeUrl}
                      onChange={(e) => handleInputChange("youtubeUrl", e.target.value)}
                      className={`w-full rounded-2xl border bg-slate-950/60 pl-10 pr-4 py-3 text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/20 ${
                        errors.youtubeUrl ? "border-rose-500/50" : "border-white/10 focus:border-cyan-400/30"
                      }`}
                      placeholder="https://youtube.com/watch?v=VIDEO_ID"
                      required
                    />
                  </div>
                  {errors.youtubeUrl && <p className="mt-1 pl-1 text-sm text-rose-400">{errors.youtubeUrl}</p>}
                </div>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end sm:gap-4">
                  <button
                    type="button"
                    onClick={() => navigate("/internships/enrolled")}
                    className="rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-3 font-medium text-slate-200 transition-colors hover:bg-white/[0.08]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 shadow-[0_18px_50px_rgba(34,211,238,0.25)] transition-all hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
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
            <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-8 text-center shadow-[0_24px_80px_rgba(2,6,23,0.28)] backdrop-blur-xl">
              <AlertCircle className="mx-auto mb-4 h-16 w-16 text-slate-500" />
              <h3 className="mb-2 text-xl font-semibold text-white">
                {enrollment.status === "submitted" ? "Submission Under Review" : "Cannot Submit Project"}
              </h3>
              <p className="mx-auto mb-8 max-w-md text-slate-400">
                {enrollment.status === "submitted"
                  ? "Your project is currently being reviewed by our team. You will be notified once the review is complete."
                  : "You are not eligible to submit a project for this internship at this time."}
              </p>
              <button
                onClick={() => navigate("/internships/enrolled")}
                className="rounded-2xl bg-cyan-500 px-6 py-3 font-medium text-slate-950 transition-colors hover:bg-cyan-400"
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
