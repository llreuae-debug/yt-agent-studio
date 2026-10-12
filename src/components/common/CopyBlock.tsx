"use client";

import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import { downloadFile } from "@/lib/storage";
import { auditNumbersInText } from "@/lib/numberCheck";
import { NumberWarningChip } from "./NumberWarningChip";

interface CopyBlockProps {
  content: string;
  filename?: string;
  title?: string;
  userInputs?: string[];
  toolOutputs?: string[];
  className?: string;
}

export function CopyBlock({
  content,
  filename = "yt-studio-output.md",
  title = "Output Block",
  userInputs = [],
  toolOutputs = [],
  className = "",
}: CopyBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleDownload = () => {
    downloadFile(filename, content, "text/markdown");
  };

  const auditedLines = auditNumbersInText(content, userInputs, toolOutputs);

  return (
    <div className={`rounded-card border border-line bg-surface-1 overflow-hidden shadow-md ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line bg-surface-2 px-5 py-3">
        <span className="type-label font-bold text-txt">{title}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-pill border border-line bg-surface-3 px-3 py-1.5 text-xs font-bold text-txt hover:bg-surface-2 transition-colors"
            title="Download as Markdown (.md)"
          >
            <Download className="h-3.5 w-3.5 text-txt-2" />
            <span className="hidden sm:inline">Export .md</span>
          </button>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 rounded-pill px-3.5 py-1.5 text-xs font-bold transition-all ${
              copied
                ? "bg-ok text-white shadow-glow"
                : "bg-grad-hot text-white shadow-glow hover:brightness-110 active:scale-95"
            }`}
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-white" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-white" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Body with line-by-line number check audit */}
      <div className="p-5 font-mono text-xs text-txt overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto selection:bg-yt-red/30">
        {auditedLines.map((item, idx) => (
          <div key={idx} className="flex flex-wrap items-center">
            <span>{item.line || " "}</span>
            {item.hasWarning && <NumberWarningChip unknownNumbers={item.unknownNumbers} />}
          </div>
        ))}
      </div>
    </div>
  );
}
