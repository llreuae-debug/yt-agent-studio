"use client";

import { useState } from "react";
import { Film, Sparkles, Smartphone, RotateCcw, Clock } from "lucide-react";
import { score as scoreHook } from "@/lib/tools/hookscore";
import { HookScorePanel } from "@/components/modules/HookScorePanel";
import { TranscriptInput } from "@/components/common/TranscriptInput";
import { CopyBlock } from "@/components/common/CopyBlock";
import { Gate } from "@/components/common/Gate";
import { VoiceBanner } from "@/components/shell/VoiceBanner";
import { saveHistoryRun, getVoiceProfile } from "@/lib/storage";
import { SAMPLES } from "@/data/samples";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sticker } from "@/components/ui/Sticker";
import { EqualizerLoader } from "@/components/ui/EqualizerLoader";

export default function ShortsPage() {
  const [transcript, setTranscript] = useState("");
  const [isFinding, setIsFinding] = useState(false);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedShortIdx, setSelectedShortIdx] = useState<number>(0);
  const [shipped, setShipped] = useState(false);

  const handleFindShorts = async (feedback?: string) => {
    if (!transcript.trim()) return;
    setIsFinding(true);

    try {
      const voice = getVoiceProfile();
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: "shorts",
          step: "find_spans",
          input: { transcript },
          voice,
          feedback,
        }),
      });

      const json = await resp.json();
      if (!resp.ok || json.error) throw new Error(json.error || "Failed to find Shorts candidates");

      const rawCandidates = json.data?.candidates || [];
      const validSpans = rawCandidates.filter(
        (c: any) => c.duration_seconds >= 20 && c.duration_seconds <= 55
      );

      const scoredCandidates = (validSpans.length ? validSpans : rawCandidates).map((c: any) => ({
        ...c,
        hookScore: scoreHook(c.new_first_line),
      }));

      setCandidates(scoredCandidates);
      setSelectedShortIdx(0);
      setShipped(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsFinding(false);
    }
  };

  const handleLoadSample = () => {
    setTranscript(SAMPLES.shorts.transcript);
  };

  const selectedCandidate = candidates[selectedShortIdx];

  const formattedShortsText = selectedCandidate
    ? [
        `# SHORT CUT SPECIFICATION`,
        `Timecode Span: ${selectedCandidate.span_start_timecode} -> ${selectedCandidate.span_end_timecode} (${selectedCandidate.duration_seconds}s)`,
        `Original Opening Line: "${selectedCandidate.opening_line}"`,
        ``,
        `## 1. REPLACED FIRST LINE (HOOK SCORE: ${selectedCandidate.hookScore.verdict}/100 [${selectedCandidate.hookScore.band}])`,
        `Spoken: "${selectedCandidate.new_first_line}"`,
        `Formula: ${selectedCandidate.hookScore.formula}`,
        ``,
        `## 2. ON-SCREEN TEXT (FIRST 2 SECONDS)`,
        `"${selectedCandidate.on_screen_text_2s}" (Different words from spoken line)`,
        ``,
        `## 3. LOOP POINT`,
        `${selectedCandidate.loop_point}`,
        ``,
        `## 4. VERTICAL FRAMING NOTE (9:16 CROP)`,
        `${selectedCandidate.vertical_crop_note}`,
      ].join("\n")
    : "";

  const handleShip = () => {
    if (!formattedShortsText) return;
    navigator.clipboard.writeText(formattedShortsText);
    saveHistoryRun({
      id: "shorts-" + Date.now(),
      module: "shorts",
      timestamp: new Date().toISOString(),
      inputSummary: `Short: ${selectedCandidate.new_first_line.slice(0, 50)}...`,
      inputData: { span: `${selectedCandidate.span_start_timecode} - ${selectedCandidate.span_end_timecode}` },
      outputData: { formattedShortsText, selectedCandidate },
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
              /yt-shorts
            </span>
            <Sticker label="20-55s SPANS" variant="red" rotate={-1} />
          </div>
          <h1 className="type-h1 font-black tracking-tight text-txt flex items-center gap-3">
            <Film className="h-8 w-8 text-yt-red" />
            <span>Shorts Cutter &amp; Repurposer</span>
          </h1>
          <p className="type-body text-txt-2 mt-1 max-w-2xl">
            Finds 20-55s self-contained spans that survive without the surrounding video, scores a replacement hook, and designs seamless loop points.
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Card */}
        <div className="lg:col-span-5">
          <Card className="p-6 space-y-4">
            <TranscriptInput
              value={transcript}
              onChange={(val) => setTranscript(val)}
              placeholder="Paste long-video transcript with timestamps..."
            />

            <div className="rounded-input border border-line bg-surface-2 p-3.5 text-xs text-txt-2 space-y-1">
              <strong className="type-label font-bold text-txt block">SELECTION CRITERIA</strong>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                <li>Spans must be strictly between 20 and 55 seconds</li>
                <li>Opens on a complete independent thought</li>
                <li>Has a sharp turn (complication or proof)</li>
                <li>Ends on a punchline, never a trail-off</li>
              </ul>
            </div>

            <Button
              type="button"
              onClick={() => handleFindShorts()}
              disabled={!transcript.trim() || isFinding}
              className="w-full mt-2"
              size="lg"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isFinding ? "Finding 20-55s Spans..." : "Find Candidate Shorts"}</span>
            </Button>
          </Card>
        </div>

        {/* Right Output Area */}
        <div className="lg:col-span-7 space-y-6">
          {isFinding && (
            <Card className="p-10 flex flex-col items-center justify-center">
              <EqualizerLoader
                statusTexts={[
                  "Scanning transcript for self-contained 20-55s spans...",
                  "Synthesizing punchy replacement opening lines...",
                  "Evaluating hook scores across 21 formulas...",
                  "Designing 2s on-screen overlays and loop points...",
                ]}
              />
            </Card>
          )}

          {!isFinding && candidates.length > 0 && (
            <div className="space-y-6">
              {/* Candidates Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="type-h3 font-black text-txt">Candidate Spans (Ranked)</h3>
                  <span className="type-label text-txt-2 text-[10px]">SELECT TO INSPECT</span>
                </div>
                <div className="space-y-2">
                  {candidates.map((c, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedShortIdx(idx)}
                      className={`rounded-card border p-4 cursor-pointer transition-all ${
                        selectedShortIdx === idx
                          ? "border-yt-red bg-surface-2 shadow-glow ring-2 ring-yt-red"
                          : "border-line bg-surface-1 hover:border-line hover:bg-surface-2"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5 flex-wrap gap-2">
                        <span className="type-tabular font-black text-yt-red flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{c.span_start_timecode} &rarr; {c.span_end_timecode}</span>
                          <span className="px-2 py-0.5 rounded-pill bg-yt-red/10 text-yt-red text-[10px]">
                            {c.duration_seconds}s
                          </span>
                        </span>
                        <span className="type-label text-[10px] font-bold text-ok bg-ok/10 border border-ok/30 px-2 py-0.5 rounded-pill">
                          HOOK: {c.hookScore.verdict}/100 [{c.hookScore.band}]
                        </span>
                      </div>
                      <p className="type-body text-txt font-bold line-clamp-1">
                        &ldquo;{c.opening_line}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Candidate Detailed Production Card */}
              {selectedCandidate && (
                <div className="space-y-4">
                  <Card className="p-6 border-line space-y-5">
                    <div className="flex items-center justify-between border-b border-line pb-3">
                      <h4 className="type-h3 font-black text-txt">Short Production Blueprint</h4>
                      <Sticker label="9:16 READY" variant="red" rotate={-1} />
                    </div>

                    {/* Replacement Hook Scored Panel */}
                    <div>
                      <span className="type-label font-bold text-txt-2 block mb-2">
                        REPLACEMENT FIRST LINE (OPENING HOOK)
                      </span>
                      <HookScorePanel scoreResult={selectedCandidate.hookScore} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-line pt-4">
                      {/* On-screen text badge */}
                      <div className="space-y-2">
                        <span className="type-label text-txt-2 block text-[10px]">
                          ON-SCREEN TEXT (FIRST 2 SECONDS)
                        </span>
                        <div className="p-3.5 rounded-input bg-surface-2 border border-line">
                          <span className="type-label text-yt-red block text-[10px] mb-1">2S OVERLAY:</span>
                          <p className="type-body font-black text-txt leading-snug">
                            {selectedCandidate.on_screen_text_2s}
                          </p>
                        </div>
                      </div>

                      {/* Loop point */}
                      <div className="space-y-2">
                        <span className="type-label text-txt-2 block text-[10px]">
                          LOOP POINT SETUP
                        </span>
                        <div className="p-3.5 rounded-input bg-surface-2 border border-line">
                          <span className="type-label text-ok block text-[10px] mb-1">END-TO-START TRANSITION:</span>
                          <p className="type-small text-txt font-medium leading-relaxed">
                            {selectedCandidate.loop_point}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 9:16 Vertical crop visual guide */}
                    <div className="border-t border-line pt-4 flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-16 h-28 rounded-input bg-black border border-line flex flex-col items-center justify-between p-1.5 shrink-0 text-center select-none shadow-md">
                        <span className="text-[7px] text-txt-2 font-mono">9:16 CROP</span>
                        <div className="w-8 h-8 rounded-full border border-dashed border-yt-red flex items-center justify-center">
                          <span className="text-[6px] text-yt-red font-bold">TALK</span>
                        </div>
                        <span className="text-[6px] text-txt-2 font-mono">SAFE ZONE</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <span className="type-label font-bold text-txt block">
                          VERTICAL FRAMING INSTRUCTION
                        </span>
                        <p className="type-small text-txt-2 leading-relaxed">
                          {selectedCandidate.vertical_crop_note}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <CopyBlock
                    content={formattedShortsText}
                    title="Short Cut Blueprint"
                    filename="short_spec.md"
                  />

                  <Gate
                    onShip={handleShip}
                    onChange={(fb) => handleFindShorts(fb)}
                    isIterating={isFinding}
                    shipped={shipped}
                  />
                </div>
              )}
            </div>
          )}

          {!isFinding && !candidates.length && (
            <Card className="flex flex-col items-center justify-center min-h-[340px] p-8 text-center border-dashed">
              <div className="type-hero font-black text-line/40 select-none">
                /yt-shorts
              </div>
              <h3 className="type-h3 font-black text-txt mt-2">No Shorts Extracted</h3>
              <p className="type-small text-txt-2 max-w-sm mt-1">
                Paste a long-video transcript to find moments between 20 and 55 seconds that survive without the surrounding context.
              </p>
              <Button
                type="button"
                variant="secondary"
                onClick={handleLoadSample}
                className="mt-4"
                size="sm"
              >
                Load Golden Sample Transcript
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
