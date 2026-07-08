import React from 'react';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

/**
 * QA Card Component
 * Displays a single question-answer pair with evaluation
 */
export const QACard = ({ qa, index }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-700 font-bold';
        if (score >= 60) return 'text-yellow-700 font-bold';
        return 'text-red-700 font-bold';
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

    const validScores = [
        qa.evaluation?.clarity,
        qa.evaluation?.completeness,
        qa.evaluation?.relevance,
        qa.evaluation?.depth,
        qa.evaluation?.coherence
    ].filter(s => s > 0);
    const avgScore = validScores.length > 0
        ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
        : 0;

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-4 shadow-sm">
            {/* Question Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-semibold text-slate-400">Q{index + 1}</span>
                        <div
                            className="flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-semibold"
                            style={{
                                backgroundColor: `${badge.color === 'green' ? '#10b981' : badge.color === 'blue' ? '#3b82f6' : badge.color === 'yellow' ? '#eab308' : '#ef4444'}10`,
                                borderColor: `${badge.color === 'green' ? '#10b981' : badge.color === 'blue' ? '#3b82f6' : badge.color === 'yellow' ? '#eab308' : '#ef4444'}4d`,
                            }}
                        >
                            <BadgeIcon
                                className="w-4 h-4"
                                style={{ color: badge.color === 'green' ? '#047857' : badge.color === 'blue' ? '#1d4ed8' : badge.color === 'yellow' ? '#a16207' : '#b91c1c' }}
                            />
                            <span
                                style={{ color: badge.color === 'green' ? '#047857' : badge.color === 'blue' ? '#1d4ed8' : badge.color === 'yellow' ? '#a16207' : '#b91c1c' }}
                            >{badge.text}</span>
                        </div>
                        <span className={`text-sm font-bold ${getScoreColor(avgScore)}`}>
                            {avgScore}/100
                        </span>
                    </div>
                    <p className="text-slate-900 font-bold">{qa.question}</p>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="ml-4 p-2 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200/60"
                >
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-500" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                    )}
                </button>
            </div>

            {/* Answer */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-4 mb-3">
                <p className="text-sm text-slate-500 mb-1 font-semibold">Your Answer:</p>
                <p className="text-slate-700 font-medium">{qa.answer}</p>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="space-y-4 mt-4 pt-4 border-t border-slate-150">
                    {/* Evaluation Scores */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <div className="text-center">
                            <p className="text-xs text-slate-400 mb-1 font-bold uppercase tracking-wider">Clarity</p>
                            <p className={`text-lg font-bold ${getScoreColor(qa.evaluation?.clarity)}`}>
                                {qa.evaluation?.clarity || 0}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-400 mb-1 font-bold uppercase tracking-wider">Completeness</p>
                            <p className={`text-lg font-bold ${getScoreColor(qa.evaluation?.completeness)}`}>
                                {qa.evaluation?.completeness || 0}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-400 mb-1 font-bold uppercase tracking-wider">Relevance</p>
                            <p className={`text-lg font-bold ${getScoreColor(qa.evaluation?.relevance)}`}>
                                {qa.evaluation?.relevance || 0}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-400 mb-1 font-bold uppercase tracking-wider">Depth</p>
                            <p className={`text-lg font-bold ${getScoreColor(qa.evaluation?.depth)}`}>
                                {qa.evaluation?.depth || 0}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-400 mb-1 font-bold uppercase tracking-wider">Coherence</p>
                            <p className={`text-lg font-bold ${getScoreColor(qa.evaluation?.coherence)}`}>
                                {qa.evaluation?.coherence || 0}
                            </p>
                        </div>
                    </div>

                    {/* Feedback */}
                    {qa.evaluation?.feedback && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800 font-medium">{qa.evaluation.feedback}</p>
                        </div>
                    )}

                    {/* Follow-ups */}
                    {qa.followups && qa.followups.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-sm font-bold text-slate-800">Follow-up Questions:</p>
                            {qa.followups.map((followup, idx) => (
                                <div key={idx} className="bg-slate-50 rounded-lg p-4 ml-4 border-l-2 border-indigo-500 border border-slate-200">
                                    <p className="text-sm text-slate-700 mb-2">
                                        <span className="font-bold text-slate-900">Q:</span> {followup.question}
                                    </p>
                                    <p className="text-sm text-slate-600 mb-2">
                                        <span className="font-bold text-slate-900">A:</span> {followup.answer}
                                    </p>
                                    {followup.evaluation?.feedback && (
                                        <p className="text-xs text-blue-800 mt-2 font-medium">{followup.evaluation.feedback}</p>
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
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    Strengths
                </h3>
                <ul className="space-y-2">
                    {analysis.strengths?.map((strength, idx) => (
                        <li key={idx} className="text-sm text-emerald-800 font-medium flex items-start gap-2">
                            <span className="text-emerald-600 mt-1">•</span>
                            <span>{strength}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    Areas for Improvement
                </h3>
                <ul className="space-y-2">
                    {analysis.weaknesses?.map((weakness, idx) => (
                        <li key={idx} className="text-sm text-red-800 font-medium flex items-start gap-2">
                            <span className="text-red-600 mt-1">•</span>
                            <span>{weakness}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Recommendations */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    Recommendations
                </h3>
                <ul className="space-y-2">
                    {analysis.recommendations?.map((rec, idx) => (
                        <li key={idx} className="text-sm text-blue-800 font-medium flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
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
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-yellow-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                Skipped Rounds
            </h3>
            <div className="flex flex-wrap gap-3">
                {skippedRounds.map((round, idx) => (
                    <div key={idx} className="bg-white border border-yellow-200/80 px-4 py-2 rounded-lg">
                        <p className="text-sm font-bold text-yellow-800">{round.roundName}</p>
                        <p className="text-xs text-yellow-700 mt-1">{round.reason}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
