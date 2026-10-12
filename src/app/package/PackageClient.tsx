"use client";

import { useState } from "react";
import { Package as PackageIcon, Sparkles } from "lucide-react";
import { checkTitle, TitleCheckResult } from "@/lib/tools/title";
import { TitleLintPanel } from "@/components/modules/TitleLintPanel";
import { ThumbnailFeedPreview } from "@/components/modules/ThumbnailFeedPreview";
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

export default function PackagePage() {
  const [mode, setMode] = useState<"ai" | "manual">("ai");
  const [topic, setTopic] = useState("");

  // Manual mode state
  const [manualTitle, setManualTitle] = useState("");
  const [manualThumb, setManualThumb] = useState("");
  const [manualLintResult, setManualLintResult] = useState<TitleCheckResult | null>(null);

  // AI mode state
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);
  const [lintedTitles, setLintedTitles] = useState<TitleCheckResult[]>([]);
  const [selectedTitleIdx, setSelectedTitleIdx] = useState<number>(0);

  // Thumbnail brief
  const [isGeneratingThumb, setIsGeneratingThumb] = useState(false);
  const [thumbBrief, setThumbBrief] = useState<any>(null);
  const [pairingLintResult, setPairingLintResult] = useState<TitleCheckResult | null>(null);
  const [shipped, setShipped] = useState(false);

  const handleGenerateTitles = async (feedback?: string) => {
    if (!topic.trim()) return;
    setIsGeneratingTitles(true);
    setThumbBrief(null);
    setPairingLintResult(null);

    try {
      const voice = getVoiceProfile();
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: "package",
          step: "generate_titles",
          input: { topic },
          voice,
          feedback,
        }),
      });

      const json = await resp.json();
      if (!resp.ok || json.error) throw new Error(json.error || "Failed to generate titles");

      const rawTitles: string[] = json.data.titles || [];
      const evaluated = rawTitles.map((t) => checkTitle(t));
      evaluated.sort((a, b) => b.score - a.score);

      // Keep top three
      setLintedTitles(evaluated.slice(0, 3));
      setSelectedTitleIdx(0);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsGeneratingTitles(false);
    }
  };

  const handleGenerateThumbBrief = async (feedback?: string) => {
    if (!lintedTitles.length) return;
    const chosenTitle = lintedTitles[selectedTitleIdx].title;
    setIsGeneratingThumb(true);

    try {
      const voice = getVoiceProfile();
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: "package",
          step: "thumbnail_brief",
          input: { title: chosenTitle, topic },
          voice,
          feedback,
        }),
      });

      const json = await resp.json();
      if (!resp.ok || json.error) throw new Error(json.error || "Failed to generate thumbnail brief");

      const brief = json.data;
      setThumbBrief(brief);

      // Re-lint title and thumbnail text as a pair
      const pairing = checkTitle(chosenTitle, brief.three_words);
      setPairingLintResult(pairing);
      setShipped(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsGeneratingThumb(false);
    }
  };

  const handleManualLint = (t: string = manualTitle, th: string = manualThumb) => {
    if (!t.trim()) {
      setManualLintResult(null);
      return;
    }
    const res = checkTitle(t, th || undefined);
    setManualLintResult(res);
    setShipped(false);
  };

  const handleLoadSample = () => {
    setTopic(SAMPLES.package.topic);
    setManualTitle(SAMPLES.package.topic);
    setManualThumb(SAMPLES.package.initialThumb);
    handleManualLint(SAMPLES.package.topic, SAMPLES.package.initialThumb);
  };

  // Compile export block
  const formattedPackagingText =
    mode === "ai" && thumbBrief && pairingLintResult
      ? [
          `# PACKAGING SPECIFICATION`,
          `Title: "${thumbBrief.chosen_title}" (${pairingLintResult.chars} chars | Score: ${pairingLintResult.score}/100)`,
          `Thumbnail Text: "${thumbBrief.three_words}"`,
          ``,
          `## Thumbnail Visual Brief`,
          `- Expression: ${thumbBrief.expression}`,
          `- Framing: ${thumbBrief.framing}`,
          `- 3 Words: ${thumbBrief.three_words}`,
          `- Feed Background Contrast: ${thumbBrief.background_contrast}`,
          `- Pairing Rationale: ${thumbBrief.rationale}`,
          ``,
          `## Pairing Lint Results`,
          ...pairingLintResult.good.map((g) => `[PASS] ${g}`),
          ...pairingLintResult.issues.map(([k, m]) => `[ISSUE - ${k}] ${m}`),
        ].join("\n")
      : manualLintResult
      ? [
          `# MANUAL PACKAGING LINT`,
          `Title: "${manualLintResult.title}" (Score: ${manualLintResult.score}/100)`,
          `Thumbnail Text: "${manualThumb || "None"}"`,
          ``,
          ...manualLintResult.good.map((g) => `[PASS] ${g}`),
          ...manualLintResult.issues.map(([k, m]) => `[ISSUE - ${k}] ${m}`),
        ].join("\n")
      : "";

  const handleShip = () => {
    if (!formattedPackagingText) return;
    navigator.clipboard.writeText(formattedPackagingText);
    saveHistoryRun({
      id: "pkg-" + Date.now(),
      module: "package",
      timestamp: new Date().toISOString(),
      inputSummary: mode === "ai" ? thumbBrief?.chosen_title : manualTitle,
      inputData: { mode, topic, manualTitle, manualThumb },
      outputData: { formattedPackagingText, thumbBrief, pairingLintResult },
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
              /yt-package
            </span>
            <Sticker label="CTR SYSTEM" variant="neutral" rotate={1} />
          </div>
          <h1 className="type-h1 font-black tracking-tight text-txt flex items-center gap-3">
            <PackageIcon className="h-8 w-8 text-yt-red" />
            <span>Title &amp; Thumbnail Studio</span>
          </h1>
          <p className="type-body text-txt-2 mt-1 max-w-2xl">
            The title and thumbnail are ONE unit. Linting duplication, character length, and mobile truncation before publish.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex rounded-pill border border-line bg-surface-2 p-1">
            <button
              onClick={() => setMode("ai")}
              className={`rounded-pill px-3.5 py-1 text-xs font-bold transition-all ${
                mode === "ai" ? "bg-yt-red text-white shadow-glow" : "text-txt-2 hover:text-txt"
              }`}
            >
              AI (10 &rarr; 3)
            </button>
            <button
              onClick={() => setMode("manual")}
              className={`rounded-pill px-3.5 py-1 text-xs font-bold transition-all ${
                mode === "manual" ? "bg-yt-red text-white shadow-glow" : "text-txt-2 hover:text-txt"
              }`}
            >
              Manual Instant Lint
            </button>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={handleLoadSample}
            size="sm"
          >
            Load Sample
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Card */}
        <div className="lg:col-span-5">
          <Card className="p-6 space-y-4">
            {mode === "ai" ? (
              <>
                <div className="space-y-1">
                  <label className="type-label font-bold text-txt block">
                    VIDEO TOPIC OR SCRIPT SUMMARY
                  </label>
                  <Textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    rows={4}
                    placeholder="e.g. I gave an AI complete control over my YouTube channel for 30 days to see if algorithmic automation beats human editing..."
                  />
                </div>

                <Button
                  type="button"
                  onClick={() => handleGenerateTitles()}
                  disabled={!topic.trim() || isGeneratingTitles}
                  className="w-full mt-2"
                  size="lg"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isGeneratingTitles ? "Linting 10 Titles..." : "Generate 10 Titles (Keep Top 3)"}</span>
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="type-label font-bold text-txt block">
                    YOUR TITLE
                  </label>
                  <Input
                    type="text"
                    value={manualTitle}
                    onChange={(e) => {
                      setManualTitle(e.target.value);
                      handleManualLint(e.target.value, manualThumb);
                    }}
                    placeholder="e.g. I Let an AI Run My YouTube Channel for 30 Days"
                  />
                </div>

                <div className="space-y-1">
                  <label className="type-label font-bold text-txt block">
                    THUMBNAIL TEXT (MAX 3 WORDS RECOMMENDED)
                  </label>
                  <Input
                    type="text"
                    value={manualThumb}
                    onChange={(e) => {
                      setManualThumb(e.target.value);
                      handleManualLint(manualTitle, e.target.value);
                    }}
                    placeholder="e.g. AI RAN IT"
                  />
                </div>

                <div className="rounded-input border border-line bg-surface-2 p-3.5 text-xs text-txt-2 space-y-1">
                  <span className="type-label font-bold text-txt block">INSTANT LINT ACTIVE</span>
                  <p>Runs deterministic checks in your browser with zero AI latency or token cost.</p>
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Right Output Area */}
        <div className="lg:col-span-7 space-y-6">
          {mode === "ai" ? (
            <>
              {isGeneratingTitles && (
                <Card className="p-10 flex flex-col items-center justify-center">
                  <EqualizerLoader
                    statusTexts={[
                      "Drafting 10 competitive titles...",
                      "Measuring character limits (40 & 60 markers)...",
                      "Evaluating curiosity gap & power words...",
                      "Filtering down to the top 3...",
                    ]}
                  />
                </Card>
              )}

              {!isGeneratingTitles && lintedTitles.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="type-h3 font-black text-txt">Top 3 Linted Titles</h3>
                      <p className="type-small text-txt-2">Select one to write thumbnail visual brief.</p>
                    </div>
                    <Sticker label="TOP 3" variant="red" rotate={-2} />
                  </div>

                  <div className="space-y-3">
                    {lintedTitles.map((res, idx) => (
                      <TitleLintPanel
                        key={idx}
                        checkResult={res}
                        isSelected={selectedTitleIdx === idx}
                        onSelect={() => setSelectedTitleIdx(idx)}
                      />
                    ))}
                  </div>

                  {!thumbBrief && !isGeneratingThumb && (
                    <Button
                      type="button"
                      onClick={() => handleGenerateThumbBrief()}
                      className="w-full"
                      size="lg"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Write Thumbnail Brief for Selected Title</span>
                    </Button>
                  )}
                </div>
              )}

              {isGeneratingThumb && (
                <Card className="p-10 flex flex-col items-center justify-center">
                  <EqualizerLoader
                    statusTexts={[
                      "Designing 3-word glanceable hook...",
                      "Checking for title-thumbnail duplication...",
                      "Drafting facial expression & framing specs...",
                    ]}
                  />
                </Card>
              )}

              {!isGeneratingThumb && thumbBrief && pairingLintResult && (
                <div className="space-y-6">
                  {/* Pair Preview & Brief */}
                  <Card className="p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-line pb-3">
                      <h4 className="type-h3 font-black text-txt">Thumbnail Visual Brief</h4>
                      <span className="type-tabular font-bold text-ok text-sm">
                        Pairing Score: {pairingLintResult.score}/100
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-3 text-xs">
                        <div>
                          <span className="type-label text-txt-2 block text-[10px]">EXPRESSION:</span>
                          <span className="type-body text-txt font-bold">{thumbBrief.expression}</span>
                        </div>
                        <div>
                          <span className="type-label text-txt-2 block text-[10px]">FRAMING:</span>
                          <span className="type-body text-txt font-bold">{thumbBrief.framing}</span>
                        </div>
                        <div>
                          <span className="type-label text-txt-2 block text-[10px]">3-WORD OVERLAY:</span>
                          <span className="text-xl font-black text-yt-red tracking-tight font-condensed">
                            {thumbBrief.three_words}
                          </span>
                        </div>
                        <div>
                          <span className="type-label text-txt-2 block text-[10px]">FEED BACKGROUND CONTRAST:</span>
                          <span className="type-small text-txt-2">{thumbBrief.background_contrast}</span>
                        </div>
                      </div>

                      {/* Feed preview */}
                      <ThumbnailFeedPreview
                        title={thumbBrief.chosen_title}
                        threeWords={thumbBrief.three_words}
                      />
                    </div>
                  </Card>

                  {/* Re-lint panel for the pair */}
                  <TitleLintPanel
                    checkResult={pairingLintResult}
                    thumbText={thumbBrief.three_words}
                  />

                  <CopyBlock
                    content={formattedPackagingText}
                    title="Packaging Specification"
                    filename="packaging.md"
                    userInputs={[topic]}
                  />

                  <Gate
                    onShip={handleShip}
                    onChange={(fb) => handleGenerateThumbBrief(fb)}
                    isIterating={isGeneratingThumb}
                    shipped={shipped}
                  />
                </div>
              )}

              {!isGeneratingTitles && !lintedTitles.length && (
                <Card className="flex flex-col items-center justify-center min-h-[340px] p-8 text-center border-dashed">
                  <div className="type-hero font-black text-line/40 select-none">
                    /yt-package
                  </div>
                  <h3 className="type-h3 font-black text-txt mt-2">No Packaging Generated</h3>
                  <p className="type-small text-txt-2 max-w-sm mt-1">
                    Enter your video idea on the left. The engine generates 10 candidates, scores them deterministically, and presents the top 3 with thumbnail visual briefs.
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleLoadSample}
                    className="mt-4"
                    size="sm"
                  >
                    Load Sample Packaging
                  </Button>
                </Card>
              )}
            </>
          ) : (
            // Manual Mode Output
            manualLintResult ? (
              <div className="space-y-6">
                <TitleLintPanel
                  checkResult={manualLintResult}
                  thumbText={manualThumb}
                />

                <ThumbnailFeedPreview
                  title={manualLintResult.title}
                  threeWords={manualThumb || "NO TEXT"}
                />

                <CopyBlock
                  content={formattedPackagingText}
                  title="Manual Lint Result"
                  filename="manual_lint.md"
                  userInputs={[manualTitle, manualThumb]}
                />

                <Gate
                  onShip={handleShip}
                  onChange={() => alert("Manual mode: edit title or thumbnail fields on the left.")}
                  shipped={shipped}
                />
              </div>
            ) : (
              <Card className="flex flex-col items-center justify-center min-h-[340px] p-8 text-center border-dashed">
                <div className="type-hero font-black text-line/40 select-none">
                  LINT
                </div>
                <h3 className="type-h3 font-black text-txt mt-2">Manual Lint Ready</h3>
                <p className="type-small text-txt-2 max-w-sm mt-1">
                  Type your title and thumbnail text on the left to see live character counts, mobile cutoffs, and duplication warnings.
                </p>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
}
