import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import authService from "../services/authService";
import { googleLoginUser } from "../store/slices/userSlice";
import { GoogleLogin } from "@react-oauth/google";
import { useApiCall } from "../hooks";
import { Layout } from "../components";

const Signup = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [currentFeature, setCurrentFeature] = useState(0);

    const { loading, error, execute, setError } = useApiCall();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleGoogleSuccess = async (credentialResponse) => {
        console.log("🔐 GOOGLE-SIGNUP: Credential response:", credentialResponse);
        if (credentialResponse.credential) {
            const result = await dispatch(googleLoginUser(credentialResponse.credential));
            if (googleLoginUser.fulfilled.match(result)) {
                navigate("/");
            }
        }
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

        // Client-side Password Validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            setError("Password does not meet complexity requirements.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        await execute(
            () =>
                authService.register(
                    formData.email,
                    formData.password,
                    formData.fullName,
                    formData.username
                ),
            (response) => {
                if (response.success) {
                    navigate("/login");
                } else {
                    setError(response.message);
                }
            }
        );
    };

    return (
        <Layout showNavbar={false}>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left side - Features */}
                    <div className="hidden lg:block">
                        {/* Logo Section */}
                        <div className="text-center mb-12">
                            <Link to="/" className="inline-block mb-8 group">
                                <div className="flex items-center justify-center space-x-4">
                                    <div className="relative">
                                        <img
                                            src="/logo_xalora.png"
                                            alt="Xalora Logo"
                                            className="h-20 w-auto group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-lg animate-pulse"></div>
                                    </div>
                                    <span className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-emerald-200 transition-all duration-300">
                                        XALORA
                                    </span>
                                </div>
                            </Link>
                            <h1 className="text-3xl font-black mb-4 text-white">
                                Join the Revolution
                            </h1>
                            <p className="text-xl text-white/70">
                                Transform your coding skills with our AI-powered platform
                            </p>
                        </div>

                        {/* Feature showcase */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 mb-8 shadow-2xl">
                            <div className="text-center">
                                <div className="text-6xl mb-6 animate-bounce">
                                    {features[currentFeature].icon}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">
                                    {features[currentFeature].title}
                                </h3>
                                <p className="text-white/70 text-lg leading-relaxed">
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
                                        ? 'bg-emerald-400 scale-125'
                                        : 'bg-white/30 hover:bg-white/50'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 mt-12">
                            <div className="text-center">
                                <div className="text-2xl font-black text-emerald-400 mb-1">100K+</div>
                                <div className="text-white/70 text-sm">Developers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-black text-teal-400 mb-1">5M+</div>
                                <div className="text-white/70 text-sm">Solutions</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-black text-cyan-400 mb-1">30+</div>
                                <div className="text-white/70 text-sm">Languages</div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Signup Form */}
                    <div className="max-w-md w-full mx-auto">
                        {/* Header */}
                        <div className="text-center mb-6 sm:mb-8">
                            <Link to="/" className="inline-block mb-4 sm:mb-6 lg:hidden group">
                                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                                    <div className="relative">
                                        <img
                                            src="/logo_xalora.png"
                                            alt="Xalora Logo"
                                            className="h-10 sm:h-12 w-auto group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-lg animate-pulse"></div>
                                    </div>
                                    <span className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:from-white group-hover:to-emerald-200 transition-all duration-300">
                                        XALORA
                                    </span>
                                </div>
                            </Link>
                            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                                Create your account
                            </h2>
                            <p className="text-sm sm:text-base text-white/70">
                                Join thousands of developers improving their coding skills
                            </p>
                        </div>

                        {/* Signup Form */}
                        <div className="bg-white/10 backdrop-blur-sm py-6 sm:py-8 px-4 sm:px-6 shadow-2xl rounded-xl sm:rounded-2xl border border-white/20">
                            {error && (
                                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg text-xs sm:text-sm flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </div>
                            )}
                            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label
                                        htmlFor="fullName"
                                        className="block text-sm font-medium text-white/90 mb-2"
                                    >
                                        Full Name
                                    </label>
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-500 transition-all duration-300"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="username"
                                        className="block text-sm font-medium text-white/90 mb-2"
                                    >
                                        Username
                                    </label>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-500 transition-all duration-300"
                                        placeholder="Choose a username"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-white/90 mb-2"
                                    >
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-500 transition-all duration-300"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-white/90 mb-2"
                                    >
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-500 transition-all duration-300"
                                        placeholder="Create a password"
                                    />
                                    {formData.password && (
                                        <div className="mt-2 space-y-1 bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                                            <p className="text-xs text-white/50 mb-2 font-medium">Password Requirements:</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className={`flex items-center text-xs ${formData.password.length >= 8 ? 'text-emerald-400' : 'text-gray-400'}`}>
                                                    <span className={`mr-1.5 ${formData.password.length >= 8 ? 'text-emerald-400' : 'text-gray-600'}`}>
                                                        {formData.password.length >= 8 ? '✓' : '○'}
                                                    </span>
                                                    8+ Characters
                                                </div>
                                                <div className={`flex items-center text-xs ${/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? 'text-emerald-400' : 'text-gray-400'}`}>
                                                    <span className={`mr-1.5 ${/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? 'text-emerald-400' : 'text-gray-600'}`}>
                                                        {/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? '✓' : '○'}
                                                    </span>
                                                    Upper & Lower case
                                                </div>
                                                <div className={`flex items-center text-xs ${/\d/.test(formData.password) ? 'text-emerald-400' : 'text-gray-400'}`}>
                                                    <span className={`mr-1.5 ${/\d/.test(formData.password) ? 'text-emerald-400' : 'text-gray-600'}`}>
                                                        {/\d/.test(formData.password) ? '✓' : '○'}
                                                    </span>
                                                    One Number
                                                </div>
                                                <div className={`flex items-center text-xs ${/[\W_]/.test(formData.password) ? 'text-emerald-400' : 'text-gray-400'}`}>
                                                    <span className={`mr-1.5 ${/[\W_]/.test(formData.password) ? 'text-emerald-400' : 'text-gray-600'}`}>
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
                                        className="block text-sm font-medium text-white/90 mb-2"
                                    >
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-500 transition-all duration-300"
                                        placeholder="Confirm your password"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        required
                                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-700 rounded bg-gray-900"
                                    />
                                    <label
                                        htmlFor="terms"
                                        className="ml-2 block text-sm text-white/80"
                                    >
                                        I agree to the{" "}
                                        <a
                                            href="#"
                                            className="text-emerald-400 hover:text-emerald-300 transition-colors duration-300"
                                        >
                                            Terms of Service
                                        </a>{" "}
                                        and{" "}
                                        <a
                                            href="#"
                                            className="text-emerald-400 hover:text-emerald-300 transition-colors duration-300"
                                        >
                                            Privacy Policy
                                        </a>
                                    </label>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm sm:text-base font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                    >
                                        {loading ? (
                                            <>
                                                <svg
                                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                                                Creating account...
                                            </>
                                        ) : (
                                            "Create account"
                                        )}
                                    </button>
                                </div>
                            </form>
                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-700" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-transparent text-white/70">
                                            Or sign up with
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-center">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => {
                                            console.log('Login Failed');
                                        }}
                                        theme="filled_black"
                                        shape="pill"
                                        width="350px"
                                        text="signup_with"
                                    />
                                </div>
                            </div>
                            <div className="mt-6 text-center">
                                <p className="text-sm text-white/70">
                                    Already have an account?{" "}
                                    <Link
                                        to="/login"
                                        className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors duration-300"
                                    >
                                        Sign in
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

export default Signup;