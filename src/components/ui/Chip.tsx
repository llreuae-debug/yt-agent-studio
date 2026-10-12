"use client";

import React from "react";
import { Check } from "lucide-react";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  count?: number | string;
  showCheck?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  active = false,
  count,
  showCheck = true,
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-xs font-medium transition-all duration-150 cursor-pointer select-none border ${
        active
          ? "bg-yt-red text-white border-yt-red shadow-sm"
          : "bg-surface-3 text-txt-2 border-line hover:text-txt hover:bg-surface-2"
      } ${className}`}
      {...props}
    >
      {active && showCheck && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
      <span>{children}</span>
      {count !== undefined && (
        <span
          className={`ml-1 px-1.5 py-0.2 rounded-pill text-[10px] font-bold ${
            active ? "bg-white/20 text-white" : "bg-surface-1 text-txt-2"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};
