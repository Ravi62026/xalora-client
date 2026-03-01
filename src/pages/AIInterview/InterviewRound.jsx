import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Mic,
  Video,
  VideoOff,
  PhoneOff,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Volume2,
  RefreshCw,
  Monitor,
  MonitorOff,
  ShieldAlert,
  Shield
} from 'lucide-react';
import { Layout } from '../../components';
// InterviewerAvatar removed - candidate video shown directly
import interviewService from '../../services/interviewService';
import ReactMarkdown from 'react-markdown';
import Editor from '@monaco-editor/react';

// Round configuration
const ROUND_CONFIG = {
  1: { type: 'formal_qa', name: 'Formal Q&A', color: 'blue', maxQuestions: 10 },
  2: { type: 'technical', name: 'Technical', color: 'purple', maxQuestions: 15 },
  3: { type: 'coding', name: 'Coding Challenge', color: 'emerald', maxQuestions: 3 },
  4: { type: 'system_design', name: 'System Design', color: 'orange', maxQuestions: 2 },
  5: { type: 'behavioral', name: 'HR', color: 'pink', maxQuestions: 3 },
  6: { type: 'resume_deep_dive', name: 'Resume Deep Dive', color: 'cyan', maxQuestions: 6 },
  7: { type: 'jd_based', name: 'JD Based', color: 'amber', maxQuestions: 6 },
};

