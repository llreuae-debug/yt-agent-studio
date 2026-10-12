"use client";

import { useState, useEffect } from "react";
import {
  Mic2,
  Save,
  Download,
  Upload,
  Sparkles,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  getVoiceProfile,
  saveVoiceProfile,
  VoiceProfile,
  voiceProfileToMarkdown,
  parseMarkdownToVoiceProfile,
  downloadFile,
} from "@/lib/storage";
import { SAMPLES } from "@/data/samples";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sticker } from "@/components/ui/Sticker";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";

export default function VoicePage() {
  const [profile, setProfile] = useState<VoiceProfile>({
    targetAudience: "",
    howITalk: "",
    wordsNeverUse: "",
    wordsDoUse: "",
    wontClaim: "",
    format: "",
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [inferModalOpen, setInferModalOpen] = useState(false);
  const [inferTranscripts, setInferTranscripts] = useState("");
  const [isInferring, setIsInferring] = useState(false);
  const [inferError, setInferError] = useState<string | null>(null);

  useEffect(() => {
    setProfile(getVoiceProfile());
  }, []);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveVoiceProfile(profile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportMarkdown = () => {
    const md = voiceProfileToMarkdown(profile);
    downloadFile("voice.md", md, "text/markdown");
  };

  const handleImportMarkdown = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsed = parseMarkdownToVoiceProfile(content);
      const merged: VoiceProfile = {
        ...profile,
        ...parsed,
      };
      setProfile(merged);
      saveVoiceProfile(merged);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    setProfile(SAMPLES.voice);
    saveVoiceProfile(SAMPLES.voice);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleInferFromVideos = async () => {
    if (!inferTranscripts.trim()) return;
    setIsInferring(true);
    setInferError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: "voice",
          step: "infer",
          input: { transcripts: inferTranscripts },
        }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Failed to infer voice profile.");
      }

      const inferred = json.data;
      setProfile({
        targetAudience: inferred.targetAudience || profile.targetAudience,
        howITalk: inferred.howITalk || profile.howITalk,
        wordsNeverUse: inferred.wordsNeverUse || profile.wordsNeverUse,
        wordsDoUse: inferred.wordsDoUse || profile.wordsDoUse,
        wontClaim: inferred.wontClaim || profile.wontClaim,
        format: inferred.format || profile.format,
      });
      setInferModalOpen(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err: any) {
      setInferError(err.message || "Failed to infer profile");
    } finally {
      setIsInferring(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="type-label bg-surface-2 border border-line text-txt-2 px-2.5 py-0.5 rounded-pill font-mono">
              templates/voice.md
            </span>
            <Sticker label="STEP 1" variant="red" rotate={-2} />
          </div>
          <h1 className="type-h1 font-black tracking-tight text-txt flex items-center gap-3">
            <Mic2 className="h-8 w-8 text-yt-red" />
            <span>Voice Profile</span>
          </h1>
          <p className="type-body text-txt-2 mt-1 max-w-2xl">
            On YouTube you say the words out loud. A script in the wrong voice is unreadable on camera.
            Ten minutes here protects every video you record.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleLoadSample}
            size="sm"
          >
            Load Sample Profile
          </Button>

          <label className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-surface-3 px-4 py-2 text-xs font-bold text-txt hover:bg-surface-2 cursor-pointer transition-colors">
            <Upload className="h-3.5 w-3.5" />
            <span>Import voice.md</span>
            <input type="file" accept=".md,.txt" onChange={handleImportMarkdown} className="hidden" />
          </label>

          <Button
            type="button"
            variant="secondary"
            onClick={handleExportMarkdown}
            size="sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export voice.md</span>
          </Button>
        </div>
      </div>

      {/* AI Extraction Banner */}
      <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-line bg-surface-2">
        <div>
          <h3 className="type-h3 font-black text-txt flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yt-red" />
            <span>Auto-Infer Voice from Your Existing Videos</span>
          </h3>
          <p className="type-small text-txt-2 mt-1">
            Paste three video transcripts, and the engine extracts your cadence, vocabulary, and taboo words.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setInferModalOpen(true)}
          className="shrink-0"
        >
          <Sparkles className="h-4 w-4" />
          <span>Write from 3 Videos</span>
        </Button>
      </Card>

      {savedSuccess && (
        <div className="flex items-center gap-2.5 rounded-pill bg-ok/10 border border-ok/30 px-4 py-3 text-xs font-bold text-ok">
          <Check className="h-4 w-4" />
          <span>Voice Profile saved locally and active for all AI calls!</span>
        </div>
      )}

      {/* 6 Form Fields */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Field 1: Target Audience */}
        <Card className="p-6 space-y-2">
          <label className="type-label font-bold text-txt block">
            1. WHO I AM TALKING TO
          </label>
          <p className="type-small text-txt-2">
            One person. Name them properly—not &ldquo;creators&rdquo;, but &ldquo;someone with under a thousand subs who has made nine videos and cannot work out why none of them break 400 views&rdquo;.
          </p>
          <Textarea
            value={profile.targetAudience}
            onChange={(e) => setProfile({ ...profile, targetAudience: e.target.value })}
            rows={2}
            placeholder="Name your exact viewer persona..."
          />
        </Card>

        {/* Field 2: How I actually talk */}
        <Card className="p-6 space-y-2">
          <label className="type-label font-bold text-txt block">
            2. HOW I ACTUALLY TALK
          </label>
          <p className="type-small text-txt-2">
            Paste the transcript of your best-performing video here, or three of them. Not what you wish you sounded like.
          </p>
          <Textarea
            value={profile.howITalk}
            onChange={(e) => setProfile({ ...profile, howITalk: e.target.value })}
            rows={4}
            placeholder="Paste snippets or transcripts of your natural speech..."
          />
        </Card>

        {/* Field 3: Words I never use */}
        <Card className="p-6 space-y-2">
          <label className="type-label font-bold text-txt block">
            3. WORDS I NEVER USE
          </label>
          <p className="type-small text-txt-2">
            The ones that are not mine. Be specific: &ldquo;unlock&rdquo;, &ldquo;game-changer&rdquo;, &ldquo;dive in&rdquo;, &ldquo;let&rsquo;s get into it&rdquo;.
          </p>
          <Input
            type="text"
            value={profile.wordsNeverUse}
            onChange={(e) => setProfile({ ...profile, wordsNeverUse: e.target.value })}
            placeholder="e.g. unlock, game-changer, dive in, smash that subscribe button..."
          />
        </Card>

        {/* Field 4: Words I do use */}
        <Card className="p-6 space-y-2">
          <label className="type-label font-bold text-txt block">
            4. WORDS I DO USE
          </label>
          <p className="type-small text-txt-2">
            Your verbal tics. The phrases that are genuinely yours. Keep them.
          </p>
          <Input
            type="text"
            value={profile.wordsDoUse}
            onChange={(e) => setProfile({ ...profile, wordsDoUse: e.target.value })}
            placeholder="e.g. look at the data, the mechanism, cliff, leak, ship it..."
          />
        </Card>

        {/* Field 5: What I will not claim */}
        <Card className="p-6 space-y-2">
          <label className="type-label font-bold text-txt block">
            5. WHAT I WILL NOT CLAIM
          </label>
          <p className="type-small text-txt-2">
            Numbers I cannot show, results that are not mine, tools I have not used. Write them down so the skills refuse them for you instead of you catching it in the edit.
          </p>
          <Textarea
            value={profile.wontClaim}
            onChange={(e) => setProfile({ ...profile, wontClaim: e.target.value })}
            rows={2}
            placeholder="e.g. overnight algorithm hacks, 10x views in 24 hours, unverified case studies..."
          />
        </Card>

        {/* Field 6: My format */}
        <Card className="p-6 space-y-2">
          <label className="type-label font-bold text-txt block">
            6. MY FORMAT
          </label>
          <p className="type-small text-txt-2">
            Length, how a video opens, whether there is an intro, whether you swear, whether you appear on camera, what the desk looks like.
          </p>
          <Textarea
            value={profile.format}
            onChange={(e) => setProfile({ ...profile, format: e.target.value })}
            rows={2}
            placeholder="e.g. 8-12 minutes, talking head with rapid b-roll overlays, no intro music, desk setup..."
          />
        </Card>

        {/* Sticky Liquid-Glass Save Bar */}
        <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-pill liquid-glass p-4 sm:px-6 shadow-2xl border border-line">
          <span className="type-small text-txt-2 hidden sm:inline">
            Changes save to local browser storage immediately.
          </span>
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            <Save className="h-4 w-4" />
            <span>Save Voice Profile</span>
          </Button>
        </div>
      </form>

      {/* Auto-Infer Modal */}
      {inferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md" onClick={() => setInferModalOpen(false)} />
          <div className="relative z-50 w-full max-w-xl rounded-card liquid-glass p-6 sm:p-8 shadow-2xl border border-line space-y-4">
            <h3 className="type-h3 font-black text-txt">
              Infer Voice Profile from 3 Transcripts
            </h3>
            <p className="type-small text-txt-2">
              Paste 3 raw transcripts from your videos. The engine extracts your target audience, speech cadence, taboo cliches, and formatting rules.
            </p>

            {inferError && (
              <div className="flex items-center gap-2 rounded-input bg-bad/10 border border-bad/30 p-3 text-xs font-bold text-bad">
                <AlertCircle className="h-4 w-4" />
                <span>{inferError}</span>
              </div>
            )}

            <Textarea
              value={inferTranscripts}
              onChange={(e) => setInferTranscripts(e.target.value)}
              placeholder="Paste 3 video transcripts here (paragraphs or auto-captions)..."
              rows={8}
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setInferModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleInferFromVideos}
                disabled={isInferring || !inferTranscripts.trim()}
              >
                <Sparkles className="h-4 w-4" />
                <span>{isInferring ? "Analyzing Speech..." : "Generate Voice Profile"}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
