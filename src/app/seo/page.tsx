"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Sparkles, CheckCircle2, XCircle, ArrowRight, Tag } from "lucide-react";
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

export default function SeoPage() {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [targetAudience, setTargetAudience] = useState<"search" | "feed">("search");
  const [transcriptSummary, setTranscriptSummary] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [seoResult, setSeoResult] = useState<any>(null);
  const [shipped, setShipped] = useState(false);

  const handleGenerate = async (feedback?: string) => {
    if (!title.trim() || !topic.trim()) return;
    setIsGenerating(true);

    try {
      const voice = getVoiceProfile();
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: "seo",
          step: "generate_seo",
          input: { title, topic, summary: transcriptSummary },
          voice,
          feedback,
        }),
      });

      const json = await resp.json();
      if (!resp.ok || json.error) throw new Error(json.error || "Failed to generate SEO package");

      setSeoResult(json.data);
      setShipped(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLoadSample = () => {
    setTitle(SAMPLES.seo.title);
    setTopic(SAMPLES.seo.topic);
    setTargetAudience("search");
  };

  const runQueryTest = (query: string): boolean => {
    if (!seoResult) return false;
    const queryTokens = query.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/).filter(Boolean);
    const searchableText = `${title} ${seoResult.first_two_lines}`.toLowerCase();
    return queryTokens.every((token) => searchableText.includes(token));
  };

  const formattedDescription = seoResult
    ? [
        seoResult.first_two_lines,
        ``,
        `🔗 Resources & Links:`,
        seoResult.link_resource,
        ``,
        `⏱️ Chapters:`,
        seoResult.chapters_placeholder,
        ``,
        `--- About this video ---`,
        seoResult.long_description,
        ``,
        `Tags:`,
        seoResult.tags.join(", "),
      ].join("\n")
    : "";

  const handleShip = () => {
    if (!formattedDescription) return;
    navigator.clipboard.writeText(formattedDescription);
    saveHistoryRun({
      id: "seo-" + Date.now(),
      module: "seo",
      timestamp: new Date().toISOString(),
      inputSummary: title,
      inputData: { title, topic, targetAudience },
      outputData: { formattedDescription, seoResult },
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
              /yt-seo
            </span>
            <Sticker label="3-QUERY TEST" variant="ok" rotate={1} />
          </div>
          <h1 className="type-h1 font-black tracking-tight text-txt flex items-center gap-3">
            <Search className="h-8 w-8 text-yt-red" />
            <span>Description &amp; SEO Studio</span>
          </h1>
          <p className="type-body text-txt-2 mt-1 max-w-2xl">
            Write the 2-line snippet above &ldquo;...more&rdquo;, 15 disambiguation tags, and verify query discoverability in code.
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

      {/* Discovery Target Switcher */}
      <Card className="p-4 border-line bg-surface-2 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="type-label font-bold text-txt">DISCOVERY TARGET</span>
          <div className="flex rounded-pill border border-line bg-surface-3 p-1">
            <button
              onClick={() => setTargetAudience("search")}
              className={`rounded-pill px-3.5 py-1 text-xs font-bold transition-all ${
                targetAudience === "search" ? "bg-yt-red text-white shadow-glow" : "text-txt-2 hover:text-txt"
              }`}
            >
              Aimed at Search (Evergreen)
            </button>
            <button
              onClick={() => setTargetAudience("feed")}
              className={`rounded-pill px-3.5 py-1 text-xs font-bold transition-all ${
                targetAudience === "feed" ? "bg-yt-red text-white shadow-glow" : "text-txt-2 hover:text-txt"
              }`}
            >
              Aimed at Subscriber Feed
            </button>
          </div>
        </div>

        {targetAudience === "feed" && (
          <div className="rounded-input border border-link/30 bg-link/10 p-3.5 text-xs text-txt flex items-center justify-between gap-3">
            <div>
              <strong className="text-link font-bold">Feed-Driven Video:</strong> Search is a weak lever for browsed feed videos. Your CTR depends almost entirely on title and thumbnail packaging.
            </div>
            <Link
              href="/package"
              className="flex shrink-0 items-center gap-1.5 rounded-pill bg-link text-white px-3 py-1 text-xs font-bold hover:bg-link/90 transition-colors"
            >
              <span>Go to /yt-package</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-5">
          <Card className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="type-label font-bold text-txt block">
                VIDEO TITLE (REQUIRED)
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Why 97% of Creators Quit Before Video 30"
              />
            </div>

            <div className="space-y-1">
              <label className="type-label font-bold text-txt block">
                TOPIC / SUBJECT MATTER (REQUIRED)
              </label>
              <Textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={3}
                placeholder="e.g. Creator burnout, retention mechanics, hook writing, YouTube pacing..."
              />
            </div>

            <div className="space-y-1">
              <label className="type-label font-bold text-txt block">
                OPTIONAL SUMMARY / TRANSCRIPT POINTS
              </label>
              <Textarea
                value={transcriptSummary}
                onChange={(e) => setTranscriptSummary(e.target.value)}
                rows={3}
                placeholder="Key tools, resources, or sections mentioned in video..."
              />
            </div>

            <Button
              type="button"
              onClick={() => handleGenerate()}
              disabled={!title.trim() || !topic.trim() || isGenerating}
              className="w-full mt-2"
              size="lg"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isGenerating ? "Writing SEO Package..." : "Generate Description & Tags"}</span>
            </Button>
          </Card>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 space-y-6">
          {isGenerating && (
            <Card className="p-10 flex flex-col items-center justify-center">
              <EqualizerLoader
                statusTexts={[
                  "Drafting first 2-line snippet above '...more'...",
                  "Extracting 15 disambiguation tags...",
                  "Testing search query keywords against title...",
                ]}
              />
            </Card>
          )}

          {!isGenerating && seoResult ? (
            <>
              {/* Google/YouTube Search Snippet Simulator Card */}
              <Card className="p-6 border-line bg-surface-2 space-y-3">
                <span className="type-label text-txt-2 font-bold block text-[10px]">
                  SEARCH RESULT SNIPPET SIMULATOR
                </span>
                <div className="p-4 rounded-input bg-surface-1 border border-line space-y-1.5 select-none">
                  <div className="text-xs font-medium text-txt-2 flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-yt-red flex items-center justify-center text-[7px] text-white font-black">
                      ▶
                    </span>
                    <span>youtube.com › watch</span>
                  </div>
                  <h4 className="type-h3 font-black text-link hover:underline cursor-pointer leading-snug">
                    {title}
                  </h4>
                  <p className="type-small text-txt-2 line-clamp-2 leading-relaxed">
                    {seoResult.first_two_lines}
                  </p>
                </div>
              </Card>

              {/* Deterministic Query Test Panel */}
              <Card className="p-6 border-line space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="type-h3 font-black text-txt">Deterministic Query Test</h4>
                    <p className="type-small text-txt-2">
                      Checked in code: words must appear in title OR first 2 lines.
                    </p>
                  </div>
                  <Sticker label="DETERMINISTIC" variant="neutral" rotate={-1} />
                </div>

                <div className="space-y-2.5">
                  {seoResult.proposed_queries.map((query: string, idx: number) => {
                    const pass = runQueryTest(query);
                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between rounded-pill border px-4 py-2.5 text-xs ${
                          pass
                            ? "bg-ok/10 border-ok/30 text-ok"
                            : "bg-bad/10 border-bad/30 text-bad"
                        }`}
                      >
                        <span className="type-body font-bold text-txt">&ldquo;{query}&rdquo;</span>
                        <div className="flex items-center gap-1.5 type-label font-bold text-xs">
                          {pass ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-ok" />
                              <span>PASS</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-bad" />
                              <span>FAIL (TITLE ISSUE)</span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Tags Section */}
              <Card className="p-6 border-line space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-yt-red" />
                    <h4 className="type-label font-bold text-txt">
                      DISAMBIGUATION TAGS ({seoResult.tags.length}/15)
                    </h4>
                  </div>
                  <span className="type-label text-[10px] text-txt-2">
                    TAGS ARE WEAK SIGNALS
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {seoResult.tags.map((t: string, idx: number) => (
                    <span
                      key={idx}
                      className="rounded-pill bg-surface-2 border border-line px-3 py-1 text-xs font-mono font-medium text-txt"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Card>

              <CopyBlock
                content={formattedDescription}
                title="Paste-Ready Description Block"
                filename="youtube_description.txt"
                userInputs={[title, topic]}
              />

              <Gate
                onShip={handleShip}
                onChange={(fb) => handleGenerate(fb)}
                isIterating={isGenerating}
                shipped={shipped}
              />
            </>
          ) : (
            !isGenerating && (
              <Card className="flex flex-col items-center justify-center min-h-[340px] p-8 text-center border-dashed">
                <div className="type-hero font-black text-line/40 select-none">
                  /yt-seo
                </div>
                <h3 className="type-h3 font-black text-txt mt-2">No SEO Package Generated</h3>
                <p className="type-small text-txt-2 max-w-sm mt-1">
                  Enter your title and topic to write search snippet descriptions, max 15 tags, and execute the 3-query deterministic test.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleLoadSample}
                  className="mt-4"
                  size="sm"
                >
                  Load Sample Video SEO Data
                </Button>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
}
