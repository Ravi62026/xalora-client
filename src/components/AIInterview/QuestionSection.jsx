import { Play } from 'lucide-react';

const QuestionSection = ({ questionNumber, totalQuestions, question, timeRemaining, onStartRecording, isRecording }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeRemaining > 120) return 'text-green-400';
    if (timeRemaining > 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 py-6">
      {/* Interview Questions */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 shadow-xl">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Interview Questions</h3>
            <div className={`text-2xl font-bold ${getTimerColor()}`}>
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm text-slate-400 mb-3">Question {questionNumber} of {totalQuestions}</p>
          <p className="text-lg text-white leading-relaxed mb-6">{question}</p>

          {/* Audio Player */}
          <div className="flex items-center gap-3 bg-slate-700/50 p-3 rounded-lg">
            <button className="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-all">
              <Play className="w-5 h-5" />
            </button>
            <div className="flex-1 h-1 bg-slate-600 rounded-full"></div>
            <span className="text-xs text-slate-400">0:15 / 0:38</span>
          </div>
        </div>
      </div>

      {/* Your Answer */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 shadow-xl">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white">
          <h3 className="font-bold">Your Answer</h3>
        </div>

        <div className="p-6 min-h-[300px] flex flex-col items-center justify-center">
          {!isRecording ? (
            <>
              <button
                onClick={onStartRecording}
                className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all mb-4 text-4xl"
              >
                🎤
              </button>
              <p className="text-slate-300 text-center">Click microphone to start answering</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white shadow-lg mb-4 animate-pulse text-4xl">
                🎤
              </div>
              <p className="text-red-400 font-semibold">Recording...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionSection;
