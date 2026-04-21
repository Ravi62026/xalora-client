import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
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
import { getActiveWorkspace } from "../../utils/workspace";

export default function CollegeStudentDashboard() {
  const { user } = useSelector((state) => state.user);
  const activeWorkspace = getActiveWorkspace(user);
  const orgId = activeWorkspace?.organization?._id || null;
  const myDegreeType = activeWorkspace?.degreeTypeValue || "";
  const myProgram = activeWorkspace?.programValue || "";

  const [org, setOrg] = useState(null);
  const [filterOptions, setFilterOptions] = useState({ degreeTypes: [] });
  const [leaderboard, setLeaderboard] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [myRank, setMyRank] = useState(null);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState([]);
  const [weeklyPagination, setWeeklyPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [weeklySnapshot, setWeeklySnapshot] = useState(null);
  const [weeklyHistory, setWeeklyHistory] = useState([]);
  const [weeklyRepeatHighlights, setWeeklyRepeatHighlights] = useState([]);
  const [weeklyMyRank, setWeeklyMyRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weeklyLoading, setWeeklyLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [degreeTypeFilter, setDegreeTypeFilter] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("overall");

  const loadOrganization = useCallback(async () => {
    if (!orgId) return null;
    const orgRes = await organizationService.get(orgId);
    const organization = orgRes.data?.organization || null;
    setOrg(organization);
    return organization;
  }, [orgId]);

  const fetchOverallData = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const organization = await loadOrganization();

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
  }, [orgId, page, degreeTypeFilter, programFilter, loadOrganization]);

  const fetchWeeklyData = useCallback(async () => {
    if (!orgId) return;
    setWeeklyLoading(true);
    try {
      const organization = await loadOrganization();
      if (organization?.type !== "college") {
        setWeeklyLeaderboard([]);
        setWeeklyPagination({ page: 1, pages: 1, total: 0 });
        setWeeklySnapshot(null);
        setWeeklyHistory([]);
        setWeeklyRepeatHighlights([]);
        setWeeklyMyRank(null);
        return;
      }

      const response = await organizationService.getCollegeWeeklyLeaderboard(orgId, {
        page,
        limit: 20,
      });

      setWeeklySnapshot(response.data?.snapshot || null);
      setWeeklyLeaderboard(response.data?.members || []);
      setWeeklyPagination(
        response.data?.pagination || { page: 1, pages: 1, total: 0 }
      );
      setWeeklyHistory(response.data?.history || []);
      setWeeklyRepeatHighlights(response.data?.repeatHighlights || []);
      setWeeklyMyRank(response.data?.me || null);
    } catch (error) {
      console.error("Failed to load weekly leaderboard:", error);
    } finally {
      setWeeklyLoading(false);
    }
  }, [orgId, page, loadOrganization]);

  useEffect(() => {
    if (viewMode === "weekly") {
      fetchWeeklyData();
      return;
    }

    fetchOverallData();
  }, [fetchOverallData, fetchWeeklyData, viewMode]);

  const filteredLeaderboard = useMemo(() => {
    const source = viewMode === "weekly" ? weeklyLeaderboard : leaderboard;
    if (!search.trim()) return source;
    const query = search.trim().toLowerCase();
    return source.filter((entry) => entry.name.toLowerCase().includes(query));
  }, [leaderboard, weeklyLeaderboard, search, viewMode]);

  const isWeeklyView = viewMode === "weekly";
  const activeLoading = isWeeklyView ? weeklyLoading : loading;
  const activePagination = isWeeklyView ? weeklyPagination : pagination;
  const activeMyRank = isWeeklyView ? weeklyMyRank : myRank;
  const refreshCurrentView = isWeeklyView ? fetchWeeklyData : fetchOverallData;

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

  const weeklySummary = weeklySnapshot?.summary || {};
  const weeklyRecentHistory = weeklyHistory.slice(0, 6);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
              <Building2 className="h-6 w-6 text-emerald-400" />
              {org?.name || "College"} Leaderboard
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Compare your performance across the college, degree type, or program.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setViewMode("overall");
                setPage(1);
              }}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                !isWeeklyView
                  ? "bg-emerald-600 text-white"
                  : "border border-gray-700 text-gray-200 hover:border-emerald-500/40 hover:text-emerald-300"
              }`}
            >
              Overall
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode("weekly");
                setPage(1);
              }}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isWeeklyView
                  ? "bg-emerald-600 text-white"
                  : "border border-gray-700 text-gray-200 hover:border-emerald-500/40 hover:text-emerald-300"
              }`}
            >
              Weekly
            </button>
            <button
              type="button"
              onClick={refreshCurrentView}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-200 hover:border-emerald-500/40 hover:text-emerald-300"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {isWeeklyView ? (
          <>
            <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="Week"
                value={weeklySnapshot?.periodKey || "Latest"}
                icon={CalendarDays}
              />
              <MetricCard label="Top 10" value={weeklySummary.top10Members ?? 0} icon={Trophy} />
              <MetricCard
                label="Repeat Top 10"
                value={weeklySummary.repeatTop10Members ?? 0}
                icon={BadgeCheck}
              />
              <MetricCard
                label="My Rank"
                value={weeklyMyRank?.rank ? `#${weeklyMyRank.rank}` : "Not in scope"}
                icon={Medal}
              />
            </div>

            <section className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">Weekly Snapshot</h2>
                  <p className="mt-1 text-sm text-gray-400">
                    {weeklySnapshot?.periodLabel ||
                      "Snapshot is generated from the latest weekly run."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                  <span className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1.5">
                    Members: {weeklySummary.totalMembers ?? 0}
                  </span>
                  <span className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1.5">
                    Active: {weeklySummary.activeMembers ?? 0}
                  </span>
                  <span className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1.5">
                    Repeat badges: {weeklyRepeatHighlights.length}
                  </span>
                </div>
              </div>

              {weeklyRepeatHighlights.length > 0 && (
                <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                  <p className="mb-3 flex items-center gap-2 text-sm font-medium text-amber-200">
                    <BadgeCheck className="h-4 w-4" />
                    Repeat top performers
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {weeklyRepeatHighlights.slice(0, 8).map((entry) => (
                      <span
                        key={`${entry.userId}-${entry.rank}`}
                        className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-100"
                      >
                        {entry.name} - {entry.top10Appearances}x top 10
                        {entry.bestRank ? `, best #${entry.bestRank}` : ""}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {weeklyRecentHistory.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gray-500">
                    Recent weeks
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {weeklyRecentHistory.map((week) => (
                      <span
                        key={week.periodKey}
                        className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1.5 text-xs text-gray-300"
                      >
                        {week.periodLabel}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </>
        ) : (
          <>
            {activeMyRank && (
              <div className="mb-6 grid gap-3 sm:grid-cols-4">
                <MetricCard
                  label="My Rank"
                  value={activeMyRank.rank ? `#${activeMyRank.rank}` : "Not in scope"}
                  icon={Trophy}
                />
                <MetricCard
                  label="Compared Against"
                  value={activeMyRank.outOf}
                  icon={Users}
                />
                <MetricCard
                  label="DSA Solved"
                  value={activeMyRank.me?.metrics?.dsaSolved || 0}
                  icon={Medal}
                />
                <MetricCard
                  label="Avg Interview Score"
                  value={activeMyRank.me?.metrics?.avgInterviewScore ?? "-"}
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
          </>
        )}

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          {activeLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
            </div>
          ) : filteredLeaderboard.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="mb-3 h-10 w-10 text-gray-600" />
              <p className="text-sm font-medium text-gray-400">No students found</p>
              <p className="mt-1 text-xs text-gray-500">
                {search
                  ? "Try a different search term."
                  : "No students match the current filters."}
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
                    {isWeeklyView && <th className="px-4 py-3 text-center">Repeat</th>}
                    {isWeeklyView && <th className="px-4 py-3 text-center">Best Rank</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredLeaderboard.map((entry) => {
                    const isMe = String(entry.userId) === String(user?._id);
                    const isRepeat = isWeeklyView && Number(entry.top10Appearances || 0) >= 2;

                    return (
                      <tr
                        key={`${entry.userId}-${entry.rank}`}
                        className={
                          isMe
                            ? "bg-emerald-500/10 text-white"
                            : isRepeat
                              ? "bg-amber-500/5 text-white"
                              : "bg-white/5 text-white"
                        }
                      >
                        <td className="px-4 py-3 font-semibold">#{entry.rank}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium">{entry.name}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                            {isMe && (
                              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-300">
                                You
                              </span>
                            )}
                            {isRepeat && (
                              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-amber-300">
                                Repeat top 10
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-300">{entry.degreeType?.label || "-"}</td>
                        <td className="px-4 py-3 text-gray-300">{entry.program?.label || "-"}</td>
                        <td className="px-4 py-3 text-center">{entry.metrics?.dsaSolved || 0}</td>
                        <td className="px-4 py-3 text-center">{entry.metrics?.totalInterviews || 0}</td>
                        <td className="px-4 py-3 text-center">
                          {entry.metrics?.avgInterviewScore ?? "-"}
                        </td>
                        {isWeeklyView && (
                          <td className="px-4 py-3 text-center text-amber-200">
                            {entry.top10Appearances || 0}
                          </td>
                        )}
                        {isWeeklyView && (
                          <td className="px-4 py-3 text-center">
                            {entry.bestRank ? `#${entry.bestRank}` : "-"}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activePagination.pages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Page {activePagination.page} of {activePagination.pages}
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
                  onClick={() => setPage((current) => Math.min(activePagination.pages, current + 1))}
                  disabled={page >= activePagination.pages}
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
