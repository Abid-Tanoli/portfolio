import React, { useCallback, useEffect, useState } from "react";
import {
  Mail,
  MailOpen,
  Trash2,
  Loader2,
  RefreshCw,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { api } from "../lib/api";
import { AdminHeader } from "../components/layout/AdminHeader";

interface Submission {
  _id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: string;
  read: boolean;
}

interface SubmissionsResponse {
  submissions: Submission[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  unread: number;
}

const PAGE_SIZE = 20;

export const ContactSubmissionsPage: React.FC = () => {
  const [data, setData] = useState<SubmissionsResponse | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Submission | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<SubmissionsResponse>(
        `/contact-submissions?page=${page}&limit=${PAGE_SIZE}`
      );
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void load();
  }, [load]);

  const markRead = async (submission: Submission) => {
    setBusy(true);
    setError(null);
    try {
      await api.patch(`/contact-submissions/${submission._id}/read`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update message");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirmDelete) return;
    setBusy(true);
    setError(null);
    try {
      await api.delete(`/contact-submissions/${confirmDelete._id}`);
      setConfirmDelete(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete message");
    } finally {
      setBusy(false);
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return iso;
    }
  };

  const pagination = data?.pagination;
  const items = data?.submissions ?? [];

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Contact Form Messages"
        description="Read-only list of submissions from the public contact form"
      />

      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-400">
            {data ? (
              <>
                {data.pagination.total} total
                {data.unread > 0 && (
                  <span className="ml-2 inline-flex px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold">
                    {data.unread} unread
                  </span>
                )}
              </>
            ) : (
              "Loading..."
            )}
          </p>
          <button
            onClick={() => void load()}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
          {loading ? (
            <div className="flex items-center gap-2 text-slate-400 text-sm py-16 justify-center">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading messages...
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-sm">
              No contact form submissions yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {items.map((item) => (
                <div key={item._id} className="px-6 py-4 flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${
                      item.read
                        ? "bg-slate-800 border-slate-700 text-slate-500"
                        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    }`}
                  >
                    {item.read ? (
                      <MailOpen className="w-5 h-5" />
                    ) : (
                      <Mail className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="font-semibold text-slate-100">
                        {item.name}
                        <span className="ml-2 text-xs font-normal text-slate-500">
                          {item.email}
                        </span>
                      </p>
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {formatDate(item.submittedAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-300 whitespace-pre-wrap break-words">
                      {item.message}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      {!item.read && (
                        <button
                          onClick={() => void markRead(item)}
                          disabled={busy}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 text-xs font-medium hover:bg-slate-800 hover:text-white transition-all cursor-pointer disabled:opacity-50"
                        >
                          <MailOpen className="w-3.5 h-3.5" />
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => setConfirmDelete(item)}
                        disabled={busy}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/10 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {pagination && pagination.pages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Page {pagination.page} of {pagination.pages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 text-sm hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page >= pagination.pages}
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 text-sm hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Delete message?</h3>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              This will permanently delete the message from{" "}
              <span className="text-slate-200 font-semibold">{confirmDelete.name}</span>.
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => void remove()}
                disabled={busy}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-500 disabled:opacity-50 cursor-pointer"
              >
                {busy ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};