import { useEffect, useState } from "react";
import { Download, FileUp, Loader2, Upload, Calendar } from "lucide-react";
import organizationService from "../../services/organizationService";

export default function CandidateImportPanel({ orgId, onImported }) {
  const [file, setFile] = useState(null);
  const [deadline, setDeadline] = useState(7);
  const [loadingMode, setLoadingMode] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [trackingJobId, setTrackingJobId] = useState("");

  useEffect(() => {
    if (!trackingJobId) return undefined;

    let intervalId = null;

    const pollStatus = async () => {
      try {
        const response = await organizationService.getCompanyImportStatus(
          orgId,
          trackingJobId
        );
        const payload = response?.data || {};
        setResult(payload);

        if (payload.status === "completed") {
          setTrackingJobId("");
          onImported?.();
          return true;
        }

        if (payload.status === "failed") {
          setError(payload.error || "Import job failed");
          setTrackingJobId("");
          return true;
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to fetch import progress");
        setTrackingJobId("");
        return true;
      }

      return false;
    };

    pollStatus().then((done) => {
      if (done) return;
      intervalId = setInterval(async () => {
        const finished = await pollStatus();
        if (finished && intervalId) {
          clearInterval(intervalId);
        }
      }, 1500);
    });

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [orgId, trackingJobId, onImported]);

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
      console.log(`[CANDIDATE-IMPORT] ${mode === "validate" ? "Validating" : "Committing"} candidate import for ${file.name} (deadline: ${deadline} days)`);
      const response = await organizationService.importCompanyCandidates(orgId, file, mode, {
        track: mode === "commit",
        deadline,
      });

      const payload = response?.data || {};
      if (mode === "commit" && payload.tracking && payload.jobId) {
        setResult({
          status: "processing",
          progress: {
            processed: 0,
            total: payload.totalRows || 0,
          },
          summary: {
            sent: 0,
            sentNoEmail: 0,
            skipped: 0,
            failed: 0,
            invalid: 0,
          },
          rows: [],
        });
        setTrackingJobId(payload.jobId);
        return;
      }

      setResult(payload);
      
      if (mode === "commit") {
        const { summary = {} } = payload || {};
        const { sent = 0 } = summary;
        console.log(`[CANDIDATE-IMPORT-RESULT] 📧 Emails sent to ${sent} candidate(s)`);
        onImported?.();
      } else {
        console.log(`[CANDIDATE-IMPORT-RESULT] ✅ Validation completed`);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Import failed");
      console.error(`[CANDIDATE-IMPORT-ERROR] ❌ ${err?.response?.data?.message || "Import failed"}`, err);
    } finally {
      setLoadingMode("");
    }
  };

  const metrics = deriveCandidateMetrics(result);
  const droppedRows = (result?.rows || []).filter(
    (row) => row.status === "sent_no_email" || row.status === "failed"
  );

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Candidate Import</h3>
          <p className="text-sm text-gray-400">
            Download the template, keep email mandatory, and fill other candidate fields only if available.
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
            Required: email. Optional: name, position, rounds
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

      <div className="mt-4 rounded-xl border border-white/10 bg-gray-900/50 p-4">
        <label className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-emerald-400 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Interview Deadline</p>
            <p className="text-xs text-gray-500">
              Candidates must complete their interviews within this many days after accepting the invite.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={90}
              value={deadline}
              onChange={(e) => setDeadline(Math.max(1, Math.min(90, parseInt(e.target.value, 10) || 1)))}
              className="w-20 rounded-lg border border-emerald-500/30 bg-gray-800 px-3 py-2 text-center text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
            <span className="text-sm text-gray-400">days</span>
          </div>
        </label>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {trackingJobId && (
        <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          Import in progress: {metrics.processed}/{metrics.total} rows processed.
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => handleImport("validate")}
          disabled={loadingMode !== "" || Boolean(trackingJobId)}
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
          disabled={loadingMode !== "" || Boolean(trackingJobId)}
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
          <div className="grid gap-3 sm:grid-cols-6">
            <SummaryCard label="Processed" value={`${metrics.processed}/${metrics.total}`} />
            <SummaryCard label="Valid" value={metrics.valid} />
            <SummaryCard label="Invalid" value={metrics.invalid} />
            <SummaryCard label="Skipped" value={metrics.skipped} />
            <SummaryCard label="Sent" value={metrics.sent} />
            <SummaryCard label="Sent No Email" value={metrics.sentNoEmail} />
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

          {droppedRows.length > 0 && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <h4 className="text-sm font-semibold text-amber-300">
                Delivery Issues ({droppedRows.length})
              </h4>
              <p className="mt-1 text-xs text-amber-200/80">
                These invites were created, but email delivery did not complete.
              </p>
              <div className="mt-3 max-h-56 overflow-auto rounded-lg border border-amber-400/20">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-amber-950/80 text-amber-200">
                    <tr>
                      <th className="px-3 py-2">Row</th>
                      <th className="px-3 py-2">Email</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-400/10">
                    {droppedRows.map((row) => (
                      <tr key={`drop-${row.rowNumber}`} className="text-amber-100">
                        <td className="px-3 py-2">{row.rowNumber}</td>
                        <td className="px-3 py-2">{row.email || "—"}</td>
                        <td className="px-3 py-2 capitalize">{row.status}</td>
                        <td className="px-3 py-2">
                          {(row.issues || []).join(", ") || "No details provided"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function deriveCandidateMetrics(result) {
  const rows = result?.rows || [];
  const summary = result?.summary || {};
  const progress = result?.progress || {};

  const countByStatus = (status) =>
    rows.filter((row) => String(row.status || "").toLowerCase() === status).length;

  const total =
    progress.total ??
    result?.totalRows ??
    rows.length;

  const processed =
    progress.processed ??
    (summary.sent || 0) +
      (summary.sentNoEmail || 0) +
      (summary.failed || 0) +
      (summary.invalid || 0);

  const valid =
    summary.valid ??
    countByStatus("valid") +
      countByStatus("sent") +
      countByStatus("sent_no_email") +
      countByStatus("failed");

  const invalid =
    summary.invalid ??
    countByStatus("invalid");

  const skipped =
    summary.skipped ??
    countByStatus("skipped");

  const sent =
    summary.sent ??
    countByStatus("sent");

  const sentNoEmail =
    summary.sentNoEmail ??
    countByStatus("sent_no_email");

  return {
    total,
    processed,
    valid,
    invalid,
    skipped,
    sent,
    sentNoEmail,
  };
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-gray-900/50 p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}
