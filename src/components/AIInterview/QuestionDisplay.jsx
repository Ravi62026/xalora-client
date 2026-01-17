import { Clock } from 'lucide-react';

const QuestionDisplay = ({ question, questionNumber, totalQuestions, timeRemaining }) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  
  const getTimerColor = () => {
    if (timeRemaining <= 30) return 'text-red-500';
    if (timeRemaining <= 120) return 'text-orange-500';
    return 'text-indigo-600';
  };

  const getTimerBgColor = () => {
    if (timeRemaining <= 30) return 'bg-red-50 border-red-200';
    if (timeRemaining <= 120) return 'bg-orange-50 border-orange-200';
    return 'bg-indigo-50 border-indigo-200';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-sm text-gray-500">Question</span>
          <h3 className="text-2xl font-bold text-gray-900">
            {questionNumber} / {totalQuestions}
          </h3>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${getTimerBgColor()}`}>
          <Clock className={`w-5 h-5 ${getTimerColor()}`} />
          <span className={`text-xl font-bold ${getTimerColor()}`}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Question Text */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-l-4 border-indigo-600">
        <p className="text-lg text-gray-800 leading-relaxed">
          {question}
        </p>
      </div>

      {/* Audio Player (Placeholder) */}
      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center transition-colors">
            ▶️
          </button>
          <div className="flex-1">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full animate-pulse" style={{ width: '40%' }}></div>
            </div>
          </div>
          <span className="text-sm text-gray-500">0:15 / 0:38</span>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          🔊 Listen to the question audio
        </p>
      </div>
    </div>
  );
};

export default QuestionDisplay;
