"use client";

import { useState } from "react";
import { FileText, Sparkles, Video, Clock } from "lucide-react";
import { score as scoreHook, HookScoreResult } from "@/lib/tools/hookscore";
import { HookScorePanel } from "@/components/modules/HookScorePanel";
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

export default function ScriptPage() {
  const [idea, setIdea] = useState("");
  const [workingTitle, setWorkingTitle] = useState("");
  const [targetLength, setTargetLength] = useState("8");

  // Step 1: Hooks
  const [isGeneratingHooks, setIsGeneratingHooks] = useState(false);
  const [scoredHooks, setScoredHooks] = useState<HookScoreResult[]>([]);
  const [selectedHookIdx, setSelectedHookIdx] = useState<number>(0);

  // Step 2: Script Body
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [scriptResult, setScriptResult] = useState<any>(null);
  const [shipped, setShipped] = useState(false);

  const handleGenerateHooks = async (feedback?: string) => {
    if (!idea.trim()) return;
    setIsGeneratingHooks(true);
    setScriptResult(null);

    try {
      const voice = getVoiceProfile();
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: "script",
          step: "generate_hooks",
          input: { idea, title: workingTitle },
          voice,
          feedback,
        }),
      });

      const json = await resp.json();
      if (!resp.ok || json.error) throw new Error(json.error || "Failed to generate hooks");

      const rawHooks: { hook: string; formula_id: string; formula_name: string }[] = json.data.hooks || [];
      const evaluated = rawHooks.map((h) => scoreHook(h.hook));
      evaluated.sort((a, b) => b.verdict - a.verdict);

      // Keep top two (Rule: Never hand over only one)
      const topTwo = evaluated.slice(0, 2);
      setScoredHooks(topTwo);
      setSelectedHookIdx(0);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsGeneratingHooks(false);
    }
  };

  const handleGenerateScript = async (feedback?: string) => {
    if (!scoredHooks.length) return;
    const chosen = scoredHooks[selectedHookIdx];
    setIsGeneratingScript(true);

    try {
      const voice = getVoiceProfile();
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: "script",
          step: "generate_script",
          input: {
            chosenHook: chosen.hook,
            formulaName: chosen.formula,
            idea,
            lengthMinutes: parseFloat(targetLength) || 8,
          },
          voice,
          feedback,
        }),
      });

      const json = await resp.json();
      if (!resp.ok || json.error) throw new Error(json.error || "Failed to generate script");

      setScriptResult(json.data);
      setShipped(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleLoadSample = () => {
    setIdea(SAMPLES.script.idea);
    setWorkingTitle(SAMPLES.script.title);
    setTargetLength(SAMPLES.script.lengthMinutes);
  };

  // Compile full formatted script markdown
  const formattedScriptText = scriptResult
    ? [
        `# SCRIPT: ${workingTitle || idea}`,
        `Winning Hook Formula: ${scoredHooks[selectedHookIdx]?.formula} (Verdict: ${scoredHooks[selectedHookIdx]?.verdict}/100)`,
        `Formula Reasoning: ${scriptResult.formula_reasoning}`,
        ``,
        `## 1. THE HOOK (0:00 - 0:15)`,
        `"${scoredHooks[selectedHookIdx]?.hook}"`,
        ``,
        `## 2. THE TURN (0:15 - 0:45)`,
        `${scriptResult.turn}`,
        ``,
        `## 3. THE BODY (BEAT BY BEAT)`,
        ...scriptResult.beats.map((b: any) =>
          [
            `### Beat ${b.beat_number} [${b.timestamp}]`,
            `${b.on_screen}`,
            `${b.spoken}`,
            ``,
          ].join("\n")
        ),
        `## 4. THE PAYOFF`,
        `${scriptResult.payoff}`,
        ``,
        `## 5. THE CLOSE (ONE ASK)`,
        `${scriptResult.close}`,
      ].join("\n")
    : "";

  const totalWords = formattedScriptText.split(/\s+/).filter(Boolean).length;
  const estimatedMinutes = (totalWords / 150).toFixed(1);

  const handleShip = () => {
    if (!formattedScriptText) return;
    navigator.clipboard.writeText(formattedScriptText);
    saveHistoryRun({
      id: "script-" + Date.now(),
      module: "script",
      timestamp: new Date().toISOString(),
      inputSummary: workingTitle || idea.slice(0, 60),
      inputData: { idea, workingTitle, chosenHook: scoredHooks[selectedHookIdx]?.hook },
      outputData: { formattedScriptText, scriptResult, scoredHooks },
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
              /yt-script
            </span>
            <Sticker label="RETENTION BEATS" variant="red" rotate={-1} />
          </div>
          <h1 className="type-h1 font-black tracking-tight text-txt flex items-center gap-3">
            <FileText className="h-8 w-8 text-yt-red" />
            <span>Script Engine</span>
          </h1>
          <p className="type-body text-txt-2 mt-1 max-w-2xl">
            Five hooks scored deterministically down to the top two, followed by a beat-by-beat retention script with on-screen visual cues.
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
                RAW VIDEO IDEA (REQUIRED)
              </label>
              <Textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                rows={4}
                placeholder="e.g. 97% of creators quit before video 30. Why they burn out and the 3 pacing systems to survive to 100..."
              />
            </div>

            <div className="space-y-1">
              <label className="type-label font-bold text-txt block">
                WORKING TITLE (OPTIONAL)
              </label>
              <Input
                type="text"
                value={workingTitle}
                onChange={(e) => setWorkingTitle(e.target.value)}
                placeholder="e.g. Why 97% of Creators Quit Before Video 30"
              />
            </div>

            <div className="space-y-1">
              <label className="type-label font-bold text-txt block">
                TARGET LENGTH (MINUTES)
              </label>
              <Input
                type="number"
                value={targetLength}
                onChange={(e) => setTargetLength(e.target.value)}
                placeholder="8"
              />
            </div>

            <Button
              type="button"
              onClick={() => handleGenerateHooks()}
              disabled={!idea.trim() || isGeneratingHooks}
              className="w-full mt-2"
              size="lg"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isGeneratingHooks ? "Scoring 5 Formulas..." : "Generate & Score Hooks"}</span>
            </Button>
          </Card>
        </div>

        {/* Right Output Area */}
        <div className="lg:col-span-7 space-y-6">
          {isGeneratingHooks && (
            <Card className="p-10 flex flex-col items-center justify-center">
              <EqualizerLoader
                statusTexts={[
                  "Synthesizing 5 hook candidates...",
                  "Running 21-formula classifier...",
                  "Evaluating 5 retention properties...",
                  "Pruning down to the top two...",
                ]}
              />
            </Card>
          )}

          {/* Step 1: Hooks Output */}
          {!isGeneratingHooks && scoredHooks.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="type-h3 font-black text-txt">Top Two Scored Hooks</h3>
                  <p className="type-small text-txt-2">
                    Ranked deterministically across 5 properties. Pick your preferred hook to generate the script.
                  </p>
                </div>
                <Sticker label="TOP 2 ONLY" variant="ok" rotate={1} />
              </div>

              <div className="space-y-3">
                {scoredHooks.map((sh, idx) => (
                  <HookScorePanel
                    key={idx}
                    scoreResult={sh}
                    isSelected={selectedHookIdx === idx}
                    onSelect={() => setSelectedHookIdx(idx)}
                  />
                ))}
              </div>

              {!scriptResult && !isGeneratingScript && (
                <Button
                  type="button"
                  onClick={() => handleGenerateScript()}
                  className="w-full"
                  size="lg"
                >
                  <Video className="h-4 w-4" />
                  <span>Generate Full Script with Selected Hook</span>
                </Button>
              )}
            </div>
          )}

          {isGeneratingScript && (
            <Card className="p-10 flex flex-col items-center justify-center">
              <EqualizerLoader
                statusTexts={[
                  "Structuring the Turn (0:15 - 0:45)...",
                  "Drafting beat-by-beat spoken dialogue...",
                  "Designing [ON SCREEN: ...] visual cues...",
                  "Estimating runtime @ 150 words/min...",
                ]}
              />
            </Card>
          )}

          {/* Step 2: Full Script Output */}
          {!isGeneratingScript && scriptResult && (
            <div className="space-y-4">
              <Card className="p-4 flex items-center justify-between text-xs border-line">
                <div className="flex items-center gap-2 type-tabular font-bold text-txt">
                  <Clock className="h-4 w-4 text-yt-red" />
                  <span>Runtime estimate: <strong>{estimatedMinutes} mins</strong> ({totalWords} words @ 150 wpm)</span>
                </div>
                <span className="type-label text-txt-2 font-mono">
                  FORMULA: {scoredHooks[selectedHookIdx]?.formula}
                </span>
              </Card>

              <CopyBlock
                content={formattedScriptText}
                title="Full Spoken Script with [ON SCREEN: ...] Beats"
                filename="script.md"
                userInputs={[idea, workingTitle]}
              />

              <Gate
                onShip={handleShip}
                onChange={(fb) => handleGenerateScript(fb)}
                isIterating={isGeneratingScript}
                shipped={shipped}
              />
            </div>
          )}

          {!isGeneratingHooks && !scoredHooks.length && (
            <Card className="flex flex-col items-center justify-center min-h-[340px] p-8 text-center border-dashed">
              <div className="type-hero font-black text-line/40 select-none">
                /yt-script
              </div>
              <h3 className="type-h3 font-black text-txt mt-2">No Script Generated</h3>
              <p className="type-small text-txt-2 max-w-sm mt-1">
                Enter your raw video idea on the left. The engine generates 5 candidate hooks, scores each against the 21 formulas, and presents the top two.
              </p>
              <Button
                type="button"
                variant="secondary"
                onClick={handleLoadSample}
                className="mt-4"
                size="sm"
              >
                Load Sample Video Idea
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
