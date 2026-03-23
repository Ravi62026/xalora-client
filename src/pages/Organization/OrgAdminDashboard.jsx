import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  BarChart3,
  Building2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  Mail,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { Layout } from "../../components";
import organizationService from "../../services/organizationService";
import StudentImportPanel from "../../components/Organization/StudentImportPanel";
import CandidateImportPanel from "../../components/Organization/CandidateImportPanel";
import AcademicFilters from "../../components/Organization/AcademicFilters";

const inputClass =
  "rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500";

export default function OrgAdminDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const orgId = user?.organization?.orgId;
  const isSuperAdmin = user?.organization?.role === "super_admin";
  const isAdmin = isSuperAdmin || user?.organization?.role === "admin";

  const [org, setOrg] = useState(null);
  const [stats, setStats] = useState(null);
  const [team, setTeam] = useState([]);
  const [members, setMembers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filterOptions, setFilterOptions] = useState({ degreeTypes: [] });
  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(false);
  const [invites, setInvites] = useState([]);
  const [invitesLoading, setInvitesLoading] = useState(false);
  const [showInvites, setShowInvites] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [degreeTypeFilter, setDegreeTypeFilter] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [page, setPage] = useState(1);

  const isCollege = org?.type === "college";

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchContext = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const [orgRes, statsRes, teamRes] = await Promise.all([
        organizationService.get(orgId),
        organizationService.getStats(orgId),
        organizationService.getTeam(orgId),
      ]);
      const organization = orgRes.data?.organization || null;
      setOrg(organization);
      setStats(statsRes.data || null);
      setTeam(teamRes.data?.team || []);
      if (organization?.type === "college") {
        const filterRes = await organizationService.getCollegeFilterOptions(orgId);
        setFilterOptions(filterRes.data || { degreeTypes: [] });
      } else {
        setFilterOptions({ degreeTypes: [] });
      }
    } catch (error) {
      console.error("Failed to load org dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  const fetchMembers = useCallback(async () => {
    if (!orgId || !org) return;
    setMembersLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (isCollege) {
        if (degreeTypeFilter) params.degreeType = degreeTypeFilter;
        if (programFilter) params.program = programFilter;
      }

      const response = await organizationService.getMembers(orgId, params);
      setMembers(response.data?.members || []);
      setPagination(response.data?.pagination || { page: 1, pages: 1, total: 0 });
    } catch (error) {
      console.error("Failed to load members:", error);
    } finally {
      setMembersLoading(false);
    }
  }, [
    orgId,
    org,
    page,
    search,
    statusFilter,
    isCollege,
    degreeTypeFilter,
    programFilter,
  ]);

  useEffect(() => {
    fetchContext();
  }, [fetchContext]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const fetchInvites = useCallback(async () => {
    if (!orgId || !isAdmin) return;
    setInvitesLoading(true);
    try {
      const response = await organizationService.getInvites(orgId, { status: "pending", limit: 50 });
      setInvites(response.data?.invites || []);
    } catch (error) {
      console.error("Failed to load invites:", error);
    } finally {
      setInvitesLoading(false);
    }
  }, [orgId, isAdmin]);

  useEffect(() => {
    if (showInvites) fetchInvites();
  }, [showInvites, fetchInvites]);

  const handleRevokeInvite = async (inviteId) => {
    if (!window.confirm("Revoke this invite?")) return;
    try {
      await organizationService.revokeInvite(orgId, inviteId);
      fetchInvites();
      fetchContext();
    } catch (error) {
      window.alert(error?.response?.data?.message || "Failed to revoke invite");
    }
  };

  const refreshAll = async () => {
    await Promise.all([fetchContext(), fetchMembers(), fetchInvites()]);
  };

  const handleStatusChange = async (memberId, nextStatus) => {
    try {
      await organizationService.updateMemberStatus(orgId, memberId, nextStatus);
      fetchMembers();
    } catch (error) {
      window.alert(error?.response?.data?.message || "Failed to update status");
    }
  };

  const handleRemoveMember = async (memberId, memberName) => {
    if (!window.confirm(`Remove ${memberName} from the organization?`)) return;
    try {
      await organizationService.removeMember(orgId, memberId);
      refreshAll();
    } catch (error) {
      window.alert(error?.response?.data?.message || "Failed to remove member");
    }
  };

  if (!orgId) {
    return (
      <Layout>
        <div className="flex min-h-[80vh] items-center justify-center px-4 text-center">
          <div>
            <Building2 className="mx-auto mb-4 h-12 w-12 text-gray-600" />
            <p className="text-gray-400">No organization found.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[80vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
              <Building2 className="h-6 w-6 text-emerald-400" />
              {org?.name || "Organization"}
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              {org?.type} • {org?.slug}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate("/org/members")}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-200 hover:border-emerald-500/40 hover:text-emerald-300"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={() => setShowInviteModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
              >
                <UserPlus className="h-4 w-4" />
                Invite Members
              </button>
            )}
          </div>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-4">
          <StatCard label="Total Members" value={stats?.totalMembers ?? 0} icon={Users} />
          <StatCard label="Active Members" value={stats?.activeMembers ?? 0} icon={CheckCircle} />
          <StatCard label="Seats" value={`${stats?.usedSeats ?? 0}/${stats?.totalSeats ?? 0}`} icon={BarChart3} />
          <button
            type="button"
            onClick={() => setShowInvites((v) => !v)}
            className="text-left"
          >
            <StatCard
              label="Pending Invites"
              value={stats?.pendingInvites ?? 0}
              icon={Mail}
              highlight={showInvites}
            />
          </button>
        </div>

        {showInvites && (
          <PendingInvitesSection
            invites={invites}
            loading={invitesLoading}
            isCollege={isCollege}
            onRevoke={handleRevokeInvite}
            onRefresh={fetchInvites}
          />
        )}

        {isCollege ? (
          <div className="mb-6 grid gap-6 xl:grid-cols-[1.15fr_1fr]">
            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold text-white">Academic Structure</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {(org?.academicStructure?.degreeTypes || []).map((degreeType) => (
                  <div
                    key={degreeType.value}
                    className="rounded-xl border border-white/10 bg-gray-900/40 p-4"
                  >
                    <p className="font-medium text-white">{degreeType.label}</p>
                    <p className="mt-2 text-sm text-gray-400">
                      {(degreeType.programs || []).map((program) => program.label).join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </section>
            {isAdmin && (
              <StudentImportPanel
                orgId={orgId}
                onImported={refreshAll}
              />
            )}
          </div>
        ) : isAdmin ? (
          <div className="mb-6">
            <CandidateImportPanel orgId={orgId} onImported={refreshAll} />
          </div>
        ) : null}

        <div className="mb-6 grid gap-4 lg:grid-cols-2">
          <BreakdownCard
            title={isCollege ? "Degree Type Breakdown" : "Position Breakdown"}
            items={isCollege ? stats?.degreeTypeBreakdown || [] : stats?.positionBreakdown || []}
          />
          <BreakdownCard
            title={isCollege ? "Program Breakdown" : "Plan"}
            items={
              isCollege
                ? stats?.programBreakdown || []
                : [{ _id: stats?.plan || "free", count: stats?.subscriptionStatus || "trial" }]
            }
          />
        </div>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Members</h2>
              <p className="text-sm text-gray-400">{pagination.total} records</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search members"
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
              ) : null}

              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
                className={inputClass}
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                {isCollege && <option value="graduated">Graduated</option>}
              </select>

              <button
                type="button"
                onClick={refreshAll}
                className="inline-flex items-center justify-center rounded-lg border border-gray-700 px-3 py-2 text-gray-400 hover:border-emerald-500/40 hover:text-emerald-300"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <MemberTable
            isCollege={isCollege}
            isAdmin={isAdmin}
            members={members}
            membersLoading={membersLoading}
            onStatusChange={handleStatusChange}
            onRemoveMember={handleRemoveMember}
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

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <Shield className="h-5 w-5 text-emerald-400" />
            {isCollege ? "Org Team" : "Team"}
          </h2>
          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-950 text-gray-400">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {team.map((entry) => (
                  <tr key={entry.user?._id || entry.user?.email} className="bg-white/5 text-white">
                    <td className="px-4 py-3">
                      <p className="font-medium">{entry.user?.name || "—"}</p>
                      <p className="text-xs text-gray-500">{entry.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 capitalize text-gray-300">
                      {String(entry.role || "").replace("_", " ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {showInviteModal && (
          <InviteModal
            org={org}
            isSuperAdmin={isSuperAdmin}
            onClose={() => setShowInviteModal(false)}
            onComplete={async () => {
              setShowInviteModal(false);
              await refreshAll();
            }}
          />
        )}
      </div>
    </Layout>
  );
}

