"use client";

import { useState } from "react";
import { Bookmark, Sparkles, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { parseTranscript } from "@/lib/tools/deadair";
import { computeChapters, ChaptersResult } from "@/lib/tools/chapters";
import { TranscriptInput } from "@/components/common/TranscriptInput";
import { CopyBlock } from "@/components/common/CopyBlock";
import { Gate } from "@/components/common/Gate";
import { VoiceBanner } from "@/components/shell/VoiceBanner";
import { saveHistoryRun, getVoiceProfile } from "@/lib/storage";
import { SAMPLES } from "@/data/samples";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Sticker } from "@/components/ui/Sticker";
import { EqualizerLoader } from "@/components/ui/EqualizerLoader";

export default function ChaptersPage() {
  const [transcript, setTranscript] = useState("");
  const [targetCount, setTargetCount] = useState<number>(7);
  const [chaptersResult, setChaptersResult] = useState<ChaptersResult | null>(null);
  const [relabelledChapters, setRelabelledChapters] = useState<{ start: number; label: string; title: string; filler?: boolean }[]>([]);
  const [isRetitling, setIsRetitling] = useState(false);
  const [shipped, setShipped] = useState(false);

  const handleCompute = async (trText: string = transcript, target: number = targetCount, feedback?: string) => {
    if (!trText.trim()) return;
    const cues = parseTranscript(trText);
    if (cues.length < 6) {
      alert("Too few cues to chapter (minimum 6 cues required).");
      return;
    }

    const res = computeChapters(cues, target);
    setChaptersResult(res);
    setShipped(false);

    if (res.valid) {
      setIsRetitling(true);
      try {
        const voice = getVoiceProfile();
        const resp = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            module: "chapters",
            step: "retitle",
            input: { chapters: res.chapters },
            voice,
            feedback,
          }),
        });

        const json = await resp.json();
        if (json.data?.relabelled_chapters) {
          setRelabelledChapters(
            json.data.relabelled_chapters.map((rc: any) => ({
              start: rc.start,
              label: rc.label,
              title: rc.relabelled_title,
              filler: rc.flagged_filler,
            }))
          );
        } else {
          setRelabelledChapters(
            res.chapters.map((c) => ({
              start: c.start,
              label: c.label,
              title: c.draft_title,
            }))
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsRetitling(false);
      }
    }
  };

  const handleLoadSample = () => {
    setTranscript(SAMPLES.chapters.transcript);
    setTargetCount(SAMPLES.chapters.target);
    handleCompute(SAMPLES.chapters.transcript, SAMPLES.chapters.target);
  };

  const formattedChaptersBlock =
    relabelledChapters.length > 0
      ? relabelledChapters.map((c) => `${c.label} ${c.title}`).join("\n")
      : chaptersResult?.chapters.map((c) => `${c.label} ${c.draft_title}`).join("\n") || "";

  const isFinalValid =
    chaptersResult?.valid && (relabelledChapters.length >= 3 || (chaptersResult?.chapters.length || 0) >= 3);

  const activeChapters = relabelledChapters.length > 0 ? relabelledChapters : chaptersResult?.chapters.map(c => ({
    start: c.start,
    label: c.label,
    title: c.draft_title,
    filler: false,
  })) || [];

  const handleShip = () => {
    if (!formattedChaptersBlock) return;
    navigator.clipboard.writeText(formattedChaptersBlock);
    saveHistoryRun({
      id: "chapters-" + Date.now(),
      module: "chapters",
      timestamp: new Date().toISOString(),
      inputSummary: `${activeChapters.length} Chapters (${isFinalValid ? "Valid" : "Invalid"})`,
      inputData: { targetCount },
      outputData: { formattedChaptersBlock, chaptersResult },
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
              /yt-chapters
            </span>
            <Sticker label="0:00 ENFORCED" variant="ok" rotate={-1} />
          </div>
          <h1 className="type-h1 font-black tracking-tight text-txt flex items-center gap-3">
            <Bookmark className="h-8 w-8 text-yt-red" />
            <span>YouTube Chapters Generator</span>
          </h1>
          <p className="type-body text-txt-2 mt-1 max-w-2xl">
            Strict algorithm compliance: first timestamp is always 0:00, at least 3 chapters, each section at least 10 seconds.
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
        {/* Left Inputs */}
        <div className="lg:col-span-5">
          <Card className="p-6 space-y-4">
            <TranscriptInput
              value={transcript}
              onChange={(val) => {
                setTranscript(val);
                handleCompute(val, targetCount);
              }}
              placeholder="Paste transcript (.srt, .vtt, whisper .json)..."
            />

            <div className="space-y-1">
              <label className="type-label font-bold text-txt block">
                TARGET NUMBER OF CHAPTERS
              </label>
              <Input
                type="number"
                min={3}
                max={25}
                value={targetCount}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 7;
                  setTargetCount(val);
                  if (transcript) handleCompute(transcript, val);
                }}
              />
            </div>

            <Button
              type="button"
              onClick={() => handleCompute()}
              disabled={!transcript.trim() || isRetitling}
              className="w-full mt-2"
              size="lg"
            >
              <Bookmark className="h-4 w-4" />
              <span>{isRetitling ? "Retitling in Your Voice..." : "Extract & Retitle Chapters"}</span>
            </Button>
          </Card>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 space-y-6">
          {isRetitling && (
            <Card className="p-10 flex flex-col items-center justify-center">
              <EqualizerLoader
                statusTexts={[
                  "Enforcing 0:00 YouTube requirement...",
                  "Calculating topic boundary gaps...",
                  "Retitling sections under 5 words in your voice...",
                ]}
              />
            </Card>
          )}

          {!isRetitling && chaptersResult ? (
            <div className="space-y-6">
              {/* Live Validity Badge */}
              <div
                className={`flex items-center justify-between rounded-pill border px-5 py-3 text-xs font-bold ${
                  isFinalValid
                    ? "bg-ok/10 border-ok/30 text-ok"
                    : "bg-bad/10 border-bad/30 text-bad"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isFinalValid ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  <span>
                    {isFinalValid
                      ? "YouTube Validated: Meets 0:00 start, 3+ chapters, and 10s minimum requirements."
                      : "INVALID CHAPTER LIST: YouTube will silently reject this block in the description."}
                  </span>
                </div>
                <Sticker label={isFinalValid ? "VALIDATED" : "BLOCKED"} variant={isFinalValid ? "ok" : "bad"} rotate={1} />
              </div>

              {/* Vertical Timeline with Timecode Pills */}
              {isFinalValid && activeChapters.length > 0 && (
                <Card className="p-6 border-line space-y-4">
                  <h4 className="type-h3 font-black text-txt">Chapter Timeline</h4>
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-line">
                    {activeChapters.map((ch, idx) => (
                      <div key={idx} className="relative flex items-start gap-4 group">
                        {/* Timeline marker */}
                        <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-yt-red bg-surface-1 group-hover:scale-125 transition-transform" />

                        {/* Timecode pill */}
                        <span className="type-tabular font-mono text-xs font-black px-3 py-1 rounded-pill bg-surface-2 border border-line text-txt group-hover:border-yt-red transition-colors shrink-0">
                          {ch.label}
                        </span>

                        {/* Title & filler chip */}
                        <div className="space-y-1">
                          <p className="type-body font-bold text-txt leading-snug">
                            {ch.title}
                          </p>
                          {ch.filler && (
                            <span className="type-label text-[9px] text-warn bg-warn/10 border border-warn/30 px-2 py-0.5 rounded-pill inline-block">
                              POSSIBLE FILLER TITLE
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Paste-Ready Block */}
              {isFinalValid ? (
                <>
                  <CopyBlock
                    content={formattedChaptersBlock}
                    title="Paste-Ready Description Chapters"
                    filename="youtube_chapters.txt"
                  />

                  <Gate
                    onShip={handleShip}
                    onChange={(fb) => handleCompute(transcript, targetCount, fb)}
                    isIterating={isRetitling}
                    shipped={shipped}
                  />
                </>
              ) : (
                <Card className="p-6 border-bad/30 bg-bad/10 text-xs space-y-3">
                  <h4 className="type-label font-bold text-bad">VALIDATION ERRORS DETECTED:</h4>
                  <ul className="list-disc list-inside space-y-1 text-txt">
                    {chaptersResult.validationErrors?.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                  <p className="type-small text-txt-2 pt-2">
                    Never present invalid chapters as ready. Add more content or adjust chapter count.
                  </p>
                </Card>
              )}
            </div>
          ) : (
            !isRetitling && (
              <Card className="flex flex-col items-center justify-center min-h-[340px] p-8 text-center border-dashed">
                <div className="type-hero font-black text-line/40 select-none">
                  /yt-chapters
                </div>
                <h3 className="type-h3 font-black text-txt mt-2">No Chapters Generated</h3>
                <p className="type-small text-txt-2 max-w-sm mt-1">
                  Upload or paste a timestamped transcript to extract natural topic pauses and generate verified YouTube chapters.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleLoadSample}
                  className="mt-4"
                  size="sm"
                >
                  Load Golden Sample (3 Chapters)
                </Button>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
}
