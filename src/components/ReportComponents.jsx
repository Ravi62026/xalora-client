import React from 'react';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

/**
 * QA Card Component
 * Displays a single question-answer pair with evaluation
 */
export const QACard = ({ qa, index }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getQualityBadge = (quality) => {
        const badges = {
            excellent: { color: 'green', icon: CheckCircle, text: 'Excellent' },
            good: { color: 'blue', icon: CheckCircle, text: 'Good' },
            fair: { color: 'yellow', icon: AlertCircle, text: 'Fair' },
            poor: { color: 'red', icon: XCircle, text: 'Poor' },
            incomplete: { color: 'gray', icon: AlertCircle, text: 'Incomplete' }
        };
        return badges[quality] || badges.fair;
    };

    const badge = getQualityBadge(qa.evaluation?.overallQuality);
    const BadgeIcon = badge.icon;

    const avgScore = Math.round((
        (qa.evaluation?.clarity || 0) +
        (qa.evaluation?.completeness || 0) +
        (qa.evaluation?.relevance || 0) +
        (qa.evaluation?.depth || 0) +
        (qa.evaluation?.coherence || 0)
    ) / 5);

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-4">
            {/* Question Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-semibold text-slate-400">Q{index + 1}</span>
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full bg-${badge.color}-500/20 border border-${badge.color}-500/30`}>
                            <BadgeIcon className={`w-4 h-4 text-${badge.color}-400`} />
                            <span className={`text-xs font-semibold text-${badge.color}-400`}>{badge.text}</span>
                        </div>
                        <span className={`text-sm font-bold ${getScoreColor(avgScore)}`}>
                            {avgScore}/100
                        </span>
                    </div>
                    <p className="text-white font-medium">{qa.question}</p>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="ml-4 p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                </button>
            </div>

            {/* Answer */}
            <div className="bg-slate-900/50 rounded-lg p-4 mb-3">
                <p className="text-sm text-slate-400 mb-1">Your Answer:</p>
                <p className="text-slate-200">{qa.answer}</p>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="space-y-4 mt-4 pt-4 border-t border-slate-700">
                    {/* Evaluation Scores */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <div className="text-center">
                            <p className="text-xs text-slate-400 mb-1">Clarity</p>
                            <p className={`text-lg font-bold ${getScoreColor(qa.evaluation?.clarity)}`}>
                                {qa.evaluation?.clarity || 0}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-400 mb-1">Completeness</p>
                            <p className={`text-lg font-bold ${getScoreColor(qa.evaluation?.completeness)}`}>
                                {qa.evaluation?.completeness || 0}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-400 mb-1">Relevance</p>
                            <p className={`text-lg font-bold ${getScoreColor(qa.evaluation?.relevance)}`}>
                                {qa.evaluation?.relevance || 0}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-400 mb-1">Depth</p>
                            <p className={`text-lg font-bold ${getScoreColor(qa.evaluation?.depth)}`}>
                                {qa.evaluation?.depth || 0}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-400 mb-1">Coherence</p>
                            <p className={`text-lg font-bold ${getScoreColor(qa.evaluation?.coherence)}`}>
                                {qa.evaluation?.coherence || 0}
                            </p>
                        </div>
                    </div>

                    {/* Feedback */}
                    {qa.evaluation?.feedback && (
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                            <p className="text-sm text-blue-300">{qa.evaluation.feedback}</p>
                        </div>
                    )}

                    {/* Follow-ups */}
                    {qa.followups && qa.followups.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-slate-300">Follow-up Questions:</p>
                            {qa.followups.map((followup, idx) => (
                                <div key={idx} className="bg-slate-900/70 rounded-lg p-4 ml-4 border-l-2 border-purple-500">
                                    <p className="text-sm text-slate-300 mb-2">
                                        <span className="font-semibold">Q:</span> {followup.question}
                                    </p>
                                    <p className="text-sm text-slate-400 mb-2">
                                        <span className="font-semibold">A:</span> {followup.answer}
                                    </p>
                                    {followup.evaluation?.feedback && (
                                        <p className="text-xs text-blue-300 mt-2">{followup.evaluation.feedback}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

/**
 * Round Analysis Component
 * Displays strengths, weaknesses, and recommendations
 */
export const RoundAnalysis = ({ analysis }) => {
    if (!analysis) return null;

    return (
        <div className="grid md:grid-cols-3 gap-6 mt-6">
            {/* Strengths */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Strengths
                </h3>
                <ul className="space-y-2">
                    {analysis.strengths?.map((strength, idx) => (
                        <li key={idx} className="text-sm text-green-200 flex items-start gap-2">
                            <span className="text-green-400 mt-1">•</span>
                            <span>{strength}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Areas for Improvement
                </h3>
                <ul className="space-y-2">
                    {analysis.weaknesses?.map((weakness, idx) => (
                        <li key={idx} className="text-sm text-red-200 flex items-start gap-2">
                            <span className="text-red-400 mt-1">•</span>
                            <span>{weakness}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Recommendations */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Recommendations
                </h3>
                <ul className="space-y-2">
                    {analysis.recommendations?.map((rec, idx) => (
                        <li key={idx} className="text-sm text-blue-200 flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>{rec}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

/**
 * Skipped Round Banner
 */
export const SkippedRoundBanner = ({ skippedRounds }) => {
    if (!skippedRounds || skippedRounds.length === 0) return null;

    return (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Skipped Rounds
            </h3>
            <div className="flex flex-wrap gap-3">
                {skippedRounds.map((round, idx) => (
                    <div key={idx} className="bg-yellow-500/20 px-4 py-2 rounded-lg">
                        <p className="text-sm font-semibold text-yellow-300">{round.roundName}</p>
                        <p className="text-xs text-yellow-200 mt-1">{round.reason}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
