import { useEffect, useState } from 'react';

const AIAvatar = ({ status }) => {
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [mouthState, setMouthState] = useState('neutral');

  // Eye movement
  useEffect(() => {
    const interval = setInterval(() => {
      setEyePosition({
        x: Math.random() * 10 - 5,
        y: Math.random() * 10 - 5
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Blinking
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Mouth state based on status
  useEffect(() => {
    switch(status) {
      case 'speaking':
        setMouthState('speaking');
        break;
      case 'listening':
        setMouthState('neutral');
        break;
      case 'thinking':
        setMouthState('thinking');
        break;
      case 'analyzing':
        setMouthState('analyzing');
        break;
      default:
        setMouthState('neutral');
    }
  }, [status]);

  const getStatusColor = () => {
    switch(status) {
      case 'speaking': return 'from-blue-500 to-cyan-500';
      case 'listening': return 'from-green-500 to-emerald-500';
      case 'thinking': return 'from-yellow-500 to-orange-500';
      case 'analyzing': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusText = () => {
    switch(status) {
      case 'speaking': return '🔊 Speaking...';
      case 'listening': return '👂 Listening...';
      case 'thinking': return '🤔 Thinking...';
      case 'analyzing': return '🧠 Analyzing...';
      default: return '💤 Idle';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6">
      {/* Status Badge */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">AI Interviewer</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      {/* Avatar Container */}
      <div className="relative aspect-square bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl overflow-hidden">
        {/* Animated Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getStatusColor()} opacity-20 animate-pulse`}></div>

        {/* Avatar Face */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-48 h-48">
            {/* Head */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getStatusColor()} rounded-full shadow-2xl transform transition-transform duration-300 ${status === 'thinking' ? 'scale-105' : 'scale-100'}`}>
              {/* Face Container */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Eyes */}
                <div className="flex gap-8 mb-6">
                  {/* Left Eye */}
                  <div className="relative w-8 h-8 bg-white rounded-full shadow-inner">
                    <div 
                      className={`absolute top-1/2 left-1/2 w-4 h-4 bg-gray-900 rounded-full transition-all duration-200 ${isBlinking ? 'scale-y-0' : 'scale-y-100'}`}
                      style={{
                        transform: `translate(calc(-50% + ${eyePosition.x}px), calc(-50% + ${eyePosition.y}px)) ${isBlinking ? 'scaleY(0)' : 'scaleY(1)'}`
                      }}
                    >
                      <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  {/* Right Eye */}
                  <div className="relative w-8 h-8 bg-white rounded-full shadow-inner">
                    <div 
                      className={`absolute top-1/2 left-1/2 w-4 h-4 bg-gray-900 rounded-full transition-all duration-200 ${isBlinking ? 'scale-y-0' : 'scale-y-100'}`}
                      style={{
                        transform: `translate(calc(-50% + ${eyePosition.x}px), calc(-50% + ${eyePosition.y}px)) ${isBlinking ? 'scaleY(0)' : 'scaleY(1)'}`
                      }}
                    >
                      <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Mouth */}
                <div className="relative">
                  {mouthState === 'speaking' && (
                    <div className="w-12 h-8 bg-white rounded-full animate-pulse"></div>
                  )}
                  {mouthState === 'neutral' && (
                    <div className="w-12 h-1 bg-white rounded-full"></div>
                  )}
                  {mouthState === 'thinking' && (
                    <div className="w-8 h-1 bg-white rounded-full transform rotate-12"></div>
                  )}
                  {mouthState === 'analyzing' && (
                    <div className="w-10 h-6 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Audio Waves (when speaking) */}
            {status === 'speaking' && (
              <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-indigo-500 rounded-full animate-pulse"
                    style={{
                      height: `${20 + Math.random() * 20}px`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  ></div>
                ))}
              </div>
            )}

            {/* Listening Indicator */}
            {status === 'listening' && (
              <div className="absolute -left-12 top-1/2 transform -translate-y-1/2">
                <div className="w-8 h-8 bg-green-500 rounded-full animate-ping opacity-75"></div>
                <div className="absolute inset-0 w-8 h-8 bg-green-500 rounded-full"></div>
              </div>
            )}
          </div>
        </div>

        {/* Thinking Animation */}
        {status === 'thinking' && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-white rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        )}
      </div>

      {/* Status Description */}
      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm text-gray-600 text-center">
          {status === 'speaking' && "I'm asking you a question. Please listen carefully."}
          {status === 'listening' && "I'm listening to your answer. Take your time."}
          {status === 'thinking' && "Let me process what you just said..."}
          {status === 'analyzing' && "Analyzing your response for quality and depth..."}
          {status === 'idle' && "Ready for the next question."}
        </p>
      </div>
    </div>
  );
};

export default AIAvatar;
