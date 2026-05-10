/**
 * ConversationalInterview Component
 * 
 * PURPOSE: Full-screen conversational interview UI that replaces the manual
 * (StructuredInterview) interface when `interviewStyle === 'conversational'`.
 * 
 * FEATURES:
 * - Live status indicator (speaking/listening/thinking/muted)
 * - Scrolling real-time transcript (Agent + Candidate)
 * - Voice/Text dual-mode toggle
 * - Action buttons: Ask, Pause, Mute, End Answer
 * - Turn counter
 * - Evaluation reveal animation on completion
 * - Mic quality pre-check integration
 * 
 * USES: useConversationalInterview hook for all Socket.IO + audio logic
 */

import { useState, useEffect, useRef, useMemo } from "react";
import {
    Mic, MicOff, Pause, Play, MessageSquare, PhoneOff,
    Volume2, VolumeX, Send, Loader2, HelpCircle, SkipForward,
    CheckCircle, AlertCircle, Sparkles, Radio, Headphones,
    MessageCircle, Clock, BarChart3, WifiOff, RefreshCw
} from "lucide-react";
import useConversationalInterview from "../../hooks/useConversationalInterview";
import MicQualityCheck from "./MicQualityCheck";

// ── Status Indicator Configs ──
const STATUS_CONFIG = {
    agent_speaking: {
        color: "blue",
        pulse: "bg-blue-500",
        ring: "ring-blue-500/30",
        label: "AI is speaking",
        icon: Volume2,
    },
    user_turn: {
        color: "emerald",
        pulse: "bg-emerald-500",
        ring: "ring-emerald-500/30",
        label: "Your turn — speak now",
        icon: Mic,
    },
    thinking: {
        color: "amber",
        pulse: "bg-amber-500",
        ring: "ring-amber-500/30",
        label: "AI is thinking...",
        icon: Loader2,
    },
    muted: {
        color: "red",
        pulse: "bg-red-500",
        ring: "ring-red-500/30",
        label: "Muted",
        icon: MicOff,
    },
    paused: {
        color: "slate",
        pulse: "bg-slate-500",
        ring: "ring-slate-500/30",
        label: "Paused",
        icon: Pause,
    },
    connecting: {
        color: "purple",
        pulse: "bg-purple-500",
        ring: "ring-purple-500/30",
        label: "Connecting...",
        icon: Loader2,
    },
    reconnecting: {
        color: "amber",
        pulse: "bg-amber-500",
        ring: "ring-amber-500/30",
        label: "Reconnecting...",
        icon: RefreshCw,
    },
};

/**
 * @param {Object} props
 * @param {string} props.sessionId
 * @param {string} props.roundType
 * @param {string} props.personality - "professional" | "mentoring" | "challenging"
 * @param {string} props.candidateName
 * @param {Object} props.currentQuestionData - { text, topic, difficulty }
 * @param {number} props.questionNumber
 * @param {number} props.maxQuestions
 * @param {Function} props.onRoundComplete - Called when all questions done
 * @param {Function} props.onFallbackToManual - Called to switch to manual mode
 * @param {string} props.userId
 */
