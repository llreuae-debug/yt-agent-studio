"use client";

import { useEffect, useState } from "react";
import { X, Trash2, Clock, CheckCircle2, Copy } from "lucide-react";
import { getHistory, deleteHistoryRun, HistoryRun } from "@/lib/storage";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRun?: (run: HistoryRun) => void;
}

export function HistoryDrawer({ isOpen, onClose, onSelectRun }: HistoryDrawerProps) {
  const [history, setHistory] = useState<HistoryRun[]>([]);

  useEffect(() => {
    if (isOpen) {
      setHistory(getHistory());
    }
  }, [isOpen]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteHistoryRun(id);
    setHistory(getHistory());
  };

  const handleDuplicate = (run: HistoryRun, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(JSON.stringify(run.outputData, null, 2));
    alert("Copied run data to clipboard!");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      {/* Drawer */}
      <div className="relative z-50 flex h-full w-full max-w-md flex-col border-l border-line bg-surface-1 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h3 className="type-h3 font-black text-txt">Studio History</h3>
            <p className="type-small text-txt-2">Past module executions saved locally</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-pill p-1.5 text-txt-2 hover:bg-surface-3 hover:text-txt transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Clock className="h-10 w-10 text-txt-2/40 mb-2" />
              <p className="type-body font-bold text-txt">No runs in history</p>
              <p className="type-small text-txt-2 mt-1">
                Completed runs appear here when you generate or ship outputs.
              </p>
            </div>
          ) : (
            history.map((run) => (
              <div
                key={run.id}
                onClick={() => {
                  if (onSelectRun) onSelectRun(run);
                }}
                className="group flex flex-col rounded-card border border-line bg-surface-2 p-4 hover:border-yt-red transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-1.5 type-label font-bold text-yt-red">
                    <span>{run.module}</span>
                    {run.status === "shipped" && (
                      <span className="flex items-center gap-0.5 text-ok font-normal">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Shipped</span>
                      </span>
                    )}
                  </div>
                  <span className="type-tabular text-[10px] text-txt-2 font-mono">
                    {new Date(run.timestamp).toLocaleDateString()} {new Date(run.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                <p className="type-body text-txt line-clamp-2 font-medium mb-3">
                  {run.inputSummary || "Module execution run"}
                </p>

                <div className="flex items-center justify-between border-t border-line pt-2 text-xs">
                  <span className="type-label text-[10px] text-txt-2">Click to inspect</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDuplicate(run, e)}
                      className="text-txt-2 hover:text-txt p-1 transition-colors"
                      title="Copy payload"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(run.id, e)}
                      className="text-txt-2 hover:text-bad p-1 transition-colors"
                      title="Delete run"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
