"use client";

import React, { useEffect, useState } from "react";
import { Check, AlertTriangle, AlertCircle, Sparkles } from "lucide-react";
import { Sticker } from "./Sticker";

export interface PropertyScore {
  name: string;
  score: number; // 0 - 100
  isWeakest?: boolean;
}

export interface ScorePanelProps {
  hookText: string;
  formula: string;
  verdict: number; // 0 - 100
  band: "STRONG" | "WORKABLE" | "WEAK";
  properties: PropertyScore[];
  weakestFix?: string;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
}

export const ScorePanel: React.FC<ScorePanelProps> = ({
  hookText,
  formula,
  verdict,
  band,
  properties,
  weakestFix,
  isSelected,
  onSelect,
  className = "",
}) => {
  const [displayVerdict, setDisplayVerdict] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 500; // ms
    const stepTime = 16;
    const increment = verdict / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= verdict) {
        setDisplayVerdict(verdict);
        clearInterval(timer);
      } else {
        setDisplayVerdict(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [verdict]);

  const bandConfig = {
    STRONG: {
      stickerVariant: "ok" as const,
      icon: Check,
      textClass: "text-ok",
      borderClass: "border-ok/30",
      bgClass: "bg-ok/10",
    },
    WORKABLE: {
      stickerVariant: "warn" as const,
      icon: AlertTriangle,
      textClass: "text-warn",
      borderClass: "border-warn/30",
      bgClass: "bg-warn/10",
    },
    WEAK: {
      stickerVariant: "bad" as const,
      icon: AlertCircle,
      textClass: "text-bad",
      borderClass: "border-bad/30",
      bgClass: "bg-bad/10",
    },
  }[band];

  const BandIcon = bandConfig.icon;

  return (
    <div
      onClick={onSelect}
      className={`rounded-card border transition-all duration-200 p-6 ${
        isSelected
          ? "border-yt-red bg-surface-2 shadow-glow ring-2 ring-yt-red"
          : "border-line bg-surface-1 hover:border-line hover:bg-surface-2"
      } ${onSelect ? "cursor-pointer" : ""} ${className}`}
    >
      {/* Header with Hook Quote & Big Verdict */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-line">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Sticker
              label={band}
              variant={bandConfig.stickerVariant}
              rotate={band === "STRONG" ? -2 : 1}
            />
            <span className="type-label text-txt-2 font-mono text-[10px]">
              FORMULA: <span className="text-txt font-bold">{formula}</span>
            </span>
          </div>
          <p className="type-body text-txt font-bold leading-snug">
            &ldquo;{hookText}&rdquo;
          </p>
        </div>

        {/* Big Black Verdict Numeral */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 bg-surface-2 sm:bg-transparent p-3 sm:p-0 rounded-input border sm:border-0 border-line">
          <div className="flex items-baseline gap-1">
            <span className={`text-4xl sm:text-5xl font-black font-condensed tracking-tight type-tabular ${bandConfig.textClass}`}>
              {displayVerdict}
            </span>
            <span className="text-xs text-txt-2 font-bold font-mono">/100</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <BandIcon className={`w-3 h-3 ${bandConfig.textClass}`} />
            <span className="type-label text-[10px] text-txt-2 font-bold tracking-widest">
              VERDICT
            </span>
          </div>
        </div>
      </div>

      {/* 5 Equalizer Property Bars */}
      <div className="space-y-3 py-4">
        {properties.map((prop) => {
          const isHigh = prop.score >= 70;
          const isMid = prop.score >= 45;
          const barColor = isHigh ? "bg-ok" : isMid ? "bg-warn" : "bg-bad";

          return (
            <div key={prop.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className={`type-label font-bold text-[10px] ${
                  prop.isWeakest ? "text-warn" : "text-txt-2"
                }`}>
                  {prop.name} {prop.isWeakest ? "• WEAKEST" : ""}
                </span>
                <span className="type-tabular font-bold text-xs text-txt">
                  {prop.score}
                </span>
              </div>
              <div className="h-2 w-full rounded-pill bg-surface-3 overflow-hidden">
                <div
                  className={`h-full rounded-pill transition-all duration-700 ease-out ${barColor}`}
                  style={{ width: `${prop.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Weakest Property & Fix Tip Callout */}
      {weakestFix && (
        <div className="rounded-input border border-warn/30 bg-warn/10 p-3.5 text-xs mt-2">
          <div className="flex items-center gap-1.5 text-warn font-bold mb-1">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span className="type-label text-[10px] tracking-wider">PRIMARY FIX HEURISTIC</span>
          </div>
          <p className="type-small text-txt leading-relaxed font-medium">
            {weakestFix}
          </p>
        </div>
      )}
    </div>
  );
};
