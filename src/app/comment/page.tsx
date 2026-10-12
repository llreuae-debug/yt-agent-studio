"use client";

import { useState } from "react";
import { MessageSquare, Sparkles, Pin, AlertOctagon, HelpCircle, CheckCircle, ThumbsUp } from "lucide-react";
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

export default function CommentPage() {
  const [commentsInput, setCommentsInput] = useState("");
  const [isTriaging, setIsTriaging] = useState(false);
  const [triageResult, setTriageResult] = useState<any>(null);
  const [shipped, setShipped] = useState(false);

  const handleTriage = async (feedback?: string) => {
    if (!commentsInput.trim()) return;
    setIsTriaging(true);

    try {
      const voice = getVoiceProfile();
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: "comment",
          step: "triage",
          input: { comments: commentsInput },
          voice,
          feedback,
        }),
      });

      const json = await resp.json();
      if (!resp.ok || json.error) throw new Error(json.error || "Failed to triage comments");

      setTriageResult(json.data);
      setShipped(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsTriaging(false);
    }
  };

  const handleLoadSample = () => {
    setCommentsInput(SAMPLES.comment.comments);
  };

  const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

  // Compile markdown export
  const formattedOutputText = triageResult
    ? [
        `# COMMENT TRIAGE & REPLIES`,
        `Triage Summary: ${triageResult.counts.questions} Questions, ${triageResult.counts.corrections} Corrections, ${triageResult.counts.praise} Praise, ${triageResult.counts.bait} Bait.`,
        ``,
        `## 1. PIN THIS COMMENT`,
        `Comment: "${triageResult.pin.comment}"`,
        `Why: ${triageResult.pin.why}`,
        ``,
        `## 2. HEART THESE`,
        ...triageResult.heart_these.map((h: string) => `- "${h}"`),
        ``,
        `## 3. QUESTIONS & REPLIES (<30 words)`,
        ...triageResult.questions.map((q: any) =>
          [
            `User: "${q.original}"`,
            `Reply (${countWords(q.reply)}w): "${q.reply}"`,
            q.next_video_topic ? `[NEXT VIDEO IDEA]: ${q.next_video_topic}` : ``,
            ``,
          ]
            .filter(Boolean)
            .join("\n")
        ),
        `## 4. CORRECTIONS`,
        ...triageResult.corrections.map((c: any) =>
          [`User: "${c.original}"`, `Reply (${countWords(c.reply)}w): "${c.reply}"`, ``].join("\n")
        ),
        `## 5. PRAISE`,
        ...triageResult.praise.map((p: any) =>
          [`User: "${p.original}"`, `Reply (${countWords(p.reply)}w): "${p.reply}"`, ``].join("\n")
        ),
        `## 6. BAIT (DO NOT REPLY)`,
        ...triageResult.bait.map((b: any) =>
          [`User: "${b.original}"`, `Reason to skip: ${b.reason_no_reply}`, ``].join("\n")
        ),
      ].join("\n")
    : "";

  const handleShip = () => {
    if (!formattedOutputText) return;
    navigator.clipboard.writeText(formattedOutputText);
    saveHistoryRun({
      id: "comment-" + Date.now(),
      module: "comment",
      timestamp: new Date().toISOString(),
      inputSummary: `Triaged ${triageResult?.questions?.length || 0} questions & ${triageResult?.bait?.length || 0} bait`,
      inputData: { commentsInput },
      outputData: { formattedOutputText, triageResult },
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
              /yt-comment
            </span>
            <Sticker label="4-PILE TRIAGE" variant="warn" rotate={1} />
          </div>
          <h1 className="type-h1 font-black tracking-tight text-txt flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-yt-red" />
            <span>Comment Replier &amp; Triage</span>
          </h1>
          <p className="type-body text-txt-2 mt-1 max-w-2xl">
            Triage comments into Questions, Corrections, Praise, and Bait. Enforces concise, authoritative &lt;30 word replies.
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
        {/* Left Input */}
        <div className="lg:col-span-5">
          <Card className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="type-label font-bold text-txt block">
                PASTED COMMENTS THREAD (PARAGRAPHS)
              </label>
              <Textarea
                value={commentsInput}
                onChange={(e) => setCommentsInput(e.target.value)}
                rows={12}
                placeholder="Paste comments copied from your video..."
              />
            </div>

            <div className="rounded-input border border-line bg-surface-2 p-3.5 text-xs text-txt-2 space-y-1">
              <strong className="type-label font-bold text-txt block">ENFORCED RULES</strong>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                <li>Replies under 30 words</li>
                <li>First sentence answers the question directly</li>
                <li>Zero engagement on bait</li>
                <li>Never promise videos not in production</li>
              </ul>
            </div>

            <Button
              type="button"
              onClick={() => handleTriage()}
              disabled={!commentsInput.trim() || isTriaging}
              className="w-full mt-2"
              size="lg"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isTriaging ? "Triaging into 4 Piles..." : "Triage & Generate Replies"}</span>
            </Button>
          </Card>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 space-y-6">
          {isTriaging && (
            <Card className="p-10 flex flex-col items-center justify-center">
              <EqualizerLoader
                statusTexts={[
                  "Sorting into 4 distinct piles...",
                  "Detecting bait & bad faith arguments...",
                  "Enforcing <30-word response rule...",
                  "Selecting ONE comment to pin...",
                ]}
              />
            </Card>
          )}

          {!isTriaging && triageResult ? (
            <>
              {/* Pile Counts Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Card className="p-4 border-line bg-surface-2">
                  <div className="flex items-center justify-between type-label text-link">
                    <span>QUESTIONS</span>
                    <HelpCircle className="h-4 w-4" />
                  </div>
                  <div className="text-3xl font-black font-condensed type-tabular text-txt mt-1">
                    {triageResult.counts.questions}
                  </div>
                </Card>

                <Card className="p-4 border-line bg-surface-2">
                  <div className="flex items-center justify-between type-label text-warn">
                    <span>CORRECTIONS</span>
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div className="text-3xl font-black font-condensed type-tabular text-txt mt-1">
                    {triageResult.counts.corrections}
                  </div>
                </Card>

                <Card className="p-4 border-line bg-surface-2">
                  <div className="flex items-center justify-between type-label text-ok">
                    <span>PRAISE</span>
                    <ThumbsUp className="h-4 w-4" />
                  </div>
                  <div className="text-3xl font-black font-condensed type-tabular text-txt mt-1">
                    {triageResult.counts.praise}
                  </div>
                </Card>

                <Card className="p-4 border-line bg-surface-2">
                  <div className="flex items-center justify-between type-label text-bad">
                    <span>BAIT</span>
                    <AlertOctagon className="h-4 w-4" />
                  </div>
                  <div className="text-3xl font-black font-condensed type-tabular text-txt mt-1">
                    {triageResult.counts.bait}
                  </div>
                </Card>
              </div>

              {/* Pin Recommendation */}
              <Card className="p-5 border-warn/30 bg-warn/10 space-y-2">
                <div className="flex items-center gap-1.5 type-label font-bold text-warn">
                  <Pin className="h-4 w-4" />
                  <span>WHICH ONE COMMENT TO PIN</span>
                </div>
                <p className="type-h3 font-bold text-txt">
                  &ldquo;{triageResult.pin.comment}&rdquo;
                </p>
                <p className="type-small text-txt-2">
                  <strong className="text-txt">Why:</strong> {triageResult.pin.why}
                </p>
              </Card>

              {/* Individual Replies with <30 Word Counters */}
              <div className="space-y-3">
                <h3 className="type-h3 font-black text-txt">Generated Replies (&lt;30 Words)</h3>
                {[...triageResult.questions, ...triageResult.corrections, ...triageResult.praise].map((item: any, idx: number) => {
                  const words = countWords(item.reply);
                  const isOver = words > 30;
                  return (
                    <Card key={idx} className="p-4 space-y-2 border-line">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-txt-2 truncate max-w-sm italic">
                          &ldquo;{item.original}&rdquo;
                        </span>
                        <span
                          className={`type-tabular text-[10px] px-2.5 py-0.5 rounded-pill font-bold border ${
                            isOver ? "bg-bad/10 text-bad border-bad/30" : "bg-ok/10 text-ok border-ok/30"
                          }`}
                        >
                          {words}/30 words {isOver ? "• OVER LIMIT" : "• VALID"}
                        </span>
                      </div>
                      <p className="type-body text-txt bg-surface-2 p-3 rounded-input border border-line">
                        {item.reply}
                      </p>
                      {item.next_video_topic && (
                        <div className="text-xs text-yt-red flex items-center gap-1">
                          <span className="type-label font-bold">NEXT VIDEO IDEA:</span>
                          <span className="font-bold text-txt">{item.next_video_topic}</span>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>

              {/* Bait Pile */}
              {triageResult.bait.length > 0 && (
                <Card className="p-5 border-bad/30 bg-bad/10 space-y-2">
                  <span className="type-label text-bad font-bold flex items-center gap-1.5">
                    <AlertOctagon className="h-4 w-4" />
                    <span>BAIT — DO NOT REPLY</span>
                  </span>
                  <div className="space-y-1.5">
                    {triageResult.bait.map((b: any, idx: number) => (
                      <div key={idx} className="type-small text-txt-2">
                        <span className="text-txt italic">&ldquo;{b.original}&rdquo;</span> &rarr; {b.reason_no_reply}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              <CopyBlock
                content={formattedOutputText}
                title="Comment Triage & Replies"
                filename="comments.md"
                userInputs={[commentsInput]}
              />

              <Gate
                onShip={handleShip}
                onChange={(fb) => handleTriage(fb)}
                isIterating={isTriaging}
                shipped={shipped}
              />
            </>
          ) : (
            !isTriaging && (
              <Card className="flex flex-col items-center justify-center min-h-[340px] p-8 text-center border-dashed">
                <div className="type-hero font-black text-line/40 select-none">
                  /yt-comment
                </div>
                <h3 className="type-h3 font-black text-txt mt-2">No Comments Triaged</h3>
                <p className="type-small text-txt-2 max-w-sm mt-1">
                  Paste your comment thread on the left to separate real questions from bait and generate concise replies.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleLoadSample}
                  className="mt-4"
                  size="sm"
                >
                  Load Golden Comment Sample
                </Button>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
}
