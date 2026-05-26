/**
 * useConversationalInterview Hook — Phase 7 (Reliability)
 *
 * PURPOSE: React hook that manages the entire conversational interview lifecycle.
 * Handles Socket.IO connection to /interview namespace, microphone capture,
 * Deepgram audio relay, and all real-time event processing.
 *
 * PHASE 7 ADDITIONS:
 * - Auto-reconnect (exponential backoff, up to 5 retries)
 * - Network quality monitoring (online/offline events)
 * - Reconnecting / reconnected UI states
 * - Graceful fallback to manual mode on DEEPGRAM_MAX_RECONNECT
 * - Silence detection events (nudge / autopause UI feedback)
 * - Socket.IO transport heartbeat (ping/pong)
 * - onFallback callback to parent for mode switching
 *
 * MODES:
 *   TEXT MODE  — Web Speech API (fallback)
 *   VOICE MODE — Deepgram Voice Agent (production)
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Reconnect backoff config (mirrors server-side)
const MAX_CLIENT_RECONNECT = 5;
const RECONNECT_BASE_DELAY  = 1000; // ms

/**
 * @param {Object} config
 * @param {string}   config.sessionId
 * @param {string}   config.roundType
 * @param {string}   config.personality
 * @param {string}   config.candidateName
 * @param {string}   config.currentQuestion
 * @param {boolean}  config.autoConnect
 * @param {Function} config.onFallbackToManual — called when Deepgram gives up
 */
