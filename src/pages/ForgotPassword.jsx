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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6 lg:gap-10 items-stretch">
          <div className="hidden lg:flex bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm flex-col justify-between shadow-2xl">
            <div>
              <div className="inline-flex items-center gap-3 mb-6">
                <img src="/logo_xalora.png" alt="Xalora" className="h-10 w-auto" />
                <span className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  XALORA
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                {isResetMode ? "Create a New Password" : "Account Recovery"}
              </h2>
              <p className="text-white/70 leading-relaxed">
                {isResetMode
                  ? "Keep your account secure with a strong password you haven't used before."
                  : "Forgot your password? No worries. We'll send a secure reset link to your registered email."}
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              🔐 Security tip: Use at least 8 characters with upper/lowercase, number, and symbol.
            </div>
          </div>

          <div className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {isResetMode ? "Reset Password" : "Forgot Password"}
            </h1>
            <p className="text-white/70 text-sm sm:text-base mb-6">
              {isResetMode
                ? "Enter and confirm your new password."
                : "Enter your registered email to receive a reset link."}
            </p>

            {status.message && (
              <div
                className={`mb-5 p-3.5 rounded-xl text-sm border ${
                  status.type === "success"
                    ? "bg-green-500/15 border-green-400/40 text-green-200"
                    : "bg-red-500/15 border-red-400/40 text-red-200"
                }`}
              >
                {status.message}
              </div>
            )}

            {!isResetMode ? (
              <form onSubmit={handleSendResetLink} className="space-y-4">
                <label className="block text-sm font-medium text-white/90">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold disabled:opacity-60 transition-all"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <label className="block text-sm font-medium text-white/90">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  required
                />
                <label className="block text-sm font-medium text-white/90">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold disabled:opacity-60 transition-all"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}

            <div className="mt-6 text-sm text-white/70">
              Back to{" "}
              <Link
                to="/login"
                className="text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
