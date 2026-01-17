const InterviewHeader = ({ title, duration, round, questionNumber, totalQuestions }) => {
  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-sm text-slate-400 mt-1">
            {round} • Question {questionNumber} of {totalQuestions}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">Duration</p>
          <p className="text-2xl font-bold text-cyan-400">{duration}</p>
        </div>
      </div>
    </div>
  );
};

export default InterviewHeader;
