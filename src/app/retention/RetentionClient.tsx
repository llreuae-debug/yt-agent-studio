"use client";

import { useState } from "react";
import Link from "next/link";
import { LineChart as LineChartIcon, ArrowRight, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { parseRetentionCsv, computeRetention, RetentionResult } from "@/lib/tools/retention";
import { parseTranscript } from "@/lib/tools/deadair";
import { RetentionChart } from "@/components/modules/RetentionChart";
import { CopyBlock } from "@/components/common/CopyBlock";
import { Gate } from "@/components/common/Gate";
import { VoiceBanner } from "@/components/shell/VoiceBanner";
import { saveHistoryRun, getVoiceProfile } from "@/lib/storage";
import { SAMPLES } from "@/data/samples";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Sticker } from "@/components/ui/Sticker";
import { EqualizerLoader } from "@/components/ui/EqualizerLoader";

export default function RetentionPage() {
  const [csvText, setCsvText] = useState("");
  const [durationSec, setDurationSec] = useState<number>(600);
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState<RetentionResult | null>(null);
  const [aiAdvice, setAiAdvice] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSecondary, setShowSecondary] = useState(false);
  const [shipped, setShipped] = useState(false);

  const handleCompute = async (
    csvContent: string = csvText,
    dur: number = durationSec,
    trText: string = transcript,
    feedback?: string
  ) => {
    if (!csvContent.trim()) return;
    try {
      const rows = parseRetentionCsv(csvContent);
      const cues = trText.trim() ? parseTranscript(trText) : undefined;
      const res = computeRetention(rows, dur || undefined, cues);
      setResult(res);
      setShipped(false);

      setIsAnalyzing(true);
      const voice = getVoiceProfile();
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: "retention",
          step: "advice",
          input: { metrics: res },
          voice,
          feedback,
        }),
      });

      const json = await resp.json();
      if (json.data) {
        setAiAdvice(json.data);
      }
    } catch (err: any) {
      alert(`Error processing retention data: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadSample = () => {
    setCsvText(SAMPLES.retention.csv);
    setDurationSec(SAMPLES.retention.duration);
    setTranscript(SAMPLES.edit.transcript);
    handleCompute(SAMPLES.retention.csv, SAMPLES.retention.duration, SAMPLES.edit.transcript);
  };

  const handleShip = () => {
    if (!result) return;
    const summary = `Hook Leak: ${result.hook_leak}% [${result.verdict}], Slide: ${result.slide_per_unit}%/unit`;
    saveHistoryRun({
      id: "retention-" + Date.now(),
      module: "retention",
      timestamp: new Date().toISOString(),
      inputSummary: summary,
      inputData: { durationSec },
      outputData: { result, aiAdvice },
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
              /yt-retention
            </span>
            <Sticker label="AUDIENCE LEAKS" variant="red" rotate={-1} />
          </div>
          <h1 className="type-h1 font-black tracking-tight text-txt flex items-center gap-3">
            <LineChartIcon className="h-8 w-8 text-yt-red" />
            <span>Audience Retention Reader</span>
          </h1>
          <p className="type-body text-txt-2 mt-1 max-w-2xl">
            Export path: YouTube Studio &rarr; Video &rarr; Analytics &rarr; Engagement &rarr; Retention Chart &rarr; Download &ldquo;Audience retention&rdquo;.
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
            <div className="space-y-1">
              <label className="type-label font-bold text-txt block">
                RETENTION CSV DATA (POSITION, WATCH %)
              </label>
              <Textarea
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                rows={8}
                placeholder="Paste Studio retention CSV (e.g. 0,100 / 5,88 / 10,76...)"
              />
            </div>

            <div className="space-y-1">
              <label className="type-label font-bold text-txt block">
                VIDEO DURATION (SECONDS)
              </label>
              <Input
                type="number"
                value={durationSec}
                onChange={(e) => setDurationSec(parseFloat(e.target.value) || 0)}
                placeholder="e.g. 600"
              />
            </div>

            <div className="space-y-1">
              <label className="type-label font-bold text-txt block">
                OPTIONAL TRANSCRIPT (MAPPINGS AT CLIFFS)
              </label>
              <Textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={4}
                placeholder="Paste timestamped transcript to map spoken words directly onto dropoff cliffs..."
              />
            </div>

            <Button
              type="button"
              onClick={() => handleCompute()}
              disabled={!csvText.trim() || isAnalyzing}
              className="w-full mt-2"
              size="lg"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isAnalyzing ? "Analyzing Retention..." : "Read Retention & Find Leaks"}</span>
            </Button>
          </Card>
        </div>

        {/* Right Output Area */}
        <div className="lg:col-span-7 space-y-6">
          {isAnalyzing && (
            <Card className="p-10 flex flex-col items-center justify-center">
              <EqualizerLoader
                statusTexts={[
                  "Parsing Studio CSV data points...",
                  "Calculating first-30s hook leak percentage...",
                  "Detecting steep cliffs (>5% drops)...",
                  "Synthesizing the single biggest fix...",
                ]}
              />
            </Card>
          )}

          {!isAnalyzing && result ? (
            <>
              {/* Primary AI Recommendation (ONE fix, not twenty) */}
              {aiAdvice && (
                <Card className="p-6 border-line bg-surface-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="type-label text-yt-red font-bold">
                      PRIMARY RECOMMENDATION (1 FIX)
                    </span>
                    {aiAdvice.is_packaging_problem && (
                      <Link
                        href="/package"
                        className="flex items-center gap-1.5 rounded-pill bg-yt-red text-white px-3 py-1 text-xs font-bold shadow-glow hover:bg-yt-red-ink transition-colors"
                      >
                        <span>Send to /yt-package</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>

                  <div>
                    <h3 className="type-h3 font-black text-txt">
                      {aiAdvice.single_biggest_leak}
                    </h3>
                    <p className="type-body text-txt-2 mt-1">
                      {aiAdvice.one_change}
                    </p>
                  </div>

                  {aiAdvice.secondary_notes?.length > 0 && (
                    <div className="border-t border-line pt-3">
                      <button
                        type="button"
                        onClick={() => setShowSecondary(!showSecondary)}
                        className="flex items-center gap-1.5 type-label text-[11px] text-txt-2 hover:text-txt"
                      >
                        <span>{showSecondary ? "HIDE SECONDARY OBSERVATIONS" : "SHOW EVERYTHING ELSE"}</span>
                        {showSecondary ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </button>

                      {showSecondary && (
                        <ul className="mt-3 space-y-1.5 text-xs text-txt-2 list-disc list-inside">
                          {aiAdvice.secondary_notes.map((note: string, idx: number) => (
                            <li key={idx} className="leading-relaxed">{note}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </Card>
              )}

              {/* Chart & Deterministic Metrics */}
              <RetentionChart data={result} />

              {/* Gate Bar */}
              <Gate
                onShip={handleShip}
                onChange={(fb) => handleCompute(csvText, durationSec, transcript, fb)}
                isIterating={isAnalyzing}
                shipped={shipped}
              />
            </>
          ) : (
            !isAnalyzing && (
              <Card className="flex flex-col items-center justify-center min-h-[340px] p-8 text-center border-dashed">
                <div className="type-hero font-black text-line/40 select-none">
                  /yt-retention
                </div>
                <h3 className="type-h3 font-black text-txt mt-2">No Retention CSV Loaded</h3>
                <p className="type-small text-txt-2 max-w-sm mt-1">
                  Paste your Studio audience retention export data to inspect hook leak, steep drop cliffs, and middle slide.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleLoadSample}
                  className="mt-4"
                  size="sm"
                >
                  Load Golden Retention Sample
                </Button>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
}
