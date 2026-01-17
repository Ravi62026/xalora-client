import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';

const VideoSection = ({ candidateName, candidateAge, duration, isRecording, onEndCall }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 py-6">
      {/* Candidate Video */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 shadow-xl">
        <div className="relative aspect-video bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop"
            alt="Candidate"
            className="w-full h-full object-cover"
          />
          {isRecording && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-white text-xs font-bold">REC</span>
            </div>
          )}
        </div>
        <div className="p-4 bg-slate-800/50 border-t border-slate-700/50">
          <p className="text-white font-semibold">{candidateName}</p>
          <p className="text-sm text-slate-400">Professional candidate (Indian male, 30s)</p>
          <p className="text-xs text-slate-500 mt-2">Duration: {duration}</p>
        </div>
      </div>

      {/* Interviewer Video */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 shadow-xl">
        <div className="relative aspect-video bg-gradient-to-br from-blue-900 to-slate-800 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop"
            alt="Interviewer"
            className="w-full h-full object-cover"
          />
          {/* AI Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
        </div>
        <div className="p-4 bg-slate-800/50 border-t border-slate-700/50">
          <p className="text-white font-semibold">AI Interviewer</p>
          <p className="text-sm text-slate-400">Senior Technical Interviewer</p>
          <p className="text-xs text-slate-500 mt-2">Status: Active</p>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;
