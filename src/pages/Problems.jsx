import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  CheckCircle2,
  Circle,
  Filter,
  Loader2,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { Layout } from "../components";
import problemService from "../services/problemService";

const INITIAL_FILTERS = {
  difficulty: "all",
  company: "all",
  tags: "",
  solvedStatus: "all",
  search: "",
};

const PAGE_SIZE_OPTIONS = [12, 24, 48];

const getDifficultyClass = (difficulty) => {
  const key = (difficulty || "").toLowerCase();
  if (key === "easy") return "bg-emerald-500/15 text-emerald-200 border-emerald-400/30";
  if (key === "medium") return "bg-amber-500/15 text-amber-200 border-amber-400/30";
  if (key === "hard") return "bg-rose-500/15 text-rose-200 border-rose-400/30";
  return "bg-slate-500/15 text-slate-200 border-slate-400/30";
};

const Problems = () => {
  const { isAuthenticated } = useSelector((state) => state.user);

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [searchInput, setSearchInput] = useState("");
  const [rawProblems, setRawProblems] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const hasLoadedRef = useRef(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProblems: 0,
    limit: 24,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput.trim() }));
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    const fetchProblems = async () => {
      setError("");
      if (!hasLoadedRef.current) {
        setIsLoading(true);
      } else {
        setIsFetching(true);
      }

      try {
        const params = {
          page: pagination.currentPage,
          limit: pagination.limit,
          ...(filters.difficulty !== "all" && { difficulty: filters.difficulty }),
          ...(filters.company !== "all" && { company: filters.company }),
          ...(filters.search && { search: filters.search }),
          ...(filters.tags && { tags: filters.tags }),
        };

        const response = await problemService.getAllProblems(params);

        if (!response?.success) {
          throw new Error(response?.message || "Failed to fetch problems");
        }

        const problemsData = response?.data?.problems || [];
        const paginationData = response?.data?.pagination || {};
        const availableFilters = response?.data?.filters || {};

        // Sync backend solved states into localStorage fallback only for authenticated users.
        if (isAuthenticated) {
          const solvedProblems = new Set(
            JSON.parse(localStorage.getItem("solvedProblems") || "[]")
          );
          let updated = false;

          problemsData.forEach((problem) => {
            if (problem?.userStatus === "Solved" && problem?._id && !solvedProblems.has(problem._id)) {
              solvedProblems.add(problem._id);
              updated = true;
            }
          });

          if (updated) {
            localStorage.setItem("solvedProblems", JSON.stringify(Array.from(solvedProblems)));
            window.dispatchEvent(new CustomEvent("solvedProblemsUpdated"));
          }
        }

        setRawProblems(problemsData);
        setPagination((prev) => ({
          ...prev,
          ...paginationData,
          limit: paginationData?.limit || prev.limit,
        }));

        if (Array.isArray(availableFilters?.tags)) {
          setAllTags(availableFilters.tags);
        }

        if (Array.isArray(availableFilters?.companies)) {
          setAllCompanies(availableFilters.companies);
        }
      } catch (err) {
        setError(err?.message || "Could not load problems. Please try again.");
      } finally {
        hasLoadedRef.current = true;
        setIsLoading(false);
        setIsFetching(false);
      }
    };

    fetchProblems();
  }, [
    filters.company,
    filters.difficulty,
    filters.search,
    filters.tags,
    isAuthenticated,
    pagination.currentPage,
    pagination.limit,
  ]);

  const visiblePageNumbers = useMemo(() => {
    const total = pagination.totalPages || 1;
    const current = pagination.currentPage || 1;
    const start = Math.max(1, current - 2);
    const end = Math.min(total, start + 4);
    const pages = [];
    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  }, [pagination.currentPage, pagination.totalPages]);

  const solvedLocalSet = useMemo(
    () => new Set(JSON.parse(localStorage.getItem("solvedProblems") || "[]")),
    [rawProblems]
  );

  const problems = useMemo(() => {
    if (!isAuthenticated || filters.solvedStatus === "all") return rawProblems;

    return rawProblems.filter((problem) => {
      const solved = problem?.userStatus === "Solved" || solvedLocalSet.has(problem?._id);
      return filters.solvedStatus === "solved" ? solved : !solved;
    });
  }, [filters.solvedStatus, isAuthenticated, rawProblems, solvedLocalSet]);

  const summaryText = useMemo(() => {
    const total = pagination.totalProblems || 0;
    if (!total) return "No problems found";
    const start = (pagination.currentPage - 1) * pagination.limit + 1;
    const end = Math.min(start + problems.length - 1, total);
    return `Showing ${start}-${end} of ${total} problems`;
  }, [pagination.currentPage, pagination.limit, pagination.totalProblems, problems.length]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSearchInput("");
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const updateLimit = (newLimit) => {
    setPagination((prev) => ({ ...prev, limit: Number(newLimit), currentPage: 1 }));
  };

  return (
    <Layout>
      <section className="min-h-screen bg-[radial-gradient(circle_at_8%_10%,rgba(16,185,129,0.22),transparent_28%),radial-gradient(circle_at_84%_20%,rgba(6,182,212,0.18),transparent_25%),linear-gradient(145deg,#020617,#0f172a,#030712)] py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 rounded-3xl border border-cyan-400/25 bg-gradient-to-r from-cyan-500/12 via-blue-500/10 to-transparent p-5 sm:p-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Problem Bank</p>
                <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Practice Coding Problems</h1>
                <p className="mt-2 text-sm text-slate-300 sm:text-base">
                  Faster listing, cleaner filters, and focused preparation flow.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-slate-300 sm:text-sm">
                <Sparkles className="h-4 w-4 text-cyan-300" />
                {summaryText}
              </div>
            </div>
          </div>

          <div className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-200">
              <Filter className="h-4 w-4 text-cyan-300" />
              Smart Filters
            </div>

            <div
              className={`grid grid-cols-1 gap-3 md:grid-cols-2 ${isAuthenticated ? "xl:grid-cols-8" : "xl:grid-cols-7"
                }`}
            >
              <div className="xl:col-span-2">
                <label className="mb-1 block text-xs text-slate-300">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search title or description"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/70 py-2 pl-9 pr-3 text-sm text-white outline-none transition focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-300">Difficulty</label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange("difficulty", e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
                >
                  <option value="all">All</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-300">Company</label>
                <select
                  value={filters.company}
                  onChange={(e) => handleFilterChange("company", e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
                >
                  <option value="all">All</option>
                  {allCompanies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-300">Tag</label>
                <select
                  value={filters.tags}
                  onChange={(e) => handleFilterChange("tags", e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
                >
                  <option value="">All</option>
                  {allTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-300">Rows</label>
                <select
                  value={pagination.limit}
                  onChange={(e) => updateLimit(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size} / page
                    </option>
                  ))}
                </select>
              </div>

              {isAuthenticated && (
                <div>
                  <label className="mb-1 block text-xs text-slate-300">Status</label>
                  <select
                    value={filters.solvedStatus}
                    onChange={(e) => handleFilterChange("solvedStatus", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
                  >
                    <option value="all">All</option>
                    <option value="solved">Solved</option>
                    <option value="unsolved">Unsolved</option>
                  </select>
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs text-slate-300 opacity-0">Actions</label>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Reset
                </button>
              </div>
            </div>

            <div className="mt-3 flex min-h-5 items-center justify-end">
              {isFetching && (
                <div className="inline-flex items-center gap-2 text-xs text-cyan-200">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating list...
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex min-h-[40vh] items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <div className="text-center">
                <Loader2 className="mx-auto h-9 w-9 animate-spin text-cyan-300" />
                <p className="mt-2 text-sm text-slate-300">Loading problems...</p>
              </div>
            </div>
          ) : problems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 px-6 py-12 text-center text-slate-300">
              No problems matched your filters.
            </div>
          ) : (
            <div className="space-y-3">
              {problems.map((problem, index) => {
                const isSolved =
                  problem?.userStatus === "Solved" || solvedLocalSet.has(problem?._id);

                return (
                  <Link
                    key={problem?._id || index}
                    to={`/problems/${problem._id}`}
                    className="group block rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur transition hover:border-cyan-300/35 hover:bg-white/10"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {isSolved ? (
                            <CheckCircle2 className="h-5 w-5 text-cyan-300" />
                          ) : (
                            <Circle className="h-5 w-5 text-slate-500" />
                          )}
                        </div>

                        <div>
                          <h3 className="text-base font-semibold text-white sm:text-lg">{problem.title}</h3>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span
                              className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getDifficultyClass(
                                problem.difficulty
                              )}`}
                            >
                              {problem.difficulty || "Unknown"}
                            </span>
                            {(problem.tags || []).slice(0, 4).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-1 text-xs text-cyan-100"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className={`text-sm font-semibold ${isSolved
                              ? "text-cyan-300"
                              : problem?.userStatus === "Attempted"
                                ? "text-amber-300"
                                : "text-slate-400"
                            }`}
                        >
                          {isSolved
                            ? "Solved"
                            : problem?.userStatus === "Attempted"
                              ? "Attempted"
                              : isAuthenticated
                                ? "Unsolved"
                                : "Login to track"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 group-hover:text-slate-300">
                          Open problem
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={!pagination.hasPrevPage || isFetching}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white transition enabled:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>

              {visiblePageNumbers[0] > 1 && (
                <>
                  <button
                    onClick={() => setPagination((prev) => ({ ...prev, currentPage: 1 }))}
                    className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10"
                  >
                    1
                  </button>
                  {visiblePageNumbers[0] > 2 && <span className="px-1 text-slate-500">...</span>}
                </>
              )}

              {visiblePageNumbers.map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPagination((prev) => ({ ...prev, currentPage: pageNum }))}
                  className={`rounded-lg border px-3 py-2 text-sm transition ${pageNum === pagination.currentPage
                      ? "border-cyan-400/60 bg-cyan-500/20 text-cyan-100"
                      : "border-white/15 bg-white/5 text-white hover:bg-white/10"
                    }`}
                >
                  {pageNum}
                </button>
              ))}

              {visiblePageNumbers[visiblePageNumbers.length - 1] < pagination.totalPages && (
                <>
                  {visiblePageNumbers[visiblePageNumbers.length - 1] < pagination.totalPages - 1 && (
                    <span className="px-1 text-slate-500">...</span>
                  )}
                  <button
                    onClick={() =>
                      setPagination((prev) => ({ ...prev, currentPage: pagination.totalPages }))
                    }
                    className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10"
                  >
                    {pagination.totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={!pagination.hasNextPage || isFetching}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white transition enabled:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Problems;
