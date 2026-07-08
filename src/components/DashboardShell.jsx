import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getActiveWorkspace,
  getDashboardRouteForUser,
  isCompanyCandidateWorkspace,
} from "../utils/workspace";

const PLAN_META = {
  spark: { label: "Spark Plan", pillClass: "" },
  pulse: { label: "Pulse Plan", pillClass: "pro" },
  nexus: { label: "Nexus Plan", pillClass: "pro" },
  infinity: { label: "Infinity Plan", pillClass: "pro" },
};

const SIDEBAR_NAV = {
  individual: [
    { section: "Main", items: [
      { icon: "🏠", label: "Dashboard", to: "/dashboard", active: true },
      { icon: "🎯", label: "Problems", to: "/problems", badge: "1K+" },
      { icon: "🤖", label: "AI Interviews", to: "/my-interviews" },
      { icon: "📝", label: "Quizzes", to: "/quiz" },
      { icon: "📄", label: "Resume Analyzer", to: "https://www.resume.xalora.one" },
      { icon: "💻", label: "Compiler", to: "/problems" },
      { icon: "💼", label: "Internships", to: "/internships" },
    ]},
    { section: "Learn", items: [
      { icon: "📚", label: "Topics & DS/Algo", to: "/algorithms" },
      { icon: "📊", label: "Analytics", to: "/quiz/analytics" },
      { icon: "🏆", label: "Leaderboard", to: "/problems" },
    ]},
    { section: "Account", items: [
      { icon: "⚙️", label: "Settings", to: "/profile" },
      { icon: "🏢", label: "Organization", to: "/org/dashboard" },
    ]},
  ],
  "college-student": [
    { section: "Main", items: [
      { icon: "🏠", label: "Dashboard", to: "/org/student/dashboard", active: true },
      { icon: "🎯", label: "DSA Practice", to: "/problems" },
      { icon: "🤖", label: "AI Interviews", to: "/my-interviews" },
      { icon: "📝", label: "Assessments", to: "/quiz" },
      { icon: "🏆", label: "Leaderboard", to: "/org/student/dashboard" },
      { icon: "💼", label: "Internships", to: "/internships" },
    ]},
    { section: "Learn", items: [
      { icon: "📚", label: "Topics & DS/Algo", to: "/algorithms" },
      { icon: "📊", label: "Analytics", to: "/quiz/analytics" },
    ]},
    { section: "Account", items: [
      { icon: "⚙️", label: "Settings", to: "/profile" },
      { icon: "🏢", label: "Organization", to: "/org/dashboard" },
    ]},
  ],
  "org-team": [
    { section: "Main", items: [
      { icon: "🏠", label: "Dashboard", to: "/org/dashboard", active: true },
      { icon: "👥", label: "Members", to: "/org/members" },
      { icon: "📊", label: "Analytics", to: "/org/members" },
      { icon: "📝", label: "Assessments", to: "/quiz" },
      { icon: "💼", label: "Internships", to: "/internships" },
    ]},
    { section: "Learn", items: [
      { icon: "📚", label: "Topics & DS/Algo", to: "/algorithms" },
    ]},
    { section: "Account", items: [
      { icon: "⚙️", label: "Settings", to: "/profile" },
      { icon: "🏢", label: "Organization", to: "/org/dashboard" },
    ]},
  ],
};

