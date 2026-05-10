import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import {
  APTITUDE_TRACKS,
  buildAptitudeSession,
  getAptitudeTrack,
} from "../data/aptitudeBank";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Calculator,
  BookOpen,
  Maximize2,
  PlayCircle,
  ShieldCheck,
  Shuffle,
  Sparkles,
  Timer,
  Target,
  CheckCircle2,
  AlertTriangle,
  Layers3,
} from "lucide-react";

const TRACK_ICONS = {
  quant: Calculator,
  reasoning: Brain,
  verbal: BookOpen,
  mixed: Shuffle,
};

const ACCENT_STYLES = {
  emerald: {
    card: "border-emerald-400/30 bg-emerald-500/10",
    badge: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
    strong: "text-emerald-300",
  },
  cyan: {
    card: "border-cyan-400/30 bg-cyan-500/10",
    badge: "border-cyan-400/20 bg-cyan-500/10 text-cyan-200",
    strong: "text-cyan-300",
  },
  amber: {
    card: "border-amber-400/30 bg-amber-500/10",
    badge: "border-amber-400/20 bg-amber-500/10 text-amber-200",
    strong: "text-amber-300",
  },
  blue: {
    card: "border-sky-400/30 bg-sky-500/10",
    badge: "border-sky-400/20 bg-sky-500/10 text-sky-200",
    strong: "text-sky-300",
  },
};

const MODE_OPTIONS = [
  {
    id: "strict",
    label: "Strict",
    description: "Fullscreen lock with focus-loss detection and session warnings.",
  },
  {
    id: "timed",
    label: "Timed",
    description: "Timer runs, but focus warnings are softer for practice runs.",
  },
  {
    id: "practice",
    label: "Practice",
    description: "No penalties, just the same question flow in a cleaner shell.",
  },
];

const FLOW_STEPS = [
  {
    icon: Target,
    title: "Choose a track",
    body: "Pick Quant, Reasoning, Verbal, or the mixed aptitude lane.",
  },
  {
    icon: Maximize2,
    title: "Lock the room",
    body: "Fullscreen opens before the session begins so the test feels contained.",
  },
  {
    icon: Timer,
    title: "Start answering",
    body: "Move question by question with a live timer and review markers.",
  },
];