const InterviewRound = () => {
  const { sessionId: paramSessionId, roundType } = useParams();
  const navigate = useNavigate();

  // Find round number from type
  const roundNum = parseInt(Object.keys(ROUND_CONFIG).find(key => ROUND_CONFIG[key].type === roundType)) || 1;
  const roundConfig = ROUND_CONFIG[roundNum] || ROUND_CONFIG[1];

  // Session state
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
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [lastScore, setLastScore] = useState(null);
  const streamTimerRef = useRef(null);

  // Code editor state (for technical rounds)
  const [codeAnswer, setCodeAnswer] = useState('');
  const [editorLanguage, setEditorLanguage] = useState('javascript');
  const isTechnicalRound = roundConfig.type === 'technical' || roundConfig.type === 'system_design';

  // Timer state
  const [duration, setDuration] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 min per round

  // Media state
  const [stream, setStream] = useState(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Proctoring state
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [cameraOffCount, setCameraOffCount] = useState(0);
  const [screenShareStopCount, setScreenShareStopCount] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [warningType, setWarningType] = useState('tab_switch');
  const [screenShareStream, setScreenShareStream] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showScreenSharePrompt, setShowScreenSharePrompt] = useState(true);
  const [screenShareError, setScreenShareError] = useState('');
  const [mediaReady, setMediaReady] = useState(false);
  const maxWarnings = 3;

  // Refs
  const videoRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);  // Deepgram WebSocket ref
  const mediaRecorderRef = useRef(null);
  const deepgramTokenRef = useRef(null);
  const hasInitialized = useRef(false);
  const tabSwitchCountRef = useRef(0);
  const cameraOffCountRef = useRef(0);
  const screenShareStopCountRef = useRef(0);
  const streamRef = useRef(null);
  const screenShareStreamRef = useRef(null);
  const silenceNudgeTimerRef = useRef(null);
  const answerRef = useRef('');
  const hasSentNudgeRef = useRef(false);
  const isSpecificMode = sessionData?.interviewMode === 'specific';
  const [sessionChecked, setSessionChecked] = useState(false);

  // Check if session is already completed on mount — redirect if so
  useEffect(() => {
    const checkSessionStatus = async () => {
      if (!paramSessionId) return;
      try {
        const response = await interviewService.getSessionStatus(paramSessionId);
        if (response?.data?.status === 'completed' || response?.data?.hasReport) {
          console.log('[Interview] Session already completed, redirecting to report');
          navigate(`/ai-interview/${paramSessionId}/report`, { replace: true });
          return;
        }
      } catch (err) {
        // 404 = session not found, redirect to dashboard
        if (err.response?.status === 404) {
          console.log('[Interview] Session not found, redirecting to dashboard');
          navigate('/dashboard', { replace: true });
          return;
        }
        console.warn('[Interview] Session status check failed:', err.message);
      }
      setSessionChecked(true);
    };
    checkSessionStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramSessionId]);

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
  }, [paramSessionId]);

  // Initialize media
  useEffect(() => {
    const initMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setStream(mediaStream);
        streamRef.current = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setMediaReady(true);
      } catch (error) {
        console.error('Media error:', error);
        // Try audio only
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          setStream(audioStream);
          streamRef.current = audioStream;
          setMediaReady(true);
        } catch (e) {
          setError('Please enable microphone access to continue');
        }
      }
    };

    initMedia();

    // Check if screen share was already set up in WaitingRoom
    if (window.__interviewScreenShare) {
      const existingStream = window.__interviewScreenShare;
      const tracks = existingStream.getVideoTracks();
      if (tracks.length > 0 && tracks[0].readyState === 'live') {
        // Screen share is already active from WaitingRoom
        setScreenShareStream(existingStream);
        screenShareStreamRef.current = existingStream;
        setIsScreenSharing(true);
        setShowScreenSharePrompt(false);

        // Listen for user stopping screen share
        tracks[0].onended = () => {
          setScreenShareStream(null);
          screenShareStreamRef.current = null;
          setIsScreenSharing(false);

          const newCount = screenShareStopCountRef.current + 1;
          screenShareStopCountRef.current = newCount;
          setScreenShareStopCount(newCount);

          // Report violation to backend
          const token = localStorage.getItem('accessToken');
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/interview/update-screen-share`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: 'include',
            body: JSON.stringify({ sessionId: paramSessionId, active: false, violations: newCount }),
          }).catch(() => { });

          if (newCount >= maxWarnings) {
            setWarningType('screen_share');
            setWarningMessage(`You have stopped screen sharing ${maxWarnings} times. The interview will be ended automatically.`);
            setShowWarningModal(true);
          } else {
            setWarningType('screen_share');
            setWarningMessage(`Screen sharing stopped! Warning ${newCount}/${maxWarnings}. Please re-share your screen.`);
            setShowWarningModal(true);
            setShowScreenSharePrompt(true);
          }
        };

        // Notify backend screen share is active
        const accessToken = localStorage.getItem('accessToken');
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/interview/update-screen-share`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          credentials: 'include',
          body: JSON.stringify({ sessionId: paramSessionId, active: true }),
        }).catch(() => { });

        // Clean up window reference
        window.__interviewScreenShare = null;
      } else {
        // Stream was killed, clean up
        window.__interviewScreenShare = null;
      }
    }

    return () => {
      // Use ref to always get current stream (avoids stale closure)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (screenShareStreamRef.current) {
        screenShareStreamRef.current.getTracks().forEach(track => track.stop());
        screenShareStreamRef.current = null;
      }
      // Cleanup Deepgram WebSocket + MediaRecorder
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (recognitionRef.current) {
        try {
          if (recognitionRef.current._isBrowserSTT) {
            recognitionRef.current.stop();
          } else {
            recognitionRef.current.close();
          }
        } catch { /* ignore */ }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramSessionId]);

  useEffect(() => {
    if (isComplete && stream) {
      stream.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setStream(null);
      setIsVideoOn(false);
    }
    if (isComplete && screenShareStream) {
      screenShareStream.getTracks().forEach(track => track.stop());
      screenShareStreamRef.current = null;
      setScreenShareStream(null);
      setIsScreenSharing(false);
    }
    // Exit fullscreen when interview completes
    if (isComplete && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, [isComplete, stream, screenShareStream]);

  // ── Proctoring: Tab Switch Detection ──────────────────────

  const reportViolationToBackend = async (violationType, details) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/interview/report-violation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          sessionId: paramSessionId,
          violationType,
          details: details || ''
        }),
      });
    } catch (e) {
      console.error('[Proctoring] Failed to report violation:', e);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (isComplete) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        const newCount = tabSwitchCountRef.current + 1;
        tabSwitchCountRef.current = newCount;
        setTabSwitchCount(newCount);

        // Report to backend
        reportViolationToBackend('tab_switch', `Tab switch #${newCount} detected`);

        if (newCount >= maxWarnings) {
          // 3rd strike — auto-end interview
          setWarningMessage(`⚠️ You switched tabs ${newCount} times. Your interview has been terminated for suspicious activity.`);
          setShowWarningModal(true);
          // Auto-end after showing message
          setTimeout(() => {
            handleEndCall(true); // pass cheating flag
          }, 3000);
        } else {
          setWarningMessage(`⚠️ Warning ${newCount}/${maxWarnings}: Tab switching detected! Switching tabs again will end your interview.`);
          setShowWarningModal(true);
        }
      }
    };

    const handleWindowBlur = () => {
      // Only count if not already counted by visibilitychange
      if (!document.hidden) {
        // Window lost focus but tab not hidden (e.g. alt-tab)
        // We skip double-counting here; visibilitychange handles it
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete, paramSessionId]);

  // ── Proctoring: Screen Sharing ─────────────────────────────

  const startScreenShare = async () => {
    try {
      setScreenShareError('');
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
          displaySurface: 'monitor'
        },
        audio: false,
        preferCurrentTab: false,
        selfBrowserSurface: 'exclude',
        systemAudio: 'exclude',
        surfaceSwitching: 'exclude',
        monitorTypeSurfaces: 'include'
      });

      // Check if user selected entire screen (monitor)
      const videoTrack = displayStream.getVideoTracks()[0];
      const settings = videoTrack.getSettings();
      if (settings.displaySurface && settings.displaySurface !== 'monitor') {
        displayStream.getTracks().forEach(track => track.stop());
        setScreenShareError('Please share your entire screen, not a specific window or tab. Try again and select "Entire Screen".');
        return;
      }

      setScreenShareStream(displayStream);
      screenShareStreamRef.current = displayStream;
      setIsScreenSharing(true);
      setShowScreenSharePrompt(false); // Close the modal
      setScreenShareError('');

      // Notify backend
      const accessToken = localStorage.getItem('accessToken');
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/interview/update-screen-share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ sessionId: paramSessionId, active: true }),
      }).catch(() => { });

      // Listen for user stopping screen share
      displayStream.getVideoTracks()[0].onended = () => {
        setScreenShareStream(null);
        screenShareStreamRef.current = null;
        setIsScreenSharing(false);

        // Track screen share stop violations (only if during active interview)
        if (currentQuestion && !isComplete) {
          const newCount = screenShareStopCountRef.current + 1;
          screenShareStopCountRef.current = newCount;
          setScreenShareStopCount(newCount);

          // Report to backend
          reportViolationToBackend('screen_share_stop', `Screen share stopped #${newCount}`);

          if (newCount >= maxWarnings) {
            // 3rd strike — auto-end interview
            setWarningType('screen_share_stop');
            setWarningMessage(`⚠️ You stopped screen sharing ${newCount} times. Your interview has been terminated for suspicious activity.`);
            setShowWarningModal(true);
            // Auto-end after showing message
            setTimeout(() => {
              handleEndCall(true); // pass cheating flag
            }, 3000);
          } else {
            setWarningType('screen_share_stop');
            setWarningMessage(`⚠️ Warning ${newCount}/${maxWarnings}: Screen sharing is required! Stopping it again will end your interview.`);
            setShowWarningModal(true);
          }
        } else {
          // Not in active interview, just show error
          setShowScreenSharePrompt(true);
          setScreenShareError('Screen sharing was stopped. You must share your entire screen to continue the interview.');
        }

        // Notify backend
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/interview/update-screen-share`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          credentials: 'include',
          body: JSON.stringify({ sessionId: paramSessionId, active: false }),
        }).catch(() => { });
      };
    } catch (err) {
      console.error('[ScreenShare] Failed to start:', err);
      setScreenShareError('Screen sharing is required to proceed. Please click "Share Screen" and select your entire screen.');
    }
  };

  const stopScreenShare = () => {
    if (screenShareStream) {
      screenShareStream.getTracks().forEach(track => track.stop());
      setScreenShareStream(null);
      screenShareStreamRef.current = null;
      setIsScreenSharing(false);

      const accessToken = localStorage.getItem('accessToken');
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/interview/update-screen-share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ sessionId: paramSessionId, active: false }),
      }).catch(() => { });
    }
  };

  // Cleanup screen share on unmount
  useEffect(() => {
    return () => {
      if (screenShareStream) {
        screenShareStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [screenShareStream]);

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

    // Fetch first question after reset (only after screen share is active AND session is verified)
    if (paramSessionId && isScreenSharing && sessionChecked) {
      const timer = setTimeout(() => {
        hasInitialized.current = true;
        fetchQuestion();
      }, 100); // Small delay to ensure state is reset

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundType, paramSessionId, isScreenSharing, sessionChecked]);

  // Format time helper
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Fetch question from API
  const fetchQuestion = async () => {
    if (!paramSessionId) return;

    setIsLoading(true);
    setError(null);
    setFeedback(null);

    try {
      const response = await interviewService.getQuestion(
        paramSessionId,
        roundConfig.type,
        roundConfig.maxQuestions,
        sessionData?.codingDifficulty
      );

      if (response.success) {
        // Check if round is already complete
        if (response.data?.roundComplete) {
          console.log('[Interview] Round already complete, navigating to report');
          setIsComplete(true);
          setQuestionNumber(response.data.totalQuestions || roundConfig.maxQuestions);
          return;
        }

        if (roundConfig.type === 'coding' && response.data?.problemId) {
          if (!response.data?.reuseExisting) {
            if (response.data?.questionNumber) {
              setQuestionNumber(response.data.questionNumber);
            } else {
              setQuestionNumber(prev => prev + 1);
            }
          }
          navigate(`/problem/${response.data.problemId}/${paramSessionId}`);
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
        setCodeAnswer(''); // Reset code editor for new question

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
    // Stop mic while evaluating (will auto-restart when next question TTS finishes)
    if (isListening) stopListening();
    // Clear silence nudge timer
    if (silenceNudgeTimerRef.current) {
      clearTimeout(silenceNudgeTimerRef.current);
      silenceNudgeTimerRef.current = null;
    }

    // For technical rounds, combine text answer + code
    let fullAnswer = answer.trim();
    if (isTechnicalRound && codeAnswer.trim()) {
      const codeBlock = `\`\`\`${editorLanguage}\n${codeAnswer.trim()}\n\`\`\``;
      fullAnswer = fullAnswer ? `${fullAnswer}\n\n${codeBlock}` : codeBlock;
    }

    if (!fullAnswer || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      let response;

      if (isFollowup && currentFollowup) {
        response = await interviewService.submitFollowupAnswer(
          paramSessionId,
          roundConfig.type,
          currentFollowup?.text || currentFollowup,
          fullAnswer,
          timeRemaining
        );
      } else {
        response = await interviewService.submitAnswer(
          paramSessionId,
          roundConfig.type,
          currentQuestion.id || currentQuestion._id,
          fullAnswer,
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

    setIsSpeaking(true);
    try {
      // Call AWS Polly backend API
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/voice/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          text: text,
          voiceId: 'Kajal', // Indian female English (neural)
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success || !data.audio) {
        throw new Error(data.error || 'TTS conversion failed');
      }

      // Convert base64 to blob and play
      const audioBlob = base64ToBlob(data.audio, 'audio/mp3');
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = (err) => {
        console.error('Audio playback error:', err);
        setIsSpeaking(false);
      };

      // Estimate duration and start text stream
      const estimatedDurationMs = estimateTtsDurationMs(text);
      audio.play().catch(err => {
        console.error('Failed to play audio:', err);
        setIsSpeaking(false);
      });

      startTextStream(text, estimatedDurationMs);
    } catch (error) {
      console.error('AWS Polly TTS error:', error);
      setIsSpeaking(false);
      // Fallback to browser TTS if AWS fails
      fallbackBrowserTTS(text);
    }
  };

  // Fallback: Use browser's built-in TTS
  const fallbackBrowserTTS = (text) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Browser TTS also not available');
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
      }

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      const estimatedDurationMs = estimateTtsDurationMs(text);
      speechSynthesis.speak(utterance);
      startTextStream(text, estimatedDurationMs);
    } catch (error) {
      console.error('Browser TTS fallback error:', error);
      setIsSpeaking(false);
    }
  };

  // Convert base64 to blob
  const base64ToBlob = (base64, mimeType) => {
    try {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: mimeType });
    } catch (error) {
      console.error('Failed to convert base64 to blob:', error);
      throw error;
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
    let index = 0;
    const speedMs = durationMs
      ? Math.max(12, Math.round(durationMs / Math.max(1, cleanText.length)))
      : 32;
    streamTimerRef.current = setInterval(() => {
      index += 1;
      if (index >= cleanText.length) {
        clearInterval(streamTimerRef.current);
        streamTimerRef.current = null;
      }
    }, speedMs);
  };

  // ── Deepgram STT (Speech-to-Text) ──────────────────────────

  // Fetch a temporary Deepgram key from our backend
  const getDeepgramToken = async () => {
    // Cache the token for reuse within its TTL
    if (deepgramTokenRef.current && deepgramTokenRef.current.expiresAt > Date.now()) {
      return deepgramTokenRef.current.key;
    }

    const accessToken = localStorage.getItem('accessToken');
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/voice/stt-token`, {
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      credentials: 'include',
    });

    if (!res.ok) throw new Error(`STT token error: ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to get STT token');

    deepgramTokenRef.current = {
      key: data.key,
      expiresAt: Date.now() + (data.expiresIn ? data.expiresIn * 1000 - 5000 : 55000),
    };
    return data.key;
  };

  const startListening = async () => {
    try {
      // 1. Get audio-only stream for MediaRecorder
      let audioStream;
      if (stream) {
        const audioTracks = stream.getAudioTracks();
        if (audioTracks.length > 0) {
          audioStream = new MediaStream(audioTracks);
          console.log('[STT] Using existing audio tracks:', audioTracks.length, 'enabled:', audioTracks[0]?.enabled);
        }
      }
      if (!audioStream) {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('[STT] Created new audio stream');
      }

      // 2. Get Deepgram temporary token
      let token;
      try {
        token = await getDeepgramToken();
        console.log('[STT] Got token, length:', token?.length);
      } catch (tokenErr) {
        console.error('[STT] Token fetch failed:', tokenErr.message);
        fallbackBrowserSTT();
        return;
      }

      // 3. Open WebSocket to Deepgram
      const dgUrl = `wss://api.deepgram.com/v1/listen?model=nova-2&language=en-IN&smart_format=true&punctuate=true&interim_results=true&endpointing=300`;

      console.log('[Deepgram] Connecting to WebSocket...');
      const ws = new WebSocket(dgUrl, ['token', token]);
      recognitionRef.current = ws;

      // Set a connection timeout — if no open within 5s, fallback
      const connectTimeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          console.warn('[Deepgram] Connection timeout, falling back to browser STT');
          ws.close();
          fallbackBrowserSTT();
        }
      }, 5000);

      ws.onopen = () => {
        clearTimeout(connectTimeout);
        console.log('[Deepgram] Connected successfully');
        setIsListening(true);

        // 4. Stream audio via MediaRecorder (audio-only stream)
        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : MediaRecorder.isTypeSupported('audio/webm')
            ? 'audio/webm'
            : '';
        console.log('[Deepgram] MediaRecorder mimeType:', mimeType || 'default');
        const recorderOptions = mimeType ? { mimeType } : {};
        const mediaRecorder = new MediaRecorder(audioStream, recorderOptions);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            ws.send(event.data);
          }
        };

        mediaRecorder.start(250); // Send audio chunks every 250ms
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const transcript = data.channel?.alternatives?.[0]?.transcript;
          if (transcript && transcript.trim()) {
            if (data.is_final) {
              console.log('[Deepgram] Final:', transcript.trim());
              // Final result — append to answer
              setAnswer(prev => {
                const trimmed = prev.trim();
                return trimmed ? trimmed + ' ' + transcript.trim() : transcript.trim();
              });
            }
          }
        } catch (e) {
          // Not JSON, ignore
        }
      };

      ws.onerror = (event) => {
        clearTimeout(connectTimeout);
        console.error('[Deepgram] WebSocket error:', event);
        setIsListening(false);
        // Stop any recorder that may have started
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
          mediaRecorderRef.current = null;
        }
        // Fallback to browser STT
        fallbackBrowserSTT();
      };

      ws.onclose = (event) => {
        clearTimeout(connectTimeout);
        console.log('[Deepgram] Disconnected:', event.code, event.reason);
        setIsListening(false);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
      };
    } catch (error) {
      console.error('[Deepgram] Setup error:', error);
      // Fallback to browser Web Speech API
      fallbackBrowserSTT();
    }
  };

  const stopListening = () => {
    // Stop MediaRecorder (only used with Deepgram WebSocket)
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    if (recognitionRef.current) {
      // Check if it's a browser SpeechRecognition object vs Deepgram WebSocket
      if (recognitionRef.current._isBrowserSTT) {
        // Browser Web Speech API — use stop(), not close()
        try { recognitionRef.current.stop(); } catch { /* ignore */ }
      } else {
        // Deepgram WebSocket — close gracefully
        if (recognitionRef.current.readyState === WebSocket.OPEN) {
          recognitionRef.current.send(new Uint8Array(0));
          const wsRef = recognitionRef.current;
          setTimeout(() => {
            if (wsRef?.readyState === WebSocket.OPEN) {
              wsRef.close();
            }
          }, 500);
        } else {
          try { recognitionRef.current.close(); } catch { /* ignore */ }
        }
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  // Fallback: Browser Web Speech API (Chrome only)
  const fallbackBrowserSTT = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition not supported');
      return;
    }
    console.warn('[STT] Falling back to browser Web Speech API');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false; // Only final results to avoid duplication
    recognition.lang = 'en-IN';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript.trim()) {
        setAnswer(prev => {
          const trimmed = prev.trim();
          return trimmed ? trimmed + ' ' + finalTranscript.trim() : finalTranscript.trim();
        });
      }
    };
    recognition.onerror = (e) => {
      console.error('[STT Browser] Error:', e.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition._isBrowserSTT = true; // Tag so stopListening() knows the type
    recognition.start();
    setIsListening(true);
  };

  // Toggle video
  const toggleVideo = () => {
    if (stream) {
      const newVideoState = !isVideoOn;
      stream.getVideoTracks().forEach(track => {
        track.enabled = newVideoState;
      });

      // Track camera OFF violations (only if turning OFF during active interview)
      if (!newVideoState && currentQuestion) {
        const newCount = cameraOffCountRef.current + 1;
        cameraOffCountRef.current = newCount;
        setCameraOffCount(newCount);

        // Report to backend
        reportViolationToBackend('camera_off', `Camera turned off #${newCount}`);

        if (newCount >= maxWarnings) {
          // 3rd strike — auto-end interview
          setWarningType('camera_off');
          setWarningMessage(`⚠️ You turned off the camera ${newCount} times. Your interview has been terminated for suspicious activity.`);
          setShowWarningModal(true);
          // Auto-end after showing message
          setTimeout(() => {
            handleEndCall(true); // pass cheating flag
          }, 3000);
        } else {
          setWarningType('camera_off');
          setWarningMessage(`⚠️ Warning ${newCount}/${maxWarnings}: Camera is required during the interview! Turning off again will end your interview.`);
          setShowWarningModal(true);
        }
      }

      setIsVideoOn(newVideoState);
    }
  };

  // End call / Complete round (force end interview)
  const handleEndCall = async () => {
    // Stop media
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setStream(null);
    }
    // Stop screen share
    if (screenShareStreamRef.current) {
      screenShareStreamRef.current.getTracks().forEach(track => track.stop());
      screenShareStreamRef.current = null;
      setScreenShareStream(null);
      setIsScreenSharing(false);
    }

    try {
      await interviewService.completeRound(paramSessionId, roundConfig.type);
    } catch (e) {
      console.error('Error completing round:', e);
    }

    // Always end interview and go to report
    navigate(`/ai-interview/${paramSessionId}/report`);
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

    if (roundNum < 7 && !isSpecificMode) {
      const nextRoundType = ROUND_CONFIG[roundNum + 1].type;
      navigate(`/ai-interview/${paramSessionId}/round/${nextRoundType}`);
    } else {
      navigate(`/ai-interview/${paramSessionId}/report`);
    }
  };

  // Auto-redirect when round is complete
  useEffect(() => {
    if (isComplete) {
      // Stop mic when round completes
      if (isListening) stopListening();
      // Clear any silence nudge timer
      if (silenceNudgeTimerRef.current) {
        clearTimeout(silenceNudgeTimerRef.current);
        silenceNudgeTimerRef.current = null;
      }
      const timer = setTimeout(() => {
        handleNextRound();
      }, isSpecificMode ? 3000 : 2000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete, isSpecificMode]);

  // Keep answerRef in sync with answer state (for silence nudge timer check)
  useEffect(() => {
    answerRef.current = answer;
  }, [answer]);

  // Auto-start mic when TTS finishes speaking + start 10s silence nudge timer
  useEffect(() => {
    if (!isSpeaking && currentQuestion && !isComplete && !isLoading && mediaReady) {
      // TTS just finished (or was never speaking) — auto-start mic
      if (!isListening) {
        console.log('[STT] Auto-starting mic after TTS finished');
        startListening();
      }

      // Reset nudge flag and start 10s silence timer
      hasSentNudgeRef.current = false;
      if (silenceNudgeTimerRef.current) clearTimeout(silenceNudgeTimerRef.current);

      silenceNudgeTimerRef.current = setTimeout(() => {
        // If still no answer after 10s, nudge the candidate
        if (!answerRef.current.trim() && !hasSentNudgeRef.current) {
          hasSentNudgeRef.current = true;
          const nudges = [
            'Is the question clear? Feel free to start whenever you\'re ready.',
            'Take your time. You can start answering whenever you\'re ready.',
            'Would you like me to repeat the question?',
            'I\'m listening. Please go ahead with your answer.',
          ];
          const nudge = nudges[Math.floor(Math.random() * nudges.length)];
          console.log('[Nudge] No answer detected, prompting candidate:', nudge);
          speakQuestion(nudge);
        }
      }, 10000);

      return () => {
        if (silenceNudgeTimerRef.current) {
          clearTimeout(silenceNudgeTimerRef.current);
          silenceNudgeTimerRef.current = null;
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpeaking, currentQuestion, isComplete, isLoading, mediaReady]);

  // Color mapping removed in favor of static palette for immersive UI
  const displayQuestion = isFollowup ? currentFollowup?.text : currentQuestion?.text;
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
                    {isSpecificMode ? 'Specific Round' : `Round ${roundNum}/7`}
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
                  : roundNum < 7
                    ? `Great job. Ready for ${ROUND_CONFIG[roundNum + 1]?.name}?`
                    : 'All rounds complete! Generating your final report...'}
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
                <div className="relative flex gap-4 p-4">
                  {/* Candidate Video - Left side */}
                  <div className="relative w-[45%] flex-shrink-0">
                    <div className={`relative aspect-[4/3] rounded-2xl border ${isListening ? 'border-emerald-400/60 shadow-lg shadow-emerald-500/10' : 'border-slate-700/60'} bg-slate-900/80 overflow-hidden transition-all`}>
                      {stream && isVideoOn ? (
                        <video
                          ref={videoRef}
                          autoPlay
                          muted
                          playsInline
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center text-slate-500">
                          <VideoOff className="h-10 w-10 mb-2" />
                          <span className="text-xs">Camera Off</span>
                        </div>
                      )}
                      {/* Status badges on video */}
                      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                        {isListening && (
                          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow">
                            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                            LIVE
                          </span>
                        )}
                        {isSpeaking && (
                          <span className="flex items-center gap-1.5 rounded-full bg-cyan-500/90 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow">
                            <Volume2 className="h-3 w-3 animate-pulse" />
                            Speaking
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Question Box - Right side, auto-height */}
                  <div className="flex-1 flex flex-col gap-3 min-w-0">
                    {/* Question badge */}
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                        {isFollowup ? 'Follow-up' : `Question ${questionNumber}`}
                      </span>
                    </div>

                    {/* Question content - fits content */}
                    <div className="rounded-2xl border border-slate-700/60 bg-slate-950/85 px-5 py-4 shadow-lg shadow-black/40">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Question</p>
                        {isFollowup && <span className="text-[10px] text-amber-300 font-medium">Follow-up</span>}
                      </div>
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            p: ({children, ...props}) => {
                              // Check if children contain block elements (pre, div) to avoid <pre> inside <p>
                              const hasBlock = Array.isArray(children)
                                ? children.some(c => c?.type === 'pre' || c?.type === 'div' || (typeof c === 'object' && c?.props?.className?.includes?.('bg-slate-800')))
                                : false;
                              if (hasBlock) return <div className="text-sm text-slate-200 mb-2 leading-relaxed" {...props}>{children}</div>;
                              return <p className="text-sm text-slate-200 mb-2 leading-relaxed" {...props}>{children}</p>;
                            },
                            code: ({inline, className, children, ...props}) => {
                              const isInline = inline || !className;
                              return isInline
                                ? <code className="bg-slate-800 px-1.5 py-0.5 rounded text-xs text-cyan-300 font-mono" {...props}>{children}</code>
                                : <pre className="bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 mb-2 overflow-x-auto"><code className="text-xs text-cyan-100 font-mono" {...props}>{children}</code></pre>;
                            },
                            pre: ({children}) => <>{children}</>,
                            li: ({...props}) => <li className="text-sm text-slate-200 ml-4 mb-1" {...props} />,
                            ul: ({...props}) => <ul className="list-disc mb-2" {...props} />,
                            ol: ({...props}) => <ol className="list-decimal mb-2" {...props} />,
                            blockquote: ({...props}) => <blockquote className="border-l-2 border-slate-600 pl-3 italic text-slate-300 text-sm mb-2" {...props} />,
                            h1: ({...props}) => <h1 className="text-base font-bold text-white mb-2" {...props} />,
                            h2: ({...props}) => <h2 className="text-sm font-bold text-slate-100 mb-2" {...props} />,
                            h3: ({...props}) => <h3 className="text-sm font-semibold text-slate-200 mb-1" {...props} />,
                          }}
                        >
                          {displayQuestion || 'Waiting for question...'}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
                <div className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-200">Your Answer</p>
                    <div className="flex items-center gap-2">
                      {isTechnicalRound && (
                        <select
                          value={editorLanguage}
                          onChange={(e) => setEditorLanguage(e.target.value)}
                          className="rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-xs text-slate-200 outline-none focus:border-cyan-500"
                        >
                          <option value="javascript">JavaScript</option>
                          <option value="typescript">TypeScript</option>
                          <option value="python">Python</option>
                          <option value="java">Java</option>
                          <option value="cpp">C++</option>
                          <option value="c">C</option>
                          <option value="go">Go</option>
                          <option value="rust">Rust</option>
                          <option value="sql">SQL</option>
                        </select>
                      )}
                      <div
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition ${isListening ? 'bg-emerald-400/90 text-slate-950' : isSpeaking ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400'}`}
                      >
                        <Mic className={`h-3 w-3 ${isListening ? 'animate-pulse' : ''}`} />
                        {isListening ? 'Listening...' : isSpeaking ? 'AI Speaking' : 'Mic Ready'}
                      </div>
                    </div>
                  </div>

                  {/* Monaco Code Editor for technical rounds */}
                  {isTechnicalRound ? (
                    <div className="mt-4 space-y-3">
                      {/* Verbal explanation textarea */}
                      <textarea
                        ref={textareaRef}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Explain your approach verbally or via voice input..."
                        className="h-20 w-full resize-none rounded-xl border border-slate-700/70 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
                        disabled={isLoading}
                      />
                      {/* Code Editor */}
                      <div className="rounded-xl border border-slate-700/60 overflow-hidden">
                        <div className="flex items-center justify-between bg-slate-800/80 px-3 py-1.5 border-b border-slate-700/40">
                          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Code Editor</span>
                          <span className="text-[10px] text-slate-500">{editorLanguage}</span>
                        </div>
                        <Editor
                          height="200px"
                          language={editorLanguage}
                          value={codeAnswer}
                          onChange={(value) => setCodeAnswer(value || '')}
                          theme="vs-dark"
                          options={{
                            minimap: { enabled: false },
                            fontSize: 13,
                            lineNumbers: 'on',
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            tabSize: 2,
                            wordWrap: 'on',
                            padding: { top: 8, bottom: 8 },
                            renderLineHighlight: 'line',
                            folding: true,
                            bracketPairColorization: { enabled: true },
                            suggestOnTriggerCharacters: true,
                            quickSuggestions: true,
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <textarea
                      ref={textareaRef}
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Respond in your own words. Voice input stays on top."
                      className="mt-4 h-36 w-full resize-none rounded-2xl border border-slate-700/70 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
                      disabled={isLoading}
                    />
                  )}

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-slate-500">
                      {answer.split(/\s+/).filter(Boolean).length} words
                      {isTechnicalRound && codeAnswer.trim() && ` • ${codeAnswer.split('\n').length} lines of code`}
                    </p>
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!(answer.trim() || (isTechnicalRound && codeAnswer.trim())) || isLoading}
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
                        onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${isScreenSharing ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-200 hover:border-emerald-300' : 'border-slate-700/70 text-slate-200 hover:border-slate-500'}`}
                      >
                        {isScreenSharing ? <Monitor className="h-3 w-3" /> : <MonitorOff className="h-3 w-3" />}
                        {isScreenSharing ? 'Stop Share' : 'Share Screen'}
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


                </div>
              </section>
            </>
          )}
        </main>

        {/* Proctoring Warning Modal */}
        {showWarningModal && (() => {
          const currentViolationCount = warningType === 'tab_switch' ? tabSwitchCount : warningType === 'camera_off' ? cameraOffCount : screenShareStopCount;
          const isFatal = currentViolationCount >= maxWarnings;
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="mx-4 max-w-md rounded-3xl border border-red-500/40 bg-slate-900/95 p-8 shadow-2xl shadow-red-500/20">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                  <ShieldAlert className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="mt-5 text-center text-xl font-bold text-white">Suspicious Activity Detected</h3>
                <p className="mt-3 text-center text-sm text-slate-300 leading-relaxed">{warningMessage}</p>
                <div className="mt-3 flex justify-center gap-2 flex-wrap">
                  {tabSwitchCount > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-300">
                      Tabs: {tabSwitchCount}/{maxWarnings}
                    </span>
                  )}
                  {cameraOffCount > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-300">
                      Camera: {cameraOffCount}/{maxWarnings}
                    </span>
                  )}
                  {screenShareStopCount > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
                      Share: {screenShareStopCount}/{maxWarnings}
                    </span>
                  )}
                </div>
                {!isFatal && (
                  <button
                    onClick={() => setShowWarningModal(false)}
                    className="mt-6 w-full rounded-full bg-gradient-to-r from-red-600 to-orange-600 py-3 text-sm font-semibold text-white transition hover:from-red-500 hover:to-orange-500"
                  >
                    I Understand, Continue Interview
                  </button>
                )}
                {isFatal && (
                  <div className="mt-6 flex items-center justify-center gap-2 text-sm text-red-300">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                    Redirecting to report...
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Mandatory Screen Share Prompt */}
        {showScreenSharePrompt && mediaReady && !isComplete && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="mx-4 max-w-lg rounded-3xl border border-cyan-500/30 bg-slate-900/95 p-8 shadow-2xl shadow-cyan-500/10">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/15 ring-2 ring-cyan-400/30">
                <Monitor className="h-10 w-10 text-cyan-400" />
              </div>
              <h3 className="mt-6 text-center text-2xl font-bold text-white">Screen Sharing Required</h3>
              <p className="mt-3 text-center text-sm text-slate-300 leading-relaxed">
                To ensure a fair interview experience, you must share your <span className="font-semibold text-cyan-300">entire screen</span> before the interview can begin. This is mandatory for proctoring purposes.
              </p>

              <div className="mt-5 rounded-2xl border border-slate-700/60 bg-slate-800/50 px-4 py-3 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">How to share:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs text-slate-300">
                  <li>Click the <span className="font-medium text-white">"Share Entire Screen"</span> button below</li>
                  <li>Select <span className="font-medium text-white">"Entire Screen"</span> from the dialog</li>
                  <li>Click <span className="font-medium text-white">"Share"</span> to confirm</li>
                </ol>
              </div>

              {screenShareError && (
                <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <p>{screenShareError}</p>
                  </div>
                </div>
              )}

              <button
                onClick={startScreenShare}
                className="mt-6 w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 py-3.5 text-sm font-semibold text-white transition hover:from-cyan-400 hover:to-emerald-400 shadow-lg shadow-cyan-500/25"
              >
                <Monitor className="h-4 w-4" />
                Share Entire Screen
              </button>

              <p className="mt-4 text-center text-[11px] text-slate-500">
                <Shield className="inline h-3 w-3 mr-1 align-text-bottom" />
                Your screen is monitored only during the interview for integrity.
              </p>
            </div>
          </div>
        )}

        {/* Proctoring status bar */}
        {!isComplete && (
          <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2">
            <div className="flex items-center gap-3 rounded-full border border-slate-700/60 bg-slate-900/90 px-4 py-2.5 shadow-xl backdrop-blur text-xs">
              {/* Tab Switches */}
              <div className="flex items-center gap-1.5">
                {tabSwitchCount === 0 ? (
                  <Shield className="h-4 w-4 text-emerald-400" />
                ) : (
                  <ShieldAlert className="h-4 w-4 text-red-400" />
                )}
                <span className={`font-medium ${tabSwitchCount === 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                  {tabSwitchCount === 0 ? 'Tabs: OK' : `Tabs: ${tabSwitchCount}/${maxWarnings}`}
                </span>
              </div>

              <div className="h-4 w-px bg-slate-700" />

              {/* Camera Status */}
              <div className="flex items-center gap-1.5">
                {cameraOffCount === 0 ? (
                  <Video className="h-4 w-4 text-emerald-400" />
                ) : (
                  <VideoOff className="h-4 w-4 text-red-400" />
                )}
                <span className={`font-medium ${cameraOffCount === 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                  {cameraOffCount === 0 ? 'Camera: OK' : `Camera: ${cameraOffCount}/${maxWarnings}`}
                </span>
              </div>

              <div className="h-4 w-px bg-slate-700" />

              {/* Screen Share Status */}
              <div className="flex items-center gap-1.5">
                {isScreenSharing && screenShareStopCount === 0 ? (
                  <Monitor className="h-4 w-4 text-emerald-400" />
                ) : isScreenSharing ? (
                  <Monitor className="h-4 w-4 text-orange-400" />
                ) : (
                  <MonitorOff className="h-4 w-4 text-slate-500" />
                )}
                <span className={`font-medium ${isScreenSharing && screenShareStopCount === 0 ? 'text-emerald-300' : isScreenSharing ? 'text-orange-300' : 'text-slate-500'}`}>
                  {isScreenSharing ? (screenShareStopCount === 0 ? 'Share: OK' : `Share: ${screenShareStopCount}/${maxWarnings}`) : 'Not Sharing'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InterviewRound;
