"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Sticker } from "@/components/ui/Sticker";
import { Skeleton } from "@/components/ui/Skeleton";
import { EqualizerLoader } from "@/components/ui/EqualizerLoader";
import { Confetti } from "@/components/ui/Confetti";
import { Toast } from "@/components/ui/Toast";
import {
  Sparkles,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
  Copy,
  Terminal,
  Activity,
  Layers,
  Zap,
} from "lucide-react";

const COLOR_TOKENS = [
  { name: "--bg", hexDark: "#0F0F0F", hexLight: "#FFFFFF", role: "App Background" },
  { name: "--surface-1", hexDark: "#181818", hexLight: "#F9F9F9", role: "Cards, Panels" },
  { name: "--surface-2", hexDark: "#212121", hexLight: "#F2F2F2", role: "Inputs, Raised cards" },
  { name: "--surface-3", hexDark: "#272727", hexLight: "#E5E5E5", role: "Chips, Hover fills" },
  { name: "--line", hexDark: "#3F3F3F", hexLight: "#D9D9D9", role: "Hairlines & Borders" },
  { name: "--text", hexDark: "#F1F1F1", hexLight: "#0F0F0F", role: "Primary Text (16.97:1)" },
  { name: "--text-2", hexDark: "#AAAAAA", hexLight: "#606060", role: "Secondary Text (8.25:1)" },
  { name: "--yt-red", hexDark: "#FF0000", hexLight: "#FF0000", role: "Brand Fills & Large Type" },
  { name: "--yt-red-ink", hexDark: "#E00000", hexLight: "#CC0000", role: "Small White Text on Red (5.04:1)" },
  { name: "--yt-red-text", hexDark: "#FF4E45", hexLight: "#CC0000", role: "Red Text on Dark (5.87:1)" },
  { name: "--link", hexDark: "#3EA6FF", hexLight: "#065FD4", role: "Links & Highlights (7.40:1)" },
  { name: "--ok", hexDark: "#2BA640", hexLight: "#137333", role: "STRONG / Validated (6.05:1)" },
  { name: "--warn", hexDark: "#FFB020", hexLight: "#B06000", role: "WORKABLE / Caution (10.48:1)" },
  { name: "--bad", hexDark: "#FF4E45", hexLight: "#CC0000", role: "WEAK / Errors (5.87:1)" },
];

