const RoleEvaluation = ({ roleSkills, codeAnalysis }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 py-6">
      {/* Role-Specific Evaluation */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 shadow-xl">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
          <h3 className="font-bold">Role-Specific Evaluation</h3>
        </div>

        <div className="p-6">
          {/* Radar Chart Placeholder */}
          <div className="mb-6">
            <svg viewBox="0 0 200 200" className="w-full h-48">
              {/* Grid circles */}
              {[1, 2, 3, 4, 5].map((i) => (
                <circle
                  key={`grid-${i}`}
                  cx="100"
                  cy="100"
                  r={(i * 100) / 5}
                  fill="none"
                  stroke="rgba(100, 200, 255, 0.1)"
                  strokeWidth="1"
                />
              ))}

              {/* Skill polygon */}
              <polygon
                points="100,30 150,70 140,140 60,140 50,70"
                fill="rgba(59, 130, 246, 0.3)"
                stroke="rgb(59, 130, 246)"
                strokeWidth="2"
              />

              {/* Labels */}
              <text x="100" y="20" textAnchor="middle" className="text-xs fill-slate-300">
                Sensors
              </text>
              <text x="160" y="75" textAnchor="middle" className="text-xs fill-slate-300">
                Protocols
              </text>
              <text x="100" y="160" textAnchor="middle" className="text-xs fill-slate-300">
                Data Flow
              </text>
              <text x="40" y="75" textAnchor="middle" className="text-xs fill-slate-300">
                Microcontrollers
              </text>
              <text x="100" y="100" textAnchor="middle" className="text-xs fill-slate-300 font-bold">
                IoT
              </text>
            </svg>
          </div>

          {/* Skill Metrics */}
          <div className="space-y-3">
            {roleSkills.map((skill, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-300 text-sm">{skill.name}</span>
                  <span className="text-cyan-400 font-bold text-sm">{skill.score}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    style={{ width: `${skill.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Feedback on Code */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 shadow-xl">
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-4 text-white">
          <h3 className="font-bold">AI Feedback on Code</h3>
        </div>

        <div className="p-6">
          <div className="bg-slate-900/50 rounded-lg p-4 mb-4 font-mono text-sm text-slate-300 max-h-48 overflow-y-auto">
            <pre>{codeAnalysis}</pre>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-slate-300">
              <span className="text-green-400">✓</span> Good implementation of ESP32 sensor integration
            </p>
            <p className="text-slate-300">
              <span className="text-yellow-400">⚠</span> Consider adding error handling for network failures
            </p>
            <p className="text-slate-300">
              <span className="text-blue-400">💡</span> Could optimize memory usage with buffer pooling
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleEvaluation;
