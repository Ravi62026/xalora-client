import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare,
  Send, Loader2, ChevronRight, CheckCircle, AlertCircle,
  Clock, Volume2, VolumeX, RefreshCw, Sparkles
} from 'lucide-react';
import { Layout } from '../../components';
import interviewService from '../../services/interviewService';
import ReactMarkdown from 'react-markdown';

// Round configuration
const ROUND_CONFIG = {
  1: { type: 'formal_qa', name: 'Formal Q&A', color: 'blue', maxQuestions: 10 },
  2: { type: 'technical', name: 'Technical', color: 'purple', maxQuestions: 15 },
  3: { type: 'coding', name: 'Coding Challenge', color: 'emerald', maxQuestions: 2 },
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
      const response = await interviewService.getQuestion(sessionId, roundConfig.type, roundConfig.maxQuestions);

      if (response.success) {
        setCurrentQuestion(response.data.question);
        setCurrentFollowup(null);
        setIsFollowup(false);
        setQuestionNumber(prev => prev + 1);
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
          currentQuestion.id || currentQuestion._id,
          currentFollowup.id || currentFollowup._id,
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
  const speakQuestion = async (text) => {
    // Validate text
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      console.warn('TTS: No valid text provided');
      return;
    }

    setIsSpeaking(true);
    try {
      const audioBlob = await interviewService.textToSpeech(text);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
      // Fallback to browser TTS
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
      }
    }
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

  // End call / Complete round
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

    // Navigate to next round or report
    if (roundNum < 5 && !isSpecificMode) {
      const nextRoundType = ROUND_CONFIG[roundNum + 1].type;
      navigate(`/ai-interview/${sessionId}/round/${nextRoundType}`);
    } else {
      navigate(`/ai-interview/${sessionId}/report`);
    }
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

  // Get color classes
  const getColorClasses = (color) => ({
    bg: `bg-${color}-500`,
    bgLight: `bg-${color}-500/20`,
    text: `text-${color}-400`,
    border: `border-${color}-500`,
  });

  const colors = getColorClasses(roundConfig.color);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        {/* Header */}
        <div className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 px-4 sm:px-6 py-3 sm:py-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className={`px-2 sm:px-3 py-1 rounded-full ${colors.bgLight} ${colors.text} font-bold text-xs sm:text-sm`}>
                {isSpecificMode ? 'Specific Round' : `Round ${roundNum}/5`}
              </div>
              <div className="flex-1 sm:flex-initial">
                <h2 className="text-base sm:text-xl font-bold text-white truncate">{roundConfig.name}</h2>
                <p className="text-xs sm:text-sm text-gray-400">
                  Question {questionNumber} of ~{roundConfig.maxQuestions}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
              {/* Timer */}
              <div className="text-left sm:text-right">
                <p className="text-xs text-gray-400">Duration</p>
                <p className="text-lg sm:text-2xl font-bold text-cyan-400 font-mono">{formatTime(duration)}</p>
              </div>

              {/* Skip Buttons (Testing) - Hidden on mobile */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={handleSkipQuestion}
                  disabled={isLoading || isComplete}
                  className="px-3 py-1.5 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-600/50 text-yellow-400 text-xs rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Skip to next question"
                >
                  Skip Question
                </button>
                <button
                  onClick={handleSkipRound}
                  disabled={isLoading || isComplete}
                  className="px-3 py-1.5 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-600/50 text-orange-400 text-xs rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Skip entire round"
                >
                  Skip Round
                </button>
              </div>

              {/* Score indicator */}
              {lastScore !== null && (
                <div className={`px-3 sm:px-4 py-2 rounded-lg text-center ${lastScore >= 80 ? 'bg-green-500/20 text-green-400' :
                  lastScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                  <p className="text-xs opacity-70">Last Score</p>
                  <p className="text-base sm:text-lg font-bold">{lastScore}/100</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          {isComplete ? (
            /* Round Complete Screen */
            <div className="text-center py-12 sm:py-16 px-4">
              <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-green-500/20 mb-6">
                <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                {isSpecificMode
                  ? 'Generating Your Report... 📊'
                  : `Round ${roundNum} Complete! 🎉`
                }
              </h2>
              <p className="text-sm sm:text-base text-gray-400 mb-8 max-w-md mx-auto">
                {isSpecificMode
                  ? "Great job! We're analyzing your performance and preparing your personalized report. One moment..."
                  : `Great job! You've completed the ${roundConfig.name} round. ${roundNum < 5
                    ? `Ready for the ${ROUND_CONFIG[roundNum + 1]?.name} round?`
                    : 'You have completed all interview rounds!'
                  }`
                }
              </p>
              {!isSpecificMode && (
                <button
                  onClick={handleNextRound}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-base sm:text-lg shadow-lg transition-all transform hover:scale-105"
                >
                  {roundNum < 5 ? (
                    <>
                      Continue to {ROUND_CONFIG[roundNum + 1]?.name} <ChevronRight className="inline w-5 h-5 ml-2" />
                    </>
                  ) : (
                    <>
                      View Your Report <Sparkles className="inline w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              )}
              {isSpecificMode && (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-blue-400">Please wait, redirecting...</p>
                </div>
              )}
            </div>
          ) : (
            /* Interview Interface */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Left Column - Video & Controls */}
              <div className="lg:col-span-1 space-y-4">
                {/* Video Preview */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-3 sm:p-4">
                  <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden mb-4">
                    {stream && isVideoOn ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <VideoOff className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Camera off</p>
                        </div>
                      </div>
                    )}

                    {/* Recording indicator */}
                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex items-center gap-1.5 sm:gap-2 bg-red-600 px-2 sm:px-3 py-1 rounded-full">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse" />
                      <span className="text-white text-xs font-bold">REC</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <button
                      onClick={toggleMic}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${isListening
                        ? 'bg-green-500 animate-pulse'
                        : isMicOn
                          ? 'bg-gray-600 hover:bg-gray-500'
                          : 'bg-red-500'
                        }`}
                    >
                      {isListening ? (
                        <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      ) : isMicOn ? (
                        <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      ) : (
                        <MicOff className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      )}
                    </button>

                    <button
                      onClick={toggleVideo}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${isVideoOn ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-500'
                        }`}
                    >
                      {isVideoOn ? (
                        <Video className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      ) : (
                        <VideoOff className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      )}
                    </button>

                    <button
                      onClick={handleEndCall}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all"
                    >
                      <PhoneOff className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </button>
                  </div>

                  {isListening && (
                    <p className="text-center text-green-400 text-xs sm:text-sm mt-3 animate-pulse">
                      🎤 Listening... Speak now
                    </p>
                  )}
                </div>

                {/* AI Interviewer Status */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center ${isSpeaking ? 'animate-pulse' : ''
                      }`}>
                      {isSpeaking ? (
                        <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      ) : (
                        <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm sm:text-base">AI Interviewer</p>
                      <p className="text-xs sm:text-sm text-gray-400">
                        {isSpeaking ? 'Speaking...' : isLoading ? 'Thinking...' : 'Listening'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Question & Answer */}
              <div className="lg:col-span-2 space-y-4">
                {/* Question Card */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 sm:p-6">
                  <div className="flex flex-wrap items-start gap-2 sm:gap-4 mb-4">
                    <div className={`px-2 sm:px-3 py-1 rounded-full ${colors.bgLight} ${colors.text} text-xs sm:text-sm font-medium`}>
                      {isFollowup ? 'Follow-up Question' : `Question ${questionNumber}`}
                    </div>
                    {isSpeaking && (
                      <div className="flex items-center gap-2 text-purple-400 text-xs sm:text-sm">
                        <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
                        Reading aloud...
                      </div>
                    )}
                  </div>

                  {isLoading && !currentQuestion ? (
                    <div className="flex items-center gap-3 text-gray-400 text-sm sm:text-base">
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      {loadingMessage}
                    </div>
                  ) : (
                    <div className="text-base sm:text-lg text-white leading-relaxed prose prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          h1: ({ node, ...props }) => <h1 className="text-xl sm:text-2xl font-bold text-white mb-4" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="text-lg sm:text-xl font-semibold text-gray-200 mt-6 mb-3" {...props} />,
                          p: ({ node, ...props }) => <p className="text-gray-300 mb-3 text-sm sm:text-base" {...props} />,
                          code: ({ node, inline, ...props }) =>
                            inline
                              ? <code className="bg-gray-700 px-2 py-1 rounded text-xs sm:text-sm text-cyan-300" {...props} />
                              : <code className="block bg-gray-800 p-3 sm:p-4 rounded-lg text-xs sm:text-sm text-gray-200 overflow-x-auto" {...props} />,
                          pre: ({ node, ...props }) => <pre className="bg-gray-800 p-3 sm:p-4 rounded-lg overflow-x-auto mb-4" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc list-inside text-gray-300 mb-3 text-sm sm:text-base" {...props} />,
                          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                          strong: ({ node, ...props }) => <strong className="text-white font-semibold" {...props} />,
                        }}
                      >
                        {isFollowup && currentFollowup
                          ? currentFollowup.text
                          : currentQuestion?.text || 'Loading question...'}
                      </ReactMarkdown>
                    </div>
                  )}

                  {/* Repeat question button */}
                  {(currentQuestion || currentFollowup) && !isLoading && (
                    <button
                      onClick={() => speakQuestion(isFollowup ? currentFollowup?.text : currentQuestion?.text)}
                      disabled={isSpeaking}
                      className="mt-4 flex items-center gap-2 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${isSpeaking ? 'animate-spin' : ''}`} />
                      {isSpeaking ? 'Speaking...' : 'Repeat question'}
                    </button>
                  )}
                </div>

                {/* Feedback Card */}
                {feedback && (
                  <div className={`p-3 sm:p-4 rounded-xl border ${lastScore >= 80
                    ? 'bg-green-500/10 border-green-500/30'
                    : lastScore >= 60
                      ? 'bg-yellow-500/10 border-yellow-500/30'
                      : 'bg-orange-500/10 border-orange-500/30'
                    }`}>
                    <div className="flex items-start gap-3">
                      <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${lastScore >= 80 ? 'text-green-400' : lastScore >= 60 ? 'text-yellow-400' : 'text-orange-400'
                        }`} />
                      <div>
                        <p className="text-xs sm:text-sm text-gray-300">{feedback}</p>
                        {isFollowup && (
                          <p className="text-xs text-gray-500 mt-1">Follow-up answered. Moving to next question...</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />
                    <p className="text-red-400 text-xs sm:text-sm">{error}</p>
                  </div>
                )}

                {/* Answer Input */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs sm:text-sm font-medium text-gray-300">Your Answer</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleMic}
                        className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-all ${isListening
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                      >
                        <Mic className="w-3 h-3 sm:w-4 sm:h-4" />
                        {isListening ? 'Stop' : 'Voice'}
                      </button>
                    </div>
                  </div>

                  <textarea
                    ref={textareaRef}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here or use voice input..."
                    className="w-full h-32 sm:h-40 px-3 sm:px-4 py-2 sm:py-3 bg-gray-700/50 border-2 border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors resize-none text-sm sm:text-base"
                    disabled={isLoading}
                  />

                  <div className="flex items-center justify-between mt-4">
                    <p className="text-xs sm:text-sm text-gray-500">
                      {answer.split(/\s+/).filter(Boolean).length} words
                    </p>

                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!answer.trim() || isLoading}
                      className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                          Submit Answer
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Round Progress</span>
                    <span className="text-sm text-gray-400">
                      {questionNumber} / ~{roundConfig.maxQuestions} questions
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-${roundConfig.color}-500 to-${roundConfig.color}-400 transition-all duration-500`}
                      style={{ width: `${(questionNumber / roundConfig.maxQuestions) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default InterviewRound;
