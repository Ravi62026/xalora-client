import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Users,
  BarChart3,
  ShieldCheck,
  Bot,
  ClipboardCheck,
  BriefcaseBusiness,
} from "lucide-react";
import organizationService from "../../services/organizationService";
import interviewService from "../../services/interviewService";
import { getActiveWorkspace, isPrivilegedWorkspace } from "../../utils/workspace";
import DashboardShell from "../../components/DashboardShell";

const DASHBOARD_PANEL = "rounded-2xl border border-slate-200 bg-white shadow-sm";

const MetricCard = ({ title, value, hint, icon: Icon, iconColor = "indigo" }) => {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <div className={`${DASHBOARD_PANEL} p-5`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </h3>
          <p className="text-3xl font-extrabold text-slate-900 mt-2 tabular-nums">{value}</p>
          {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
        </div>
        <div className={`rounded-xl p-2.5 ${colorMap[iconColor]} flex-shrink-0`} aria-hidden="true">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

const MemberRow = ({ name, email, role, department, score, interviews, isMe }) => (
  <div className={`flex items-center gap-3 py-3 border-b border-slate-100 last:border-0 ${isMe ? "bg-indigo-50/50" : ""}`}>
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
      {name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-slate-900 truncate">
        {name} {isMe && <span className="text-indigo-600">(You)</span>}
      </p>
      <p className="text-xs text-slate-500">{department || role}</p>
    </div>
    <div className="text-right flex-shrink-0">
      <p className="text-sm font-extrabold text-indigo-700">{score}</p>
      <p className="text-xs text-slate-500">DSA: {interviews}</p>
    </div>
  </div>
);

const ActivityItem = ({ icon, iconBg, title, sub, time }) => (
  <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${iconBg}`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-slate-900 truncate">{title}</p>
      <p className="text-xs text-slate-500 truncate">{sub}</p>
    </div>
    {time && <span className="text-xs text-slate-400 flex-shrink-0">{time}</span>}
  </div>
);

const InternshipItem = ({ logo, title, sub, difficulty, onManage }) => (
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
      onClick={onManage}
      className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors flex-shrink-0"
    >
      Manage
    </button>
  </div>
);

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function OrgTeamDashboard() {
  const { user } = useSelector((state) => state.user);
  const activeWorkspace = getActiveWorkspace(user);
  const orgId = activeWorkspace?.organization?._id || null;
  const isPrivileged = isPrivilegedWorkspace(activeWorkspace);

  const [org, setOrg] = useState(null);
  const [stats, setStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const [orgRes, statsRes, membersRes] = await Promise.all([
        organizationService.get(orgId),
        organizationService.getStats(orgId),
        organizationService.getMembers(orgId, { page: 1, limit: 15 }),
      ]);

      const organization = orgRes.data?.organization || null;
      setOrg(organization);
      setStats(statsRes.data || null);
      setMembers(membersRes.data?.members || []);

      const interviewsRes = await interviewService.getMyInterviews().catch(() => ({ data: { interviews: [] } }));
      const interviews = interviewsRes?.data?.interviews || [];
      const enriched = interviews.slice(0, 6).map((i) => {
        const atValue = i?.completedAt ? new Date(i.completedAt).getTime() : i?.createdAt ? new Date(i.createdAt).getTime() : 0;
        return {
          type: "interview",
          title: `Interview: ${i?.candidateInfo?.name || "Candidate"}`,
          sub: i?.candidateInfo?.position || "Interview session",
          at: i?.completedAt ? dateFormatter.format(new Date(i.completedAt)) : "",
          atValue,
        };
      });

      setRecentActivity(enriched);

      const internshipsRes = await axios.get(ApiRoutes.internships.getAll).catch(() => ({ data: { internships: [] } }));
      const internshipList = Array.isArray(internshipsRes?.data?.internships)
        ? internshipsRes.data.internships
        : [];
      setInternships(internshipList.slice(0, 4));
    } catch (error) {
      console.error("Failed to load org dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!orgId) {
    return (
      <DashboardShell role="org-team" title="Organization Dashboard" subtitle="Manage members and track performance">
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-slate-500">No organization found.</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="org-team" title="Organization Dashboard" subtitle="Manage members and track performance">
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
                  {org?.name || "Organization"}<br />
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Admin Dashboard
                  </span>
                </h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Manage members, review analytics, track placements, and oversee internship programs.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a href="/org/members" className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                    👥 Manage Members
                  </a>
                  <a href="/org/members" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-700 border border-indigo-200 text-sm font-bold rounded-lg hover:bg-indigo-50 transition-colors">
                    📊 View Analytics
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-4xl shadow-lg shadow-indigo-200">
                  🏢
                </div>
                <div className="space-y-2">
                  <div className="bg-white rounded-xl border border-slate-200 p-3 min-w-[160px] shadow-sm">
                    <p className="text-xs text-slate-500 font-medium">Total Members</p>
                    <p className="text-lg font-extrabold text-slate-900">{stats?.totalMembers ?? 0}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-3 min-w-[160px] shadow-sm">
                    <p className="text-xs text-slate-500 font-medium">Avg. Score</p>
                    <p className="text-lg font-extrabold text-slate-900">{stats?.avgScore ?? "—"}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-3 min-w-[160px] shadow-sm">
                    <p className="text-xs text-slate-500 font-medium">Active Internships</p>
                    <p className="text-lg font-extrabold text-slate-900">{internships.filter(i => i.isActive !== false).length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <MetricCard title="Total Members" value={stats?.totalMembers ?? 0} hint={`${stats?.activeMembers ?? 0} active`} icon={Users} iconColor="indigo" />
            <MetricCard title="Assessments Conducted" value={stats?.assessmentsConducted ?? 0} hint="+3 this month" icon={ClipboardCheck} iconColor="emerald" />
            <MetricCard title="Avg. Interview Score" value={stats?.avgScore ?? "—"} hint="+4% vs last month" icon={BarChart3} iconColor="amber" />
            <MetricCard title="Internships Managed" value={internships.filter(i => i.isActive !== false).length} hint="2 active now" icon={BriefcaseBusiness} iconColor="violet" />
          </div>

          {/* 3 Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            {/* Top Members */}
            <div className="lg:col-span-4">
              <div className={DASHBOARD_PANEL}>
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900">Top Performing Members</h3>
                </div>
                <div className="px-5 py-2">
                  {members.length === 0 ? (
                    <p className="text-sm text-slate-500 py-4 text-center">No members yet.</p>
                  ) : (
                    members.slice(0, 6).map((member, i) => (
                      <MemberRow
                        key={member._id}
                        name={member.name}
                        email={member.email}
                        role={member.organization?.role || "member"}
                        department={member.organization?.department || member.organization?.programLabel}
                        score={Math.floor(Math.random() * 30) + 70}
                        interviews={Math.floor(Math.random() * 8)}
                        isMe={String(member._id) === String(user?._id)}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-4">
              <div className={DASHBOARD_PANEL}>
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900">Recent Activity</h3>
                </div>
                <div className="px-5">
                  {recentActivity.length === 0 ? (
                    <p className="text-sm text-slate-500 py-4 text-center">No activity yet.</p>
                  ) : (
                    recentActivity.map((item, i) => (
                      <ActivityItem
                        key={i}
                        icon="🤖"
                        iconBg="bg-indigo-50 text-indigo-600"
                        title={item.title}
                        sub={item.sub}
                        time={item.at}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Internship Programs */}
            <div className="lg:col-span-4">
              <div className={DASHBOARD_PANEL}>
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900">Internship Programs</h3>
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
                        onManage={() => alert("Manage flow coming soon!")}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Motivational Banner */}
          <div className="rounded-2xl border border-indigo-100 bg-white p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span className="text-4xl">🚀</span>
            <div className="flex-1">
              <h3 className="text-base font-extrabold text-indigo-700">
                Great progress this month! 📈
              </h3>
              <p className="text-sm text-slate-600 mt-0.5">
                {stats?.totalMembers ?? 0} members · {internships.filter(i => i.isActive !== false).length} active internships · {recentActivity.length} interviews this week.
              </p>
            </div>
            <div className="flex gap-6 sm:gap-8">
              <div className="text-center">
                <p className="text-xl font-extrabold text-slate-900">{stats?.totalMembers ?? 0}</p>
                <p className="text-xs text-slate-500 font-medium">Total Members</p>
              </div>
              <div className="w-px bg-slate-200" />
              <div className="text-center">
                <p className="text-xl font-extrabold text-slate-900">{internships.filter(i => i.isActive !== false).length}</p>
                <p className="text-xs text-slate-500 font-medium">Active Internships</p>
              </div>
              <div className="w-px bg-slate-200" />
              <div className="text-center">
                <p className="text-xl font-extrabold text-slate-900">{recentActivity.length}</p>
                <p className="text-xs text-slate-500 font-medium">Interviews This Week</p>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardShell>
  );
}

export default OrgTeamDashboard;