const getStoredDraft = () => {
  try {
    const raw = sessionStorage.getItem("xalora_aptitude_draft");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (error) {
    return null;
  }
};

const Aptitude = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const draft = useMemo(() => getStoredDraft(), []);
  const [trackId, setTrackId] = useState(draft?.trackId || "mixed");
  const [mode, setMode] = useState(draft?.mode || "strict");

  const selectedTrack = getAptitudeTrack(trackId);
  const selectedSession = buildAptitudeSession(trackId);
  const accent = ACCENT_STYLES[selectedTrack.accent] || ACCENT_STYLES.blue;
  const TrackIcon = TRACK_ICONS[selectedTrack.id] || Shuffle;

  const handleStart = async () => {
    const payload = {
      trackId,
      mode,
      startedAt: new Date().toISOString(),
    };

    try {
      sessionStorage.setItem("xalora_aptitude_draft", JSON.stringify(payload));
    } catch (error) {
      // Ignore storage errors and keep the flow moving.
    }

    try {
      if (document.fullscreenElement == null && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      // Fullscreen is best-effort. The session still opens even if the browser blocks it.
    }

    navigate("/quiz/aptitude/session", { state: payload });
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center px-4">
          <div className="max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur">
            <h2 className="text-2xl font-bold text-white">Login required</h2>
            <p className="mt-3 text-sm text-white/70">
              You need to be logged in before starting an aptitude test.
            </p>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20"
            >
              <PlayCircle className="h-4 w-4" />
              Go to login
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showFooter={false}>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">
                <Sparkles className="h-3.5 w-3.5" />
                Aptitude test start
              </p>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Pick a track, lock the room, and begin the aptitude test.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
                This is the front-end launch flow for aptitude. Quant,
                Reasoning, Verbal, and Mixed are separated so the user knows
                exactly what they are starting before the exam room opens.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/quiz")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:border-white/20 hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Quiz Hub
              </button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-sm sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                    Step 1
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    Choose the aptitude lane
                  </h2>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-medium text-white/70">
                  <Layers3 className="h-3.5 w-3.5" />
                  Sections are split by topic family
                </span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {APTITUDE_TRACKS.map((track) => {
                  const TrackCardIcon = TRACK_ICONS[track.id] || Shuffle;
                  const isSelected = track.id === trackId;
                  const trackAccent =
                    ACCENT_STYLES[track.accent] || ACCENT_STYLES.blue;

                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => setTrackId(track.id)}
                      className={`group rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                        isSelected
                          ? `${trackAccent.card} ring-1 ring-white/10`
                          : "border-white/10 bg-black/10 hover:border-white/20 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                            {track.label}
                          </p>
                          <h3 className="mt-2 text-lg font-semibold text-white">
                            {track.title}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-white/65">
                            {track.description}
                          </p>
                        </div>
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                            isSelected
                              ? "border-white/15 bg-black/20 text-white"
                              : "border-white/10 bg-white/5 text-white/80"
                          }`}
                        >
                          <TrackCardIcon className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                            isSelected ? trackAccent.badge : "border-white/10 bg-white/5 text-white/70"
                          }`}
                        >
                          {track.durationMinutes} min
                        </span>
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                            isSelected ? trackAccent.badge : "border-white/10 bg-white/5 text-white/70"
                          }`}
                        >
                          {track.questionCount} questions
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-xs text-white/55">
                        <span>Topics</span>
                        <ChevronRightGlyph isActive={isSelected} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <aside className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-2xl backdrop-blur-sm sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                    Step 2
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    Review the selected setup
                  </h2>
                </div>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border ${accent.card} text-white`}
                >
                  <TrackIcon className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">
                  Selected track
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  {selectedTrack.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  {selectedTrack.summary}
                </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                    Duration
                  </p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      {selectedTrack.durationMinutes} min
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                      Questions
                    </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {selectedTrack.questionCount}
                  </p>
                </div>
              </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                    Demo question bank
                  </p>
                  <p className="mt-1 text-sm text-white/75">
                    {selectedSession.questions.length} sample questions are loaded
                    for the front-end flow right now.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-semibold text-white">Topic buckets</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedTrack.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-sm font-semibold text-white">Exam mode</p>
                <div className="mt-3 grid gap-3">
                  {MODE_OPTIONS.map((option) => {
                    const isSelected = option.id === mode;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setMode(option.id)}
                        className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
                          isSelected
                            ? "border-emerald-400/30 bg-emerald-500/10"
                            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold text-white">
                            {option.label}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                          )}
                        </div>
                        <p className="mt-1 text-xs leading-5 text-white/60">
                          {option.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={handleStart}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-transform hover:-translate-y-0.5"
              >
                <PlayCircle className="h-5 w-5" />
                Start Exam Room
              </button>

              <div className="mt-4 grid gap-2 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs text-white/65">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  No camera permission is requested.
                </div>
                <div className="flex items-center gap-2">
                  <Maximize2 className="h-4 w-4 text-cyan-300" />
                  Fullscreen is attempted when the session starts.
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-300" />
                  Focus-loss is monitored in strict mode.
                </div>
              </div>
            </aside>
          </div>

          <section className="mt-6 grid gap-4 lg:grid-cols-3">
            {FLOW_STEPS.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-white">
                      <StepIcon className="h-5 w-5 text-cyan-300" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.18em] text-white/40">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    {step.body}
                  </p>
                </div>
              );
            })}
          </section>
        </div>
      </div>
    </Layout>
  );
};

const ChevronRightGlyph = ({ isActive }) => (
  <span
    className={`inline-flex items-center gap-1 text-xs font-medium ${
      isActive ? "text-white/90" : "text-white/45"
    }`}
  >
    View
    <ArrowRight className="h-3.5 w-3.5" />
  </span>
);

export default Aptitude;
