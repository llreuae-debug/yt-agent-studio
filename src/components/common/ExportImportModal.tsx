"use client";

import { useState } from "react";
import { X, Download, Upload, Check, AlertCircle } from "lucide-react";
import { exportAllDataAsJson, importAllDataFromJson, downloadFile } from "@/lib/storage";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportImportModal({ isOpen, onClose }: ExportImportModalProps) {
  const [jsonInput, setJsonInput] = useState("");
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const data = exportAllDataAsJson();
    downloadFile(`yt-agent-studio-backup-${new Date().toISOString().slice(0, 10)}.json`, data, "application/json");
    setStatusMessage({ type: "success", text: "Exported studio data as JSON file!" });
  };

  const handleImport = () => {
    if (!jsonInput.trim()) return;
    const res = importAllDataFromJson(jsonInput);
    if (res.success) {
      setStatusMessage({ type: "success", text: "Successfully imported voice profile and history! Reloading..." });
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } else {
      setStatusMessage({ type: "error", text: res.error || "Failed to parse JSON backup." });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative z-50 w-full max-w-lg rounded-card liquid-glass border border-line p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h3 className="type-h3 font-black text-txt">Backup &amp; Restore</h3>
            <p className="type-small text-txt-2">Export or restore your Voice Profile &amp; run history</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-pill p-1.5 text-txt-2 hover:bg-surface-3 hover:text-txt transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {statusMessage && (
          <div
            className={`mt-4 flex items-center gap-2 rounded-input p-3 text-xs font-bold ${
              statusMessage.type === "success"
                ? "bg-ok/10 text-ok border border-ok/30"
                : "bg-bad/10 text-bad border border-bad/30"
            }`}
          >
            {statusMessage.type === "success" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="mt-6 space-y-6">
          {/* Export Section */}
          <div className="rounded-input border border-line bg-surface-2 p-4 space-y-3">
            <div>
              <h4 className="type-label font-bold text-txt">EXPORT DATA</h4>
              <p className="type-small text-txt-2 mt-0.5">
                Download your complete studio state (Voice Profile and all module run history) as a single JSON file.
              </p>
            </div>
            <Button
              onClick={handleExport}
              size="sm"
            >
              <Download className="h-4 w-4" />
              <span>Download JSON Backup</span>
            </Button>
          </div>

          {/* Import Section */}
          <div className="rounded-input border border-line bg-surface-2 p-4 space-y-3">
            <div>
              <h4 className="type-label font-bold text-txt">IMPORT DATA</h4>
              <p className="type-small text-txt-2 mt-0.5">
                Upload a previously exported backup file or paste its JSON content below.
              </p>
            </div>

            <div>
              <label className="inline-flex items-center gap-1.5 rounded-pill bg-surface-3 border border-line px-3 py-1.5 text-xs font-bold text-txt hover:bg-surface-2 cursor-pointer transition-colors">
                <Upload className="h-3.5 w-3.5 text-yt-red" />
                <span>Upload .json file</span>
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Or paste backup JSON text here..."
              rows={4}
            />

            <Button
              onClick={handleImport}
              disabled={!jsonInput.trim()}
              variant="secondary"
              size="sm"
            >
              <Upload className="h-4 w-4" />
              <span>Restore from JSON</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
