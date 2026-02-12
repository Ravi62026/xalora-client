import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Volume2,
  RefreshCw
} from 'lucide-react';
import { Layout } from '../../components';
import InterviewerAvatar from '../../components/AIInterview/InterviewerAvatar';
import interviewService from '../../services/interviewService';
import ReactMarkdown from 'react-markdown';

// Round configuration
const ROUND_CONFIG = {
  1: { type: 'formal_qa', name: 'Formal Q&A', color: 'blue', maxQuestions: 10 },
  2: { type: 'technical', name: 'Technical', color: 'purple', maxQuestions: 15 },
  3: { type: 'coding', name: 'Coding Challenge', color: 'emerald', maxQuestions: 3 },
  4: { type: 'system_design', name: 'System Design', color: 'orange', maxQuestions: 2 },
  5: { type: 'behavioral', name: 'HR', color: 'pink', maxQuestions: 3 },
};

const InterviewRound = () => {
  const { sessionId: paramSessionId, roundType } = useParams();
  const navigate = useNavigate();

  // Find round number from type
  const roundNum = parseInt(Object.keys(ROUND_CONFIG).find(key => ROUND_CONFIG[key].type === roundType)) || 1;
  const roundConfig = ROUND_CONFIG[roundNum] || ROUND_CONFIG[1];

  // Session state
  const [sessionId, setSessionId] = useState(paramSessionId);
  const [sessionData, setSessionData] = useState(null);

  // Interview state
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentFollowup, setCurrentFollowup] = useState(null);
  const [isFollowup, setIsFollowup] = useState(false);
  const [answer, setAnswer] = useState('');
  const [questionNumber, setQuestionNumber] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [lastScore, setLastScore] = useState(null);
  const [streamedText, setStreamedText] = useState('');
  const streamTimerRef = useRef(null);

  // Timer state
  const [duration, setDuration] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 min per round

  // Media state
  const [stream, setStream] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Refs
  const videoRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const hasInitialized = useRef(false);
  const isSpecificMode = sessionData?.interviewMode === 'specific';

  // Initialize session data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('interviewSessionData');

    if (savedData) {
      try {
        setSessionData(JSON.parse(savedData));
      } catch (e) {
        console.error('Failed to parse session data');
      }
    }
  }, []);

  // Initialize media
  useEffect(() => {
    const initMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Media error:', error);
        // Try audio only
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          setStream(audioStream);
        } catch (e) {
          setError('Please enable microphone access to continue');
        }
      }
    };

    initMedia();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (isComplete && stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsVideoOn(false);
    }
  }, [isComplete, stream]);

  // Duration timer
  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(prev => prev + 1);
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Reset and fetch question when round changes
  useEffect(() => {
    // Reset state
    setQuestionNumber(0);
    setCurrentQuestion(null);
    setIsComplete(false);
    setAnswer('');
    setFeedback(null);
    setError(null);
    hasInitialized.current = false;

    // Fetch first question after reset
    if (sessionId) {
      const timer = setTimeout(() => {
        hasInitialized.current = true;
        fetchQuestion();
      }, 100); // Small delay to ensure state is reset

      return () => clearTimeout(timer);
    }
  }, [roundType, sessionId]);

  // Format time helper
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Fetch question from API
  const fetchQuestion = async () => {
    if (!sessionId) return;

    setIsLoading(true);
    setLoadingMessage('Generating your next question...');
    setError(null);
    setFeedback(null);

    try {
      const response = await interviewService.getQuestion(
        sessionId,
        roundConfig.type,
        roundConfig.maxQuestions,
        sessionData?.codingDifficulty
      );

      if (response.success) {
        if (roundConfig.type === 'coding' && response.data?.problemId) {
          if (!response.data?.reuseExisting) {
            if (response.data?.questionNumber) {
              setQuestionNumber(response.data.questionNumber);
            } else {
              setQuestionNumber(prev => prev + 1);
            }
          }
          navigate(`/problem/${response.data.problemId}/${sessionId}`);
          return;
        }
        setCurrentQuestion(response.data.question);
        setCurrentFollowup(null);
        setIsFollowup(false);
        if (response.data?.questionNumber) {
          setQuestionNumber(response.data.questionNumber);
        } else {
          setQuestionNumber(prev => prev + 1);
        }
        setAnswer('');

        // Speak the question using TTS
        if (response.data.question?.text) {
          speakQuestion(response.data.question.text);
        }
      } else {
        throw new Error(response.message || 'Failed to get question');
      }
    } catch (err) {
      console.error('Fetch question error:', err);

      // Check if round is complete
      if (err.response?.data?.roundComplete) {
        setIsComplete(true);
      } else {
        setError(err.response?.data?.message || err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Submit answer
  const handleSubmitAnswer = async () => {
    if (!answer.trim() || isLoading) return;

    setIsLoading(true);
    setLoadingMessage('Analyzing your response...');
    setError(null);

    try {
      let response;

      if (isFollowup && currentFollowup) {
        response = await interviewService.submitFollowupAnswer(
          sessionId,
          roundConfig.type,
          currentFollowup?.text || currentFollowup,
          answer.trim(),
          timeRemaining
        );
      } else {
        response = await interviewService.submitAnswer(
          sessionId,
          roundConfig.type,
          currentQuestion.id || currentQuestion._id,
          answer.trim(),
          timeRemaining
        );
      }

      if (response.success) {
        const { evaluation, action, nextAction, followupQuestion, feedback: apiFeedback } = response.data;
        const finalAction = action || nextAction;

        // Show feedback
        if (evaluation) {
          setLastScore(evaluation.overallScore);
        }
        if (apiFeedback) {
          setFeedback(apiFeedback);
        }

        setAnswer('');

        // Handle next action
        setTimeout(() => {
          if (finalAction === 'followup' && followupQuestion) {
            // Normalize followup structure (backend sends string, we need object)
            const normalizedFollowup = typeof followupQuestion === 'string'
              ? { text: followupQuestion }
              : followupQuestion;

            setCurrentFollowup(normalizedFollowup);
            setIsFollowup(true);
            speakQuestion(normalizedFollowup.text || followupQuestion);
          } else if (finalAction === 'next_question' || response.data.roundComplete === false) {
            if (questionNumber >= roundConfig.maxQuestions || response.data.roundComplete === true) {
              setIsComplete(true);
            } else {
              setFeedback(null);
              fetchQuestion();
            }
          } else if (finalAction === 'complete_round' || response.data.roundComplete === true) {
            setIsComplete(true);
          } else {
            // Default: get next question
            if (questionNumber >= roundConfig.maxQuestions) {
              setIsComplete(true);
            } else {
              fetchQuestion();
            }
          }
        }, 2000); // Show feedback for 2 seconds
      } else {
        throw new Error(response.message || 'Failed to submit answer');
      }
    } catch (err) {
      console.error('Submit answer error:', err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Text to speech
  const pickMaleEnglishIndiaVoice = () => {
    const voices = speechSynthesis.getVoices() || [];
    if (!voices.length) return null;

    const isMaleName = (name = "") =>
      /male|man|guy|david|mark|alex|daniel|ravi|amit|arjun|raj|vikram|sidd/i.test(name);

    // Prefer en-IN male voices
    const enInMale = voices.find(v => v.lang === 'en-IN' && isMaleName(v.name));
    if (enInMale) return enInMale;

    // Fallback: any en-IN voice
    const enInAny = voices.find(v => v.lang === 'en-IN');
    if (enInAny) return enInAny;

    // Fallback: any English male voice
    const enMale = voices.find(v => /^en/i.test(v.lang) && isMaleName(v.name));
    if (enMale) return enMale;

    // Final fallback: any English voice
    return voices.find(v => /^en/i.test(v.lang)) || voices[0] || null;
  };

  const speakQuestion = async (text) => {
    // Validate text
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      console.warn('TTS: No valid text provided');
      return;
    }

    if (!('speechSynthesis' in window)) {
      console.warn('TTS: speechSynthesis not supported');
      return;
    }

    setIsSpeaking(true);
    try {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';

      const chosenVoice = pickMaleEnglishIndiaVoice();
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      } else {
        // Handle async voice loading
        speechSynthesis.onvoiceschanged = () => {
          const voice = pickMaleEnglishIndiaVoice();
          if (voice) {
            utterance.voice = voice;
          }
          speechSynthesis.speak(utterance);
        };
      }

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      const estimatedDurationMs = estimateTtsDurationMs(text);
      speechSynthesis.speak(utterance);
      startTextStream(text, estimatedDurationMs);
    } catch (error) {
      console.error('Browser TTS error:', error);
      setIsSpeaking(false);
    }
  };

  const estimateTtsDurationMs = (text) => {
    const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
    const wordsPerSecond = 2.6; // ~156 wpm
    const estimated = Math.round((words / wordsPerSecond) * 1000);
    return Math.max(1500, Math.min(12000, estimated));
  };

  const startTextStream = (text, durationMs = null) => {
    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }
    const cleanText = (text || '').toString();
    setStreamedText('');
    let index = 0;
    const speedMs = durationMs
      ? Math.max(12, Math.round(durationMs / Math.max(1, cleanText.length)))
      : 32;
    streamTimerRef.current = setInterval(() => {
      index += 1;
      setStreamedText(cleanText.slice(0, index));
      if (index >= cleanText.length) {
        clearInterval(streamTimerRef.current);
        streamTimerRef.current = null;
      }
    }, speedMs);
  };

  // Speech recognition
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setAnswer(prev => {
        // Append new speech to existing text
        if (prev && !prev.endsWith(' ') && transcript) {
          return prev + ' ' + transcript;
        }
        return prev + transcript;
      });
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Toggle mic
  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoOn;
      });
      setIsVideoOn(!isVideoOn);
    }
  };

  // End call / Complete round (force end interview)
  const handleEndCall = async () => {
    // Stop media
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      await interviewService.completeRound(sessionId, roundConfig.type);
    } catch (e) {
      console.error('Error completing round:', e);
    }

    // Always end interview and go to report
    navigate(`/ai-interview/${sessionId}/report`);
  };

  // Skip current question (for testing)
  const handleSkipQuestion = () => {
    if (questionNumber >= roundConfig.maxQuestions) {
      setIsComplete(true);
    } else {
      setAnswer('');
      setFeedback(null);
      setCurrentFollowup(null);
      setIsFollowup(false);
      fetchQuestion();
    }
  };

  // Skip entire round (for testing)
  const handleSkipRound = () => {
    setIsComplete(true);
  };

  // Proceed to next round
  const handleNextRound = () => {
    const isSpecificMode = sessionData?.interviewMode === 'specific';

    if (roundNum < 5 && !isSpecificMode) {
      const nextRoundType = ROUND_CONFIG[roundNum + 1].type;
      navigate(`/ai-interview/${sessionId}/round/${nextRoundType}`);
    } else {
      navigate(`/ai-interview/${sessionId}/report`);
    }
  };

  // Auto-redirect for specific rounds
  useEffect(() => {
    if (isComplete && isSpecificMode) {
      const timer = setTimeout(() => {
        handleNextRound();
      }, 3000); // 3 seconds delay for "Generating Report" message
      return () => clearTimeout(timer);
    }
  }, [isComplete, isSpecificMode]);

  // Color mapping removed in favor of static palette for immersive UI
  const displayQuestion = isFollowup ? currentFollowup?.text : currentQuestion?.text;
  const subtitleText = displayQuestion || (isLoading ? loadingMessage : 'Waiting for question...');
  const interviewStatus = isSpeaking
    ? 'Speaking'
    : isLoading
      ? 'Evaluating'
      : isListening
        ? 'Listening'
        : 'Ready';
  const statusClasses = isSpeaking
    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
    : isLoading
      ? 'border-amber-500/40 bg-amber-500/10 text-amber-200'
      : isListening
        ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200'
        : 'border-slate-500/40 bg-slate-500/10 text-slate-200';

  useEffect(() => {
    if (displayQuestion) {
      startTextStream(displayQuestion);
    }
    return () => {
      if (streamTimerRef.current) {
        clearInterval(streamTimerRef.current);
        streamTimerRef.current = null;
      }
    };
  }, [displayQuestion]);

  return (
    <Layout showNavbar={false} showFooter={false}>
      <div className="ai-interview-root min-h-screen bg-[radial-gradient(circle_at_top,_rgba(12,24,35,0.9),_rgba(4,6,12,0.95))] text-slate-100">
        <header className="border-b border-slate-800/70 bg-slate-950/70 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-4">
              <img src="/logo_xalora.png" alt="Xalora" className="h-8 w-auto" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-emerald-200/80">AI Interview</p>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-lg font-semibold text-white">{roundConfig.name}</p>
                  <span className="rounded-full border border-slate-700/60 bg-slate-800/60 px-2.5 py-0.5 text-xs text-slate-200">
                    {isSpecificMode ? 'Specific Round' : `Round ${roundNum}/5`}
                  </span>
                  <span className="text-xs text-slate-400">Q{questionNumber} / ~{roundConfig.maxQuestions}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses}`}>
                {interviewStatus}
              </span>
              <div className="rounded-xl border border-slate-700/60 bg-slate-900/70 px-3 py-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Duration</p>
                <p className="text-lg font-semibold text-cyan-200">{formatTime(duration)}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl space-y-6 px-4 pb-10 pt-6 sm:px-6">
          {isComplete ? (
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-10 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
                <CheckCircle className="h-10 w-10 text-emerald-300" />
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-white">
                {isSpecificMode ? 'Generating Your Report' : `Round ${roundNum} Complete`}
              </h2>
              <p className="mt-3 text-sm text-emerald-100/70">
                {isSpecificMode
                  ? "We're analyzing your responses and preparing your report."
                  : `Great job. Ready for ${ROUND_CONFIG[roundNum + 1]?.name}?`}
              </p>
              {!isSpecificMode && (
                <button
                  onClick={handleNextRound}
                  className="mt-6 rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                >
                  Continue
                </button>
              )}
              {isSpecificMode && (
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-emerald-200">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                  Redirecting...
                </div>
              )}
            </div>
          ) : (
            <>
              <section className="relative overflow-hidden rounded-[32px] border border-slate-800/80 bg-slate-950/70 shadow-2xl shadow-black/40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,68,76,0.35),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(10,18,38,0.8),_transparent_60%)]" />
                <div className="relative h-[52vh] min-h-[360px]">
                  <div className="absolute left-16 top-1/2 -translate-y-1/2">
                    <InterviewerAvatar isSpeaking={isSpeaking} mood={interviewStatus} />
                  </div>

                  <div className="absolute left-6 top-6 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                      {isFollowup ? 'Follow-up' : `Question ${questionNumber}`}
                    </span>
                    {isSpeaking && (
                      <span className="flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                        <Volume2 className="h-3 w-3 animate-pulse" />
                        Speaking
                      </span>
                    )}
                  </div>

                  <div className="absolute right-10 top-8 w-[30%] max-w-[360px] rounded-2xl border border-slate-700/60 bg-slate-950/85 px-4 py-4 shadow-lg shadow-black/40">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Interviewer</p>
                      <span className={`text-[10px] ${isSpeaking ? 'text-emerald-300' : 'text-slate-500'}`}>
                        {isSpeaking ? 'Speaking' : 'Idle'}
                      </span>
                    </div>
                    <div className="mt-2 max-h-40 overflow-y-auto text-xs text-slate-200 leading-relaxed">
                      {streamedText || (displayQuestion ? '' : 'Waiting for question...')}
                      {isSpeaking && <span className="ml-1 inline-block h-3 w-[2px] animate-pulse bg-emerald-300 align-middle" />}
                    </div>
                    <button
                      onClick={() => speakQuestion(displayQuestion)}
                      disabled={isSpeaking || !displayQuestion}
                      className="mt-3 inline-flex items-center gap-2 text-[11px] text-slate-400 transition hover:text-white disabled:opacity-50"
                    >
                      <RefreshCw className={`h-3 w-3 ${isSpeaking ? 'animate-spin' : ''}`} />
                      {isSpeaking ? 'Speaking...' : 'Repeat'}
                    </button>
                  </div>

                  <div className="absolute bottom-6 right-6">
                    <div className={`relative h-28 w-28 rounded-full border ${isListening ? 'border-emerald-400/80' : 'border-slate-700/70'} bg-slate-900/80 shadow-lg`}>
                      {stream && isVideoOn ? (
                        <video
                          ref={videoRef}
                          autoPlay
                          muted
                          playsInline
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                          <VideoOff className="h-6 w-6" />
                        </div>
                      )}
                      {isListening && (
                        <span className="absolute -bottom-1 right-2 rounded-full bg-emerald-400 px-2 py-0.5 text-[10px] font-semibold text-slate-950">
                          LIVE
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
                <div className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-200">Your Answer</p>
                    <button
                      onClick={toggleMic}
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition ${isListening ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
                    >
                      {isListening ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3" />}
                      {isListening ? 'Listening' : 'Voice'}
                    </button>
                  </div>

                  <textarea
                    ref={textareaRef}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Respond in your own words. Voice input stays on top."
                    className="mt-4 h-36 w-full resize-none rounded-2xl border border-slate-700/70 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
                    disabled={isLoading}
                  />

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-slate-500">{answer.split(/\s+/).filter(Boolean).length} words</p>
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!answer.trim() || isLoading}
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Submit
                        </>
                      )}
                    </button>
                  </div>

                  {feedback && (
                    <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-xs text-emerald-100/90">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-300" />
                        <div>
                          <p>{feedback}</p>
                          {isFollowup && <p className="mt-1 text-emerald-200/70">Follow-up answered. Moving on.</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-200">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <p>{error}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Progress</p>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400 transition-all duration-500"
                        style={{ width: `${Math.min(100, (questionNumber / roundConfig.maxQuestions) * 100)}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                      <span>Question {questionNumber}</span>
                      <span>~{roundConfig.maxQuestions} total</span>
                    </div>
                  </div>

                  {lastScore !== null && (
                    <div className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-5">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Last Score</p>
                      <p className="mt-3 text-3xl font-semibold text-emerald-300">{lastScore}/100</p>
                      <p className="mt-1 text-xs text-slate-400">AI evaluation snapshot</p>
                    </div>
                  )}

                  <div className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-5 space-y-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Controls</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={toggleVideo}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-3 py-1.5 text-xs text-slate-200 transition hover:border-slate-500"
                      >
                        {isVideoOn ? <Video className="h-3 w-3" /> : <VideoOff className="h-3 w-3" />}
                        {isVideoOn ? 'Camera On' : 'Camera Off'}
                      </button>
                      <button
                        onClick={handleSkipQuestion}
                        disabled={isLoading || isComplete}
                        className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 px-3 py-1.5 text-xs text-amber-200 transition hover:border-amber-300 disabled:opacity-40"
                      >
                        Skip Question
                      </button>
                      <button
                        onClick={handleSkipRound}
                        disabled={isLoading || isComplete}
                        className="inline-flex items-center gap-2 rounded-full border border-orange-400/40 px-3 py-1.5 text-xs text-orange-200 transition hover:border-orange-300 disabled:opacity-40"
                      >
                        Skip Round
                      </button>
                      <button
                        onClick={handleEndCall}
                        className="inline-flex items-center gap-2 rounded-full border border-red-400/40 px-3 py-1.5 text-xs text-red-200 transition hover:border-red-300"
                      >
                        <PhoneOff className="h-3 w-3" />
                        End Interview
                      </button>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Question Transcript</p>
                    <div className="mt-3 max-h-40 overflow-y-auto text-xs text-slate-300">
                      <ReactMarkdown>{displayQuestion || 'Waiting for question...'}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default InterviewRound;
