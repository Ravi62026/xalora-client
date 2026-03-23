import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  FileSpreadsheet,
  Loader2,
  RefreshCw,
} from "lucide-react";
import organizationService from "../../services/organizationService";

const statusBadge = (status) => {
  const map = {
    completed: "bg-emerald-500/20 text-emerald-400",
    processing: "bg-yellow-500/20 text-yellow-400",
    failed: "bg-red-500/20 text-red-400",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${map[status] || "bg-gray-700 text-gray-300"}`}
    >
      {status === "processing" && (
        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
      )}
      {status}
    </span>
  );
};

export default function ImportHistoryTable({ orgId }) {
  const [batches, setBatches] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchHistory = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const res = await organizationService.getCompanyImportHistory(orgId, {
        page,
        limit: 10,
      });
      setBatches(res.data?.batches || []);
      setPagination(res.data?.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      console.error("Failed to load import history:", err);
    } finally {
      setLoading(false);
    }
  }, [orgId, page]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  if (loading && batches.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (!loading && batches.length === 0) {
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 text-center">
        <FileSpreadsheet className="mx-auto mb-3 h-10 w-10 text-gray-600" />
        <p className="text-sm text-gray-400">No import history yet.</p>
        <p className="mt-1 text-xs text-gray-500">
          Upload a CSV to import candidates and history will appear here.
        </p>
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-semibold text-white">
          <Clock className="h-4 w-4 text-emerald-400" />
          Import History
        </h3>
        <button
          type="button"
          onClick={fetchHistory}
          disabled={loading}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-700 px-2 py-1 text-xs text-gray-300 hover:border-emerald-500/40 hover:text-emerald-300 disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-xs uppercase text-gray-500">
              <th className="px-3 py-2">File</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Uploaded By</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2">Sent</th>
              <th className="px-3 py-2">Failed</th>
              <th className="px-3 py-2">Skipped</th>
              <th className="px-3 py-2">Invalid</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch) => (
              <tr
                key={batch._id}
                className="border-b border-gray-800/50 text-gray-300 hover:bg-gray-800/30"
              >
                <td className="max-w-[160px] truncate px-3 py-2 font-medium text-white">
                  {batch.filename}
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-xs text-gray-400">
                  {new Date(batch.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-3 py-2 text-xs">
                  {batch.uploadedBy?.name || batch.uploadedBy?.email || "—"}
                </td>
                <td className="px-3 py-2 text-center">{batch.totalRows}</td>
                <td className="px-3 py-2 text-center text-emerald-400">
                  {batch.sent}
                </td>
                <td className="px-3 py-2 text-center text-red-400">
                  {batch.failed}
                </td>
                <td className="px-3 py-2 text-center text-yellow-400">
                  {batch.skipped}
                </td>
                <td className="px-3 py-2 text-center text-orange-400">
                  {batch.invalid}
                </td>
                <td className="px-3 py-2">{statusBadge(batch.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
          <span>
            Page {pagination.page} of {pagination.totalPages} ({pagination.total}{" "}
            total)
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded border border-gray-700 p-1 hover:border-emerald-500/40 disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded border border-gray-700 p-1 hover:border-emerald-500/40 disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
