import { useState, useEffect, useRef, useMemo } from "react";
import { Mic, MicOff, Pause, Play, PhoneOff, Volume2, Loader2, AlertCircle, Sparkles, WifiOff, RefreshCw, BarChart3 } from "lucide-react";
import useConversationalInterview from "../../hooks/useConversationalInterview";
import MicQualityCheck from "./MicQualityCheck";

// ── Voice waveform bars (pure CSS animation) ──
function VoiceWave({ active, color = "violet", bars = 5 }) {
    return (
        <div className="flex items-center gap-[3px] h-6">
            {Array.from({ length: bars }).map((_, i) => (
                <div
                    key={i}
                    className={`rounded-full transition-all ${active ? `bg-${color}-400` : "bg-slate-600"}`}
                    style={{
                        width: 3,
                        height: active ? `${Math.random() * 60 + 40}%` : "20%",
                        animation: active ? `wave 0.8s ease-in-out ${i * 0.12}s infinite alternate` : "none",
                    }}
                />
            ))}
        </div>
    );
}

// ── AI Avatar orb ──
function AIOrb({ speaking, thinking, connecting, userTalking }) {
    return (
        <div className="relative flex items-center justify-center">
            {/* Outer glow rings */}
            {speaking && (
                <>
                    <div className="absolute w-52 h-52 rounded-full bg-violet-500/10 animate-ping" style={{ animationDuration: "1.5s" }} />
                    <div className="absolute w-44 h-44 rounded-full bg-violet-500/15 animate-ping" style={{ animationDuration: "1.2s", animationDelay: "0.3s" }} />
                </>
            )}
            {/* Main orb */}
            <div className={`relative w-36 h-36 rounded-full flex items-center justify-center transition-all duration-500 ${
                connecting   ? "bg-gradient-to-br from-slate-700 to-slate-800" :
                thinking     ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20 ring-4 ring-amber-500/30" :
                speaking     ? "bg-gradient-to-br from-violet-600/30 to-blue-600/30 ring-4 ring-violet-500/40" :
                userTalking  ? "bg-gradient-to-br from-cyan-600/20 to-emerald-600/20 ring-4 ring-cyan-400/40" :
                               "bg-gradient-to-br from-emerald-600/20 to-teal-600/20 ring-4 ring-emerald-500/30"
            }`}>
                {/* Inner shimmer */}
                <div className={`absolute inset-3 rounded-full opacity-50 ${
                    connecting ? "bg-slate-600/40" :
                    thinking   ? "bg-amber-500/20 animate-pulse" :
                    speaking   ? "bg-violet-500/20 animate-pulse" :
                                 "bg-emerald-500/10"
                }`} />
                {/* Icon */}
                <div className="relative z-10">
                    {connecting ? (
                        <Loader2 className="w-10 h-10 text-slate-400 animate-spin" />
                    ) : thinking ? (
                        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
                    ) : speaking ? (
                        <Volume2 className="w-10 h-10 text-violet-300" />
                    ) : (
                        <Mic className="w-10 h-10 text-emerald-300" />
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ConversationalInterview({
    sessionId, roundType, personality = "professional",
    candidateName = "Candidate", currentQuestionData = null,
    questionNumber = 1, maxQuestions = 5,
    interviewMode = "specific",
    interviewDuration = 900,
    interviewTopic = null,
    onRoundComplete, onFallbackToManual, onFetchNextQuestion, userId,
}) {
    const [phase, setPhase] = useState("active");
    const [showEndConfirm, setShowEndConfirm] = useState(false);
    const [showEvaluation, setShowEvaluation] = useState(false);
    const [timeLeft, setTimeLeft] = useState(interviewDuration);
    const transcriptEndRef = useRef(null);
    const voiceStartedRef = useRef(false);
    const handledNextStepRef = useRef(false);
    const timerEndedRef = useRef(false);

    const isFullInterview = interviewMode === "full";

    const {
        connect, disconnect, status, error, mode,
        initSession, pauseSession, resumeSession, endSession,
        startVoiceMode, updateQuestion,
        deepgramReady, mute, unmute, isMuted,
        transcript, isAgentSpeaking, isUserSpeaking, evaluation, turnInfo, intent,
        clearError, silenceWarning, networkStatus, reconnectInfo, reconnectVoice,
        currentPhase,
    } = useConversationalInterview({
        sessionId, roundType, personality, candidateName,
        currentQuestion: currentQuestionData?.text || "",
        interviewMode,
        interviewDuration,
        interviewTopic,
        autoConnect: true, onFallbackToManual,
    });

    const isConnecting = status === "connecting" || status === "reconnecting";
    const isSpeaking   = isAgentSpeaking;
    const isThinking   = intent?.intent === "THINKING_PAUSE";
    const isListening  = !isConnecting && !isSpeaking && !isThinking && !isMuted && status !== "paused";
    const isActivelyTalking = isUserSpeaking && isListening; // Real voice detected

    // status label
    const statusLabel = useMemo(() => {
        if (status === "connecting")   return "Connecting to interviewer...";
        if (status === "reconnecting") return "Reconnecting...";
        if (status === "paused")       return "Session paused";
        if (isMuted)                   return "Microphone muted";
        if (isSpeaking)                return "Interviewer is speaking...";
        if (isThinking)                return "Processing your answer...";
        if (isActivelyTalking)         return "You are speaking...";
        return "Your turn — speak now";
    }, [status, isMuted, isSpeaking, isThinking, isActivelyTalking]);

    const statusColor = useMemo(() => {
        if (isConnecting) return "text-slate-400";
        if (status === "paused" || isMuted) return "text-red-400";
        if (isSpeaking) return "text-violet-400";
        if (isThinking) return "text-amber-400";
        return "text-emerald-400";
    }, [isConnecting, status, isMuted, isSpeaking, isThinking]);

    // Auto-scroll
    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [transcript]);

    // Mic check complete → connect
    const handleMicCheckComplete = () => { setPhase("active"); connect(); };

    // Init session on connect
    useEffect(() => {
        if (status === "connected" && phase === "active") initSession(userId);
    }, [status, phase]);

    // Start voice once both socket + question are ready
    useEffect(() => {
        if ((status !== "connected" && status !== "active") || phase !== "active") { voiceStartedRef.current = false; return; }
        if (voiceStartedRef.current || !currentQuestionData?.text) return;
        voiceStartedRef.current = true;
        startVoiceMode(currentQuestionData.text);
    }, [status, phase, currentQuestionData?.text]);

    // Update question mid-session
    useEffect(() => {
        if (deepgramReady && currentQuestionData?.text) updateQuestion(currentQuestionData.text, questionNumber - 1);
    }, [currentQuestionData?.text, deepgramReady]);

    // Countdown timer — auto-ends session when time is up
    useEffect(() => {
        if (phase !== "active" || status === "paused") return;
        const id = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(id);
                    if (!timerEndedRef.current) {
                        timerEndedRef.current = true;
                        endSession();
                        setTimeout(() => onRoundComplete?.(), 600);
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(id);
    }, [phase, status]);

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${String(sec).padStart(2, "0")}`;
    };

    // Auto next question (specific round only)
    useEffect(() => {
        if (isFullInterview) return;
        if (turnInfo?.nextStep !== "next_question") { handledNextStepRef.current = false; return; }
        if (handledNextStepRef.current) return;
        handledNextStepRef.current = true;
        onFetchNextQuestion?.();
    }, [turnInfo?.nextStep, onFetchNextQuestion, isFullInterview]);

    // Evaluation reveal
    useEffect(() => {
        if (evaluation && turnInfo?.action === "round_complete") {
            setTimeout(() => { setShowEvaluation(true); setPhase("completed"); }, 500);
        }
    }, [evaluation, turnInfo]);

    // Cleanup
    useEffect(() => () => disconnect(), []);

    // ── Mic check phase ──
    if (phase === "mic_check") {
        return (
            <div className="min-h-screen bg-[#06080f] flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
                            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                            <span className="text-xs text-violet-300 font-medium">AI Interview</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Microphone Check</h2>
                        <p className="text-sm text-slate-400">Let's make sure you're heard clearly before we begin.</p>
                    </div>
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                        <MicQualityCheck
                            onComplete={handleMicCheckComplete}
                            onSkip={() => { setPhase("active"); connect(); }}
                        />
                    </div>
                    {onFallbackToManual && (
                        <button onClick={onFallbackToManual} className="mt-4 w-full text-center text-xs text-slate-600 hover:text-slate-400 transition-colors py-2">
                            Switch to Manual Mode →
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // ── Active interview ──
    return (
        <div className="min-h-screen bg-[#06080f] flex flex-col" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(109,40,217,0.12) 0%, #06080f 60%)" }}>
            <style>{`
                @keyframes wave {
                    0%   { height: 15%; }
                    100% { height: 90%; }
                }
                @keyframes fadein { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }
                .msg-fadein { animation: fadein 0.3s ease forwards; }
            `}</style>

            {/* ── Top bar ── */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/20 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <span className="text-sm font-semibold text-white">Live Interview</span>
                    <span className="text-xs text-slate-500">·</span>
                    {isFullInterview ? (
                        // Full interview: show current phase
                        <span className="text-xs text-violet-300 font-medium capitalize">{currentPhase?.label || "Formal Q&A"}</span>
                    ) : interviewTopic ? (
                        <span className="text-xs text-violet-300 font-medium">Topic: {interviewTopic}</span>
                    ) : (
                        <span className="text-xs text-slate-400 capitalize">{roundType?.replace(/_/g, " ")}</span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {isFullInterview ? (
                        // Full interview: show countdown timer
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-bold transition-all ${
                            timeLeft <= 300
                                ? "bg-red-500/15 border-red-500/30 text-red-400"
                                : timeLeft <= 600
                                    ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                                    : "bg-white/[0.05] border-white/10 text-slate-300"
                        }`}>
                            <span>⏱</span>
                            <span>{formatTime(timeLeft)}</span>
                        </div>
                    ) : (
                        // Specific round: show question progress + time
                        <>
                            <div className="flex gap-1.5">
                                {Array.from({ length: maxQuestions }).map((_, i) => (
                                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${
                                        i < questionNumber - 1 ? "w-6 bg-violet-500" :
                                        i === questionNumber - 1 ? "w-8 bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.6)]" :
                                        "w-6 bg-white/10"
                                    }`} />
                                ))}
                            </div>
                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-mono font-bold ${
                                timeLeft <= 120
                                    ? "bg-red-500/15 border-red-500/30 text-red-400"
                                    : "bg-white/[0.05] border-white/10 text-slate-400"
                            }`}>
                                {formatTime(timeLeft)}
                            </div>
                        </>
                    )}
                </div>
            </header>


            {/* ── Phase Transition Banner (full interview only) ── */}
            {isFullInterview && currentPhase?.phase !== "formal_qa" && (
                <div className="mx-6 mt-3 p-2.5 bg-violet-500/10 border border-violet-500/25 rounded-xl flex items-center gap-2">
                    <span className="text-violet-400">🔀</span>
                    <span className="text-xs text-violet-300 font-semibold">Now covering: {currentPhase?.label}</span>
                </div>
            )}

            {/* ── Banners ── */}
            {error && (
                <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <p className="text-xs text-red-300 flex-1">{error}</p>
                    <button onClick={clearError} className="text-red-400 text-xs hover:text-red-300">✕</button>
                </div>
            )}
            {networkStatus === "offline" && (
                <div className="mx-6 mt-4 p-3 bg-slate-800 border border-slate-700 rounded-xl flex items-center gap-2">
                    <WifiOff className="w-4 h-4 text-slate-400" />
                    <p className="text-xs text-slate-300">No internet — waiting to reconnect...</p>
                </div>
            )}
            {silenceWarning === "nudge" && (
                <div className="mx-6 mt-4 p-3 bg-amber-500/8 border border-amber-500/20 rounded-xl">
                    <p className="text-xs text-amber-300 text-center">Take your time — the interviewer is listening whenever you're ready.</p>
                </div>
            )}


            {/* ── Main panel: two-column on large, stacked on small ── */}
            <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">

                {/* LEFT — AI Interviewer panel */}
                <div className="lg:w-[42%] flex flex-col items-center justify-center py-10 px-6 border-r border-white/5 relative">
                    {/* Subtle grid bg */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
                        backgroundSize: "40px 40px"
                    }} />

                    <div className="relative z-10 flex flex-col items-center gap-6">
                        {/* Interviewer label */}
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/8">
                            <Sparkles className="w-3 h-3 text-violet-400" />
                            <span className="text-[11px] text-slate-300 font-medium">AI Interviewer · {personality}</span>
                        </div>

                        {/* Orb */}
                        <AIOrb speaking={isSpeaking} thinking={isThinking} connecting={isConnecting} userTalking={isActivelyTalking} />

                        {/* Voice bars */}
                        <div className="flex items-center gap-[3px] h-8">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`rounded-full transition-colors ${isSpeaking ? "bg-violet-400" : "bg-white/10"}`}
                                    style={{
                                        width: 3,
                                        height: isSpeaking ? `${20 + Math.sin(i * 0.8) * 60}%` : "20%",
                                        animation: isSpeaking ? `wave ${0.6 + i * 0.05}s ease-in-out ${i * 0.08}s infinite alternate` : "none",
                                    }}
                                />
                            ))}
                        </div>

                        {/* Status label */}
                        <p className={`text-sm font-medium transition-all ${statusColor}`}>{statusLabel}</p>

                        {/* Current question card — only for specific round (full interview generates its own) */}
                        {!isFullInterview && currentQuestionData?.text && (
                            <div className="max-w-xs w-full bg-white/[0.04] border border-white/8 rounded-2xl p-4 backdrop-blur">
                                <p className="text-[10px] text-violet-400 font-semibold uppercase tracking-wider mb-2">Current Question</p>
                                <p className="text-sm text-slate-200 leading-relaxed">{currentQuestionData.text}</p>
                                {currentQuestionData.topic && (
                                    <span className="inline-block mt-3 text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400">
                                        {currentQuestionData.topic}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Reconnecting overlay */}
                        {status === "reconnecting" && (
                            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-20 gap-4">
                                <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
                                <p className="text-sm text-white font-medium">Reconnecting...</p>
                                {reconnectInfo && <p className="text-xs text-slate-400">Attempt {reconnectInfo.attempt}/5</p>}
                                <button onClick={reconnectVoice} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl transition-all">
                                    Retry Now
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT — Transcript + candidate panel */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Transcript */}
                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                        {transcript.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-16">
                                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/8 flex items-center justify-center">
                                    <Mic className="w-6 h-6 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-300 mb-1">
                                        {isConnecting ? "Connecting..." : "Ready to begin"}
                                    </p>
                                    <p className="text-xs text-slate-600 max-w-xs">
                                        {isConnecting
                                            ? "Setting up your AI interviewer..."
                                            : "The AI interviewer will ask you the first question shortly. Just speak naturally!"}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            transcript.map((msg, idx) => (
                                <div key={idx} className={`flex msg-fadein ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[78%] rounded-2xl px-4 py-3 ${
                                        msg.role === "user"
                                            ? "bg-gradient-to-br from-blue-600/25 to-indigo-600/15 border border-blue-500/20 text-blue-50"
                                            : "bg-white/[0.05] border border-white/8 text-slate-200"
                                    }`}>
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            {msg.role === "agent"
                                                ? <Sparkles className="w-3 h-3 text-violet-400" />
                                                : <Mic className="w-3 h-3 text-blue-400" />}
                                            <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                                                msg.role === "agent" ? "text-violet-400" : "text-blue-400"
                                            }`}>
                                                {msg.role === "agent" ? "Interviewer" : candidateName}
                                            </span>
                                        </div>
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Typing indicator */}
                        {isSpeaking && (
                            <div className="flex justify-start msg-fadein">
                                <div className="bg-white/[0.05] border border-white/8 rounded-2xl px-4 py-3">
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <Sparkles className="w-3 h-3 text-violet-400" />
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-400">Interviewer</span>
                                    </div>
                                    <div className="flex gap-1.5 items-center h-4">
                                        {[0, 150, 300].map(d => (
                                            <div key={d} className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={transcriptEndRef} />
                    </div>

                    {/* Candidate mic indicator */}
                    <div className="px-6 py-3 border-t border-white/5 flex items-center gap-3">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                            isActivelyTalking
                                ? "bg-emerald-500/15 border border-emerald-400/30 shadow-[0_0_12px_rgba(52,211,153,0.15)]"
                                : isListening && !isMuted
                                    ? "bg-emerald-500/10 border border-emerald-500/20"
                                    : "bg-white/[0.03] border border-white/5"
                        }`}>
                            {isMuted
                                ? <MicOff className="w-3.5 h-3.5 text-red-400" />
                                : <Mic className={`w-3.5 h-3.5 ${isActivelyTalking ? "text-emerald-300" : isListening ? "text-emerald-400" : "text-slate-600"}`} />}
                            <span className={`text-xs font-medium ${
                                isMuted ? "text-red-400" : isActivelyTalking ? "text-emerald-300" : isListening ? "text-emerald-400" : "text-slate-600"
                            }`}>
                                {isMuted ? "Muted" : isActivelyTalking ? "Speaking..." : isListening ? "Listening..." : "Mic ready"}
                            </span>
                        </div>
                        {(isActivelyTalking || (isListening && !isMuted)) && (
                            <div className="flex items-center gap-[3px] h-5">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className={`w-[3px] rounded-full ${isActivelyTalking ? "bg-emerald-300" : "bg-emerald-500/50"}`}
                                        style={{
                                            animation: isActivelyTalking
                                                ? `wave ${0.4 + i * 0.08}s ease-in-out ${i * 0.08}s infinite alternate`
                                                : `wave ${1.5 + i * 0.2}s ease-in-out ${i * 0.15}s infinite alternate`,
                                            minHeight: 4
                                        }} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Evaluation reveal */}
                    {showEvaluation && evaluation && (
                        <div className="mx-6 mb-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-blue-500/5 border border-emerald-500/20">
                            <div className="flex items-center gap-2 mb-3">
                                <BarChart3 className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm font-bold text-emerald-400">Round Evaluation</span>
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                {[
                                    { label: "Clarity", value: evaluation.clarity },
                                    { label: "Completeness", value: evaluation.completeness },
                                    { label: "Depth", value: evaluation.depth },
                                    { label: "Overall", value: evaluation.overall },
                                ].map(({ label, value }) => (
                                    <div key={label} className="text-center p-3 bg-white/[0.04] rounded-xl border border-white/8">
                                        <div className="text-xl font-bold text-white">{value ?? "—"}</div>
                                        <div className="text-[10px] text-slate-500 mt-0.5">{label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Bottom control bar ── */}
            <footer className="border-t border-white/5 bg-black/30 backdrop-blur-xl px-6 py-4">
                <div className="flex items-center justify-between max-w-3xl mx-auto">
                    {/* Left: Mute + Pause */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={isMuted ? unmute : mute}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                isMuted
                                    ? "bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25"
                                    : "bg-white/[0.06] border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            {isMuted ? "Unmute" : "Mute"}
                        </button>

                        <button
                            onClick={status === "paused" ? resumeSession : pauseSession}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/[0.06] border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                        >
                            {status === "paused" ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                            {status === "paused" ? "Resume" : "Pause"}
                        </button>
                    </div>

                    {/* Centre: live indicator */}
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/8">
                        <div className={`w-1.5 h-1.5 rounded-full ${isConnecting ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
                        <span className="text-[11px] text-slate-400 font-medium">{deepgramReady ? "Voice Active" : "Connecting..."}</span>
                    </div>

                    {/* Right: End */}
                    {showEndConfirm ? (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">End interview?</span>
                            <button onClick={() => {
                                timerEndedRef.current = true;
                                endSession();
                                disconnect();
                                onRoundComplete?.();
                            }}
                                className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all">
                                Yes, End
                            </button>
                            <button onClick={() => setShowEndConfirm(false)}
                                className="px-3 py-2 bg-white/[0.06] border border-white/10 text-slate-300 text-xs font-medium rounded-xl hover:bg-white/10 transition-all">
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowEndConfirm(true)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all"
                        >
                            <PhoneOff className="w-4 h-4" />
                            End Interview
                        </button>
                    )}
                </div>
            </footer>
        </div>
    );
}
