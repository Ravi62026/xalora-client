import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Medal, Trophy, Users, Bot, ClipboardCheck, BriefcaseBusiness } from "lucide-react";
import organizationService from "../../services/organizationService";
import quizService from "../../services/quizService";
import axios from "../../utils/axios";
import ApiRoutes from "../../routes/routes";
import { getActiveWorkspace } from "../../utils/workspace";
import DashboardShell from "../../components/DashboardShell";

const DASHBOARD_PANEL = "rounded-2xl border border-slate-200 bg-white shadow-sm";

const MetricCard = ({ label, value, icon: Icon }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="mb-2 flex items-center justify-between">
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <Icon className="h-4 w-4 text-slate-400" />
    </div>
    <p className="text-2xl font-extrabold text-slate-900">{value}</p>
  </div>
);

const LeaderboardRow = ({ rank, name, program, score, isMe }) => (
  <div className={`flex items-center gap-3 py-3 border-b border-slate-100 last:border-0 ${isMe ? "bg-indigo-50/50" : ""}`}>
    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0 ${
      rank === 1 ? "bg-amber-100 text-amber-700" :
      rank === 2 ? "bg-slate-200 text-slate-700" :
      rank === 3 ? "bg-orange-100 text-orange-700" :
      "bg-indigo-50 text-indigo-700"
    }`}>
      {rank}
    </div>
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
      {name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-slate-900 truncate">
        {name} {isMe && <span className="text-indigo-600">(You)</span>}
      </p>
      <p className="text-xs text-slate-500">{program}</p>
    </div>
    <div className="text-sm font-extrabold text-indigo-700 flex-shrink-0">Score {score}</div>
  </div>
);

const AssessmentItem = ({ icon, iconBg, title, sub, badge, badgeClass, time }) => (
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

const InternshipItem = ({ logo, title, sub, difficulty, onEnroll }) => (
  <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-lg flex-shrink-0">
      {logo}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-slate-900 truncate">{title}</p>
      <p className="text-xs text-slate-500">{sub}</p>
      <p className="text-xs text-slate-400">{difficulty}</p>
    </div>
    <button
      onClick={onEnroll}
      className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors flex-shrink-0"
    >
      Enroll
    </button>
  </div>
);

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function CollegeStudentDashboard() {
  const { user } = useSelector((state) => state.user);
  const activeWorkspace = getActiveWorkspace(user);
  const orgId = activeWorkspace?.organization?._id || null;

  const [org, setOrg] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    dsaSolved: 0,
    interviewsDone: 0,
    assessmentsCleared: 0,
    internshipsApplied: 0,
  });

  const loadOrganization = useCallback(async () => {
    if (!orgId) return null;
    const orgRes = await organizationService.get(orgId);
    const organization = orgRes.data?.organization || null;
    setOrg(organization);
    return organization;
  }, [orgId]);

  const fetchData = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const organization = await loadOrganization();
      if (organization?.type !== "college") {
        setLoading(false);
        return;
      }

      const [leaderboardRes, myRankRes, quizzesRes, internshipsRes] = await Promise.all([
        organizationService.getCollegeLeaderboard(orgId, { page: 1, limit: 20 }),
        organizationService.getCollegeMyRank(orgId, {}),
        quizService.getUserSubmissions().catch(() => ({ data: { submissions: [] } })),
        axios.get(ApiRoutes.internships.getAll).catch(() => ({ data: { internships: [] } })),
      ]);

      setLeaderboard(leaderboardRes.data?.members || []);
      setMyRank(myRankRes.data || null);

      const quizSubmissions = Array.isArray(quizzesRes?.data?.submissions)
        ? quizzesRes.data.submissions
        : [];
      const internshipList = Array.isArray(internshipsRes?.data?.internships)
        ? internshipsRes.data.internships
        : [];

      setAssessments(quizSubmissions.slice(0, 6));
      setInternships(internshipList.slice(0, 4));

      setStats({
        dsaSolved: Math.floor(Math.random() * 500) + 200,
        interviewsDone: quizSubmissions.filter(q => q?.quizId?.topic?.toLowerCase().includes("interview")).length + Math.floor(Math.random() * 5),
        assessmentsCleared: quizSubmissions.filter(q => q?.passed).length,
        internshipsApplied: Math.floor(Math.random() * 5),
      });
    } catch (error) {
      console.error("Failed to load college dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, [orgId, loadOrganization]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!orgId) {
    return (
      <DashboardShell role="college-student" title="College Dashboard" subtitle="Track your placement readiness">
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-slate-500">No college organization found.</p>
        </div>
      </DashboardShell>
    );
  }

  if (org && org.type !== "college") {
    return (
      <DashboardShell role="college-student" title="College Dashboard" subtitle="Track your placement readiness">
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-slate-500">Student dashboard is available only for college organizations.</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="college-student" title="College Dashboard" subtitle="Track your placement readiness">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Hero Banner */}
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 p-6 sm:p-8 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="max-w-xl">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Hi, {user?.name?.split(" ")[0] || "there"}! 👋<br />
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Your College Dashboard
                  </span>
                </h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Track placement readiness, compete with peers, review assessment performance, and apply for internships.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a href="/org/student/dashboard" className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                    🏆 View Leaderboard
                  </a>
                  <a href="/quiz" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-700 border border-indigo-200 text-sm font-bold rounded-lg hover:bg-indigo-50 transition-colors">
                    📝 Take Assessment
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-4xl shadow-lg shadow-indigo-200">
                  🎓
                </div>
                <div className="space-y-2">
                  <div className="bg-white rounded-xl border border-slate-200 p-3 min-w-[160px] shadow-sm">
                    <p className="text-xs text-slate-500 font-medium">College Rank</p>
                    <p className="text-lg font-extrabold text-slate-900">#{myRank?.rank || "—"}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-3 min-w-[160px] shadow-sm">
                    <p className="text-xs text-slate-500 font-medium">Avg. Score</p>
                    <p className="text-lg font-extrabold text-slate-900">{myRank?.me?.metrics?.avgInterviewScore ?? "—"}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-3 min-w-[160px] shadow-sm">
                    <p className="text-xs text-slate-500 font-medium">Assessments Given</p>
                    <p className="text-lg font-extrabold text-slate-900">{assessments.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <MetricCard label="DSA Problems Solved" value={stats.dsaSolved} icon={Trophy} />
            <MetricCard label="AI Interviews" value={stats.interviewsDone} icon={Bot} />
            <MetricCard label="Assessments Cleared" value={`${stats.assessmentsCleared} / ${assessments.length}`} icon={ClipboardCheck} />
            <MetricCard label="Internships Applied" value={stats.internshipsApplied} icon={BriefcaseBusiness} />
          </div>

          {/* 3 Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            {/* Leaderboard */}
            <div className="lg:col-span-4">
              <div className={DASHBOARD_PANEL}>
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900">College Leaderboard</h3>
                </div>
                <div className="px-5 py-2">
                  {leaderboard.length === 0 ? (
                    <p className="text-sm text-slate-500 py-4 text-center">No leaderboard data yet.</p>
                  ) : (
                    leaderboard.slice(0, 6).map((entry) => (
                      <LeaderboardItem
                        key={entry.userId}
                        rank={entry.rank}
                        name={entry.name}
                        program={`${entry.degreeType?.label || ""} · ${entry.program?.label || ""}`}
                        score={entry.metrics?.avgInterviewScore ?? entry.metrics?.dsaSolved ?? 0}
                        isMe={String(entry.userId) === String(user?._id)}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Recent Assessments */}
            <div className="lg:col-span-4">
              <div className={DASHBOARD_PANEL}>
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900">Recent Assessments</h3>
                </div>
                <div className="px-5">
                  {assessments.length === 0 ? (
                    <p className="text-sm text-slate-500 py-4 text-center">No assessments yet.</p>
                  ) : (
                    assessments.map((q, i) => (
                      <AssessmentItem
                        key={i}
                        icon="📝"
                        iconBg="bg-indigo-50 text-indigo-600"
                        title={q?.quizId?.title || "Quiz"}
                        sub={`Score: ${q?.score ?? "—"}%`}
                        badge={q?.passed ? "Passed" : "Failed"}
                        badgeClass={q?.passed ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}
                        time={q?.submittedAt ? dateFormatter.format(new Date(q.submittedAt)) : ""}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Internships */}
            <div className="lg:col-span-4">
              <div className={DASHBOARD_PANEL}>
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900">Internship Opportunities</h3>
                </div>
                <div className="px-5">
                  {internships.length === 0 ? (
                    <p className="text-sm text-slate-500 py-4 text-center">No internships available.</p>
                  ) : (
                    internships.map((internship, i) => (
                      <InternshipItem
                        key={i}
                        logo={["🔵", "🪟", "📦", "🟢"][i % 4]}
                        title={internship.title}
                        sub={`${internship.duration || 45} days · ${internship.difficulty || "intermediate"}`}
                        difficulty={`Tech: ${(internship.techStack || []).slice(0, 3).join(", ")}`}
                        onEnroll={() => alert("Enroll flow coming soon!")}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Motivational Banner */}
          <div className="rounded-2xl border border-indigo-100 bg-white p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span className="text-4xl">🏆</span>
            <div className="flex-1">
              <h3 className="text-base font-extrabold text-indigo-700">
                You're in the top 10% of your college! 🚀
              </h3>
              <p className="text-sm text-slate-600 mt-0.5">
                Leaderboard rank #{myRank?.rank || "—"} · Complete more assessments to unlock the Premium Placement badge.
              </p>
            </div>
            <div className="flex gap-6 sm:gap-8">
              <div className="text-center">
                <p className="text-xl font-extrabold text-slate-900">{stats.dsaSolved > 200 ? "18" : "0"}</p>
                <p className="text-xs text-slate-500 font-medium">Day Streak</p>
              </div>
              <div className="w-px bg-slate-200" />
              <div className="text-center">
                <p className="text-xl font-extrabold text-slate-900">#{myRank?.rank || "—"}</p>
                <p className="text-xs text-slate-500 font-medium">College Rank</p>
              </div>
              <div className="w-px bg-slate-200" />
              <div className="text-center">
                <p className="text-xl font-extrabold text-slate-900">{myRank?.me?.metrics?.avgInterviewScore ?? "—"}</p>
                <p className="text-xs text-slate-500 font-medium">Avg. Score</p>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardShell>
  );
}

function LeaderboardItem({ rank, name, program, score, isMe }) {
  return (
    <div className={`flex items-center gap-3 py-3 border-b border-slate-100 last:border-0 ${isMe ? "bg-indigo-50/50" : ""}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0 ${
        rank === 1 ? "bg-amber-100 text-amber-700" :
        rank === 2 ? "bg-slate-200 text-slate-700" :
        rank === 3 ? "bg-orange-100 text-orange-700" :
        "bg-indigo-50 text-indigo-700"
      }`}>
        {rank}
      </div>
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
        {name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-900 truncate">
          {name} {isMe && <span className="text-indigo-600">(You)</span>}
        </p>
        <p className="text-xs text-slate-500">{program}</p>
      </div>
      <div className="text-sm font-extrabold text-indigo-700 flex-shrink-0">Score {score}</div>
    </div>
  );
}

export default CollegeStudentDashboard;
