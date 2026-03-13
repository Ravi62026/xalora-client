import { useState } from "react";
import { Download, FileUp, Loader2, Upload } from "lucide-react";
import organizationService from "../../services/organizationService";

export default function CandidateImportPanel({ orgId, onImported }) {
  const [file, setFile] = useState(null);
  const [loadingMode, setLoadingMode] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const downloadTemplate = async () => {
    setError("");
    try {
      const response = await organizationService.downloadCandidateTemplate(orgId);
      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/octet-stream",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = response.headers["content-disposition"] || "";
      const match = contentDisposition.match(/filename="?([^"]+)"?/i);
      link.download = match?.[1] || "candidate_template.csv";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to download template");
    }
  };

  const handleImport = async (mode) => {
    if (!file) {
      setError("Choose a CSV or XLSX file first");
      return;
    }

    setLoadingMode(mode);
    setError("");

    try {
      const response = await organizationService.importCompanyCandidates(orgId, file, mode);
      setResult(response.data);
      if (mode === "commit") {
        onImported?.();
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Import failed");
    } finally {
      setLoadingMode("");
    }
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Candidate Import</h3>
          <p className="text-sm text-gray-400">
            Download the template, fill candidate details, validate, then commit to send invites.
          </p>
        </div>

        <button
          type="button"
          onClick={downloadTemplate}
          className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20"
        >
          <Download className="h-4 w-4" />
          Download Template
        </button>
      </div>

      <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900/50 p-4">
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center">
          <FileUp className="h-6 w-6 text-emerald-400" />
          <span className="text-sm text-white">
            {file ? file.name : "Upload candidate CSV or XLSX"}
          </span>
          <span className="text-xs text-gray-500">
            Required: name, email, position. Optional: rounds, deadline
          </span>
          <input
            type="file"
            accept=".csv,.xlsx"
            className="hidden"
            onChange={(event) => {
              setFile(event.target.files?.[0] || null);
              setResult(null);
              setError("");
            }}
          />
        </label>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => handleImport("validate")}
          disabled={loadingMode !== ""}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-emerald-500/40 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingMode === "validate" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Validate File
        </button>

        <button
          type="button"
          onClick={() => handleImport("commit")}
          disabled={loadingMode !== ""}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingMode === "commit" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Import & Send Invites
        </button>
      </div>

      {result && (
        <div className="mt-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-5">
            <SummaryCard label="Total Rows" value={result.totalRows || 0} />
            <SummaryCard label="Valid" value={result.summary?.valid || 0} />
            <SummaryCard label="Invalid" value={result.summary?.invalid || 0} />
            <SummaryCard label="Skipped" value={result.summary?.skipped || 0} />
            <SummaryCard
              label="Sent"
              value={result.summary?.sent ?? "—"}
            />
          </div>

          <div className="max-h-72 overflow-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-gray-950 text-gray-400">
                <tr>
                  <th className="px-3 py-2">Row</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Position</th>
                  <th className="px-3 py-2">Rounds</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {(result.rows || []).map((row) => (
                  <tr key={row.rowNumber} className="bg-white/5 text-white">
                    <td className="px-3 py-2">{row.rowNumber}</td>
                    <td className="px-3 py-2">{row.name || "—"}</td>
                    <td className="px-3 py-2">{row.email || "—"}</td>
                    <td className="px-3 py-2">{row.position || "—"}</td>
                    <td className="px-3 py-2 text-xs">
                      {(row.interviewRounds || []).join(", ") || "—"}
                    </td>
                    <td className="px-3 py-2 capitalize">{row.status}</td>
                    <td className="px-3 py-2 text-gray-400">
                      {(row.issues || []).join(", ") || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-gray-900/50 p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}
