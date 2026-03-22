import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bot,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  ClipboardCheck,
  Code2,
  Flame,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Layout } from "../components";
import problemService from "../services/problemService";
import quizService from "../services/quizService";
import subscriptionService from "../services/subscriptionService";
import interviewService from "../services/interviewService";
import axios from "../utils/axios";
import ApiRoutes from "../routes/routes";

const PLAN_META = {
  spark: { label: "Xalora Spark", badgeClass: "bg-slate-600/80 text-slate-100" },
  pulse: { label: "Xalora Pulse", badgeClass: "bg-blue-600/80 text-blue-100" },
  nexus: { label: "Xalora Nexus", badgeClass: "bg-indigo-600/80 text-indigo-100" },
  infinity: { label: "Xalora Infinity", badgeClass: "bg-amber-500/80 text-amber-100" },
};

const QUICK_ACTIONS = [
  {
    title: "Solve DSA",
    subtitle: "Continue your coding streak",
    to: "/problems",
    icon: Code2,
    color: "cyan",
    ariaLabel: "Navigate to DSA problems section",
  },
  {
    title: "Take Quiz",
    subtitle: "Practice timed assessments",
    to: "/quiz",
    icon: ClipboardCheck,
    color: "violet",
    ariaLabel: "Navigate to quiz section",
  },
  {
    title: "Internships",
    subtitle: "Track enrolled opportunities",
    to: "/internships/enrolled",
    icon: BriefcaseBusiness,
    color: "emerald",
    ariaLabel: "Navigate to enrolled internships",
  },
  {
    title: "AI Interview",
    subtitle: "Mock rounds and reports",
    to: "/my-interviews",
    icon: Bot,
    color: "fuchsia",
    ariaLabel: "Navigate to AI interview section",
  },
];

// ────────────────────────────── COMPONENTS ──────────────────────────────

/**
 * Metric Card - Displays a single statistic with icon
 * Accessible with proper semantic HTML and ARIA labels
 */
