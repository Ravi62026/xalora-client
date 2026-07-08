import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  CheckCircle2,
  Bot,
  ClipboardCheck,
  Coins,
} from "lucide-react";
import problemService from "../../services/problemService";
import quizService from "../../services/quizService";
import subscriptionService from "../../services/subscriptionService";
import interviewService from "../../services/interviewService";
import axios from "../../utils/axios";
import ApiRoutes from "../../routes/routes";
import {
  getActiveWorkspace,
  isCompanyCandidateWorkspace,
} from "../../utils/workspace";
import DashboardShell from "../../components/DashboardShell";

const DASHBOARD_PANEL = "rounded-2xl border border-slate-200 bg-white shadow-sm";

const MetricCard = ({ title, value, hint, icon: Icon, iconColor = "indigo", to }) => {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-600",
  };

  const inner = (
    <div className="flex items-start justify-between h-full">
      <div className="flex-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </h3>
        <div className="mt-2">
          <p className="text-3xl font-extrabold text-slate-900 tabular-nums" role="status" aria-live="polite">
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </div>
      </div>
      <div className={`rounded-xl p-2.5 ${colorMap[iconColor]} flex-shrink-0`} aria-hidden="true">
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );

  if (to) {
    return (
      <a href={to} className={`group block ${DASHBOARD_PANEL} p-5 transition-all hover:shadow-md`}>
        {inner}
      </a>
    );
  }

  return (
    <div className={`${DASHBOARD_PANEL} p-5`} aria-label={`${title}: ${value}`}>
      {inner}
    </div>
  );
};

const MetricSkeleton = () => (
  <div className={`animate-pulse ${DASHBOARD_PANEL} p-5`} aria-busy="true">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="h-3 w-24 rounded bg-slate-200" />
        <div className="mt-2 h-10 w-32 rounded bg-slate-200" />
      </div>
      <div className="h-12 w-12 rounded-xl bg-slate-200" />
    </div>
  </div>
);

const ActivityItem = ({ icon, iconBg, title, sub, badge, badgeClass, time }) => (
  <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${iconBg}`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-slate-900 truncate">{title}</p>
      <p className="text-xs text-slate-500 truncate">{sub}</p>
    </div>
    {badge && (
      <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${badgeClass}`}>
        {badge}
      </span>
    )}
    {time && <span className="text-xs text-slate-400 flex-shrink-0">{time}</span>}
  </div>
);

const QuickActionItem = ({ icon, label, sub, to, color }) => (
  <a
    href={to}
    target={to?.startsWith("http") ? "_blank" : undefined}
    rel={to?.startsWith("http") ? "noopener noreferrer" : undefined}
    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors hover:shadow-sm ${color}`}
  >
    <span className="text-lg">{icon}</span>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-slate-900">{label}</p>
      <p className="text-xs text-slate-500 truncate">{sub}</p>
    </div>
    <span className="text-slate-400 text-sm">→</span>
  </a>
);

const TopicProgressItem = ({ icon, iconBg, title, pct, pctColor, chips }) => (
  <div className="py-3 border-b border-slate-100 last:border-0">
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center gap-2">
        <div className={`w-7 h-7 rounded-md flex items-center justify-center text-xs ${iconBg}`}>
          {icon}
        </div>
        <span className="text-sm font-bold text-slate-900">{title}</span>
      </div>
      <span className={`text-xs font-extrabold ${pctColor}`}>{pct}</span>
    </div>
    <div className="flex flex-wrap gap-1.5 ml-9">
      {chips.map((chip, i) => (
        <span
          key={i}
          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
            chip.type === "easy"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
              : chip.type === "medium"
              ? "bg-amber-50 text-amber-700 border border-amber-100"
              : chip.type === "hard"
              ? "bg-red-50 text-red-700 border border-red-100"
              : "bg-slate-100 text-slate-600 border border-slate-200"
          }`}
        >
          {chip.label}
        </span>
      ))}
    </div>
  </div>
);

