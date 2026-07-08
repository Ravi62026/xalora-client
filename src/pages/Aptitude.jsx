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
    card: "border-emerald-200 bg-emerald-50/60",
    badge: "border-emerald-100 bg-emerald-50 text-emerald-700 font-semibold",
    strong: "text-emerald-800 font-bold",
  },
  cyan: {
    card: "border-cyan-200 bg-cyan-50/60",
    badge: "border-cyan-100 bg-cyan-50 text-cyan-700 font-semibold",
    strong: "text-cyan-800 font-bold",
  },
  amber: {
    card: "border-amber-200 bg-amber-50/60",
    badge: "border-amber-100 bg-amber-50 text-amber-700 font-semibold",
    strong: "text-amber-800 font-bold",
  },
  blue: {
    card: "border-sky-200 bg-sky-50/60",
    badge: "border-sky-100 bg-sky-50 text-sky-700 font-semibold",
    strong: "text-sky-800 font-bold",
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
        <div className="min-h-screen xalora-grid-bg flex items-center justify-center px-4">
          <div className="max-w-md w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Login required</h2>
            <p className="mt-3 text-sm text-slate-600">
              You need to be logged in before starting an aptitude test.
            </p>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-100"
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
      <div className="min-h-screen xalora-grid-bg py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-indigo-700">
                <Sparkles className="h-3.5 w-3.5" />
                Aptitude test start
              </p>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Pick a track, lock the room, and begin the aptitude test.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                This is the launch flow for aptitude. Quant,
                Reasoning, Verbal, and Mixed are separated so you know
                exactly what you are starting before the exam room opens.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/quiz")}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Quiz Hub
              </button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-bold">
                    Step 1
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-slate-900">
                    Choose the aptitude lane
                  </h2>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                  <Layers3 className="h-3.5 w-3.5" />
                  Sections split by topic family
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
                          ? `${trackAccent.card} ring-1 ring-slate-200/50`
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400 font-bold">
                            {track.label}
                          </p>
                          <h3 className="mt-2 text-lg font-black text-slate-900">
                            {track.title}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {track.description}
                          </p>
                        </div>
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                            isSelected
                              ? "border-slate-300 bg-white text-indigo-600"
                              : "border-slate-200 bg-slate-100 text-slate-700"
                          }`}
                        >
                          <TrackCardIcon className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                            isSelected ? trackAccent.badge : "border-slate-200 bg-white text-slate-600"
                          }`}
                        >
                          {track.durationMinutes} min
                        </span>
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                            isSelected ? trackAccent.badge : "border-slate-200 bg-white text-slate-600"
                          }`}
                        >
                          {track.questionCount} questions
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-semibold">
                        <span>Topics</span>
                        <ChevronRightGlyph isActive={isSelected} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <aside className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-bold">
                    Step 2
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-slate-900">
                    Review the selected setup
                  </h2>
                </div>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border ${accent.card} text-slate-800`}
                >
                  <TrackIcon className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400 font-bold">
                  Selected track
                </p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">
                  {selectedTrack.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {selectedTrack.summary}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 font-bold">
                      Duration
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {selectedTrack.durationMinutes} min
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 font-bold">
                      Questions
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {selectedTrack.questionCount}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-3 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 font-bold">
                    Demo question bank
                  </p>
                  <p className="mt-1 text-sm text-slate-600 font-medium">
                    {selectedSession.questions.length} sample questions are loaded
                    for the session.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-bold text-slate-800">Topic buckets</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedTrack.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-sm font-bold text-slate-800">Exam mode</p>
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
                            ? "border-emerald-200 bg-emerald-50/60"
                            : "border-slate-200 bg-slate-50 hover:bg-slate-100/50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-bold text-slate-800">
                            {option.label}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          )}
                        </div>
                        <p className="mt-1 text-xs leading-5 text-slate-500 font-medium">
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
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 px-5 py-4 text-sm font-bold text-white shadow-md shadow-indigo-100 transition-transform hover:-translate-y-0.5"
              >
                <PlayCircle className="h-5 w-5" />
                Start Exam Room
              </button>

              <div className="mt-4 grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 font-semibold">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  No camera permission is requested.
                </div>
                <div className="flex items-center gap-2">
                  <Maximize2 className="h-4 w-4 text-indigo-600" />
                  Fullscreen is attempted when the session starts.
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
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
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
                      <StepIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.18em] text-slate-400 font-bold">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
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
    className={`inline-flex items-center gap-1 text-xs font-semibold ${
      isActive ? "text-slate-800" : "text-slate-400"
    }`}
  >
    View
    <ArrowRight className="h-3.5 w-3.5" />
  </span>
);

export default Aptitude;
