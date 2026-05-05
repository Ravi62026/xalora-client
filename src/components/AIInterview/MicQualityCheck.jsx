/**
 * MicQualityCheck Component
 * 
 * PURPOSE: Pre-interview microphone quality assessment.
 * Shows before conversational interview starts to ensure
 * the candidate has a working mic with acceptable audio quality.
 * 
 * FEATURES:
 * - Real-time audio level visualization
 * - Quality assessment: Good / Fair / Poor
 * - Noise level indicator
 * - Recommendations for improvement
 * 
 * USAGE:
 *   <MicQualityCheck onComplete={(quality) => startInterview(quality)} />
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Volume2, CheckCircle, AlertTriangle, XCircle, Headphones } from "lucide-react";

export default function MicQualityCheck({ onComplete, onSkip }) {
    const [status, setStatus] = useState("idle"); // idle | testing | done | error
    const [quality, setQuality] = useState(null); // good | fair | poor
    const [level, setLevel] = useState(0); // 0-100 audio level
    const [recommendation, setRecommendation] = useState("");
    const [error, setError] = useState(null);

    const streamRef = useRef(null);
    const contextRef = useRef(null);
    const analyserRef = useRef(null);
    const animFrameRef = useRef(null);
    const samplesRef = useRef([]);

    const startTest = useCallback(async () => {
        setStatus("testing");
        setError(null);
        setQuality(null);
        samplesRef.current = [];

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
            });

            streamRef.current = stream;
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            contextRef.current = ctx;

            const analyser = ctx.createAnalyser();
            analyserRef.current = analyser;
            analyser.fftSize = 256;

            const source = ctx.createMediaStreamSource(stream);
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            let maxLevel = 0;
            let totalSamples = 0;
            const startTime = Date.now();

            const measure = () => {
                analyser.getByteFrequencyData(dataArray);
                const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
                const normalized = Math.min(100, (avg / 128) * 100);
                setLevel(normalized);
                maxLevel = Math.max(maxLevel, avg);
                samplesRef.current.push(avg);
                totalSamples++;

                // Test for ~3 seconds
                if (Date.now() - startTime < 3000) {
                    animFrameRef.current = requestAnimationFrame(measure);
                } else {
                    // Analysis complete
                    cleanup();

                    const avgLevel =
                        samplesRef.current.reduce((a, b) => a + b, 0) /
                        samplesRef.current.length;

                    let q, rec;
                    if (maxLevel > 40 && avgLevel > 8) {
                        q = "good";
                        rec = "Audio quality is excellent! You're ready to begin.";
                    } else if (maxLevel > 15 || avgLevel > 3) {
                        q = "fair";
                        rec = "Audio is acceptable. Using headphones will improve clarity.";
                    } else {
                        q = "poor";
                        rec = "Mic level is very low. Try speaking louder or moving closer to the mic.";
                    }

                    setQuality(q);
                    setRecommendation(rec);
                    setStatus("done");
                }
            };

            // Start measurement
            animFrameRef.current = requestAnimationFrame(measure);
        } catch (err) {
            console.error("[MicCheck] Error:", err);
            setStatus("error");
            setError(
                err.name === "NotAllowedError"
                    ? "Microphone access denied. Please allow mic access in your browser settings."
                    : err.name === "NotFoundError"
                    ? "No microphone found. Please connect a mic and try again."
                    : `Mic error: ${err.message}`
            );
        }
    }, []);

    const cleanup = useCallback(() => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        if (streamRef.current)
            streamRef.current.getTracks().forEach((t) => t.stop());
        if (contextRef.current && contextRef.current.state !== "closed")
            contextRef.current.close();
    }, []);

    useEffect(() => {
        return () => cleanup();
    }, [cleanup]);

    const qualityConfig = {
        good: {
            icon: CheckCircle,
            color: "emerald",
            bgGradient: "from-emerald-500/10 to-emerald-600/5",
            borderColor: "border-emerald-500/30",
            textColor: "text-emerald-400",
            label: "Excellent",
        },
        fair: {
            icon: AlertTriangle,
            color: "amber",
            bgGradient: "from-amber-500/10 to-amber-600/5",
            borderColor: "border-amber-500/30",
            textColor: "text-amber-400",
            label: "Acceptable",
        },
        poor: {
            icon: XCircle,
            color: "red",
            bgGradient: "from-red-500/10 to-red-600/5",
            borderColor: "border-red-500/30",
            textColor: "text-red-400",
            label: "Poor",
        },
    };

    const qConfig = quality ? qualityConfig[quality] : null;
    const QualityIcon = qConfig?.icon;

    return (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-6 max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                    <Mic className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-base font-bold text-white">Mic Quality Check</h3>
                    <p className="text-xs text-slate-400">
                        Ensure your microphone is working properly
                    </p>
                </div>
            </div>

            {/* Level Visualizer */}
            {status === "testing" && (
                <div className="mb-5">
                    <div className="flex items-center gap-3 mb-2">
                        <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
                        <span className="text-xs text-purple-300 font-medium">
                            Speak now — say "Hello, my name is..."
                        </span>
                    </div>
                    <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                        <div
                            className="h-full rounded-full transition-all duration-75"
                            style={{
                                width: `${level}%`,
                                background: level > 50
                                    ? "linear-gradient(90deg, #10b981, #34d399)"
                                    : level > 20
                                    ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                                    : "linear-gradient(90deg, #ef4444, #f87171)",
                            }}
                        />
                    </div>
                    <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-slate-500">Low</span>
                        <span className="text-[10px] text-slate-500">High</span>
                    </div>
                </div>
            )}

            {/* Result */}
            {status === "done" && qConfig && (
                <div
                    className={`mb-5 p-4 rounded-xl bg-gradient-to-br ${qConfig.bgGradient} border ${qConfig.borderColor}`}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <QualityIcon className={`w-5 h-5 ${qConfig.textColor}`} />
                        <span className={`text-sm font-bold ${qConfig.textColor}`}>
                            Quality: {qConfig.label}
                        </span>
                    </div>
                    <p className="text-xs text-slate-300">{recommendation}</p>

                    {quality !== "good" && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700/50">
                            <Headphones className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-[11px] text-slate-400">
                                Tip: Use headphones for the best experience
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Error */}
            {status === "error" && (
                <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                    <div className="flex items-center gap-2 mb-1">
                        <MicOff className="w-4 h-4 text-red-400" />
                        <span className="text-sm font-medium text-red-400">
                            Mic Not Available
                        </span>
                    </div>
                    <p className="text-xs text-red-300/80">{error}</p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
                {status === "idle" && (
                    <button
                        onClick={startTest}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-xl transition-all"
                    >
                        <Mic className="w-4 h-4" />
                        Test Microphone
                    </button>
                )}

                {status === "testing" && (
                    <div className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600/30 text-purple-300 text-sm font-medium rounded-xl cursor-wait">
                        <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                        Listening...
                    </div>
                )}

                {status === "done" && (
                    <>
                        <button
                            onClick={startTest}
                            className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-xl transition-all"
                        >
                            Retest
                        </button>
                        <button
                            onClick={() => onComplete?.(quality)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-white text-sm font-medium rounded-xl transition-all ${
                                quality === "poor"
                                    ? "bg-amber-600 hover:bg-amber-500"
                                    : "bg-emerald-600 hover:bg-emerald-500"
                            }`}
                        >
                            <CheckCircle className="w-4 h-4" />
                            {quality === "poor" ? "Continue Anyway" : "Continue"}
                        </button>
                    </>
                )}

                {status === "error" && (
                    <>
                        <button
                            onClick={startTest}
                            className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-xl transition-all"
                        >
                            Retry
                        </button>
                        {onSkip && (
                            <button
                                onClick={onSkip}
                                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-xl transition-all border border-slate-600"
                            >
                                Skip (Text Mode)
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
