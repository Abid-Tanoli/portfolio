import React, { useEffect, useState } from "react";
import { Loader2, Save, AlertTriangle, CheckCircle2 } from "lucide-react";
import { api } from "../lib/api";
import { AdminHeader } from "../components/layout/AdminHeader";
import { Field, type FieldProps } from "../components/ui/Field";

interface ProfileRecord {
  [key: string]: unknown;
}

const profileFields = [
  { name: "name", label: "Full Name", type: "text", required: true },
  { name: "firstName", label: "First Name", type: "text", required: true },
  { name: "title", label: "Title", type: "text", required: true },
  { name: "tagline", label: "Tagline", type: "text", required: true },
  { name: "email", label: "Email", type: "text", required: true },
  { name: "phone", label: "Phone", type: "text", required: true },
  { name: "phoneDisplay", label: "Phone (display)", type: "text", required: true },
  { name: "location", label: "Location", type: "text", required: true },
  { name: "github", label: "GitHub URL", type: "text", required: true },
  { name: "githubUsername", label: "GitHub Username", type: "text", required: true },
  { name: "linkedin", label: "LinkedIn URL", type: "text", help: "Leave empty if pending" },
  { name: "linkedinPending", label: "LinkedIn URL pending", type: "boolean" },
  { name: "resumeUrl", label: "Resume URL", type: "text" },
  { name: "profilePictureUrl", label: "Profile Picture", type: "image", folder: "profile" },
  { name: "heroSublines", label: "Hero Sublines (typewriter)", type: "stringList", help: "One subline per line" },
  { name: "heroSummary", label: "Hero Summary", type: "textarea", required: true },
  { name: "aboutSummary", label: "About Summary Paragraphs", type: "stringList", help: "One paragraph per line" },
  { name: "careerGoals", label: "Career Goals", type: "textarea", required: true },
];

export const ProfilePage: React.FC = () => {
  const [form, setForm] = useState<ProfileRecord>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api
      .get<ProfileRecord>("/profile")
      .then((data) => {
        setForm(data ?? {});
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load profile");
        setLoading(false);
      });
  }, []);

  const save = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await api.put("/profile", form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      <AdminHeader title="Profile" description="Name, hero, about, and contact details" />

      <div className="p-8 max-w-3xl">
        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
        {saved && (
          <div className="mb-6 px-4 py-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Profile saved and published.
          </div>
        )}

        {loading ? (
          <div className="flex items-center gap-2 text-slate-400 text-sm py-16 justify-center">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading profile...
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-5">
            {profileFields.map((field) => (
              <div key={field.name}>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  {field.label}
                  {field.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                <Field
                  field={field as unknown as FieldProps["field"]}
                  value={form[field.name]}
                  onChange={(name, value) => setForm((prev) => ({ ...prev, [name]: value }))}
                />
                {field.help && <p className="mt-1 text-xs text-slate-500">{field.help}</p>}
              </div>
            ))}

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <p className="text-xs text-slate-500">Changes are published to the public site immediately.</p>
              <button
                onClick={() => void save()}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50 cursor-pointer"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
