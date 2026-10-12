import { z } from "zod";
import { VoiceProfile } from "@/lib/storage";
import { buildSystemBase } from "./systemBase";
import hooksData from "@/data/hooks.json";

// 1. Voice Inferrer
export const VoiceInferSchema = z.object({
  targetAudience: z.string(),
  howITalk: z.string(),
  wordsNeverUse: z.string(),
  wordsDoUse: z.string(),
  wontClaim: z.string(),
  format: z.string(),
});

export function buildVoiceInferPrompt(transcripts: string): { systemPrompt: string; userPrompt: string } {
  return {
    systemPrompt: `You are an expert speech and voice profile analyst for YouTube creators. Read the provided video transcripts and infer the 6 voice profile fields according to templates/voice.md. Output valid JSON only.`,
    userPrompt: `Here are 3 video transcripts from the creator:\n\n${transcripts}\n\nInfer the 6 fields accurately. Keep "wordsNeverUse" and "wordsDoUse" concise and realistic. Output JSON with keys: targetAudience, howITalk, wordsNeverUse, wordsDoUse, wontClaim, format.`,
  };
}

// 2. Script
export const ScriptHooksSchema = z.object({
  hooks: z.array(
    z.object({
      hook: z.string(),
      formula_id: z.string(),
      formula_name: z.string(),
    })
  ).length(5),
});

export const ScriptBodySchema = z.object({
  turn: z.string(),
  beats: z.array(
    z.object({
      beat_number: z.number(),
      timestamp: z.string(),
      spoken: z.string(),
      on_screen: z.string(), // Must start with [ON SCREEN: ...]
    })
  ),
  payoff: z.string(),
  close: z.string(),
  formula_reasoning: z.string(),
});

export function buildScriptHooksPrompt(idea: string, title?: string, voice?: VoiceProfile) {
  const formulas = hooksData.hooks.map(h => `- ${h.id} (${h.name}): ${h.shape}`).join("\n");
  return {
    systemPrompt: `${buildSystemBase(voice)}
You write hooks for YouTube. Write FIVE distinct hook options for the given idea.
Each of the 5 hooks MUST be tagged with one of these 21 formulas:
${formulas}

Hook Rules:
- Under 25 words (aim for 9-24 words).
- Confirm the click the title promised.
- Open a question the viewer cannot close.
- Deliver no spoilers yet.
- Never open with who you are or channel intros.`,
    userPrompt: `Video Idea: ${idea}\nWorking Title: ${title || "None"}\n\nReturn 5 hooks as JSON: { "hooks": [{ "hook": "...", "formula_id": "...", "formula_name": "..." }, ...] }`,
  };
}

export function buildScriptBodyPrompt(
  chosenHook: string,
  formulaName: string,
  idea: string,
  lengthMinutes: number = 8,
  voice?: VoiceProfile
) {
  return {
    systemPrompt: `${buildSystemBase(voice)}
You are writing a full YouTube video script around the chosen winning hook.
Script Structure:
1. The Turn (0:15 - 0:45): Say what the video is going to do in one sentence and start doing it. NO channel intros, NO "before we get started", NO subscribe pitches.
2. The Body: One idea per beat. EVERY beat MUST have an [ON SCREEN: ...] visual instruction describing what viewers see on screen.
3. The Payoff: Explicitly deliver what was promised.
4. The Close: ONE ask only (e.g. check link or watch follow-up video). Not three.
Target length: approximately ${lengthMinutes} minutes (~150 words per minute).`,
    userPrompt: `Chosen Hook: "${chosenHook}" (Formula: ${formulaName})\nVideo Topic: ${idea}\n\nWrite the script as JSON:
{
  "turn": "Spoken turn line (0:15-0:45)",
  "beats": [
    { "beat_number": 1, "timestamp": "0:45", "spoken": "...", "on_screen": "[ON SCREEN: ...]" }
  ],
  "payoff": "Explicit payoff statement",
  "close": "Single focused ask",
  "formula_reasoning": "One line explaining why the winning hook formula fits this idea"
}`,
  };
}

// 3. Package
export const PackageTitlesSchema = z.object({
  titles: z.array(z.string()).length(10),
});

export const PackageThumbBriefSchema = z.object({
  chosen_title: z.string(),
  expression: z.string(),
  framing: z.string(),
  three_words: z.string(), // Max 3 words, different from title
  background_contrast: z.string(),
  rationale: z.string(),
});

export function buildPackageTitlesPrompt(topic: string, voice?: VoiceProfile) {
  return {
    systemPrompt: `${buildSystemBase(voice)}
Write TEN YouTube titles for the topic.
Rules:
- Under 60 characters for desktop search, under 40 is best for mobile feeds.
- Include a concrete figure, name, or date where possible.
- Avoid vague filler adjectives (amazing, insane, ultimate).
- At most 1-2 all-caps words.
- Do not repeat the same format for all ten.`,
    userPrompt: `Topic / Script Summary: ${topic}\n\nReturn 10 titles as JSON: { "titles": ["...", ...] }`,
  };
}

