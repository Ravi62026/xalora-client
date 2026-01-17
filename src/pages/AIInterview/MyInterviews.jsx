import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import interviewService from '../../services/interviewService';
import { Calendar, FileText, TrendingUp, Eye, Loader2, AlertCircle, Trash2 } from 'lucide-react';

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
            created: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/30', label: 'Created' },
            in_progress: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', label: 'In Progress' },
            completed: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', label: 'Completed' },
            abandoned: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', label: 'Abandoned' },
        };
        const badge = badges[status] || badges.created;
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${badge.bg} ${badge.text} ${badge.border}`}>
                {badge.label}
            </span>
        );
    };

    const getHiringBadge = (decision) => {
        if (!decision) return null;
        const badges = {
            hire: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', label: '✓ Hire' },
            maybe: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', label: '⚠ Maybe' },
            reject: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', label: '✗ Reject' },
        };
        const badge = badges[decision.toLowerCase()] || badges.maybe;
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${badge.bg} ${badge.text} ${badge.border}`}>
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

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading your interviews...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">My AI Interviews</h1>
                <p className="text-sm sm:text-base text-gray-400">View all your interview sessions and reports</p>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-red-400 text-sm sm:text-base">{error}</p>
                </div>
            )}

            {/* Empty State */}
            {interviews.length === 0 && !error && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 sm:p-12 text-center">
                    <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No Interviews Yet</h3>
                    <p className="text-sm sm:text-base text-gray-400 mb-6">Start your first AI interview to see it here</p>
                    <button
                        onClick={() => navigate('/ai-interview/setup')}
                        className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
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
                            className="bg-gray-800/50 border border-gray-700 rounded-2xl p-5 sm:p-6 hover:border-blue-500/50 transition-all group relative"
                        >
                            {/* Delete Button */}
                            <button
                                onClick={() => handleDelete(interview.sessionId)}
                                disabled={deletingId === interview.sessionId}
                                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
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
                                    <h3 className="text-base sm:text-lg font-semibold text-white mb-1 line-clamp-1">
                                        {interview.candidateInfo?.name || 'Interview'}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-400 line-clamp-1">{interview.candidateInfo?.position || 'Position'}</p>
                                </div>
                                {getStatusBadge(interview.status)}
                            </div>

                            {/* Details */}
                            <div className="space-y-2 sm:space-y-3 mb-4">
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                                    <Calendar className="w-4 h-4 flex-shrink-0" />
                                    <span>{formatDate(interview.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                                    <FileText className="w-4 h-4 flex-shrink-0" />
                                    <span>{interview.roundCount || 0} Round{interview.roundCount !== 1 ? 's' : ''}</span>
                                </div>
                                {interview.hasReport && interview.reportScore !== null && (
                                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                                        <TrendingUp className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                        <span className="text-blue-400 font-semibold">{interview.reportScore}/100</span>
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
                            <div className="pt-4 border-t border-gray-700">
                                {interview.hasReport ? (
                                    <button
                                        onClick={() => handleViewDetails(interview.sessionId)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors text-sm sm:text-base"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View Report
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => navigate(`/ai-interview/${interview.sessionId}/round/${interview.completedRounds?.[interview.completedRounds.length - 1] || 'formal_qa'}`)}
                                        className="w-full px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors text-sm sm:text-base"
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
    );
};

export default MyInterviews;
