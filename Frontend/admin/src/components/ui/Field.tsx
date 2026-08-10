import React from "react";
import { ImageUploader } from "./ImageUploader";
import type { FieldConfig } from "../../lib/crud";

export interface FieldProps {
  field: FieldConfig;
  value: unknown;
  onChange: (name: string, value: unknown) => void;
}

const baseInputClass =
  "w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 transition-all";

export const Field: React.FC<FieldProps> = ({ field, value, onChange }) => {
  const listValue = Array.isArray(value) ? (value as unknown[]) : [];

  const handleListChange = (index: number, text: string) => {
    const next = [...listValue];
    next[index] = text;
    onChange(field.name, next);
  };

  const handleLinksChange = (index: number, key: "label" | "url", text: string) => {
    const next = listValue.map((item) => ({ ...(item as object) }));
    (next[index] as Record<string, string>)[key] = text;
    onChange(field.name, next);
  };

  switch (field.type) {
    case "textarea":
      return (
        <textarea
          className={`${baseInputClass} min-h-24 resize-y font-mono`}
          placeholder={field.placeholder}
          value={String(value ?? "")}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );

    case "number":
      return (
        <input
          type="number"
          className={baseInputClass}
          value={Number(value ?? 0)}
          onChange={(e) => onChange(field.name, Number(e.target.value))}
        />
      );

    case "select":
      return (
        <select
          className={`${baseInputClass} cursor-pointer`}
          value={String(value ?? "")}
          onChange={(e) => onChange(field.name, e.target.value)}
        >
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    case "boolean":
      return (
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(field.name, e.target.checked)}
            className="w-4 h-4 accent-indigo-500"
          />
          <span className="text-sm text-slate-300">Enabled</span>
        </label>
      );

    case "stringList":
      return (
        <div className="space-y-2">
          {listValue.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={baseInputClass}
                value={String(item)}
                onChange={(e) => handleListChange(i, e.target.value)}
              />
              <button
                type="button"
                onClick={() => onChange(field.name, listValue.filter((_, j) => j !== i))}
                className="px-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 cursor-pointer"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange(field.name, [...listValue, ""])}
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer"
          >
            + Add item
          </button>
        </div>
      );

    case "linkList":
      return (
        <div className="space-y-2">
          {listValue.map((item, i) => {
            const link = item as { label?: string; url?: string };
            return (
              <div key={i} className="flex gap-2">
                <input
                  className={baseInputClass}
                  placeholder="Label"
                  value={link.label ?? ""}
                  onChange={(e) => handleLinksChange(i, "label", e.target.value)}
                />
                <input
                  className={baseInputClass}
                  placeholder="URL"
                  value={link.url ?? ""}
                  onChange={(e) => handleLinksChange(i, "url", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => onChange(field.name, listValue.filter((_, j) => j !== i))}
                  className="px-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            );
          })}
          <button
            type="button"
            onClick={() => onChange(field.name, [...listValue, { label: "", url: "" }])}
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer"
          >
            + Add link
          </button>
        </div>
      );

    case "image":
      return (
        <ImageUploader
          value={String(value ?? "")}
          onChange={(url) => onChange(field.name, url)}
          folder={field.folder ?? "portfolio"}
        />
      );

    default:
      return (
        <input
          type="text"
          className={baseInputClass}
          placeholder={field.placeholder}
          value={String(value ?? "")}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );
  }
};
