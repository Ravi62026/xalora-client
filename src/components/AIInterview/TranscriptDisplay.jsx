import { Mic, MicOff } from 'lucide-react';

const TranscriptDisplay = ({ transcript, isRecording, onStartRecording, onStopRecording }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Answer</h3>

      {/* Microphone Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={isRecording ? onStopRecording : onStartRecording}
          className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${
            isRecording 
              ? 'bg-gradient-to-br from-red-500 to-pink-500 animate-pulse shadow-2xl' 
              : 'bg-gradient-to-br from-indigo-600 to-purple-600 hover:shadow-2xl'
          }`}
        >
          {isRecording ? (
            <MicOff className="w-10 h-10 text-white" />
          ) : (
            <Mic className="w-10 h-10 text-white" />
          )}
          
          {/* Recording Rings */}
          {isRecording && (
            <>
              <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-75"></div>
              <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-50" style={{ animationDelay: '0.5s' }}></div>
            </>
          )}
        </button>
      </div>

      <p className="text-center text-sm text-gray-600 mb-4">
        {isRecording ? (
          <span className="text-red-600 font-semibold animate-pulse">
            🔴 Recording... Click to stop
          </span>
        ) : (
          <span>
            Click the microphone to start answering
          </span>
        )}
      </p>

      {/* Transcript Box */}
      <div className={`min-h-[200px] p-4 rounded-xl border-2 transition-all ${
        transcript 
          ? 'bg-white border-indigo-200' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        {transcript ? (
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {transcript}
            <span className="inline-block w-1 h-5 bg-indigo-600 animate-pulse ml-1"></span>
          </p>
        ) : (
          <p className="text-gray-400 italic text-center mt-16">
            Your speech will appear here in real-time...
          </p>
        )}
      </div>

      {/* Audio Visualization */}
      {isRecording && (
        <div className="mt-4 flex items-center justify-center gap-1 h-16">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-full animate-pulse"
              style={{
                height: `${20 + Math.random() * 40}px`,
                animationDelay: `${i * 0.05}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Word Count */}
      {transcript && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>Words: {transcript.split(' ').filter(w => w).length}</span>
          <span>Characters: {transcript.length}</span>
        </div>
      )}
    </div>
  );
};

export default TranscriptDisplay;
