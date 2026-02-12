import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Code2,
  Mic,
  Trophy,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Download,
  Eye,
  X,
  BarChart3,
  TrendingUp,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";
import { Layout } from "../../components";
import organizationService from "../../services/organizationService";

// ─── Constants ──────────────────────────────────────────────────────────────

const STATUS_BADGE = {
  active: "bg-emerald-500/20 text-emerald-300",
  inactive: "bg-gray-500/20 text-gray-400",
  suspended: "bg-red-500/20 text-red-300",
  graduated: "bg-blue-500/20 text-blue-300",
};

const HIRING_BADGE = {
  strong_hire: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  hire: "bg-green-500/20 text-green-300 border-green-500/30",
  maybe: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  no_hire: "bg-red-500/20 text-red-300 border-red-500/30",
};

const HIRING_LABEL = {
  strong_hire: "Strong Hire",
  hire: "Hire",
  maybe: "Maybe",
  no_hire: "No Hire",
};

// ─── Stat Card ──────────────────────────────────────────────────────────────

function AggregateStat({ label, value, icon: Icon, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-xl border p-4 sm:p-5`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs sm:text-sm text-gray-400">{label}</span>
        <Icon className="w-4 h-4 text-gray-500" />
      </div>
      <p className="text-xl sm:text-2xl font-bold text-white">{value ?? "—"}</p>
    </div>
  );
}

// ─── Member Detail Modal ────────────────────────────────────────────────────

function MemberDetailModal({ orgId, memberId, memberName, onClose }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(null);
  const [expandedSession, setExpandedSession] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await organizationService.getMemberAnalytics(orgId, memberId);
        setData(res.data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [orgId, memberId]);

  const handleDownloadReport = async (sessionId) => {
    setDownloading(sessionId);
    try {
      const response = await organizationService.downloadMemberInterviewReport(
        orgId,
        memberId,
        sessionId
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Interview_Report_${memberName?.replace(/\s+/g, "_") || "member"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to download report");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm font-bold uppercase">
              {memberName?.charAt(0) || "?"}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{memberName}</h2>
              <p className="text-xs text-gray-400">Student Analytics</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-300">{error}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Member Info */}
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-full text-gray-300">
                  {data?.member?.email}
                </span>
                <span className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-full text-gray-300">
                  {data?.member?.organization?.department || "No Dept"}
                </span>
                <span className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-full text-gray-300">
                  Batch: {data?.member?.organization?.batch || "—"}
                </span>
                <span
                  className={`px-3 py-1.5 rounded-full text-xs ${
                    STATUS_BADGE[data?.member?.organization?.status] || STATUS_BADGE.active
                  }`}
                >
                  {data?.member?.organization?.status || "active"}
                </span>
              </div>

              {/* DSA Stats */}
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                  <Code2 className="w-4 h-4 text-blue-400" /> DSA Performance
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-white">{data?.dsa?.solved || 0}</p>
                    <p className="text-xs text-gray-400">Solved</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-white">{data?.dsa?.attempted || 0}</p>
                    <p className="text-xs text-gray-400">Attempted</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-emerald-400">
                      {data?.dsa?.difficultyBreakdown?.Easy || 0}
                    </p>
                    <p className="text-xs text-gray-400">Easy</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-yellow-400">
                      {data?.dsa?.difficultyBreakdown?.Medium || 0}
                    </p>
                    <p className="text-xs text-gray-400">Medium</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-red-400">
                      {data?.dsa?.difficultyBreakdown?.Hard || 0}
                    </p>
                    <p className="text-xs text-gray-400">Hard</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-white">
                      {data?.dsa?.attempted
                        ? Math.round(((data?.dsa?.solved || 0) / data.dsa.attempted) * 100)
                        : 0}
                      %
                    </p>
                    <p className="text-xs text-gray-400">Success Rate</p>
                  </div>
                </div>
              </div>

              {/* Recent Submissions */}
              {data?.dsa?.recentSubmissions?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">Recent Submissions</h3>
                  <div className="space-y-1">
                    {data.dsa.recentSubmissions.map((sub, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs px-3 py-2 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-white">{sub.problem?.title || "Problem"}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] ${
                              sub.problem?.difficulty === "Easy"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : sub.problem?.difficulty === "Medium"
                                ? "bg-yellow-500/20 text-yellow-300"
                                : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {sub.problem?.difficulty}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">{sub.language}</span>
                          <span
                            className={
                              sub.status === "Accepted" ? "text-emerald-400" : "text-red-400"
                            }
                          >
                            {sub.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interview Stats */}
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                  <Mic className="w-4 h-4 text-purple-400" /> Interview Performance
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-white">{data?.interviews?.total || 0}</p>
                    <p className="text-xs text-gray-400">Total Interviews</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-white">
                      {data?.interviews?.avgScore ?? "—"}
                    </p>
                    <p className="text-xs text-gray-400">Avg Score</p>
                  </div>
                </div>

                {/* Interview Sessions */}
                {data?.interviews?.sessions?.length > 0 ? (
                  <div className="space-y-2">
                    {data.interviews.sessions.map((session) => {
                      const report = session.report;
                      const isExpanded = expandedSession === session._id;
                      return (
                        <div
                          key={session._id}
                          className="bg-white/5 border border-white/10 rounded-lg overflow-hidden"
                        >
                          <div
                            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors"
                            onClick={() => setExpandedSession(isExpanded ? null : session._id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col">
                                <span className="text-sm text-white font-medium">
                                  {session.candidateInfo?.position || session.interviewMode || "Interview"}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(session.createdAt).toLocaleDateString()} &middot;{" "}
                                  {session.completedRounds?.length || 0} rounds
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {report && (
                                <>
                                  <span
                                    className={`text-sm font-bold ${
                                      report.overallScore >= 70
                                        ? "text-emerald-400"
                                        : report.overallScore >= 50
                                        ? "text-yellow-400"
                                        : "text-red-400"
                                    }`}
                                  >
                                    {report.overallScore}/100
                                  </span>
                                  {report.hiringRecommendation?.decision && (
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-[10px] border ${
                                        HIRING_BADGE[report.hiringRecommendation.decision] ||
                                        ""
                                      }`}
                                    >
                                      {HIRING_LABEL[report.hiringRecommendation.decision]}
                                    </span>
                                  )}
                                </>
                              )}
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              )}
                            </div>
                          </div>

                          {isExpanded && report && (
                            <div className="px-4 pb-4 border-t border-gray-800 pt-3 space-y-3">
                              {/* Round scores */}
                              {report.roundAnalysis?.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-gray-400 mb-2">
                                    Round Scores
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {report.roundAnalysis.map((r, i) => (
                                      <div
                                        key={i}
                                        className="px-3 py-1.5 bg-gray-800 rounded-lg text-xs"
                                      >
                                        <span className="text-gray-400">
                                          {r.round?.replace(/_/g, " ")}:{" "}
                                        </span>
                                        <span
                                          className={`font-bold ${
                                            r.score >= 70
                                              ? "text-emerald-400"
                                              : r.score >= 50
                                              ? "text-yellow-400"
                                              : "text-red-400"
                                          }`}
                                        >
                                          {r.score}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Strengths */}
                              {report.strengths?.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-emerald-400 mb-1">
                                    Strengths
                                  </p>
                                  <ul className="text-xs text-gray-300 space-y-0.5">
                                    {report.strengths.slice(0, 3).map((s, i) => (
                                      <li key={i}>+ {s}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Improvements */}
                              {report.improvementsNeeded?.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-red-400 mb-1">
                                    Needs Improvement
                                  </p>
                                  <ul className="text-xs text-gray-300 space-y-0.5">
                                    {report.improvementsNeeded.slice(0, 3).map((s, i) => (
                                      <li key={i}>- {s}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Download */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadReport(session._id);
                                }}
                                disabled={downloading === session._id}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg transition-colors text-sm font-medium"
                              >
                                {downloading === session._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Download className="w-4 h-4" />
                                )}
                                Download Report PDF
                              </button>
                            </div>
                          )}

                          {isExpanded && !report && (
                            <div className="px-4 pb-3 border-t border-gray-800 pt-3">
                              <p className="text-xs text-gray-500">
                                Report not yet generated for this session.
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No interviews completed yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function OrgMemberAnalytics() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const orgId = user?.organization?.orgId;

  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [org, setOrg] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [page, setPage] = useState(1);

  // Detail modal
  const [selectedMember, setSelectedMember] = useState(null);

  // Fetch org info
  useEffect(() => {
    if (!orgId) return;
    organizationService.get(orgId).then((res) => setOrg(res.data?.organization)).catch(() => {});
  }, [orgId]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch analytics
  const fetchAnalytics = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      if (deptFilter) params.department = deptFilter;
      if (batchFilter) params.batch = batchFilter;

      const res = await organizationService.getMembersAnalytics(orgId, params);
      setMembers(res.data?.members || []);
      setPagination(res.data?.pagination || { page: 1, pages: 1, total: 0 });
      setStats(res.data?.aggregateStats || null);
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  }, [orgId, page, search, deptFilter, batchFilter]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Guard
  if (!orgId) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <p className="text-gray-400">No organization found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-400" /> Member Analytics
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {org?.name || "Organization"} &middot; Complete student performance data
            </p>
          </div>
        </div>

        {/* Aggregate Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <AggregateStat
              label="Total Students"
              value={stats.totalMembers}
              icon={Users}
              color="from-blue-500/20 to-cyan-500/20 border-blue-400/25"
            />
            <AggregateStat
              label="Total DSA Solved"
              value={stats.totalDSASolved}
              icon={Code2}
              color="from-emerald-500/20 to-teal-500/20 border-emerald-400/25"
            />
            <AggregateStat
              label="Total Interviews"
              value={stats.totalInterviewsCompleted}
              icon={Mic}
              color="from-purple-500/20 to-violet-500/20 border-purple-400/25"
            />
            <AggregateStat
              label="Avg Interview Score"
              value={stats.avgInterviewScore ? `${stats.avgInterviewScore}/100` : "—"}
              icon={TrendingUp}
              color="from-amber-500/20 to-orange-500/20 border-amber-400/25"
            />
          </div>
        )}

        {/* DSA Difficulty + Hiring Breakdown */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* DSA Difficulty */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                <Code2 className="w-4 h-4" /> DSA Difficulty Breakdown
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.dsaDifficultyBreakdown || {}).map(([diff, count]) => (
                  <span
                    key={diff}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                      diff === "Easy"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : diff === "Medium"
                        ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {diff}: <strong>{count}</strong>
                  </span>
                ))}
                {Object.keys(stats.dsaDifficultyBreakdown || {}).length === 0 && (
                  <span className="text-gray-500 text-sm">No data yet</span>
                )}
              </div>
            </div>

            {/* Hiring Breakdown */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4" /> Hiring Recommendations
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.hiringBreakdown || {}).map(([decision, count]) => (
                  <span
                    key={decision}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                      HIRING_BADGE[decision] || "bg-gray-500/20 text-gray-300 border-gray-500/30"
                    }`}
                  >
                    {HIRING_LABEL[decision] || decision}: <strong>{count}</strong>
                  </span>
                ))}
                {Object.keys(stats.hiringBreakdown || {}).length === 0 && (
                  <span className="text-gray-500 text-sm">No data yet</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-400" /> Students
            <span className="text-sm font-normal text-gray-500">
              ({pagination.total})
            </span>
          </h2>

          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search students..."
                className="pl-9 pr-3 py-2 w-48 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>

            {org?.structure?.departments?.length > 0 && (
              <select
                value={deptFilter}
                onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
                className="px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Depts</option>
                {org.structure.departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            )}

            {org?.structure?.batches?.length > 0 && (
              <select
                value={batchFilter}
                onChange={(e) => { setBatchFilter(e.target.value); setPage(1); }}
                className="px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Batches</option>
                {org.structure.batches.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            )}

            <button
              onClick={fetchAnalytics}
              className="p-2 text-gray-500 hover:text-emerald-400 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No students found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-500 text-left">
                    <th className="px-4 py-3 font-medium">Student</th>
                    <th className="px-4 py-3 font-medium hidden sm:table-cell">Dept</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">Batch</th>
                    <th className="px-4 py-3 font-medium text-center">DSA Solved</th>
                    <th className="px-4 py-3 font-medium text-center">Interviews</th>
                    <th className="px-4 py-3 font-medium text-center hidden sm:table-cell">
                      Avg Score
                    </th>
                    <th className="px-4 py-3 font-medium text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {members.map((m) => (
                    <tr
                      key={m._id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-bold uppercase">
                            {m.avatar ? (
                              <img
                                src={m.avatar}
                                alt=""
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              m.name?.charAt(0) || "?"
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium">{m.name}</p>
                            <p className="text-gray-500 text-xs">{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">
                        {m.organization?.department || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-400 hidden md:table-cell">
                        {m.organization?.batch || "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-white font-semibold">
                          {m.analytics?.dsaSolved || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-white font-semibold">
                          {m.analytics?.totalInterviews || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center hidden sm:table-cell">
                        {m.analytics?.avgInterviewScore != null ? (
                          <span
                            className={`font-semibold ${
                              m.analytics.avgInterviewScore >= 70
                                ? "text-emerald-400"
                                : m.analytics.avgInterviewScore >= 50
                                ? "text-yellow-400"
                                : "text-red-400"
                            }`}
                          >
                            {m.analytics.avgInterviewScore}
                          </span>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() =>
                            setSelectedMember({ id: m._id, name: m.name })
                          }
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 rounded-lg transition-colors text-xs font-medium"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
              <span className="text-xs text-gray-500">
                Page {pagination.page} of {pagination.pages}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-1.5 text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page >= pagination.pages}
                  className="p-1.5 text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <MemberDetailModal
          orgId={orgId}
          memberId={selectedMember.id}
          memberName={selectedMember.name}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </Layout>
  );
}
