import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Layout } from "../components";
import { loginUser, googleLoginUser } from "../store/slices/userSlice";
import { GoogleLogin } from "@react-oauth/google";
import { Github } from "lucide-react";
import ApiRoutes from "../routes/routes";
import api from "../utils/axios";

const PENDING_WORKSPACE_CHOICE_KEY = "xalora_pending_workspace_choice";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [currentFeature, setCurrentFeature] = useState(0);
    const [orgSetupMessage, setOrgSetupMessage] = useState("");
    const [orgSetupEmail, setOrgSetupEmail] = useState("");
    const [resendLoading, setResendLoading] = useState(false);
    const [resendSuccess, setResendSuccess] = useState("");
    const [resendError, setResendError] = useState("");

    const { loading, error } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const orgCreated = searchParams.get("org") === "created";
    const oauthError = searchParams.get("oauth_error");

    const features = [
        {
            title: "Master Coding Skills",
            description: "Practice with 1000+ problems from beginner to expert level",
            icon: "🎯",
            color: "emerald"
        },
        {
            title: "Real-time Feedback",
            description: "Get instant code analysis and improvement suggestions",
            icon: "⚡",
            color: "teal"
        },
        {
            title: "AI-Powered Learning",
            description: "Personalized learning paths adapted to your progress",
            icon: "🤖",
            color: "cyan"
        },
        {
            title: "Interview Ready",
            description: "Prepare for technical interviews with curated challenges",
            icon: "🚀",
            color: "lime"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFeature((prev) => (prev + 1) % features.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.email || !formData.password) {
            // In a real app, you might want to show this error in the UI
            console.log("Email and password are required");
            return;
        }

        console.log("🔐 LOGIN: Attempting login with email:", formData.email);
        const result = await dispatch(
            loginUser({
                email: formData.email,
                password: formData.password,
            })
        );

        if (loginUser.fulfilled.match(result)) {
            console.log("✅ LOGIN: Successful, redirecting to home");
            const workspaces = result.payload?.user?.workspaces || [];
            const shouldOpenWorkspaceChooser = workspaces.length > 1;
            if (workspaces.length > 1) {
                sessionStorage.setItem(PENDING_WORKSPACE_CHOICE_KEY, "1");
            } else {
                sessionStorage.removeItem(PENDING_WORKSPACE_CHOICE_KEY);
            }
            // Clear form data on successful login
            setFormData({
                email: "",
                password: "",
            });
            navigate("/");
        } else if (result.payload?.requiresVerification) {
            console.log("📧 LOGIN: Email verification required, redirecting to verification page");
            // Store user data temporarily for verification page
            localStorage.setItem('pending_verification_user', JSON.stringify(result.payload.user));
            navigate("/verify-email");
        } else if (result.payload?.requiresOrgSetup) {
            console.log("🏢 LOGIN: Organization setup required. Server message:", result.payload?.message);
            console.log("🏢 LOGIN: Use 'Resend Setup Email' button to get the setup link");
            setOrgSetupMessage(result.payload?.message || "Organization setup required. Please check your email for the setup link.");
            setOrgSetupEmail(formData.email);
            setResendSuccess("");
            setResendError("");
        } else {
            console.log("❌ LOGIN: Failed with error:", result.payload);
        }
    };

    const handleResendOrgSetup = async () => {
        if (!orgSetupEmail || resendLoading) return;
        console.log("📧 RESEND: Requesting org setup email for:", orgSetupEmail);
        setResendLoading(true);
        setResendSuccess("");
        setResendError("");
        try {
            const res = await api.post("/api/v1/email/resend-org-setup", { email: orgSetupEmail });
            console.log("📧 RESEND: Response:", res.status, res.data);
            const setupLink = res.data?.data?.setupLink;
            if (setupLink) {
                console.log("📧 RESEND: Email delivery failed, redirecting to setup link directly");
                window.location.href = setupLink;
            } else {
                console.log("📧 RESEND: ✅ Email sent successfully");
                setResendSuccess("Setup link sent! Check your inbox.");
            }
        } catch (err) {
            const errMsg = err.response?.data?.message || "Failed to send email. Please try again later.";
            console.error("📧 RESEND: ❌ Failed:", err.response?.status, errMsg);
            setResendError(errMsg);
        } finally {
            setResendLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        console.log("🔐 GOOGLE-LOGIN: Credential response:", credentialResponse);
        if (credentialResponse.credential) {
            const result = await dispatch(googleLoginUser(credentialResponse.credential));
            if (googleLoginUser.fulfilled.match(result)) {
                const workspaces = result.payload?.user?.workspaces || [];
                const shouldOpenWorkspaceChooser = workspaces.length > 1;
                if (workspaces.length > 1) {
                    sessionStorage.setItem(PENDING_WORKSPACE_CHOICE_KEY, "1");
                } else {
                    sessionStorage.removeItem(PENDING_WORKSPACE_CHOICE_KEY);
                }
                navigate("/");
            }
        }
    };

    const handleGithubLogin = () => {
        window.location.href = new URL(ApiRoutes.auth.githubLogin, API_BASE_URL).toString();
    };

    return (
        <Layout showNavbar={false}>
            <div className="min-h-screen xalora-grid-bg flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left side - Features */}
                    <div className="hidden lg:flex flex-col">
                        {/* Logo Section */}
                        <div className="text-center mb-12">
                            <Link to="/" className="inline-block mb-8 group">
                                <div className="flex items-center justify-center space-x-4">
                                    <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg group-hover:shadow-lg transition-shadow duration-300">
                                        <img
                                            src="/logo_xalora.png"
                                            alt="Xalora Logo"
                                            className="h-12 w-auto"
                                        />
                                    </div>
                                    <span className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                        XALORA
                                    </span>
                                </div>
                            </Link>
                            <h1 className="text-4xl font-black mb-4 text-gray-900">
                                Welcome Back
                            </h1>
                            <p className="text-xl text-gray-600">
                                Continue your coding journey with our AI-powered platform
                            </p>
                        </div>

                        {/* Feature showcase */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="text-center">
                                <div className="text-6xl mb-6 animate-bounce">
                                    {features[currentFeature].icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    {features[currentFeature].title}
                                </h3>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    {features[currentFeature].description}
                                </p>
                            </div>
                        </div>

                        {/* Feature indicators */}
                        <div className="flex justify-center gap-3">
                            {features.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentFeature(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentFeature
                                        ? 'bg-indigo-600 scale-125'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 mt-12">
                            <div className="text-center">
                                <div className="text-2xl font-black text-indigo-600 mb-1">100K+</div>
                                <div className="text-gray-600 text-sm">Developers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-black text-purple-600 mb-1">5M+</div>
                                <div className="text-gray-600 text-sm">Solutions</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-black text-blue-600 mb-1">30+</div>
                                <div className="text-gray-600 text-sm">Languages</div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Login Form */}
                    <div className="max-w-md w-full mx-auto">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <Link to="/" className="inline-block mb-6 lg:hidden group">
                                <div className="flex items-center justify-center space-x-3">
                                    <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
                                        <img
                                            src="/logo_xalora.png"
                                            alt="Xalora Logo"
                                            className="h-10 w-auto"
                                        />
                                    </div>
                                    <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                        XALORA
                                    </span>
                                </div>
                            </Link>
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                                Welcome back
                            </h2>
                            <div className="h-1 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mx-auto mb-4"></div>
                            <p className="text-base text-gray-600">
                                Sign in to continue your coding journey
                            </p>
                        </div>

                        {/* Login Form */}
                        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-gray-100">
                            {orgCreated && (
                                <div className="mb-6 p-4 bg-green-50 border-l-4 border-l-green-500 border border-green-200 text-green-800 rounded-lg text-sm flex items-start gap-3">
                                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Organization created successfully! Sign in to access your admin dashboard.</span>
                                </div>
                            )}
                            {orgSetupMessage && (
                                <div className="mb-6 p-4 bg-amber-50 border-l-4 border-l-amber-500 border border-amber-200 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <svg className="w-5 h-5 mt-0.5 text-yellow-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <div className="flex-1">
                                            <p className="text-amber-900 font-semibold text-sm mb-1">Organization Setup Required</p>
                                            <p className="text-amber-700 text-xs mb-3">{orgSetupMessage}</p>
                                            <button
                                                onClick={handleResendOrgSetup}
                                                disabled={resendLoading}
                                                className="px-4 py-1.5 text-xs font-medium rounded-md bg-amber-100 border border-amber-300 text-amber-700 hover:bg-amber-200 transition-all duration-200 disabled:opacity-50"
                                            >
                                                {resendLoading ? "Sending..." : "Resend Setup Email"}
                                            </button>
                                            {resendSuccess && (
                                                <p className="text-green-700 text-xs mt-2">✓ {resendSuccess}</p>
                                            )}
                                            {resendError && (
                                                <p className="text-red-700 text-xs mt-2">✕ {resendError}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {(oauthError || error) && !orgSetupMessage && (
                                <div className="mb-6 p-4 bg-red-50 border-l-4 border-l-red-500 border border-red-200 text-red-800 rounded-lg text-sm flex items-start gap-3">
                                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span>{oauthError || error}</span>
                                </div>
                            )}
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-semibold text-gray-700 mb-2.5"
                                    >
                                        📧 Email Address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-0 py-2.5 text-base bg-transparent border-b-2 border-gray-300 rounded-none focus:outline-none focus:border-indigo-600 text-gray-900 placeholder-gray-500 transition-all duration-200"
                                        placeholder="name@example.com"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-semibold text-gray-700 mb-2.5"
                                    >
                                        🔒 Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full px-0 py-2.5 text-base bg-transparent border-b-2 border-gray-300 rounded-none focus:outline-none focus:border-indigo-600 text-gray-900 placeholder-gray-500 transition-all duration-200 pr-10"
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.888 9.888L3 3m6.888 6.888L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded bg-white"
                                        />
                                        <label
                                            htmlFor="remember-me"
                                            className="ml-2 block text-sm text-gray-700"
                                        >
                                            Remember me
                                        </label>
                                    </div>
                                    <div className="text-sm">
                                        <Link
                                            to="/forgot-password"
                                            className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-300"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 flex items-center justify-center gap-2 border border-transparent rounded-lg text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                                    >
                                        {loading ? (
                                            <>
                                                <svg
                                                    className="animate-spin h-5 w-5 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                <span>Signing in...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Sign in</span>
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                            <div className="mt-8">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">
                                        Or continue with
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-6 flex items-center justify-center gap-4">
                                    <div className="shrink-0 w-[40px] h-[40px] rounded-full overflow-hidden flex items-center justify-center">
                                        <GoogleLogin
                                            onSuccess={handleGoogleSuccess}
                                            onError={() => {
                                                console.log('Login Failed');
                                            }}
                                            type="icon"
                                            theme="outline"
                                            shape="circle"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleGithubLogin}
                                        className="shrink-0 w-[40px] h-[40px] inline-flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50 shadow-sm transition-all duration-200"
                                    >
                                        <Github className="h-5 w-5 text-gray-700" />
                                    </button>
                                    <p className="absolute -left-[9999px]">
                                        GitHub login is available for individual accounts only.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{" "}
                                    <Link
                                        to="/signup"
                                        className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-300"
                                    >
                                        Create one →
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
