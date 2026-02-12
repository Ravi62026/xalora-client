import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  UserPlus,
  BarChart3,
  Mail,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Loader2,
  X,
  Plus,
  Trash2,
  Shield,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Settings,
} from "lucide-react";
import { Layout } from "../../components";
import organizationService from "../../services/organizationService";

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLE_BADGE = {
  super_admin: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  admin: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  manager: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  viewer: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  member: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

const STATUS_BADGE = {
  active: "bg-emerald-500/20 text-emerald-300",
  inactive: "bg-gray-500/20 text-gray-400",
  suspended: "bg-red-500/20 text-red-300",
  graduated: "bg-blue-500/20 text-blue-300",
};

const STATUS_ICON = {
  active: CheckCircle,
  inactive: XCircle,
  suspended: AlertTriangle,
  graduated: CheckCircle,
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, tone, onClick }) {
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`bg-gradient-to-br ${tone} rounded-xl border p-4 sm:p-5 ${onClick ? "hover:scale-[1.01] transition-transform cursor-pointer" : ""}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs sm:text-sm text-gray-400">{label}</span>
        <Icon className="w-4 h-4 text-gray-500" />
      </div>
      <p className="text-xl sm:text-2xl font-bold text-white">{value ?? "—"}</p>
    </Wrapper>
  );
}

// ─── Invite Modal ─────────────────────────────────────────────────────────────

function InviteModal({ orgId, onClose, onSuccess, departments, batches, orgType }) {
  const [rows, setRows] = useState([
    { email: "", name: "", inviteType: "member", department: "", batch: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const updateRow = (idx, field, val) => {
    setRows((prev) =>
      prev.map((r, i) => {
        if (i !== idx) return r;
        const next = { ...r, [field]: val };
        if (field === "inviteType" && val === "team") {
          next.department = "";
          next.batch = "";
        }
        return next;
      })
    );
  };

  const addRow = () => {
    if (rows.length >= 50) return;
    setRows((prev) => [
      ...prev,
      { email: "", name: "", inviteType: "member", department: "", batch: "" },
    ]);
  };

  const removeRow = (idx) => {
    if (rows.length === 1) return;
    setRows((prev) => prev.filter((_, i) => i !== idx));
  };

  const send = async () => {
    const members = rows
      .filter((r) => r.email.trim())
      .map((r) => ({
        email: r.email.trim(),
        name: r.name.trim() || undefined,
        role: r.inviteType === "team" ? "viewer" : "member",
        department: r.inviteType === "member" ? r.department : undefined,
        batch: r.inviteType === "member" ? r.batch : undefined,
      }));

    if (members.length === 0) return setError("Add at least one email");
    if (members.some((m) => m.role === "member" && (!m.department || !m.batch))) {
      return setError("Member invites require department and batch/year");
    }

    setLoading(true);
    setError("");
    try {
      const res = await organizationService.inviteMembers(orgId, members);
      setResult(res.data);
      onSuccess?.();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send invites");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-500 transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">Invite Team or Members</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          {result ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <p className="text-emerald-300 font-medium">
                  {result.sent?.length || 0} invite(s) sent successfully
                </p>
              </div>
              {result.skipped?.length > 0 && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-yellow-300 font-medium mb-1">Skipped:</p>
                  {result.skipped.map((s, i) => (
                    <p key={i} className="text-sm text-yellow-200">
                      {s.email} — {s.reason}
                    </p>
                  ))}
                </div>
              )}
              {result.failed?.length > 0 && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-300 font-medium mb-1">Failed:</p>
                  {result.failed.map((f, i) => (
                    <p key={i} className="text-sm text-red-200">
                      {f.email} — {f.reason}
                    </p>
                  ))}
                </div>
              )}
              <button
                onClick={onClose}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors font-medium"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {rows.map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 items-start"
                >
                  <div className="col-span-4">
                    <input
                      value={row.email}
                      onChange={(e) => updateRow(idx, "email", e.target.value)}
                      placeholder="Email *"
                      className={inputClass}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      value={row.name}
                      onChange={(e) => updateRow(idx, "name", e.target.value)}
                      placeholder="Name"
                      className={inputClass}
                    />
                  </div>
                  <div className="col-span-2">
                    <select
                      value={row.inviteType}
                      onChange={(e) => updateRow(idx, "inviteType", e.target.value)}
                      className={inputClass}
                    >
                      <option value="member">
                        {orgType === "college" ? "Student" : "Employee"}
                      </option>
                      <option value="team">Team (Read access)</option>
                    </select>
                  </div>
                  {row.inviteType === "member" ? (
                    <>
                      <div className="col-span-2">
                        <select
                          value={row.department}
                          onChange={(e) => updateRow(idx, "department", e.target.value)}
                          className={inputClass}
                        >
                          <option value="">
                            {orgType === "college" ? "Department" : "Department"}
                          </option>
                          {departments.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-1">
                        <select
                          value={row.batch}
                          onChange={(e) => updateRow(idx, "batch", e.target.value)}
                          className={inputClass}
                        >
                          <option value="">
                            {orgType === "college" ? "Year" : "Cohort"}
                          </option>
                          {batches.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-span-2" />
                      <div className="col-span-1" />
                    </>
                  )}
                  <div className="col-span-1 flex justify-center pt-1">
                    <button
                      onClick={() => removeRow(idx)}
                      disabled={rows.length === 1}
                      className="p-1.5 text-gray-500 hover:text-red-400 disabled:opacity-30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={addRow}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
              >
                <Plus className="w-4 h-4" /> Add another
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {!result && (
          <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={send}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg transition-colors font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" /> Send Invites
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function OrgAdminDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const orgId = user?.organization?.orgId;
  const orgRole = user?.organization?.role;

  const [org, setOrg] = useState(null);
  const [stats, setStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [team, setTeam] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(false);
  const [teamLoading, setTeamLoading] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const membersSectionRef = useRef(null);

  const isAdmin = orgRole === "super_admin";

  const scrollToMembers = () => {
    membersSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ── Fetch org + stats ───────────────────────────────────────────────
  useEffect(() => {
    if (!orgId) return;
    const fetchOrg = async () => {
      try {
        const [orgRes, statsRes] = await Promise.all([
          organizationService.get(orgId),
          organizationService.getStats(orgId),
        ]);
        setOrg(orgRes.data?.organization);
        setStats(statsRes.data);
      } catch (err) {
        console.error("Failed to load org:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrg();
  }, [orgId]);

  // ── Fetch members ──────────────────────────────────────────────────
  const fetchMembers = useCallback(async () => {
    if (!orgId) return;
    setMembersLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search) params.search = search;
      if (deptFilter) params.department = deptFilter;
      if (batchFilter) params.batch = batchFilter;
      if (statusFilter) params.status = statusFilter;

      const res = await organizationService.getMembers(orgId, params);
      setMembers(res.data?.members || []);
      setPagination(res.data?.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      console.error("Failed to load members:", err);
    } finally {
      setMembersLoading(false);
    }
  }, [orgId, page, search, deptFilter, batchFilter, statusFilter]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const fetchTeam = useCallback(async () => {
    if (!orgId) return;
    setTeamLoading(true);
    try {
      const res = await organizationService.getTeam(orgId);
      setTeam(res.data?.team || []);
    } catch (err) {
      console.error("Failed to load team:", err);
    } finally {
      setTeamLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  // Debounced search
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ── Remove member ──────────────────────────────────────────────────
  const handleRemoveMember = async (memberId, memberName) => {
    if (!window.confirm(`Remove ${memberName} from the organization?`)) return;
    try {
      await organizationService.removeMember(orgId, memberId);
      fetchMembers();
      // Refresh stats
      const statsRes = await organizationService.getStats(orgId);
      setStats(statsRes.data);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to remove member");
    }
  };

  // ── Update member status ───────────────────────────────────────────
  const handleStatusChange = async (memberId, newStatus) => {
    try {
      await organizationService.updateMemberStatus(orgId, memberId, newStatus);
      fetchMembers();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update status");
    }
  };

  // ── Guard ──────────────────────────────────────────────────────────
  if (!orgId) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <div className="text-center">
            <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No Organization</h2>
            <p className="text-gray-400 mb-6">
              You are not part of any organization yet.
            </p>
            <button
              onClick={() => navigate("/org/setup")}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
            >
              Create Organization
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Building2 className="w-6 h-6 text-emerald-400" />
              {org?.name || "Organization"}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {org?.type} &middot; {org?.slug}
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs border ${
                  ROLE_BADGE[orgRole] || ROLE_BADGE.member
                }`}
              >
                {orgRole?.replace("_", " ")}
              </span>
            </p>
          </div>

          <div className="flex gap-2">
            {isAdmin && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <UserPlus className="w-4 h-4" /> Invite Members
              </button>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatCard
            label="Total Members"
            value={stats?.totalMembers}
            icon={Users}
            tone="from-blue-500/20 to-cyan-500/20 border-blue-400/25"
            onClick={() => navigate("/org/members")}
          />
          <StatCard
            label="Active Members"
            value={stats?.activeMembers}
            icon={CheckCircle}
            tone="from-emerald-500/20 to-teal-500/20 border-emerald-400/25"
            onClick={() => {
              setStatusFilter("active");
              setPage(1);
              scrollToMembers();
            }}
          />
          <StatCard
            label="Seats Available"
            value={`${stats?.availableSeats ?? "—"} / ${stats?.totalSeats ?? "—"}`}
            icon={BarChart3}
            tone="from-purple-500/20 to-violet-500/20 border-purple-400/25"
          />
          <StatCard
            label="Pending Invites"
            value={stats?.pendingInvites}
            icon={Clock}
            tone="from-amber-500/20 to-orange-500/20 border-amber-400/25"
          />
        </div>

        {/* Department breakdown (compact) */}
        {stats?.departmentBreakdown?.length > 0 && (
          <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl">
            <h3 className="text-sm font-medium text-gray-400 mb-3">
              Department Breakdown
            </h3>
            <div className="flex flex-wrap gap-2">
              {stats.departmentBreakdown.map((d) => (
                <span
                  key={d._id || "unassigned"}
                  className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300"
                >
                  {d._id || "Unassigned"}: <strong>{d.count}</strong>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Members table header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 ref={membersSectionRef} className="text-lg font-semibold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-400" /> Members
            <span className="text-sm font-normal text-gray-500">
              ({pagination.total})
            </span>
          </h2>

          <div className="flex flex-wrap gap-2 items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search members..."
                className="pl-9 pr-3 py-2 w-48 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Department filter */}
            {org?.structure?.departments?.length > 0 && (
              <select
                value={deptFilter}
                onChange={(e) => {
                  setDeptFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Depts</option>
                {org.structure.departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            )}

            {/* Batch filter */}
            {org?.structure?.batches?.length > 0 && (
              <select
                value={batchFilter}
                onChange={(e) => {
                  setBatchFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Batches</option>
                {org.structure.batches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => fetchMembers()}
              className="p-2 text-gray-500 hover:text-emerald-400 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Members table */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          {membersLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No members found</p>
              {isAdmin && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="mt-3 text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
                >
                  Invite your first members →
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-500 text-left">
                    <th className="px-4 py-3 font-medium">Member</th>
                    <th className="px-4 py-3 font-medium hidden sm:table-cell">Department</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">Batch</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">Joined</th>
                    {isAdmin && <th className="px-4 py-3 font-medium">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {members.map((m) => {
                    const StatusIcon = STATUS_ICON[m.organization?.status] || CheckCircle;
                    return (
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
                        <td className="px-4 py-3">
                          {isAdmin ? (
                            <select
                              value={m.organization?.status || "active"}
                              onChange={(e) => handleStatusChange(m._id, e.target.value)}
                              className={`px-2 py-1 rounded-lg text-xs border-0 ${
                                STATUS_BADGE[m.organization?.status] || STATUS_BADGE.active
                              } bg-opacity-50 cursor-pointer`}
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                              <option value="suspended">Suspended</option>
                              <option value="graduated">Graduated</option>
                            </select>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
                                STATUS_BADGE[m.organization?.status] || STATUS_BADGE.active
                              }`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {m.organization?.status || "active"}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">
                          {m.organization?.joinedAt
                            ? new Date(m.organization.joinedAt).toLocaleDateString()
                            : "—"}
                        </td>
                        {isAdmin && (
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleRemoveMember(m._id, m.name)}
                              className="text-gray-500 hover:text-red-400 transition-colors p-1"
                              title="Remove member"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
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

      
        {/* Team table */}
        {(
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 ref={membersSectionRef} className="text-lg font-semibold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-400" /> Team
                <span className="text-sm font-normal text-gray-500">
                  ({team.length})
                </span>
              </h2>
              <button
                onClick={() => fetchTeam()}
                className="p-2 text-gray-500 hover:text-emerald-400 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              {teamLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                </div>
              ) : team.length === 0 ? (
                <div className="text-center py-10">
                  <Shield className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No team members found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-500 text-left">
                        <th className="px-4 py-3 font-medium">User</th>
                        <th className="px-4 py-3 font-medium">Role</th>
                        <th className="px-4 py-3 font-medium hidden sm:table-cell">Department</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                      {team.map((t) => (
                        <tr
                          key={t.user?._id || t.user?.id || t.user?.email}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-bold uppercase">
                                {t.user?.avatar ? (
                                  <img
                                    src={t.user.avatar}
                                    alt=""
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                ) : (
                                  t.user?.name?.charAt(0) || "?"
                                )}
                              </div>
                              <div>
                                <p className="text-white font-medium">{t.user?.name || "User"}</p>
                                <p className="text-gray-500 text-xs">{t.user?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-lg text-xs border ${
                                ROLE_BADGE[t.role] || ROLE_BADGE.viewer
                              }`}
                            >
                              {t.role?.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">
                            {t.department || "?"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

{/* Invite Modal */}
      {showInviteModal && (
        <InviteModal
          orgId={orgId}
          onClose={() => setShowInviteModal(false)}
          onSuccess={async () => {
            const statsRes = await organizationService.getStats(orgId);
            setStats(statsRes.data);
          }}
          departments={org?.structure?.departments || []}
          batches={org?.structure?.batches || []}
          orgType={org?.type || "college"}
        />
      )}
    </Layout>
  );
}
