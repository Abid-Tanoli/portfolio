import React, { useState, useRef } from "react";
import { api } from "../../lib/api";
import { Upload, X, Loader2, Image as ImageIcon, CheckCircle2 } from "lucide-react";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
  accept?: string;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value = "",
  onChange,
  label = "Upload Image / Asset",
  folder = "portfolio",
  accept = "image/*,application/pdf",
  className = "",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      const res = await api.uploadFile(file, folder);
      onChange(res.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const isPdf = value.endsWith(".pdf") || value.includes("application/pdf");

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">{label}</label>}

      {value ? (
        <div className="relative rounded-xl border border-slate-700 bg-slate-800/80 p-3 flex items-center gap-4 group">
          {isPdf ? (
            <div className="w-16 h-16 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex flex-col items-center justify-center text-indigo-400">
              <span className="font-bold text-xs uppercase">PDF</span>
            </div>
          ) : (
            <img
              src={value}
              alt="Preview"
              className="w-16 h-16 rounded-lg object-cover bg-slate-900 border border-slate-700"
            />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Asset Uploaded & Linked</span>
            </div>
            <p className="text-xs text-slate-400 truncate font-mono">{value}</p>
          </div>

          <button
            type="button"
            onClick={() => onChange("")}
            className="p-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
            isDragOver
              ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
              : "border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600 text-slate-400"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium py-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Uploading asset...</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-slate-700/60 flex items-center justify-center text-slate-300 mb-1">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-slate-200">
                Click to browse or drag & drop file here
              </p>
              <p className="text-xs text-slate-500">
                Supports PNG, JPG, WEBP, SVG, PDF up to 5MB
              </p>
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
    </div>
  );
};
