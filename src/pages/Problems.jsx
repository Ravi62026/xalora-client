import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux"; // Add useSelector import
import { Layout } from "../components";
import { useApiCall } from "../hooks";
import problemService from "../services/problemService";

const Problems = () => {
    const { isAuthenticated } = useSelector((state) => state.user); // Get auth state from Redux
    const { loading, error, execute } = useApiCall();
    const [problems, setProblems] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalProblems: 0,
        limit: 100,
        hasNextPage: false,
        hasPrevPage: false,
    });
    const [filters, setFilters] = useState({
        difficulty: "all",
        status: "all",
        search: "",
        tags: "",
        solvedStatus: "all" // Add solved status filter
    });
    const [allTags, setAllTags] = useState([]);

    useEffect(() => {
        const fetchProblems = async () => {
            const params = {
                page: pagination.currentPage,
                limit: pagination.limit,
                ...(filters.difficulty !== "all" && {
                    difficulty: filters.difficulty,
                }),
                // Only include status filter if user is authenticated
                ...((filters.status !== "all" && isAuthenticated) && {
                    status: filters.status,
                }),
                ...(filters.search && { search: filters.search }),
                ...(filters.tags && { tags: filters.tags }),
            };

            await execute(
                () => problemService.getAllProblems(params),
                (response) => {
                    console.log("🔍 Problems API Response:", response); // Debug log
                    if (response.success) {
                        // Extract problems and pagination data correctly
                        const problemsData = response.data?.problems || response.data || [];
                        const paginationData = response.data?.pagination || {};
                        
                        // Apply client-side filtering for solved/unsolved status
                        let filteredProblems = problemsData;
                        if (isAuthenticated && filters.solvedStatus !== "all") {
                            filteredProblems = problemsData.filter(problem => {
                                // Check localStorage for solved problems as fallback
                                const solvedProblems = JSON.parse(localStorage.getItem('solvedProblems') || '[]');
                                const isLocalSolved = solvedProblems.includes(problem._id);
                                const isSolved = problem.userStatus === "Solved" || isLocalSolved;
                                
                                if (filters.solvedStatus === "solved") {
                                    return isSolved;
                                } else if (filters.solvedStatus === "unsolved") {
                                    return !isSolved;
                                }
                                return true;
                            });
                        }
                        
                        setProblems(filteredProblems);
                        setPagination(paginationData);

                        // Only sync localStorage with backend status if user is authenticated
                        if (isAuthenticated) {
                            const solvedProblems = JSON.parse(localStorage.getItem('solvedProblems') || '[]');
                            let updated = false;
                            
                            problemsData.forEach((problem) => {
                                console.log(`🔍 Problem ${problem.title}: userStatus = ${problem.userStatus}`); // Debug log
                                if (problem.userStatus === "Solved" && !solvedProblems.includes(problem._id)) {
                                    solvedProblems.push(problem._id);
                                    updated = true;
                                    console.log(`✅ Synced solved status for problem: ${problem.title}`);
                                }
                            });
                            
                            if (updated) {
                                localStorage.setItem('solvedProblems', JSON.stringify(solvedProblems));
                                // Dispatch event to update dashboard
                                window.dispatchEvent(new CustomEvent('solvedProblemsUpdated'));
                            }
                        }

                        // Extract unique tags from all problems for filter dropdown
                        const tags = new Set();
                        problemsData.forEach((problem) => {
                            problem.tags?.forEach((tag) => tags.add(tag));
                        });
                        setAllTags(Array.from(tags).sort());
                    }
                }
            );
        };

        fetchProblems();
    }, [execute, pagination.currentPage, filters, isAuthenticated]);

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, currentPage: newPage }));
    };

    const handleFilterChange = (filterName, value) => {
        setFilters((prev) => ({ ...prev, [filterName]: value }));
        setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page on filter change
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case "Easy":
                return "text-green-400 bg-green-900/30 border-green-700";
            case "Medium":
                return "text-yellow-400 bg-yellow-900/30 border-yellow-700";
            case "Hard":
                return "text-red-400 bg-red-900/30 border-red-700";
            default:
                return "text-gray-400 bg-gray-900/30 border-gray-700";
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-2xl p-6">
                            {error}
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header with gradient */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 mb-8 text-white shadow-2xl">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                Coding Problems
                            </h1>
                            <p className="text-emerald-100 text-lg">
                                Sharpen your coding skills with our curated collection of problems
                            </p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-white/10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-white/90 mb-1">
                                    Search
                                </label>
                                <input
                                    type="text"
                                    placeholder="Search problems..."
                                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-500 transition-all duration-300"
                                    value={filters.search}
                                    onChange={(e) =>
                                        handleFilterChange("search", e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/90 mb-1">
                                    Difficulty
                                </label>
                                <select
                                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white transition-all duration-300"
                                    value={filters.difficulty}
                                    onChange={(e) =>
                                        handleFilterChange("difficulty", e.target.value)
                                    }
                                >
                                    <option value="all" className="bg-gray-900">All Difficulties</option>
                                    <option value="Easy" className="bg-gray-900">Easy</option>
                                    <option value="Medium" className="bg-gray-900">Medium</option>
                                    <option value="Hard" className="bg-gray-900">Hard</option>
                                </select>
                            </div>
                            {/* Only show status filter if user is authenticated */}
                            {isAuthenticated && (
                                <div>
                                    <label className="block text-sm font-medium text-white/90 mb-1">
                                        Status
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white transition-all duration-300"
                                        value={filters.status}
                                        onChange={(e) =>
                                            handleFilterChange("status", e.target.value)
                                        }
                                    >
                                        <option value="all" className="bg-gray-900">All Statuses</option>
                                        <option value="Solved" className="bg-gray-900">Solved</option>
                                        <option value="Attempted" className="bg-gray-900">Attempted</option>
                                        <option value="Unattempted" className="bg-gray-900">Unattempted</option>
                                    </select>
                                </div>
                            )}
                            {/* Solved/Unsolved filter */}
                            {isAuthenticated && (
                                <div>
                                    <label className="block text-sm font-medium text-white/90 mb-1">
                                        Solved Status
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white transition-all duration-300"
                                        value={filters.solvedStatus}
                                        onChange={(e) =>
                                            handleFilterChange("solvedStatus", e.target.value)
                                        }
                                    >
                                        <option value="all" className="bg-gray-900">All Problems</option>
                                        <option value="solved" className="bg-gray-900">Solved</option>
                                        <option value="unsolved" className="bg-gray-900">Unsolved</option>
                                    </select>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-white/90 mb-1">
                                    Tags
                                </label>
                                <select
                                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white transition-all duration-300"
                                    value={filters.tags}
                                    onChange={(e) =>
                                        handleFilterChange("tags", e.target.value)
                                    }
                                >
                                    <option value="" className="bg-gray-900">All Tags</option>
                                    {allTags.map((tag) => (
                                        <option key={tag} value={tag} className="bg-gray-900">
                                            {tag}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Problems List */}
                    <div className="space-y-4">
                        {problems.map((problem) => {
                            // Check localStorage for solved problems as fallback
                            const solvedProblems = JSON.parse(localStorage.getItem('solvedProblems') || '[]');
                            const isLocalSolved = solvedProblems.includes(problem._id);
                            const actualStatus = isLocalSolved ? "Solved" : (problem.userStatus || "Unattempted");
                            
                            // Debug logging
                            // console.log("🔍 Problem Render Debug:", {
                            //     title: problem.title,
                            //     backendStatus: problem.userStatus,
                            //     isLocalSolved,
                            //     actualStatus,
                            //     solvedProblems,
                            //     problemId: problem._id
                            // });
                            
                            return (
                            <Link
                                key={problem._id}
                                to={`/problems/${problem._id}`}
                                className="block bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/10 hover:border-emerald-400/30 transition-all duration-300 hover:scale-[1.02]"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        {/* Show status icon only if user is authenticated */}
                                        {isAuthenticated ? (
                                            <div className="flex items-center justify-center">
                                                {(problem.userStatus === "Solved" || isLocalSolved) ? (
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center border-2 border-green-400 shadow-lg">
                                                        <svg
                                                            className="w-4 h-4 text-white"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full bg-gray-900/50 flex items-center justify-center border border-gray-700">
                                                        <svg
                                                            className="w-4 h-4 text-gray-400"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="w-6 h-6 rounded-full bg-gray-900/50 flex items-center justify-center border border-gray-700">
                                                <svg
                                                    className="w-4 h-4 text-gray-400"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-xl font-semibold text-white mb-1">
                                                {problem.title}
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                                                        problem.difficulty
                                                    )}`}
                                                >
                                                    {problem.difficulty}
                                                </span>
                                                {problem.tags?.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-900/30 text-emerald-300 border border-emerald-700"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {/* Show status only if user is authenticated */}
                                        {isAuthenticated ? (
                                            <div className={`text-lg font-semibold ${
                                                (problem.userStatus === "Solved" || isLocalSolved)
                                                    ? "text-emerald-400" 
                                                    : problem.userStatus === "Attempted"
                                                    ? "text-yellow-400"
                                                    : "text-gray-400"
                                            }`}>
                                                {(problem.userStatus === "Solved" || isLocalSolved) ? "Solved" : 
                                                 problem.userStatus === "Attempted" ? "Attempted" : 
                                                 "Unsolved"}
                                            </div>
                                        ) : (
                                            <div className="text-sm text-white/70">
                                                Login to track progress
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center mt-8">
                            <nav className="flex items-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={!pagination.hasPrevPage}
                                    className={`px-4 py-2 rounded-lg ${
                                        pagination.hasPrevPage
                                            ? "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                                            : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                                    } transition-all duration-300`}
                                >
                                    Previous
                                </button>
                                {[...Array(pagination.totalPages)].map((_, index) => {
                                    const page = index + 1;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-4 py-2 rounded-lg ${
                                                page === pagination.currentPage
                                                    ? "bg-emerald-600 text-white border border-emerald-500"
                                                    : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                                            } transition-all duration-300`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={!pagination.hasNextPage}
                                    className={`px-4 py-2 rounded-lg ${
                                        pagination.hasNextPage
                                            ? "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                                            : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                                    } transition-all duration-300`}
                                >
                                    Next
                                </button>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Problems;