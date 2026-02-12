import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, Mic, Volume2, CheckCircle, XCircle, AlertCircle, User, Briefcase, Sparkles, Clock, FileText, ArrowLeft } from 'lucide-react';
import { Layout } from '../../components';

const WaitingRoom = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();  // Get sessionId from URL
  const [permissions, setPermissions] = useState({
    camera: 'checking',
    microphone: 'checking',
    speaker: 'granted' // Assume speaker works if audio context is available
  });
  const [stream, setStream] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [isStarting, setIsStarting] = useState(false);

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
    checkPermissions();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const checkPermissions = async () => {
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

  const startInterview = () => {
    // Microphone is required, camera is optional
    if (permissions.microphone !== 'granted') {
      alert('Microphone access is required for the interview.');
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
    if (status === 'granted') return <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded">Ready</span>;
    if (status === 'denied') return <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded">Denied</span>;
    return <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">Checking...</span>;
  };

  const ROUND_CONFIG_MAP = {
    'formal_qa': 'Formal Q&A',
    'technical': 'Technical',
    'coding': 'Coding Challenge',
    'system_design': 'System Design',
    'hr': 'HR'
  };

  const roundInfo = [
    { name: 'Formal Q&A', duration: '8-10 min', color: 'blue', questions: '3-5' },
    { name: 'Technical', duration: '10-15 min', color: 'purple', questions: '3-5' },
    { name: 'Coding Challenge', duration: '15-20 min', color: 'emerald', questions: '3' },
    { name: 'System Design', duration: '10-15 min', color: 'orange', questions: '1-2' },
    { name: 'HR', duration: '5-8 min', color: 'pink', questions: '3-4' },
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
              <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
                {stream && permissions.camera === 'granted' ? (
                  <video
                    autoPlay
                    muted
                    playsInline
                    ref={(video) => {
                      if (video && stream) video.srcObject = stream;
                    }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="text-center text-gray-400 px-4">
                      <Camera className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-sm sm:text-base">{permissions.camera === 'denied' ? 'Camera access denied' : 'Requesting camera access...'}</p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2">(Camera is optional)</p>
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
                      <p className="text-white font-semibold text-sm sm:text-base">45-60 minutes</p>
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
                disabled={permissions.microphone !== 'granted' || isStarting}
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
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WaitingRoom;
