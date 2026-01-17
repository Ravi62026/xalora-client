const ProgressBar = ({ current, total, round }) => {
  const progress = (current / total) * 100;

  return (
    <div className="bg-white/95 backdrop-blur-sm shadow-lg rounded-2xl p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{round}</h2>
            <p className="text-sm text-gray-600">
              Question {current} of {total}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {Math.round(progress)}%
            </p>
            <p className="text-xs text-gray-500">Complete</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full transition-all duration-500 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
          </div>
        </div>

        {/* Round Indicators */}
        <div className="mt-4 flex items-center justify-between">
          {['Resume', 'Formal', 'Technical', 'Behavioral', 'System Design'].map((r, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i === 2 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white scale-110' 
                  : i < 2 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-400'
              }`}>
                {i < 2 ? '✓' : i + 1}
              </div>
              <span className="text-xs text-gray-600 mt-1 hidden sm:block">{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
