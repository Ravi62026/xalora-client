import { useState, useEffect } from 'react';

const AnimatedInterviewer = ({ imageUrl, status = 'speaking' }) => {
  const [headRotation, setHeadRotation] = useState(0);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);

  // Head movement - subtle side to side
  useEffect(() => {
    const headInterval = setInterval(() => {
      setHeadRotation(prev => {
        const newRotation = Math.sin(Date.now() / 2000) * 5; // -5 to 5 degrees
        return newRotation;
      });
    }, 50);
    return () => clearInterval(headInterval);
  }, []);

  // Eye movement - follows a pattern
  useEffect(() => {
    const eyeInterval = setInterval(() => {
      const angle = (Date.now() / 3000) * Math.PI * 2;
      setEyePosition({
        x: Math.cos(angle) * 8,
        y: Math.sin(angle) * 6
      });
    }, 50);
    return () => clearInterval(eyeInterval);
  }, []);

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Mouth movement based on status
  useEffect(() => {
    if (status === 'speaking') {
      const mouthInterval = setInterval(() => {
        setMouthOpen(prev => !prev);
      }, 200);
      return () => clearInterval(mouthInterval);
    } else {
      setMouthOpen(false);
    }
  }, [status]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10"></div>

      {/* Main image container with animations */}
      <div
        className="relative transition-transform duration-100"
        style={{
          transform: `rotateZ(${headRotation}deg)`,
        }}
      >
        {/* Image */}
        <img
          src={imageUrl}
          alt="Interviewer"
          className="w-full h-full object-cover rounded-lg shadow-lg"
          style={{
            filter: isBlinking ? 'brightness(0.7)' : 'brightness(1)',
            transition: 'filter 0.1s ease-in-out'
          }}
        />

        {/* Eye overlay for tracking effect */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Left eye glow */}
          <div
            className="absolute w-8 h-8 rounded-full bg-white/20 blur-md"
            style={{
              left: `calc(30% + ${eyePosition.x}px)`,
              top: `calc(35% + ${eyePosition.y}px)`,
              transition: 'all 0.05s ease-out'
            }}
          ></div>

          {/* Right eye glow */}
          <div
            className="absolute w-8 h-8 rounded-full bg-white/20 blur-md"
            style={{
              right: `calc(30% + ${-eyePosition.x}px)`,
              top: `calc(35% + ${eyePosition.y}px)`,
              transition: 'all 0.05s ease-out'
            }}
          ></div>

          {/* Mouth indicator */}
          {status === 'speaking' && (
            <div
              className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-red-400/40 rounded-full blur-sm"
              style={{
                scaleY: mouthOpen ? 1.2 : 0.8,
                transition: 'scaleY 0.1s ease-in-out'
              }}
            ></div>
          )}
        </div>

        {/* Listening pulse effect */}
        {status === 'listening' && (
          <div className="absolute inset-0 rounded-lg border-2 border-green-400 animate-pulse"></div>
        )}

        {/* Thinking effect - subtle glow */}
        {status === 'thinking' && (
          <div className="absolute inset-0 rounded-lg shadow-lg shadow-yellow-400/50 animate-pulse"></div>
        )}

        {/* Analyzing effect - strong glow */}
        {status === 'analyzing' && (
          <div className="absolute inset-0 rounded-lg shadow-lg shadow-purple-400/50 animate-pulse" style={{
            animationDuration: '0.5s'
          }}></div>
        )}
      </div>

      {/* Particle effects for speaking */}
      {status === 'speaking' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
              style={{
                left: `${30 + i * 20}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.2}s`,
                opacity: 0.6
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnimatedInterviewer;
