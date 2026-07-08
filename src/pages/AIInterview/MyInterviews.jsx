import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import interviewService from '../../services/interviewService';
import { Calendar, FileText, TrendingUp, Eye, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { Layout } from '../../components';

const MyInterviews = () => {
    const navigate = useNavigate();
    const [interviews, setInterviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {
        try {
            setIsLoading(true);
            const response = await interviewService.getMyInterviews();
            setInterviews(response.data.interviews || []);
        } catch (err) {
            console.error('Failed to fetch interviews:', err);
            setError(err.response?.data?.message || 'Failed to load interviews');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (sessionId) => {
        if (!window.confirm('Are you sure you want to delete this interview? This action cannot be undone.')) {
            return;
        }

        try {
            setDeletingId(sessionId);
            await interviewService.deleteInterview(sessionId);
            setInterviews(interviews.filter(i => i.sessionId !== sessionId));
        } catch (err) {
            console.error('Failed to delete interview:', err);
            alert(err.response?.data?.message || 'Failed to delete interview');
        } finally {
            setDeletingId(null);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            created: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', label: 'Created' },
            in_progress: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', label: 'In Progress' },
            completed: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', label: 'Completed' },
            abandoned: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', label: 'Abandoned' },
        };
        const badge = badges[status] || badges.created;
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}>
                {badge.label}
            </span>
        );
    };

    const getHiringBadge = (decision) => {
        if (!decision) return null;
        const badges = {
            hire: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: '✓ Hire' },
            maybe: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: '⚠ Maybe' },
            reject: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: '✗ Reject' },
        };
        const badge = badges[decision.toLowerCase()] || badges.maybe;
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}>
                {badge.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleViewDetails = (sessionId) => {
        navigate(`/ai-interview/${sessionId}/report`);
    };

    const ROUND_ORDER = ['formal_qa', 'technical', 'coding', 'system_design', 'behavioral'];

    const getNextRound = (interview) => {
        if (interview.interviewMode === 'specific') {
            return interview.specificRound || 'formal_qa';
        }
        const completed = interview.completedRounds || [];
        return ROUND_ORDER.find(r => !completed.includes(r)) || 'formal_qa';
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center px-4">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                        <p className="text-slate-500">Loading your interviews...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mb-2">My AI Interviews</h1>
                    <p className="text-sm sm:text-base text-slate-500">View all your interview sessions and reports</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-red-600 text-sm sm:text-base">{error}</p>
                    </div>
                )}

                {/* Empty State */}
                {interviews.length === 0 && !error && (
                    <div className="bg-white/80 border border-slate-200 rounded-2xl p-8 sm:p-12 text-center shadow-sm">
                        <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">No Interviews Yet</h3>
                        <p className="text-sm sm:text-base text-slate-500 mb-6">Start your first AI interview to see it here</p>
                        <button
                            onClick={() => navigate('/ai-interview/setup')}
                            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-100 hover:shadow-indigo-200"
                        >
                            Start New Interview
                        </button>
                    </div>
                )}

                {/* Interviews Grid */}
                {interviews.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {interviews.map((interview) => (
                            <div
                                key={interview.sessionId}
                                className="bg-white/80 border border-slate-200 rounded-2xl p-5 sm:p-6 hover:border-indigo-500/50 hover:shadow-md transition-all group relative"
                            >
                                {/* Delete Button */}
                                <button
                                    onClick={() => handleDelete(interview.sessionId)}
                                    disabled={deletingId === interview.sessionId}
                                    className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg text-red-500 transition-colors disabled:opacity-50"
                                    title="Delete Interview"
                                >
                                    {deletingId === interview.sessionId ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                </button>

                                {/* Header */}
                                <div className="flex justify-between items-start mb-4 pr-10">
                                    <div>
                                        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 line-clamp-1">
                                            {interview.candidateInfo?.name || 'Interview'}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-slate-500 line-clamp-1">{interview.candidateInfo?.position || 'Position'}</p>
                                    </div>
                                    {getStatusBadge(interview.status)}
                                </div>

                                {/* Details */}
                                <div className="space-y-2 sm:space-y-3 mb-4">
                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
                                        <Calendar className="w-4 h-4 flex-shrink-0" />
                                        <span>{formatDate(interview.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
                                        <FileText className="w-4 h-4 flex-shrink-0" />
                                        <span>{interview.roundCount || 0} Round{interview.roundCount !== 1 ? 's' : ''}</span>
                                    </div>
                                    {interview.hasReport && interview.reportScore !== null && (
                                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                                            <TrendingUp className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                                            <span className="text-indigo-600 font-bold">{interview.reportScore}/100</span>
                                        </div>
                                    )}
                                </div>

                                {/* Hiring Decision */}
                                {interview.hiringDecision && (
                                    <div className="mb-4">
                                        {getHiringBadge(interview.hiringDecision)}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="pt-4 border-t border-slate-100">
                                    {interview.hasReport ? (
                                        <button
                                            onClick={() => handleViewDetails(interview.sessionId)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all text-sm sm:text-base shadow-sm"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View Report
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => navigate(`/ai-interview/${interview.sessionId}/round/${getNextRound(interview)}`)}
                                            className="w-full px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all text-sm sm:text-base"
                                        >
                                            Continue Interview
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default MyInterviews;
