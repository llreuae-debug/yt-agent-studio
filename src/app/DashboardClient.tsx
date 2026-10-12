"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Package,
  Scissors,
  MessageSquare,
  Calendar,
  Flame,
  LineChart,
  Film,
  Search,
  Bookmark,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Mic2,
  Clock,
  Play,
  TrendingUp,
} from "lucide-react";
import { VoiceBanner } from "@/components/shell/VoiceBanner";
import { getHistory, HistoryRun } from "@/lib/storage";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";

const MARQUEE_COMMANDS = [
  "/yt-script",
  "/yt-package",
  "/yt-edit",
  "/yt-comment",
  "/yt-plan",
  "/yt-viral",
  "/yt-retention",
  "/yt-shorts",
  "/yt-seo",
  "/yt-chapters",
  "/yt-audit",
];

export default function DashboardPage() {
  const [history, setHistory] = useState<HistoryRun[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const getLastRunTime = (moduleName: string) => {
    const runs = history.filter((r) => r.module.toLowerCase() === moduleName.toLowerCase());
    if (!runs.length) return "Never run";
    const date = new Date(runs[0].timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Voice Banner Notification */}
      <VoiceBanner />

      {/* Hero Band with Grad-Night & Film Grain */}
      <section className="relative overflow-hidden rounded-card border border-line bg-grad-night grain-overlay p-6 sm:p-10 md:p-12 shadow-2xl">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="type-label bg-yt-red text-white px-2.5 py-0.5 rounded-pill font-bold shadow-glow">
              STUDIO 2027
            </span>
            <span className="type-label bg-surface-2 text-txt-2 border border-line px-2.5 py-0.5 rounded-pill font-medium">
              11 DETERMINISTIC SKILLS • ZERO CLOUD LEAK
            </span>
          </div>

          {/* Kinetic Headline Words */}
          <h1 className="type-hero text-txt font-black uppercase tracking-tighter leading-none">
            <span className="inline-block hover:text-yt-red transition-colors duration-200">MAKE</span>{" "}
            <span className="inline-block hover:text-yt-red transition-colors duration-200">VIDEOS</span>{" "}
            <span className="inline-block text-yt-red underline decoration-line decoration-4 underline-offset-8">
              PEOPLE
            </span>{" "}
            <span className="inline-block hover:text-yt-red transition-colors duration-200">FINISH.</span>
          </h1>

          <p className="type-body text-txt-2 max-w-2xl leading-relaxed text-sm sm:text-base">
            YT Agent Studio is a free, local-first web app that helps YouTube creators write high-retention scripts, lint titles against mobile and desktop cutoffs, trim dead-air pauses from transcripts, format compliant chapters, and diagnose retention drop-offs. Everything runs in your browser with zero cloud storage or account linking.
          </p>
        </div>

        {/* Slow Marquee of 11 Command Names */}
        <div className="relative z-10 mt-8 pt-6 border-t border-line/60 overflow-hidden select-none">
          <div className="animate-marquee flex items-center gap-6 whitespace-nowrap text-xs font-mono font-bold text-txt-2">
            {[...MARQUEE_COMMANDS, ...MARQUEE_COMMANDS].map((cmd, idx) => (
              <span key={idx} className="flex items-center gap-4 hover:text-yt-red transition-colors cursor-pointer">
                <span>{cmd}</span>
                <span className="text-yt-red/60">•</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Asymmetric Bento Grid of 11 Modules + Voice */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-4 w-1 bg-yt-red rounded-pill" />
            <h2 className="type-h2 text-txt font-black tracking-tight">Studio Bento</h2>
          </div>
          <span className="type-label text-txt-2">SELECT A MODULE OR PRESS ⌘K</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* 1. SCRIPT MODULE (2x1 Large Bento Tile) */}
          <Link href="/script" className="md:col-span-2 group">
            <Card className="h-full relative overflow-hidden p-6 sm:p-7 border-line group-hover:border-yt-red transition-all flex flex-col justify-between">
              <div className="absolute top-4 right-4">
                <Sticker label="TOP 1" variant="red" rotate={-2} />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2.5 rounded-pill bg-yt-red/10 text-yt-red group-hover:bg-yt-red group-hover:text-white transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="type-label font-bold text-txt-2">SCRIPTWRITING CORE</span>
                </div>

                <div className="type-h1 font-black text-txt tracking-tighter group-hover:text-yt-red transition-colors">
                  /yt-script
                </div>
                <p className="type-body text-txt-2 mt-2 max-w-lg">
                  Hook options off 21 formulas scored down to two, then full spoken script with on-screen cues.
                </p>

                {/* Live mini preview */}
                <div className="mt-5 p-3.5 rounded-input bg-surface-2 border border-line space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="type-label text-txt-2">LIVE SCORE EQUALIZER</span>
                    <span className="type-tabular font-black text-ok">STRONG 4.6 / 5.0</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 h-3">
                    <div className="bg-ok rounded-pill w-full h-full" />
                    <div className="bg-ok rounded-pill w-full h-full" />
                    <div className="bg-ok rounded-pill w-full h-full" />
                    <div className="bg-ok rounded-pill w-full h-full" />
                    <div className="bg-surface-3 rounded-pill w-full h-full" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-5 mt-5 border-t border-line text-xs">
                <span className="type-tabular text-txt-2">Last run: {getLastRunTime("Script")}</span>
                <span className="flex items-center gap-1 font-bold text-yt-red group-hover:translate-x-1 transition-transform">
                  Launch Script <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          </Link>

          {/* 2. PACKAGE MODULE (2x1 Large Bento Tile) */}
          <Link href="/package" className="md:col-span-2 group">
            <Card className="h-full relative overflow-hidden p-6 sm:p-7 border-line group-hover:border-yt-red transition-all flex flex-col justify-between">
              <div className="absolute top-4 right-4">
                <Sticker label="FEED AUDIT" variant="neutral" rotate={2} />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2.5 rounded-pill bg-yt-red/10 text-yt-red group-hover:bg-yt-red group-hover:text-white transition-colors">
                    <Package className="w-5 h-5" />
                  </div>
                  <span className="type-label font-bold text-txt-2">PACKAGING &amp; CTR</span>
                </div>

                <div className="type-h1 font-black text-txt tracking-tighter group-hover:text-yt-red transition-colors">
                  /yt-package
                </div>
                <p className="type-body text-txt-2 mt-2 max-w-lg">
                  Ten titles linted to three, thumbnail visual brief, and title-thumbnail duplication check.
                </p>

                {/* Live mini preview with 168x94 thumbnail simulator */}
                <div className="mt-5 p-3.5 rounded-input bg-surface-2 border border-line flex items-center gap-3">
                  <div className="w-[84px] h-[47px] rounded-thumb bg-surface-3 border border-line flex items-center justify-center shrink-0 text-[10px] font-bold text-txt-2">
                    168×94
                  </div>
                  <div className="space-y-1 text-xs truncate">
                    <div className="font-bold text-txt truncate">Title Lint: 60/40 Desktop &amp; Mobile Cut</div>
                    <div className="text-[11px] text-ok flex items-center gap-1">
                      <span>✓ 3-Word Rule Enforced</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-5 mt-5 border-t border-line text-xs">
                <span className="type-tabular text-txt-2">Last run: {getLastRunTime("Package")}</span>
                <span className="flex items-center gap-1 font-bold text-yt-red group-hover:translate-x-1 transition-transform">
                  Launch Package <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          </Link>

          {/* 3. VOICE PROFILE (1 Tile) */}
          <Link href="/voice" className="group">
            <Card className="h-full p-6 border-line group-hover:border-yt-red transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-pill bg-surface-2 text-txt group-hover:bg-yt-red group-hover:text-white transition-colors">
                    <Mic2 className="w-4 h-4" />
                  </div>
                  <span className="type-label text-[10px] text-txt-2">voice.md</span>
                </div>
                <div className="type-h2 font-black text-txt group-hover:text-yt-red transition-colors">
                  /voice
                </div>
                <p className="type-small text-txt-2 mt-2">
                  Audience profile, taboo words, and speaking cadence.
                </p>
              </div>
              <div className="pt-4 border-t border-line flex items-center justify-between text-xs mt-4">
                <span className="type-label text-ok">ACTIVE</span>
                <ArrowRight className="w-3.5 h-3.5 text-txt-2 group-hover:text-yt-red group-hover:translate-x-1 transition-all" />
              </div>
            </Card>
          </Link>

          {/* 4. EDIT MODULE (1 Tile) */}
          <Link href="/edit" className="group">
            <Card className="h-full p-6 border-line group-hover:border-yt-red transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-pill bg-surface-2 text-txt group-hover:bg-yt-red group-hover:text-white transition-colors">
                    <Scissors className="w-4 h-4" />
                  </div>
                  <span className="type-label text-[10px] text-ok">-10.5s CUT</span>
                </div>
                <div className="type-h2 font-black text-txt group-hover:text-yt-red transition-colors">
                  /yt-edit
                </div>
                <p className="type-small text-txt-2 mt-2">
                  Deterministic EDL from transcript: dead-air, fillers, restarts.
                </p>
              </div>
              <div className="pt-4 border-t border-line flex items-center justify-between text-xs mt-4">
                <span className="type-tabular text-txt-2">{getLastRunTime("Edit")}</span>
                <ArrowRight className="w-3.5 h-3.5 text-txt-2 group-hover:text-yt-red group-hover:translate-x-1 transition-all" />
              </div>
            </Card>
          </Link>

          {/* 5. VIRAL MODULE (1 Tile) */}
          <Link href="/viral" className="group">
            <Card className="h-full p-6 border-line group-hover:border-yt-red transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-pill bg-surface-2 text-txt group-hover:bg-yt-red group-hover:text-white transition-colors">
                    <Flame className="w-4 h-4" />
                  </div>
                  <Sticker label="10.0x" variant="red" rotate={-3} />
                </div>
                <div className="type-h2 font-black text-txt group-hover:text-yt-red transition-colors">
                  /yt-viral
                </div>
                <p className="type-small text-txt-2 mt-2">
                  Ranks competitor outlier videos by multiples over median.
                </p>
              </div>
              <div className="pt-4 border-t border-line flex items-center justify-between text-xs mt-4">
                <span className="type-tabular text-txt-2">{getLastRunTime("Viral")}</span>
                <ArrowRight className="w-3.5 h-3.5 text-txt-2 group-hover:text-yt-red group-hover:translate-x-1 transition-all" />
              </div>
            </Card>
          </Link>

          {/* 6. COMMENT MODULE (1 Tile) */}
          <Link href="/comment" className="group">
            <Card className="h-full p-6 border-line group-hover:border-yt-red transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-pill bg-surface-2 text-txt group-hover:bg-yt-red group-hover:text-white transition-colors">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="type-label text-[10px] text-txt-2">&lt;30 WORDS</span>
                </div>
                <div className="type-h2 font-black text-txt group-hover:text-yt-red transition-colors">
                  /yt-comment
                </div>
                <p className="type-small text-txt-2 mt-2">
                  Triage into 4 piles (Questions, Corrections, Praise, Bait).
                </p>
              </div>
              <div className="pt-4 border-t border-line flex items-center justify-between text-xs mt-4">
                <span className="type-tabular text-txt-2">{getLastRunTime("Comment")}</span>
                <ArrowRight className="w-3.5 h-3.5 text-txt-2 group-hover:text-yt-red group-hover:translate-x-1 transition-all" />
              </div>
            </Card>
          </Link>

          {/* 7. PLAN MODULE (1 Tile) */}
          <Link href="/plan" className="group">
            <Card className="h-full p-6 border-line group-hover:border-yt-red transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-pill bg-surface-2 text-txt group-hover:bg-yt-red group-hover:text-white transition-colors">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="type-label text-[10px] text-txt-2">HONEST LINE</span>
                </div>
                <div className="type-h2 font-black text-txt group-hover:text-yt-red transition-colors">
                  /yt-plan
                </div>
                <p className="type-small text-txt-2 mt-2">
                  Realistic 3-upload weekly calendar: 1 anchor, 1 cheap, 3 Shorts.
                </p>
              </div>
              <div className="pt-4 border-t border-line flex items-center justify-between text-xs mt-4">
                <span className="type-tabular text-txt-2">{getLastRunTime("Plan")}</span>
                <ArrowRight className="w-3.5 h-3.5 text-txt-2 group-hover:text-yt-red group-hover:translate-x-1 transition-all" />
              </div>
            </Card>
          </Link>

          {/* 8. RETENTION MODULE (2x1 Span Tile) */}
          <Link href="/retention" className="md:col-span-2 group">
            <Card className="h-full p-6 border-line group-hover:border-yt-red transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2.5 rounded-pill bg-yt-red/10 text-yt-red group-hover:bg-yt-red group-hover:text-white transition-colors">
                      <LineChart className="w-5 h-5" />
                    </div>
                    <span className="type-label font-bold text-txt-2">CLIFFS &amp; DROP-OFF</span>
                  </div>
                  <span className="type-label text-bad font-bold">&lt;25% HOOK LEAK</span>
                </div>
                <div className="type-h2 font-black text-txt tracking-tighter group-hover:text-yt-red transition-colors">
                  /yt-retention
                </div>
                <p className="type-body text-txt-2 mt-1">
                  Studio retention CSV reader: hook leak, steep drop-off cliffs, and middle slide rate.
                </p>

                {/* Visual curve graphic */}
                <div className="mt-4 p-3 rounded-input bg-surface-2 border border-line flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-yt-red animate-ping" />
                    <span className="font-bold text-txt">Pulsing Cliff Pins Active</span>
                  </div>
                  <span className="type-label text-txt-2">CSV DROPZONE READY</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-line text-xs">
                <span className="type-tabular text-txt-2">{getLastRunTime("Retention")}</span>
                <span className="font-bold text-yt-red flex items-center gap-1">
                  View Retention <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          </Link>

          {/* 9. SHORTS MODULE (1 Tile) */}
          <Link href="/shorts" className="group">
            <Card className="h-full p-6 border-line group-hover:border-yt-red transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-pill bg-surface-2 text-txt group-hover:bg-yt-red group-hover:text-white transition-colors">
                    <Film className="w-4 h-4" />
                  </div>
                  <span className="type-label text-[10px] text-txt-2">20-55s SPANS</span>
                </div>
                <div className="type-h2 font-black text-txt group-hover:text-yt-red transition-colors">
                  /yt-shorts
                </div>
                <p className="type-small text-txt-2 mt-2">
                  Transcript cutter, hook rewrite, and 9:16 vertical crop guide.
                </p>
              </div>
              <div className="pt-4 border-t border-line flex items-center justify-between text-xs mt-4">
                <span className="type-tabular text-txt-2">{getLastRunTime("Shorts")}</span>
                <ArrowRight className="w-3.5 h-3.5 text-txt-2 group-hover:text-yt-red group-hover:translate-x-1 transition-all" />
              </div>
            </Card>
          </Link>

          {/* 10. SEO MODULE (1 Tile) */}
          <Link href="/seo" className="group">
            <Card className="h-full p-6 border-line group-hover:border-yt-red transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-pill bg-surface-2 text-txt group-hover:bg-yt-red group-hover:text-white transition-colors">
                    <Search className="w-4 h-4" />
                  </div>
                  <span className="type-label text-[10px] text-ok">3-QUERY TEST</span>
                </div>
                <div className="type-h2 font-black text-txt group-hover:text-yt-red transition-colors">
                  /yt-seo
                </div>
                <p className="type-small text-txt-2 mt-2">
                  First 2 description lines, disambiguation tags, search snippet.
                </p>
              </div>
              <div className="pt-4 border-t border-line flex items-center justify-between text-xs mt-4">
                <span className="type-tabular text-txt-2">{getLastRunTime("SEO")}</span>
                <ArrowRight className="w-3.5 h-3.5 text-txt-2 group-hover:text-yt-red group-hover:translate-x-1 transition-all" />
              </div>
            </Card>
          </Link>

          {/* 11. CHAPTERS MODULE (1 Tile) */}
          <Link href="/chapters" className="group">
            <Card className="h-full p-6 border-line group-hover:border-yt-red transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-pill bg-surface-2 text-txt group-hover:bg-yt-red group-hover:text-white transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </div>
                  <span className="type-label text-[10px] text-ok">0:00 START</span>
                </div>
                <div className="type-h2 font-black text-txt group-hover:text-yt-red transition-colors">
                  /yt-chapters
                </div>
                <p className="type-small text-txt-2 mt-2">
                  YouTube-compliant timestamps and retitled section promises.
                </p>
              </div>
              <div className="pt-4 border-t border-line flex items-center justify-between text-xs mt-4">
                <span className="type-tabular text-txt-2">{getLastRunTime("Chapters")}</span>
                <ArrowRight className="w-3.5 h-3.5 text-txt-2 group-hover:text-yt-red group-hover:translate-x-1 transition-all" />
              </div>
            </Card>
          </Link>

          {/* 12. AUDIT MODULE (1 Tile) */}
          <Link href="/audit" className="group">
            <Card className="h-full p-6 border-line group-hover:border-yt-red transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-pill bg-surface-2 text-txt group-hover:bg-yt-red group-hover:text-white transition-colors">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <Sticker label="1 BIG FIX" variant="red" rotate={2} />
                </div>
                <div className="type-h2 font-black text-txt group-hover:text-yt-red transition-colors">
                  /yt-audit
                </div>
                <p className="type-small text-txt-2 mt-2">
                  10 titles linted, 3 hooks scored, feed thumbnail simulator, 1 big fix.
                </p>
              </div>
              <div className="pt-4 border-t border-line flex items-center justify-between text-xs mt-4">
                <span className="type-tabular text-txt-2">{getLastRunTime("Audit")}</span>
                <ArrowRight className="w-3.5 h-3.5 text-txt-2 group-hover:text-yt-red group-hover:translate-x-1 transition-all" />
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Semantic Overview & Scannable Modules List (AEO & Search Engines) */}
      <section className="mt-16 border-t border-line/60 pt-12 space-y-12">
        <div className="grid gap-8 md:grid-cols-2">
          {/* What It Does */}
          <div className="p-6 rounded-2xl border border-line bg-surface-1 space-y-3">
            <h2 className="text-xl font-bold text-txt">What YT Agent Studio Does</h2>
            <p className="text-sm text-txt-2 leading-relaxed">
              YT Agent Studio provides 11 point-and-click tools that run deterministic linting, scoring, and editing algorithms directly in TypeScript on both client and server. Instead of subjective guesswork, the suite calculates exact word economy, character cutoffs, subtitle pause gaps, and retention cliffs using mathematics, with server-side AI for structured drafting.
            </p>
          </div>

          {/* Who It Is For */}
          <div className="p-6 rounded-2xl border border-line bg-surface-1 space-y-3">
            <h2 className="text-xl font-bold text-txt">Who It Is For</h2>
            <p className="text-sm text-txt-2 leading-relaxed">
              Designed for YouTube creators, video editors, and scriptwriters who want higher average view duration and higher click-through rates without handing channel passwords or OAuth permissions to third-party SaaS services. Ideal for solo YouTubers producing long-form videos and Shorts.
            </p>
          </div>
        </div>

        {/* The 11 Creator Modules Scannable List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-1 bg-yt-red rounded-pill" />
            <h2 className="text-xl font-bold text-txt">The 11 YouTube Creator Skills</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
            <div className="p-4 rounded-xl border border-line bg-surface-1">
              <h3 className="font-bold text-txt text-sm mb-1">1. /yt-script — Script Engine</h3>
              <p className="text-txt-2">Scores 5 candidate hooks against 21 formulas and outputs full scripts with [ON SCREEN: ...] visual cues.</p>
            </div>
            <div className="p-4 rounded-xl border border-line bg-surface-1">
              <h3 className="font-bold text-txt text-sm mb-1">2. /yt-package — Package Studio</h3>
              <p className="text-txt-2">Lints 10 titles against 40-char mobile and 60-char desktop cutoffs, with 3-word thumbnail briefs.</p>
            </div>
            <div className="p-4 rounded-xl border border-line bg-surface-1">
              <h3 className="font-bold text-txt text-sm mb-1">3. /yt-edit — Edit Decision List (EDL)</h3>
              <p className="text-txt-2">Detects pause gaps, conversational fillers (&quot;um&quot;), and repeated sentences from subtitle transcripts.</p>
            </div>
            <div className="p-4 rounded-xl border border-line bg-surface-1">
              <h3 className="font-bold text-txt text-sm mb-1">4. /yt-comment — Comment Replier</h3>
              <p className="text-txt-2">Triages comments into 4 piles (Questions, Corrections, Praise, Bait), picks pin comment, enforces &lt;30 words.</p>
            </div>
            <div className="p-4 rounded-xl border border-line bg-surface-1">
              <h3 className="font-bold text-txt text-sm mb-1">5. /yt-plan — Weekly Planner</h3>
              <p className="text-txt-2">Sized to creator capacity (hours and assets). Plans 1 anchor, 1 cheap video, and 3 Shorts with an honest drop line.</p>
            </div>
            <div className="p-4 rounded-xl border border-line bg-surface-1">
              <h3 className="font-bold text-txt text-sm mb-1">6. /yt-viral — Niche Outliers</h3>
              <p className="text-txt-2">Ranks videos by multiple over channel median (minimum 4 videos per channel) and classifies title formulas.</p>
            </div>
            <div className="p-4 rounded-xl border border-line bg-surface-1">
              <h3 className="font-bold text-txt text-sm mb-1">7. /yt-retention — Retention Reader</h3>
              <p className="text-txt-2">Visualizes retention curves, diagnoses Hook Leak (first 30s) and Cliff drops, and delivers 1 primary fix.</p>
            </div>
            <div className="p-4 rounded-xl border border-line bg-surface-1">
              <h3 className="font-bold text-txt text-sm mb-1">8. /yt-shorts — Shorts Cutter</h3>
              <p className="text-txt-2">Extracts 20–55s moments, writes replacement hook, on-screen text for first 2s, and 9:16 vertical crop notes.</p>
            </div>
            <div className="p-4 rounded-xl border border-line bg-surface-1">
              <h3 className="font-bold text-txt text-sm mb-1">9. /yt-seo — Description Studio</h3>
              <p className="text-txt-2">Formats search snippet (top 2 lines), links, chapters, and max 15 tags with deterministic Query Test.</p>
            </div>
            <div className="p-4 rounded-xl border border-line bg-surface-1">
              <h3 className="font-bold text-txt text-sm mb-1">10. /yt-chapters — Compliant Chapters</h3>
              <p className="text-txt-2">Enforces 0:00 start, 3+ chapters, and &gt;=10s duration YouTube requirements with pause gap analysis.</p>
            </div>
            <div className="p-4 rounded-xl border border-line bg-surface-1">
              <h3 className="font-bold text-txt text-sm mb-1">11. /yt-audit — Channel Audit</h3>
              <p className="text-txt-2">Lints 10 titles, scores 3 opening hooks, tests upload spread consistency, and simulates 168x94px mobile feed size.</p>
            </div>
            <div className="p-4 rounded-xl border border-line bg-surface-1">
              <h3 className="font-bold text-txt text-sm mb-1">12. Voice Profile — voice.md</h3>
              <p className="text-txt-2">Defines spoken cadence, forbidden words, target audience, and format tone injected into every AI run.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
