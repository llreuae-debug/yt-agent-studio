"use client";

import React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  onPasteSample?: () => void;
  showLineCount?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, onPasteSample, showLineCount = false, value, className = "", id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const lineCount = typeof value === "string" && value.length > 0
      ? value.split(/\r?\n/).length
      : 0;

    return (
      <div className="space-y-1.5 w-full">
        <div className="flex items-center justify-between">
          {label && (
            <label htmlFor={textareaId} className="type-label text-txt-2">
              {label}
            </label>
          )}
          <div className="flex items-center gap-2">
            {showLineCount && lineCount > 0 && (
              <span className="text-[11px] text-txt-2 type-tabular">
                {lineCount} lines
              </span>
            )}
            {onPasteSample && (
              <button
                type="button"
                onClick={onPasteSample}
                className="text-[11px] font-bold text-yt-red-text hover:underline cursor-pointer"
              >
                Paste sample
              </button>
            )}
            {hint && <span className="text-[11px] text-txt-2">{hint}</span>}
          </div>
        </div>
        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          className={`w-full rounded-input bg-surface-2 border border-line p-3.5 text-sm text-txt placeholder:text-txt-2/60 focus:outline-none focus:border-yt-red focus:ring-2 focus:ring-yt-red/20 focus:shadow-glow transition-all duration-200 leading-relaxed ${
            error ? "border-bad" : ""
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-bad">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
