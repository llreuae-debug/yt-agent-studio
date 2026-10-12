"use client";

import { useState } from "react";
import { Calendar, Sparkles, Clock, AlertTriangle } from "lucide-react";
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

export default function PlanPage() {
  const [hoursAvailable, setHoursAvailable] = useState("10");
  const [alreadyMade, setAlreadyMade] = useState("");
  const [bestDay, setBestDay] = useState("Thursday");
  const [niche, setNiche] = useState("");
  const [recentVideos, setRecentVideos] = useState("");

  const [isPlanning, setIsPlanning] = useState(false);
  const [planResult, setPlanResult] = useState<any>(null);
  const [shipped, setShipped] = useState(false);

  const handleGeneratePlan = async (feedback?: string) => {
    if (!hoursAvailable.trim() || !alreadyMade.trim()) {
      alert("Hours available and what is already half-made are required before generating.");
      return;
    }
    setIsPlanning(true);

    try {
      const voice = getVoiceProfile();
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: "plan",
          step: "plan_week",
          input: {
            hoursAvailable,
            alreadyMade,
            bestDay,
            niche,
            recentVideos,
          },
          voice,
          feedback,
        }),
      });

      const json = await resp.json();
      if (!resp.ok || json.error) throw new Error(json.error || "Failed to generate plan");

      setPlanResult(json.data);
      setShipped(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsPlanning(false);
    }
  };

  const handleLoadSample = () => {
    setHoursAvailable(SAMPLES.plan.hoursAvailable);
    setAlreadyMade(SAMPLES.plan.alreadyMade);
    setBestDay(SAMPLES.plan.bestDay);
    setNiche(SAMPLES.plan.niche);
    setRecentVideos(SAMPLES.plan.recentVideos);
  };

  const formattedPlanText = planResult
    ? [
        `# WEEKLY CONTENT PLAN (3 UPLOADS, NOT 7)`,
        `Total Hours Cost: ${planResult.total_hours_cost} hours`,
        `Honest Line (What to drop first): ${planResult.what_to_drop_first}`,
        ``,
        `| Day | Format | Working Title | One Sentence Promise | What Already Exists | Hours |`,
        `| --- | --- | --- | --- | --- | --- |`,
        ...planResult.uploads.map(
          (u: any) =>
            `| ${u.day} | ${u.format} | ${u.working_title} | ${u.one_sentence_promise} | ${u.what_already_exists} | ${u.allocated_hours}h |`
        ),
      ].join("\n")
    : "";

  const handleShip = () => {
    if (!formattedPlanText) return;
    navigator.clipboard.writeText(formattedPlanText);
    saveHistoryRun({
      id: "plan-" + Date.now(),
      module: "plan",
      timestamp: new Date().toISOString(),
      inputSummary: `${hoursAvailable} hours available (Best day: ${bestDay})`,
      inputData: { hoursAvailable, alreadyMade, bestDay },
      outputData: { formattedPlanText, planResult },
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
              /yt-plan
            </span>
            <Sticker label="3 UPLOADS NOT 7" variant="ok" rotate={-1} />
          </div>
          <h1 className="type-h1 font-black tracking-tight text-txt flex items-center gap-3">
            <Calendar className="h-8 w-8 text-yt-red" />
            <span>Weekly Production Planner</span>
          </h1>
          <p className="type-body text-txt-2 mt-1 max-w-2xl">
            A plan that does not fit the week is a list of regrets. Three uploads sized strictly to your actual available capacity.
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
            <div className="space-y-1">
              <label className="type-label font-bold text-txt block">
                HOURS AVAILABLE THIS WEEK (REQUIRED)
              </label>
              <Input
                type="number"
                value={hoursAvailable}
                onChange={(e) => setHoursAvailable(e.target.value)}
                placeholder="e.g. 10"
              />
            </div>

            <div className="space-y-1">
              <label className="type-label font-bold text-txt block">
                WHAT IS ALREADY HALF-MADE? (REQUIRED)
              </label>
              <Textarea
                value={alreadyMade}
                onChange={(e) => setAlreadyMade(e.target.value)}
                rows={3}
                placeholder="e.g. A script draft on title testing and 3 screen recordings of my analytics dashboard..."
              />
            </div>

            <div className="space-y-1">
              <label className="type-label font-bold text-txt block">
                BEST UPLOAD DAY FROM ANALYTICS (REQUIRED)
              </label>
              <Input
                type="text"
                value={bestDay}
                onChange={(e) => setBestDay(e.target.value)}
                placeholder="e.g. Thursday"
              />
            </div>

            <div className="space-y-1">
              <label className="type-label font-bold text-txt block">
                NICHE / CATEGORY (OPTIONAL)
              </label>
              <Input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. Creator tools, tech tutorials..."
              />
            </div>

            <Button
              type="button"
              onClick={() => handleGeneratePlan()}
              disabled={!hoursAvailable.trim() || !alreadyMade.trim() || isPlanning}
              className="w-full mt-2"
              size="lg"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isPlanning ? "Planning Week..." : "Generate 3-Upload Plan"}</span>
            </Button>
          </Card>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 space-y-6">
          {isPlanning && (
            <Card className="p-10 flex flex-col items-center justify-center">
              <EqualizerLoader
                statusTexts={[
                  "Allocating 1 Anchor, 1 Cheap video, 3 Shorts...",
                  "Calculating hours cost per asset...",
                  "Drafting the Honest Line dropoff fallback...",
                ]}
              />
            </Card>
          )}

          {!isPlanning && planResult ? (
            <>
              {/* Honest Line Hero Card */}
              <Card className="p-5 border-warn/30 bg-warn/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 type-label font-bold text-warn">
                    <AlertTriangle className="h-4 w-4" />
                    <span>THE HONEST LINE</span>
                  </div>
                  <span className="type-tabular font-bold text-xs text-txt">
                    TOTAL COST: {planResult.total_hours_cost} HOURS
                  </span>
                </div>
                <p className="type-body font-bold text-txt">
                  Drop first if life interrupts: <span className="text-warn">{planResult.what_to_drop_first}</span>
                </p>
              </Card>

              {/* Uploads Bento Table */}
              <Card className="overflow-hidden border-line p-0">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-2 border-b border-line text-txt-2 type-label text-[10px]">
                    <tr>
                      <th className="p-3">Day &amp; Format</th>
                      <th className="p-3">Working Title &amp; Promise</th>
                      <th className="p-3">Already Exists</th>
                      <th className="p-3 text-right">Hours</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {planResult.uploads.map((u: any, idx: number) => (
                      <tr key={idx} className="hover:bg-surface-2/60 transition-colors">
                        <td className="p-3">
                          <span className="font-bold text-txt block">{u.day}</span>
                          <span className="type-label text-[10px] px-2 py-0.5 rounded-pill bg-surface-3 text-yt-red mt-1 inline-block">
                            {u.format}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-txt block leading-tight">{u.working_title}</span>
                          <span className="text-txt-2 text-xs mt-0.5 block">{u.one_sentence_promise}</span>
                        </td>
                        <td className="p-3 text-txt-2 text-xs">
                          {u.what_already_exists}
                        </td>
                        <td className="p-3 text-right type-tabular font-black text-txt text-sm">
                          {u.allocated_hours}h
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>

              <CopyBlock
                content={formattedPlanText}
                title="Weekly Content Plan"
                filename="plan.md"
                userInputs={[hoursAvailable, alreadyMade, bestDay]}
              />

              <Gate
                onShip={handleShip}
                onChange={(fb) => handleGeneratePlan(fb)}
                isIterating={isPlanning}
                shipped={shipped}
              />
            </>
          ) : (
            !isPlanning && (
              <Card className="flex flex-col items-center justify-center min-h-[340px] p-8 text-center border-dashed">
                <div className="type-hero font-black text-line/40 select-none">
                  /yt-plan
                </div>
                <h3 className="type-h3 font-black text-txt mt-2">No Weekly Plan Generated</h3>
                <p className="type-small text-txt-2 max-w-sm mt-1">
                  Enter your available hours and what assets are already half-made to size a sustainable 3-upload schedule.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleLoadSample}
                  className="mt-4"
                  size="sm"
                >
                  Load Golden Planning Sample
                </Button>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
}
