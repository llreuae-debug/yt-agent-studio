"use client";

import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <div className="flex items-center justify-between">
            <label htmlFor={inputId} className="type-label text-txt-2">
              {label}
            </label>
            {hint && <span className="text-[11px] text-txt-2">{hint}</span>}
          </div>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-input bg-surface-2 border border-line px-4 py-2.5 text-sm text-txt placeholder:text-txt-2/60 focus:outline-none focus:border-yt-red focus:ring-2 focus:ring-yt-red/20 focus:shadow-glow transition-all duration-200 ${
              error ? "border-bad" : ""
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-bad">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
