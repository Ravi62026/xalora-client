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
  Medal,
  RefreshCw,
  ShieldCheck,
  Sparkles,
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

const DASHBOARD_LINKS = [
  {
    title: "Solve DSA",
    subtitle: "Continue your coding streak",
    to: "/problems",
    icon: Code2,
    tone: "from-cyan-500/20 to-blue-500/20 border-cyan-400/25",
  },
  {
    title: "Take Quiz",
    subtitle: "Practice timed assessments",
    to: "/quiz",
    icon: ClipboardCheck,
    tone: "from-violet-500/20 to-purple-500/20 border-violet-400/25",
  },
  {
    title: "Internships",
    subtitle: "Track enrolled opportunities",
    to: "/internships/enrolled",
    icon: BriefcaseBusiness,
    tone: "from-emerald-500/20 to-teal-500/20 border-emerald-400/25",
  },
  {
    title: "AI Interview",
    subtitle: "Mock rounds and reports",
    to: "/my-interviews",
    icon: Bot,
    tone: "from-fuchsia-500/20 to-rose-500/20 border-fuchsia-400/25",
  },
];

const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const toArray = (value) => (Array.isArray(value) ? value : []);

const getProblemsArray = (res) => {
  if (Array.isArray(res?.data?.data?.problems)) return res.data.data.problems;
  if (Array.isArray(res?.data?.problems)) return res.data.problems;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res)) return res;
  return [];
};

const getQuizSubmissionsArray = (res) => {
  if (Array.isArray(res?.data?.submissions)) return res.data.submissions;
  if (Array.isArray(res?.submissions)) return res.submissions;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res)) return res;
  return [];
};

const getInternshipsArray = (res) => {
  if (Array.isArray(res?.data?.enrollments)) return res.data.enrollments;
  if (Array.isArray(res?.enrollments)) return res.enrollments;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res)) return res;
  return [];
};

const getInterviewsArray = (res) => {
  if (Array.isArray(res?.data?.interviews)) return res.data.interviews;
  if (Array.isArray(res?.interviews)) return res.interviews;
  if (Array.isArray(res?.data?.data?.interviews)) return res.data.data.interviews;
  return [];
};

const buildLast7Days = () => {
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setHours(0, 0, 0, 0);
    d.setDate(today.getDate() - i);
    days.push(d);
  }
  return days;
};

const parseDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

const DashboardMetric = ({ title, value, hint, icon: Icon, iconClass }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{title}</p>
        <p className="mt-2 text-2xl font-bold text-white sm:text-3xl">{value}</p>
      </div>
      <div className={`rounded-xl p-3 ${iconClass}`}>
        <Icon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
      </div>
    </div>
    <p className="mt-3 text-xs text-slate-400">{hint}</p>
  </div>
);

