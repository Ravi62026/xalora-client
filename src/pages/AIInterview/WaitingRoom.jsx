import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, Mic, Volume2, CheckCircle, XCircle, AlertCircle, User, Briefcase, Sparkles, Clock, FileText, ArrowLeft, Monitor, Shield, Video, VideoOff } from 'lucide-react';
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
  const [isDevMode, setIsDevMode] = useState(import.meta.env.DEV);

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
  }, [sessionId, navigate]);

  // Navigate when countdown reaches 0
  useEffect(() => {
    if (countdown === 0 && isStarting) {
      const firstRound = sessionData?.specificRound || 'formal_qa';
      navigate(`/ai-interview/${sessionId}/round/${firstRound}`);
    }
  }, [countdown, isStarting, navigate, sessionData, sessionId]);

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
      navigate('/ai-interview/setup');
    }
  }, [navigate]);

  useEffect(() => {
    return () => {
      // Cleanup camera stream when unmounting
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

      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (fsErr) {
        console.warn('Fullscreen request failed:', fsErr);
      }

      window.__interviewScreenShare = displayStream;

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
    if (permissions.microphone !== 'granted') {
      alert('Microphone access is required for the interview.');
      return;
    }
    if (!isDevMode && screenShareStatus !== 'granted') {
      alert('Screen sharing is required for the interview.');
      return;
    }

    setIsStarting(true);
    setCountdown(3);

    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
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
    if (status === 'granted') return <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded border border-green-200 font-bold">Ready</span>;
    if (status === 'denied') return <span className="text-xs px-2 py-0.5 bg-red-50 text-red-700 rounded border border-red-200 font-bold">Blocked</span>;
    if (status === 'pending') return <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded border border-slate-200 font-bold">Action Required</span>;
    return <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-200 font-bold">Checking...</span>;
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

  const badgeColorMap = {
    blue: 'bg-blue-50 border border-blue-200 text-blue-700',
    purple: 'bg-purple-50 border border-purple-200 text-purple-700',
    emerald: 'bg-emerald-50 border border-emerald-200 text-emerald-700',
    orange: 'bg-orange-50 border border-orange-200 text-orange-700',
    pink: 'bg-pink-50 border border-pink-200 text-pink-700',
    cyan: 'bg-cyan-50 border border-cyan-200 text-cyan-700',
    amber: 'bg-amber-50 border border-amber-200 text-amber-705'
  };

  return (
    <Layout>
      <div className="min-h-screen xalora-grid-bg text-slate-800 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative">
        {/* Floating Dev Mode Toggle */}
        <button
          onClick={() => setIsDevMode(!isDevMode)}
          className={`fixed top-4 right-4 z-50 px-3 py-1.5 text-xs font-bold rounded-full border shadow-lg transition-all ${
            isDevMode ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-slate-100 text-slate-655 border-slate-200'
          }`}
        >
          DEV: {isDevMode ? 'ON' : 'OFF'}
        </button>

        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/ai-interview/setup')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 cursor-pointer border-0 bg-transparent font-bold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Setup
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-emerald-50 rounded-full border border-emerald-200 mb-4 shadow-sm">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-705" />
              <span className="text-emerald-755 text-xs sm:text-sm font-bold">System Check Complete</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 mb-2">
              XALORA AI INTERVIEW
            </h1>
            <p className="text-sm sm:text-base text-slate-500 font-semibold">AI-Powered Voice Interview with Real-time Analysis</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Camera Preview Card */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
                  <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                  Camera Preview
                </h2>
                <div className="relative aspect-video bg-slate-50 rounded-xl overflow-hidden shadow-inner border border-slate-200">
                  {!hasRequestedPermissions ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/85 backdrop-blur-sm px-6 text-center z-10">
                      <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mb-4 border border-indigo-200 shadow-inner">
                        <Camera className="w-7 h-7 text-indigo-650" />
                      </div>
                      <h3 className="text-base font-bold text-slate-800 mb-2">Equipment Check</h3>
                      <p className="text-xs text-slate-550 mb-6 max-w-sm leading-relaxed font-semibold">
                        We need access to your camera and microphone to conduct the AI interview. Your privacy is protected.
                      </p>
                      <button
                        onClick={requestPermissions}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer border-0"
                      >
                        Allow Access
                      </button>
                    </div>
                  ) : permissions.camera === 'checking' ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/90">
                      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                      <p className="text-slate-700 font-bold text-sm">Waiting for permission...</p>
                      <p className="text-[10px] text-slate-500 mt-1 font-semibold">Please click 'Allow' in your browser popup.</p>
                    </div>
                  ) : permissions.camera === 'denied' && permissions.microphone === 'denied' ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 border border-red-200 px-6 text-center z-10">
                      <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4 border border-red-200 text-red-750">
                        <XCircle className="w-7 h-7" />
                      </div>
                      <h3 className="text-base font-black text-red-950 mb-1">Access Blocked</h3>
                      <p className="text-xs text-red-800 mb-6 max-w-sm font-semibold leading-relaxed">
                        Your browser is blocking access. Please click the lock icon 🔒 in the URL bar to allow camera and microphone, then refresh.
                      </p>
                      <button
                        onClick={() => window.location.reload()}
                        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer border-0 shadow"
                      >
                        Refresh Page
                      </button>
                    </div>
                  ) : stream && permissions.camera === 'granted' ? (
                    <video
                      autoPlay
                      muted
                      playsInline
                      ref={(videoElement) => {
                        if (videoElement && stream) {
                          if (videoElement.srcObject !== stream) {
                            videoElement.srcObject = stream;
                          }
                        }
                      }}
                      className="w-full h-full object-cover transform scale-x-[-1]"
                      onLoadedMetadata={() => {
                        console.log('[WaitingRoom] Video stream loaded and ready');
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100/90">
                      <div className="text-center text-slate-650 px-4">
                        {permissions.microphone === 'granted' ? (
                          <>
                            <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mb-3 mx-auto border border-amber-250">
                              <Mic className="w-7 h-7 text-amber-700" />
                            </div>
                            <p className="text-slate-800 font-bold text-sm">Audio Only Mode</p>
                            <p className="text-xs text-slate-500 mt-1 font-semibold">Camera access is denied or unavailable.</p>
                          </>
                        ) : (
                          <>
                            <VideoOff className="w-10 h-10 mx-auto mb-3 opacity-30 text-slate-400" />
                            <p className="text-xs text-slate-400 font-semibold">Camera off</p>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Countdown Overlay */}
                  {isStarting && countdown > 0 && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex items-center justify-center z-30">
                      <div className="text-center animate-in zoom-in-95 duration-200">
                        <p className="text-6xl font-black text-slate-900 mb-2">{countdown}</p>
                        <p className="text-sm text-slate-600 font-bold uppercase tracking-wider">Starting interview...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Device Status items */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <Camera className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span className="font-semibold text-slate-700 text-sm truncate">Camera</span>
                    {getStatusBadge(permissions.camera)}
                  </div>
                  {getStatusIcon(permissions.camera)}
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <Mic className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span className="font-semibold text-slate-700 text-sm truncate">Microphone</span>
                    {getStatusBadge(permissions.microphone)}
                    {permissions.microphone !== 'granted' && (
                      <span className="text-xs text-red-500 font-bold ml-1">(Required)</span>
                    )}
                  </div>
                  {getStatusIcon(permissions.microphone)}
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <Volume2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span className="font-semibold text-slate-700 text-sm truncate">Speaker</span>
                    {getStatusBadge(permissions.speaker)}
                  </div>
                  {getStatusIcon(permissions.speaker)}
                </div>

                {/* Screen Share row */}
                {!isDevMode && (
                  <>
                    <div className="flex items-center justify-between p-3 bg-slate-55 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <Monitor className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span className="font-semibold text-slate-700 text-sm truncate">Screen Share</span>
                        {getStatusBadge(screenShareStatus)}
                        {screenShareStatus !== 'granted' && (
                          <span className="text-xs text-red-500 font-bold ml-1">(Required)</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {screenShareStatus !== 'granted' && permissions.microphone === 'granted' && (
                          <button
                            onClick={requestScreenShare}
                            className="px-3 py-1 text-xs font-bold rounded-lg bg-cyan-600 hover:bg-cyan-705 text-white transition-colors flex items-center gap-1 cursor-pointer border-0"
                          >
                            <Monitor className="w-3 h-3" />
                            Share
                          </button>
                        )}
                        {getStatusIcon(screenShareStatus)}
                      </div>
                    </div>
                    {screenShareError && (
                      <p className="text-xs text-red-650 px-3 flex items-center gap-1 font-semibold">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        {screenShareError}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Right Column details list */}
            <div className="space-y-4 sm:space-y-6">
              
              {/* Interview Details Card */}
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-650" />
                  Interview Details
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-650 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <label className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Candidate</label>
                      <p className="text-slate-800 font-extrabold text-sm sm:text-base truncate">
                        {sessionData?.candidateInfo?.name || 'Loading...'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-650 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <label className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Position</label>
                      <p className="text-slate-800 font-extrabold text-sm sm:text-base truncate">
                        {sessionData?.position || 'Loading...'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <label className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Estimated Duration</label>
                      <p className="text-slate-800 font-extrabold text-sm sm:text-base">
                        {sessionData?.interviewMode === 'full' ? '60-90 minutes' : sessionData?.interviewMode === 'specific' ? '10-15 minutes' : '30-45 minutes'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <label className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Interview Mode</label>
                      <p className="text-slate-800 font-extrabold text-sm sm:text-base">
                        {sessionData?.interviewMode === 'specific' ? 'Specific Practice Round' : 'Full loop loop'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Round Overview */}
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4 text-slate-850 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  {sessionData?.interviewMode === 'specific' ? 'Selected Round' : 'Round Overview'}
                </h2>
                <div className="space-y-2">
                  {roundInfo
                    .filter(round =>
                      sessionData?.interviewMode !== 'specific' ||
                      ROUND_CONFIG_MAP[sessionData?.specificRound] === round.name
                    )
                    .map((round, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl shadow-inner">
                        <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-black shadow-sm ${badgeColorMap[round.color]}`}>
                            {sessionData?.interviewMode === 'specific' ? '★' : index + 1}
                          </span>
                          <span className="text-slate-700 font-bold">{round.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-500 text-xs font-semibold">{round.duration}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Guidelines / Tips */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 shadow-inner">
                <h3 className="font-bold mb-3 flex items-center gap-2 text-indigo-805">
                  <AlertCircle className="w-5 h-5" />
                  Interview Tips
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-650 font-semibold">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    <span>Sit in a quiet, well-lit room</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    <span>Look directly at the camera while speaking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    <span>Speak clearly and at a moderate pace</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    <span>Take your time to formulate your answer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    <span>Use the STAR method for behavioral answers</span>
                  </li>
                </ul>
              </div>

              {/* Start Interview Action */}
              <button
                onClick={startInterview}
                disabled={permissions.microphone !== 'granted' || (!isDevMode && screenShareStatus !== 'granted') || isStarting}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-650 to-purple-650 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-base sm:text-lg shadow-lg shadow-indigo-600/10 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 cursor-pointer border-0"
              >
                {isStarting ? (
                  <>Starting in {countdown}...</>
                ) : (
                  <>🚀 Start Practice Round</>
                )}
              </button>

              {permissions.microphone !== 'granted' && (
                <p className="text-center text-red-700 text-xs sm:text-sm px-4 font-bold">
                  Please grant microphone access to start the interview
                </p>
              )}
              {permissions.microphone === 'granted' && !isDevMode && screenShareStatus !== 'granted' && (
                <p className="text-center text-cyan-750 text-xs sm:text-sm px-4 flex items-center justify-center gap-1 font-bold">
                  <Shield className="w-3.5 h-3.5" />
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
