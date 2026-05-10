import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Award,
  CheckCircle2,
  Flag,
  Maximize2,
  MonitorOff,
  RefreshCw,
  ShieldCheck,
  Timer,
} from "lucide-react";
import {
  buildAptitudeSession,
  getAptitudeTrack,
} from "../data/aptitudeBank";

const readStoredDraft = () => {
  try {
    const raw = sessionStorage.getItem("xalora_aptitude_draft");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (error) {
    return null;
  }
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const buildSectionSummary = (questions, answers) =>
  questions.reduce((acc, question, index) => {
    const section = question.section || "Aptitude";
    if (!acc[section]) {
      acc[section] = {
        total: 0,
        correct: 0,
        unanswered: 0,
      };
    }

    const bucket = acc[section];
    const userAnswer = answers[index];

    bucket.total += 1;
    if (userAnswer === null || userAnswer === undefined) {
      bucket.unanswered += 1;
    } else if (userAnswer === question.answerIndex) {
      bucket.correct += 1;
    }

    return acc;
  }, {});

const AptitudeSession = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const draft = useMemo(() => readStoredDraft(), []);
  const startPayload = location.state || draft || {};
  const selectedTrackId = startPayload.trackId || "mixed";
  const selectedMode = startPayload.mode || "strict";
  const session = useMemo(
    () => buildAptitudeSession(selectedTrackId),
    [selectedTrackId]
  );
  const selectedTrack = getAptitudeTrack(selectedTrackId);
  const questions = session.questions;
  const [answers, setAnswers] = useState(() =>
    Array(questions.length).fill(null)
  );
  const [reviewFlags, setReviewFlags] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(session.timeLimitSeconds);
  const [violationCount, setViolationCount] = useState(0);
  const [focusBlocked, setFocusBlocked] = useState(false);
  const [pausedReason, setPausedReason] = useState("");
  const [fullscreenActive, setFullscreenActive] = useState(
    typeof document !== "undefined" ? Boolean(document.fullscreenElement) : false
  );
  const [stage, setStage] = useState("exam");
  const [result, setResult] = useState(null);
  const focusLockRef = useRef(false);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        "xalora_aptitude_draft",
        JSON.stringify({
          trackId: selectedTrackId,
          mode: selectedMode,
          startedAt: new Date().toISOString(),
        })
      );
    } catch (error) {
      // Ignore storage issues and keep the exam moving.
    }
  }, [selectedTrackId, selectedMode]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const syncFullscreen = () => {
      setFullscreenActive(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", syncFullscreen);

    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  const triggerFocusLock = (reason) => {
    if (selectedMode === "practice") return;
    if (focusLockRef.current) return;

    focusLockRef.current = true;
    setFocusBlocked(true);
    setPausedReason(reason);
    setViolationCount((count) => count + 1);
  };

  const releaseFocusLock = () => {
    focusLockRef.current = false;
    setFocusBlocked(false);
    setPausedReason("");
  };

  useEffect(() => {
    if (selectedMode === "practice") return undefined;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerFocusLock("Tab switch detected. The exam is paused.");
      }
    };

    const handleBlur = () => {
      triggerFocusLock("Window focus changed. The exam is paused.");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [selectedMode]);

  useEffect(() => {
    if (stage !== "exam" || focusBlocked) return undefined;

    if (timeLeft <= 0) {
      handleSubmit(true);
      return undefined;
    }

    const timer = setTimeout(() => {
      setTimeLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, focusBlocked, timeLeft]);

  const currentQuestion = questions[currentQuestionIndex];

  const updateAnswer = (optionIndex) => {
    const nextAnswers = [...answers];
    nextAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(nextAnswers);
  };

  const toggleReviewFlag = () => {
    const questionId = currentQuestion?.id;
    if (!questionId) return;

    setReviewFlags((current) => ({
      ...current,
      [questionId]: !current[questionId],
    }));
  };

  const jumpToQuestion = (index) => {
    if (index < 0 || index >= questions.length) return;
    setCurrentQuestionIndex(index);
  };

  function handleSubmit(autoSubmit = false) {
    const totalQuestions = questions.length;
    const correctCount = questions.reduce((count, question, index) => {
      return count + (answers[index] === question.answerIndex ? 1 : 0);
    }, 0);
    const answeredCount = answers.filter((value) => value !== null).length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const sectionSummary = buildSectionSummary(questions, answers);

    setStage("result");
    setResult({
      autoSubmit,
      score,
      correctCount,
      totalQuestions,
      answeredCount,
      timeTaken: session.timeLimitSeconds - timeLeft,
      sectionSummary,
      violations: violationCount,
    });

    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch (error) {
      // Best-effort cleanup only.
    }

    try {
      sessionStorage.removeItem("xalora_aptitude_draft");
    } catch (error) {
      // Ignore cleanup failures.
    }
  }

  const restartSession = () => {
    navigate("/quiz/aptitude");
  };

  const exitToQuiz = () => {
    navigate("/quiz");
  };

  const enterFullscreenAgain = async () => {
    try {
      if (document.fullscreenElement == null && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      // Ignore. The badge will still reflect the current fullscreen state.
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center px-4">
          <div className="max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur">
            <h2 className="text-2xl font-bold text-white">Login required</h2>
            <p className="mt-3 text-sm text-white/70">
              You need to be logged in before entering the aptitude room.
            </p>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20"
            >
              <ShieldCheck className="h-4 w-4" />
              Go to login
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (stage === "result" && result) {
    const trackAccent =
      selectedTrack.accent === "emerald"
        ? "text-emerald-300"
        : selectedTrack.accent === "cyan"
        ? "text-cyan-300"
        : selectedTrack.accent === "amber"
        ? "text-amber-300"
        : "text-sky-300";

    return (
      <Layout showNavbar={false} showFooter={false}>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={exitToQuiz}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:border-white/20 hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to quiz hub
              </button>
              <span className={`text-xs font-semibold uppercase tracking-[0.22em] ${trackAccent}`}>
                Aptitude result
              </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                  Result summary
                </p>
                <h1 className="mt-3 text-3xl font-bold text-white">
                  {selectedTrack.title}
                </h1>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Your aptitude session finished in a focused exam room with
                  focus-loss tracking, no camera request, and a single-question
                  flow.
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                      Score
                    </p>
                    <p className="mt-2 text-3xl font-bold text-white">{result.score}%</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                      Correct answers
                    </p>
                    <p className="mt-2 text-3xl font-bold text-white">
                      {result.correctCount}/{result.totalQuestions}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                      Time used
                    </p>
                    <p className="mt-2 text-3xl font-bold text-white">
                      {formatTime(result.timeTaken)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                      Focus violations
                    </p>
                    <p className="mt-2 text-3xl font-bold text-white">
                      {result.violations}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={restartSession}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Retake aptitude
                  </button>
                  <button
                    type="button"
                    onClick={exitToQuiz}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-colors hover:border-white/20 hover:bg-white/10"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Return to quiz hub
                  </button>
                </div>
              </section>

              <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                  Section-wise view
                </p>
                <div className="mt-5 space-y-4">
                  {Object.entries(result.sectionSummary).map(([section, stats]) => {
                    const accuracy =
                      stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                    return (
                      <div
                        key={section}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-white">{section}</p>
                            <p className="mt-1 text-xs text-white/50">
                              {stats.correct} correct, {stats.unanswered} unanswered
                            </p>
                          </div>
                          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-sm font-semibold text-white">
                            {accuracy}%
                          </span>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-white/10">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                            style={{ width: `${accuracy}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                  <div className="flex items-center gap-2 font-semibold">
                    <Award className="h-4 w-4" />
                    What this screen proves
                  </div>
                  <p className="mt-2 text-emerald-50/80 leading-6">
                    The user can start from the quiz hub, choose a lane, lock
                    the room, answer a question flow, and finish inside a strict
                    exam shell without any camera or sharing request.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const trackAccent =
    selectedTrack.accent === "emerald"
      ? "text-emerald-300"
      : selectedTrack.accent === "cyan"
      ? "text-cyan-300"
      : selectedTrack.accent === "amber"
      ? "text-amber-300"
      : "text-sky-300";
  const currentQuestionNumber = currentQuestionIndex + 1;
  const progressWidth =
    questions.length > 0 ? Math.min(100, (currentQuestionNumber / questions.length) * 100) : 0;
  const hardLock = selectedMode === "strict" && violationCount >= 3;

  return (
    <Layout showNavbar={false} showFooter={false}>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        <div className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">
                Aptitude exam room
              </p>
              <h1 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                {selectedTrack.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-white/70">
                <Timer className="h-3.5 w-3.5" />
                {formatTime(timeLeft)}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-white/70">
                <ShieldCheck className="h-3.5 w-3.5" />
                {selectedMode}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-white/70">
                {fullscreenActive ? (
                  <>
                    <Maximize2 className="h-3.5 w-3.5" />
                    fullscreen active
                  </>
                ) : (
                  <>
                    <MonitorOff className="h-3.5 w-3.5" />
                    fullscreen off
                  </>
                )}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-white/70">
                <AlertTriangle className="h-3.5 w-3.5" />
                violations {violationCount}
              </span>
              <button
                type="button"
                onClick={enterFullscreenAgain}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-white/80 transition-colors hover:bg-emerald-500/20"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                fullscreen
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={exitToQuiz}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:border-white/20 hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Exit session
            </button>
            <span className={`text-xs font-semibold uppercase tracking-[0.22em] ${trackAccent}`}>
              {selectedTrack.label} lane
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
            <aside className="space-y-4">
              <section className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                    Question map
                  </p>
                  <span className="text-xs text-white/50">
                    {currentQuestionNumber}/{questions.length}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-6">
                  {questions.map((question, index) => {
                    const isActive = index === currentQuestionIndex;
                    const isAnswered = answers[index] !== null;
                    const isReviewed = Boolean(reviewFlags[question.id]);

                    return (
                      <button
                        key={question.id}
                        type="button"
                        onClick={() => jumpToQuestion(index)}
                        className={`flex h-10 items-center justify-center rounded-xl border text-xs font-semibold transition-all ${
                          isActive
                            ? "border-cyan-400/40 bg-cyan-500/20 text-cyan-100"
                            : isReviewed
                            ? "border-amber-400/30 bg-amber-500/15 text-amber-100"
                            : isAnswered
                            ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-100"
                            : "border-white/10 bg-black/20 text-white/60 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                  Topic buckets
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedTrack.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  Strict room rules
                </div>
                <div className="mt-3 space-y-3 text-sm text-white/65">
                  <div className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    <span>No camera permission is required.</span>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    <span>Tab switching triggers a pause in strict mode.</span>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    <span>Questions advance one at a time with review markers.</span>
                  </div>
                </div>
              </section>
            </aside>

            <main className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-sm sm:p-6">
              {focusBlocked && (
                <div className="mb-5 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                    <div>
                      <p className="font-semibold text-amber-100">Focus changed</p>
                      <p className="mt-1 text-sm leading-6 text-amber-50/80">
                        {pausedReason || "The exam is paused until you return focus."}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {!hardLock && (
                          <button
                            type="button"
                            onClick={() => {
                              releaseFocusLock();
                              enterFullscreenAgain();
                            }}
                            className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-950"
                          >
                            Resume exam
                          </button>
                        )}
                        {hardLock && (
                          <button
                            type="button"
                            onClick={() => handleSubmit(true)}
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-colors hover:border-white/20 hover:bg-white/10"
                          >
                            Submit now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {hardLock && (
                <div className="mb-5 rounded-2xl border border-red-400/30 bg-red-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <MonitorOff className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
                    <div>
                      <p className="font-semibold text-red-100">Session locked</p>
                      <p className="mt-1 text-sm leading-6 text-red-50/80">
                        Repeated focus losses locked the room. You can submit now or exit the session.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {currentQuestion && (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
                      {currentQuestion.section}
                    </span>
                    <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-medium text-white/70">
                      {currentQuestion.topic}
                    </span>
                    <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-medium text-white/70">
                      Question {currentQuestionNumber} of {questions.length}
                    </span>
                    {reviewFlags[currentQuestion.id] && (
                      <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
                        Marked for review
                      </span>
                    )}
                  </div>

                  <div className="mt-5">
                    <div className="mb-4">
                      <div className="mb-2 flex items-center justify-between gap-3 text-sm text-white/50">
                        <span>Progress</span>
                        <span>{Math.round(progressWidth)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-500"
                          style={{ width: `${progressWidth}%` }}
                        />
                      </div>
                    </div>

                    <h2 className="text-2xl font-semibold leading-relaxed text-white">
                      {currentQuestion.prompt}
                    </h2>
                  </div>

                  <div className="mt-6 space-y-3">
                    {currentQuestion.options.map((option, index) => {
                      const isSelected = answers[currentQuestionIndex] === index;
                      return (
                        <button
                          key={option}
                          type="button"
                          disabled={hardLock}
                          onClick={() => updateAnswer(index)}
                          className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                            isSelected
                              ? "border-emerald-400/40 bg-emerald-500/15"
                              : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-white/10"
                          } ${hardLock ? "cursor-not-allowed opacity-60" : ""}`}
                        >
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${
                              isSelected
                                ? "border-emerald-300 bg-emerald-300/20 text-emerald-100"
                                : "border-white/10 bg-white/5 text-white/65"
                            }`}
                          >
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-sm leading-6 text-white/85">
                            {option}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => jumpToQuestion(currentQuestionIndex - 1)}
                        disabled={currentQuestionIndex === 0}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={toggleReviewFlag}
                        className="inline-flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-100 transition-colors hover:bg-amber-500/20"
                      >
                        <Flag className="h-4 w-4" />
                        {reviewFlags[currentQuestion.id] ? "Unmark" : "Mark review"}
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      {currentQuestionIndex < questions.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => jumpToQuestion(currentQuestionIndex + 1)}
                          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20"
                        >
                          Next
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSubmit(false)}
                          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20"
                        >
                          <Award className="h-4 w-4" />
                          Submit aptitude
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AptitudeSession;
