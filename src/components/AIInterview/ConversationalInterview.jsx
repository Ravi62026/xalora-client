import { useState, useEffect, useRef, useMemo } from "react";
import { Mic, MicOff, Pause, Play, PhoneOff, Loader2, AlertCircle, Sparkles, WifiOff, RefreshCw, BarChart3 } from "lucide-react";
import useConversationalInterview from "../../hooks/useConversationalInterview";
import MicQualityCheck from "./MicQualityCheck";

// ── AI Presence animation (replaces photo/video avatar) ──
function AIPresence({ speaking, thinking, connecting, userTalking }) {
    return (
        <div className="relative flex items-center justify-center">
            {speaking && (
                <div className="absolute w-52 h-52 rounded-full bg-violet-100 animate-ping pointer-events-none" style={{ animationDuration: "1.8s" }} />
            )}
            {userTalking && (
                <div className="absolute w-52 h-52 rounded-full bg-emerald-100 animate-ping pointer-events-none" style={{ animationDuration: "1.2s" }} />
            )}
            {/* Outer ring */}
            <div className={`relative w-44 h-44 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${
                connecting   ? "bg-slate-100 border-2 border-slate-200" :
                thinking     ? "bg-amber-50 border-2 border-amber-200 shadow-amber-100" :
                speaking     ? "bg-violet-50 border-2 border-violet-200 shadow-violet-100" :
                userTalking  ? "bg-emerald-50 border-2 border-emerald-200 shadow-emerald-100" :
                               "bg-indigo-50 border-2 border-indigo-100"
            }`}>
                {/* Inner gradient circle */}
                <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
                    connecting   ? "bg-gradient-to-br from-slate-200 to-slate-300" :
                    thinking     ? "bg-gradient-to-br from-amber-300 to-orange-400" :
                    speaking     ? "bg-gradient-to-br from-violet-400 to-purple-500" :
                    userTalking  ? "bg-gradient-to-br from-emerald-400 to-teal-500" :
                                   "bg-gradient-to-br from-indigo-400 to-violet-500"
                }`}>
                    {connecting ? (
                        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                    ) : thinking ? (
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : (
                        <div className="flex items-center gap-[4px]">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1.5 rounded-full bg-white/90 transition-all duration-200"
                                    style={{
                                        height: (speaking || userTalking)
                                            ? `${10 + Math.abs(Math.sin(i * 1.1)) * 22}px`
                                            : "5px",
                                        animation: (speaking || userTalking)
                                            ? `wave ${0.5 + i * 0.1}s ease-in-out ${i * 0.1}s infinite alternate`
                                            : "none",
                                    }}
                                />
                            ))}
                        </div>
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
        transcript, streamingText, isAgentSpeaking, isUserSpeaking, evaluation, turnInfo, intent,
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

    const isConnecting    = status === "connecting" || status === "reconnecting";
    const isSpeaking      = isAgentSpeaking;
    const isThinking      = intent?.intent === "THINKING_PAUSE";
    const isListening     = !isConnecting && !isSpeaking && !isThinking && !isMuted && status !== "paused";
    const isActivelyTalking = isUserSpeaking && isListening;

    const statusLabel = useMemo(() => {
        if (status === "connecting" || !deepgramReady) return "Connecting to interviewer...";
        if (status === "reconnecting") return "Reconnecting...";
        if (status === "paused")       return "Session paused";
        if (isMuted)                   return "Microphone muted";
        if (isSpeaking)                return "Interviewer is speaking...";
        if (isThinking)                return "Processing your answer...";
        if (isActivelyTalking)         return "You are speaking...";
        return "Your turn — speak now";
    }, [status, deepgramReady, isMuted, isSpeaking, isThinking, isActivelyTalking]);

    // Auto-scroll transcript (scrolls inside the container, not the page)
    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [transcript]);

    const handleMicCheckComplete = () => { setPhase("active"); connect(); };

    useEffect(() => {
        if (status === "connected" && phase === "active") initSession(userId);
    }, [status, phase]);

    useEffect(() => {
        if ((status !== "connected" && status !== "active") || phase !== "active") { voiceStartedRef.current = false; return; }
        if (voiceStartedRef.current || !currentQuestionData?.text) return;
        voiceStartedRef.current = true;
        startVoiceMode(currentQuestionData.text);
    }, [status, phase, currentQuestionData?.text]);

    useEffect(() => {
        if (deepgramReady && currentQuestionData?.text && questionNumber > 1) {
            updateQuestion(currentQuestionData.text, questionNumber - 1);
        }
    }, [currentQuestionData?.text, deepgramReady, questionNumber]);

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

    useEffect(() => {
        if (isFullInterview) return;
        if (turnInfo?.nextStep !== "next_question") { handledNextStepRef.current = false; return; }
        if (handledNextStepRef.current) return;
        handledNextStepRef.current = true;
        onFetchNextQuestion?.();
    }, [turnInfo?.nextStep, onFetchNextQuestion, isFullInterview]);

    useEffect(() => {
        if (evaluation && turnInfo?.action === "round_complete") {
            setTimeout(() => { setShowEvaluation(true); setPhase("completed"); }, 500);
        }
    }, [evaluation, turnInfo]);

    useEffect(() => () => disconnect(), []);

    // ── Mic check phase ──
    if (phase === "mic_check") {
        return (
            <div className="min-h-screen xalora-grid-bg flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 mb-6">
                            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                            <span className="text-xs text-purple-800 font-semibold">AI Interview</span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Microphone Check</h2>
                        <p className="text-sm text-slate-600">Let's make sure you're heard clearly before we begin.</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md">
                        <MicQualityCheck
                            onComplete={handleMicCheckComplete}
                            onSkip={() => { setPhase("active"); connect(); }}
                        />
                    </div>
                    {onFallbackToManual && (
                        <button onClick={onFallbackToManual} className="mt-4 w-full text-center text-xs text-slate-500 hover:text-slate-700 transition-colors py-2 cursor-pointer bg-transparent border-0 font-medium">
                            Switch to Manual Mode →
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // ── Active interview ──
    return (
        <div className="h-screen overflow-hidden flex flex-col bg-slate-50">
            <style>{`
                @keyframes wave {
                    0%   { height: 15%; }
                    100% { height: 90%; }
                }
                @keyframes fadein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
                .msg-fadein { animation: fadein 0.3s ease forwards; }
            `}</style>

            {/* ── Top bar ── */}
            <header className="shrink-0 flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        isConnecting || !deepgramReady
                            ? "bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                            : status === "paused"
                                ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                                : "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                    }`} />
                    <span className="text-sm font-bold text-slate-900">
                        {isConnecting || !deepgramReady ? "Connecting..." : "Connected"}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    {isFullInterview ? (
                        <span className="text-xs text-violet-800 font-bold capitalize">{currentPhase?.label || "Formal Q&A"}</span>
                    ) : interviewTopic ? (
                        <span className="text-xs text-violet-800 font-bold">Topic: {interviewTopic}</span>
                    ) : (
                        <span className="text-xs text-slate-700 font-semibold capitalize">{roundType?.replace(/_/g, " ")}</span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {isFullInterview ? (
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-bold transition-all ${
                            timeLeft <= 300
                                ? "bg-red-50 border-red-200 text-red-700"
                                : timeLeft <= 600
                                    ? "bg-amber-50 border-amber-200 text-amber-700"
                                    : "bg-slate-100 border-slate-200 text-slate-700"
                        }`}>
                            <span>⏱</span>
                            <span>{formatTime(timeLeft)}</span>
                        </div>
                    ) : (
                        <>
                            <div className="flex gap-1.5">
                                {Array.from({ length: maxQuestions }).map((_, i) => (
                                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${
                                        i < questionNumber - 1 ? "w-6 bg-violet-700" :
                                        i === questionNumber - 1 ? "w-8 bg-violet-500 shadow-sm" :
                                        "w-6 bg-slate-200"
                                    }`} />
                                ))}
                            </div>
                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-mono font-bold ${
                                timeLeft <= 120
                                    ? "bg-red-50 border-red-200 text-red-700"
                                    : "bg-slate-100 border-slate-200 text-slate-700"
                            }`}>
                                {formatTime(timeLeft)}
                            </div>
                        </>
                    )}
                </div>
            </header>

            {/* ── Banners (shrink-0 so they don't compress the main body) ── */}
            {isFullInterview && currentPhase?.phase !== "formal_qa" && (
                <div className="shrink-0 mx-6 mt-2 p-2.5 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-2">
                    <span className="text-purple-600 font-bold">🔀</span>
                    <span className="text-xs text-purple-800 font-bold">Now covering: {currentPhase?.label}</span>
                </div>
            )}
            {error && (
                <div className="shrink-0 mx-6 mt-2 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <p className="text-xs text-red-700 flex-1 font-semibold">{error}</p>
                    <button onClick={clearError} className="text-red-400 hover:text-red-600 text-xs cursor-pointer bg-transparent border-0 font-bold">✕</button>
                </div>
            )}
            {networkStatus === "offline" && (
                <div className="shrink-0 mx-6 mt-2 p-3 bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-2">
                    <WifiOff className="w-4 h-4 text-slate-500" />
                    <p className="text-xs text-slate-600 font-medium">No internet — waiting to reconnect...</p>
                </div>
            )}
            {silenceWarning === "nudge" && (
                <div className="shrink-0 mx-6 mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-xs text-amber-800 text-center font-semibold">Take your time — the interviewer is listening whenever you're ready.</p>
                </div>
            )}

            {/* ── Main body: side-by-side on lg, stacked on mobile ── */}
            <div className="flex-1 flex overflow-hidden">

                {/* LEFT — AI Presence panel (light mode) */}
                <div className="hidden lg:flex lg:w-[42%] flex-col bg-white border-r border-slate-100 relative overflow-hidden">
                    {/* Subtle dot grid */}
                    <div className="absolute inset-0 opacity-[0.035]" style={{
                        backgroundImage: "radial-gradient(circle, rgba(100,80,200,0.6) 1px, transparent 1px)",
                        backgroundSize: "28px 28px"
                    }} />

                    <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-6 px-8 py-10">
                        {/* Interviewer badge */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200">
                            <Sparkles className="w-3 h-3 text-violet-500 animate-pulse" />
                            <span className="text-[11px] text-slate-600 font-semibold tracking-wide">AI Interviewer · {personality}</span>
                        </div>

                        {/* AI presence orb */}
                        <AIPresence speaking={isSpeaking} thinking={isThinking} connecting={isConnecting} userTalking={isActivelyTalking} />

                        {/* Status label */}
                        <p className={`text-sm font-semibold transition-all duration-300 ${
                            isConnecting ? "text-slate-400 animate-pulse" :
                            isSpeaking   ? "text-violet-600" :
                            isThinking   ? "text-amber-600" :
                            isActivelyTalking ? "text-emerald-600" :
                            status === "paused" ? "text-red-500" :
                            "text-slate-500"
                        }`}>{statusLabel}</p>

                        {/* Question card (specific round only) */}
                        {!isFullInterview && currentQuestionData?.text && (
                            <div className="max-w-xs w-full bg-slate-50 border border-slate-200 rounded-xl p-4">
                                <p className="text-[10px] text-violet-600 font-bold uppercase tracking-wider mb-2">Current Question</p>
                                {deepgramReady ? (
                                    <>
                                        <p className="text-sm text-slate-700 leading-relaxed font-medium">{currentQuestionData.text}</p>
                                        {currentQuestionData.topic && (
                                            <span className="inline-block mt-3 text-[10px] px-2 py-0.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 font-bold">
                                                {currentQuestionData.topic}
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-sm text-slate-400 italic animate-pulse">Establishing connection to voice interviewer...</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Reconnecting overlay */}
                    {status === "reconnecting" && (
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-20">
                            <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
                            <p className="text-sm text-slate-800 font-bold">Reconnecting...</p>
                            {reconnectInfo && <p className="text-xs text-slate-500 font-semibold">Attempt {reconnectInfo.attempt}/5</p>}
                            <button onClick={reconnectVoice} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer border-0">
                                Retry Now
                            </button>
                        </div>
                    )}
                </div>

                {/* RIGHT — Transcript + candidate panel */}
                <div className="flex-1 flex flex-col overflow-hidden bg-white">

                    {/* Transcript panel header */}
                    <div className="shrink-0 px-6 py-3 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Live Transcript</span>
                        {/* Mobile-only status chip (left panel hidden on mobile) */}
                        <div className="lg:hidden flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full transition-all ${
                                isSpeaking ? "bg-violet-500 animate-pulse" :
                                isActivelyTalking ? "bg-emerald-500 animate-pulse" :
                                isConnecting ? "bg-amber-400 animate-pulse" :
                                "bg-slate-300"
                            }`} />
                            <span className="text-[10px] text-slate-400 font-medium">{statusLabel}</span>
                        </div>
                    </div>

                    {/* SCROLLABLE transcript area — key layout fix: flex-1 overflow-y-auto */}
                    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                        {transcript.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                                    <Mic className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-600 mb-1">
                                        {isConnecting ? "Connecting..." : "Ready to begin"}
                                    </p>
                                    <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                                        {isConnecting
                                            ? "Setting up your AI interviewer..."
                                            : "The AI interviewer will ask you the first question shortly. Just speak naturally!"}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            transcript.map((msg, idx) => {
                                const isStreaming = msg.role === "agent" && msg.streaming;
                                const displayText = isStreaming ? streamingText : msg.text;
                                return (
                                    <div key={idx} className={`flex flex-col msg-fadein ${msg.role === "user" ? "items-end" : "items-start"}`}>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
                                            {msg.role === "agent" ? "Interviewer" : candidateName}
                                        </span>
                                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                                            msg.role === "user"
                                                ? "bg-indigo-50 border border-indigo-100 text-slate-800"
                                                : "bg-slate-50 border border-slate-200 text-slate-800"
                                        }`}>
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                                {displayText}
                                                {isStreaming && (
                                                    <span className="inline-block w-0.5 h-3.5 bg-violet-400 ml-0.5 animate-pulse align-middle" />
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}

                        {/* Connecting dots — only when agent has nothing in transcript yet */}
                        {isSpeaking && transcript.every(m => !m.streaming) && (
                            <div className="flex flex-col items-start msg-fadein">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">Interviewer</span>
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
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

                    {/* Evaluation panel (outside scroll, above mic bar) */}
                    {showEvaluation && evaluation && (
                        <div className="shrink-0 px-6 py-3 border-t border-slate-100">
                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <BarChart3 className="w-4 h-4 text-emerald-600" />
                                    <span className="text-sm font-bold text-emerald-800">Round Evaluation</span>
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    {[
                                        { label: "Clarity",      value: evaluation.clarity },
                                        { label: "Completeness", value: evaluation.completeness },
                                        { label: "Depth",        value: evaluation.depth },
                                        { label: "Overall",      value: evaluation.overall },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="text-center p-3 bg-white rounded-xl border border-emerald-100 shadow-sm">
                                            <div className="text-xl font-extrabold text-slate-800">{value ?? "—"}</div>
                                            <div className="text-[10px] text-slate-500 mt-0.5 font-bold uppercase">{label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Candidate mic indicator */}
                    <div className="shrink-0 px-6 py-3 border-t border-slate-100 flex items-center gap-3">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                            isActivelyTalking
                                ? "bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold shadow-sm"
                                : isListening && !isMuted
                                    ? "bg-emerald-50/50 border border-emerald-100 text-emerald-700"
                                    : "bg-slate-50 border border-slate-200 text-slate-500"
                        }`}>
                            {isMuted
                                ? <MicOff className="w-3.5 h-3.5 text-red-500" />
                                : <Mic className={`w-3.5 h-3.5 ${isActivelyTalking ? "text-emerald-600" : isListening ? "text-emerald-500" : "text-slate-400"}`} />}
                            <span className={`text-xs font-semibold ${
                                isMuted ? "text-red-600" : isActivelyTalking ? "text-emerald-800" : isListening ? "text-emerald-700" : "text-slate-500"
                            }`}>
                                {isMuted ? "Muted" : isActivelyTalking ? "Speaking..." : isListening ? "Listening..." : "Mic ready"}
                            </span>
                        </div>
                        {(isActivelyTalking || (isListening && !isMuted)) && (
                            <div className="flex items-center gap-[3px] h-5">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className={`w-[3px] rounded-full ${isActivelyTalking ? "bg-emerald-500" : "bg-emerald-400/50"}`}
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
                </div>
            </div>

            {/* ── Bottom control bar ── */}
            <footer className="shrink-0 border-t border-slate-200 bg-white/95 backdrop-blur-md px-6 py-4 shadow-sm">
                <div className="flex items-center justify-between max-w-3xl mx-auto">
                    {/* Left: Mute + Pause */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={isMuted ? unmute : mute}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${
                                isMuted
                                    ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}
                        >
                            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            {isMuted ? "Unmute" : "Mute"}
                        </button>

                        <button
                            onClick={status === "paused" ? resumeSession : pauseSession}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-50 border border-slate-200 text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
                        >
                            {status === "paused" ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                            {status === "paused" ? "Resume" : "Pause"}
                        </button>
                    </div>

                    {/* Centre: live indicator */}
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-500 shadow-inner">
                        <div className={`w-1.5 h-1.5 rounded-full ${isConnecting ? "bg-amber-400 animate-pulse" : "bg-emerald-500"}`} />
                        <span>{deepgramReady ? "Voice Active" : "Connecting..."}</span>
                    </div>

                    {/* Right: End */}
                    {showEndConfirm ? (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 font-semibold">End interview?</span>
                            <button onClick={() => {
                                timerEndedRef.current = true;
                                endSession();
                                disconnect();
                                onRoundComplete?.();
                            }}
                                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer border-0">
                                Yes, End
                            </button>
                            <button onClick={() => setShowEndConfirm(false)}
                                className="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100 transition-all cursor-pointer">
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowEndConfirm(true)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 transition-all cursor-pointer"
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
