import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import axiosInstance from '../utils/axios';
import ApiRoutes from '../routes/routes';

const buildQuizStats = (submissions = []) => {
    const stats = {};

    submissions.forEach((submission) => {
        const quizId = String(submission?.quizId || '');
        if (!quizId) return;

        const score = Number(submission?.score) || 0;
        const submittedAtMs = submission?.submittedAt
            ? new Date(submission.submittedAt).getTime()
            : 0;

        if (!stats[quizId]) {
            stats[quizId] = {
                attempts: 0,
                passed: false,
                bestScore: 0,
                latestScore: 0,
                latestSubmissionId: '',
                latestSubmittedAt: 0,
            };
        }

        const entry = stats[quizId];
        entry.attempts += 1;
        entry.passed = entry.passed || Boolean(submission?.passed);
        entry.bestScore = Math.max(entry.bestScore, score);

        if (submittedAtMs >= entry.latestSubmittedAt) {
            entry.latestScore = score;
            entry.latestSubmissionId = String(submission?.id || '');
            entry.latestSubmittedAt = submittedAtMs;
        }
    });

    return stats;
};

const getQuizPoolLabel = (quiz) => {
    if (Array.isArray(quiz.questions)) {
        return quiz.questions.length;
    }

    if (typeof quiz.questionPoolSize === 'number') {
        return quiz.questionPoolSize;
    }

    return quiz.attemptQuestionCount ? `${quiz.attemptQuestionCount}+` : 'N/A';
};

