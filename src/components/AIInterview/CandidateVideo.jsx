import { useEffect, useRef, useState } from 'react';
import { Video, VideoOff } from 'lucide-react';

const CandidateVideo = ({ timeRemaining }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isVideoOn, setIsVideoOn] = useState(true);

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

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Your Video</h3>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 ${getRecordingIndicatorColor()} rounded-full animate-pulse`}></div>
          <span className="text-sm text-gray-600">Recording</span>
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

      {/* Confidence Meter */}
      <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Confidence Level</span>
          <span className="text-sm font-bold text-indigo-600">85%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: '85%' }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Based on speech clarity and pace
        </p>
      </div>
    </div>
  );
};

export default CandidateVideo;
