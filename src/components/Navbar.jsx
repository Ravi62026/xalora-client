import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, switchWorkspace } from "../store/slices/userSlice";
import {
    getActiveWorkspace,
    getDashboardRouteForUser as getWorkspaceDashboardRoute,
    isCompanyCandidateWorkspace,
} from "../utils/workspace";
import WorkspaceChooserModal from "./WorkspaceChooserModal";

const ChevronDown = ({ className = "" }) => (
    <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const PENDING_WORKSPACE_CHOICE_KEY = "xalora_pending_workspace_choice";
const RESUME_SITE_URL = "https://www.resume.xalora.one";

const getWorkspaceTypeLabel = (workspace) => {
    if (workspace?.type === "college") return "College";
    if (workspace?.type === "company") return "Company";
    return "Personal";
};

const getWorkspaceRoleLabel = (workspace) => {
    if (!workspace?.role) return "Member";
    return workspace.role
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

// Dropdown component with click-outside handling
const NavDropdown = ({ label, items, closeMobileMenu, isActive }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative flex items-center h-full">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-1.5 text-base font-medium transition-colors duration-200 ${isActive ? "text-emerald-400" : "text-gray-300 hover:text-emerald-400"}`}
            >
                {label}
                <ChevronDown className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute top-16 left-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-emerald-500/20 shadow-2xl shadow-black/60 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {items.map((item, index) => {
                        if (item.action) {
                            return (
                                <button
                                    key={`dropdown-action-${index}`}
                                    onClick={() => {
                                        item.action();
                                        setIsOpen(false);
                                        closeMobileMenu?.();
                                    }}
                                    className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-sm text-gray-300 hover:text-white hover:bg-emerald-500/10 transition-colors duration-150"
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <div>
                                        <div className="font-medium">{item.label}</div>
                                        {item.desc && <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>}
                                    </div>
                                </button>
                            );
                        }

                        if (item.external || item.href) {
                            return (
                                <a
                                    key={item.href || item.to}
                                    href={item.href || item.to}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-emerald-500/10 transition-colors duration-150"
                                    onClick={() => {
                                        setIsOpen(false);
                                        closeMobileMenu?.();
                                    }}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <div>
                                        <div className="font-medium">{item.label}</div>
                                        {item.desc && <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>}
                                    </div>
                                </a>
                            );
                        }

                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-emerald-500/10 transition-colors duration-150"
                                onClick={() => {
                                    setIsOpen(false);
                                    closeMobileMenu?.();
                                }}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <div>
                                    <div className="font-medium">{item.label}</div>
                                    {item.desc && <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isSwitchingWorkspace, setIsSwitchingWorkspace] = useState(false);
    const [isWorkspaceChooserOpen, setIsWorkspaceChooserOpen] = useState(false);
    const profileRef = useRef(null);
    const workspaceChooserShownRef = useRef(false);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsProfileMenuOpen(false);
    }, [location.pathname]);

    // Click outside for profile dropdown
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!isMobileMenuOpen) {
            document.body.style.overflow = "";
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        if (!isAuthenticated) {
            workspaceChooserShownRef.current = false;
            setIsWorkspaceChooserOpen(false);
            return;
        }

        const pendingWorkspaceChoice =
            typeof window !== "undefined" &&
            sessionStorage.getItem(PENDING_WORKSPACE_CHOICE_KEY) === "1";
        const hasMultipleWorkspaces = (user?.workspaces || []).length > 1;

        if (!hasMultipleWorkspaces) {
            workspaceChooserShownRef.current = false;
            setIsWorkspaceChooserOpen(false);
            if (pendingWorkspaceChoice) {
                sessionStorage.removeItem(PENDING_WORKSPACE_CHOICE_KEY);
            }
            return;
        }

        const shouldOpenChooser =
            pendingWorkspaceChoice && !workspaceChooserShownRef.current;

        if (shouldOpenChooser) {
            workspaceChooserShownRef.current = true;
            setIsWorkspaceChooserOpen(true);
            sessionStorage.removeItem(PENDING_WORKSPACE_CHOICE_KEY);
            return;
        }

        if (!pendingWorkspaceChoice && !isWorkspaceChooserOpen) {
            setIsWorkspaceChooserOpen(false);
        }
    }, [
        isAuthenticated,
        isWorkspaceChooserOpen,
        user?.workspaces?.length,
    ]);

    const handleLogout = async () => {
        await dispatch(logoutUser());
        sessionStorage.removeItem(PENDING_WORKSPACE_CHOICE_KEY);
        workspaceChooserShownRef.current = false;
        navigate("/");
        setIsMobileMenuOpen(false);
        setIsProfileMenuOpen(false);
        setIsWorkspaceChooserOpen(false);
    };

    const closeMobileMenu = () => setIsMobileMenuOpen(false);
    const avatarInitial = (user?.name || user?.username || "U").charAt(0).toUpperCase();
    const isOrgTeam = user?.userType === "org_team";
    const activeWorkspace = getActiveWorkspace(user);
    const isCompanyCandidate = isCompanyCandidateWorkspace(activeWorkspace);
    const availableWorkspaces = user?.workspaces || [];
    const activeWorkspaceId = user?.activeWorkspace?.workspaceId || "";

    const getDashboardRoute = () => {
        return getWorkspaceDashboardRoute(user);
    };

    const getDashboardRouteForUser = (currentUser) => {
        return getWorkspaceDashboardRoute(currentUser);
    };

    const handleWorkspaceChange = async (nextWorkspaceId) => {
        if (!nextWorkspaceId || nextWorkspaceId === activeWorkspaceId) return;

        setIsSwitchingWorkspace(true);
        try {
            const nextUser = await dispatch(switchWorkspace(nextWorkspaceId)).unwrap();
            sessionStorage.removeItem(PENDING_WORKSPACE_CHOICE_KEY);
            workspaceChooserShownRef.current = true;
            setIsWorkspaceChooserOpen(false);
            navigate(getDashboardRouteForUser(nextUser));
            setIsProfileMenuOpen(false);
            setIsMobileMenuOpen(false);
        } finally {
            setIsSwitchingWorkspace(false);
        }
    };

    const handleDismissWorkspaceChooser = () => {
        sessionStorage.removeItem(PENDING_WORKSPACE_CHOICE_KEY);
        workspaceChooserShownRef.current = true;
        setIsWorkspaceChooserOpen(false);
    };

    // Check if path is active
    const isActive = (path) => {
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };

    const isDropdownActive = (items) => {
        return items.some(item => item.to && location.pathname.startsWith(item.to));
    };

    const navLinkClass = (path) =>
        `flex items-center text-base font-medium h-full transition-colors duration-200 ${isActive(path)
            ? "text-emerald-400"
            : "text-gray-300 hover:text-emerald-400"
        }`;

    // Navigation groups
    const practiceItems = [
        { to: "/problems", icon: "💻", label: "Problems", desc: "DSA problem bank" },
        { to: "/quiz", icon: "🧠", label: "Quizzes", desc: "Test your knowledge" },
        { to: "/internships", icon: "💼", label: "Internships", desc: "Real-world projects" },
    ];

    const aiToolsItems = [
        { href: RESUME_SITE_URL, external: true, icon: "📄", label: "Resume AI", desc: "ATS-ready resume analysis" },
        { to: "/ai-interview/setup", icon: "🎥", label: "AI Interview", desc: "Mock interview practice" },
        { to: "/job-genie", icon: "🔮", label: "Job Genie", desc: "AI job search" },
        {
            action: () => {
                if (!user) return;
                const xaloraUrl = import.meta.env.VITE_XALORA_AI_URL;
                const minimalUserInfo = {
                    _id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                };
                const userProfile = encodeURIComponent(JSON.stringify(minimalUserInfo));
                window.open(`${xaloraUrl}?user=${userProfile}`, "_blank");
            },
            icon: "🤖",
            label: "AI Assistant",
            desc: "Personal AI Mentor"
        }
    ];

    const learnItems = [
        { to: "/algorithms", icon: "⚡", label: "Algorithms", desc: "Sorting, searching & more" },
        { to: "/data-structures", icon: "🏗️", label: "Data Structures", desc: "Arrays, trees, graphs" },
        { to: "/system-design", icon: "🏛️", label: "System Design", desc: "Architecture patterns" },
        { to: "/roadmap", icon: "🗺️", label: "Roadmaps", desc: "Learning paths" },
    ];

    return (
        <nav className="bg-gradient-to-r from-gray-900 via-slate-900 to-black backdrop-blur-lg shadow-2xl border border-emerald-500/20 sticky top-4 z-50 mx-auto w-[95%] md:w-[90%] max-w-6xl rounded-2xl">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center shrink-0" onClick={closeMobileMenu}>
                        <img
                            src="/logo_xalora.png"
                            alt="Xalora"
                            width={40}
                            height={40}
                            className="h-10 w-auto object-contain"
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center h-full gap-8">
                        <Link to="/" className={navLinkClass("/")}>Home</Link>

                        {!isOrgTeam && !isCompanyCandidate && (
                            <>
                                <NavDropdown label="Practice" items={practiceItems} isActive={isDropdownActive(practiceItems)} />
                                <NavDropdown label="AI Tools" items={aiToolsItems} isActive={isDropdownActive(aiToolsItems)} />
                                <NavDropdown label="Learn" items={learnItems} isActive={isDropdownActive(learnItems)} />
                            </>
                        )}

                        {isCompanyCandidate && (
                            <>
                                <Link to="/ai-interview/setup" className={navLinkClass("/ai-interview")}>AI Interview</Link>
                                <Link to="/my-interviews" className={navLinkClass("/my-interviews")}>My Interviews</Link>
                            </>
                        )}

                        {isAuthenticated && (
                            <Link to={getDashboardRoute()} className={navLinkClass("/dashboard")}>
                                Dashboard
                            </Link>
                        )}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center gap-4">
                        {isAuthenticated ? (
                            <div ref={profileRef} className="relative mt-2">
                                <button
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className="flex items-center gap-2.5 pl-2.5 pr-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all duration-200"
                                >
                                    {user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user?.name || "User"}
                                            className="w-8 h-8 rounded-full ring-2 ring-emerald-500/30"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full ring-2 ring-emerald-500/30 bg-emerald-600/30 text-emerald-400 flex items-center justify-center text-sm font-semibold">
                                            {avatarInitial}
                                        </div>
                                    )}
                                    <div className="text-left hidden xl:block">
                                        <div className="text-sm font-medium text-white max-w-[120px] truncate">
                                            {user?.name || user?.username}
                                        </div>
                                        <div className="text-xs text-emerald-400">
                                            {user?.role === "setter" ? "Problem Setter" : "User"}
                                        </div>
                                    </div>
                                    <ChevronDown className={`text-gray-400 transition-transform duration-200 ${isProfileMenuOpen ? "rotate-180" : ""}`} />
                                </button>

                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-3 w-56 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-emerald-500/20 shadow-2xl shadow-black/40 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        {/* User info header */}
                                        <div className="px-4 py-3 border-b border-emerald-500/20">
                                            <div className="text-sm font-medium text-white truncate">{user?.name || user?.username}</div>
                                            <div className="text-xs text-gray-400 truncate">{user?.email}</div>
                                            {user && typeof user.jbpCoins === "number" && (
                                        <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md w-fit">
                                                    <span>🪙</span>
                                                    <span className="font-medium">{user.jbpCoins} JBP Coins</span>
                                                </div>
                                            )}
                                        </div>

                                        {availableWorkspaces.length > 1 && (
                                            <div className="px-4 py-3 border-t border-emerald-500/20">
                                                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-400/80">
                                                    Workspaces
                                                </div>
                                                <div className="space-y-1.5">
                                                    {availableWorkspaces.map((workspace) => {
                                                        const isActive = workspace.workspaceId === activeWorkspaceId;
                                                        return (
                                                            <button
                                                                key={workspace.workspaceId}
                                                                onClick={() => handleWorkspaceChange(workspace.workspaceId)}
                                                                disabled={isSwitchingWorkspace}
                                                                className={`w-full rounded-xl border px-3 py-2.5 text-left transition-all duration-200 disabled:opacity-60 ${
                                                                    isActive
                                                                        ? "border-emerald-400/60 bg-emerald-500/15"
                                                                        : "border-white/10 bg-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/10"
                                                                }`}
                                                            >
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <div className="min-w-0">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="truncate text-sm font-medium text-white">
                                                                                {workspace.name}
                                                                            </div>
                                                                            {isActive && (
                                                                                <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                                                                                    Current
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="mt-1 text-xs text-gray-400">
                                                                            {getWorkspaceTypeLabel(workspace)}
                                                                            {" • "}
                                                                            {getWorkspaceRoleLabel(workspace)}
                                                                            {workspace.requiresPassword ? " • Protected" : ""}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-emerald-500/10 transition-colors duration-150"
                                            onClick={() => setIsProfileMenuOpen(false)}
                                        >
                                            <span>👤</span> Profile
                                        </Link>
                                        <Link
                                            to={getDashboardRoute()}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-emerald-500/10 transition-colors duration-150"
                                            onClick={() => setIsProfileMenuOpen(false)}
                                        >
                                            <span>📊</span> Dashboard
                                        </Link>
                                        {!isCompanyCandidate && (
                                        <Link
                                            to="/pricing"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-emerald-500/10 transition-colors duration-150"
                                            onClick={() => setIsProfileMenuOpen(false)}
                                        >
                                            <span>💎</span> Subscription
                                        </Link>
                                        )}

                                        <div className="border-t border-emerald-500/20 mt-1.5 pt-1.5">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-150"
                                            >
                                                <span>🚪</span> Sign out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/signup"
                                    className="text-sm font-medium text-white px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 transition-all duration-200 shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)]"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                        className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div
                        className="lg:hidden fixed inset-0 z-[90] bg-black/60 backdrop-blur-[2px]"
                        onClick={closeMobileMenu}
                    >
                        <div
                            className="h-[100dvh] w-[86vw] max-w-sm overflow-y-auto border-r border-emerald-500/25 bg-gradient-to-b from-gray-950 via-slate-950 to-black shadow-[0_0_40px_rgba(0,0,0,0.65)] animate-in slide-in-from-left duration-200"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className="min-h-full">
                                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-emerald-500/20 bg-gray-950/95 px-5 py-4 backdrop-blur-xl">
                                    <Link to="/" className="flex items-center shrink-0" onClick={closeMobileMenu}>
                                        <img
                                            src="/logo_xalora.png"
                                            alt="Xalora"
                                            width={40}
                                            height={40}
                                            className="h-10 w-auto object-contain"
                                        />
                                    </Link>
                                    <button
                                        onClick={closeMobileMenu}
                                        aria-label="Close menu"
                                        className="rounded-lg p-2 text-gray-400 hover:text-white transition-colors duration-200"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="px-4 pb-6 pt-4">
                        <div className="space-y-1">
                            <Link to="/" className="block px-4 py-3 text-sm font-medium text-gray-300 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg" onClick={closeMobileMenu}>
                                Home
                            </Link>

                            {!isOrgTeam && !isCompanyCandidate && (
                                <>
                                    {/* Practice Section */}
                                    <div className="pt-4 pb-2 px-4">
                                        <div className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Practice</div>
                                    </div>
                                    {practiceItems.map((item) => (
                                        <Link key={item.to} to={item.to} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg" onClick={closeMobileMenu}>
                                            <span className="text-xl">{item.icon}</span> {item.label}
                                        </Link>
                                    ))}

                                    {/* AI Tools Section */}
                                    <div className="pt-4 pb-2 px-4">
                                        <div className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">AI Tools</div>
                                    </div>
                                    {aiToolsItems.map((item, index) => {
                                        if (item.action) {
                                            return (
                                                <button key={`mob-action-${index}`} onClick={() => { item.action(); closeMobileMenu(); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg">
                                                    <span className="text-xl">{item.icon}</span> <span className="text-left w-full">{item.label}</span>
                                                </button>
                                            );
                                        }
                                        return (
                                            <Link key={item.to} to={item.to} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg" onClick={closeMobileMenu}>
                                                <span className="text-xl">{item.icon}</span> {item.label}
                                            </Link>
                                        );
                                    })}

                                    {/* Learn Section */}
                                    <div className="pt-4 pb-2 px-4">
                                        <div className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Learn</div>
                                    </div>
                                    {learnItems.map((item) => (
                                        <Link key={item.to} to={item.to} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg" onClick={closeMobileMenu}>
                                            <span className="text-xl">{item.icon}</span> {item.label}
                                        </Link>
                                    ))}
                                </>
                            )}

                            {isCompanyCandidate && (
                                <>
                                    <div className="pt-4 pb-2 px-4">
                                        <div className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Interview</div>
                                    </div>
                                    <Link to="/ai-interview/setup" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg" onClick={closeMobileMenu}>
                                        <span className="text-xl">🎥</span> AI Interview
                                    </Link>
                                    <Link to="/my-interviews" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg" onClick={closeMobileMenu}>
                                        <span className="text-xl">📋</span> My Interviews
                                    </Link>
                                </>
                            )}

                            {isAuthenticated && (
                                <>
                                    <div className="pt-4 pb-2 px-4">
                                        <div className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Personal</div>
                                    </div>
                                    <Link to={getDashboardRoute()} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg" onClick={closeMobileMenu}>
                                        <span className="text-xl">📊</span> Dashboard
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile User Section */}
                        <div className="border-t border-emerald-500/20 mt-4 pt-4">
                            {isAuthenticated ? (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg bg-emerald-500/5 mx-2 border border-emerald-500/10">
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt={user?.name || "User"} className="w-10 h-10 rounded-full ring-2 ring-emerald-500/50" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full ring-2 ring-emerald-500/50 bg-emerald-600/30 text-emerald-400 flex items-center justify-center text-lg font-semibold">
                                                {avatarInitial}
                                            </div>
                                        )}
                                        <div>
                                            <div className="text-sm font-medium text-white">{user?.name || user?.username}</div>
                                            <div className="text-xs text-gray-400">{user?.email}</div>
                                        </div>
                                        {user && typeof user.jbpCoins === "number" && (
                                            <div className="ml-auto flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg">
                                                <span>🪙</span> {user.jbpCoins}
                                            </div>
                                        )}
                                    </div>
                                    {availableWorkspaces.length > 1 && (
                                        <div className="px-4 pb-2">
                                            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-400/80">
                                                Workspaces
                                            </div>
                                            <div className="space-y-2">
                                                {availableWorkspaces.map((workspace) => {
                                                    const isActive = workspace.workspaceId === activeWorkspaceId;
                                                    return (
                                                        <button
                                                            key={workspace.workspaceId}
                                                            onClick={() => handleWorkspaceChange(workspace.workspaceId)}
                                                            disabled={isSwitchingWorkspace}
                                                            className={`w-full rounded-xl border px-4 py-3 text-left transition-all duration-200 disabled:opacity-60 ${
                                                                isActive
                                                                    ? "border-emerald-400/60 bg-emerald-500/15"
                                                                    : "border-white/10 bg-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/10"
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between gap-3">
                                                                <div className="min-w-0">
                                                                    <div className="truncate text-sm font-medium text-white">
                                                                        {workspace.name}
                                                                    </div>
                                                                    <div className="mt-1 text-xs text-gray-400">
                                                                        {getWorkspaceTypeLabel(workspace)} • {getWorkspaceRoleLabel(workspace)}
                                                                        {workspace.requiresPassword ? " • Protected" : ""}
                                                                    </div>
                                                                </div>
                                                                {isActive && (
                                                                    <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                                                                        Current
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg" onClick={closeMobileMenu}>
                                        <span className="text-xl">👤</span> Profile
                                    </Link>
                                    {!isCompanyCandidate && (
                                    <Link to="/pricing" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg" onClick={closeMobileMenu}>
                                        <span className="text-xl">💎</span> Subscription
                                    </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 w-full mt-2 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-150"
                                    >
                                        <span className="text-xl">🚪</span> Sign out
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3 px-4 mt-2">
                                    <Link
                                        to="/login"
                                        className="text-center text-sm font-medium text-gray-300 hover:text-white px-4 py-3 rounded-xl border border-white/10 hover:bg-white/[0.06] transition-all duration-200"
                                        onClick={closeMobileMenu}
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="text-center text-sm font-medium text-white px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-all duration-200 shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                                        onClick={closeMobileMenu}
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            )}
                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <WorkspaceChooserModal
                isOpen={isWorkspaceChooserOpen && isAuthenticated && availableWorkspaces.length > 1}
                workspaces={availableWorkspaces}
                activeWorkspaceId={activeWorkspaceId}
                onSelect={handleWorkspaceChange}
                onClose={handleDismissWorkspaceChooser}
            />
        </nav>
    );
};

export default Navbar;