export function buildThumbnailBriefPrompt(title: string, topic: string, voice?: VoiceProfile) {
  return {
    systemPrompt: `${buildSystemBase(voice)}
Create a thumbnail brief for the winning title.
Rules:
- The thumbnail must NOT repeat the words of the title. Different words, same promise.
- Maximum THREE words on the thumbnail (at feed size a fourth word is a grey smear).
- Describe facial expression, framing, three words, and background contrast at feed size (168x94).`,
    userPrompt: `Winning Title: "${title}"\nTopic: "${topic}"\n\nReturn JSON:
{
  "chosen_title": "${title}",
  "expression": "Facial expression / subject emotion",
  "framing": "Framing (e.g. close-up right third, looking left)",
  "three_words": "THREE WORDS ONLY (no title repetition)",
  "background_contrast": "How background holds contrast at tiny feed sizes",
  "rationale": "Why this pairing drives clicks"
}`,
  };
}

// 4. Comments
export const CommentTriageSchema = z.object({
  counts: z.object({
    questions: z.number(),
    corrections: z.number(),
    praise: z.number(),
    bait: z.number(),
  }),
  questions: z.array(
    z.object({
      original: z.string(),
      reply: z.string(),
      next_video_topic: z.string().optional(),
    })
  ),
  corrections: z.array(
    z.object({
      original: z.string(),
      reply: z.string(),
    })
  ),
  praise: z.array(
    z.object({
      original: z.string(),
      reply: z.string(),
    })
  ),
  bait: z.array(
    z.object({
      original: z.string(),
      reason_no_reply: z.string(),
    })
  ),
  pin: z.object({
    comment: z.string(),
    why: z.string(),
  }),
  heart_these: z.array(z.string()),
});

export function buildCommentPrompt(comments: string, voice?: VoiceProfile) {
  return {
    systemPrompt: `${buildSystemBase(voice)}
Triage comments into 4 piles: Questions, Corrections, Praise, Bait.
Reply Rules:
- EVERY reply MUST be UNDER 30 WORDS.
- First sentence answers the actual question.
- At most one question back.
- No emoji unless voice profile permits.
- Bait: NO reply, provide reason.
- Praise: brief, specific, not identical.
- Corrections: if right, admit and thank plainly.
- Pin ONE comment that is the question most people share (not the nicest praise).`,
    userPrompt: `Pasted comments:\n${comments}\n\nReturn JSON matching schema.`,
  };
}

// 5. Weekly Plan
export const PlanSchema = z.object({
  uploads: z.array(
    z.object({
      day: z.string(),
      format: z.string(), // "Anchor" | "Cheap" | "Short #1" | "Short #2" | "Short #3"
      working_title: z.string(),
      one_sentence_promise: z.string(),
      what_already_exists: z.string(),
      allocated_hours: z.number(),
    })
  ),
  total_hours_cost: z.number(),
  what_to_drop_first: z.string(),
  capacity_warning: z.string().optional(),
});

export function buildPlanPrompt(
  hours: number,
  alreadyMade: string,
  bestDay: string,
  niche?: string,
  recentVideos?: string,
  voice?: VoiceProfile
) {
  return {
    systemPrompt: `${buildSystemBase(voice)}
Create a 3-upload weekly calendar (not 7):
1. One Anchor (most time, on best day: ${bestDay}).
2. One Cheap one (built from existing footage or comments).
3. Three Shorts cut from the Anchor.
Keep total hours within or close to the creator's capacity (${hours} hours). State the honest line: what to drop first if the week goes wrong.`,
    userPrompt: `Available hours: ${hours}\nAlready made: ${alreadyMade}\nBest upload day: ${bestDay}\nNiche: ${niche || "General"}\nRecent videos: ${recentVideos || "None"}\n\nReturn JSON matching schema.`,
  };
}

// 6. Viral Outliers Analysis
export const ViralCommentarySchema = z.object({
  top_outliers_summary: z.array(z.string()),
  one_structural_thing: z.string(),
  recommended_to_make_this_week: z.string(),
  why_fits_voice_and_capacity: z.string(),
  observations: z.array(z.string()),
});

export function buildViralPrompt(outliersJson: string, voice?: VoiceProfile) {
  return {
    systemPrompt: `${buildSystemBase(voice)}
Analyze the YouTube niche outlier videos that beat their channels' own medians.
Provide:
1. The ONE structural thing they share.
2. Which ONE the creator could realistically make this week in their voice with what they have.`,
    userPrompt: `Outliers and formula stats:\n${outliersJson}\n\nReturn JSON matching schema.`,
  };
}