export default function ConversationalInterview({
    sessionId,
    roundType,
    personality = "professional",
    candidateName = "Candidate",
    currentQuestionData = null,
    questionNumber = 1,
    maxQuestions = 5,
    onRoundComplete,
    onFallbackToManual,
    onFetchNextQuestion,
    userId,
}) {
    // ── Phase: mic_check | active | completed ──
    const [phase, setPhase] = useState("mic_check");
    const [textInput, setTextInput] = useState("");
    const [showEvaluation, setShowEvaluation] = useState(false);
    const transcriptEndRef = useRef(null);
    const textInputRef = useRef(null);

    // ── Hook ──
    const {
        connect, disconnect, status, error, mode,
        initSession, pauseSession, resumeSession, endSession,
        sendUtterance,
        startVoiceMode, stopVoiceMode, updateQuestion,
        deepgramReady,
        mute, unmute, isMuted, checkMicQuality,
        transcript, agentText, isAgentSpeaking,
        isUserSpeaking, evaluation, turnInfo, intent,
        clearError,
        silenceWarning, networkStatus, reconnectInfo, reconnectVoice
    } = useConversationalInterview({
        sessionId,
        roundType,
        personality,
        candidateName,
        currentQuestion: currentQuestionData?.text || "",
        autoConnect: false,
        onFallbackToManual,
    });

    // ── Determine visual status ──
    const activeStatus = useMemo(() => {
        if (status === "connecting" || status === "reconnecting") return status;
        if (status === "paused")  return "paused";
        if (isMuted)              return "muted";
        if (isAgentSpeaking)      return "agent_speaking";
        if (intent?.intent === "THINKING_PAUSE") return "thinking";
        return "user_turn";
    }, [status, isMuted, isAgentSpeaking, intent]);

    const statusCfg = STATUS_CONFIG[activeStatus] || STATUS_CONFIG.connecting;
    const StatusIcon = statusCfg.icon;

    // ── Auto-scroll transcript ──
    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [transcript]);

    // ── After mic check, connect ──
    const handleMicCheckComplete = (quality) => {
        setPhase("active");
        connect();
    };

    // ── Init session when connected ──
    useEffect(() => {
        if (status === "connected" && phase === "active") {
            initSession(userId);
            // Start voice mode if Deepgram is ready
            if (currentQuestionData?.text) {
                startVoiceMode(currentQuestionData.text);
            }
        }
    }, [status, phase]);

    // ── Update question mid-session ──
    useEffect(() => {
        if (deepgramReady && currentQuestionData?.text) {
            updateQuestion(currentQuestionData.text, questionNumber - 1);
        }
    }, [currentQuestionData?.text, deepgramReady]);

    // ── Automatic next question fetch ──
    const handledNextStepRef = useRef(false);

    useEffect(() => {
        // Reset handled flag when the next step changes (e.g. to "waiting_for_candidate" or null)
        if (turnInfo?.nextStep !== "next_question") {
            handledNextStepRef.current = false;
        }

        // Fetch the next question automatically if the backend decided it's time
        if (turnInfo?.nextStep === "next_question" && !handledNextStepRef.current) {
            handledNextStepRef.current = true;
            console.log("🗣️ [Conversational] Backend requested next question, fetching automatically...");
            onFetchNextQuestion?.();
        }
    }, [turnInfo?.nextStep, onFetchNextQuestion]);

    // ── Evaluation reveal on round complete ──
    useEffect(() => {
        if (evaluation && turnInfo?.action === "round_complete") {
            setTimeout(() => {
                setShowEvaluation(true);
                setPhase("completed");
            }, 500);
        }
    }, [evaluation, turnInfo]);

    // ── Cleanup on unmount ──
    useEffect(() => {
        return () => disconnect();
    }, []);

    // ── Text mode send ──
    const handleSendText = () => {
        if (!textInput.trim()) return;
        sendUtterance(textInput.trim(), questionNumber - 1);
        setTextInput("");
        textInputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendText();
        }
    };

    // ═══════════════════════════════════════════════════════════════
    //  RENDER: Mic Quality Check Phase
    // ═══════════════════════════════════════════════════════════════
    if (phase === "mic_check") {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-full max-w-md space-y-4">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-white mb-2">
                            Before We Begin...
                        </h2>
                        <p className="text-sm text-slate-400">
                            Let's make sure your microphone is working properly for the
                            conversational interview.
                        </p>
                    </div>

                    <MicQualityCheck
                        onComplete={handleMicCheckComplete}
                        onSkip={() => {
                            // Switch to text mode fallback
                            setPhase("active");
                            connect();
                        }}
                    />

                    {onFallbackToManual && (
                        <button
                            onClick={onFallbackToManual}
                            className="w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors py-2"
                        >
                            Or switch to Manual Mode →
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // ═══════════════════════════════════════════════════════════════
    //  RENDER: Active Conversation
    // ═══════════════════════════════════════════════════════════════
    return (
        <div className="flex flex-col h-full min-h-[70vh] bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-slate-700/50 overflow-hidden">

            {/* ── Top Bar ── */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
                {/* Status Indicator */}
                <div className="flex items-center gap-3">
                    <div className={`relative w-10 h-10 rounded-full flex items-center justify-center ${statusCfg.ring} ring-4`}>
                        <div className={`absolute inset-0 rounded-full ${statusCfg.pulse} opacity-20 animate-ping`} />
                        <div className={`w-8 h-8 rounded-full ${statusCfg.pulse} flex items-center justify-center`}>
                            <StatusIcon className={`w-4 h-4 text-white ${activeStatus === "thinking" || activeStatus === "connecting" ? "animate-spin" : ""}`} />
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-white">{statusCfg.label}</p>
                        <p className="text-[10px] text-slate-400">
                            {mode === "voice" ? "Voice Mode" : "Text Mode"}
                            {deepgramReady && " · Deepgram Active"}
                        </p>
                    </div>
                </div>

                {/* Turn Counter */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/50 rounded-lg border border-slate-700">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-xs font-medium text-slate-300">
                            Q{questionNumber}/{maxQuestions}
                        </span>
                    </div>
                    {turnInfo?.turn > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/50 rounded-lg border border-slate-700">
                            <MessageCircle className="w-3 h-3 text-slate-400" />
                            <span className="text-xs font-medium text-slate-300">
                                Turn {turnInfo.turn}/{turnInfo.maxTurns}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Error Banner ── */}
            {error && (
                <div className="mx-4 mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-xs text-red-300">{error}</p>
                    </div>
                    <button onClick={clearError} className="text-red-400 hover:text-red-300 text-xs">✕</button>
                </div>
            )}

            {/* ── Offline Banner ── */}
            {networkStatus === "offline" && (
                <div className="mx-4 mt-3 p-3 bg-slate-800 border border-slate-600 rounded-xl flex items-center gap-2">
                    <WifiOff className="w-4 h-4 text-slate-400" />
                    <p className="text-xs text-slate-300 flex-1">No internet connection — pausing session</p>
                </div>
            )}

            {/* ── Silence Warning ── */}
            {silenceWarning && (
                <div className={`mx-4 mt-3 p-3 rounded-xl flex items-center gap-2 ${
                    silenceWarning === "autopause"
                        ? "bg-red-500/10 border border-red-500/30"
                        : "bg-amber-500/10 border border-amber-500/30"
                }`}>
                    <Clock className={`w-4 h-4 ${silenceWarning === "autopause" ? "text-red-400" : "text-amber-400"}`} />
                    <p className={`text-xs flex-1 ${silenceWarning === "autopause" ? "text-red-300" : "text-amber-300"}`}>
                        {silenceWarning === "autopause"
                            ? "Session auto-paused due to silence. Click Resume when ready."
                            : "Take your time — the interviewer is listening when you're ready."}
                    </p>
                </div>
            )}

            {/* ── Transcript Area ── */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-700">
                {transcript.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                            <Radio className="w-7 h-7 text-purple-400" />
                        </div>
                        <h3 className="text-base font-semibold text-white mb-2">
                            Conversational Interview
                        </h3>
                        <p className="text-sm text-slate-400 max-w-sm">
                            {status === "connecting"
                                ? "Connecting to AI interviewer..."
                                : status === "connected"
                                ? "Connected! AI will speak the first question shortly..."
                                : "Speak naturally — the AI interviewer will listen and respond in real-time."}
                        </p>
                    </div>
                )}

                {transcript.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                msg.role === "user"
                                    ? "bg-blue-600/20 border border-blue-500/20 text-blue-50"
                                    : "bg-slate-800/60 border border-slate-700/40 text-slate-200"
                            }`}
                        >
                            {/* Role label */}
                            <div className="flex items-center gap-1.5 mb-1">
                                {msg.role === "agent" ? (
                                    <Sparkles className="w-3 h-3 text-purple-400" />
                                ) : (
                                    <Mic className="w-3 h-3 text-blue-400" />
                                )}
                                <span className={`text-[10px] font-medium uppercase tracking-wider ${
                                    msg.role === "agent" ? "text-purple-400" : "text-blue-400"
                                }`}>
                                    {msg.role === "agent" ? "AI Interviewer" : "You"}
                                </span>
                                {msg.intent && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400 ml-1">
                                        {msg.intent}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {msg.text}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Typing indicator */}
                {(activeStatus === "thinking" || activeStatus === "agent_speaking") && (
                    <div className="flex justify-start">
                        <div className="bg-slate-800/60 border border-slate-700/40 rounded-2xl px-4 py-3">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Sparkles className="w-3 h-3 text-purple-400" />
                                <span className="text-[10px] font-medium uppercase tracking-wider text-purple-400">
                                    AI Interviewer
                                </span>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Reconnecting Overlay ── */}
                {status === "reconnecting" && (
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-2xl">
                        <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mb-3" />
                        <p className="text-sm font-semibold text-white mb-1">Reconnecting...</p>
                        {reconnectInfo && (
                            <p className="text-xs text-slate-400 mb-4">
                                Attempt {reconnectInfo.attempt}/5
                                {reconnectInfo.delayMs ? ` · retry in ${(reconnectInfo.delayMs / 1000).toFixed(0)}s` : ""}
                            </p>
                        )}
                        <button
                            onClick={reconnectVoice}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-xl transition-all"
                        >
                            Retry Now
                        </button>
                    </div>
                )}
            </div>

            {/* ── Evaluation Panel (animated reveal) ── */}
            {showEvaluation && evaluation && (
                <div className="mx-4 mb-3 p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-blue-500/5 border border-emerald-500/30 animate-in slide-in-from-bottom duration-500">
                    <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-bold text-emerald-400">Answer Evaluation</span>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {[
                            { label: "Clarity", value: evaluation.clarity },
                            { label: "Completeness", value: evaluation.completeness },
                            { label: "Depth", value: evaluation.depth },
                            { label: "Overall", value: evaluation.overall },
                        ].map(({ label, value }) => (
                            <div key={label} className="text-center">
                                <div className="text-lg font-bold text-white">{value || "—"}</div>
                                <div className="text-[10px] text-slate-400">{label}</div>
                            </div>
                        ))}
                    </div>
                    {evaluation.feedback && (
                        <p className="text-xs text-slate-300 mt-3 pt-3 border-t border-slate-700/50">
                            {evaluation.feedback}
                        </p>
                    )}
                </div>
            )}

            {/* ── Action Bar ── */}
            <div className="px-4 py-3 bg-slate-800/30 border-t border-slate-700/50">
                {/* Text input (for text mode or supplemental typing) */}
                {mode === "text" && (
                    <div className="flex gap-2 mb-3">
                        <textarea
                            ref={textInputRef}
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your answer here... (or use voice mode)"
                            className="flex-1 px-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm resize-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none placeholder-slate-500"
                            rows={2}
                        />
                        <button
                            onClick={handleSendText}
                            disabled={!textInput.trim()}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl transition-all self-end"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        {/* Mute/Unmute */}
                        <button
                            onClick={isMuted ? unmute : mute}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                                isMuted
                                    ? "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30"
                                    : "bg-slate-700/50 border border-slate-600 text-slate-300 hover:bg-slate-700"
                            }`}
                        >
                            {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                            {isMuted ? "Unmute" : "Mute"}
                        </button>

                        {/* Pause/Resume */}
                        <button
                            onClick={status === "paused" ? resumeSession : pauseSession}
                            className="flex items-center gap-1.5 px-3 py-2 bg-slate-700/50 border border-slate-600 text-slate-300 rounded-xl text-xs font-medium hover:bg-slate-700 transition-all"
                        >
                            {status === "paused" ? (
                                <><Play className="w-3.5 h-3.5" /> Resume</>
                            ) : (
                                <><Pause className="w-3.5 h-3.5" /> Pause</>
                            )}
                        </button>

                        {/* Ask Question */}
                        <button
                            onClick={() => {
                                const question = prompt("What would you like to ask the interviewer?");
                                if (question) sendUtterance(question, questionNumber - 1);
                            }}
                            className="flex items-center gap-1.5 px-3 py-2 bg-slate-700/50 border border-slate-600 text-slate-300 rounded-xl text-xs font-medium hover:bg-slate-700 transition-all"
                        >
                            <HelpCircle className="w-3.5 h-3.5" />
                            Ask
                        </button>
                    </div>

                    <div className="flex gap-2">
                        {/* End Answer (force submit) */}
                        <button
                            onClick={() => sendUtterance("[END_ANSWER]", questionNumber - 1)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-amber-600/20 border border-amber-500/30 text-amber-400 rounded-xl text-xs font-medium hover:bg-amber-600/30 transition-all"
                        >
                            <SkipForward className="w-3.5 h-3.5" />
                            End Answer
                        </button>

                        {/* End Call */}
                        <button
                            onClick={() => {
                                if (window.confirm("Are you sure you want to end this interview?")) {
                                    endSession();
                                    onRoundComplete?.();
                                }
                            }}
                            className="flex items-center gap-1.5 px-3 py-2 bg-red-600/20 border border-red-500/30 text-red-400 rounded-xl text-xs font-medium hover:bg-red-600/30 transition-all"
                        >
                            <PhoneOff className="w-3.5 h-3.5" />
                            End
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