export default function DesignSystemPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeChip, setActiveChip] = useState("all");
  const [confettiActive, setConfettiActive] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const toggleTheme = () => {
    if (theme === "dark") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      setTheme("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      setTheme("dark");
    }
  };

  return (
    <div className="space-y-16 pb-24 max-w-6xl mx-auto">
      {/* Toast and Confetti triggers */}
      <Confetti active={confettiActive} onComplete={() => setConfettiActive(false)} />
      <Toast
        isOpen={toastOpen}
        onClose={() => setToastOpen(false)}
        message="Copied. Go upload it."
        type="success"
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-line pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sticker variant="hot" rotate={-2}>2027 SPEC</Sticker>
            <span className="type-label text-yt-red-text font-bold">YouTube Visual Language</span>
          </div>
          <h1 className="type-h1 text-txt tracking-tight">
            Design System
          </h1>
          <p className="type-body text-txt-2 mt-2">
            Bold, tactile, kinetic, and clear. Helvetica family only, YouTube red &amp; dark palettes, with WCAG AA compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={toggleTheme}
            className="flex items-center gap-2"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-warn" /> : <Moon className="w-4 h-4 text-link" />}
            <span>Toggle Theme ({theme.toUpperCase()})</span>
          </Button>

          <Button
            variant="primary"
            onClick={() => {
              setConfettiActive(true);
              setToastOpen(true);
            }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Test Celebration Burst</span>
          </Button>
        </div>
      </div>

      {/* 1. Color Palette Tokens */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-yt-red" />
            <h2 className="type-h2 text-txt">1. Color Palette &amp; Contrast</h2>
          </div>
          <span className="type-label text-ok flex items-center gap-1 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>20/20 WCAG AA Verified</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLOR_TOKENS.map((token) => {
            const hex = theme === "dark" ? token.hexDark : token.hexLight;
            return (
              <div
                key={token.name}
                className="rounded-card bg-surface-1 border border-line p-4 space-y-3"
              >
                <div
                  className="h-14 w-full rounded-input border border-line/40 shadow-inner flex items-center justify-end p-2"
                  style={{ backgroundColor: hex }}
                >
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-pill bg-black/50 text-white">
                    {hex}
                  </span>
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-txt block">{token.name}</span>
                  <span className="text-xs text-txt-2 mt-0.5 block">{token.role}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Helvetica Typography Specimen */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-yt-red" />
            <h2 className="type-h2 text-txt">2. Typography: Helvetica Family Only</h2>
          </div>
          <span className="type-label text-txt-2">Fluid clamp() sizing</span>
        </div>

        <div className="space-y-8 rounded-card bg-surface-1 border border-line p-8">
          <div>
            <span className="type-label text-txt-2 block mb-2">Hero (clamp 48-128px, 900 Black)</span>
            <div className="type-hero text-txt">
              MAKE VIDEOS PEOPLE FINISH.
            </div>
          </div>

          <div className="border-t border-line/60 pt-6">
            <span className="type-label text-txt-2 block mb-2">H1 (clamp 32-64px, 900 Black)</span>
            <div className="type-h1 text-txt">
              Hook Score: 55 Workable
            </div>
          </div>

          <div className="border-t border-line/60 pt-6">
            <span className="type-label text-txt-2 block mb-2">H2 (clamp 24-36px, 700 Bold)</span>
            <div className="type-h2 text-txt">
              The 3-Word Rule for High CTR Thumbnails
            </div>
          </div>

          <div className="border-t border-line/60 pt-6">
            <span className="type-label text-txt-2 block mb-2">H3 (20px, 700 Bold)</span>
            <div className="type-h3 text-txt">
              Ship it, or change it?
            </div>
          </div>

          <div className="border-t border-line/60 pt-6">
            <span className="type-label text-txt-2 block mb-2">Body (16px, 400 Roman)</span>
            <p className="type-body text-txt">
              The first 15 seconds is the whole job. It confirms the click the title promised, raises a question the viewer cannot close, and proves the payoff exists without inventing claims.
            </p>
          </div>

          <div className="border-t border-line/60 pt-6">
            <span className="type-label text-txt-2 block mb-2">Tabular Numeric Figures (Scores, Timers, Multipliers)</span>
            <div className="flex flex-wrap items-center gap-8 type-tabular font-black">
              <span className="text-4xl text-txt">10.0x</span>
              <span className="text-4xl text-yt-red-text">0.588%</span>
              <span className="text-4xl text-ok">00:00:27</span>
              <span className="text-4xl text-warn">96 / 100</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Component Gallery */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yt-red" />
            <h2 className="type-h2 text-txt">3. Component Library</h2>
          </div>
          <span className="type-label text-txt-2">Interactive States</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Buttons */}
          <Card className="space-y-4">
            <span className="type-label text-txt-2 block">Pill Buttons</span>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary (Ship It)</Button>
              <Button variant="secondary">Secondary Pill</Button>
              <Button variant="ghost">Ghost Link</Button>
              <Button variant="danger">Danger Action</Button>
            </div>
          </Card>

          {/* Chips & Stickers */}
          <Card className="space-y-4">
            <span className="type-label text-txt-2 block">Chips &amp; Tilted Stickers</span>
            <div className="flex flex-wrap items-center gap-2.5">
              <Chip active={activeChip === "all"} onClick={() => setActiveChip("all")}>
                Active Pill
              </Chip>
              <Chip active={activeChip === "draft"} onClick={() => setActiveChip("draft")} count={12}>
                Drafts
              </Chip>
              <Sticker variant="hot" rotate={-2}>TOP 2</Sticker>
              <Sticker variant="strong" rotate={2}>STRONG</Sticker>
              <Sticker variant="workable" rotate={-1}>WORKABLE</Sticker>
              <Sticker variant="weak" rotate={1}>WEAK</Sticker>
            </div>
          </Card>

          {/* Inputs & Textareas */}
          <Card className="space-y-4">
            <span className="type-label text-txt-2 block">Form Fields</span>
            <Input label="Video Working Title" placeholder="e.g. Why 97% of Creators Quit Before Video 30" />
            <Textarea
              label="Spoken Hook Transcript"
              rows={3}
              value="So here is how to write a hook that works. First you name the viewer in the first six words."
              showLineCount
              onPasteSample={() => alert("Paste sample triggered!")}
            />
          </Card>

          {/* Skeletons & Equalizer Loader */}
          <Card className="space-y-4">
            <span className="type-label text-txt-2 block">Loaders &amp; Shimmers</span>
            <EqualizerLoader label="Deterministic Scoring Engine" />
            <div className="space-y-2 pt-2 border-t border-line">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full rounded-pill" />
            </div>
          </Card>
        </div>
      </section>

      {/* 4. Glass, Glow & Grain Surface Effects */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-yt-red" />
            <h2 className="type-h2 text-txt">4. Glass, Glow &amp; Grain</h2>
          </div>
          <span className="type-label text-txt-2">Physical Depth</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="liquid-glass rounded-card p-6 space-y-2">
            <span className="type-label text-txt block">Liquid Glass</span>
            <p className="type-small text-txt-2">
              Backdrop filter blur with 18px saturation boost and hairline highlight.
            </p>
          </div>

          <div className="rounded-card bg-surface-1 border border-yt-red shadow-glow p-6 space-y-2">
            <span className="type-label text-yt-red-text block">Red Radial Glow</span>
            <p className="type-small text-txt-2">
              Layered red glow on hover and focus to command creator attention.
            </p>
          </div>

          <div className="rounded-card bg-surface-1 grain-overlay border border-line p-6 space-y-2 overflow-hidden">
            <span className="type-label text-txt block">SVG Film Grain</span>
            <p className="type-small text-txt-2">
              Tactile 5% mix-blend noise overlay on hero banners.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
