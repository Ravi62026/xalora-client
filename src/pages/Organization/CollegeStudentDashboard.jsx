import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  Building2,
  Loader2,
  Medal,
  RefreshCw,
  Search,
  Trophy,
  Users,
} from "lucide-react";
import { Layout } from "../../components";
import organizationService from "../../services/organizationService";
import AcademicFilters from "../../components/Organization/AcademicFilters";

export default function CollegeStudentDashboard() {
  const { user } = useSelector((state) => state.user);
  const orgId = user?.organization?.orgId;
  const myDegreeType = user?.organization?.degreeTypeValue || "";
  const myProgram = user?.organization?.programValue || "";

  const [org, setOrg] = useState(null);
  const [filterOptions, setFilterOptions] = useState({ degreeTypes: [] });
  const [leaderboard, setLeaderboard] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [degreeTypeFilter, setDegreeTypeFilter] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const orgRes = await organizationService.get(orgId);
      const organization = orgRes.data?.organization || null;
      setOrg(organization);

      if (organization?.type !== "college") {
        setFilterOptions({ degreeTypes: [] });
        setLeaderboard([]);
        setPagination({ page: 1, pages: 1, total: 0 });
        setMyRank(null);
        return;
      }

      const params = { page, limit: 20 };
      if (degreeTypeFilter) params.degreeType = degreeTypeFilter;
      if (programFilter) params.program = programFilter;

      const [filterRes, leaderboardRes, myRankRes] = await Promise.all([
        organizationService.getCollegeFilterOptions(orgId),
        organizationService.getCollegeLeaderboard(orgId, params),
        organizationService.getCollegeMyRank(orgId, params),
      ]);

      setFilterOptions(filterRes.data || { degreeTypes: [] });
      setLeaderboard(leaderboardRes.data?.members || []);
      setPagination(
        leaderboardRes.data?.pagination || { page: 1, pages: 1, total: 0 }
      );
      setMyRank(myRankRes.data || null);
    } catch (error) {
      console.error("Failed to load student leaderboard:", error);
    } finally {
      setLoading(false);
    }
  }, [orgId, page, degreeTypeFilter, programFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredLeaderboard = useMemo(() => {
    if (!search.trim()) return leaderboard;
    const query = search.trim().toLowerCase();
    return leaderboard.filter((entry) => entry.name.toLowerCase().includes(query));
  }, [leaderboard, search]);

  if (!orgId) {
    return (
      <Layout>
        <div className="flex min-h-[80vh] items-center justify-center px-4">
          <p className="text-gray-400">No college organization found.</p>
        </div>
      </Layout>
    );
  }

  if (org && org.type !== "college") {
    return (
      <Layout>
        <div className="flex min-h-[80vh] items-center justify-center px-4">
          <p className="text-gray-400">
            Student leaderboard is available only for college organizations.
          </p>
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
              {org?.name || "College"} Leaderboard
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Compare your performance across the college, degree type, or program.
            </p>
          </div>
          <button
            type="button"
            onClick={fetchData}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-200 hover:border-emerald-500/40 hover:text-emerald-300"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {myRank && (
          <div className="mb-6 grid gap-3 sm:grid-cols-4">
            <MetricCard
              label="My Rank"
              value={myRank.rank ? `#${myRank.rank}` : "Not in scope"}
              icon={Trophy}
            />
            <MetricCard label="Compared Against" value={myRank.outOf} icon={Users} />
            <MetricCard label="DSA Solved" value={myRank.me?.metrics?.dsaSolved || 0} icon={Medal} />
            <MetricCard
              label="Avg Interview Score"
              value={myRank.me?.metrics?.avgInterviewScore ?? "—"}
              icon={Trophy}
            />
          </div>
        )}

        <section className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            <QuickFilterButton
              active={!degreeTypeFilter && !programFilter}
              onClick={() => {
                setDegreeTypeFilter("");
                setProgramFilter("");
                setPage(1);
              }}
              label="Overall"
            />
            <QuickFilterButton
              active={degreeTypeFilter === myDegreeType && !programFilter}
              onClick={() => {
                setDegreeTypeFilter(myDegreeType);
                setProgramFilter("");
                setPage(1);
              }}
              label="My Degree"
            />
            <QuickFilterButton
              active={degreeTypeFilter === myDegreeType && programFilter === myProgram}
              onClick={() => {
                setDegreeTypeFilter(myDegreeType);
                setProgramFilter(myProgram);
                setPage(1);
              }}
              label="My Degree + Program"
            />
            <QuickFilterButton
              active={!degreeTypeFilter && programFilter === myProgram}
              onClick={() => {
                setDegreeTypeFilter("");
                setProgramFilter(myProgram);
                setPage(1);
              }}
              label="My Program Cross Degree"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search leaderboard"
                className="w-52 rounded-lg border border-gray-700 bg-gray-900 py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
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
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
            </div>
          ) : filteredLeaderboard.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="mb-3 h-10 w-10 text-gray-600" />
              <p className="text-sm font-medium text-gray-400">No students found</p>
              <p className="mt-1 text-xs text-gray-500">
                {search ? "Try a different search term." : "No students match the current filters."}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-950 text-gray-400">
                  <tr>
                    <th className="px-4 py-3">Rank</th>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Degree Type</th>
                    <th className="px-4 py-3">Program</th>
                    <th className="px-4 py-3 text-center">DSA Solved</th>
                    <th className="px-4 py-3 text-center">Interviews</th>
                    <th className="px-4 py-3 text-center">Avg Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredLeaderboard.map((entry) => {
                    const isMe = entry.userId === user?._id || entry.userId?._id === user?._id;
                    return (
                      <tr
                        key={`${entry.userId}-${entry.rank}`}
                        className={isMe ? "bg-emerald-500/10 text-white" : "bg-white/5 text-white"}
                      >
                        <td className="px-4 py-3 font-semibold">#{entry.rank}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium">{entry.name}</p>
                          {isMe && <p className="text-xs text-emerald-300">You</p>}
                        </td>
                        <td className="px-4 py-3 text-gray-300">{entry.degreeType?.label || "—"}</td>
                        <td className="px-4 py-3 text-gray-300">{entry.program?.label || "—"}</td>
                        <td className="px-4 py-3 text-center">{entry.metrics?.dsaSolved || 0}</td>
                        <td className="px-4 py-3 text-center">{entry.metrics?.totalInterviews || 0}</td>
                        <td className="px-4 py-3 text-center">
                          {entry.metrics?.avgInterviewScore ?? "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

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
                  className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300 hover:text-white disabled:opacity-30"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(pagination.pages, current + 1))}
                  disabled={page >= pagination.pages}
                  className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300 hover:text-white disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}

function MetricCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs text-gray-500">{label}</p>
        <Icon className="h-4 w-4 text-gray-500" />
      </div>
      <p className="text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function QuickFilterButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-emerald-600 text-white"
          : "border border-gray-700 text-gray-300 hover:border-emerald-500/40 hover:text-emerald-300"
      }`}
    >
      {label}
    </button>
  );
}
