"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";

interface TooltipInfoProps {
  text: string;
  className?: string;
}

export function TooltipInfo({ text, className = "" }: TooltipInfoProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible(!visible)}
        className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
        aria-label="Info"
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>

      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 rounded-lg border border-border bg-card p-2.5 text-xs text-muted-foreground shadow-xl z-50 pointer-events-none">
          <p className="leading-snug">{text}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-card" />
        </div>
      )}
    </div>
  );
}
