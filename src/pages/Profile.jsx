import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "../components";
import { useApiCall } from "../hooks";
import authService from "../services/authService";
import subscriptionService from "../services/subscriptionService";
import problemService from "../services/problemService";
import quizService from "../services/quizService";
import { setUser } from "../store/slices/userSlice";

const Profile = () => {
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, execute } = useApiCall();
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [subscription, setSubscription] = useState(null);
    const [aiUsage, setAiUsage] = useState(null);
    const [stats, setStats] = useState({
        problemsSolved: 0,
        quizzesTaken: 0,
        currentStreak: 0
    });
    const [tokenInfo, setTokenInfo] = useState({
        hasToken: false,
        tokenType: "",
        tokenSource: ""
    });

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        avatar: "",
    });

    // Check for token information
    useEffect(() => {
        if (isAuthenticated && user) {
            // Check if we have a token in localStorage
            const storedUser = localStorage.getItem('hireveu_user');
            if (storedUser) {
                setTokenInfo({
                    hasToken: true,
                    tokenType: "localStorage",
                    tokenSource: "Client-side storage"
                });
            } else {
                // If authenticated but no localStorage token, it's likely cookie-based
                setTokenInfo({
                    hasToken: true,
                    tokenType: "cookie",
                    tokenSource: "Server-side authentication"
                });
            }
        } else {
            setTokenInfo({
                hasToken: false,
                tokenType: "none",
                tokenSource: "Not authenticated"
            });
        }
    }, [isAuthenticated, user]);

    // Redirect to login if user is not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            if (!isAuthenticated) return;
            
            await execute(
                () => authService.getUser(),
                (response) => {
                    if (response.success) {
                        const userData = response.data;
                        setFormData({
                            name: userData.name || "",
                            username: userData.username || "",
                            email: userData.email || "",
                            avatar: userData.avatar || "",
                        });
                        dispatch(setUser(userData));
                    }
                },
                (err) => {
                    // If authentication fails, redirect to login
                    if (err.response?.status === 401) {
                        navigate("/login");
                    }
                }
            );
        };

        fetchUserData();
    }, [dispatch, execute, isAuthenticated, navigate]);

    // Fetch subscription data
    useEffect(() => {
        const fetchSubscription = async () => {
            if (!isAuthenticated || !user) return;
            
            try {
                const subscriptionData = await subscriptionService.getCurrentSubscription();
                setSubscription(subscriptionData.data);
            } catch (err) {
                console.error("Error fetching subscription:", err);
                // If authentication fails, redirect to login
                if (err.response?.status === 401) {
                    navigate("/login");
                }
            }
        };

        fetchSubscription();
    }, [user, isAuthenticated, navigate]);

    // Fetch AI usage data
    useEffect(() => {
        const fetchAIUsage = async () => {
            if (!isAuthenticated || !user) return;
            
            try {
                const usageData = await subscriptionService.getAIUsageInfo();
                setAiUsage(usageData.data);
            } catch (err) {
                console.error("Error fetching AI usage:", err);
                // If authentication fails, redirect to login
                if (err.response?.status === 401) {
                    navigate("/login");
                }
            }
        };

        fetchAIUsage();
    }, [user, isAuthenticated, navigate]);

    // Fetch user stats
    useEffect(() => {
        const fetchUserStats = async () => {
            if (!isAuthenticated || !user) return;
            
            try {
                // Fetch problems data
                const problemsRes = await problemService.getAllProblems({ limit: 1000 });
                console.log('Problems response:', problemsRes);
                
                // Extract problems array with multiple fallbacks
                let problems = [];
                if (problemsRes?.data?.data?.problems && Array.isArray(problemsRes.data.data.problems)) {
                    problems = problemsRes.data.data.problems;
                } else if (problemsRes?.data?.problems && Array.isArray(problemsRes.data.problems)) {
                    problems = problemsRes.data.problems;
                } else if (problemsRes?.data && Array.isArray(problemsRes.data)) {
                    problems = problemsRes.data;
                } else if (Array.isArray(problemsRes)) {
                    problems = problemsRes;
                } else if (problemsRes?.problems && Array.isArray(problemsRes.problems)) {
                    problems = problemsRes.problems;
                }
                
                console.log('Parsed problems array:', problems.length, 'problems');
                
                // Check localStorage for solved problems as fallback (like in DSAAnalytics)
                const solvedProblemsStorage = JSON.parse(localStorage.getItem('solvedProblems') || '[]');
                
                // Calculate solved problems based on userStatus (with localStorage fallback)
                const solvedProblems = Array.isArray(problems) ? problems.filter(p => {
                    return p.userStatus === "Solved" || solvedProblemsStorage.includes(p._id);
                }).length : 0;
                
                // Fetch quiz data
                const quizRes = await quizService.getUserSubmissions();
                console.log('Quiz response:', quizRes);
                
                const quizzes = quizRes?.data?.submissions || quizRes?.submissions || quizRes?.data || [];
                
                // Update stats
                setStats({
                    problemsSolved: solvedProblems,
                    quizzesTaken: Array.isArray(quizzes) ? quizzes.length : 0,
                    currentStreak: user?.stats?.currentStreak || 0
                });
                
                console.log('Stats updated:', {
                    problemsSolved: solvedProblems,
                    quizzesTaken: Array.isArray(quizzes) ? quizzes.length : 0,
                    currentStreak: user?.stats?.currentStreak || 0,
                    solvedProblemsFromStorage: solvedProblemsStorage
                });
            } catch (err) {
                console.error("Error fetching user stats:", err);
                // If authentication fails, redirect to login
                if (err.response?.status === 401) {
                    navigate("/login");
                }
            }
        };

        fetchUserStats();
    }, [user, isAuthenticated, navigate]);

    // Update form data when user data changes from Redux
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                username: user.username || "",
                email: user.email || "",
                avatar: user.avatar || "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear messages when user types
        setUpdateError("");
        setSuccessMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        setUpdateError("");
        setSuccessMessage("");

        try {
            const response = await authService.updateUser(
                formData.name,
                formData.username,
                formData.email,
                formData.avatar
            );

            if (response.success) {
                console.log("✅ PROFILE: User update response:", response);
                dispatch(setUser(response.data));
                setSuccessMessage("Profile updated successfully!");
            } else {
                setUpdateError(response.message || "Failed to update profile");
            }
        } catch (err) {
            setUpdateError(
                err.response?.data?.message || "Failed to update profile"
            );
            // If authentication fails, redirect to login
            if (err.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setUpdateLoading(false);
        }
    };

    // Get plan details for display
    const getPlanDetails = () => {
        if (!subscription) return null;
        
        const planId = subscription.planId;
        const plans = {
            "spark": {
                name: "Xalora Spark",
                description: "Free forever plan with basic features",
                color: "bg-gray-600",
                features: [
                    "10 AI requests per day",
                    "3 file uploads per day",
                    "Basic coding playground",
                    "Community forum access"
                ]
            },
            "pulse": {
                name: "Xalora Pulse",
                description: "Perfect for intermediate learners",
                color: "bg-blue-600",
                features: [
                    "50 AI requests per day",
                    "10 file uploads per day",
                    "Access to GPT & Gemini models",
                    "AI-assisted code review",
                    "Quiz PDF downloads",
                    "Internship access"
                ]
            },
            "nexus": {
                name: "Xalora Nexus",
                description: "For advanced learners and project builders",
                color: "bg-purple-600",
                features: [
                    "100 AI requests per day",
                    "20 file uploads per day",
                    "Access to 20+ AI models",
                    "Real-time AI code mentor",
                    "Project workspace",
                    "Internship access"
                ]
            },
            "infinity": {
                name: "Xalora Infinity",
                description: "Ultimate plan for professionals",
                color: "bg-amber-600",
                features: [
                    "Unlimited AI requests",
                    "Unlimited file uploads",
                    "Access to 50+ AI models",
                    "AI Interview Engine",
                    "Priority support",
                    "Internship access"
                ]
            }
        };
        
        return plans[planId] || plans["spark"];
    };

    const planDetails = getPlanDetails();

    if (loading) {
        return (
            <Layout showNavbar={false}>
                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout showNavbar={false}>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header with gradient */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-bold text-white">
                                My Profile
                            </h1>
                            <Link
                                to="/"
                                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center transition-colors duration-300"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Home
                            </Link>
                        </div>
                        <p className="mt-2 text-white/70">
                            Manage your account settings and preferences.
                        </p>
                    </div>

                    {/* Error Messages */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-900/30 border border-red-700 text-red-300 rounded-lg">
                            {error}
                        </div>
                    )}

                    {updateError && (
                        <div className="mb-6 p-4 bg-red-900/30 border border-red-700 text-red-300 rounded-lg">
                            {updateError}
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-900/30 border border-green-700 text-green-300 rounded-lg">
                            {successMessage}
                        </div>
                    )}

                    {/* Subscription Info Card */}
                    {subscription && (
                        <div className="mb-8 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 overflow-hidden">
                            <div className={`px-6 py-4 ${planDetails?.color || "bg-gray-600"} text-white`}>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold">
                                            {planDetails?.name || "Xalora Spark"} Plan
                                        </h2>
                                        <p className="text-white/90 mt-1">
                                            {planDetails?.description || "Free forever plan"}
                                        </p>
                                    </div>
                                    <div className="mt-4 md:mt-0">
                                        <Link 
                                            to="/pricing" 
                                            className="inline-flex items-center px-4 py-2 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-300"
                                        >
                                            Change Plan
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="px-6 py-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Plan Features</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {planDetails?.features.map((feature, index) => (
                                        <div key={index} className="flex items-start">
                                            <svg className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-gray-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-6 pt-4 border-t border-gray-700">
                                    <div className="flex items-center text-sm text-gray-400 mb-2">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>
                                            Subscription period: Monthly
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-400">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>
                                            Valid until: {subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : "N/A"}
                                        </span>
                                    </div>
                                    {subscription.startDate && (
                                        <div className="flex items-center text-sm text-gray-400 mt-2">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>
                                                Started on: {new Date(subscription.startDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                    <div className="mt-4">
                                        <Link 
                                            to="/payment-history" 
                                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            View Payment History
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* AI Usage Card */}
                    {aiUsage && (
                        <div className="mb-8 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 overflow-hidden">
                            <div className="px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
                                <h2 className="text-2xl font-bold">AI Usage</h2>
                                <p className="text-white/90 mt-1">Track your daily AI requests</p>
                            </div>
                            
                            <div className="px-6 py-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Daily AI Requests</h3>
                                        <p className="text-gray-400 text-sm">
                                            {aiUsage.requestsUsed} of {aiUsage.requestsLimit} used
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-white">
                                            {aiUsage.requestsRemaining}
                                        </span>
                                        <p className="text-gray-400 text-sm">remaining</p>
                                    </div>
                                </div>
                                
                                <div className="w-full bg-gray-700 rounded-full h-4">
                                    <div 
                                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-4 rounded-full" 
                                        style={{ 
                                            width: `${(aiUsage.requestsUsed / aiUsage.requestsLimit) * 100}%` 
                                        }}
                                    ></div>
                                </div>
                                
                                <div className="mt-4 text-sm text-gray-400">
                                    <p>Reset daily at midnight</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Profile Card */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 overflow-hidden">
                        {/* Profile Header with gradient */}
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-8">
                            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                                <div className="relative">
                                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-1 rounded-full">
                                        <img
                                            src={
                                                formData.avatar ||
                                                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                            }
                                            alt="Profile"
                                            className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
                                        />
                                    </div>
                                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-gray-00 border-4 border-white rounded-full"></div>
                                </div>
                                <div className="text-center md:text-left text-white">
                                    <h2 className="text-2xl font-bold">
                                        {formData.name || "User"}
                                    </h2>
                                    <p className="text-emerald-100 text-lg">
                                        @{formData.username || "username"}
                                    </p>
                                    <div className="flex items-center justify-center md:justify-start mt-2">
                                        <svg
                                            className="w-5 h-5 mr-2 text-emerald-200"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                        <span className="text-emerald-100">
                                            {formData.email}
                                        </span>
                                    </div>
                                    <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 backdrop-blur-sm">
                                        <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                                        {user?.role === "admin" ? "Administrator" : user?.role === "setter" ? "Problem Setter" : "User"}
                                    </div>
                                </div>
                            </div>

                            {/* Statistics Section */}
                            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-gray-600 bg-opacity-10 backdrop-blur-sm rounded-xl p-5 text-center">
                                    <div className="text-3xl font-bold text-white">
                                        {stats.problemsSolved}
                                    </div>
                                    <div className="text-emerald-200 text-sm mt-1">
                                        Problems Solved
                                    </div>
                                </div>
                                <div className="bg-gray-600 bg-opacity-10 backdrop-blur-sm rounded-xl p-5 text-center">
                                    <div className="text-3xl font-bold text-white">
                                        {stats.quizzesTaken}
                                    </div>
                                    <div className="text-emerald-200 text-sm mt-1">
                                        Quizzes Taken
                                    </div>
                                </div>
                                <div className="bg-gray-600 bg-opacity-10 backdrop-blur-sm rounded-xl p-5 text-center">
                                    <div className="text-3xl font-bold text-white">
                                        {stats.currentStreak}
                                    </div>
                                    <div className="text-emerald-200 text-sm mt-1">
                                        Day Streak
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Form */}
                        <div className="px-6 py-8">
                            <h3 className="text-xl font-semibold text-white mb-6">
                                Account Settings
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-white/90 mb-2"
                                        >
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-500 transition-all duration-300"
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
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-500 transition-all duration-300"
                                            placeholder="Choose a username"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-white/90 mb-2"
                                    >
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-500 transition-all duration-300"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="avatar"
                                        className="block text-sm font-medium text-white/90 mb-2"
                                    >
                                        Avatar URL
                                    </label>
                                    <input
                                        type="text"
                                        id="avatar"
                                        name="avatar"
                                        value={formData.avatar}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-500 transition-all duration-300"
                                        placeholder="Enter avatar URL"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={updateLoading}
                                        className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {updateLoading ? (
                                            <>
                                                <svg
                                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
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
                                                Updating...
                                            </>
                                        ) : (
                                            "Update Profile"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                        
                        {/* Token Information Section */}
                        <div className="px-6 py-6 border-t border-gray-700">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Authentication Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white/5 rounded-lg p-4 border border-gray-700">
                                    <div className="text-sm text-gray-400 mb-1">Authentication Status</div>
                                    <div className={`text-lg font-semibold ${isAuthenticated ? 'text-green-400' : 'text-red-400'}`}>
                                        {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4 border border-gray-700">
                                    <div className="text-sm text-gray-400 mb-1">Token Type</div>
                                    <div className="text-lg font-semibold text-cyan-400">
                                        {tokenInfo.tokenType}
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4 border border-gray-700">
                                    <div className="text-sm text-gray-400 mb-1">Token Source</div>
                                    <div className="text-lg font-semibold text-purple-400">
                                        {tokenInfo.tokenSource}
                                    </div>
                                </div>
                            </div>
                            {tokenInfo.hasToken && (
                                <div className="mt-4 text-sm text-gray-400">
                                    <p>You are currently logged in and your authentication is maintained through {tokenInfo.tokenType}-based tokens.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;