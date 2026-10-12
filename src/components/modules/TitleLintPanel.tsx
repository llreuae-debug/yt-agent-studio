"use client";

import { TitleCheckResult } from "@/lib/tools/title";
import { AlertCircle, CheckCircle, Smartphone, Monitor, X, Check } from "lucide-react";
import { Sticker } from "@/components/ui/Sticker";
import { Chip } from "@/components/ui/Chip";

interface TitleLintPanelProps {
  checkResult: TitleCheckResult;
  thumbText?: string;
  onSelect?: () => void;
  isSelected?: boolean;
}

export function TitleLintPanel({ checkResult, thumbText, onSelect, isSelected }: TitleLintPanelProps) {
  const { title, chars, score, issues, good } = checkResult;

  const scoreColor = score >= 80 ? "text-ok" : score >= 65 ? "text-warn" : "text-bad";
  const stickerVariant = score >= 80 ? "ok" : score >= 65 ? "warn" : "bad";
  const stickerLabel = score >= 80 ? "TOP TIER" : score >= 65 ? "WORKABLE" : "WEAK";

  return (
    <div
      onClick={onSelect}
      className={`rounded-card border transition-all p-6 ${
        isSelected
          ? "border-yt-red bg-surface-2 shadow-glow ring-2 ring-yt-red"
          : "border-line bg-surface-1 hover:border-line hover:bg-surface-2"
      } ${onSelect ? "cursor-pointer" : ""}`}
    >
      {/* Title & Score Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Sticker label={stickerLabel} variant={stickerVariant} rotate={-1} />
            <span className="type-label text-txt-2 font-mono text-[10px]">
              {chars} CHARACTERS
            </span>
          </div>

          <p className="type-h3 text-txt font-bold leading-snug">
            &ldquo;{title}&rdquo;
          </p>
        </div>

        {/* Big Black Score Numeral */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 bg-surface-2 sm:bg-transparent p-3 sm:p-0 rounded-input border sm:border-0 border-line">
          <div className="flex items-baseline gap-1">
            <span className={`text-4xl font-black font-condensed tracking-tight type-tabular ${scoreColor}`}>
              {score}
            </span>
            <span className="text-xs text-txt-2 font-bold font-mono">/100</span>
          </div>
          <span className="type-label text-[10px] text-txt-2 font-bold tracking-widest mt-0.5">
            LINT SCORE
          </span>
        </div>
      </div>

      {/* 40 / 60 Character Cutoff Marker Bar */}
      <div className="p-3 rounded-input bg-surface-2 border border-line space-y-2 mb-4">
        <div className="flex items-center justify-between text-[11px] font-mono text-txt-2">
          <span className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-warn" />
            <span>Mobile cut (40 chars): {chars > 40 ? <strong className="text-bad">Truncates</strong> : <strong className="text-ok">Safe</strong>}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5 text-txt" />
            <span>Desktop cut (60 chars): {chars > 60 ? <strong className="text-bad">Truncates</strong> : <strong className="text-ok">Safe</strong>}</span>
          </span>
        </div>

        {/* Visual cutoff marker track */}
        <div className="relative h-2 w-full rounded-pill bg-surface-3 overflow-hidden">
          {/* Active progress */}
          <div
            className={`h-full rounded-pill transition-all ${
              chars > 60 ? "bg-bad" : chars > 40 ? "bg-warn" : "bg-ok"
            }`}
            style={{ width: `${Math.min(100, (chars / 75) * 100)}%` }}
          />

          {/* 40 Chars vertical marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-warn z-10"
            style={{ left: `${(40 / 75) * 100}%` }}
            title="Mobile 40-char cut"
          />

          {/* 60 Chars vertical marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-txt z-10"
            style={{ left: `${(60 / 75) * 100}%` }}
            title="Desktop 60-char cut"
          />
        </div>
      </div>

      {/* Issues & Passing Criteria as Chips */}
      <div className="space-y-3 border-t border-line pt-3">
        {issues.length > 0 && (
          <div className="space-y-1.5">
            <span className="type-label text-bad block font-bold text-[10px]">
              ISSUES TO FIX ({issues.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {issues.map(([tag, msg], idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-pill bg-bad/10 border border-bad/30 px-3 py-1 text-xs text-bad"
                >
                  <X className="w-3 h-3 shrink-0" />
                  <span className="font-bold uppercase text-[10px] mr-1">[{tag}]</span>
                  <span>{msg}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {good.length > 0 && (
          <div className="space-y-1.5">
            <span className="type-label text-ok block font-bold text-[10px]">
              CRITERIA PASSED ({good.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {good.map((msg, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-pill bg-ok/10 border border-ok/30 px-3 py-1 text-xs text-ok"
                >
                  <Check className="w-3 h-3 shrink-0" />
                  <span>{msg}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
