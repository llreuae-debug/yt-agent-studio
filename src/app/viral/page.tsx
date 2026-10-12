"use client";

import { useState } from "react";
import { Flame, Sliders, Terminal, Download, Sparkles, Copy, Check, TrendingUp } from "lucide-react";
import { analyzeOutliers, SwipeAnalysisResult, VideoInput } from "@/lib/tools/swipe";
import { TooltipInfo } from "@/components/common/TooltipInfo";
import { CopyBlock } from "@/components/common/CopyBlock";
import { Gate } from "@/components/common/Gate";
import { VoiceBanner } from "@/components/shell/VoiceBanner";
import { saveHistoryRun, getVoiceProfile, downloadFile } from "@/lib/storage";
import { SAMPLES } from "@/data/samples";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Sticker } from "@/components/ui/Sticker";
import { Chip } from "@/components/ui/Chip";
import { EqualizerLoader } from "@/components/ui/EqualizerLoader";

export default function ViralPage() {
  const [dataInput, setDataInput] = useState("");
  const [minMultiple, setMinMultiple] = useState<number>(1.5);
  const [result, setResult] = useState<SwipeAnalysisResult | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [shipped, setShipped] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const helperCommand = "yt-dlp --flat-playlist -J <channel_url>";

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(helperCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const parseVideos = (raw: string): VideoInput[] => {
    try {
      const d = JSON.parse(raw);
      return Array.isArray(d) ? d : d.videos || [];
    } catch {
      const lines = raw.split(/\r?\n/).filter((l) => l.trim());
      const vids: VideoInput[] = [];
      for (const line of lines) {
        const parts = line.split(",").map((p) => p.trim());
        if (parts.length >= 3 && !isNaN(parseFloat(parts[2]))) {
          vids.push({
            channel: parts[0],
            title: parts[1],
            views: parseFloat(parts[2]),
            url: parts[3] || "",
            duration: parts[4] || "",
          });
        }
      }
      return vids;
    }
  };

  const handleCompute = async (raw: string = dataInput, minM: number = minMultiple, feedback?: string) => {
    if (!raw.trim()) return;
    const videos = parseVideos(raw);
    if (!videos.length) {
      alert("Could not parse video list. Ensure format is JSON or CSV with channel, title, views.");
      return;
    }

    const res = analyzeOutliers(videos, minM);
    setResult(res);
    setShipped(false);

    if (res.outliers.length > 0) {
      setIsAnalyzing(true);
      try {
        const voice = getVoiceProfile();
        const resp = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            module: "viral",
            step: "analyze",
            input: { outliers: res },
            voice,
            feedback,
          }),
        });
        const json = await resp.json();
        if (json.data) {
          setAiAnalysis(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleLoadSample = () => {
    setDataInput(SAMPLES.viral.jsonVideos);
    setMinMultiple(2.0);
    handleCompute(SAMPLES.viral.jsonVideos, 2.0);
  };

  const handleShip = () => {
    if (!result) return;
    const summary = `${result.outliers.length} Outliers (min ${minMultiple}x)`;
    saveHistoryRun({
      id: "viral-" + Date.now(),
      module: "viral",
      timestamp: new Date().toISOString(),
      inputSummary: summary,
      inputData: { minMultiple },
      outputData: { result, aiAnalysis },
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
              /yt-viral
            </span>
            <Sticker label="MEDIAN MULTIPLIERS" variant="red" rotate={-2} />
          </div>
          <h1 className="type-h1 font-black tracking-tight text-txt flex items-center gap-3">
            <Flame className="h-8 w-8 text-yt-red" />
            <span>Niche Outliers &amp; Swipe Analysis</span>
          </h1>
          <p className="type-body text-txt-2 mt-1 max-w-2xl">
            Raw views measure subscriber size. This tool calculates how far each video beat its channel&rsquo;s own median views.
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={handleLoadSample}
          size="sm"
        >
          Load Golden Sample (2.0x)
        </Button>
      </div>

      {/* yt-dlp Local Helper Terminal Banner */}
      <Card className="p-5 border-line bg-surface-2 space-y-2">
        <div className="flex items-center justify-between">
          <span className="type-label font-bold text-txt flex items-center gap-2">
            <Terminal className="h-4 w-4 text-yt-red" />
            <span>COLLECT CHANNEL DATA LOCALLY (NO CLOUD SCRAPING)</span>
          </span>
          <button
            onClick={handleCopyCmd}
            className="flex items-center gap-1.5 type-label text-[10px] text-txt-2 hover:text-txt"
          >
            {copiedCmd ? <Check className="h-3.5 w-3.5 text-ok" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedCmd ? "COPIED" : "COPY COMMAND"}</span>
          </button>
        </div>
        <p className="type-small text-txt-2">
          Run this on your terminal with <code className="font-mono text-txt bg-surface-3 px-1.5 py-0.5 rounded">yt-dlp</code> to get video metadata in JSON:
        </p>
        <div className="rounded-input border border-line bg-black p-3 font-mono text-xs text-ok overflow-x-auto select-all">
          {helperCommand}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-5">
          <Card className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="type-label font-bold text-txt block">
                COLLECTED VIDEOS (JSON OR CSV)
              </label>
              <Textarea
                value={dataInput}
                onChange={(e) => setDataInput(e.target.value)}
                rows={8}
                placeholder='[{"channel":"Channel Name","title":"Title","views":300000,"url":"https://..."}, ...]'
              />
            </div>

            {/* Min Multiple Slider */}
            <div className="rounded-input border border-line bg-surface-2 p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="type-label font-bold text-txt flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-yt-red" />
                  <span>MIN MULTIPLE THRESHOLD</span>
                </span>
                <span className="type-tabular font-black text-yt-red text-sm">{minMultiple.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="10.0"
                step="0.1"
                value={minMultiple}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setMinMultiple(val);
                  if (dataInput) handleCompute(dataInput, val);
                }}
                className="w-full accent-yt-red cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-txt-2 font-mono">
                <span>1.0x (Above Median)</span>
                <span>1.5x (Standard)</span>
                <span>2.0x (Breakout)</span>
                <span>10.0x (Mega Viral)</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => handleCompute()}
              disabled={!dataInput.trim() || isAnalyzing}
              className="w-full mt-2"
              size="lg"
            >
              <Flame className="h-4 w-4" />
              <span>{isAnalyzing ? "Analyzing Outliers..." : "Rank Multiples & Classify Formulas"}</span>
            </Button>
          </Card>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 space-y-6">
          {isAnalyzing && (
            <Card className="p-10 flex flex-col items-center justify-center">
              <EqualizerLoader
                statusTexts={[
                  "Calculating channel medians...",
                  "Extracting outlier multiples...",
                  "Classifying winning title formulas...",
                  "Synthesizing production recommendations...",
                ]}
              />
            </Card>
          )}

          {!isAnalyzing && result ? (
            <>
              {/* AI Takeaways */}
              {aiAnalysis && (
                <Card className="p-6 border-line bg-surface-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="type-label font-bold text-yt-red">
                      STRUCTURAL BREAKDOWN
                    </span>
                    <Sticker label="TAKEAWAY" variant="red" rotate={1} />
                  </div>
                  <div>
                    <h4 className="type-h3 font-black text-txt">The One Structural Thing They Share:</h4>
                    <p className="type-body text-txt-2 mt-1">{aiAnalysis.one_structural_thing}</p>
                  </div>
                  <div className="border-t border-line pt-3">
                    <h4 className="type-h3 font-black text-txt">What You Could Realistically Make This Week:</h4>
                    <p className="type-body font-bold text-yt-red mt-1">&ldquo;{aiAnalysis.recommended_to_make_this_week}&rdquo;</p>
                    <p className="type-small text-txt-2 mt-1">{aiAnalysis.why_fits_voice_and_capacity}</p>
                  </div>
                </Card>
              )}

              {/* Thin Channels Warning */}
              {result.skipped_thin_channels.length > 0 && (
                <div className="rounded-input border border-warn/30 bg-warn/10 p-4 text-xs text-txt">
                  <strong className="type-label text-warn block mb-1">SKIPPED {result.skipped_thin_channels.length} CHANNEL(S) UNDER 4 VIDEOS</strong>
                  A median calculated from 1-2 videos is statistical noise. Skipped: {result.skipped_thin_channels.map(([c, n]) => `${c} (${n} vid)`).join(", ")}.
                </div>
              )}

              {/* Formula Tally Among Outliers */}
              {Object.keys(result.formulaCounts).length > 0 && (
                <Card className="p-5 border-line">
                  <h4 className="type-label text-txt-2 font-bold mb-3">
                    FORMULA TALLY AMONG OUTLIERS
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(result.formulaCounts).map(([formula, count]) => (
                      <div
                        key={formula}
                        className="rounded-pill bg-surface-2 border border-line px-3 py-1.5 text-xs font-bold text-txt flex items-center gap-2"
                      >
                        <span className="text-yt-red font-black font-condensed">{count}x</span>
                        <span>{formula}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Outliers Table */}
              <Card className="overflow-hidden border-line p-0">
                <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-surface-2 border-b border-line text-txt-2 type-label text-[10px]">
                      <tr>
                        <th className="p-3">Multiple</th>
                        <th className="p-3">Formula</th>
                        <th className="p-3">Views vs Median</th>
                        <th className="p-3">Video Title</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {result.outliers.map((row, idx) => (
                        <tr key={idx} className="hover:bg-surface-2/60 transition-colors">
                          <td className="p-3">
                            <span className="text-base font-black font-condensed type-tabular text-ok px-2 py-0.5 rounded-pill bg-ok/10 border border-ok/30 inline-block">
                              {row.multiple.toFixed(2)}x
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="type-label text-[10px] px-2 py-0.5 rounded-pill bg-surface-3 text-txt">
                              {row.formula}
                            </span>
                          </td>
                          <td className="p-3 text-txt-2 type-tabular">
                            <strong className="text-txt">{row.views.toLocaleString()}</strong> vs {row.median.toLocaleString()}
                          </td>
                          <td className="p-3 text-txt font-bold max-w-xs truncate">
                            {row.title}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Gate */}
              <Gate
                onShip={handleShip}
                onChange={(fb) => handleCompute(dataInput, minMultiple, fb)}
                isIterating={isAnalyzing}
                shipped={shipped}
              />
            </>
          ) : (
            !isAnalyzing && (
              <Card className="flex flex-col items-center justify-center min-h-[340px] p-8 text-center border-dashed">
                <div className="type-hero font-black text-line/40 select-none">
                  /yt-viral
                </div>
                <h3 className="type-h3 font-black text-txt mt-2">No Outlier Data Loaded</h3>
                <p className="type-small text-txt-2 max-w-sm mt-1">
                  Paste collected channel videos to rank which videos out-performed their channels and identify winning title formulas.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleLoadSample}
                  className="mt-4"
                  size="sm"
                >
                  Load Golden Sample Data
                </Button>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
}
