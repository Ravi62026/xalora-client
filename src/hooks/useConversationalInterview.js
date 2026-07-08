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
 * @param {string}   config.interviewMode      — "full" | "specific" | "practice"
 * @param {number}   config.interviewDuration  — session seconds (900 = 15min, 1800 = 30min)
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
        interviewMode    = "specific",
        interviewDuration = 900,
        interviewTopic   = null,
        autoConnect      = false,
        onFallbackToManual
    } = config;

    // ── State ─────────────────────────────────────────────────────
    const [status, setStatus]               = useState("disconnected");
    // disconnected | connecting | connected | active | paused
    // | reconnecting | error
    const [mode, setMode]                   = useState("text");
    const [transcript, setTranscript]       = useState([]);
    const [streamingText, setStreamingText] = useState(""); // word-by-word reveal for current agent turn
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
    // Full interview mode: current phase banner
    const [currentPhase, setCurrentPhase]   = useState({ phase: "formal_qa", label: "Formal Q&A" });

    // ── Refs ──────────────────────────────────────────────────────
    const socketRef          = useRef(null);
    const micAudioContextRef  = useRef(null);
    const playbackAudioContextRef = useRef(null);
    const activeSourceRef     = useRef(null);
    const micStreamRef        = useRef(null);
    const workletNodeRef      = useRef(null);  // AudioWorkletNode (replaces ScriptProcessor)
    const workletSinkRef      = useRef(null);  // silent sink keeps AudioWorklet processing
    const processorRef        = useRef(null);  // fallback ScriptProcessor
    const audioQueueRef       = useRef([]);
    const isPlayingRef        = useRef(false);
    const isMutedRef          = useRef(false);   // sync ref for audio thread closure
    const deepgramReadyRef    = useRef(false);   // sync ref for audio thread closure
    const startMicrophoneRef  = useRef(null);
    const microphoneStartingRef = useRef(false);
    const reconnectAttemptsRef = useRef(0);
    const reconnectTimerRef   = useRef(null);
    const streamTimerRef      = useRef(null);   // interval for word-by-word text reveal
    const pendingAgentTextRef = useRef(null);   // agent text waiting for audio to arrive
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
            setStatus("active");
            setReconnectInfo(null);
            setSilenceWarning(null);

            // Server can auto-start Deepgram for conversational sessions. In that
            // path no manual question is needed, so startVoiceMode() may never run.
            if (!micStreamRef.current && !microphoneStartingRef.current) {
                microphoneStartingRef.current = true;
                startMicrophoneRef.current?.()
                    .then(() => console.log("🎙️ [ConvHook] Microphone auto-started after Deepgram ready"))
                    .catch((err) => {
                        console.error("❌ [ConvHook] Failed to auto-start microphone after Deepgram ready:", err);
                        setError(err.message || "Microphone failed to start");
                    })
                    .finally(() => {
                        microphoneStartingRef.current = false;
                    });
            }
        });

        socket.on("deepgram:transcript", (data) => {
            console.log("🎤 [VOICE-MIC-STT] Candidate Spoke (Transcribed):", data.text);
            setIsUserSpeaking(false);
            // Merge consecutive user fragments into one bubble so the candidate's
            // full answer appears as a single paragraph (Deepgram sends multiple
            // final transcripts before the agent responds).
            setTranscript(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "user" && !last?.sealed) {
                    // Append to existing user bubble
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                        ...last,
                        text: last.text + " " + data.text,
                        timestamp: Date.now()
                    };
                    return updated;
                }
                // New user turn
                return [...prev, { role: "user", text: data.text, timestamp: Date.now() }];
            });
        });

        socket.on("deepgram:agent-text", (data) => {
            console.log("🤖 [VOICE-AI-TTS] Agent Responded (Text):", data.text);
            const fullText = data.text || "";
            setAgentText(fullText);
            setIsUserSpeaking(false);
            // Seal the last user bubble so next user turn starts fresh
            setTranscript(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "user" && !last?.sealed) {
                    const copy = [...prev];
                    copy[copy.length - 1] = { ...last, sealed: true };
                    return copy;
                }
                return prev;
            });
            // Cache text — streaming starts when audio actually arrives so text
            // and voice are in sync (audio arrives ~500ms-1s after text event).
            pendingAgentTextRef.current = fullText;
        });

        // Server sends ONE complete WAV buffer per agent turn (after AgentAudioDone).
        // We trigger word-by-word text streaming HERE — when audio actually arrives —
        // so text reveal and voice stay in sync instead of racing ahead.
        socket.on("deepgram:agent-audio", (audioData) => {
            let arrayBuffer;
            if (audioData instanceof ArrayBuffer) {
                arrayBuffer = audioData;
            } else if (ArrayBuffer.isView(audioData)) {
                arrayBuffer = audioData.buffer.slice(audioData.byteOffset, audioData.byteOffset + audioData.byteLength);
            } else if (audioData && audioData.type === "Buffer" && Array.isArray(audioData.data)) {
                arrayBuffer = new Uint8Array(audioData.data).buffer;
            } else {
                arrayBuffer = new Uint8Array(audioData).buffer;
            }
            audioQueueRef.current.push(arrayBuffer);
            setIsAgentSpeaking(true);
            playNextAudio();

            // Kick off word-by-word text streaming now that audio is here
            const fullText = pendingAgentTextRef.current;
            pendingAgentTextRef.current = null;
            if (!fullText) return;

            // Clear any stale stream
            if (streamTimerRef.current) {
                clearInterval(streamTimerRef.current);
                streamTimerRef.current = null;
            }

            const words = fullText.split(" ");
            let wordIdx = 0;
            setStreamingText("");

            setTranscript(prev => [...prev, {
                role: "agent",
                text: fullText,
                streaming: true,
                timestamp: Date.now()
            }]);

            // Estimate words per second from audio duration would require
            // decoding — instead use a pace that matches typical TTS speed (~2.5 wps)
            const msPerWord = Math.max(120, Math.min(250, (words.length > 0 ? 2500 / words.length : 200)));

            streamTimerRef.current = setInterval(() => {
                wordIdx++;
                setStreamingText(words.slice(0, wordIdx).join(" "));

                if (wordIdx >= words.length) {
                    clearInterval(streamTimerRef.current);
                    streamTimerRef.current = null;
                    setTranscript(prev => {
                        const copy = [...prev];
                        const last = copy[copy.length - 1];
                        if (last?.role === "agent" && last?.streaming) {
                            copy[copy.length - 1] = { ...last, streaming: false };
                        }
                        return copy;
                    });
                    setStreamingText("");
                }
            }, msPerWord);
        });

        socket.on("deepgram:agent-audio-done", () => {
            // Audio already queued via deepgram:agent-audio — this is just a UI signal
            console.log("🔇 [ConvHook] Agent audio turn complete");
        });

        socket.on("deepgram:user-speaking", () => {
            setIsUserSpeaking(true);
            setIsAgentSpeaking(false);
            audioQueueRef.current = [];          // barge-in: clear queued audio
            setSilenceWarning(null);
            // Clear streaming text on barge-in — finalize last agent bubble
            if (streamTimerRef.current) {
                clearInterval(streamTimerRef.current);
                streamTimerRef.current = null;
            }
            setStreamingText("");
            pendingAgentTextRef.current = null;
            // Seal last agent bubble and last user bubble so turns don't bleed
            setTranscript(prev => {
                if (!prev.length) return prev;
                const copy = [...prev];
                const last = copy[copy.length - 1];
                if (!last.sealed) copy[copy.length - 1] = { ...last, sealed: true };
                return copy;
            });

            // Stop current playback for barge-in!
            if (activeSourceRef.current) {
                try {
                    activeSourceRef.current.stop();
                } catch (e) {
                    // Ignore if already stopped
                }
                activeSourceRef.current = null;
            }
            isPlayingRef.current = false;
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
            console.warn("⚠️ [ConvHook] Deepgram giving up — falling back to manual mode", data);
            setDeepgramReady(false);
            deepgramReadyRef.current = false;
            setMode("text");
            setError(data?.reason || "Voice connection failed after multiple attempts. Switching to text mode.");
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

        // ── Full Interview: Phase Change ──
        socket.on("deepgram:phase-change", (data) => {
            console.log(`🔀 [ConvHook] Phase change: ${data.phase} (${data.label})`);
            setCurrentPhase({ phase: data.phase, label: data.label });
        });

        socketRef.current = socket;
    }, [onFallbackToManual]);

    const disconnect = useCallback(() => {
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }
        if (streamTimerRef.current) {
            clearInterval(streamTimerRef.current);
            streamTimerRef.current = null;
        }
        setStreamingText("");
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        stopMicrophone();

        // Stop active TTS audio playback on disconnect
        if (activeSourceRef.current) {
            try {
                activeSourceRef.current.stop();
            } catch (e) { /* ignore */ }
            activeSourceRef.current = null;
        }
        audioQueueRef.current = [];
        isPlayingRef.current = false;

        if (playbackAudioContextRef.current && playbackAudioContextRef.current.state !== "closed") {
            playbackAudioContextRef.current.close().catch(() => {});
        }
        playbackAudioContextRef.current = null;

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
            currentQuestion: question || currentQuestion,
            interviewMode,
            interviewDuration,
            interviewTopic
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
    }, [sessionId, candidateName, roundType, personality, currentQuestion, interviewMode, interviewDuration]);

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
            if (micStreamRef.current && micAudioContextRef.current?.state !== "closed") {
                console.log("🎤 [ConvHook] Microphone already active");
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount:     1,
                    sampleRate:       16000,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl:  true
                }
            });

            micStreamRef.current = stream;

            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            micAudioContextRef.current = new AudioCtx({ sampleRate: 16000 });

            // Ensure context is not suspended by browser autoplay policy
            if (micAudioContextRef.current.state === "suspended") {
                await micAudioContextRef.current.resume();
            }

            const source = micAudioContextRef.current.createMediaStreamSource(stream);

            // ── AudioWorklet path (modern, runs on audio thread) ──────────
            if (micAudioContextRef.current.audioWorklet) {
                try {
                    // Load the processor module from /public
                    await micAudioContextRef.current.audioWorklet.addModule("/mic-processor.js");

                    const workletNode = new AudioWorkletNode(
                        micAudioContextRef.current,
                        "mic-processor",
                        {
                            processorOptions: {
                                bufferSize: 2048  // ~128ms @ 16kHz — half of old ScriptProcessor
                            },
                            channelCount:          1,
                            channelCountMode:      "explicit",
                            channelInterpretation: "speakers"
                        }
                    );

                    workletNodeRef.current = workletNode;

                    let packetCount = 0;
                    // Audio thread → main thread (zero-copy transferable buffer)
                    workletNode.port.onmessage = (e) => {
                        if (e.data?.type !== "audio") return;
                        // Guard: muted, socket not connected, or Deepgram not ready
                        if (
                            isMutedRef.current ||
                            !socketRef.current?.connected ||
                            !deepgramReadyRef.current
                        ) return;

                        socketRef.current.emit("deepgram:audio", e.data.buffer);
                        packetCount++;
                        if (packetCount % 50 === 0) {
                            console.log(`📤 [MIC-CAPTURE] Sent ${packetCount} audio packets to server...`);
                        }
                    };

                    source.connect(workletNode);
                    // Keep the worklet in the audio graph so browsers continue
                    // calling process(); gain=0 prevents local echo.
                    const sink = micAudioContextRef.current.createGain();
                    sink.gain.value = 0;
                    workletNode.connect(sink);
                    sink.connect(micAudioContextRef.current.destination);
                    workletSinkRef.current = sink;
                    console.log("🎤 [ConvHook] Microphone started (AudioWorklet — audio thread ✅)");
                    return;
                } catch (workletErr) {
                    // Worklet load failed (e.g. MIME type issue in dev) — fall through to legacy
                    console.warn("⚠️ [ConvHook] AudioWorklet failed, falling back to ScriptProcessor:", workletErr.message);
                }
            }

            // ── ScriptProcessor fallback (deprecated but universal) ───────
            console.warn("⚠️ [ConvHook] AudioWorklet not supported — using ScriptProcessor (deprecated)");
            const processor = micAudioContextRef.current.createScriptProcessor(2048, 1, 1);
            processorRef.current = processor;

            let fallbackPacketCount = 0;
            processor.onaudioprocess = (e) => {
                if (isMutedRef.current || !socketRef.current?.connected || !deepgramReadyRef.current) return;

                const inputData = e.inputBuffer.getChannelData(0);
                const int16Data = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                    const s       = Math.max(-1, Math.min(1, inputData[i]));
                    int16Data[i]  = s < 0 ? s * 0x8000 : s * 0x7FFF;
                }
                socketRef.current.emit("deepgram:audio", int16Data.buffer);
                fallbackPacketCount++;
                if (fallbackPacketCount % 50 === 0) {
                    console.log(`📤 [MIC-CAPTURE-FALLBACK] Sent ${fallbackPacketCount} audio packets to server...`);
                }
            };

            source.connect(processor);
            processor.connect(micAudioContextRef.current.destination);
            console.log("🎤 [ConvHook] Microphone started (ScriptProcessor fallback)");
        } catch (err) {
            console.error("❌ [ConvHook] Failed to start microphone:", err);
            setError("Microphone access denied. Please allow microphone access.");
            throw err;
        }
    }, []);

    const stopMicrophone = useCallback(() => {
        // Stop AudioWorklet node
        if (workletNodeRef.current) {
            try {
                workletNodeRef.current.port.postMessage({ type: "stop" });
                workletNodeRef.current.disconnect();
            } catch { /* ignore */ }
            workletNodeRef.current = null;
        }
        if (workletSinkRef.current) {
            try {
                workletSinkRef.current.disconnect();
            } catch { /* ignore */ }
            workletSinkRef.current = null;
        }

        // Stop legacy ScriptProcessor (fallback)
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }

        micStreamRef.current?.getTracks().forEach(t => t.stop());
        micStreamRef.current = null;

        if (micAudioContextRef.current?.state !== "closed") {
            micAudioContextRef.current?.close().catch(() => {});
        }
        micAudioContextRef.current = null;
        console.log("🎤 [ConvHook] Microphone stopped");
    }, []);

    useEffect(() => {
        startMicrophoneRef.current = startMicrophone;
    }, [startMicrophone]);

    const mute   = useCallback(() => { setIsMuted(true);  isMutedRef.current = true;  }, []);
    const unmute = useCallback(() => { setIsMuted(false); isMutedRef.current = false; }, []);

    // ── Audio Playback (TTS from Deepgram) ────────────────────────

    const playNextAudio = useCallback(async () => {
        if (isPlayingRef.current || audioQueueRef.current.length === 0) return;
        isPlayingRef.current = true;

        const arrayBuffer = audioQueueRef.current.shift();

        try {
            if (!playbackAudioContextRef.current || playbackAudioContextRef.current.state === "closed") {
                playbackAudioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
                    latencyHint: "interactive"
                });
            }
            if (playbackAudioContextRef.current.state === "suspended") {
                await playbackAudioContextRef.current.resume();
            }

            // decodeAudioData handles WAV header automatically — correct sampleRate,
            // no manual Int16→Float32 conversion, no header bytes misread as audio.
            const audioBuffer = await playbackAudioContextRef.current.decodeAudioData(arrayBuffer);

            const source = playbackAudioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(playbackAudioContextRef.current.destination);
            activeSourceRef.current = source;

            source.onended = () => {
                isPlayingRef.current = false;
                activeSourceRef.current = null;
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
            // Try next in queue even on error
            if (audioQueueRef.current.length > 0) {
                playNextAudio();
            }
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
        transcript, agentText, streamingText, isAgentSpeaking,
        isUserSpeaking, evaluation, turnInfo, intent,

        // Phase 7
        silenceWarning,

        // Full interview mode
        currentPhase,

        // Helpers
        clearTranscript: useCallback(() => setTranscript([]), []),
        clearError:      useCallback(() => setError(null),    []),
    };
}
