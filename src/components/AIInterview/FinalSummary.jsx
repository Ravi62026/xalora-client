const FinalSummary = ({ summary }) => {
  return (
    <div className="px-6 py-6">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 shadow-xl">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white">
          <h3 className="font-bold">Final AI Summary Report</h3>
        </div>

        <div className="p-6">
          <p className="text-slate-300 leading-relaxed">{summary}</p>
        </div>
      </div>
    </div>
  );
};

export default FinalSummary;
