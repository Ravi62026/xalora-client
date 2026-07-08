import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import authService from "../services/authService";
import { googleLoginUser } from "../store/slices/userSlice";
import { GoogleLogin } from "@react-oauth/google";
import { Github } from "lucide-react";
import { useApiCall } from "../hooks";
import ApiRoutes from "../routes/routes";
import { Layout } from "../components";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const Signup = () => {
    const [accountType, setAccountType] = useState("individual"); // individual or organization
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [currentFeature, setCurrentFeature] = useState(0);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    const [signupSuccess, setSignupSuccess] = useState(null); // null or { type, email }

    const { loading, error, execute, setError } = useApiCall();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Auto-hide toast after 5 seconds
    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast({ show: false, message: "", type: "success" });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    const handleGoogleSuccess = async (credentialResponse) => {
        console.log("🔐 GOOGLE-SIGNUP: Credential response:", credentialResponse);
        if (credentialResponse.credential) {
            const result = await dispatch(googleLoginUser(credentialResponse.credential));
            if (googleLoginUser.fulfilled.match(result)) {
                navigate("/");
            }
        }
    };

    const handleGithubSignup = () => {
        window.location.href = new URL(ApiRoutes.auth.githubLogin, API_BASE_URL).toString();
    };

    const features = [
        {
            title: "Master Algorithms",
            description: "Practice with 1000+ coding problems from easy to expert level",
            icon: "🧠",
            color: "emerald"
        },
        {
            title: "Real-time Feedback",
            description: "Get instant code analysis and suggestions for improvement",
            icon: "⚡",
            color: "teal"
        },
        {
            title: "Interview Preparation",
            description: "Prepare for technical interviews with curated problem sets",
            icon: "🎯",
            color: "cyan"
        },
        {
            title: "AI-Powered Learning",
            description: "Personalized learning paths adapted to your skill level",
            icon: "🤖",
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
        setError("");
        console.log("📝 SIGNUP: Form submitted");
        console.log("Account Type:", accountType);
        console.log("Form Data:", { email: formData.email, username: formData.username, fullName: formData.fullName });

        // Client-side Password Validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            setError("Password does not meet complexity requirements.");
            console.error("❌ Password validation failed");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            console.error("❌ Password mismatch");
            return;
        }

        console.log("✅ Client validation passed");
        await execute(
            () => {
                console.log("🚀 Making register API call...");
                return authService.register(
                    formData.email,
                    formData.password,
                    formData.fullName,
                    formData.username,
                    accountType
                );
            },
            (response) => {
                console.log("✅ API Response:", response);
                if (response.success) {
                    console.log("✅ Signup successful!");

                    // Show email confirmation screen instead of redirecting
                    setSignupSuccess({ type: accountType, email: formData.email });
                } else {
                    console.error("❌ Signup failed:", response.message);
                    setToast({ show: true, message: response.message || "Signup failed. Please try again.", type: "error" });
                }
            }
        );
    };

    return (
        <Layout showNavbar={false}>
            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4 max-w-sm">
                    <div className={`p-4 rounded-lg shadow-lg flex items-start gap-3 ${
                        toast.type === "success"
                            ? "bg-green-50 border border-green-200 text-green-800"
                            : "bg-red-50 border border-red-200 text-red-800"
                    }`}>
                        {toast.type === "success" ? (
                            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        )}
                        <div className="flex-1">
                            <p className="font-medium text-sm">{toast.message}</p>
                        </div>
                        <button onClick={() => setToast({...toast, show: false})} className="text-current hover:opacity-70">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
            {/* Email Confirmation Screen */}
            {signupSuccess && (
                <div className="min-h-screen xalora-grid-bg flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full text-center">
                        <Link to="/" className="inline-block mb-8 group">
                            <div className="flex items-center justify-center space-x-3">
                                <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
                                    <img src="/logo_xalora.png" alt="Xalora Logo" className="h-10 w-auto" />
                                </div>
                                <span className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">XALORA</span>
                            </div>
                        </Link>

                        <div className="bg-white p-10 shadow-sm rounded-2xl border border-gray-100">
                            {/* Email Icon */}
                            <div className="mx-auto w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-10 h-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Check Your Email</h2>

                            {signupSuccess.type === "organization" ? (
                                <>
                                    <p className="text-gray-600 mb-4">
                                        We've sent an <span className="text-indigo-600 font-semibold">organization setup link</span> to
                                    </p>
                                    <p className="text-gray-900 font-semibold text-lg mb-6 break-all">{signupSuccess.email}</p>
                                    <div className="text-left space-y-3 mb-6">
                                        <div className="flex items-start gap-3 bg-green-50 p-3 rounded-lg border border-green-200">
                                            <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div>
                                                <p className="text-gray-900 font-medium text-sm">Account Created Successfully</p>
                                                <p className="text-gray-600 text-xs">Your account is ready. No email verification needed.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 bg-amber-50 p-3 rounded-lg border border-amber-200">
                                            <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                            <div>
                                                <p className="text-gray-900 font-medium text-sm">Complete Organization Setup</p>
                                                <p className="text-gray-600 text-xs">Click the setup link in your email to configure your organization, or login and we'll guide you.</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-gray-600 mb-4">
                                        We've sent a verification email to
                                    </p>
                                    <p className="text-gray-900 font-semibold text-lg mb-6 break-all">{signupSuccess.email}</p>
                                    <p className="text-gray-600 text-sm mb-6">
                                        Click the verification link in the email to activate your account. The link expires in 24 hours.
                                    </p>
                                </>
                            )}

                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                                <p className="text-amber-800 text-xs">
                                    💡 Don't see the email? Check your spam/junk folder. It may take a minute to arrive.
                                </p>
                            </div>

                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center w-full py-3.5 px-4 rounded-lg text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg gap-2"
                            >
                                Go to Login
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Signup Form */}
            {!signupSuccess && (
                        <div className="min-h-screen xalora-grid-bg flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left side - Features */}
                    <div className="hidden lg:block">
                        {/* Logo Section */}
                        <div className="text-center mb-12">
                            <Link to="/" className="inline-block mb-8 group">
                                <div className="flex items-center justify-center space-x-4">
                                    <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
                                        <img
                                            src="/logo_xalora.png"
                                            alt="Xalora Logo"
                                            className="h-12 w-auto group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                    <span className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                        XALORA
                                    </span>
                                </div>
                            </Link>
                            <h1 className="text-4xl font-bold mb-4 text-gray-900">
                                Join the Revolution
                            </h1>
                            <p className="text-xl text-gray-600">
                                Transform your coding skills with our AI-powered platform
                            </p>
                        </div>

                        {/* Feature showcase */}
                        <div className="bg-white rounded-3xl border border-gray-100 p-8 mb-8 shadow-sm hover:shadow-md transition-shadow duration-300">
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

                    {/* Right side - Signup Form */}
                    <div className="max-w-md w-full mx-auto">
                        {/* Header */}
                        <div className="text-center mb-6 sm:mb-8">
                            <Link to="/" className="inline-block mb-4 sm:mb-6 lg:hidden group">
                                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                                    <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
                                        <img
                                            src="/logo_xalora.png"
                                            alt="Xalora Logo"
                                            className="h-8 sm:h-10 w-auto group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                    <span className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                        XALORA
                                    </span>
                                </div>
                            </Link>
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                                Create your account
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600">
                                Join thousands of developers improving their coding skills
                            </p>
                        </div>

                        {/* Signup Form */}
                        <div className="bg-white py-6 sm:py-8 px-4 sm:px-6 shadow-sm rounded-2xl border border-gray-100">
                            {/* Account Type Selector */}
                            <div className="mb-6 sm:mb-8">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    👤 Account Type
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setAccountType("individual")}
                                        className={`p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                                            accountType === "individual"
                                                ? "border-indigo-600 bg-indigo-50"
                                                : "border-gray-200 bg-gray-50 hover:border-gray-300"
                                        }`}
                                    >
                                        <span className="text-2xl">👤</span>
                                        <span className="text-sm font-medium text-gray-900">Individual</span>
                                        <span className="text-xs text-gray-600">For students</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAccountType("organization")}
                                        className={`p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                                            accountType === "organization"
                                                ? "border-indigo-600 bg-indigo-50"
                                                : "border-gray-200 bg-gray-50 hover:border-gray-300"
                                        }`}
                                    >
                                        <span className="text-2xl">🏢</span>
                                        <span className="text-sm font-medium text-gray-900">Organization</span>
                                        <span className="text-xs text-gray-600">For colleges/teams</span>
                                    </button>
                                </div>
                                <p className="text-xs text-gray-600 mt-3">
                                    {accountType === "organization"
                                        ? "✓ Create your account, then set up your organization, define academic structure, and import students"
                                        : "✓ Create your account and start solving problems immediately"}
                                </p>
                            </div>
                            
                            {error && (
                                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border-l-4 border-l-red-500 border border-red-200 text-red-800 rounded-lg text-xs sm:text-sm flex items-start gap-3">
                                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            )}
                            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label
                                        htmlFor="fullName"
                                        className="block text-sm font-semibold text-gray-700 mb-2.5"
                                    >
                                        👤 Full Name
                                    </label>
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full px-0 py-2.5 text-sm sm:text-base bg-transparent border-b-2 border-gray-300 rounded-none focus:outline-none focus:border-indigo-600 text-gray-900 placeholder-gray-500 transition-all duration-200"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="username"
                                        className="block text-sm font-semibold text-gray-700 mb-2.5"
                                    >
                                        💻 Username
                                    </label>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full px-0 py-2.5 text-sm sm:text-base bg-transparent border-b-2 border-gray-300 rounded-none focus:outline-none focus:border-indigo-600 text-gray-900 placeholder-gray-500 transition-all duration-200"
                                        placeholder="Choose a username"
                                    />
                                </div>
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
                                        className="w-full px-0 py-2.5 text-sm sm:text-base bg-transparent border-b-2 border-gray-300 rounded-none focus:outline-none focus:border-indigo-600 text-gray-900 placeholder-gray-500 transition-all duration-200"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-semibold text-gray-700 mb-2.5"
                                    >
                                        🔒 New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full px-0 py-2.5 text-sm sm:text-base bg-transparent border-b-2 border-gray-300 rounded-none focus:outline-none focus:border-indigo-600 text-gray-900 placeholder-gray-500 transition-all duration-200 pr-10"
                                            placeholder="Create a password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
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
                                    {formData.password && (
                                        <div className="mt-3 space-y-1 bg-transparent p-0">
                                            <p className="text-xs text-gray-600 mb-2 font-medium">Password Requirements:</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className={`flex items-center text-xs ${formData.password.length >= 8 ? 'text-indigo-600' : 'text-gray-500'}`}>
                                                    <span className={`mr-1.5 ${formData.password.length >= 8 ? 'text-indigo-600' : 'text-gray-400'}`}>
                                                        {formData.password.length >= 8 ? '✓' : '○'}
                                                    </span>
                                                    8+ Characters
                                                </div>
                                                <div className={`flex items-center text-xs ${/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? 'text-indigo-600' : 'text-gray-500'}`}>
                                                    <span className={`mr-1.5 ${/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? 'text-indigo-600' : 'text-gray-400'}`}>
                                                        {/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? '✓' : '○'}
                                                    </span>
                                                    Upper & Lower case
                                                </div>
                                                <div className={`flex items-center text-xs ${/\d/.test(formData.password) ? 'text-indigo-600' : 'text-gray-500'}`}>
                                                    <span className={`mr-1.5 ${/\d/.test(formData.password) ? 'text-indigo-600' : 'text-gray-400'}`}>
                                                        {/\d/.test(formData.password) ? '✓' : '○'}
                                                    </span>
                                                    One Number
                                                </div>
                                                <div className={`flex items-center text-xs ${/[\W_]/.test(formData.password) ? 'text-indigo-600' : 'text-gray-500'}`}>
                                                    <span className={`mr-1.5 ${/[\W_]/.test(formData.password) ? 'text-indigo-600' : 'text-gray-400'}`}>
                                                        {/[\W_]/.test(formData.password) ? '✓' : '○'}
                                                    </span>
                                                    Special Character
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-semibold text-gray-700 mb-2.5"
                                    >
                                        ✓ Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full px-0 py-2.5 text-sm sm:text-base bg-transparent border-b-2 border-gray-300 rounded-none focus:outline-none focus:border-indigo-600 text-gray-900 placeholder-gray-500 transition-all duration-200 pr-10"
                                            placeholder="Confirm your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                        >
                                            {showConfirmPassword ? (
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
                                <div className="flex items-center">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        required
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded bg-white"
                                    />
                                    <label
                                        htmlFor="terms"
                                        className="ml-2 block text-sm text-gray-700"
                                    >
                                        I agree to the{" "}
                                        <a
                                            href="#"
                                            className="text-indigo-600 hover:text-indigo-700 transition-colors duration-300"
                                        >
                                            Terms of Service
                                        </a>{" "}
                                        and{" "}
                                        <a
                                            href="#"
                                            className="text-indigo-600 hover:text-indigo-700 transition-colors duration-300"
                                        >
                                            Privacy Policy
                                        </a>
                                    </label>
                                </div>
                                <div>
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
                                                {accountType === "organization" ? "Creating..." : "Creating..."}
                                            </>
                                        ) : accountType === "organization" ? (
                                            <>
                                                Create organization
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </>
                                        ) : (
                                            <>
                                                Create account
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                            {/* Google Login - Only for Individual accounts */}
                            {accountType === "individual" && (
                                <div className="mt-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-200" />
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-white text-gray-500">
                                        Or sign up with
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center justify-center gap-4">
                                        <GoogleLogin
                                            onSuccess={handleGoogleSuccess}
                                            onError={() => {
                                                console.log('Login Failed');
                                            }}
                                            type="icon"
                                            theme="outline"
                                            shape="circle"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleGithubSignup}
                                            className="shrink-0 w-[40px] h-[40px] inline-flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50 shadow-sm transition-all duration-200"
                                        >
                                            <Github className="h-5 w-5 text-gray-700" />
                                        </button>
                                        <p className="absolute -left-[9999px]">
                                            GitHub signup creates an individual account only.
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                                <p className="text-gray-600">
                                    Already have an account?{" "}
                                    <Link
                                        to="/login"
                                        className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                                    >
                                        Sign in →
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </Layout>
    );
};

export default Signup;