const QUICK_ACTIONS = {
  individual: [
    { icon: "🎯", label: "Practice DSA", sub: "Random problems from weak topics", to: "/problems", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    { icon: "🤖", label: "Mock Interview", sub: "Technical + Behavioral round", to: "/my-interviews", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { icon: "📝", label: "Take a Quiz", sub: "Topic-wise assessment", to: "/quiz", color: "bg-amber-50 text-amber-600 border-amber-100" },
    { icon: "📄", label: "Resume Analyzer", sub: "Upload PDF, get AI feedback", to: "https://www.resume.xalora.one", color: "bg-blue-50 text-blue-600 border-blue-100" },
    { icon: "💼", label: "Browse Internships", sub: "Explore opportunities", to: "/internships", color: "bg-violet-50 text-violet-600 border-violet-100" },
  ],
  "college-student": [
    { icon: "🏆", label: "View Leaderboard", sub: "See your college rank", to: "/org/student/dashboard", color: "bg-amber-50 text-amber-600 border-amber-100" },
    { icon: "📝", label: "Take Assessment", sub: "College coding test", to: "/quiz", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    { icon: "🤖", label: "Mock Interview", sub: "Practice with AI", to: "/my-interviews", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { icon: "💼", label: "Browse Internships", sub: "Apply for opportunities", to: "/internships", color: "bg-violet-50 text-violet-600 border-violet-100" },
  ],
  "org-team": [
    { icon: "👥", label: "Manage Members", sub: "Add, remove, or update members", to: "/org/members", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    { icon: "📊", label: "View Analytics", sub: "Member performance insights", to: "/org/members", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { icon: "📝", label: "Create Assessment", sub: "Quiz or test for members", to: "/quiz", color: "bg-amber-50 text-amber-600 border-amber-100" },
    { icon: "💼", label: "Manage Internships", sub: "Programs and enrollments", to: "/internships", color: "bg-violet-50 text-violet-600 border-violet-100" },
  ],
};

export default function DashboardShell({ role = "individual", children, title, subtitle }) {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const activeWorkspace = getActiveWorkspace(user);
  const isCompanyCandidate = isCompanyCandidateWorkspace(activeWorkspace);
  const [searchFocused, setSearchFocused] = useState(false);

  const planId = activeWorkspace?.subscription?.planId || user?.subscription?.planId || "spark";
  const plan = PLAN_META[planId] || PLAN_META.spark;
  const navItems = SIDEBAR_NAV[role] || SIDEBAR_NAV.individual;
  const quickActions = QUICK_ACTIONS[role] || QUICK_ACTIONS.individual;

  const handleSearch = (e) => {
    const q = e.target.value;
    if (q.trim()) {
      navigate(`/searching?q=${encodeURIComponent(q.trim())}`);
    }
  };

  const userInitials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <div className="flex min-h-screen xalora-grid-bg">
      {/* ===================== SIDEBAR ===================== */}
      <aside className="fixed inset-y-0 left-0 w-60 bg-white border-r border-slate-200 z-40 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-sm">
            X
          </div>
          <span className="text-lg font-black tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            XALORA
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {navItems.map((group) => (
            <div key={group.section}>
              <p className="px-3 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                {group.section}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = item.active || location.pathname === item.to;
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      target={item.to?.startsWith("http") ? "_blank" : undefined}
                      rel={item.to?.startsWith("http") ? "noopener noreferrer" : undefined}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors relative ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-r" />
                      )}
                      <span className="text-base w-5 text-center">{item.icon}</span>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] font-extrabold bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Upgrade Card */}
        <div className="px-4 pb-4">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-4 text-center relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/10" />
            <span className="text-2xl block mb-1">👑</span>
            <p className="text-xs font-extrabold text-white mb-1">Upgrade to Pulse / Nexus</p>
            <p className="text-[11px] text-white/75 mb-3 leading-relaxed">
              Unlimited AI interviews, advanced analytics, and more.
            </p>
            <button className="w-full py-1.5 bg-white text-indigo-700 text-xs font-extrabold rounded-lg hover:bg-indigo-50 transition-colors">
              View Plans
            </button>
          </div>
        </div>

        {/* Sidebar User */}
        <div className="px-4 py-3 border-t border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-xs flex-shrink-0">
            {userInitials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{user?.name || "User"}</p>
            <p className="text-xs text-slate-500 truncate">
              {activeWorkspace?.organization?.name || activeWorkspace?.name || "Personal workspace"}
            </p>
          </div>
        </div>
      </aside>

      {/* ===================== MAIN AREA ===================== */}
      <div className="ml-60 flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                searchFocused
                  ? "border-indigo-300 bg-white shadow-sm"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <span className="text-slate-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search problems, quizzes, interviews..."
                className="bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400 w-64"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
              🔔
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
            </button>

            {/* User */}
            <Link to="/profile" className="flex items-center gap-2.5 hover:bg-slate-50 rounded-lg px-2 py-1 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-xs">
                {userInitials}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-tight">{user?.name || "User"}</p>
                <p className="text-xs text-slate-500 leading-tight">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    plan.pillClass === "pro"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-indigo-50 text-indigo-700"
                  }`}>
                    {plan.label}
                  </span>
                </p>
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">
          {title && (
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}

export { PLAN_META, SIDEBAR_NAV, QUICK_ACTIONS };
