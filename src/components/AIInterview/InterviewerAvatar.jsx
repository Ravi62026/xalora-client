import React, { useState, useEffect } from 'react';

/**
 * InterviewerAvatar
 * Displays a real interviewer image with subtle animations
 * Replace DEFAULT_INTERVIEWER_IMAGE with your interviewer photo URL
 */
const DEFAULT_INTERVIEWER_IMAGE = '/interviewer.png'; // Place your image in public/
const DEFAULT_INTERVIEWER_VIDEO = '/Untitled video - Made with Clipchamp (1).mp4';

class AvatarErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('[AvatarErrorBoundary] Avatar load error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * InterviewerImage component
 * Displays a real interviewer photo with subtle animations
 * - Blinking effect
 * - Slight head tilt when speaking
 * - Smooth transitions
 */
const InterviewerImage = ({ imageSrc, isSpeaking, videoSrc = DEFAULT_INTERVIEWER_VIDEO }) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const videoRef = React.useRef(null);

  useEffect(() => {
    // Blinking disabled for a static presenter look
    setIsBlinking(false);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isSpeaking) {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isSpeaking]);

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      {/* Main interviewer image */}
      <div className="relative">
        <img
          src={imageSrc}
          alt="Interviewer"
          className="h-96 w-96 object-cover rounded-xl shadow-2xl"
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22%3E%3Crect fill=%22%23333%22 width=%22400%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2220%22%3EImage not found%3C/text%3E%3C/svg%3E';
          }}
        />
        <video
          ref={videoRef}
          src={videoSrc}
          className={`absolute inset-0 h-96 w-96 object-cover rounded-xl shadow-2xl transition-opacity duration-200 ${isSpeaking ? 'opacity-100' : 'opacity-0'}`}
          muted
          playsInline
          loop
          preload="auto"
          poster={imageSrc}
          onError={(e) => {
            e.currentTarget.poster = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22%3E%3Crect fill=%22%23333%22 width=%22400%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2220%22%3EVideo not found%3C/text%3E%3C/svg%3E';
          }}
        />
        
        {/* Blinking overlay */}
        {isBlinking && (
          <div className="absolute inset-0 bg-black/30 rounded-xl transition-opacity duration-150" />
        )}
      </div>

      {/* Status indicator removed */}
    </div>
  );
};

const InterviewerAvatar = ({
  imageSrc = DEFAULT_INTERVIEWER_IMAGE,
  videoSrc = DEFAULT_INTERVIEWER_VIDEO,
  isSpeaking = false
}) => {
  return (
    <AvatarErrorBoundary
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 text-xs text-emerald-100">
            Interviewer avatar unavailable
          </div>
        </div>
      }
    >
      <InterviewerImage imageSrc={imageSrc} videoSrc={videoSrc} isSpeaking={isSpeaking} />
    </AvatarErrorBoundary>
  );
};

export default InterviewerAvatar;
