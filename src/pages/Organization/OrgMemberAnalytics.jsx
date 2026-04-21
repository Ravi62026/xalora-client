import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Code2,
  Download,
  Eye,
  FileText,
  Loader2,
  Mic,
  RefreshCw,
  Search,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { Layout } from "../../components";
import organizationService from "../../services/organizationService";
import AcademicFilters from "../../components/Organization/AcademicFilters";
import { getActiveWorkspace } from "../../utils/workspace";

const inputClass =
  "rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500";

export default function OrgMemberAnalytics() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const activeWorkspace = getActiveWorkspace(user);
  const orgId = activeWorkspace?.organization?._id || null;

  const [org, setOrg] = useState(null);
  const [filterOptions, setFilterOptions] = useState({ degreeTypes: [] });
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [degreeTypeFilter, setDegreeTypeFilter] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [minScoreFilter, setMinScoreFilter] = useState("");
  const [minInterviewsFilter, setMinInterviewsFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMember, setSelectedMember] = useState(null);
  const [exporting, setExporting] = useState(false);

  const isCollege = org?.type === "college";

  const loadOrganizationContext = useCallback(async () => {
    if (!orgId) return;

    try {
      const orgRes = await organizationService.get(orgId);
      const organization = orgRes.data?.organization || null;
      setOrg(organization);

      if (organization?.type === "college") {
        const filterRes = await organizationService.getCollegeFilterOptions(orgId);
        setFilterOptions(filterRes.data || { degreeTypes: [] });
      } else {
        setFilterOptions({ degreeTypes: [] });
      }
    } catch (error) {
      console.error("Failed to load organization:", error);
    }
  }, [orgId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    loadOrganizationContext();
  }, [loadOrganizationContext]);

  const buildAnalyticsParams = useCallback(
    (includePagination = true) => {
      const params = {};
      if (includePagination) {
        params.page = page;
        params.limit = 20;
      }
      if (search) params.search = search;
      if (isCollege) {
        if (degreeTypeFilter) params.degreeType = degreeTypeFilter;
        if (programFilter) params.program = programFilter;
      } else {
        if (departmentFilter) params.department = departmentFilter;
        if (batchFilter) params.batch = batchFilter;
        if (minScoreFilter !== "") params.minScore = minScoreFilter;
        if (minInterviewsFilter !== "") params.minInterviews = minInterviewsFilter;
      }

      return params;
    },
    [
      page,
      search,
      isCollege,
      degreeTypeFilter,
      programFilter,
      departmentFilter,
      batchFilter,
      minScoreFilter,
      minInterviewsFilter,
    ]
  );

  const fetchAnalytics = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const response = await organizationService.getMembersAnalytics(
        orgId,
        buildAnalyticsParams(true)
      );
      setMembers(response.data?.members || []);
      setStats(response.data?.aggregateStats || null);
      setPagination(response.data?.pagination || { page: 1, pages: 1, total: 0 });
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [orgId, buildAnalyticsParams]);

  const exportAnalytics = async () => {
    if (!orgId || exporting) return;

    setExporting(true);
    try {
      const response = await organizationService.exportMembersAnalytics(
        orgId,
        buildAnalyticsParams(false)
      );
      const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const safeOrgName = (org?.name || "organization")
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase();

      link.href = url;
      link.download = `${safeOrgName || "organization"}-member-analytics.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export analytics:", error);
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (!orgId) {
    return (
      <Layout>
        <div className="flex min-h-[80vh] items-center justify-center px-4">
          <p className="text-gray-400">No organization found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg border border-gray-700 p-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
              <Users className="h-6 w-6 text-emerald-400" />
              Member Analytics
            </h1>
            <p className="text-sm text-gray-400">{org?.name || "Organization"}</p>
          </div>
        </div>

        {stats && (
          <div className="mb-6 grid gap-3 sm:grid-cols-4">
            <StatCard label="Total Students" value={stats.totalMembers} icon={Users} />
            <StatCard label="DSA Solved" value={stats.totalDSASolved} icon={Code2} />
            <StatCard label="Interviews" value={stats.totalInterviewsCompleted} icon={Mic} />
            <StatCard
              label="Avg Score"
              value={
                stats.avgInterviewScore !== null && stats.avgInterviewScore !== undefined
                  ? `${stats.avgInterviewScore}/100`
                  : "--"
              }
              icon={TrendingUp}
            />
          </div>
        )}

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Students</h2>
              <p className="text-sm text-gray-400">{pagination.total} records</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search students"
                  className="w-52 rounded-lg border border-gray-700 bg-gray-900 py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {isCollege ? (
                <AcademicFilters
                  degreeTypes={filterOptions.degreeTypes || []}
                  degreeTypeValue={degreeTypeFilter}
                  programValue={programFilter}
                  onDegreeTypeChange={(value) => {
                    setDegreeTypeFilter(value);
                    setProgramFilter("");
                    setPage(1);
                  }}
                  onProgramChange={(value) => {
                    setProgramFilter(value);
                    setPage(1);
                  }}
                />
              ) : (
                <>
                  {(org?.structure?.departments || []).length > 0 && (
                    <select
                      value={departmentFilter}
                      onChange={(event) => {
                        setDepartmentFilter(event.target.value);
                        setPage(1);
                      }}
                      className={inputClass}
                    >
                      <option value="">All Departments</option>
                      {(org?.structure?.departments || []).map((department) => (
                        <option key={department} value={department}>
                          {department}
                        </option>
                      ))}
                    </select>
                  )}
                  {(org?.structure?.batches || []).length > 0 && (
                    <select
                      value={batchFilter}
                      onChange={(event) => {
                        setBatchFilter(event.target.value);
                        setPage(1);
                      }}
                      className={inputClass}
                    >
                      <option value="">All Batches</option>
                      {(org?.structure?.batches || []).map((batch) => (
                        <option key={batch} value={batch}>
                          {batch}
                        </option>
                      ))}
                    </select>
                  )}
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={minScoreFilter}
                    onChange={(event) => {
                      setMinScoreFilter(event.target.value);
                      setPage(1);
                    }}
                    placeholder="Min score"
                    className="w-28 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="number"
                    min="0"
                    value={minInterviewsFilter}
                    onChange={(event) => {
                      setMinInterviewsFilter(event.target.value);
                      setPage(1);
                    }}
                    placeholder="Min interviews"
                    className="w-36 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                  />
                </>
              )}

              {!isCollege && (
                <button
                  type="button"
                  onClick={exportAnalytics}
                  disabled={exporting}
                  className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-600/10 px-3 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-600/20 disabled:opacity-50"
                >
                  {exporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Export CSV
                </button>
              )}

              <button
                type="button"
                onClick={fetchAnalytics}
                className="inline-flex items-center justify-center rounded-lg border border-gray-700 px-3 py-2 text-gray-400 hover:border-emerald-500/40 hover:text-emerald-300"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <AnalyticsTable
            isCollege={isCollege}
            members={members}
            loading={loading}
            onSelectMember={setSelectedMember}
          />

          {pagination.pages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Page {pagination.page} of {pagination.pages}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-gray-700 p-2 text-gray-400 hover:text-white disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(pagination.pages, current + 1))}
                  disabled={page >= pagination.pages}
                  className="rounded-lg border border-gray-700 p-2 text-gray-400 hover:text-white disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </section>

        {selectedMember && (
          <MemberDetailModal
            orgId={orgId}
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
            isCollege={isCollege}
          />
        )}
      </div>
    </Layout>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs text-gray-500">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-gray-500" aria-hidden="true" />}
      </div>
      <p className="text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function AnalyticsTable({ isCollege, members, loading, onSelectMember }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (members.length === 0) {
    return <div className="py-16 text-center text-sm text-gray-400">No students found.</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-950 text-gray-400">
          <tr>
            <th className="px-4 py-3">Student</th>
            <th className="px-4 py-3">{isCollege ? "Degree Type" : "Department"}</th>
            <th className="px-4 py-3">{isCollege ? "Program" : "Batch"}</th>
            <th className="px-4 py-3 text-center">DSA Solved</th>
            <th className="px-4 py-3 text-center">Interviews</th>
            <th className="px-4 py-3 text-center">Avg Score</th>
            <th className="px-4 py-3 text-center">Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {members.map((member) => (
            <tr key={member._id} className="bg-white/5 text-white">
              <td className="px-4 py-3">
                <p className="font-medium">{member.name}</p>
                <p className="text-xs text-gray-500">{member.email}</p>
              </td>
              <td className="px-4 py-3 text-gray-300">
                {isCollege
                  ? member.organization?.degreeTypeLabel || "—"
                  : member.organization?.department || "—"}
              </td>
              <td className="px-4 py-3 text-gray-300">
                {isCollege
                  ? member.organization?.programLabel || "—"
                  : member.organization?.batch || "—"}
              </td>
              <td className="px-4 py-3 text-center">{member.analytics?.dsaSolved || 0}</td>
              <td className="px-4 py-3 text-center">{member.analytics?.totalInterviews || 0}</td>
              <td className="px-4 py-3 text-center">
                {member.analytics?.avgInterviewScore ?? "—"}
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  type="button"
                  onClick={() => onSelectMember({ id: member._id, name: member.name })}
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600/20 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-600/40"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MemberDetailModal({ orgId, member, onClose, isCollege }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const response = await organizationService.getMemberAnalytics(orgId, member.id);
        setData(response.data || null);
      } catch (error) {
        console.error("Failed to load member analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [orgId, member.id]);

  const downloadReport = async (sessionId) => {
    const response = await organizationService.downloadMemberInterviewReport(
      orgId,
      member.id,
      sessionId
    );
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Interview_Report_${member.name.replace(/\\s+/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl border border-white/10 bg-gray-950 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">{member.name}</h2>
            <p className="text-sm text-gray-400">Detailed analytics</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-700 p-2 text-gray-300 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
          </div>
        ) : data ? (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge>{data.member?.email}</Badge>
              <Badge>
                {isCollege
                  ? data.member?.organization?.degreeTypeLabel || "No Degree"
                  : data.member?.organization?.department || "No Department"}
              </Badge>
              <Badge>
                {isCollege
                  ? data.member?.organization?.programLabel || "No Program"
                  : data.member?.organization?.batch || "No Batch"}
              </Badge>
              <Badge>{data.member?.organization?.status || "active"}</Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              <StatCard label="Solved" value={data.dsa?.solved || 0} icon={Code2} />
              <StatCard label="Attempted" value={data.dsa?.attempted || 0} icon={FileText} />
              <StatCard label="Interviews" value={data.interviews?.total || 0} icon={Mic} />
              <StatCard
                label="Avg Score"
                value={data.interviews?.avgScore ?? "—"}
                icon={TrendingUp}
              />
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-3 text-sm font-semibold text-white">Recent Interview Reports</h3>
              <div className="space-y-3">
                {(data.interviews?.sessions || []).map((session) => (
                  <div
                    key={session._id}
                    className="flex flex-col gap-3 rounded-lg border border-white/10 bg-gray-900/40 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-white">
                        {session.candidateInfo?.position || session.interviewMode || "Interview"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(session.createdAt).toLocaleDateString()} • Score{" "}
                        {session.report?.overallScore ?? "—"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => downloadReport(session._id)}
                      disabled={!session.report}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-200 hover:border-emerald-500/40 hover:text-emerald-300 disabled:opacity-40"
                    >
                      <Download className="h-4 w-4" />
                      Download PDF
                    </button>
                  </div>
                ))}
                {(data.interviews?.sessions || []).length === 0 && (
                  <p className="text-sm text-gray-500">No completed interviews yet.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="py-16 text-center text-gray-400">No analytics available.</p>
        )}
      </div>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-gray-300">
      {children}
    </span>
  );
}
