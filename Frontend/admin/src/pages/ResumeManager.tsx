import React, { useEffect, useState } from "react";
import {
  Loader2,
  Save,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  FileText,
  Trash2,
  RefreshCw,
  Database,
} from "lucide-react";
import { api } from "../lib/api";
import { AdminHeader } from "../components/layout/AdminHeader";
import { ImageUploader } from "../components/ui/ImageUploader";

interface ProfileRecord {
  resumeUrl?: string;
  resumeUpdatedAt?: string;
  [key: string]: unknown;
}

interface RegenerateResponse {
  resumeUrl: string;
  updatedAt: string;
  warning?: string;
}

export const ResumeManager: React.FC = () => {
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeUpdatedAt, setResumeUpdatedAt] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [regenerateMsg, setRegenerateMsg] = useState<{ type: "success" | "warning"; text: string } | null>(null);

  useEffect(() => {
    api
      .get<ProfileRecord>("/profile")
      .then((data) => {
        setResumeUrl(String(data?.resumeUrl ?? ""));
        setResumeUpdatedAt(
          typeof data?.resumeUpdatedAt === "string" ? data.resumeUpdatedAt : null
        );
        setLoaded(true);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load profile");
        setLoaded(true);
      });
  }, []);

  const save = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    setRegenerateMsg(null);
    try {
      await api.put("/profile", { resumeUrl });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save resume");
    } finally {
      setSaving(false);
    }
  };

  const regenerate = async () => {
    setRegenerating(true);
    setError(null);
    setRegenerateMsg(null);
    try {
      const result = await api.post<RegenerateResponse>("/resume/regenerate");
      setResumeUrl(result.resumeUrl);
      setResumeUpdatedAt(result.updatedAt);
      setRegenerateMsg(
        result.warning
          ? { type: "warning", text: result.warning }
          : { type: "success", text: "PDF regenerated from site data and published." }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to regenerate resume");
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Resume Manager"
        description="Edit from site data or upload a PDF — changes publish to the public /resume page"
      />

      <div className="p-8 max-w-3xl space-y-6">
        {error && (
          <div className="px-4 py-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
        {saved && (
          <div className="px-4 py-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Resume published successfully.
          </div>
        )}
        {regenerateMsg && (
          <div
            className={`px-4 py-3 rounded-lg border text-sm flex items-center gap-2 ${
              regenerateMsg.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-amber-500/30 bg-amber-500/10 text-amber-400"
            }`}
          >
            {regenerateMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            {regenerateMsg.text}
          </div>
        )}

        {!loaded ? (
          <div className="flex items-center gap-2 text-slate-400 text-sm py-16 justify-center">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading resume...
          </div>
        ) : (
          <>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-200">
                    Generate PDF from site data
                  </h2>
                  <p className="text-xs text-slate-500">
                    Renders a fresh ATS-friendly PDF from Experience, Skills, Education,
                    Certifications, Projects, and Profile — then republishes it automatically.
                  </p>
                </div>
              </div>
              <button
                onClick={() => void regenerate()}
                disabled={regenerating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                {regenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                {regenerating ? "Regenerating PDF..." : "Regenerate PDF"}
              </button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Resume PDF
                </label>
                <ImageUploader
                  value={resumeUrl}
                  onChange={setResumeUrl}
                  label=""
                  folder="resume"
                  accept="application/pdf"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Or upload your own PDF — it is hosted in Cloudinary and linked to the profile.
                </p>
              </div>

              {resumeUrl && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-slate-700 bg-slate-800/60">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400">
                      Current resume
                      {resumeUpdatedAt
                        ? ` · published ${new Date(resumeUpdatedAt).toLocaleString()}`
                        : ""}
                    </p>
                    <p className="text-sm text-slate-200 font-mono truncate">{resumeUrl}</p>
                  </div>
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 hover:text-white transition-all"
                  >
                    Open PDF
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => setResumeUrl("")}
                    className="p-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                    title="Remove resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Changes are published to the public site immediately.
                </p>
                <button
                  onClick={() => void save()}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50 cursor-pointer"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Publish Resume
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};