import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Video, VideoOff, Eye, EyeOff, Users, AlertTriangle } from 'lucide-react';

const FACE_STATUS_CONFIG = {
  ok: null,
  no_face: { icon: EyeOff, label: "Face not detected", color: "text-red-400" },
  multiple: { icon: Users, label: "Multiple faces", color: "text-orange-400" },
  looking_away: { icon: AlertTriangle, label: "Look at the screen", color: "text-yellow-400" },
};

const CandidateVideo = forwardRef(({ timeRemaining, faceStatus = "ok" }, ref) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isVideoOn, setIsVideoOn] = useState(true);

  // Expose video element to parent via ref
  useImperativeHandle(ref, () => ({
    getVideoElement: () => videoRef.current,
  }));

  useEffect(() => {
    startVideo();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startVideo = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOn(!isVideoOn);
    }
  };

  const getRecordingIndicatorColor = () => {
    if (timeRemaining <= 30) return 'bg-red-500';
    if (timeRemaining <= 120) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const statusConfig = FACE_STATUS_CONFIG[faceStatus];
  const StatusIcon = statusConfig?.icon;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Your Video</h3>
        <div className="flex items-center gap-3">
          {statusConfig && (
            <div className={`flex items-center gap-1.5 ${statusConfig.color}`}>
              <StatusIcon className="w-4 h-4" />
              <span className="text-xs font-medium">{statusConfig.label}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 ${getRecordingIndicatorColor()} rounded-full animate-pulse`}></div>
            <span className="text-sm text-gray-600">Recording</span>
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
        {isVideoOn ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="text-center text-white">
              <VideoOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Camera Off</p>
            </div>
          </div>
        )}

        {/* Face status overlay */}
        {faceStatus !== "ok" && statusConfig && (
          <div className="absolute inset-0 border-2 border-red-500/60 rounded-xl pointer-events-none">
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
              <StatusIcon className="w-3.5 h-3.5" />
              {statusConfig.label}
            </div>
          </div>
        )}

        {/* Proctoring active indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 px-2 py-1 rounded-full">
          <Eye className="w-3 h-3 text-emerald-400" />
          <span className="text-[10px] text-emerald-300 font-medium">Proctored</span>
        </div>

        {/* Overlay Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <button
            onClick={toggleVideo}
            className="px-4 py-2 bg-white/90 hover:bg-white text-gray-800 rounded-full font-medium transition-all shadow-lg"
          >
            {isVideoOn ? (
              <Video className="w-5 h-5" />
            ) : (
              <VideoOff className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

CandidateVideo.displayName = "CandidateVideo";

export default CandidateVideo;