function StatCard({ label, value, icon: Icon, highlight }) {
  return (
    <div className={`rounded-2xl border p-4 ${highlight ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/10 bg-white/5"}`}>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs text-gray-500">{label}</p>
        <Icon className={`h-4 w-4 ${highlight ? "text-emerald-400" : "text-gray-500"}`} />
      </div>
      <p className="text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function BreakdownCard({ title, items = [] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.length === 0 ? (
          <span className="text-sm text-gray-500">No data yet</span>
        ) : (
          items.map((item) => (
            <span
              key={`${item._id}-${item.count}`}
              className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-gray-200"
            >
              {item._id || "Unassigned"}: <strong>{item.count}</strong>
            </span>
          ))
        )}
      </div>
    </section>
  );
}

function MemberTable({
  isCollege,
  isAdmin,
  members,
  membersLoading,
  onStatusChange,
  onRemoveMember,
}) {
  if (membersLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (members.length === 0) {
    return <div className="py-16 text-center text-sm text-gray-400">No members found.</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-950 text-gray-400">
          <tr>
            <th className="px-4 py-3">Member</th>
            <th className="px-4 py-3">{isCollege ? "Degree Type" : "Position"}</th>
            <th className="px-4 py-3">{isCollege ? "Program" : "Rounds"}</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Joined</th>
            {isAdmin && <th className="px-4 py-3">Actions</th>}
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
                  : member.organization?.position || "—"}
              </td>
              <td className="px-4 py-3 text-gray-300">
                {isCollege
                  ? member.organization?.programLabel || "—"
                  : (member.organization?.interviewRounds || []).join(", ") || "—"}
              </td>
              <td className="px-4 py-3">
                {isAdmin ? (
                  <select
                    value={member.organization?.status || "active"}
                    onChange={(event) => onStatusChange(member._id, event.target.value)}
                    className={inputClass}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                    {isCollege && <option value="graduated">Graduated</option>}
                  </select>
                ) : (
                  <span className="text-gray-300">{member.organization?.status || "active"}</span>
                )}
              </td>
              <td className="px-4 py-3 text-gray-400">
                {member.organization?.joinedAt
                  ? new Date(member.organization.joinedAt).toLocaleDateString()
                  : "—"}
              </td>
              {isAdmin && (
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onRemoveMember(member._id, member.name)}
                    className="rounded-lg p-2 text-gray-500 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InviteModal({ org, isSuperAdmin, onClose, onComplete }) {
  const isCollege = org?.type === "college";
  const degreeTypes = org?.academicStructure?.degreeTypes || [];
  const emptyRow = {
    name: "",
    email: "",
    role: "member",
    degreeType: "",
    program: "",
    position: "",
    interviewRounds: "",
  };
  const [rows, setRows] = useState([{ ...emptyRow }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const updateRow = (index, updates) => {
    setRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, ...updates } : row
      )
    );
  };

  const sendInvites = async () => {
    setLoading(true);
    setError("");
    try {
      const members = rows.filter((row) => row.email.trim()).map((row) => {
        if (row.role === "admin") {
          return {
            name: row.name.trim() || undefined,
            email: row.email.trim(),
            role: row.role,
          };
        }

        return isCollege
          ? {
              name: row.name.trim() || undefined,
              email: row.email.trim(),
              role: "member",
              degreeType: row.degreeType,
              program: row.program,
            }
          : {
              name: row.name.trim() || undefined,
              email: row.email.trim(),
              role: "member",
              position: row.position,
              interviewRounds: row.interviewRounds
                ? row.interviewRounds.split(",").map((r) => r.trim())
                : ["technical"],
            };
      });

      console.log(`[MANUAL-INVITE] Sending invites to ${members.length} member(s)`, members);
      const response = await organizationService.inviteMembers(org._id, members);
      console.log(`[MANUAL-INVITE-RESULT] Response:`, response);
      setResult(response.data || null);
    } catch (error) {
      console.error(`[MANUAL-INVITE-ERROR] ❌ Failed to send invites:`, error);
      setError(error?.response?.data?.message || "Failed to send invites");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-4xl rounded-2xl border border-white/10 bg-gray-950 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Invite Members</h2>
            <p className="text-sm text-gray-400">
              Use this for small additions. Bulk onboarding should use the import panel.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300 hover:border-gray-500 hover:text-white"
          >
            Close
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {result ? (
          <div className="space-y-4">
            {(result.sent || []).length > 0 && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
                <p className="mb-2 text-sm font-medium text-emerald-300">
                  Sent ({result.sent.length})
                </p>
                <ul className="space-y-1 text-sm text-emerald-200">
                  {result.sent.map((item) => (
                    <li key={item.email}>
                      <span className="font-medium">{item.email}</span>
                      {item.name ? ` (${item.name})` : ""}
                      {" — "}
                      <span className="capitalize">{item.role || "member"}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {(result.skipped || []).length > 0 && (
              <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
                <p className="mb-2 text-sm font-medium text-yellow-300">
                  Skipped ({result.skipped.length})
                </p>
                <ul className="space-y-2 text-sm text-yellow-200">
                  {result.skipped.map((item) => (
                    <li key={item.email} className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-3 py-2">
                      <div className="flex items-baseline gap-2">
                        <span className="font-medium">{item.email}</span>
                        {item.name && <span className="text-xs text-yellow-300/70">({item.name})</span>}
                      </div>
                      <p className="mt-0.5 text-xs text-yellow-300/80">{item.reason}</p>
                      {item.detail?.type === "org_member" && (
                        <p className="mt-0.5 text-xs text-yellow-300/60">
                          Org: {item.detail.orgName} &middot; Role: <span className="capitalize">{item.detail.role || "member"}</span>
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {(result.failed || []).length > 0 && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                <p className="mb-2 text-sm font-medium text-red-300">
                  Failed ({result.failed.length})
                </p>
                <ul className="space-y-1 text-sm text-red-200">
                  {result.failed.map((item) => (
                    <li key={item.email}>
                      <span className="font-medium">{item.email}</span>
                      {" — "}{item.reason || "Unknown error"}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              type="button"
              onClick={() => onComplete?.()}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
            >
              Done
            </button>
          </div>
        ) : (
        <>
        <div className="space-y-3">
          {rows.map((row, index) => {
            const selectedDegreeType = degreeTypes.find(
              (degreeType) => degreeType.value === row.degreeType
            );
            const programs = selectedDegreeType?.programs || [];

            return (
              <div
                key={`invite-row-${index}`}
                className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:grid-cols-6"
              >
                <input
                  value={row.name}
                  onChange={(event) => updateRow(index, { name: event.target.value })}
                  placeholder="Name"
                  className={inputClass}
                />
                <input
                  value={row.email}
                  onChange={(event) => updateRow(index, { email: event.target.value })}
                  placeholder="Email"
                  className={inputClass}
                />
                <select
                  value={row.role}
                  onChange={(event) =>
                    updateRow(index, {
                      role: event.target.value,
                      degreeType: "",
                      program: "",
                      position: "",
                      interviewRounds: "",
                    })
                  }
                  className={inputClass}
                >
                  <option value="member">{isCollege ? "Student" : "Candidate"}</option>
                  {isSuperAdmin && <option value="admin">Admin</option>}
                </select>

                {row.role === "member" && isCollege && (
                  <>
                    <select
                      value={row.degreeType}
                      onChange={(event) =>
                        updateRow(index, { degreeType: event.target.value, program: "" })
                      }
                      className={inputClass}
                    >
                      <option value="">Degree Type</option>
                      {degreeTypes.map((degreeType) => (
                        <option key={degreeType.value} value={degreeType.value}>
                          {degreeType.label}
                        </option>
                      ))}
                    </select>
                    <select
                      value={row.program}
                      onChange={(event) => updateRow(index, { program: event.target.value })}
                      className={inputClass}
                    >
                      <option value="">Program</option>
                      {programs.map((program) => (
                        <option key={program.value} value={program.label}>
                          {program.label}
                        </option>
                      ))}
                    </select>
                  </>
                )}

                {row.role === "member" && !isCollege && (
                  <>
                    <input
                      value={row.position}
                      onChange={(event) => updateRow(index, { position: event.target.value })}
                      placeholder="Position (e.g., Frontend Dev)"
                      className={inputClass}
                    />
                    <input
                      value={row.interviewRounds}
                      onChange={(event) => updateRow(index, { interviewRounds: event.target.value })}
                      placeholder="Rounds (technical,coding)"
                      className={inputClass}
                      title="Comma-separated: formal_qa, technical, coding, system_design, behavioral, resume_deep_dive, jd_based"
                    />
                  </>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setRows((current) =>
                      current.length === 1
                        ? current
                        : current.filter((_, rowIndex) => rowIndex !== index)
                    )
                  }
                  className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300 hover:border-red-500/40 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              setRows((current) => [
                ...current,
                { ...emptyRow },
              ])
            }
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-200 hover:border-emerald-500/40 hover:text-emerald-300"
          >
            Add Row
          </button>
          <button
            type="button"
            onClick={sendInvites}
            disabled={loading}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Invites"}
          </button>
        </div>
        </>
        )}
      </div>
    </div>
  );
}

function PendingInvitesSection({ invites, loading, isCollege, onRevoke, onRefresh }) {
  if (loading) {
    return (
      <section className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
        </div>
      </section>
    );
  }

  return (
    <section className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Clock className="h-5 w-5 text-yellow-400" />
          Pending Invites ({invites.length})
        </h2>
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-lg border border-gray-700 p-2 text-gray-400 hover:text-emerald-300"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {invites.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-500">No pending invites.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-950 text-gray-400">
              <tr>
                <th className="px-4 py-3">Sent To</th>
                <th className="px-4 py-3">Role</th>
                {isCollege && <th className="px-4 py-3">Degree / Program</th>}
                <th className="px-4 py-3">Invited By</th>
                <th className="px-4 py-3">Sent On</th>
                <th className="px-4 py-3">Expires</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {invites.map((invite) => (
                <tr key={invite._id} className="bg-white/5 text-white">
                  <td className="px-4 py-3">
                    <p className="font-medium">{invite.name || "—"}</p>
                    <p className="text-xs text-gray-500">{invite.email}</p>
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-300">
                    {String(invite.role || "member").replace("_", " ")}
                  </td>
                  {isCollege && (
                    <td className="px-4 py-3 text-gray-300">
                      {invite.degreeTypeLabel || "—"} / {invite.programLabel || "—"}
                    </td>
                  )}
                  <td className="px-4 py-3 text-gray-400">
                    {invite.invitedBy?.name || invite.invitedBy?.email || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {invite.createdAt
                      ? new Date(invite.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {invite.expiresAt
                      ? new Date(invite.expiresAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onRevoke(invite._id)}
                      className="rounded-lg p-2 text-gray-500 hover:text-red-300"
                      title="Revoke invite"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
