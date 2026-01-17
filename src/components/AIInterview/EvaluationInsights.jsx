const EvaluationInsights = ({ insights, chatTranscript }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 py-6">
      {/* Evaluation Insights */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 shadow-xl">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 text-white">
          <h3 className="font-bold">Evaluation Insights</h3>
        </div>

        <div className="p-6">
          <ul className="space-y-3">
            {insights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-cyan-400 text-lg mt-1">•</span>
                <span className="text-slate-300 text-sm leading-relaxed">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Chat Transcript */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 shadow-xl">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
          <h3 className="font-bold">Chat Transcript</h3>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto space-y-4">
          {chatTranscript.map((msg, idx) => (
            <div key={idx} className="text-sm">
              <div className="flex items-center justify-between mb-1">
                <span className={msg.role === 'Interviewer' ? 'text-blue-400 font-semibold' : 'text-green-400 font-semibold'}>
                  {msg.role}
                </span>
                <span className="text-slate-500 text-xs">{msg.time}</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">{msg.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EvaluationInsights;
