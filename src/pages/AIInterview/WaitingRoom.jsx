import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, Mic, Volume2, CheckCircle, XCircle, AlertCircle, User, Briefcase, Sparkles, Clock, FileText, ArrowLeft, Monitor, Shield } from 'lucide-react';
import { Layout } from '../../components';
import interviewService from '../../services/interviewService';

const WaitingRoom = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();  // Get sessionId from URL
  const [permissions, setPermissions] = useState({
    camera: 'pending',
    microphone: 'pending',
    speaker: 'granted' // Assume speaker works if audio context is available
  });
  const [stream, setStream] = useState(null);
  const [_screenShareStream, setScreenShareStream] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const [hasRequestedPermissions, setHasRequestedPermissions] = useState(false);
  const [screenShareStatus, setScreenShareStatus] = useState('pending'); // pending | granted | denied
  const [screenShareError, setScreenShareError] = useState('');

  // Check if session is already completed — redirect to report
  useEffect(() => {
    const checkSession = async () => {
      if (!sessionId) return;
      try {
        const response = await interviewService.getSessionStatus(sessionId);
        if (response?.data?.status === 'completed' || response?.data?.hasReport) {
          console.log('[WaitingRoom] Session already completed, redirecting to report');
          navigate(`/ai-interview/${sessionId}/report`, { replace: true });
        }
      } catch (err) {
        if (err.response?.status === 404) {
          navigate('/dashboard', { replace: true });
        }
      }
    };
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Load session data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('interviewSessionData');
    if (savedData) {
      try {
        setSessionData(JSON.parse(savedData));
      } catch (e) {
        console.error('Failed to parse session data:', e);
        navigate('/ai-interview/setup');
      }
    } else {
      // No session data, redirect to setup
      navigate('/ai-interview/setup');
    }
  }, [navigate]);

  useEffect(() => {
    return () => {
      // Cleanup camera stream when unmounting (screen share stream is kept alive for InterviewRound)
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const requestPermissions = async () => {
    setHasRequestedPermissions(true);
    setPermissions({ camera: 'checking', microphone: 'checking', speaker: 'granted' });

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setStream(mediaStream);
      setPermissions({
        camera: 'granted',
        microphone: 'granted',
        speaker: 'granted'
      });
    } catch (error) {
      console.error('Media permissions error:', error);
      // Try audio only
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setStream(audioStream);
        setPermissions(prev => ({
          ...prev,
          microphone: 'granted',
          camera: 'denied'
        }));
      } catch (audioError) {
        setPermissions({
          camera: 'denied',
          microphone: 'denied',
          speaker: 'granted'
        });
      }
    }
  };

  const requestScreenShare = async () => {
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
        setScreenShareError('Please share your entire screen, not a specific window or tab.');
        setScreenShareStatus('denied');
        return;
      }

      setScreenShareStream(displayStream);
      setScreenShareStatus('granted');
      setScreenShareError('');

      // Enter fullscreen mode for proctoring
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (fsErr) {
        console.warn('Fullscreen request failed:', fsErr);
      }

      // Store in window so InterviewRound can pick it up
      window.__interviewScreenShare = displayStream;

      // Listen for user stopping screen share
      videoTrack.onended = () => {
        setScreenShareStream(null);
        setScreenShareStatus('denied');
        setScreenShareError('Screen share was stopped. Please share again before starting.');
        window.__interviewScreenShare = null;
      };
    } catch (error) {
      console.error('Screen share error:', error);
      if (error.name === 'NotAllowedError') {
        setScreenShareError('Screen share was cancelled. Please try again.');
      } else {
        setScreenShareError('Failed to start screen share. Please try again.');
      }
      setScreenShareStatus('denied');
    }
  };

  const startInterview = () => {
    // Microphone is required, camera is optional
    if (permissions.microphone !== 'granted') {
      alert('Microphone access is required for the interview.');
      return;
    }
    if (screenShareStatus !== 'granted') {
      alert('Screen sharing is required for the interview.');
      return;
    }

    setIsStarting(true);
    setCountdown(3);

    // Countdown before starting
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          // Navigate to first round with sessionId and roundType
          const firstRound = sessionData?.specificRound || 'formal_qa';
          navigate(`/ai-interview/${sessionId}/round/${firstRound}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const getStatusIcon = (status) => {
    if (status === 'granted') return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === 'denied') return <XCircle className="w-5 h-5 text-red-500" />;
    return <AlertCircle className="w-5 h-5 text-yellow-500 animate-pulse" />;
  };

  const getStatusBadge = (status) => {
    if (status === 'granted') return <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded border border-green-500/20">Ready</span>;
    if (status === 'denied') return <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded border border-red-500/20">Blocked</span>;
    if (status === 'pending') return <span className="text-xs px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded border border-gray-500/20">Action Required</span>;
    return <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded border border-yellow-500/20">Checking...</span>;
  };

  const ROUND_CONFIG_MAP = {
    'formal_qa': 'Formal Q&A',
    'technical': 'Technical',
    'coding': 'Coding Challenge',
    'system_design': 'System Design',
    'hr': 'HR',
    'behavioral': 'HR',
    'resume_deep_dive': 'Resume Deep Dive',
    'jd_based': 'JD Based'
  };

  const roundInfo = [
    { name: 'Formal Q&A', duration: '8-10 min', color: 'blue', questions: '3-5' },
    { name: 'Technical', duration: '10-15 min', color: 'purple', questions: '3-5' },
    { name: 'Coding Challenge', duration: '15-20 min', color: 'emerald', questions: '3' },
    { name: 'System Design', duration: '10-15 min', color: 'orange', questions: '1-2' },
    { name: 'HR', duration: '5-8 min', color: 'pink', questions: '3-4' },
    { name: 'Resume Deep Dive', duration: '10-12 min', color: 'cyan', questions: '5-7' },
    { name: 'JD Based', duration: '10-12 min', color: 'amber', questions: '5-7' },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/ai-interview/setup')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Setup
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full border border-emerald-500/30 mb-4">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              <span className="text-emerald-300 text-xs sm:text-sm font-medium">System Check Complete</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-2">
              🎥 XALORA AI INTERVIEW
            </h1>
            <p className="text-sm sm:text-base text-gray-400">AI-Powered Voice Interview with Real-time Analysis</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Camera Preview */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                Camera Preview
              </h2>
              <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-inner border border-gray-700/50">
                {!hasRequestedPermissions ? (
                  // Initial Professional Prompt Before Requesting Use
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 px-6 text-center z-10">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 border border-blue-500/20">
                      <Camera className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Equipment Check</h3>
                    <p className="text-sm text-gray-400 mb-6 max-w-sm leading-relaxed">
                      We need access to your camera and microphone to conduct the AI interview. Your privacy is protected.
                    </p>
                    <button
                      onClick={requestPermissions}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 flex items-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Allow Access
                    </button>
                  </div>
                ) : permissions.camera === 'checking' ? (
                  // Checking State (waiting for browser prompt)
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="w-10 h-10 border-3 border-blue-500/30 border-t-blue-500 border-r-blue-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-300 font-medium">Waiting for permission...</p>
                    <p className="text-xs text-gray-500 mt-2">Please click 'Allow' in your browser popup.</p>
                  </div>
                ) : permissions.camera === 'denied' && permissions.microphone === 'denied' ? (
                  // Completely Blocked State
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 px-6 text-center z-10">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
                      <XCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Access Blocked</h3>
                    <p className="text-sm text-gray-400 mb-6 max-w-sm line-clamp-3">
                      Your browser is blocking access. Please click the lock icon <span className="inline-block align-middle mx-1">🔒</span> in the left of your URL bar to allow camera and microphone, then refresh.
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-xl transition-all"
                    >
                      I've allowed it, refresh page
                    </button>
                  </div>
                ) : stream && permissions.camera === 'granted' ? (
                  // Success stream
                  <video
                    autoPlay
                    muted
                    playsInline
                    ref={(video) => {
                      if (video && stream) video.srcObject = stream;
                    }}
                    className="w-full h-full object-cover transform scale-x-[-1]" // Mirrored for better UX
                  />
                ) : (
                  // Audio-only or gracefully degraded state
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="text-center text-gray-400 px-4">
                      {permissions.microphone === 'granted' ? (
                        <>
                          <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4 mx-auto border border-yellow-500/20">
                            <Mic className="w-8 h-8 text-yellow-500" />
                          </div>
                          <p className="text-white font-medium text-base">Audio Only Mode</p>
                          <p className="text-sm text-gray-400 mt-2">Camera access is denied or unavailable.</p>
                        </>
                      ) : (
                        <>
                          <Camera className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-30" />
                          <p className="text-sm sm:text-base text-gray-500">Camera off</p>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Countdown Overlay */}
                {isStarting && countdown > 0 && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-5xl sm:text-6xl font-bold text-white mb-4">{countdown}</p>
                      <p className="text-lg sm:text-xl text-gray-300">Starting interview...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Device Status */}
              <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                    <span className="font-medium text-gray-300 text-sm sm:text-base truncate">Camera</span>
                    {getStatusBadge(permissions.camera)}
                  </div>
                  {getStatusIcon(permissions.camera)}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                    <span className="font-medium text-gray-300 text-sm sm:text-base truncate">Microphone</span>
                    {getStatusBadge(permissions.microphone)}
                    {permissions.microphone !== 'granted' && (
                      <span className="text-xs text-red-400 hidden sm:inline">(Required)</span>
                    )}
                  </div>
                  {getStatusIcon(permissions.microphone)}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                    <span className="font-medium text-gray-300 text-sm sm:text-base truncate">Speaker</span>
                    {getStatusBadge(permissions.speaker)}
                  </div>
                  {getStatusIcon(permissions.speaker)}
                </div>

                {/* Screen Share */}
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                    <span className="font-medium text-gray-300 text-sm sm:text-base truncate">Screen Share</span>
                    {getStatusBadge(screenShareStatus)}
                    {screenShareStatus !== 'granted' && (
                      <span className="text-xs text-red-400 hidden sm:inline">(Required)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {screenShareStatus !== 'granted' && permissions.microphone === 'granted' && (
                      <button
                        onClick={requestScreenShare}
                        className="px-3 py-1 text-xs font-medium rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors flex items-center gap-1"
                      >
                        <Monitor className="w-3 h-3" />
                        Share
                      </button>
                    )}
                    {getStatusIcon(screenShareStatus)}
                  </div>
                </div>
                {screenShareError && (
                  <p className="text-xs text-red-400 px-3 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {screenShareError}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4 sm:space-y-6">
              {/* Interview Details */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-xl p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-400" />
                  Interview Details
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <label className="text-xs text-gray-500">Candidate</label>
                      <p className="text-white font-semibold text-sm sm:text-base truncate">
                        {sessionData?.candidateInfo?.name || 'Loading...'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <label className="text-xs text-gray-500">Position</label>
                      <p className="text-white font-semibold text-sm sm:text-base truncate">
                        {sessionData?.position || 'Loading...'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <label className="text-xs text-gray-500">Estimated Duration</label>
                      <p className="text-white font-semibold text-sm sm:text-base">
                        {sessionData?.interviewMode === 'full' ? '60-90 minutes' : sessionData?.interviewMode === 'specific' ? '10-15 minutes' : '30-45 minutes'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <label className="text-xs text-gray-500">Interview Mode</label>
                      <p className="text-white font-semibold text-sm sm:text-base">
                        {sessionData?.interviewMode === 'specific' ? 'Specific Round' : 'Full Interview'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Round Overview */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  {sessionData?.interviewMode === 'specific' ? 'Selected Round' : 'Round Overview'}
                </h2>
                <div className="space-y-2">
                  {roundInfo
                    .filter(round =>
                      sessionData?.interviewMode !== 'specific' ||
                      ROUND_CONFIG_MAP[sessionData?.specificRound] === round.name
                    )
                    .map((round, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold bg-${round.color}-500/20 text-${round.color}-400`}>
                            {sessionData?.interviewMode === 'specific' ? '★' : index + 1}
                          </span>
                          <span className="text-gray-300 font-medium">{round.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-sm">{round.duration}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-6 border border-blue-700/30">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-blue-400">
                  <AlertCircle className="w-5 h-5" />
                  Interview Tips
                </h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Sit in a quiet, well-lit room</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Look at the camera while speaking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Speak clearly and at a moderate pace</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Take your time to think before answering</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Use the STAR method for behavioral questions</span>
                  </li>
                </ul>
              </div>

              {/* Start Button */}
              <button
                onClick={startInterview}
                disabled={permissions.microphone !== 'granted' || screenShareStatus !== 'granted' || isStarting}
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl shadow-red-500/30 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isStarting ? (
                  <>Starting in {countdown}...</>
                ) : (
                  <>🚀 Start Interview</>
                )}
              </button>

              {permissions.microphone !== 'granted' && (
                <p className="text-center text-red-400 text-xs sm:text-sm px-4">
                  Please grant microphone access to start the interview
                </p>
              )}
              {permissions.microphone === 'granted' && screenShareStatus !== 'granted' && (
                <p className="text-center text-cyan-400 text-xs sm:text-sm px-4 flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" />
                  Please share your entire screen to start the interview
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WaitingRoom;
