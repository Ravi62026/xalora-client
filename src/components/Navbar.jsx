import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/slices/userSlice";

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate("/");
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
    };

    const closeProfileMenu = () => {
        setIsProfileMenuOpen(false);
    };

    const avatarInitial = (user?.name || user?.username || "U").charAt(0).toUpperCase();
    const isOrgTeam = user?.userType === "org_team";

    // Determine dashboard route based on user organization
    const getDashboardRoute = () => {
        if (!user?.organization?.orgId && !user?.organization?._id) return "/dashboard";
        if (user?.organization?.role === "super_admin") return "/org/dashboard";
        if (user?.userType === "org_team") return "/org/teamdashboard";
        return "/org/student/dashboard";
    };

    return (
        <nav className="bg-gradient-to-r from-gray-900 via-slate-900 to-black backdrop-blur-lg shadow-2xl border-b border-emerald-500/20 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-24">
                    {/* Logo/Brand */}
                    <div className="flex items-center">
                        <Link
                            to="/"
                            className="flex items-center hover:scale-105 transition-all duration-300 group"
                            onClick={closeMobileMenu}
                        >
                            <div className="relative">
                                <img
                                    src="/logo_xalora.png"
                                    alt="Xalora Logo"
                                    className="w-28 h-20 object-contain max-w-none drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 to-teal-400/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center gap-3">
                        <Link
                            to="/"
                            className="relative text-emerald-100 hover:text-white px-4 py-2 rounded-xl text-base font-medium whitespace-nowrap transition-all duration-300 hover:bg-white/10 group border border-transparent hover:border-emerald-500/30"
                        >
                            <span className="relative z-10">Home</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>
                        {!isOrgTeam && (
                            <>
                                <Link
                                    to="/problems"
                                    className="relative text-emerald-100 hover:text-white px-4 py-2 rounded-xl text-base font-medium whitespace-nowrap transition-all duration-300 hover:bg-white/10 group border border-transparent hover:border-emerald-500/30"
                                >
                                    <span className="relative z-10">Problems</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>
                                <Link
                                    to="/quiz"
                                    className="relative text-emerald-100 hover:text-white px-4 py-2 rounded-xl text-base font-medium whitespace-nowrap transition-all duration-300 hover:bg-white/10 group border border-transparent hover:border-emerald-500/30"
                                >
                                    <span className="relative z-10">Quiz</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>
                                <Link
                                    to="/internships"
                                    className="relative text-emerald-100 hover:text-white px-4 py-2 rounded-xl text-base font-medium whitespace-nowrap transition-all duration-300 hover:bg-white/10 group border border-transparent hover:border-emerald-500/30"
                                >
                                    <span className="relative z-10">Internships</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>
                                <Link
                                    to="/resume-ai"
                                    className="relative text-emerald-100 hover:text-white px-4 py-2 rounded-xl text-base font-medium whitespace-nowrap transition-all duration-300 hover:bg-white/10 group border border-transparent hover:border-emerald-500/30"
                                >
                                    <span className="relative z-10">Resume AI</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>
                                <Link
                                    to="/ai-interview/setup"
                                    className="relative text-emerald-100 hover:text-white px-4 py-2 rounded-xl text-base font-medium whitespace-nowrap transition-all duration-300 hover:bg-white/10 group border border-transparent hover:border-emerald-500/30"
                                >
                                    <span className="relative z-10">🎥 AI Interview</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>
                            </>
                        )}
                        {/* Dashboard button - only shown when user is authenticated */}
                        {isAuthenticated && (
                            <Link
                                to={getDashboardRoute()}
                                className="relative text-emerald-100 hover:text-white px-4 py-2 rounded-xl text-base font-medium whitespace-nowrap transition-all duration-300 hover:bg-white/10 group border border-transparent hover:border-emerald-500/30"
                            >
                                <span className="relative z-10">Dashboard</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </Link>
                        )}
                        {isAuthenticated && !isOrgTeam && (
                            <button
                                onClick={() => {
                                    const xaloraUrl = import.meta.env.VITE_XALORA_AI_URL;
                                    // Get token from cookies properly - the main app uses cookies for auth
                                    // We'll pass a flag to indicate the user is authenticated
                                    // The AI assistant will handle authentication via cookies
                                    const minimalUserInfo = {
                                        _id: user._id,
                                        name: user.name,
                                        username: user.username,
                                        email: user.email,
                                        role: user.role
                                    };
                                    const userProfile = encodeURIComponent(JSON.stringify(minimalUserInfo));
                                    window.open(`${xaloraUrl}?user=${userProfile}`, '_blank');
                                }}
                                className="relative bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 rounded-xl text-base font-medium whitespace-nowrap transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center space-x-2">
                                    <span>🤖</span>
                                    <span>AI Assistant</span>
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        )}
                    </div>

                    {/* Desktop User Actions */}
                    <div className="hidden lg:flex items-center space-x-2 shrink-0">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={toggleProfileMenu}
                                    className="flex items-center space-x-2 hover:bg-gradient-to-r hover:from-emerald-800/30 hover:to-teal-800/30 px-2.5 py-2 rounded-xl transition-all duration-300 group border border-emerald-700/30 hover:border-emerald-500/50 focus:outline-none max-w-[220px]"
                                >
                                    <div className="relative">
                                        {user?.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user?.name || "User"}
                                                className="w-10 h-10 rounded-full border-2 border-emerald-400 group-hover:border-white transition-colors duration-300"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full border-2 border-emerald-400 group-hover:border-white transition-colors duration-300 bg-emerald-600/40 text-white flex items-center justify-center font-semibold">
                                                {avatarInitial}
                                            </div>
                                        )}
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                                    </div>
                                    <div className="hidden lg:block min-w-0">
                                        <div className="text-emerald-100 text-sm font-semibold group-hover:text-white transition-colors duration-300 truncate max-w-[120px]">
                                            {user?.name || user?.username}
                                        </div>
                                        <div className="hidden xl:flex items-center space-x-2">
                                            <div className="text-emerald-200 text-xs group-hover:text-emerald-100 transition-colors duration-300 whitespace-nowrap">
                                                {user?.role === "setter" ? "Problem Setter" : "User"}
                                            </div>
                                            {/* Display JBP Coins if available */}
                                            {user && typeof user.jbpCoins === 'number' && (
                                                <div className="hidden 2xl:flex items-center text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full whitespace-nowrap">
                                                    <span className="mr-1">🪙</span>
                                                    {user.jbpCoins}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </button>

                                {/* Profile Dropdown Menu */}
                                {isProfileMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={closeProfileMenu}
                                        ></div>
                                        <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-lg py-1 border border-emerald-500/30 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-emerald-100 hover:bg-gradient-to-r from-emerald-700/50 to-teal-700/50 hover:text-white transition-all duration-200"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    closeProfileMenu();
                                                }}
                                            >
                                                Profile
                                            </Link>
                                            {/* Display JBP Coins in dropdown if available */}
                                            {user && typeof user.jbpCoins === 'number' && (
                                                <div className="px-4 py-2 text-sm text-amber-300 border-b border-gray-700">
                                                    <div className="flex items-center justify-between">
                                                        <span>JBP Coins:</span>
                                                        <span className="font-semibold flex items-center">
                                                            <span className="mr-1">🪙</span>
                                                            {user.jbpCoins}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleLogout();
                                                    closeProfileMenu();
                                                }}
                                                className="block w-full text-left px-4 py-2 text-sm text-emerald-100 hover:bg-gradient-to-r from-red-700/50 to-rose-700/50 hover:text-white transition-all duration-200"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="relative text-emerald-100 hover:text-white px-5 py-2.5 rounded-xl text-base font-medium transition-all duration-300 hover:bg-white/10 group border border-transparent hover:border-emerald-500/30"
                                >
                                    <span className="relative z-10">Login</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>
                                <Link
                                    to="/signup"
                                    className="relative bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2.5 rounded-xl text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group overflow-hidden"
                                >
                                    <span className="relative z-10">Sign Up</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden">
                        <button
                            onClick={toggleMobileMenu}
                            className="relative text-emerald-100 hover:text-white p-3 rounded-xl hover:bg-white/10 transition-all duration-300 group border border-transparent hover:border-emerald-500/30"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {isMobileMenuOpen ? (
                                <svg
                                    className="w-6 h-6 relative z-10 transform group-hover:scale-110 transition-transform duration-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="w-6 h-6 relative z-10 transform group-hover:scale-110 transition-transform duration-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden pb-6 animate-in slide-in-from-top-2 duration-300">
                        <div className="px-2 pt-4 pb-3 space-y-2 sm:px-3 border-t border-emerald-700/30 bg-gradient-to-b from-gray-900/50 to-slate-900/50 backdrop-blur-sm">
                            {/* Mobile Navigation Links */}
                            <Link
                                to="/"
                                className="relative text-emerald-100 hover:text-white block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 hover:bg-white/10 group border border-transparent hover:border-emerald-500/30"
                                onClick={closeMobileMenu}
                            >
                                <span className="relative z-10">🏠 Home</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </Link>
                            {!isOrgTeam && (
                                <>
                                    <Link
                                        to="/problems"
                                        className="relative text-emerald-100 hover:text-white block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 hover:bg-white/10 group border border-transparent hover:border-emerald-500/30"
                                        onClick={closeMobileMenu}
                                    >
                                        <span className="relative z-10">💻 Problems</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </Link>
                                    <Link
                                        to="/quiz"
                                        className="relative text-emerald-100 hover:text-white block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 hover:bg-white/10 group border border-transparent hover:border-emerald-500/30"
                                        onClick={closeMobileMenu}
                                    >
                                        <span className="relative z-10">🧠 Quiz</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </Link>
                                    <Link
                                        to="/internships"
                                        className="relative text-emerald-100 hover:text-white block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 hover:bg-white/10 group border border-transparent hover:border-emerald-500/30"
                                        onClick={closeMobileMenu}
                                    >
                                        <span className="relative z-10">💼 Internships</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </Link>
                                    <Link
                                        to="/resume-ai"
                                        className="relative text-emerald-100 hover:text-white block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 hover:bg-white/10 group border border-transparent hover:border-emerald-500/30"
                                        onClick={closeMobileMenu}
                                    >
                                        <span className="relative z-10">🤖 Resume AI</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </Link>
                                    <Link
                                        to="/ai-interview/setup"
                                        className="relative text-emerald-100 hover:text-white block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 hover:bg-white/10 group border border-transparent hover:border-emerald-500/30"
                                        onClick={closeMobileMenu}
                                    >
                                        <span className="relative z-10">🎥 AI Interview</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </Link>
                                </>
                            )}
                            {/* Dashboard button for mobile - only shown when user is authenticated */}
                            {isAuthenticated && (
                                <Link
                                    to={getDashboardRoute()}
                                    className="relative text-emerald-100 hover:text-white block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 hover:bg-white/10 group border border-transparent hover:border-emerald-500/30"
                                    onClick={closeMobileMenu}
                                >
                                    <span className="relative z-10">📊 Dashboard</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>
                            )}
                            {isAuthenticated && !isOrgTeam && (
                                <button
                                    onClick={() => {
                                        const xaloraUrl = import.meta.env.VITE_XALORA_AI_URL;
                                        // Get token from cookies properly - the main app uses cookies for auth
                                        // We'll pass a flag to indicate the user is authenticated
                                        // The AI assistant will handle authentication via cookies
                                        const minimalUserInfo = {
                                            _id: user._id,
                                            name: user.name,
                                            username: user.username,
                                            email: user.email,
                                            role: user.role
                                        };
                                        const userProfile = encodeURIComponent(JSON.stringify(minimalUserInfo));
                                        window.open(`${xaloraUrl}?user=${userProfile}`, '_blank');
                                        closeMobileMenu();
                                    }}
                                    className="relative bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group overflow-hidden w-full text-left"
                                >
                                    <span className="relative z-10">🤖 AI Assistant</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                            )}

                            {/* Mobile User Actions */}
                            <div className="pt-6 pb-3 border-t border-emerald-700/30 mt-4">
                                {isAuthenticated ? (
                                    <div className="space-y-4">
                                        <div className="relative z-50">
                                            <button
                                                onClick={toggleProfileMenu}
                                                className="flex items-center space-x-4 px-4 py-4 rounded-xl text-base font-medium text-emerald-100 hover:bg-gradient-to-r hover:from-emerald-800/30 hover:to-teal-800/30 transition-all duration-300 group border border-emerald-700/30 hover:border-emerald-500/50 w-full text-left focus:outline-none"
                                            >
                                                <div className="relative">
                                                    {user?.avatar ? (
                                                        <img
                                                            src={user.avatar}
                                                            alt={user?.name || "User"}
                                                            className="w-12 h-12 rounded-full border-2 border-emerald-400 group-hover:border-white transition-colors duration-300"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full border-2 border-emerald-400 group-hover:border-white transition-colors duration-300 bg-emerald-600/40 text-white flex items-center justify-center font-semibold">
                                                            {avatarInitial}
                                                        </div>
                                                    )}
                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-white font-semibold group-hover:text-white transition-colors duration-300">
                                                        {user?.name || user?.username}
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-sm text-emerald-200 group-hover:text-emerald-100 transition-colors duration-300">
                                                            {user?.role === "setter" ? "🔧 Problem Setter" : "👤 User"}
                                                        </div>
                                                        {/* Display JBP Coins if available */}
                                                        {user && typeof user.jbpCoins === 'number' && (
                                                            <div className="flex items-center text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full">
                                                                <span className="mr-1">🪙</span>
                                                                {user.jbpCoins}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>

                                            {/* Mobile Profile Dropdown Menu */}
                                            {isProfileMenuOpen && (
                                                <>
                                                    <div
                                                        className="fixed inset-0 z-40"
                                                        onClick={closeProfileMenu}
                                                    ></div>
                                                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-xl shadow-lg py-1 border border-emerald-500/30 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                                                        <Link
                                                            to="/profile"
                                                            className="block px-4 py-3 text-sm text-emerald-100 hover:bg-gradient-to-r from-emerald-700/50 to-teal-700/50 hover:text-white transition-all duration-200 cursor-pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                closeProfileMenu();
                                                                closeMobileMenu();
                                                            }}
                                                        >
                                                            Profile
                                                        </Link>
                                                        {/* Display JBP Coins in dropdown if available */}
                                                        {user && typeof user.jbpCoins === 'number' && (
                                                            <div className="px-4 py-2 text-sm text-amber-300 border-b border-gray-700">
                                                                <div className="flex items-center justify-between">
                                                                    <span>JBP Coins:</span>
                                                                    <span className="font-semibold flex items-center">
                                                                        <span className="mr-1">🪙</span>
                                                                        {user.jbpCoins}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleLogout();
                                                                closeProfileMenu();
                                                            }}
                                                            className="block w-full text-left px-4 py-3 text-sm text-emerald-100 hover:bg-gradient-to-r from-red-700/50 to-rose-700/50 hover:text-white transition-all duration-200 cursor-pointer"
                                                        >
                                                            Logout
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <Link
                                            to="/login"
                                            className="relative text-emerald-100 hover:text-white block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 hover:bg-white/10 group border border-transparent hover:border-emerald-500/30 text-center"
                                            onClick={closeMobileMenu}
                                        >
                                            <span className="relative z-10">🔑 Login</span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </Link>
                                        <Link
                                            to="/signup"
                                            className="relative bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group overflow-hidden text-center"
                                            onClick={closeMobileMenu}
                                        >
                                            <span className="relative z-10">✨ Sign Up</span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
