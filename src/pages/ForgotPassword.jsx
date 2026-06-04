import React, { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "../components";
import authService from "../services/authService";

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const isResetMode = useMemo(() => Boolean(token), [token]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus({ type: "error", message: "Please enter your email." });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });
    try {
      const response = await authService.forgotPassword(email.trim());
      setStatus({
        type: "success",
        message: response?.message || "Reset link sent successfully.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error?.response?.data?.message || "Failed to send password reset link.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setStatus({ type: "error", message: "Please fill all password fields." });
      return;
    }
    if (password !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });
    try {
      const response = await authService.resetPassword(token, password);
      setStatus({
        type: "success",
        message:
          response?.message ||
          "Password reset successful. Redirecting to login...",
      });
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setStatus({
        type: "error",
        message: error?.response?.data?.message || "Failed to reset password.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout showNavbar={false}>
      <div className="min-h-screen xalora-grid-bg flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          <div className="hidden lg:flex bg-white border border-gray-100 rounded-2xl p-10 flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300">
            <div>
              <div className="inline-flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
                  <img src="/logo_xalora.png" alt="Xalora" className="h-8 w-auto" />
                </div>
                <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  XALORA
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {isResetMode ? "Secure Your Account" : "Account Recovery"}
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {isResetMode
                  ? "Create a strong password to keep your account safe. Use a mix of uppercase, lowercase, numbers, and symbols."
                  : "Don't worry! We'll help you regain access to your account. Simply enter your email and we'll send you a secure reset link."}
              </p>
            </div>
            <div className="rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-5 text-sm text-indigo-900 space-y-2">
              <div className="font-semibold flex items-center gap-2">
                <span className="text-lg">🔐</span>
                <span>Security First</span>
              </div>
              <p className="text-indigo-700">Use at least 8 characters with uppercase, lowercase, number, and symbol for maximum security.</p>
            </div>
          </div>

          <div className="w-full bg-white border border-gray-100 rounded-2xl p-8 sm:p-10 shadow-sm">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                {isResetMode ? "Reset Password" : "Forgot Password"}
              </h1>
              <div className="h-1 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
              <p className="text-gray-600 text-base mt-4">
                {isResetMode
                  ? "Create a new password to regain access to your account."
                  : "Enter your email address and we'll send you a link to reset your password."}
              </p>
            </div>

            {status.message && (
              <div
                className={`mb-6 p-4 rounded-xl text-sm border-l-4 flex items-start gap-3 ${
                  status.type === "success"
                    ? "bg-green-50 border-l-green-500 border border-green-200 text-green-800"
                    : "bg-red-50 border-l-red-500 border border-red-200 text-red-800"
                }`}
              >
                <span className="text-lg flex-shrink-0">
                  {status.type === "success" ? "✓" : "⚠"}
                </span>
                <span>{status.message}</span>
              </div>
            )}

            {!isResetMode ? (
              <form onSubmit={handleSendResetLink} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                    📧 Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-0 py-2.5 bg-transparent border-b-2 border-gray-300 rounded-none text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-600 transition-all duration-200"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-md hover:shadow-lg disabled:opacity-60 disabled:shadow-none transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                    🔒 New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full px-0 py-2.5 bg-transparent border-b-2 border-gray-300 rounded-none text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-600 transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                    ✓ Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full px-0 py-2.5 bg-transparent border-b-2 border-gray-300 rounded-none text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-600 transition-all duration-200"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-md hover:shadow-lg disabled:opacity-60 disabled:shadow-none transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Resetting...
                    </>
                  ) : (
                    <>
                      Update Password
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                >
                  Back to Login →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
