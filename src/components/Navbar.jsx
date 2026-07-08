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
                className={`nav-link-ul flex items-center gap-1.5 font-medium transition-colors duration-200 ${
                    isActive ? "text-indigo-600 nav-is-active" : "text-gray-500 hover:text-gray-900"
                }`}
            >
                {label}
                <ChevronDown className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-60 bg-white rounded-xl border border-indigo-100 shadow-xl shadow-gray-200/60 py-2 z-50">
                    {items.map((item, index) => {
                        const itemClass = "flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-150";

                        if (item.action) {
                            return (
                                <button
                                    key={`dropdown-action-${index}`}
                                    onClick={() => { item.action(); setIsOpen(false); closeMobileMenu?.(); }}
                                    className={`${itemClass} w-full text-left`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <div>
                                        <div className="font-medium">{item.label}</div>
                                        {item.desc && <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>}
                                    </div>
                                </button>
                            );
                        }

                        if (item.external || item.href) {
                            return (
                                <a
                                    key={item.href || item.to}
                                    href={item.href || item.to}
                                    className={itemClass}
                                    onClick={() => { setIsOpen(false); closeMobileMenu?.(); }}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <div>
                                        <div className="font-medium">{item.label}</div>
                                        {item.desc && <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>}
                                    </div>
                                </a>
                            );
                        }

                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={itemClass}
                                onClick={() => { setIsOpen(false); closeMobileMenu?.(); }}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <div>
                                    <div className="font-medium">{item.label}</div>
                                    {item.desc && <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>}
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
    const [isScrolled, setIsScrolled] = useState(false);
    const profileRef = useRef(null);
    const workspaceChooserShownRef = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsProfileMenuOpen(false);
    }, [location.pathname]);

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
        return () => { document.body.style.overflow = previousOverflow; };
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
            if (pendingWorkspaceChoice) sessionStorage.removeItem(PENDING_WORKSPACE_CHOICE_KEY);
            return;
        }

        const shouldOpenChooser = pendingWorkspaceChoice && !workspaceChooserShownRef.current;
        if (shouldOpenChooser) {
            workspaceChooserShownRef.current = true;
            setIsWorkspaceChooserOpen(true);
            sessionStorage.removeItem(PENDING_WORKSPACE_CHOICE_KEY);
            return;
        }

        if (!pendingWorkspaceChoice && !isWorkspaceChooserOpen) {
            setIsWorkspaceChooserOpen(false);
        }
    }, [isAuthenticated, isWorkspaceChooserOpen, user?.workspaces?.length]);

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

    const getDashboardRoute = () => getWorkspaceDashboardRoute(user);
    const getDashboardRouteForUser = (currentUser) => getWorkspaceDashboardRoute(currentUser);

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

    const isActive = (path) => {
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };

    const isDropdownActive = (items) =>
        items.some((item) => item.to && location.pathname.startsWith(item.to));

    const navLinkClass = (path) =>
        `nav-link-ul flex items-center font-medium h-full transition-colors duration-200 ${
            isActive(path) ? "text-indigo-600 nav-is-active" : "text-gray-500 hover:text-gray-900"
        }`;

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
        <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${
            isScrolled 
                ? "bg-white/80 backdrop-blur-md shadow-sm" 
                : "xalora-grid-bg"
        }`}>
            {/* Max-width container — border-bottom here so the indigo line is contained, not edge-to-edge */}
            <div 
                className={`max-w-[1200px] mx-auto flex items-center justify-between border-b-2 transition-all duration-300 ${
                    isScrolled ? "border-indigo-600/30" : "border-indigo-600"
                }`}
                style={{ padding: isScrolled ? '0.6rem 2rem' : '1.2rem 2rem' }}
            >
                    {/* Logo */}
                    <Link to="/" className="flex items-center shrink-0" onClick={closeMobileMenu}>
                        <span className="font-extrabold text-[1.3rem]" style={{ color: '#4f46e5' }}>xalora</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-4">
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
                                    className="flex items-center gap-2.5 pl-2.5 pr-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-all duration-200"
                                >
                                    {user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user?.name || "User"}
                                            className="w-8 h-8 rounded-full ring-2 ring-indigo-200"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full ring-2 ring-indigo-200 bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-semibold">
                                            {avatarInitial}
                                        </div>
                                    )}
                                    <div className="text-left hidden xl:block">
                                        <div className="text-sm font-medium text-gray-900 max-w-[120px] truncate">
                                            {user?.name || user?.username}
                                        </div>
                                        <div className="text-xs text-indigo-500">
                                            {user?.role === "setter" ? "Problem Setter" : "User"}
                                        </div>
                                    </div>
                                    <ChevronDown className={`text-gray-400 transition-transform duration-200 ${isProfileMenuOpen ? "rotate-180" : ""}`} />
                                </button>

                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl border border-indigo-100 shadow-xl shadow-gray-200/60 py-1.5 z-50">
                                        {/* User info header */}
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <div className="text-sm font-semibold text-gray-900 truncate">{user?.name || user?.username}</div>
                                            <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                                            {user && typeof user.jbpCoins === "number" && (
                                                <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg w-fit">
                                                    <span>🪙</span>
                                                    <span className="font-medium">{user.jbpCoins} JBP Coins</span>
                                                </div>
                                            )}
                                        </div>

                                        {availableWorkspaces.length > 1 && (
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-indigo-500">
                                                    Workspaces
                                                </div>
                                                <div className="space-y-1.5">
                                                    {availableWorkspaces.map((workspace) => {
                                                        const active = workspace.workspaceId === activeWorkspaceId;
                                                        return (
                                                            <button
                                                                key={workspace.workspaceId}
                                                                onClick={() => handleWorkspaceChange(workspace.workspaceId)}
                                                                disabled={isSwitchingWorkspace}
                                                                className={`w-full rounded-xl border px-3 py-2.5 text-left transition-all duration-200 disabled:opacity-60 ${
                                                                    active
                                                                        ? "border-indigo-300 bg-indigo-50"
                                                                        : "border-gray-200 bg-gray-50 hover:border-indigo-200 hover:bg-indigo-50"
                                                                }`}
                                                            >
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <div className="min-w-0">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="truncate text-sm font-medium text-gray-800">
                                                                                {workspace.name}
                                                                            </div>
                                                                            {active && (
                                                                                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-600">
                                                                                    Current
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="mt-1 text-xs text-gray-500">
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
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-150"
                                            onClick={() => setIsProfileMenuOpen(false)}
                                        >
                                            <span>👤</span> Profile
                                        </Link>
                                        <Link
                                            to={getDashboardRoute()}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-150"
                                            onClick={() => setIsProfileMenuOpen(false)}
                                        >
                                            <span>📊</span> Dashboard
                                        </Link>
                                        {!isCompanyCandidate && (
                                            <Link
                                                to="/pricing"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-150"
                                                onClick={() => setIsProfileMenuOpen(false)}
                                            >
                                                <span>💎</span> Subscription
                                            </Link>
                                        )}

                                        <div className="border-t border-gray-100 mt-1.5 pt-1.5">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-150"
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
                                    className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/signup"
                                    className="text-sm font-bold text-white px-5 py-2.5 rounded-full transition-all duration-200 shadow-lg hover:-translate-y-0.5"
                                    style={{ background: '#7c3aed' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#4f46e5'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#7c3aed'}
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                        className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
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
                        className="lg:hidden fixed inset-0 z-[90] bg-gray-800/30 backdrop-blur-[2px]"
                        onClick={closeMobileMenu}
                    >
                        <div
                            className="h-[100dvh] w-[86vw] max-w-sm overflow-y-auto border-r border-indigo-100 bg-white shadow-xl shadow-gray-300/40"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="min-h-full">
                                {/* Mobile header */}
                                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-indigo-100 bg-white/95 px-5 py-4">
                                    <Link to="/" className="flex items-center" onClick={closeMobileMenu}>
                                        <span className="font-black text-indigo-600 text-xl tracking-tight">xalora</span>
                                    </Link>
                                    <button
                                        onClick={closeMobileMenu}
                                        aria-label="Close menu"
                                        className="rounded-lg p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="px-4 pb-6 pt-4">
                                    <div className="space-y-1">
                                        <Link to="/" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" onClick={closeMobileMenu}>
                                            Home
                                        </Link>

                                        {!isOrgTeam && !isCompanyCandidate && (
                                            <>
                                                <div className="pt-4 pb-2 px-4">
                                                    <div className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">Practice</div>
                                                </div>
                                                {practiceItems.map((item) => (
                                                    <Link key={item.to} to={item.to} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" onClick={closeMobileMenu}>
                                                        <span className="text-xl">{item.icon}</span> {item.label}
                                                    </Link>
                                                ))}

                                                <div className="pt-4 pb-2 px-4">
                                                    <div className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">AI Tools</div>
                                                </div>
                                                {aiToolsItems.map((item, index) => {
                                                    if (item.action) {
                                                        return (
                                                            <button key={`mob-action-${index}`} onClick={() => { item.action(); closeMobileMenu(); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                                <span className="text-xl">{item.icon}</span>
                                                                <span className="text-left w-full">{item.label}</span>
                                                            </button>
                                                        );
                                                    }
                                                    return (
                                                        <Link key={item.to || item.href} to={item.to} href={item.href} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" onClick={closeMobileMenu}>
                                                            <span className="text-xl">{item.icon}</span> {item.label}
                                                        </Link>
                                                    );
                                                })}

                                                <div className="pt-4 pb-2 px-4">
                                                    <div className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">Learn</div>
                                                </div>
                                                {learnItems.map((item) => (
                                                    <Link key={item.to} to={item.to} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" onClick={closeMobileMenu}>
                                                        <span className="text-xl">{item.icon}</span> {item.label}
                                                    </Link>
                                                ))}
                                            </>
                                        )}

                                        {isCompanyCandidate && (
                                            <>
                                                <div className="pt-4 pb-2 px-4">
                                                    <div className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">Interview</div>
                                                </div>
                                                <Link to="/ai-interview/setup" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" onClick={closeMobileMenu}>
                                                    <span className="text-xl">🎥</span> AI Interview
                                                </Link>
                                                <Link to="/my-interviews" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" onClick={closeMobileMenu}>
                                                    <span className="text-xl">📋</span> My Interviews
                                                </Link>
                                            </>
                                        )}

                                        {isAuthenticated && (
                                            <>
                                                <div className="pt-4 pb-2 px-4">
                                                    <div className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">Personal</div>
                                                </div>
                                                <Link to={getDashboardRoute()} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" onClick={closeMobileMenu}>
                                                    <span className="text-xl">📊</span> Dashboard
                                                </Link>
                                            </>
                                        )}
                                    </div>

                                    {/* Mobile User Section */}
                                    <div className="border-t border-gray-100 mt-4 pt-4">
                                        {isAuthenticated ? (
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-indigo-50 border border-indigo-100 mx-2">
                                                    {user?.avatar ? (
                                                        <img src={user.avatar} alt={user?.name || "User"} className="w-10 h-10 rounded-full ring-2 ring-indigo-200" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full ring-2 ring-indigo-200 bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg font-semibold">
                                                            {avatarInitial}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="text-sm font-semibold text-gray-900">{user?.name || user?.username}</div>
                                                        <div className="text-xs text-gray-500">{user?.email}</div>
                                                    </div>
                                                    {user && typeof user.jbpCoins === "number" && (
                                                        <div className="ml-auto flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1.5 rounded-lg">
                                                            <span>🪙</span> {user.jbpCoins}
                                                        </div>
                                                    )}
                                                </div>

                                                {availableWorkspaces.length > 1 && (
                                                    <div className="px-4 pb-2">
                                                        <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-indigo-500">
                                                            Workspaces
                                                        </div>
                                                        <div className="space-y-2">
                                                            {availableWorkspaces.map((workspace) => {
                                                                const active = workspace.workspaceId === activeWorkspaceId;
                                                                return (
                                                                    <button
                                                                        key={workspace.workspaceId}
                                                                        onClick={() => handleWorkspaceChange(workspace.workspaceId)}
                                                                        disabled={isSwitchingWorkspace}
                                                                        className={`w-full rounded-xl border px-4 py-3 text-left transition-all duration-200 disabled:opacity-60 ${
                                                                            active
                                                                                ? "border-indigo-300 bg-indigo-50"
                                                                                : "border-gray-200 bg-gray-50 hover:border-indigo-200 hover:bg-indigo-50"
                                                                        }`}
                                                                    >
                                                                        <div className="flex items-center justify-between gap-3">
                                                                            <div className="min-w-0">
                                                                                <div className="truncate text-sm font-medium text-gray-800">{workspace.name}</div>
                                                                                <div className="mt-1 text-xs text-gray-500">
                                                                                    {getWorkspaceTypeLabel(workspace)} • {getWorkspaceRoleLabel(workspace)}
                                                                                    {workspace.requiresPassword ? " • Protected" : ""}
                                                                                </div>
                                                                            </div>
                                                                            {active && (
                                                                                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-600">
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

                                                <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" onClick={closeMobileMenu}>
                                                    <span className="text-xl">👤</span> Profile
                                                </Link>
                                                {!isCompanyCandidate && (
                                                    <Link to="/pricing" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" onClick={closeMobileMenu}>
                                                        <span className="text-xl">💎</span> Subscription
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 w-full mt-2 px-4 py-3 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <span className="text-xl">🚪</span> Sign out
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-3 px-4 mt-2">
                                                <Link
                                                    to="/login"
                                                    className="text-center text-sm font-medium text-gray-700 hover:text-indigo-600 px-4 py-3 rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-200"
                                                    onClick={closeMobileMenu}
                                                >
                                                    Log in
                                                </Link>
                                                <Link
                                                    to="/signup"
                                                    className="text-center text-sm font-bold text-white px-4 py-3 rounded-xl transition-all duration-200 shadow-lg"
                                                    style={{ background: '#7c3aed' }}
                                                    onClick={closeMobileMenu}
                                                >
                                                    Get Started
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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