const FilterDropdown = ({
    label,
    value,
    options,
    onChange,
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption =
        options.find((option) => option.value === value) || options[0];

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white transition-all duration-200 hover:border-emerald-400/40 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
                <span className="min-w-0">
                    <span className="block text-[11px] uppercase tracking-[0.22em] text-white/40">
                        {label}
                    </span>
                    <span className="mt-1 block truncate font-medium">
                        {selectedOption?.label}
                    </span>
                </span>
                <svg
                    className={`h-4 w-4 flex-shrink-0 text-white/70 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full z-30 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0b1220] shadow-2xl shadow-black/50">
                    {options.map((option) => {
                        const isActive = option.value === value;
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`flex w-full items-center px-4 py-3 text-left text-sm transition-colors duration-150 ${
                                    isActive
                                        ? 'bg-emerald-500/20 text-emerald-300'
                                        : 'text-white/80 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const Quiz = () => {
    const { isAuthenticated } = useSelector((state) => state.user);
    const [quizzes, setQuizzes] = useState([]);
    const [quizStats, setQuizStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [topicFilter, setTopicFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        const loadQuizzes = async () => {
            setLoading(true);

            try {
                const [quizResponse, analyticsResponse] = await Promise.all([
                    axiosInstance.get(ApiRoutes.quizzes.getAll),
                    axiosInstance.get(ApiRoutes.quizzes.analytics).catch(() => ({
                        data: { data: { allSubmissions: [] } },
                    })),
                ]);

                const quizList = quizResponse.data?.data || [];
                const analyticsData = analyticsResponse.data?.data || {};

                setQuizzes(quizList);
                setQuizStats(buildQuizStats(analyticsData.allSubmissions || []));
            } catch (error) {
                console.error('Error fetching quizzes:', error);
                setQuizzes([
                    { _id: '507f1f77bcf86cd799439011', title: 'Python Basic', topic: 'Python', timeLimit: 25 },
                    { _id: '507f1f77bcf86cd799439012', title: 'JavaScript Basic', topic: 'JavaScript', timeLimit: 25 },
                    { _id: '507f1f77bcf86cd799439013', title: 'Java Basic', topic: 'Java', timeLimit: 25 },
                    { _id: '507f1f77bcf86cd799439014', title: 'HTML Basic', topic: 'HTML', timeLimit: 25 },
                ]);
                setQuizStats({});
            } finally {
                setLoading(false);
            }
        };

        loadQuizzes();
    }, []);

    const handleStartQuiz = (quizId) => {
        navigate(`/quiz/${quizId}`);
    };

    const handleViewResult = (submissionId) => {
        if (!submissionId) return;
        navigate(`/quiz/report/${submissionId}`);
    };

    const topicOptions = Array.from(
        new Set(quizzes.map((quiz) => quiz.topic).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));

    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filteredQuizzes = quizzes.filter((quiz) => {
        const quizText = `${quiz.title || ''} ${quiz.topic || ''}`.toLowerCase();
        const matchesSearch = !normalizedQuery || quizText.includes(normalizedQuery);
        const matchesTopic = topicFilter === 'all' || (quiz.topic || '') === topicFilter;
        const stats = quizStats[String(quiz._id)] || null;
        const isAttempted = Boolean(stats?.attempts > 0);
        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'attempted' && isAttempted) ||
            (statusFilter === 'not_attempted' && !isAttempted);

        return matchesSearch && matchesTopic && matchesStatus;
    });

    const attemptedCount = quizzes.filter((quiz) => {
        const stats = quizStats[String(quiz._id)] || null;
        return Boolean(stats?.attempts > 0);
    }).length;

    const passedCount = quizzes.filter((quiz) => {
        const stats = quizStats[String(quiz._id)] || null;
        return Boolean(stats?.passed);
    }).length;

    if (!isAuthenticated) {
        return (
            <Layout>
                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
                    <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-4">Please Login</h2>
                        <p className="text-white/80">You need to be logged in to take quizzes.</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 sm:mb-10">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
                            <div className="flex-1 text-left sm:text-left">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4">Quizzes</h1>
                                <p className="text-base sm:text-lg md:text-xl text-white/80">
                                    Test your knowledge with our interactive quizzes
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/quiz/analytics')}
                                className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-2.5 sm:py-2 px-4 sm:px-6 text-sm sm:text-base rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg"
                            >
                                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                View Analytics
                            </button>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left">
                                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Total</p>
                                <p className="mt-1 text-2xl font-bold text-white">{quizzes.length}</p>
                            </div>
                            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-left">
                                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">Attempted</p>
                                <p className="mt-1 text-2xl font-bold text-emerald-300">{attemptedCount}</p>
                            </div>
                            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-left">
                                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">Passed</p>
                                <p className="mt-1 text-2xl font-bold text-cyan-300">{passedCount}</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left">
                                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Not Attempted</p>
                                <p className="mt-1 text-2xl font-bold text-white">
                                    {Math.max(quizzes.length - attemptedCount, 0)}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-3 lg:grid-cols-[1.5fr_0.8fr_0.8fr_auto] text-left">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search quiz or topic..."
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-11 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                />
                                <svg className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            <FilterDropdown
                                label="Topic"
                                value={topicFilter}
                                onChange={setTopicFilter}
                                options={[
                                    { value: 'all', label: 'All Topics' },
                                    ...topicOptions.map((topic) => ({
                                        value: topic,
                                        label: topic,
                                    })),
                                ]}
                            />

                            <FilterDropdown
                                label="Status"
                                value={statusFilter}
                                onChange={setStatusFilter}
                                options={[
                                    { value: 'all', label: 'All Status' },
                                    { value: 'attempted', label: 'Attempted' },
                                    { value: 'not_attempted', label: 'Not Attempted' },
                                ]}
                            />

                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery('');
                                    setTopicFilter('all');
                                    setStatusFilter('all');
                                }}
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:border-emerald-400/30 hover:bg-emerald-500/10"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                                {filteredQuizzes.map((quiz) => {
                                    const stats = quizStats[String(quiz._id)] || null;
                                    const isAttempted = Boolean(stats?.attempts > 0);
                                    const statusLabel = isAttempted
                                        ? stats?.passed
                                            ? 'Passed'
                                            : 'Attempted'
                                        : 'Not attempted';
                                    const statusClass = isAttempted
                                        ? stats?.passed
                                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25'
                                            : 'bg-amber-500/15 text-amber-300 border-amber-500/25'
                                        : 'bg-white/5 text-white/60 border-white/10';

                                    return (
                                        <div
                                            key={quiz._id}
                                            className={`rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02] ${
                                                isAttempted
                                                    ? 'bg-emerald-500/5 border-emerald-400/30'
                                                    : 'bg-white/10 border-white/10 hover:border-emerald-400/30'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <h3 className="truncate text-lg sm:text-xl font-semibold text-white mb-1">
                                                        {quiz.title}
                                                    </h3>
                                                    <p className="text-sm sm:text-base text-white/80">
                                                        Topic: {quiz.topic}
                                                    </p>
                                                </div>
                                                <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${statusClass}`}>
                                                    {statusLabel}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mt-4">
                                                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs sm:text-sm border border-emerald-500/20">
                                                    Pool: {getQuizPoolLabel(quiz)}
                                                </span>
                                                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs sm:text-sm border border-cyan-500/20">
                                                    Attempt: {quiz.attemptQuestionCount || (Array.isArray(quiz.questions) ? quiz.questions.length : 'N/A')} random
                                                </span>
                                                <span className="px-3 py-1 rounded-full bg-white/5 text-white/70 text-xs sm:text-sm border border-white/10">
                                                    Time: {quiz.timeLimit} min
                                                </span>
                                                {isAttempted && (
                                                    <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs sm:text-sm border border-amber-500/20">
                                                        Attempts: {stats.attempts}
                                                    </span>
                                                )}
                                            </div>

                                            {isAttempted && (
                                                <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div>
                                                            <p className="text-xs uppercase tracking-[0.18em] text-white/40">Latest Score</p>
                                                            <p className="mt-1 text-lg font-semibold text-white">{stats.latestScore}%</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs uppercase tracking-[0.18em] text-white/40">Best Score</p>
                                                            <p className="mt-1 text-lg font-semibold text-emerald-300">{stats.bestScore}%</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className={`mt-5 grid gap-3 ${isAttempted && stats.latestSubmissionId ? 'sm:grid-cols-2' : 'grid-cols-1'}`}>
                                                <button
                                                    onClick={() => handleStartQuiz(quiz._id)}
                                                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-2.5 sm:py-2 px-4 text-sm sm:text-base rounded-lg transition-all duration-300 shadow-lg"
                                                >
                                                    {isAttempted ? 'Retake Quiz' : 'Start Quiz'}
                                                </button>

                                                {isAttempted && stats.latestSubmissionId && (
                                                    <button
                                                        onClick={() => handleViewResult(stats.latestSubmissionId)}
                                                        className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 sm:py-2 px-4 text-sm sm:text-base font-medium text-white transition-colors hover:border-emerald-400/30 hover:bg-emerald-500/10"
                                                    >
                                                        View Result
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {filteredQuizzes.length === 0 && (
                                <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center">
                                    <h3 className="text-xl font-semibold text-white">No quizzes found</h3>
                                    <p className="mt-2 text-sm text-white/60">
                                        Try a different topic, status, or search term.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setTopicFilter('all');
                                            setStatusFilter('all');
                                        }}
                                        className="mt-5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-sm font-medium text-white"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Quiz;