// 7. Retention Advice
export const RetentionAdviceSchema = z.object({
  single_biggest_leak: z.string(),
  one_change: z.string(),
  is_packaging_problem: z.boolean(),
  secondary_notes: z.array(z.string()),
});

export function buildRetentionPrompt(statsJson: string, voice?: VoiceProfile) {
  return {
    systemPrompt: `${buildSystemBase(voice)}
Read the retention metrics (Hook leak, Cliffs, Slide).
Rules:
- Give exactly ONE single biggest leak and ONE specific change for it.
- If hook leak is healthy (<25%) and slide is flat, declare the video is fine and the problem is packaging (is_packaging_problem: true).
- Collapsible secondary notes only if necessary.`,
    userPrompt: `Retention metrics:\n${statsJson}\n\nReturn JSON matching schema.`,
  };
}

// 8. Shorts Cutter
export const ShortsCutterSchema = z.object({
  candidates: z.array(
    z.object({
      span_start_timecode: z.string(),
      span_end_timecode: z.string(),
      duration_seconds: z.number(),
      opening_line: z.string(),
      new_first_line: z.string(),
      on_screen_text_2s: z.string(),
      loop_point: z.string(),
      vertical_crop_note: z.string(),
    })
  ).min(1).max(5),
});

export function buildShortsPrompt(transcript: string, voice?: VoiceProfile) {
  return {
    systemPrompt: `${buildSystemBase(voice)}
Find candidate Shorts in this transcript.
Rules:
- Spans must be strictly between 20 and 55 seconds.
- Opens on a complete thought.
- Has a turn (complication or proof).
- Ends on a punchy line, not a trail-off.
For each candidate:
- Write a NEW first line (hook) that assumes no prior context.
- Write on-screen text for the first 2 seconds (different words from spoken line).
- Suggest a seamless loop point.
- Note vertical 9:16 crop framing advice.`,
    userPrompt: `Transcript with timestamps:\n${transcript}\n\nReturn JSON with top candidates matching schema.`,
  };
}

// 9. SEO
export const SeoSchema = z.object({
  first_two_lines: z.string(),
  link_resource: z.string(),
  chapters_placeholder: z.string(),
  long_description: z.string(),
  tags: z.array(z.string()).max(15),
  proposed_queries: z.array(z.string()).length(3),
});

export function buildSeoPrompt(title: string, topic: string, transcriptSummary?: string, voice?: VoiceProfile) {
  return {
    systemPrompt: `${buildSystemBase(voice)}
Write SEO description and tags.
Rules:
- First two lines: The search snippet shown above "...more". Written in words a person types.
- Link / resource section.
- Chapters section.
- Long description: What is covered, who it is for.
- Tags: Maximum 15 tags. Disambiguation, spellings, tools only.
- Query test: Propose THREE search queries this video should win.`,
    userPrompt: `Title: ${title}\nTopic: ${topic}\nTranscript summary: ${transcriptSummary || "N/A"}\n\nReturn JSON matching schema.`,
  };
}

// 10. Chapters Retitler
export const ChaptersRetitleSchema = z.object({
  relabelled_chapters: z.array(
    z.object({
      start: z.number(),
      label: z.string(),
      relabelled_title: z.string(),
      flagged_filler: z.boolean(),
      note: z.string().optional(),
    })
  ),
});

export function buildChaptersRetitlePrompt(chaptersJson: string, voice?: VoiceProfile) {
  return {
    systemPrompt: `${buildSystemBase(voice)}
Retitle each draft chapter.
Rules:
- 3 to 5 words each.
- Name the PROMISE of that section in the user's voice.
- If a section cannot be named in five words, flag it as filler or multiple sections.`,
    userPrompt: `Draft chapters:\n${chaptersJson}\n\nReturn JSON: { "relabelled_chapters": [{ "start": 0, "label": "0:00", "relabelled_title": "...", "flagged_filler": false }] }`,
  };
}

// 11. Channel Audit
export const AuditSchema = z.object({
  single_biggest_fix: z.object({
    name: z.string(),
    what_to_do_this_week: z.string(),
  }),
  three_things_working: z.array(z.string()).length(3),
  what_not_to_do_yet: z.object({
    action: z.string(),
    why: z.string(),
  }),
});

export function buildAuditPrompt(auditData: string, voice?: VoiceProfile) {
  return {
    systemPrompt: `${buildSystemBase(voice)}
You are conducting a strict YouTube channel audit.
Rules:
- Return EXACTLY ONE single biggest fix and what to do this week.
- Return THREE things already working (specific observations, never empty compliments).
- Return WHAT NOT TO DO YET and why.
- Never open with fake praise. Never end with a list of twenty things.`,
    userPrompt: `Channel Data (Titles linted, hook scores, upload cadence):\n${auditData}\n\nReturn JSON matching schema.`,
  };
}
