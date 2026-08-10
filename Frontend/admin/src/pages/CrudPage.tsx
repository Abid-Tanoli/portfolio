import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, Pencil, Trash2, RefreshCw, X, Loader2, Save, AlertTriangle } from "lucide-react";
import { api } from "../lib/api";
import { getResourceConfig, emptyRecord, type FieldConfig } from "../lib/crud";
import { Field } from "../components/ui/Field";
import { AdminHeader } from "../components/layout/AdminHeader";

interface RecordItem {
  _id: string;
  [key: string]: unknown;
}

export const CrudPage: React.FC = () => {
  const { resource } = useParams<{ resource: string }>();
  const config = getResourceConfig(resource ?? "");

  const [items, setItems] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<RecordItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [confirmDelete, setConfirmDelete] = useState<RecordItem | null>(null);

  const load = useCallback(async () => {
    if (!config) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<RecordItem[]>(config.endpoint);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load items");
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    if (config) void load();
  }, [config, load]);

  if (!config) {
    return (
      <div className="p-8">
        <AdminHeader title="Unknown Resource" />
        <p className="text-slate-400 mt-8">Resource not found.</p>
      </div>
    );
  }

  const openCreate = () => {
    setForm(emptyRecord(config));
    setEditing(null);
    setCreating(true);
  };

  const openEdit = (item: RecordItem) => {
    setForm({ ...item });
    setEditing(item);
    setCreating(false);
  };

  const closeForm = () => {
    setEditing(null);
    setCreating(false);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      if (creating) {
        await api.post(config.endpoint, form);
      } else if (editing) {
        await api.put(`${config.endpoint}/${editing._id}`, form);
      }
      closeForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirmDelete) return;
    setSaving(true);
    try {
      await api.delete(`${config.endpoint}/${confirmDelete._id}`);
      setConfirmDelete(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setSaving(false);
    }
  };

  const displayValue = (item: RecordItem, name: string) => {
    const value = item[name];
    if (name === "isFeatured" || name === "approved") return Boolean(value) ? "Yes" : "No";
    if (Array.isArray(value)) return value.length ? `${value.length} item${value.length > 1 ? "s" : ""}` : "—";
    return String(value ?? "—");
  };

  return (
    <div className="min-h-screen">
      <AdminHeader title={config.title} description={config.description} />

      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-slate-400">
              {items.length} record{items.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => void load()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {config.createLabel}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-left text-xs uppercase tracking-wider text-slate-500">
                  {config.columns.map((col) => (
                    <th key={col.name} className="px-4 py-3 font-semibold">
                      {col.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={config.columns.length + 1} className="px-4 py-10 text-center text-slate-500">
                      <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                      Loading records...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={config.columns.length + 1} className="px-4 py-10 text-center text-slate-500">
                      No records yet. Click &quot;{config.createLabel}&quot; to add the first one.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item._id} className="border-b border-slate-800/60 hover:bg-slate-800/40 transition-colors">
                      {config.columns.map((col) => (
                        <td key={col.name} className="px-4 py-3 text-slate-300">
                          {col.name === "isFeatured" || col.name === "approved" ? (
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                                Boolean(item[col.name])
                                  ? "bg-emerald-500/15 text-emerald-400"
                                  : "bg-slate-700/40 text-slate-500"
                              }`}
                            >
                              {Boolean(item[col.name]) ? "Yes" : "No"}
                            </span>
                          ) : (
                            displayValue(item, col.name)
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(item)}
                            className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-indigo-300 hover:border-indigo-500/40 transition-all cursor-pointer"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(item)}
                            className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {(creating || editing) && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-10">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-100">
                {creating ? `Add ${config.title.slice(0, -1)}` : `Edit ${config.title.slice(0, -1)}`}
              </h3>
              <button onClick={closeForm} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
              {config.fields.map((field: FieldConfig) => (
                <div key={field.name}>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    {field.label}
                    {field.required && <span className="text-red-400 ml-1">*</span>}
                  </label>
                  <Field
                    field={field}
                    value={form[field.name]}
                    onChange={(name, value) => setForm((prev) => ({ ...prev, [name]: value }))}
                  />
                  {field.help && <p className="mt-1 text-xs text-slate-500">{field.help}</p>}
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <p className="text-xs text-slate-500">Changes publish to the live site immediately.</p>
              <div className="flex gap-2">
                <button
                  onClick={closeForm}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => void save()}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50 cursor-pointer"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Delete record?</h3>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              This will permanently delete{" "}
              <span className="text-slate-200 font-semibold">
                {String(confirmDelete.name ?? confirmDelete.title ?? confirmDelete.degree ?? confirmDelete.role ?? confirmDelete._id)}
              </span>
              . This action cannot be undone.
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
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-500 disabled:opacity-50 cursor-pointer"
              >
                {saving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
