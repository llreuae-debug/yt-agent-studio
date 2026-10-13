"use client";

import React, { useState } from "react";
import { Check, Copy, X } from "lucide-react";
import { isRTL } from "@/lib/youtube-utils";

export interface TagChipProps {
  tag: string;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: (tag: string) => void;
  onRemove?: (tag: string) => void;
  onCopy?: (tag: string) => void;
  badge?: string | number;
  showCopyOnClick?: boolean;
  className?: string;
  size?: "sm" | "md";
}

export const TagChip: React.FC<TagChipProps> = ({
  tag,
  selectable = false,
  selected = false,
  onToggleSelect,
  onRemove,
  onCopy,
  badge,
  showCopyOnClick = true,
  className = "",
  size = "md",
}) => {
  const [copied, setCopied] = useState(false);
  const rtl = isRTL(tag);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(tag);
      setCopied(true);
      if (onCopy) onCopy(tag);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Fallback
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (selectable && onToggleSelect) {
      onToggleSelect(tag);
    } else if (showCopyOnClick) {
      handleCopy(e);
    }
  };

  const sizeClasses =
    size === "sm"
      ? "text-xs px-2.5 py-1 gap-1.5"
      : "text-xs md:text-sm px-3.5 py-1.5 gap-2";

  return (
    <div
      onClick={handleClick}
      dir={rtl ? "rtl" : "ltr"}
      className={`group inline-flex items-center rounded-pill font-medium transition-all duration-150 cursor-pointer select-none border ${
        selected
          ? "bg-yt-red/15 text-txt border-yt-red shadow-sm"
          : "bg-surface-2 text-txt border-line hover:border-txt-3/30 hover:bg-surface-3"
      } ${sizeClasses} ${className}`}
      title={selectable ? `Click to ${selected ? "deselect" : "select"}` : "Click to copy tag"}
    >
      {selectable && (
        <span
          className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-colors border ${
            selected
              ? "bg-yt-red border-yt-red text-white"
              : "border-line bg-surface-1 group-hover:border-txt-2"
          }`}
        >
          {selected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
        </span>
      )}

      <span className={`${rtl ? "font-sans text-right" : ""}`}>
        {tag}
      </span>

      {badge !== undefined && (
        <span
          className={`px-1.5 py-0.5 rounded-pill text-[10px] font-bold ${
            selected
              ? "bg-yt-red text-white"
              : "bg-surface-1 text-txt-2 group-hover:text-txt"
          }`}
        >
          {badge}
        </span>
      )}

      {showCopyOnClick && !selectable && !onRemove && (
        <button
          type="button"
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-full hover:bg-surface-1 text-txt-2 hover:text-txt"
          title="Copy tag"
          aria-label={`Copy tag ${tag}`}
        >
          {copied ? (
            <Check className="w-3 h-3 text-ok" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </button>
      )}

      {copied && (
        <span className="text-[10px] font-bold text-ok flex items-center gap-0.5">
          <Check className="w-3 h-3 stroke-[3]" /> Copied!
        </span>
      )}

      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(tag);
          }}
          className="p-0.5 rounded-full hover:bg-bad/20 hover:text-bad text-txt-3 transition-colors ml-0.5"
          title="Delete tag"
          aria-label={`Delete tag ${tag}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
