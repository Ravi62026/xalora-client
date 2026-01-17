const ProgressSection = ({ current, total, rounds }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mx-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Technical Round</h3>
        <span className="text-2xl font-bold text-purple-600">{percentage.toFixed(0)}%</span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">Question {current} of {total}</p>
      </div>

      {/* Round Indicators */}
      <div className="flex items-center justify-between">
        {rounds.map((round, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                idx < current
                  ? 'bg-green-500 text-white'
                  : idx === current - 1
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {idx < current ? '✓' : idx + 1}
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center">{round}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressSection;
