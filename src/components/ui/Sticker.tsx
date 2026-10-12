"use client";

import React from "react";

export type StickerVariant =
  | "strong"
  | "workable"
  | "weak"
  | "hot"
  | "neutral"
  | "red"
  | "ok"
  | "warn"
  | "bad";

export interface StickerProps extends React.HTMLAttributes<HTMLSpanElement> {
  label?: string;
  variant?: StickerVariant;
  rotate?: -3 | -2 | -1 | 0 | 1 | 2 | 3;
}

export const Sticker: React.FC<StickerProps> = ({
  label,
  variant = "hot",
  rotate = -2,
  className = "",
  children,
  ...props
}) => {
  const rotateClass = {
    "-3": "-rotate-3",
    "-2": "-rotate-2",
    "-1": "-rotate-1",
    "0": "rotate-0",
    "1": "rotate-1",
    "2": "rotate-2",
    "3": "rotate-3",
  }[rotate] || "-rotate-2";

  const aliasMap: Record<string, "strong" | "workable" | "weak" | "hot" | "neutral"> = {
    red: "hot",
    ok: "strong",
    warn: "workable",
    bad: "weak",
    strong: "strong",
    workable: "workable",
    weak: "weak",
    hot: "hot",
    neutral: "neutral",
  };

  const normalizedVariant = aliasMap[variant] || "hot";

  const variantStyles = {
    strong: "bg-ok text-white border-white shadow-[2px_2px_0px_rgba(0,0,0,0.6)]",
    workable: "bg-warn text-black border-black shadow-[2px_2px_0px_rgba(0,0,0,0.6)]",
    weak: "bg-bad text-white border-white shadow-[2px_2px_0px_rgba(0,0,0,0.6)]",
    hot: "bg-yt-red text-white border-white shadow-[2px_2px_0px_rgba(0,0,0,0.7)]",
    neutral: "bg-surface-3 text-txt border-line shadow-[2px_2px_0px_rgba(0,0,0,0.4)]",
  }[normalizedVariant];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-pill text-[11px] font-black uppercase tracking-wider border-2 select-none transform ${rotateClass} ${variantStyles} ${className}`}
      {...props}
    >
      {label || children}
    </span>
  );
};