const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const QUICK_ACTIONS = [
  { icon: "🎯", label: "Practice DSA", sub: "Random problems from weak topics", to: "/problems", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  { icon: "🤖", label: "Mock Interview", sub: "Technical + Behavioral round", to: "/my-interviews", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { icon: "📝", label: "Take a Quiz", sub: "Topic-wise assessment", to: "/quiz", color: "bg-amber-50 text-amber-600 border-amber-100" },
  { icon: "📄", label: "Resume Analyzer", sub: "Upload PDF, get AI feedback", to: "https://www.resume.xalora.one", color: "bg-blue-50 text-blue-600 border-blue-100" },
  { icon: "💼", label: "Browse Internships", sub: "Explore opportunities", to: "/internships", color: "bg-violet-50 text-violet-600 border-violet-100" },
];

function IndividualDashboard() {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const activeWorkspace = getActiveWorkspace(user);
  const isCompanyCandidate = isCompanyCandidateWorkspace(activeWorkspace);

  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalProblems: 0,
    solvedProblems: 0,
    attemptedProblems: 0,
    quizzesTaken: 0,
    averageQuizScore: 0,
    internshipsEnrolled: 0,
    interviewsDone: 0,
    averageInterviewScore: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [planInfo, setPlanInfo] = useState(null);

  const fetchDashboardData = useCallback(
    async ({ background = false } = {}) => {
      if (!background) setIsLoading(true);

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

        const [
          problemsRes,
          quizRes,
          internshipRes,
          subscriptionRes,
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
            ? withTimeout(interviewService.getMyInterviews().catch((err) => {
                console.warn("[Dashboard] getMyInterviews failed:", err?.response?.status, err?.response?.data?.message || err?.message);
                return null;
              }), 7000)
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

        const completedInterviewsWithScore = interviews.filter(
          (i) => i.reportScore !== null && i.reportScore !== undefined
        );
        const avgInterviewScore = completedInterviewsWithScore.length > 0
          ? Math.round(completedInterviewsWithScore.reduce((sum, i) => sum + i.reportScore, 0) / completedInterviewsWithScore.length)
          : 0;

        setMetrics((prev) => ({
          ...prev,
          totalProblems: Number(problemStats?.totalProblems) || Number(prev.totalProblems) || problems.length,
          solvedProblems: Number(problemStats?.solvedProblems) || solvedProblems,
          attemptedProblems: Number(problemStats?.attemptedProblems) || attemptedProblems,
          quizzesTaken: quizzes.length,
          averageQuizScore: avgScore,
          internshipsEnrolled: internships.length,
          interviewsDone: interviews.length,
          averageInterviewScore: avgInterviewScore,
        }));

        const subscriptionPayload = getSettledValue(subscriptionRes);
        if (subscriptionPayload?.data) {
          setPlanInfo(subscriptionPayload.data);
        }

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
              meta: q?.score === undefined || q?.score === null ? "Score unavailable" : `Score ${q.score}%`,
            };
          }),
          ...interviews.map((i) => {
            const { at, atValue } = safeAt(i?.completedAt || i?.updatedAt || i?.createdAt);

            // Construct descriptive title instead of "Not specified"
            let title = i?.candidateInfo?.position;
            if (!title || title === "Not specified" || title.trim() === "") {
              if (i?.interviewTopic) {
                title = `${i.interviewTopic} Technical Interview`;
              } else if (i?.interviewMode === "specific" && i?.specificRound) {
                const roundNames = {
                  formal_qa: "Formal Q&A Round",
                  coding: "Coding Round",
                  technical: "Technical Interview",
                  behavioral: "Behavioral Round",
                  system_design: "System Design Round",
                  resume_deep_dive: "Resume Deep Dive",
                  jd_based: "JD-Based Interview"
                };
                title = roundNames[i.specificRound] || "Specific Round Interview";
              } else if (i?.interviewMode === "full") {
                title = "Full Mock Interview";
              } else if (i?.interviewMode === "practice") {
                title = "Practice Mock Interview";
              } else {
                title = "AI Interview Session";
              }
            } else {
              title = `${title} Mock Interview`;
            }

            return {
              type: "interview",
              title,
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
      } finally {
        setIsLoading(false);
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

  return (
    <DashboardShell role="individual" title="Dashboard" subtitle="Track your progress across DSA, quizzes, interviews, and internships">
      {/* Hero Banner */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 p-6 sm:p-8 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hi, {user?.name?.split(" ")[0] || "there"}! 👋<br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Your Practice Dashboard
              </span>
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Track DSA progress, review AI interview performance, analyze quizzes, and discover internships.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="/my-interviews"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                ▶ Start AI Interview
              </a>
              <a
                href="https://www.resume.xalora.one"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-700 border border-indigo-200 text-sm font-bold rounded-lg hover:bg-indigo-50 transition-colors"
              >
                📄 Analyze Resume
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-4xl shadow-lg shadow-indigo-200">
              🎯
            </div>
            <div className="space-y-2">
              <div className="bg-white rounded-xl border border-slate-200 p-3 min-w-[160px] shadow-sm">
                <p className="text-xs text-slate-500 font-medium">Problems Solved</p>
                <p className="text-lg font-extrabold text-slate-900">{metrics.solvedProblems.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-3 min-w-[160px] shadow-sm">
                <p className="text-xs text-slate-500 font-medium">Avg. Interview Score</p>
                <p className="text-lg font-extrabold text-slate-900">
                  {metrics.averageInterviewScore > 0 ? `${metrics.averageInterviewScore}%` : "—"}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-3 min-w-[160px] shadow-sm">
                <p className="text-xs text-slate-500 font-medium">JBP Coins</p>
                <p className="text-lg font-extrabold text-slate-900">{(metrics.quizzesTaken * 200 + metrics.interviewsDone * 100).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      {!isLoading && !isCompanyCandidate && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Problems Solved"
            value={metrics.solvedProblems}
            hint={`${completionRate}% of ${metrics.totalProblems} total`}
            icon={CheckCircle2}
            iconColor="indigo"
          />
          <MetricCard
            title="AI Interviews"
            value={metrics.interviewsDone}
            hint={metrics.averageInterviewScore > 0 ? `Avg score: ${metrics.averageInterviewScore}%` : "Total mock sessions"}
            icon={Bot}
            iconColor="violet"
            to="/my-interviews"
          />
          <MetricCard
            title="Quizzes Passed"
            value={metrics.quizzesTaken}
            hint={`Avg score: ${metrics.averageQuizScore}%`}
            icon={ClipboardCheck}
            iconColor="emerald"
          />
          <MetricCard
            title="JBP Coins"
            value={(metrics.quizzesTaken * 200 + metrics.interviewsDone * 100).toLocaleString()}
            hint="Earned from quizzes & interviews"
            icon={Coins}
            iconColor="amber"
          />
        </div>
      )}

      {isLoading && !isCompanyCandidate && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {Array(4).fill(null).map((_, i) => <MetricSkeleton key={i} />)}
        </div>
      )}

      {/* Columns Section */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* Recent Activity */}
          <div className="lg:col-span-6">
            <div className={DASHBOARD_PANEL}>
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900">Recent Activity</h3>
              </div>
              <div className="px-5">
                {recentActivity.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-sm text-slate-500">No activity yet. Start with DSA problems or a quiz.</p>
                  </div>
                ) : (
                  recentActivity.map((item, index) => (
                    <ActivityItem
                      key={`${item.type}-${item.title}-${index}`}
                      icon={
                        item.type === "problem" ? "✅" :
                        item.type === "quiz" ? "📝" :
                        item.type === "interview" ? "🤖" :
                        item.type === "resume" ? "📄" :
                        item.type === "internship" ? "💼" : "📌"
                      }
                      iconBg={
                        item.type === "problem" ? "bg-emerald-50 text-emerald-600" :
                        item.type === "quiz" ? "bg-indigo-50 text-indigo-600" :
                        item.type === "interview" ? "bg-violet-50 text-violet-600" :
                        item.type === "resume" ? "bg-blue-50 text-blue-600" :
                        item.type === "internship" ? "bg-amber-50 text-amber-600" :
                        "bg-slate-100 text-slate-600"
                      }
                      title={item.title}
                      sub={item.meta}
                      badge={
                        item.type === "problem" ? "Accepted" :
                        item.type === "quiz" ? `${item.meta}` :
                        item.type === "interview" ? "Completed" :
                        item.type === "resume" ? "AI Review" :
                        item.type === "internship" ? "Enrolled" : null
                      }
                      badgeClass={
                        item.type === "problem" ? "bg-emerald-50 text-emerald-700" :
                        item.type === "quiz" ? "bg-indigo-50 text-indigo-700" :
                        item.type === "interview" ? "bg-violet-50 text-violet-700" :
                        item.type === "resume" ? "bg-blue-50 text-blue-700" :
                        item.type === "internship" ? "bg-amber-50 text-amber-700" :
                        "bg-slate-100 text-slate-700"
                      }
                      time={item.at}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-6">
            <div className={DASHBOARD_PANEL}>
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-extrabold text-slate-900">Quick Actions</h3>
              </div>
              <div className="px-5 py-3 space-y-2">
                {QUICK_ACTIONS.map((action) => (
                  <QuickActionItem key={action.label} {...action} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Motivational Banner */}
      <div className="rounded-2xl border border-indigo-100 bg-white p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <span className="text-4xl">🏆</span>
        <div className="flex-1">
          <h3 className="text-base font-extrabold text-indigo-700">
            Keep Going, {user?.name?.split(" ")[0] || "there"}! 🚀
          </h3>
          <p className="text-sm text-slate-600 mt-0.5">
            {metrics.solvedProblems > 0
              ? `You've solved ${metrics.solvedProblems} problems, completed ${metrics.interviewsDone} AI interviews, and passed ${metrics.quizzesTaken} quizzes.`
              : "Start your journey by solving your first problem or taking a quiz."}
          </p>
        </div>
        <div className="flex gap-6 sm:gap-8">
          <div className="text-center">
            <p className="text-xl font-extrabold text-slate-900">{metrics.quizzesTaken}</p>
            <p className="text-xs text-slate-500 font-medium">Quizzes Taken</p>
          </div>
          <div className="w-px bg-slate-200" />
          <div className="text-center">
            <p className="text-xl font-extrabold text-slate-900">
              {metrics.averageQuizScore > 0 ? `${metrics.averageQuizScore}%` : "—"}
            </p>
            <p className="text-xs text-slate-500 font-medium">Quiz Avg. Score</p>
          </div>
          <div className="w-px bg-slate-200" />
          <div className="text-center">
            <p className="text-xl font-extrabold text-slate-900">
              {metrics.averageInterviewScore > 0 ? `${metrics.averageInterviewScore}%` : "—"}
            </p>
            <p className="text-xs text-slate-500 font-medium">Interview Avg. Score</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

export default IndividualDashboard;
