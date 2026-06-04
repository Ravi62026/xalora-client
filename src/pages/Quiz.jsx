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
        const submittedAtMs = submission?.submittedAt ? new Date(submission.submittedAt).getTime() : 0;
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
                <div className="min-h-screen xalora-grid-bg flex items-center justify-center px-4">
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center max-w-md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
                        <p className="text-gray-600">You need to be logged in to take quizzes.</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen xalora-grid-bg py-8 sm:py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-12">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 mb-8">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Quizzes</h1>
                                <p className="text-gray-600">Test your knowledge with our interactive quizzes</p>
                            </div>
                            <button
                                onClick={() => navigate('/quiz/analytics')}
                                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 w-fit"
                            >
                                📊 Analytics
                            </button>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                                <p className="text-xs font-semibold text-gray-600 uppercase">Total</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{quizzes.length}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                                <p className="text-xs font-semibold text-indigo-600 uppercase">Attempted</p>
                                <p className="text-2xl font-bold text-indigo-600 mt-1">{attemptedCount}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                                <p className="text-xs font-semibold text-green-600 uppercase">Passed</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">{passedCount}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                                <p className="text-xs font-semibold text-gray-600 uppercase">Not Attempted</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{Math.max(quizzes.length - attemptedCount, 0)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mb-8 space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search quizzes..."
                                    className="w-full px-0 py-2.5 bg-transparent border-b-2 border-gray-300 rounded-none focus:outline-none focus:border-indigo-600 text-gray-900 placeholder-gray-500 transition-all duration-200"
                                />
                            </div>

                            {/* Topic Filter */}
                            <select
                                value={topicFilter}
                                onChange={(e) => setTopicFilter(e.target.value)}
                                className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="all">All Topics</option>
                                {topicOptions.map((topic) => (
                                    <option key={topic} value={topic}>{topic}</option>
                                ))}
                            </select>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="all">All Status</option>
                                <option value="attempted">Attempted</option>
                                <option value="not_attempted">Not Attempted</option>
                            </select>

                            {/* Reset Button */}
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setTopicFilter('all');
                                    setStatusFilter('all');
                                }}
                                className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 hover:bg-gray-50 transition-all duration-200 font-medium"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Quiz Grid */}
                    {loading ? (
                        <div className="flex justify-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : filteredQuizzes.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-lg border border-gray-100 shadow-sm">
                            <p className="text-gray-600 mb-4">No quizzes found</p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setTopicFilter('all');
                                    setStatusFilter('all');
                                }}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200"
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredQuizzes.map((quiz) => {
                                const stats = quizStats[String(quiz._id)] || null;
                                const isAttempted = Boolean(stats?.attempts > 0);

                                return (
                                    <div
                                        key={quiz._id}
                                        className="bg-white rounded-lg border border-gray-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all duration-200 p-6"
                                    >
                                        {/* Title & Status */}
                                        <div className="flex justify-between items-start gap-3 mb-4">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                                                    {quiz.title}
                                                </h3>
                                                <p className="text-sm text-gray-600">📚 {quiz.topic}</p>
                                            </div>
                                            {isAttempted && (
                                                <span className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                                                    stats?.passed
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {stats?.passed ? '✓ Passed' : 'Attempted'}
                                                </span>
                                            )}
                                        </div>

                                        {/* Info Tags */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded">
                                                Pool: {getQuizPoolLabel(quiz)}
                                            </span>
                                            <span className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded">
                                                Questions: {quiz.attemptQuestionCount || 'Random'}
                                            </span>
                                            <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded">
                                                ⏱ {quiz.timeLimit}m
                                            </span>
                                        </div>

                                        {/* Scores */}
                                        {isAttempted && (
                                            <div className="bg-gray-50 rounded p-3 mb-4 grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-600 font-medium">Latest</p>
                                                    <p className="text-xl font-bold text-gray-900 mt-1">{stats.latestScore}%</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-600 font-medium">Best</p>
                                                    <p className="text-xl font-bold text-indigo-600 mt-1">{stats.bestScore}%</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Buttons */}
                                        <div className={`grid gap-2 ${isAttempted && stats.latestSubmissionId ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                            <button
                                                onClick={() => handleStartQuiz(quiz._id)}
                                                className="py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm"
                                            >
                                                {isAttempted ? 'Retake' : 'Start'}
                                            </button>
                                            {isAttempted && stats.latestSubmissionId && (
                                                <button
                                                    onClick={() => handleViewResult(stats.latestSubmissionId)}
                                                    className="py-2.5 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold rounded-lg transition-all duration-200 text-sm"
                                                >
                                                    Result
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Quiz;
