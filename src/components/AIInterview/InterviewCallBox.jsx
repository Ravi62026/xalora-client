import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { useState } from 'react';

const InterviewCallBox = ({ 
  candidateName, 
  interviewerName, 
  duration, 
  isRecording, 
  onToggleMic, 
  onToggleVideo, 
  onEndCall,
  onStartRecording,
  onStopRecording 
}) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const handleMicToggle = () => {
    setIsMicOn(!isMicOn);
    onToggleMic(!isMicOn);
  };

  const handleVideoToggle = () => {
    setIsVideoOn(!isVideoOn);
    onToggleVideo(!isVideoOn);
  };

  return (
    <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-xl overflow-hidden border border-purple-200/30 p-4">
      {/* Main Video Container */}
      <div className="relative aspect-video bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl overflow-hidden mb-4 flex border border-purple-200/50">
        {/* Candidate Video (Left) */}
        <div className="flex-1 relative bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center border-r border-purple-200/50">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop"
            alt="Candidate"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-full">
            <p className="text-white text-sm font-semibold">{candidateName}</p>
          </div>
        </div>

        {/* Interviewer Video (Right) */}
        <div className="flex-1 relative bg-gradient-to-br from-blue-900 to-slate-800 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop"
            alt="Interviewer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
          <div className="absolute bottom-4 right-4 bg-black/50 px-3 py-1 rounded-full">
            <p className="text-white text-sm font-semibold">{interviewerName}</p>
          </div>
        </div>

        {/* Recording Indicator */}
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full z-10">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-white text-xs font-bold">REC</span>
          </div>
        )}

        {/* Duration (Top Right) */}
        <div className="absolute top-4 right-4 bg-black/50 px-4 py-2 rounded-lg z-10">
          <p className="text-cyan-400 font-bold text-lg">{duration}</p>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-4">
        {/* Microphone Button */}
        <button
          onClick={handleMicToggle}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${
            isMicOn
              ? 'bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
              : 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
          } shadow-lg`}
        >
          {isMicOn ? (
            <Mic className="w-6 h-6 text-white" />
          ) : (
            <MicOff className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Video Button */}
        <button
          onClick={handleVideoToggle}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${
            isVideoOn
              ? 'bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'
              : 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
          } shadow-lg`}
        >
          {isVideoOn ? (
            <Video className="w-6 h-6 text-white" />
          ) : (
            <VideoOff className="w-6 h-6 text-white" />
          )}
        </button>

        {/* End Call Button */}
        <button
          onClick={onEndCall}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg transition-all transform hover:scale-110"
        >
          <PhoneOff className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default InterviewCallBox;