const Dashboard = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const getOrgDashboardRoute = () => {
    if (!user?.organization?.orgId) return "/dashboard";
    if (user?.organization?.role === "super_admin") return "/org/dashboard";
    if (user?.userType === "org_team") return "/org/teamdashboard";
    return "/org/student/dashboard";
  };

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

  const fetchDashboardData = useCallback(
    async ({ background = false } = {}) => {
      if (background) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError("");

      try {
        const solvedFromStorage = JSON.parse(localStorage.getItem("solvedProblems") || "[]");
        const solvedProblemIds = new Set(toArray(solvedFromStorage));

        const [
          problemsRes,
          quizRes,
          internshipRes,
          subscriptionRes,
          aiUsageRes,
          interviewsRes,
        ] = await Promise.all([
          problemService.getAllProblems({ limit: 500 }).catch(() => null),
          isAuthenticated ? quizService.getUserSubmissions().catch(() => null) : Promise.resolve(null),
          isAuthenticated
            ? axios.get(ApiRoutes.internships.getEnrolled).catch(() => null)
            : Promise.resolve(null),
          isAuthenticated
            ? subscriptionService.getCurrentSubscription().catch(() => null)
            : Promise.resolve(null),
          isAuthenticated ? subscriptionService.getAIUsageInfo().catch(() => null) : Promise.resolve(null),
          isAuthenticated ? interviewService.getMyInterviews().catch(() => null) : Promise.resolve(null),
        ]);

        const problems = getProblemsArray(problemsRes);
        const quizzes = getQuizSubmissionsArray(quizRes);
        const internships = getInternshipsArray(internshipRes);
        const interviews = getInterviewsArray(interviewsRes);

        const solvedProblems = problems.filter(
          (problem) =>
            problem?.userStatus === "Solved" || (problem?._id && solvedProblemIds.has(problem._id))
        ).length;

        const attemptedProblems = problems.filter(
          (problem) =>
            problem?.userStatus === "Attempted" && !(problem?._id && solvedProblemIds.has(problem._id))
        ).length;

        const averageQuizScore = quizzes.length
          ? Math.round(
              quizzes.reduce((sum, submission) => sum + Number(submission?.score || 0), 0) /
                quizzes.length
            )
          : 0;

        setMetrics({
          totalProblems: problems.length,
          solvedProblems,
          attemptedProblems,
          quizzesTaken: quizzes.length,
          averageQuizScore,
          internshipsEnrolled: internships.length,
          interviewsDone: interviews.length,
        });

        if (subscriptionRes?.data) {
          setPlanInfo(subscriptionRes.data);
        } else {
          setPlanInfo(null);
        }

        if (aiUsageRes) {
          setAiUsage(aiUsageRes);
        } else {
          setAiUsage(null);
        }

        const last7Days = buildLast7Days();
        const dayBuckets = last7Days.map((day) => ({
          key: day.toDateString(),
          label: dayFormatter.format(day),
          value: 0,
        }));

        const bumpDay = (dateValue) => {
          const parsed = parseDate(dateValue);
          if (!parsed) return;
          const key = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()).toDateString();
          const bucket = dayBuckets.find((entry) => entry.key === key);
          if (bucket) bucket.value += 1;
        };

        problems.forEach((problem) => {
          if (
            problem?.userStatus === "Solved" ||
            (problem?._id && solvedProblemIds.has(problem._id))
          ) {
            bumpDay(problem?.solvedAt || problem?.updatedAt || problem?.createdAt);
          }
        });

        quizzes.forEach((submission) => {
          bumpDay(submission?.submittedAt || submission?.createdAt);
        });

        interviews.forEach((interview) => {
          bumpDay(interview?.completedAt || interview?.updatedAt || interview?.createdAt);
        });

        setWeeklyActivity(dayBuckets);

        const combinedActivity = [
          ...problems
            .filter(
              (problem) =>
                problem?.userStatus === "Solved" ||
                (problem?._id && solvedProblemIds.has(problem._id))
            )
            .map((problem) => ({
              type: "problem",
              title: problem?.title || "Solved a problem",
              at: parseDate(problem?.solvedAt || problem?.updatedAt || problem?.createdAt),
              meta: problem?.difficulty || "DSA",
            })),
          ...quizzes.map((submission) => ({
            type: "quiz",
            title:
              submission?.quizId?.title ||
              submission?.quiz?.title ||
              submission?.quizTitle ||
              "Quiz submitted",
            at: parseDate(submission?.submittedAt || submission?.createdAt),
            meta:
              submission?.score === undefined || submission?.score === null
                ? "Score unavailable"
                : `Score ${submission.score}%`,
          })),
          ...interviews.map((interview) => ({
            type: "interview",
            title: interview?.candidateInfo?.position || "AI Interview session",
            at: parseDate(interview?.completedAt || interview?.updatedAt || interview?.createdAt),
            meta: interview?.status || "Interview",
          })),
        ]
          .filter((item) => item.at)
          .sort((a, b) => b.at - a.at)
          .slice(0, 8);

        setRecentActivity(combinedActivity);
      } catch (err) {
        setError("Dashboard data load failed. Please refresh and try again.");
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
    if (!metrics.totalProblems) return 0;
    return Math.round((metrics.solvedProblems / metrics.totalProblems) * 100);
  }, [metrics.totalProblems, metrics.solvedProblems]);

  const planMeta = useMemo(() => {
    const planId = planInfo?.planId;
    return PLAN_META[planId] || PLAN_META.spark;
  }, [planInfo]);

  const usagePercent = useMemo(() => {
    if (!aiUsage?.requestsLimit) return 0;
    return Math.min(100, Math.round((aiUsage.requestsUsed / aiUsage.requestsLimit) * 100));
  }, [aiUsage]);

  const uploadPercent = useMemo(() => {
    if (!aiUsage?.fileUploadsLimit) return 0;
    return Math.min(100, Math.round((aiUsage.fileUploadsUsed / aiUsage.fileUploadsLimit) * 100));
  }, [aiUsage]);

  const maxWeeklyValue = useMemo(() => {
    const max = Math.max(...weeklyActivity.map((entry) => entry.value), 0);
    return max || 1;
  }, [weeklyActivity]);

  return (
    <Layout>
      <section className="min-h-screen bg-[radial-gradient(circle_at_5%_8%,rgba(34,211,238,0.2),transparent_30%),radial-gradient(circle_at_88%_14%,rgba(16,185,129,0.16),transparent_26%),linear-gradient(145deg,#020617,#0f172a,#030712)] py-8 sm:py-10 lg:py-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-white/5 to-emerald-500/10 p-5 sm:p-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Xalora Command Center</p>
                <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                  {isAuthenticated ? `Welcome back, ${user?.name || "Engineer"}` : "Your learning dashboard"}
                </h1>
                <p className="mt-2 text-sm text-slate-300 sm:text-base">
                  Track progress across DSA, quizzes, internships, and AI interviews from one modern workspace.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fetchDashboardData({ background: true })}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/15"
                >
                  {isRefreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Refresh
                </button>
                {!isAuthenticated ? (
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:from-cyan-600 hover:to-emerald-600"
                  >
                    Login to unlock
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <Link
                    to="/profile"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:from-cyan-600 hover:to-emerald-600"
                  >
                    Open Profile
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Organization banner for org members */}
          {isAuthenticated && user?.organization?.orgId && (
            <div className="mb-5 rounded-xl border border-emerald-400/20 bg-gradient-to-r from-emerald-500/10 via-transparent to-teal-500/10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">
                    Organization Member
                  </p>
                  <p className="text-xs text-gray-400">
                    {user.organization.role?.replace("_", " ")} &middot; {user.organization.department || "No department"}
                  </p>
                </div>
              </div>
              <Link
                to={getOrgDashboardRoute()}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-medium hover:bg-emerald-600/30 transition-colors"
              >
                Org Dashboard <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex min-h-[45vh] items-center justify-center rounded-3xl border border-white/10 bg-white/5">
              <div className="text-center">
                <Loader2 className="mx-auto h-10 w-10 animate-spin text-cyan-300" />
                <p className="mt-3 text-sm text-slate-300">Building your personalized dashboard...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <DashboardMetric
                  title="Solved Problems"
                  value={metrics.solvedProblems}
                  hint={`${completionRate}% completion of ${metrics.totalProblems} total`}
                  icon={Code2}
                  iconClass="bg-cyan-500/75"
                />
                <DashboardMetric
                  title="Quiz Attempts"
                  value={metrics.quizzesTaken}
                  hint={`Average score: ${metrics.averageQuizScore}%`}
                  icon={ClipboardCheck}
                  iconClass="bg-violet-500/75"
                />
                <DashboardMetric
                  title="Internships"
                  value={metrics.internshipsEnrolled}
                  hint="Enrolled and tracked opportunities"
                  icon={BriefcaseBusiness}
                  iconClass="bg-emerald-500/75"
                />
                <DashboardMetric
                  title="AI Interviews"
                  value={metrics.interviewsDone}
                  hint="Completed and in-progress sessions"
                  icon={Bot}
                  iconClass="bg-fuchsia-500/75"
                />
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
                <div className="space-y-6 xl:col-span-8">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-semibold text-white">Weekly Momentum</h2>
                        <p className="text-sm text-slate-300">
                          Daily activity from solved problems, quizzes, and interview sessions.
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
                        <Activity className="h-4 w-4" />
                        Live progress
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-7 gap-2 sm:gap-3">
                      {weeklyActivity.map((entry) => {
                        const heightPercent = Math.max(12, Math.round((entry.value / maxWeeklyValue) * 100));
                        return (
                          <div key={entry.key} className="flex flex-col items-center gap-2">
                            <div className="flex h-36 w-full items-end rounded-xl bg-slate-900/60 p-2">
                              <div
                                className="w-full rounded-md bg-gradient-to-t from-cyan-500 to-emerald-500 transition-all"
                                style={{ height: `${heightPercent}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-400">{entry.label}</span>
                            <span className="text-xs font-semibold text-slate-200">{entry.value}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur sm:p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
                      <CalendarClock className="h-5 w-5 text-slate-400" />
                    </div>

                    {recentActivity.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-white/20 bg-slate-900/50 p-6 text-center text-sm text-slate-400">
                        No tracked activity yet. Start with DSA or a quiz to populate your feed.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recentActivity.map((item, index) => (
                          <div
                            key={`${item.type}-${item.title}-${index}`}
                            className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-white">{item.title}</p>
                              <p className="mt-1 text-xs text-slate-400">{item.meta}</p>
                            </div>
                            <span className="whitespace-nowrap text-xs text-slate-400">
                              {dateFormatter.format(item.at)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-orange-400/25 bg-orange-500/10 p-5">
                      <div className="flex items-center gap-3">
                        <Flame className="h-5 w-5 text-orange-300" />
                        <h3 className="text-base font-semibold text-orange-100">Current Streak</h3>
                      </div>
                      <p className="mt-3 text-3xl font-bold text-white">{user?.stats?.currentStreak || 0} days</p>
                      <p className="mt-1 text-xs text-orange-100/80">Keep solving daily to increase consistency.</p>
                    </div>
                    <div className="rounded-2xl border border-indigo-400/25 bg-indigo-500/10 p-5">
                      <div className="flex items-center gap-3">
                        <Medal className="h-5 w-5 text-indigo-200" />
                        <h3 className="text-base font-semibold text-indigo-100">Attempts in Progress</h3>
                      </div>
                      <p className="mt-3 text-3xl font-bold text-white">{metrics.attemptedProblems}</p>
                      <p className="mt-1 text-xs text-indigo-100/80">Finish these attempts to convert them into solved.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 xl:col-span-4">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur sm:p-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-white">Subscription</h2>
                      <Sparkles className="h-5 w-5 text-cyan-300" />
                    </div>

                    <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/55 p-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${planMeta.badgeClass}`}>
                        {planMeta.label}
                      </span>
                      <p className="mt-3 text-sm text-slate-300">
                        {planInfo?.isActive
                          ? "Your plan is active and serving usage limits as expected."
                          : "No active subscription found. Upgrade for higher limits."}
                      </p>
                      {planInfo?.endDate && (
                        <p className="mt-2 text-xs text-slate-400">
                          Valid till {new Date(planInfo.endDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <Link
                      to="/pricing"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-200 hover:text-cyan-100"
                    >
                      Manage plans
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur sm:p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-white">AI Usage</h2>
                      <BarChart3 className="h-5 w-5 text-emerald-300" />
                    </div>

                    <div className="space-y-5">
                      <div>
                        <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
                          <span>Requests</span>
                          <span>
                            {aiUsage?.requestsUsed ?? 0} / {aiUsage?.requestsLimit ?? 0}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                            style={{ width: `${usagePercent}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
                          <span>File uploads</span>
                          <span>
                            {aiUsage?.fileUploadsUsed ?? 0} / {aiUsage?.fileUploadsLimit ?? 0}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                            style={{ width: `${uploadPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-slate-400">
                      Resets daily. Usage is synced from your active subscription.
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur sm:p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
                      <ShieldCheck className="h-5 w-5 text-slate-300" />
                    </div>
                    <div className="space-y-3">
                      {DASHBOARD_LINKS.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.title}
                            to={link.to}
                            className={`flex items-center justify-between rounded-2xl border bg-gradient-to-r px-4 py-3 transition hover:translate-x-1 ${link.tone}`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="h-5 w-5 text-white" />
                              <div>
                                <p className="text-sm font-semibold text-white">{link.title}</p>
                                <p className="text-xs text-slate-200">{link.subtitle}</p>
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-slate-100" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {!isAuthenticated && (
                    <div className="rounded-3xl border border-amber-400/30 bg-amber-500/10 p-5">
                      <p className="text-sm font-semibold text-amber-200">Login for personalized analytics</p>
                      <p className="mt-1 text-xs text-amber-100/90">
                        Your private quiz, internship, and interview metrics are shown after login.
                      </p>
                      <Link
                        to="/login"
                        className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-amber-100 hover:text-white"
                      >
                        Continue to login
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
