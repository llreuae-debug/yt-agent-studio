"use client";

import { useState } from "react";
import { ShieldCheck, Sparkles, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { checkTitle, TitleCheckResult } from "@/lib/tools/title";
import { score as scoreHook, HookScoreResult } from "@/lib/tools/hookscore";
import { ThumbnailFeedPreview } from "@/components/modules/ThumbnailFeedPreview";
import { CopyBlock } from "@/components/common/CopyBlock";
import { Gate } from "@/components/common/Gate";
import { VoiceBanner } from "@/components/shell/VoiceBanner";
import { saveHistoryRun, getVoiceProfile } from "@/lib/storage";
import { SAMPLES } from "@/data/samples";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Sticker } from "@/components/ui/Sticker";
import { EqualizerLoader } from "@/components/ui/EqualizerLoader";

export default function AuditPage() {
  const [titlesText, setTitlesText] = useState("");
  const [hooksText, setHooksText] = useState("");
  const [uploadDatesText, setUploadDatesText] = useState("");
  const [channelUrlWarning, setChannelUrlWarning] = useState(false);

  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<{
    titleLints: TitleCheckResult[];
    hookScores: HookScoreResult[];
    consistencyMetrics: { gapsDays: number[]; avgGap: number; spreadStdDev: number; isConsistent: boolean };
    aiAudit: any;
  } | null>(null);

  const [shipped, setShipped] = useState(false);

  const computeConsistency = (datesStr: string) => {
    const rawLines = datesStr.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const parsedDates = rawLines.map((l) => new Date(l).getTime()).filter((t) => !isNaN(t));
    parsedDates.sort((a, b) => a - b);

    if (parsedDates.length < 2) {
      return { gapsDays: [], avgGap: 7, spreadStdDev: 0, isConsistent: true };
    }

    const gapsDays: number[] = [];
    for (let i = 1; i < parsedDates.length; i++) {
      const diffDays = Math.round((parsedDates[i] - parsedDates[i - 1]) / (1000 * 3600 * 24));
      gapsDays.push(diffDays);
    }

    const avgGap = gapsDays.reduce((a, b) => a + b, 0) / gapsDays.length;
    const variance = gapsDays.reduce((acc, g) => acc + Math.pow(g - avgGap, 2), 0) / gapsDays.length;
    const spreadStdDev = Math.sqrt(variance);

    return {
      gapsDays,
      avgGap: Math.round(avgGap * 10) / 10,
      spreadStdDev: Math.round(spreadStdDev * 10) / 10,
      isConsistent: spreadStdDev <= 4.0,
    };
  };

  const handleAudit = async (feedback?: string) => {
    if (titlesText.includes("youtube.com/") || titlesText.includes("youtu.be/")) {
      setChannelUrlWarning(true);
      return;
    }
    setChannelUrlWarning(false);

    if (!titlesText.trim()) {
      alert("Please paste your last 10 titles to begin the channel audit.");
      return;
    }

    setIsAuditing(true);

    try {
      const titles = titlesText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).slice(0, 10);
      const titleLints = titles.map((t) => checkTitle(t));

      const hookLines = hooksText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).slice(0, 3);
      const hookScores = hookLines.map((h) => scoreHook(h.replace(/^\d+[\.\)]\s*/, "")));

      const consistency = computeConsistency(uploadDatesText);

      const voice = getVoiceProfile();
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: "audit",
          step: "synthesize",
          input: {
            titleLints,
            hookScores,
            consistency,
          },
          voice,
          feedback,
        }),
      });

      const json = await resp.json();
      if (!resp.ok || json.error) throw new Error(json.error || "Failed to synthesize audit.");

      setAuditResult({
        titleLints,
        hookScores,
        consistencyMetrics: consistency,
        aiAudit: json.data,
      });
      setShipped(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleLoadSample = () => {
    setTitlesText(SAMPLES.audit.titles);
    setHooksText(SAMPLES.audit.recentHooks);
    setUploadDatesText(SAMPLES.audit.uploadDates);
  };

  const formattedAuditText = auditResult
    ? [
        `# CHANNEL AUDIT REPORT`,
        ``,
        `## 1. THE SINGLE BIGGEST FIX`,
        `Diagnosis: ${auditResult.aiAudit.single_biggest_fix.name}`,
        `Action to take this week: ${auditResult.aiAudit.single_biggest_fix.what_to_do_this_week}`,
        ``,
        `## 2. THREE THINGS WORKING WELL`,
        ...auditResult.aiAudit.three_things_working.map((w: string) => `- ${w}`),
        ``,
        `## 3. WHAT NOT TO DO YET`,
        `Avoid: ${auditResult.aiAudit.what_not_to_do_yet.action}`,
        `Why: ${auditResult.aiAudit.what_not_to_do_yet.why}`,
        ``,
        `## 4. DETERMINISTIC METRICS SUMMARY`,
        `- Titles analyzed: ${auditResult.titleLints.length} (Average score: ${Math.round(
          auditResult.titleLints.reduce((a, b) => a + b.score, 0) / auditResult.titleLints.length
        )}/100)`,
        `- Average upload cadence: Every ${auditResult.consistencyMetrics.avgGap} days (Spread std dev: ${auditResult.consistencyMetrics.spreadStdDev}d)`,
        `- Hooks analyzed: ${auditResult.hookScores.length}`,
      ].join("\n")
    : "";

  const handleShip = () => {
    if (!formattedAuditText) return;
    navigator.clipboard.writeText(formattedAuditText);
    saveHistoryRun({
      id: "audit-" + Date.now(),
      module: "audit",
      timestamp: new Date().toISOString(),
      inputSummary: `Audit of ${auditResult?.titleLints.length} titles & ${auditResult?.hookScores.length} hooks`,
      inputData: { titlesCount: auditResult?.titleLints.length },
      outputData: { formattedAuditText, auditResult },
      status: "shipped",
    });
    setShipped(true);
  };

  return (
    <div className="space-y-8 pb-20">
      <VoiceBanner />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="type-label bg-surface-2 border border-line text-txt-2 px-2.5 py-0.5 rounded-pill font-mono">
              /yt-audit
            </span>
            <Sticker label="ONE BIG FIX" variant="red" rotate={-1} />
          </div>
          <h1 className="type-h1 font-black tracking-tight text-txt flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-yt-red" />
            <span>Channel Diagnostic Audit</span>
          </h1>
          <p className="type-body text-txt-2 mt-1 max-w-2xl">
            An audit that lists twenty problems avoids the single one that matters. Ends in ONE fix, 3 working strengths, and what NOT to do.
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={handleLoadSample}
          size="sm"
        >
          Load Golden Sample
        </Button>
      </div>

      {/* Warning for Channel URLs */}
      {channelUrlWarning && (
        <div className="rounded-input border border-bad/30 bg-bad/10 p-4 text-xs text-txt space-y-1">
          <strong className="type-label font-bold text-bad block">READ, DON&rsquo;T SCRAPE</strong>
          <p>
            The app never scrapes YouTube pages or makes external API calls. Instead, paste the text of your last 10 titles and recent opening lines directly into the inputs below.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Card */}
        <div className="lg:col-span-5">
          <Card className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="type-label font-bold text-txt block">
                LAST 10 VIDEO TITLES (ONE PER LINE)
              </label>
              <Textarea
                value={titlesText}
                onChange={(e) => setTitlesText(e.target.value)}
                rows={6}
                placeholder="Paste your last 10 titles as they appear on your channel..."
              />
            </div>

            <div className="space-y-1">
              <label className="type-label font-bold text-txt block">
                OPENING 15S OF 3 MOST RECENT VIDEOS (TRANSCRIPTS)
              </label>
              <Textarea
                value={hooksText}
                onChange={(e) => setHooksText(e.target.value)}
                rows={4}
                placeholder="Paste the first 1-2 sentences of your 3 latest videos..."
              />
            </div>

            <div className="space-y-1">
              <label className="type-label font-bold text-txt block">
                UPLOAD DATES OF LAST 10 VIDEOS (YYYY-MM-DD)
              </label>
              <Textarea
                value={uploadDatesText}
                onChange={(e) => setUploadDatesText(e.target.value)}
                rows={4}
                placeholder="2026-09-01&#10;2026-09-08&#10;2026-09-15..."
              />
            </div>

            <Button
              type="button"
              onClick={() => handleAudit()}
              disabled={!titlesText.trim() || isAuditing}
              className="w-full mt-2"
              size="lg"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isAuditing ? "Synthesizing Channel Audit..." : "Execute Full Channel Audit"}</span>
            </Button>
          </Card>
        </div>

        {/* Right Output Area */}
        <div className="lg:col-span-7 space-y-6">
          {isAuditing && (
            <Card className="p-10 flex flex-col items-center justify-center">
              <EqualizerLoader
                statusTexts={[
                  "Linting 10 titles deterministically...",
                  "Evaluating 3 opening video hooks...",
                  "Calculating upload date gap variance...",
                  "Isolating the single biggest fix...",
                ]}
              />
            </Card>
          )}

          {!isAuditing && auditResult ? (
            <>
              {/* Single Biggest Fix Hero Card */}
              <Card className="p-6 border-yt-red bg-surface-2 space-y-3 shadow-glow ring-1 ring-yt-red">
                <div className="flex items-center justify-between">
                  <span className="type-label text-yt-red font-bold">
                    THE SINGLE BIGGEST FIX
                  </span>
                  <Sticker label="PRIORITY #1" variant="red" rotate={1} />
                </div>
                <div>
                  <h3 className="type-h2 font-black text-txt">
                    {auditResult.aiAudit.single_biggest_fix.name}
                  </h3>
                  <p className="type-body text-txt mt-2">
                    <strong className="text-yt-red">What to do this week:</strong>{" "}
                    {auditResult.aiAudit.single_biggest_fix.what_to_do_this_week}
                  </p>
                </div>
              </Card>

              {/* Three Things Working */}
              <Card className="p-6 border-line bg-surface-1 space-y-3">
                <h4 className="type-label text-ok font-bold">
                  THREE THINGS WORKING WELL (DO NOT CHANGE)
                </h4>
                <div className="space-y-2">
                  {auditResult.aiAudit.three_things_working.map((item: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-input bg-surface-2 border border-line type-small text-txt"
                    >
                      <CheckCircle2 className="h-4 w-4 text-ok shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* What NOT to do yet */}
              <Card className="p-6 border-line bg-surface-1 space-y-3">
                <h4 className="type-label text-warn font-bold">
                  WHAT NOT TO DO YET
                </h4>
                <div className="p-4 rounded-input bg-warn/10 border border-warn/30 text-xs space-y-1.5">
                  <p className="type-body font-bold text-txt">
                    &bull; Avoid: {auditResult.aiAudit.what_not_to_do_yet.action}
                  </p>
                  <p className="type-small text-txt-2">
                    Reason: {auditResult.aiAudit.what_not_to_do_yet.why}
                  </p>
                </div>
              </Card>

              {/* Deterministic Consistency Spread Metric Card */}
              <Card className="p-6 border-line bg-surface-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="type-label font-bold text-txt">UPLOAD CADENCE &amp; SPREAD VARIANCE</span>
                  <Sticker
                    label={auditResult.consistencyMetrics.isConsistent ? "CONSISTENT" : "IRREGULAR"}
                    variant={auditResult.consistencyMetrics.isConsistent ? "ok" : "warn"}
                    rotate={-1}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-input bg-surface-3 border border-line">
                    <span className="type-label text-[10px] text-txt-2 block">AVG GAP</span>
                    <span className="type-tabular text-xl font-black text-txt">
                      Every {auditResult.consistencyMetrics.avgGap} days
                    </span>
                  </div>
                  <div className="p-3 rounded-input bg-surface-3 border border-line">
                    <span className="type-label text-[10px] text-txt-2 block">SPREAD VARIANCE</span>
                    <span className="type-tabular text-xl font-black text-txt">
                      ±{auditResult.consistencyMetrics.spreadStdDev} days
                    </span>
                  </div>
                </div>
              </Card>

              {/* Feed-Size Thumbnail Simulator Grid */}
              <Card className="p-6 border-line space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="type-h3 font-black text-txt">Feed-Size Thumbnail Simulator</h4>
                  <span className="type-label text-txt-2 text-[10px]">168×94 REAL FEED SCALE</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {auditResult.titleLints.slice(0, 3).map((tl, idx) => (
                    <ThumbnailFeedPreview
                      key={idx}
                      title={tl.title}
                      threeWords={`VIDEO ${idx + 1}`}
                    />
                  ))}
                </div>
              </Card>

              <CopyBlock
                content={formattedAuditText}
                title="Channel Audit Report"
                filename="channel_audit.md"
                userInputs={[titlesText, hooksText]}
              />

              <Gate
                onShip={handleShip}
                onChange={(fb) => handleAudit(fb)}
                isIterating={isAuditing}
                shipped={shipped}
              />
            </>
          ) : (
            !isAuditing && (
              <Card className="flex flex-col items-center justify-center min-h-[340px] p-8 text-center border-dashed">
                <div className="type-hero font-black text-line/40 select-none">
                  /yt-audit
                </div>
                <h3 className="type-h3 font-black text-txt mt-2">No Channel Audit Generated</h3>
                <p className="type-small text-txt-2 max-w-sm mt-1">
                  Paste your last 10 titles, 3 recent opening lines, and upload dates to run the complete diagnostic.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleLoadSample}
                  className="mt-4"
                  size="sm"
                >
                  Load Golden Audit Sample
                </Button>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
}
