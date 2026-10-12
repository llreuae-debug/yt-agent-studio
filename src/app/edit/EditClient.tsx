"use client";

import { useState } from "react";
import { Scissors, AlertTriangle, Download, Sliders, VolumeX, MessageSquareWarning, RotateCcw } from "lucide-react";
import { parseTranscript, computeDeadAir, DeadAirResult } from "@/lib/tools/deadair";
import { TranscriptInput } from "@/components/common/TranscriptInput";
import { Gate } from "@/components/common/Gate";
import { VoiceBanner } from "@/components/shell/VoiceBanner";
import { saveHistoryRun, downloadFile } from "@/lib/storage";
import { SAMPLES } from "@/data/samples";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sticker } from "@/components/ui/Sticker";

export default function EditPage() {
  const [transcript, setTranscript] = useState("");
  const [floor, setFloor] = useState<number>(0.45);
  const [result, setResult] = useState<DeadAirResult | null>(null);
  const [shipped, setShipped] = useState(false);
  const [sortField, setSortField] = useState<"start" | "kind" | "why">("start");
  const [sortAsc, setSortAsc] = useState(true);

  const handleCompute = (text: string = transcript, floorVal: number = floor) => {
    if (!text.trim()) {
      setResult(null);
      return;
    }
    const cues = parseTranscript(text);
    if (!cues.length) {
      alert("No cues found. Please ensure input has timestamps (e.g. 00:00:00,000 --> 00:00:03,000 or Whisper JSON).");
      return;
    }
    const res = computeDeadAir(cues, floorVal);
    setResult(res);
    setShipped(false);
  };

  const handleLoadSample = () => {
    setTranscript(SAMPLES.edit.transcript);
    handleCompute(SAMPLES.edit.transcript, floor);
  };

  const exportAsCsv = () => {
    if (!result) return;
    const lines = ["kind,start_seconds,end_seconds,duration_seconds,why"];
    for (const c of result.cuts) {
      lines.push(`${c.kind},${c.start.toFixed(3)},${c.end.toFixed(3)},${(c.end - c.start).toFixed(3)},"${c.why.replace(/"/g, '""')}"`);
    }
    downloadFile("edit_decision_list.csv", lines.join("\n"), "text/csv");
  };

  const exportAsPlainText = () => {
    if (!result) return;
    const lines = [
      `EDIT DECISION LIST`,
      `Duration: ${result.duration.toFixed(2)}s | Removed: ${result.removed.toFixed(2)}s | Out: ${result.out.toFixed(2)}s (${result.percentShorter}% shorter)`,
      `Dead-air floor: ${floor}s`,
      ``,
      ...result.cuts.map(
        (c) =>
          `${c.kind.padEnd(7)} ${c.start.toFixed(2).padStart(8)}s -> ${c.end.toFixed(2).padStart(8)}s  (${ (c.end - c.start).toFixed(2) }s)  ${c.why}`
      ),
    ];
    downloadFile("edit_decision_list.txt", lines.join("\n"), "text/plain");
  };

  const sortedCuts = result
    ? [...result.cuts].sort((a, b) => {
        if (sortField === "start") return sortAsc ? a.start - b.start : b.start - a.start;
        if (sortField === "kind") return sortAsc ? a.kind.localeCompare(b.kind) : b.kind.localeCompare(a.kind);
        return sortAsc ? a.why.localeCompare(b.why) : b.why.localeCompare(a.why);
      })
    : [];

  const handleShip = () => {
    if (!result) return;
    navigator.clipboard.writeText(
      result.cuts.map((c) => `${c.kind} ${c.start.toFixed(2)}s -> ${c.end.toFixed(2)}s: ${c.why}`).join("\n")
    );
    saveHistoryRun({
      id: "edl-" + Date.now(),
      module: "edit",
      timestamp: new Date().toISOString(),
      inputSummary: `Dead-air floor ${floor}s (${result.duration}s in)`,
      inputData: { floor, duration: result.duration },
      outputData: result,
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
              /yt-edit
            </span>
            <Sticker label="DETERMINISTIC EDL" variant="red" rotate={-1} />
          </div>
          <h1 className="type-h1 font-black tracking-tight text-txt flex items-center gap-3">
            <Scissors className="h-8 w-8 text-yt-red" />
            <span>Edit Decision List (EDL)</span>
          </h1>
          <p className="type-body text-txt-2 mt-1 max-w-2xl">
            Deterministic cut list: identifies dead-air pauses, filler words (&ldquo;um&rdquo;), and restarted takes without sending audio to the cloud.
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

      {/* Caveat alert */}
      <div className="flex items-start gap-3 rounded-input border border-warn/30 bg-warn/10 p-4 text-xs">
        <AlertTriangle className="h-5 w-5 text-warn shrink-0 mt-0.5" />
        <div className="text-txt">
          <strong className="type-label text-warn block mb-0.5 font-bold">SPEECH PERCENTAGE NOTICE</strong>
          Percentages are of SPEECH. If the video has a long silent demo, this number is relative to spoken audio. Check against your timeline footage.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Card */}
        <div className="lg:col-span-5">
          <Card className="p-6 space-y-4">
            <TranscriptInput
              value={transcript}
              onChange={(val) => {
                setTranscript(val);
                handleCompute(val, floor);
              }}
              placeholder="Paste transcript (.srt, .vtt, whisper .json) or drop file above..."
            />

            {/* Floor Slider */}
            <div className="rounded-input border border-line bg-surface-2 p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="type-label font-bold text-txt flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-yt-red" />
                  <span>DEAD-AIR FLOOR THRESHOLD</span>
                </span>
                <span className="type-tabular font-black text-yt-red text-sm">{floor.toFixed(2)}s</span>
              </div>
              <input
                type="range"
                min="0.20"
                max="1.50"
                step="0.05"
                value={floor}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setFloor(val);
                  if (transcript) handleCompute(transcript, val);
                }}
                className="w-full accent-yt-red cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-txt-2 font-mono">
                <span>0.20s (Tight)</span>
                <span>0.45s (Standard)</span>
                <span>1.50s (Loose)</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => handleCompute()}
              disabled={!transcript.trim()}
              className="w-full mt-2"
              size="lg"
            >
              <Scissors className="h-4 w-4" />
              <span>Generate Edit Decision List</span>
            </Button>
          </Card>
        </div>

        {/* Right Output Area */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <div className="space-y-4">
              {/* Animated Total Saved Banner */}
              <Card className="p-5 border-line bg-surface-2 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-ok animate-pulse" />
                    <span className="type-label font-bold text-txt">TOTAL TIME SAVED</span>
                  </div>
                  <Sticker label={`${result.percentShorter}% SHORTER`} variant="ok" rotate={1} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-input bg-surface-3 border border-line">
                    <span className="type-label text-[10px] text-txt-2 block">RAW DURATION</span>
                    <span className="type-tabular text-xl font-black text-txt">{result.duration.toFixed(1)}s</span>
                  </div>
                  <div className="p-3 rounded-input bg-surface-3 border border-line">
                    <span className="type-label text-[10px] text-txt-2 block">TOTAL CUTS</span>
                    <span className="type-tabular text-xl font-black text-yt-red">{result.cuts.length}</span>
                  </div>
                  <div className="p-3 rounded-input bg-surface-3 border border-line">
                    <span className="type-label text-[10px] text-txt-2 block">CUT TIME</span>
                    <span className="type-tabular text-xl font-black text-bad">-{result.removed.toFixed(1)}s</span>
                  </div>
                  <div className="p-3 rounded-input bg-surface-3 border border-line">
                    <span className="type-label text-[10px] text-txt-2 block">FINAL OUT</span>
                    <span className="type-tabular text-xl font-black text-ok">{result.out.toFixed(1)}s</span>
                  </div>
                </div>
              </Card>

              {/* Toolbar */}
              <div className="flex items-center justify-between">
                <span className="type-label text-txt font-bold">DECISION LIST ({sortedCuts.length} CUTS)</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={exportAsCsv}
                  >
                    <Download className="h-3 w-3" />
                    <span>Export CSV</span>
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={exportAsPlainText}
                  >
                    <Download className="h-3 w-3" />
                    <span>Export TXT</span>
                  </Button>
                </div>
              </div>

              {/* Color-Coded Cuts Table with Sticky Header */}
              <Card className="overflow-hidden border-line p-0">
                <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-surface-2 border-b border-line text-txt-2 type-label text-[10px] z-10">
                      <tr>
                        <th
                          className="p-3 cursor-pointer hover:text-txt"
                          onClick={() => {
                            setSortField("kind");
                            setSortAsc(!sortAsc);
                          }}
                        >
                          Kind
                        </th>
                        <th
                          className="p-3 cursor-pointer hover:text-txt"
                          onClick={() => {
                            setSortField("start");
                            setSortAsc(!sortAsc);
                          }}
                        >
                          Cut Range
                        </th>
                        <th className="p-3">Duration</th>
                        <th
                          className="p-3 cursor-pointer hover:text-txt"
                          onClick={() => {
                            setSortField("why");
                            setSortAsc(!sortAsc);
                          }}
                        >
                          Why
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {sortedCuts.map((cut, idx) => {
                        const kindMeta = {
                          DEAD: {
                            style: "text-warn bg-warn/10 border-warn/30",
                            icon: VolumeX,
                          },
                          FILLER: {
                            style: "text-link bg-link/10 border-link/30",
                            icon: MessageSquareWarning,
                          },
                          REPEAT: {
                            style: "text-bad bg-bad/10 border-bad/30",
                            icon: RotateCcw,
                          },
                        }[cut.kind];

                        const KindIcon = kindMeta.icon;

                        return (
                          <tr key={idx} className="hover:bg-surface-2/60 transition-colors">
                            <td className="p-3">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill text-[10px] font-bold border ${kindMeta.style}`}>
                                <KindIcon className="w-3 h-3" />
                                <span>{cut.kind}</span>
                              </span>
                            </td>
                            <td className="p-3 font-bold text-txt type-tabular">
                              {cut.start.toFixed(2)}s &rarr; {cut.end.toFixed(2)}s
                            </td>
                            <td className="p-3 type-tabular text-txt-2">
                              {(cut.end - cut.start).toFixed(2)}s
                            </td>
                            <td className="p-3 text-txt font-medium max-w-xs truncate">
                              {cut.why}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Gate Bar */}
              <Gate
                onShip={handleShip}
                onChange={() => alert("Deterministic tool: adjust the dead-air floor slider to change cut thresholds.")}
                shipped={shipped}
              />
            </div>
          ) : (
            <Card className="flex flex-col items-center justify-center min-h-[340px] p-8 text-center border-dashed">
              <div className="type-hero font-black text-line/40 select-none">
                /yt-edit
              </div>
              <h3 className="type-h3 font-black text-txt mt-2">No EDL Generated Yet</h3>
              <p className="type-small text-txt-2 max-w-sm mt-1">
                Upload or paste a timestamped transcript (.srt, .vtt, or Whisper .json) on the left to extract cuts.
              </p>
              <Button
                type="button"
                variant="secondary"
                onClick={handleLoadSample}
                className="mt-4"
                size="sm"
              >
                Load Golden Sample (52s)
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
