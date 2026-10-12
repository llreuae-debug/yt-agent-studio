"use client";

import { useState, useRef } from "react";
import { Upload, FileText, X } from "lucide-react";

interface TranscriptInputProps {
  value: string;
  onChange: (val: string, filename?: string) => void;
  label?: string;
  placeholder?: string;
}

export function TranscriptInput({
  value,
  onChange,
  label = "Transcript (.srt, .vtt, or Whisper .json)",
  placeholder = "Paste timestamped transcript or drag & drop file...",
}: TranscriptInputProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      onChange(content, file.name);
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    setFileName(null);
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-primary" />
          <span>{label}</span>
        </label>
        <div className="flex items-center gap-2">
          {fileName && (
            <span className="flex items-center gap-1 text-[11px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
              <span>{fileName}</span>
              <button onClick={handleClear} className="hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Upload className="h-3 w-3" />
            <span>Upload file</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".srt,.vtt,.json,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => {
          setFileName(null);
          onChange(e.target.value);
        }}
        placeholder={placeholder}
        rows={6}
        className="w-full rounded-xl border border-border bg-background p-3 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
      />
    </div>
  );
}