export default function useConversationalInterview(config = {}) {
    const {
        sessionId,
        roundType        = "formal_qa",
        personality      = "professional",
        candidateName    = "Candidate",
        currentQuestion  = "",
        autoConnect      = false,
        onFallbackToManual
    } = config;

    // ── State ─────────────────────────────────────────────────────
    const [status, setStatus]               = useState("disconnected");
    // disconnected | connecting | connected | active | paused
    // | reconnecting | error
    const [mode, setMode]                   = useState("text");
    const [transcript, setTranscript]       = useState([]);
    const [agentText, setAgentText]         = useState("");
    const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
    const [isUserSpeaking, setIsUserSpeaking]   = useState(false);
    const [isMuted, setIsMuted]             = useState(false);
    const [evaluation, setEvaluation]       = useState(null);
    const [turnInfo, setTurnInfo]           = useState({ turn: 0, maxTurns: 5, action: null });
    const [intent, setIntent]               = useState(null);
    const [deepgramReady, setDeepgramReady] = useState(false);
    const [error, setError]                 = useState(null);
    const [networkStatus, setNetworkStatus] = useState(
        typeof navigator !== "undefined" && "onLine" in navigator
            ? (navigator.onLine ? "online" : "offline")
            : "online"
    );
    const [reconnectInfo, setReconnectInfo] = useState(null); // { attempt, delayMs }
    const [silenceWarning, setSilenceWarning] = useState(null); // "nudge" | "autopause"

    // ── Refs ──────────────────────────────────────────────────────
    const socketRef       = useRef(null);
    const audioContextRef = useRef(null);
    const micStreamRef    = useRef(null);
    const processorRef    = useRef(null);
    const audioQueueRef   = useRef([]);
    const isPlayingRef    = useRef(false);
    const isMutedRef      = useRef(false);   // sync ref for AudioWorklet closure
    const deepgramReadyRef = useRef(false);   // sync ref for AudioWorklet closure
    const reconnectAttemptsRef = useRef(0);
    const reconnectTimerRef    = useRef(null);
    const lastSessionParamsRef = useRef({});  // for Deepgram reconnect

    // ── Network Monitoring ────────────────────────────────────────

    useEffect(() => {
        const goOnline  = () => {
            setNetworkStatus("online");
            console.log("🌐 [ConvHook] Network back online");
            // If we were in an active session, try socket reconnect
            if (socketRef.current && !socketRef.current.connected) {
                socketRef.current.connect();
            }
        };
        const goOffline = () => {
            setNetworkStatus("offline");
            setError("No internet connection. Waiting to reconnect...");
            console.warn("🌐 [ConvHook] Network offline");
        };

        window.addEventListener("online",  goOnline);
        window.addEventListener("offline", goOffline);
        return () => {
            window.removeEventListener("online",  goOnline);
            window.removeEventListener("offline", goOffline);
        };
    }, []);

    // Keep refs in sync
    useEffect(() => { isMutedRef.current      = isMuted;      }, [isMuted]);
    useEffect(() => { deepgramReadyRef.current = deepgramReady; }, [deepgramReady]);

    // ── Socket.IO Connection ──────────────────────────────────────

    const connect = useCallback(() => {
        if (socketRef.current?.connected) return;

        setStatus("connecting");
        setError(null);

        const socket = io(`${API_URL}/interview`, {
            transports:     ["websocket", "polling"],
            timeout:        20000,
            forceNew:       true,
            // Socket.IO client reconnection (separate from Deepgram reconnection)
            reconnection:         true,
            reconnectionAttempts: MAX_CLIENT_RECONNECT,
            reconnectionDelay:    RECONNECT_BASE_DELAY,
            reconnectionDelayMax: 15000,
        });

        // ── Connection lifecycle ──
        socket.on("connect", () => {
            console.log("🔌 [ConvHook] Connected to /interview namespace");
            setStatus("connected");
            setError(null);
            setReconnectInfo(null);
            reconnectAttemptsRef.current = 0;
        });

        socket.on("disconnect", (reason) => {
            console.log(`🔌 [ConvHook] Disconnected: ${reason}`);
            setDeepgramReady(false);
            deepgramReadyRef.current = false;

            // Socket.IO will auto-reconnect for transport errors
            if (reason === "io server disconnect") {
                // Server intentionally closed — don't auto-reconnect
                setStatus("disconnected");
            } else {
                setStatus("reconnecting");
            }
        });

        socket.on("reconnecting", (attempt) => {
            console.log(`🔄 [ConvHook] Socket reconnecting (attempt ${attempt})`);
            setStatus("reconnecting");
            setReconnectInfo({ attempt, delayMs: null });
        });

        socket.on("reconnect", () => {
            console.log("✅ [ConvHook] Socket reconnected");
            setStatus("connected");
            setReconnectInfo(null);
        });

        socket.on("reconnect_failed", () => {
            console.error("❌ [ConvHook] Socket reconnect failed — all attempts exhausted");
            setStatus("error");
            setError("Connection lost. Please refresh the page to continue.");
        });

        socket.on("connect_error", (err) => {
            console.error("🔌 [ConvHook] Connection error:", err.message);
            setStatus("error");
            setError(err.message);
        });

        // ── Text mode events ──
        socket.on("conversation:status-update", (data) => {
            if (data.status === "active")    setStatus("active");
            if (data.status === "paused")    setStatus("paused");
            if (data.status === "completed") setStatus("disconnected");
        });

        socket.on("conversation:agent-response", (data) => {
            setAgentText(data.message || "");
            setTranscript(prev => [...prev, {
                role: "agent",
                text: data.message,
                timestamp: Date.now(),
                intent: data.intent,
                action: data.action
            }]);
            setTurnInfo({ turn: data.turn || 0, maxTurns: data.maxTurns || 5, action: data.action });
        });

        socket.on("conversation:intent-classified", (data) => {
            setIntent(data);
        });

        socket.on("conversation:evaluation", (data) => {
            setEvaluation(data);
        });

        socket.on("conversation:turn-complete", (data) => {
            setTurnInfo(prev => ({ ...prev, ...data }));
        });

        socket.on("conversation:error", (data) => {
            setError(data.message);
        });

        // ── Voice mode events ──
        socket.on("deepgram:ready", (data) => {
            console.log("🎙️ [ConvHook] Deepgram Voice Agent ready received from server!", data);
            setDeepgramReady(true);
            deepgramReadyRef.current = true;
            setMode("voice");
            setReconnectInfo(null);
            setSilenceWarning(null);
            if (data?.reconnected) {
                setStatus("active");
            }
        });

        socket.on("deepgram:transcript", (data) => {
            setIsUserSpeaking(false); // User finished their utterance
            setTranscript(prev => [...prev, {
                role: "user",
                text: data.text,
                timestamp: Date.now()
            }]);
        });

        socket.on("deepgram:agent-text", (data) => {
            setAgentText(data.text || "");
            setIsUserSpeaking(false); // Agent is responding, user is done
            setTranscript(prev => [...prev, {
                role: "agent",
                text: data.text,
                timestamp: Date.now()
            }]);
        });

        socket.on("deepgram:agent-audio", (audioData) => {
            audioQueueRef.current.push(audioData);
            setIsAgentSpeaking(true);
            playNextAudio();
        });

        socket.on("deepgram:user-speaking", () => {
            setIsUserSpeaking(true);
            setIsAgentSpeaking(false);
            audioQueueRef.current = [];          // barge-in: clear queued audio
            setSilenceWarning(null);
        });

        socket.on("deepgram:closed", (data) => {
            console.log("🔌 [ConvHook] Deepgram closed:", data.reason);
            setDeepgramReady(false);
            deepgramReadyRef.current = false;
            setMode("text");
        });

        socket.on("deepgram:error", (data) => {
            console.error("❌ [ConvHook] Deepgram error:", data.message);
            setError(data.message);
            if (!data.fatal) {
                setDeepgramReady(false);
                deepgramReadyRef.current = false;
            }
        });

        // ── Phase 7: Reconnection events ──
        socket.on("deepgram:reconnecting", (data) => {
            console.log(`🔄 [ConvHook] Deepgram reconnecting (attempt ${data.attempt})`);
            setReconnectInfo(data);
            setDeepgramReady(false);
            deepgramReadyRef.current = false;
        });

        socket.on("deepgram:reconnected", () => {
            console.log("✅ [ConvHook] Deepgram reconnected");
            setReconnectInfo(null);
        });

        // ── Phase 7: Fallback to manual ──
        socket.on("deepgram:fallback", (data) => {
            console.warn("⚠️ [ConvHook] Deepgram giving up — falling back to manual mode");
            setDeepgramReady(false);
            deepgramReadyRef.current = false;
            setMode("text");
            setError("Voice connection failed after multiple attempts. Switching to text mode.");
            onFallbackToManual?.();
        });

        // ── Phase 7: Silence events ──
        socket.on("deepgram:silence", (data) => {
            console.log(`🤫 [ConvHook] Silence event: ${data.type}`);
            setSilenceWarning(data.type);        // "nudge" | "autopause"
            if (data.type === "autopause") {
                setStatus("paused");
            }
            // Auto-clear nudge warning after 5s
            if (data.type === "nudge") {
                setTimeout(() => setSilenceWarning(null), 5000);
            }
        });

        socketRef.current = socket;
    }, [onFallbackToManual]);

    const disconnect = useCallback(() => {
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        stopMicrophone();
        setStatus("disconnected");
        setDeepgramReady(false);
        deepgramReadyRef.current = false;
    }, []);

    // ── Session Management ─────────────────────────────────────────

    const initSession = useCallback((userId) => {
        if (!socketRef.current?.connected) return;
        socketRef.current.emit("conversation:init", {
            sessionId, userId, roundType, personality
        }, (response) => {
            if (response?.success) {
                console.log("✅ [ConvHook] Session initialized");
            } else {
                setError(response?.error || "Init failed");
            }
        });
    }, [sessionId, roundType, personality]);

    const pauseSession  = useCallback(() => { socketRef.current?.emit("conversation:pause",  { sessionId }); }, [sessionId]);
    const resumeSession = useCallback(() => { socketRef.current?.emit("conversation:resume", { sessionId }); }, [sessionId]);

    const endSession = useCallback(() => {
        socketRef.current?.emit("conversation:end", { sessionId });
        stopMicrophone();
    }, [sessionId]);

    // ── Text Mode: Send Utterance ──────────────────────────────────

    const sendUtterance = useCallback((utteranceText, questionIndex = 0) => {
        if (!socketRef.current?.connected || !utteranceText) return;

        setTranscript(prev => [...prev, {
            role: "user",
            text: utteranceText,
            timestamp: Date.now()
        }]);

        socketRef.current.emit("conversation:utterance", {
            sessionId, roundType, questionIndex,
            utterance: utteranceText,
            currentQuestion
        });
    }, [sessionId, roundType, currentQuestion]);

    // ── Voice Mode: Deepgram ───────────────────────────────────────

    const startVoiceMode = useCallback(async (question) => {
        if (!socketRef.current?.connected) {
            setError("Not connected to server");
            return;
        }

        const params = {
            sessionId,
            candidateName,
            roundType,
            personality,
            currentQuestion: question || currentQuestion
        };
        lastSessionParamsRef.current = params;

        try {
            console.log("🎙️ [ConvHook] Emitting deepgram:start with params:", params);
            socketRef.current.emit("deepgram:start", params, (response) => {
                console.log("🎙️ [ConvHook] deepgram:start response:", response);
                if (!response?.success) {
                    console.error("❌ [ConvHook] deepgram:start failed:", response);
                    setError(response?.error || "Failed to start voice mode");
                }
            });
            console.log("🎙️ [ConvHook] Starting microphone...");
            await startMicrophone();
            console.log("🎙️ [ConvHook] Microphone started successfully");
        } catch (err) {
            console.error("❌ [ConvHook] Failed to start voice mode:", err);
            setError(err.message);
        }
    }, [sessionId, candidateName, roundType, personality, currentQuestion]);

    const stopVoiceMode = useCallback(() => {
        socketRef.current?.emit("deepgram:stop", { sessionId });
        stopMicrophone();
        setDeepgramReady(false);
        deepgramReadyRef.current = false;
        setMode("text");
    }, [sessionId]);

    const updateQuestion = useCallback((newQuestion, questionIndex = 0) => {
        socketRef.current?.emit("deepgram:update-question", {
            sessionId, newQuestion, roundType, personality, questionIndex
        });
    }, [sessionId, roundType, personality]);

    const injectMessage = useCallback((message) => {
        socketRef.current?.emit("deepgram:inject-message", { sessionId, message });
    }, [sessionId]);

    /**
     * Phase 7: Manually trigger a Deepgram reconnect
     * (useful for "Retry Connection" button in the UI)
     */
    const reconnectVoice = useCallback(() => {
        if (!socketRef.current?.connected) return;
        const params = lastSessionParamsRef.current;
        socketRef.current.emit("deepgram:reconnect-session", params, (response) => {
            if (!response?.success) {
                setError(response?.error || "Reconnect failed");
            }
        });
        // Restart microphone after reconnect
        startMicrophone().catch(console.error);
    }, []);

    // ── Microphone Management ──────────────────────────────────────

    const startMicrophone = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate:   16000,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl:  true
                }
            });

            micStreamRef.current    = stream;
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
                sampleRate: 16000
            });

            const source    = audioContextRef.current.createMediaStreamSource(stream);
            const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
                // Use refs to avoid stale closure issues
                if (isMutedRef.current || !socketRef.current?.connected || !deepgramReadyRef.current) return;

                const inputData  = e.inputBuffer.getChannelData(0);
                const int16Data  = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                    const s       = Math.max(-1, Math.min(1, inputData[i]));
                    int16Data[i]  = s < 0 ? s * 0x8000 : s * 0x7FFF;
                }
                socketRef.current.emit("deepgram:audio", int16Data.buffer);
            };

            source.connect(processor);
            processor.connect(audioContextRef.current.destination);

            console.log("🎤 [ConvHook] Microphone started");
        } catch (err) {
            console.error("❌ [ConvHook] Microphone error:", err);
            setError("Microphone access denied. Please allow microphone access.");
            throw err;
        }
    }, []);

    const stopMicrophone = useCallback(() => {
        processorRef.current?.disconnect();
        processorRef.current = null;

        micStreamRef.current?.getTracks().forEach(t => t.stop());
        micStreamRef.current = null;

        if (audioContextRef.current?.state !== "closed") {
            audioContextRef.current?.close();
        }
        audioContextRef.current = null;
        console.log("🎤 [ConvHook] Microphone stopped");
    }, []);

    const mute   = useCallback(() => { setIsMuted(true);  isMutedRef.current = true;  }, []);
    const unmute = useCallback(() => { setIsMuted(false); isMutedRef.current = false; }, []);

    // ── Audio Playback (TTS from Deepgram) ────────────────────────

    const playNextAudio = useCallback(async () => {
        if (isPlayingRef.current || audioQueueRef.current.length === 0) return;
        isPlayingRef.current = true;

        const audioData = audioQueueRef.current.shift();

        try {
            // Create/reuse a 24kHz context for TTS output
            if (!audioContextRef.current || audioContextRef.current.state === "closed") {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
                    sampleRate: 24000
                });
            }

            const int16Array   = new Int16Array(audioData);
            const float32Array = new Float32Array(int16Array.length);
            for (let i = 0; i < int16Array.length; i++) {
                float32Array[i] = int16Array[i] / 32768.0;
            }

            const audioBuffer = audioContextRef.current.createBuffer(1, float32Array.length, 24000);
            audioBuffer.getChannelData(0).set(float32Array);

            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContextRef.current.destination);
            source.onended = () => {
                isPlayingRef.current = false;
                if (audioQueueRef.current.length > 0) {
                    playNextAudio();
                } else {
                    setIsAgentSpeaking(false);
                }
            };
            source.start();
        } catch (err) {
            console.error("❌ [ConvHook] Audio playback error:", err);
            isPlayingRef.current = false;
        }
    }, []);

    // ── Lifecycle ──────────────────────────────────────────────────

    useEffect(() => {
        if (autoConnect && sessionId) connect();
        return () => disconnect();
    }, [autoConnect, sessionId]);

    // ── Mic Quality Check ──────────────────────────────────────────

    const checkMicQuality = useCallback(async () => {
        try {
            const stream    = await navigator.mediaDevices.getUserMedia({ audio: true });
            const ctx       = new (window.AudioContext || window.webkitAudioContext)();
            const analyser  = ctx.createAnalyser();
            const source    = ctx.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 256;
            const dataArray  = new Uint8Array(analyser.frequencyBinCount);

            return new Promise((resolve) => {
                let maxLevel = 0, samples = 0;
                const id = setInterval(() => {
                    analyser.getByteFrequencyData(dataArray);
                    const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
                    maxLevel = Math.max(maxLevel, avg);
                    samples++;
                    if (samples >= 20) {
                        clearInterval(id);
                        stream.getTracks().forEach(t => t.stop());
                        ctx.close();
                        const quality = maxLevel > 40 ? "good" : maxLevel > 15 ? "fair" : "poor";
                        resolve({
                            quality,
                            level: maxLevel,
                            recommendation:
                                quality === "poor" ? "Move closer to the mic or speak louder" :
                                quality === "fair" ? "Acceptable — headphones improve clarity" :
                                "Audio quality is excellent!"
                        });
                    }
                }, 50);
            });
        } catch {
            return { quality: "error", level: 0, recommendation: "Microphone access denied." };
        }
    }, []);

    // ── Return API ─────────────────────────────────────────────────

    return {
        // Connection
        connect, disconnect, status, error, mode,
        networkStatus, reconnectInfo,

        // Session
        initSession, pauseSession, resumeSession, endSession,

        // Text Mode
        sendUtterance,

        // Voice Mode
        startVoiceMode, stopVoiceMode, updateQuestion,
        injectMessage, deepgramReady, reconnectVoice,

        // Microphone
        mute, unmute, isMuted, checkMicQuality,

        // Conversation State
        transcript, agentText, isAgentSpeaking,
        isUserSpeaking, evaluation, turnInfo, intent,

        // Phase 7
        silenceWarning,

        // Helpers
        clearTranscript: useCallback(() => setTranscript([]), []),
        clearError:      useCallback(() => setError(null),    []),
    };
}