// eslint-disable-next-line no-unused-vars
const MetricCard = ({ title, value, hint, icon: Icon, iconColor = "cyan", to }) => {
  const colorMap = {
    cyan: "bg-cyan-500/20 text-cyan-400",
    violet: "bg-violet-500/20 text-violet-400",
    emerald: "bg-emerald-500/20 text-emerald-400",
    fuchsia: "bg-fuchsia-500/20 text-fuchsia-400",
  };

  const inner = (
    <div className="flex items-start justify-between h-full">
      <div className="flex-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </h3>
        <div className="mt-3">
          <p
            className="text-3xl sm:text-4xl font-bold text-white tabular-nums"
            role="status"
            aria-live="polite"
          >
            {value}
          </p>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
            {hint}
          </p>
        </div>
      </div>
      <div
        className={`rounded-xl p-3 ${colorMap[iconColor]} flex-shrink-0`}
        aria-hidden="true"
      >
        <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
      </div>
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="group block rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-5 sm:p-6 backdrop-blur-md transition-all hover:border-white/20 hover:from-white/8 hover:scale-[1.02] cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
        aria-label={`${title}: ${value} — click to view details`}
      >
        {inner}
      </Link>
    );
  }

  return (
    <article
      className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-5 sm:p-6 backdrop-blur-md transition-all hover:border-white/20 hover:from-white/8 focus-within:ring-2 focus-within:ring-cyan-400/50"
      aria-label={`${title}: ${value}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </h3>
          <div className="mt-3">
            <p
              className="text-3xl sm:text-4xl font-bold text-white tabular-nums"
              role="status"
              aria-live="polite"
            >
              {value}
            </p>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
              {hint}
            </p>
          </div>
        </div>
        <div
          className={`rounded-xl p-3 ${colorMap[iconColor]} flex-shrink-0`}
          aria-hidden="true"
        >
          <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
        </div>
      </div>
    </article>
  );
};

/**
 * Loading Skeleton - Shows placeholder while data loads
 * Accessible with aria-busy attribute
 */
const MetricSkeleton = () => (
  <div
    className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 animate-pulse"
    aria-busy="true"
    aria-label="Loading metric"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="h-3 w-24 rounded bg-slate-700/50" />
        <div className="mt-3 h-10 w-32 rounded bg-slate-700/50" />
        <div className="mt-2 h-3 w-48 rounded bg-slate-700/50" />
      </div>
      <div className="h-12 w-12 rounded-xl bg-slate-700/50" />
    </div>
  </div>
);

/**
 * Activity Bar Chart - Displays weekly activity
 */
const ActivityChart = ({ data, isLoading }) => {
  const maxValue = useMemo(
    () => Math.max(...data.map((entry) => entry.value), 1),
    [data]
  );

  if (isLoading) {
    return (
      <div
        className="rounded-2xl border border-white/10 bg-white/5 p-6 animate-pulse"
        aria-busy="true"
      >
        <div className="h-4 w-32 rounded bg-slate-700/50" />
        <div className="mt-6 grid grid-cols-7 gap-2">
          {Array(7)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2"
              >
                <div className="h-24 w-full rounded bg-slate-700/50" />
                <div className="h-3 w-8 rounded bg-slate-700/50" />
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <section
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-md"
      aria-labelledby="activity-heading"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 id="activity-heading" className="text-lg sm:text-xl font-semibold text-white">
            Weekly Activity
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Daily achievements from problems, quizzes, and interviews
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-200" aria-live="polite">
          <Activity className="h-4 w-4" aria-hidden="true" />
          <span className="font-medium">Live</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-1.5 sm:gap-2">
        {data.map((entry) => {
          const heightPercent = Math.max(12, (entry.value / maxValue) * 100);
          return (
            <div key={entry.key} className="flex flex-col items-center gap-1.5">
              <div
                className="relative w-full rounded-sm bg-slate-800/50 overflow-hidden"
                style={{ height: "120px" }}
                role="img"
                aria-label={`${entry.label}: ${entry.value} activities`}
              >
                <div
                  className="w-full rounded-sm bg-gradient-to-t from-cyan-500 via-cyan-400 to-emerald-500 transition-all duration-300"
                  style={{ height: `${heightPercent}%` }}
                  aria-hidden="true"
                />
              </div>
              <span className="text-xs font-medium text-slate-400">
                {entry.label}
              </span>
              <span className="text-xs font-semibold text-slate-200">
                {entry.value}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

/**
 * Activity Feed - Shows recent user achievements
 */
const ActivityFeed = ({ activities, isLoading }) => {
  if (isLoading) {
    return (
      <div
        className="rounded-2xl border border-white/10 bg-white/5 p-6 animate-pulse"
        aria-busy="true"
      >
        <div className="h-5 w-32 rounded bg-slate-700/50" />
        <div className="mt-4 space-y-3">
          {Array(4)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded bg-slate-700/50">
                <div className="flex-1">
                  <div className="h-3 w-32 rounded bg-slate-600/50" />
                  <div className="mt-1 h-2 w-24 rounded bg-slate-600/50" />
                </div>
                <div className="h-2 w-20 rounded bg-slate-600/50" />
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <section
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-md"
      aria-labelledby="activity-feed-heading"
    >
      <div className="flex items-center gap-3 mb-5">
        <h2 id="activity-feed-heading" className="text-lg sm:text-xl font-semibold text-white">
          Recent Activity
        </h2>
        <CalendarClock className="h-5 w-5 text-slate-400" aria-hidden="true" />
      </div>

      {activities.length === 0 ? (
        <div
          className="rounded-lg border-2 border-dashed border-white/20 bg-slate-900/40 p-8 text-center"
          role="status"
          aria-live="polite"
        >
          <AlertCircle className="mx-auto h-8 w-8 text-slate-500 mb-3" aria-hidden="true" />
          <p className="text-sm text-slate-400">
            No activity yet. Start with DSA problems or a quiz to populate your feed.
          </p>
        </div>
      ) : (
        <ul className="space-y-2" role="list">
          {activities.map((item, index) => (
            <li
              key={`${item.type}-${item.title}-${index}`}
              className="group flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-slate-900/50 px-4 py-3 transition hover:border-white/20 hover:bg-slate-900/70"
              role="listitem"
            >
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">{item.meta}</p>
              </div>
              <time className="whitespace-nowrap text-xs text-slate-400 flex-shrink-0">
                {item.at}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

/**
 * Stat Card - Small stat display card
 */
// eslint-disable-next-line no-unused-vars
const StatCard = ({ title, value, icon: Icon, color = "orange" }) => {
  const colorMap = {
    orange: "border-orange-400/25 bg-orange-500/10 text-orange-200",
    indigo: "border-indigo-400/25 bg-indigo-500/10 text-indigo-200",
  };

  return (
    <article
      className={`rounded-lg border p-4 sm:p-5 space-y-3 ${colorMap[color]}`}
      aria-label={`${title}: ${value}`}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-xs leading-relaxed opacity-90">
        {title === "Current Streak"
          ? "Keep solving daily to build your consistency"
          : "Complete these to boost your solved count"}
      </p>
    </article>
  );
};

/**
 * Quick Action Card - Navigation card with icon
 */
// eslint-disable-next-line no-unused-vars
const QuickActionCard = ({ title, subtitle, to, icon: Icon, color }) => {
  const colorMap = {
    cyan: "from-cyan-500/20 to-blue-500/20 border-cyan-400/25 hover:border-cyan-400/50",
    violet: "from-violet-500/20 to-purple-500/20 border-violet-400/25 hover:border-violet-400/50",
    emerald: "from-emerald-500/20 to-teal-500/20 border-emerald-400/25 hover:border-emerald-400/50",
    fuchsia: "from-fuchsia-500/20 to-rose-500/20 border-fuchsia-400/25 hover:border-fuchsia-400/50",
  };

  return (
    <Link
      to={to}
      className={`flex items-center justify-between gap-3 rounded-lg border bg-gradient-to-r px-4 py-3.5 sm:py-4 transition-all hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 ${colorMap[color]}`}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-white flex-shrink-0" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-0.5 text-xs text-slate-200">{subtitle}</p>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-slate-100 flex-shrink-0" aria-hidden="true" />
    </Link>
  );
};

/**
 * Subscription Card - Shows current plan info
 */
const SubscriptionCard = ({ planInfo, planMeta, isLoading }) => {
  if (isLoading) {
    return (
      <div
        className="rounded-2xl border border-white/10 bg-white/5 p-6 animate-pulse"
        aria-busy="true"
      >
        <div className="h-5 w-24 rounded bg-slate-700/50" />
        <div className="mt-4 space-y-3">
          <div className="h-16 rounded bg-slate-700/50" />
          <div className="h-3 w-32 rounded bg-slate-700/50" />
        </div>
      </div>
    );
  }

  return (
    <section
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-md"
      aria-labelledby="subscription-heading"
    >
      <div className="flex items-center gap-2 mb-5">
        <Sparkles className="h-5 w-5 text-cyan-400" aria-hidden="true" />
        <h2 id="subscription-heading" className="text-lg font-semibold text-white">
          Your Plan
        </h2>
      </div>

      <div className="rounded-lg border border-white/10 bg-slate-900/50 p-4 mb-4">
        <div className="inline-block">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${planMeta.badgeClass}`}
          >
            {planMeta.label}
          </span>
        </div>
        <p className="mt-3 text-sm text-slate-300">
          {planInfo?.isActive
            ? "Your plan is active. All features are unlocked."
            : "No active plan. Upgrade to unlock premium features."}
        </p>
        {planInfo?.endDate && (
          <p className="mt-2 text-xs text-slate-400">
            Valid until {new Date(planInfo.endDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}
      </div>

      <Link
        to="/pricing"
        className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 rounded px-2 py-1"
      >
        Explore plans
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </section>
  );
};

/**
 * AI Usage Card - Shows API usage metrics
 */
const AIUsageCard = ({ aiUsage, isLoading }) => {
  if (isLoading) {
    return (
      <div
        className="rounded-2xl border border-white/10 bg-white/5 p-6 animate-pulse"
        aria-busy="true"
      >
        <div className="h-5 w-32 rounded bg-slate-700/50" />
        <div className="mt-4 space-y-4">
          {Array(2)
            .fill(null)
            .map((_, i) => (
              <div key={i}>
                <div className="h-3 w-24 rounded bg-slate-700/50" />
                <div className="mt-2 h-2 w-full rounded bg-slate-700/50" />
              </div>
            ))}
        </div>
      </div>
    );
  }

  const requestsUsed = aiUsage?.requestsUsed ?? 0;
  const requestsLimit = aiUsage?.requestsLimit ?? 0;
  const uploadsUsed = aiUsage?.fileUploadsUsed ?? 0;
  const uploadsLimit = aiUsage?.fileUploadsLimit ?? 0;

  const requestsPercent = requestsLimit ? Math.min(100, (requestsUsed / requestsLimit) * 100) : 0;
  const uploadsPercent = uploadsLimit ? Math.min(100, (uploadsUsed / uploadsLimit) * 100) : 0;

  return (
    <section
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-md"
      aria-labelledby="ai-usage-heading"
    >
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 className="h-5 w-5 text-emerald-400" aria-hidden="true" />
        <h2 id="ai-usage-heading" className="text-lg font-semibold text-white">
          AI Usage
        </h2>
      </div>

      <div className="space-y-5">
        {/* Requests Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-300">API Requests</span>
            <span className="text-xs text-slate-400" aria-live="polite">
              {requestsUsed} / {requestsLimit}
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${requestsPercent}%` }}
              role="progressbar"
              aria-valuenow={requestsPercent}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="API requests usage"
            />
          </div>
        </div>

        {/* Uploads Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-300">File Uploads</span>
            <span className="text-xs text-slate-400" aria-live="polite">
              {uploadsUsed} / {uploadsLimit}
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all duration-500"
              style={{ width: `${uploadsPercent}%` }}
              role="progressbar"
              aria-valuenow={uploadsPercent}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="File uploads usage"
            />
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs text-slate-400 flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
        Resets daily. Synced with your active subscription.
      </p>
    </section>
  );
};

/**
 * Organization Banner - Shows org membership info
 */
const OrganizationBanner = ({ user, onNavigateOrgDashboard }) => {
  if (!user?.organization?.orgId) return null;

  return (
    <aside
      className="rounded-lg border border-emerald-400/20 bg-gradient-to-r from-emerald-500/10 via-transparent to-teal-500/10 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      role="complementary"
      aria-label="Organization information"
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
          <Building2 className="w-5 h-5 text-emerald-400" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">
            {user?.organization?.orgName || "Organization Member"}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {user.organization.role?.replace("_", " ")}{" "}
            {user.organization.programLabel
              ? `• ${user.organization.programLabel}`
              : user.organization.department
              ? `• ${user.organization.department}`
              : ""}
          </p>
        </div>
      </div>
      <button
        onClick={onNavigateOrgDashboard}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-medium hover:bg-emerald-600/30 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
        aria-label="Navigate to organization dashboard"
      >
        Org Dashboard
        <ArrowRight className="w-3 h-3" aria-hidden="true" />
      </button>
    </aside>
  );
};

// Static formatters - defined outside component to avoid recreation on each render
const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

/**
 * Main Dashboard Component
 */
const Dashboard = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [metrics, setMetrics] = useState({
    totalProblems: 0,
    solvedProblems: 0,
    attemptedProblems: 0,
    quizzesTaken: 0,
    averageQuizScore: 0,
    internshipsEnrolled: 0,
    interviewsDone: 0,
  });
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [planInfo, setPlanInfo] = useState(null);
  const [aiUsage, setAiUsage] = useState(null);

  const getOrgDashboardRoute = () => {
    if (!user?.organization?.orgId) return "/dashboard";
    if (user?.organization?.role === "super_admin") return "/org/dashboard";
    if (user?.userType === "org_team") return "/org/teamdashboard";
    return user?.organization?.degreeTypeValue || user?.organization?.programValue
      ? "/org/student/dashboard"
      : "/dashboard";
  };

  const fetchDashboardData = useCallback(
    async ({ background = false } = {}) => {
      if (background) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError("");

      try {
        const withTimeout = (promise, ms = 6000) =>
          Promise.race([
            promise,
            new Promise((resolve) => setTimeout(() => resolve(null), ms)),
          ]);

        const toArray = (res) => {
          if (Array.isArray(res?.data?.data)) return res.data.data;
          if (Array.isArray(res?.data?.problems)) return res.data.problems;
          if (Array.isArray(res?.data?.interviews)) return res.data.interviews;
          if (Array.isArray(res?.interviews)) return res.interviews;
          if (Array.isArray(res?.data)) return res.data;
          if (Array.isArray(res)) return res;
          return [];
        };

        const buildLast7Days = () => {
          const days = [];
          const today = new Date();
          for (let i = 6; i >= 0; i -= 1) {
            const d = new Date(today);
            d.setHours(0, 0, 0, 0);
            d.setDate(today.getDate() - i);
            days.push({
              key: d.toDateString(),
              label: dayFormatter.format(d),
              value: 0,
            });
          }
          return days;
        };

        const bumpDay = (days, dateValue) => {
          if (!dateValue) return;
          const d = new Date(dateValue);
          if (Number.isNaN(d.getTime())) return;
          const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toDateString();
          const entry = days.find((e) => e.key === key);
          if (entry) entry.value += 1;
        };

        const solvedFromStorage = JSON.parse(localStorage.getItem("solvedProblems") || "[]");
        const solvedProblemIds = new Set(Array.isArray(solvedFromStorage) ? solvedFromStorage : []);

        const problemStatsRes = await withTimeout(problemService.getProblemStats().catch(() => null), 4000);
        const problemStats = problemStatsRes?.data || problemStatsRes;

        if (problemStats) {
          setMetrics((prev) => ({
            ...prev,
            totalProblems: Number(problemStats.totalProblems) || 0,
            solvedProblems: Number(problemStats.solvedProblems) || 0,
            attemptedProblems: Number(problemStats.attemptedProblems) || 0,
          }));

          const weeklyFromStats = buildLast7Days();
          (problemStats.weeklySolved || []).forEach((entry) => {
            if (!entry?.date) return;
            bumpDay(weeklyFromStats, entry.date);
          });
          setWeeklyActivity(weeklyFromStats);

          const statsRecent = (problemStats.recentSolved || []).map((item) => {
            const atValue = item?.solvedAt ? new Date(item.solvedAt).getTime() : 0;
            return {
              type: "problem",
              title: item?.title || "Solved a problem",
              at: item?.solvedAt ? dateFormatter.format(new Date(item.solvedAt)) : "Unknown",
              atValue,
              meta: item?.difficulty || "DSA",
            };
          });
          setRecentActivity(statsRecent.slice(0, 8));
        }

        if (!background) {
          setIsLoading(false);
        }

        const [
          problemsRes,
          quizRes,
          internshipRes,
          subscriptionRes,
          aiUsageRes,
          interviewsRes,
        ] = await Promise.allSettled([
          withTimeout(problemService.getAllProblems({ limit: 120, page: 1, sortBy: "updatedAt", sortOrder: "desc" }).catch(() => null), 7000),
          isAuthenticated
            ? withTimeout(quizService.getUserSubmissions().catch(() => null), 7000)
            : Promise.resolve(null),
          isAuthenticated
            ? withTimeout(axios.get(ApiRoutes.internships.getEnrolled).catch(() => null), 7000)
            : Promise.resolve(null),
          isAuthenticated
            ? withTimeout(subscriptionService.getCurrentSubscription().catch(() => null), 5000)
            : Promise.resolve(null),
          isAuthenticated
            ? withTimeout(subscriptionService.getAIUsageInfo().catch(() => null), 5000)
            : Promise.resolve(null),
          isAuthenticated
            ? withTimeout(
                interviewService.getMyInterviews().catch((err) => {
                  console.warn("[Dashboard] getMyInterviews failed:", err?.response?.status, err?.response?.data?.message || err?.message);
                  return null;
                }),
                7000
              )
            : Promise.resolve(null),
        ]);

        const getSettledValue = (result) => (result?.status === "fulfilled" ? result.value : null);

        const problems = toArray(getSettledValue(problemsRes));
        const quizPayload = getSettledValue(quizRes);
        const quizzes = Array.isArray(quizPayload?.data?.submissions)
          ? quizPayload.data.submissions
          : toArray(quizPayload);
        const internshipPayload = getSettledValue(internshipRes);
        const internships = Array.isArray(internshipPayload?.data?.enrollments)
          ? internshipPayload.data.enrollments
          : toArray(internshipPayload);
        const interviews = toArray(getSettledValue(interviewsRes));

        const solvedProblems = problems.filter(
          (p) => p?.userStatus === "Solved" || (p?._id && solvedProblemIds.has(p._id))
        ).length;

        const attemptedProblems = problems.filter(
          (p) => p?.userStatus === "Attempted" && !(p?._id && solvedProblemIds.has(p._id))
        ).length;

        const avgScore =
          quizzes.length > 0
            ? Math.round(quizzes.reduce((sum, q) => sum + (Number(q?.score) || 0), 0) / quizzes.length)
            : 0;

        setMetrics((prev) => ({
          ...prev,
          totalProblems:
            Number(problemStats?.totalProblems) || Number(prev.totalProblems) || problems.length,
          solvedProblems:
            Number(problemStats?.solvedProblems) || solvedProblems,
          attemptedProblems:
            Number(problemStats?.attemptedProblems) || attemptedProblems,
          quizzesTaken: quizzes.length,
          averageQuizScore: avgScore,
          internshipsEnrolled: internships.length,
          interviewsDone: interviews.length,
        }));

        const subscriptionPayload = getSettledValue(subscriptionRes);
        if (subscriptionPayload?.data) {
          setPlanInfo(subscriptionPayload.data);
        }

        const aiUsagePayload = getSettledValue(aiUsageRes);
        if (aiUsagePayload) {
          setAiUsage(aiUsagePayload);
        }

        const last7Days = buildLast7Days();

        (problemStats?.weeklySolved || []).forEach((entry) => {
          if (!entry?.date) return;
          bumpDay(last7Days, entry.date);
        });

        problems.forEach((p) => {
          if (p?.userStatus === "Solved" || (p?._id && solvedProblemIds.has(p._id))) {
            bumpDay(last7Days, p?.solvedAt || p?.updatedAt || p?.createdAt);
          }
        });

        quizzes.forEach((q) => bumpDay(last7Days, q?.submittedAt || q?.createdAt));
        interviews.forEach((i) => bumpDay(last7Days, i?.completedAt || i?.updatedAt || i?.createdAt));

        setWeeklyActivity(last7Days);

        const safeAt = (dateValue) => {
          if (!dateValue) return { at: "Unknown", atValue: 0 };
          const d = new Date(dateValue);
          if (Number.isNaN(d.getTime())) return { at: "Unknown", atValue: 0 };
          return { at: dateFormatter.format(d), atValue: d.getTime() };
        };

        const activities = [
          ...problems
            .filter((p) => p?.userStatus === "Solved" || (p?._id && solvedProblemIds.has(p._id)))
            .map((p) => {
              const { at, atValue } = safeAt(p?.solvedAt || p?.updatedAt || p?.createdAt);
              return {
                type: "problem",
                title: p?.title || "Solved a problem",
                at,
                atValue,
                meta: p?.difficulty || "DSA",
              };
            }),
          ...quizzes.map((q) => {
            const { at, atValue } = safeAt(q?.submittedAt || q?.createdAt);
            return {
              type: "quiz",
              title: q?.quizId?.title || q?.quiz?.title || q?.quizTitle || "Quiz submitted",
              at,
              atValue,
              meta:
                q?.score === undefined || q?.score === null ? "Score unavailable" : `Score ${q.score}%`,
            };
          }),
          ...interviews.map((i) => {
            const { at, atValue } = safeAt(i?.completedAt || i?.updatedAt || i?.createdAt);
            return {
              type: "interview",
              title: i?.candidateInfo?.position || "AI Interview session",
              at,
              atValue,
              meta: i?.status || "Interview",
            };
          }),
        ]
          .sort((a, b) => b.atValue - a.atValue)
          .slice(0, 8)
          .map(({ atValue, ...rest }) => rest);

        setRecentActivity(activities);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard data. Please try refreshing.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [isAuthenticated]
  );

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const completionRate = useMemo(() => {
    return metrics.totalProblems
      ? Math.round((metrics.solvedProblems / metrics.totalProblems) * 100)
      : 0;
  }, [metrics]);

  const planMeta = useMemo(
    () => PLAN_META[planInfo?.planId] || PLAN_META.spark,
    [planInfo?.planId]
  );

  return (
    <Layout>
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 sm:py-10 lg:py-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Header Section */}
          <header className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-cyan-400 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 mb-3">
                  Dashboard
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  {isAuthenticated ? `Welcome, ${user?.name?.split(" ")[0] || "there"}` : "Welcome to Xalora"}
                </h1>
                <p className="mt-2 text-slate-400 max-w-2xl">
                  {isAuthenticated
                    ? "Track your progress across DSA problems, quizzes, internships, and AI interviews."
                    : "Sign in to access your personalized learning dashboard and track your progress."}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => fetchDashboardData({ background: true })}
                  disabled={isRefreshing}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-sm font-medium text-white hover:bg-white/15 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition"
                  aria-label="Refresh dashboard data"
                >
                  {isRefreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  )}
                  Refresh
                </button>

                {!isAuthenticated ? (
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition"
                  >
                    Sign In
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                ) : (
                  <Link
                    to="/profile"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition"
                  >
                    Profile
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>
          </header>

          {/* Organization Info */}
          {isAuthenticated && (
            <OrganizationBanner
              user={user}
              onNavigateOrgDashboard={() => window.location.href = getOrgDashboardRoute()}
            />
          )}

          {/* Error Message */}
          {error && (
            <div
              className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200 flex items-center gap-3"
              role="alert"
            >
              <AlertCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <p>{error}</p>
            </div>
          )}

          {/* Metrics Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {Array(4)
                .fill(null)
                .map((_, i) => (
                  <MetricSkeleton key={i} />
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <MetricCard
                title="Problems Solved"
                value={metrics.solvedProblems}
                hint={`${completionRate}% of ${metrics.totalProblems} total`}
                icon={CheckCircle2}
                iconColor="cyan"
              />
              <MetricCard
                title="Quiz Attempts"
                value={metrics.quizzesTaken}
                hint={`Avg score: ${metrics.averageQuizScore}%`}
                icon={ClipboardCheck}
                iconColor="violet"
              />
              <MetricCard
                title="Internships"
                value={metrics.internshipsEnrolled}
                hint="Enrolled opportunities tracked"
                icon={BriefcaseBusiness}
                iconColor="emerald"
              />
              <MetricCard
                title="AI Interviews"
                value={metrics.interviewsDone}
                hint="Total mock sessions (all statuses)"
                icon={Bot}
                iconColor="fuchsia"
                to="/my-interviews"
              />
            </div>
          )}

          {/* Main Content Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Left Column */}
              <div className="xl:col-span-8 space-y-6">
                <ActivityChart data={weeklyActivity} isLoading={isLoading} />
                <ActivityFeed activities={recentActivity} isLoading={isLoading} />

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <StatCard
                    title="Current Streak"
                    value={`${user?.stats?.currentStreak || 0} days`}
                    icon={Flame}
                    color="orange"
                  />
                  <StatCard
                    title="In Progress"
                    value={metrics.attemptedProblems}
                    icon={TrendingUp}
                    color="indigo"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="xl:col-span-4 space-y-6">
                <SubscriptionCard
                  planInfo={planInfo}
                  planMeta={planMeta}
                  isLoading={isLoading}
                />

                <AIUsageCard aiUsage={aiUsage} isLoading={isLoading} />

                {/* Quick Actions */}
                <section
                  className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-md"
                  aria-labelledby="quick-actions-heading"
                >
                  <h2 id="quick-actions-heading" className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-slate-400" aria-hidden="true" />
                    Quick Actions
                  </h2>
                  <nav className="space-y-2">
                    {(user?.userType === "org_member" && user?.organization?.interviewRounds?.length > 0
                      ? QUICK_ACTIONS.filter((a) => a.to === "/my-interviews")
                      : QUICK_ACTIONS
                    ).map((action) => (
                      <QuickActionCard
                        key={action.title}
                        {...action}
                        color={action.color}
                      />
                    ))}
                  </nav>
                </section>

                {/* Unauthenticated CTA */}
                {!isAuthenticated && (
                  <section
                    className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-6"
                    aria-labelledby="login-cta-heading"
                  >
                    <h2 id="login-cta-heading" className="text-sm font-semibold text-amber-200 mb-2">
                      Sign in for personalized insights
                    </h2>
                    <p className="text-xs text-amber-100/90 mb-4">
                      Login to see your quiz scores, internship progress, and AI interview reports.
                    </p>
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 text-sm font-medium text-amber-200 hover:text-amber-100"
                    >
                      Continue to login
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </section>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default Dashboard;
