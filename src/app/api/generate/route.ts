import { NextRequest, NextResponse } from "next/server";
import { callLlmStructured } from "@/lib/llm";
import {
  VoiceInferSchema, buildVoiceInferPrompt,
  ScriptHooksSchema, buildScriptHooksPrompt,
  ScriptBodySchema, buildScriptBodyPrompt,
  PackageTitlesSchema, buildPackageTitlesPrompt,
  PackageThumbBriefSchema, buildThumbnailBriefPrompt,
  CommentTriageSchema, buildCommentPrompt,
  PlanSchema, buildPlanPrompt,
  ViralCommentarySchema, buildViralPrompt,
  RetentionAdviceSchema, buildRetentionPrompt,
  ShortsCutterSchema, buildShortsPrompt,
  SeoSchema, buildSeoPrompt,
  ChaptersRetitleSchema, buildChaptersRetitlePrompt,
  AuditSchema, buildAuditPrompt,
} from "@/prompts/modules";

// In-memory rate limiting map: IP -> timestamp[]
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;
const MAX_PAYLOAD_SIZE = 250 * 1024; // 250 KB

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const now = Date.now();
    const timestamps = (rateLimitMap.get(ip) || []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);
    if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down and try again in a minute." },
        { status: 429 }
      );
    }
    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);

    // 2. Parse and Validate Payload Size
    const bodyText = await req.text();
    if (bodyText.length > MAX_PAYLOAD_SIZE) {
      return NextResponse.json(
        { error: "Payload exceeds 250 KB limit. Please upload or paste a shorter transcript/data." },
        { status: 413 }
      );
    }

    const body = JSON.parse(bodyText);
    const { module, step, input, voice, feedback } = body;

    if (!module) {
      return NextResponse.json({ error: "Missing 'module' parameter." }, { status: 400 });
    }

    // Helper to append feedback if present (from the "Change it" Gate)
    const withFeedback = (userPrompt: string) => {
      if (feedback && typeof feedback === "string" && feedback.trim()) {
        return `${userPrompt}\n\n[USER FEEDBACK ON PREVIOUS ITERATION]:\n"${feedback.trim()}"\nPlease address this feedback specifically.`;
      }
      return userPrompt;
    };

    let result: any = null;

    // Check if API key is present; if not, provide realistic mock generator based on module
    const hasKey = !!(process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY);

    switch (module) {
      case "voice": {
        const { systemPrompt, userPrompt } = buildVoiceInferPrompt(input.transcripts);
        if (hasKey) {
          result = await callLlmStructured({
            systemPrompt,
            userPrompt: withFeedback(userPrompt),
            schema: VoiceInferSchema,
          });
        } else {
          result = {
            targetAudience: "Creators with under 1,000 subscribers looking for direct, actionable retention advice.",
            howITalk: "Direct, short sentences, practical examples, no fluff.",
            wordsNeverUse: "unlock, game-changer, dive in, smash that subscribe button",
            wordsDoUse: "cliff, leak, cut it, ship it, retention, data",
            wontClaim: "overnight millions, algorithm hacks",
            format: "Talking head with rapid screen overlays, straight into the point under 10 minutes.",
          };
        }
        break;
      }

      case "script": {
        if (step === "generate_hooks") {
          const { systemPrompt, userPrompt } = buildScriptHooksPrompt(input.idea, input.title, voice);
          if (hasKey) {
            result = await callLlmStructured({
              systemPrompt,
              userPrompt: withFeedback(userPrompt),
              schema: ScriptHooksSchema,
            });
          } else {
            result = {
              hooks: [
                {
                  hook: "97% of creators quit before video 30. Here is what the other 3% do differently.",
                  formula_id: "the-statistic",
                  formula_name: "The Statistic",
                },
                {
                  hook: "If you have under a thousand subscribers, you are probably making this one mistake before you upload.",
                  formula_id: "the-mistake",
                  formula_name: "The Mistake",
                },
                {
                  hook: "Everyone says post daily. I posted once a week for a year and tripled the channel.",
                  formula_id: "contrarian-flip",
                  formula_name: "Contrarian Flip",
                },
                {
                  hook: "This channel went from 400 subscribers to 200,000 in seven months on one format. I mapped it.",
                  formula_id: "someone-elses-result",
                  formula_name: "Someone Else's Result",
                },
                {
                  hook: "I tested 50 hooks on YouTube for 30 days to see which ones actually stop the scroll.",
                  formula_id: "i-tried-it",
                  formula_name: "I Tried It",
                },
              ],
            };
          }
        } else if (step === "generate_script") {
          const { systemPrompt, userPrompt } = buildScriptBodyPrompt(
            input.chosenHook,
            input.formulaName,
            input.idea,
            input.lengthMinutes || 8,
            voice
          );
          if (hasKey) {
            result = await callLlmStructured({
              systemPrompt,
              userPrompt: withFeedback(userPrompt),
              schema: ScriptBodySchema,
            });
          } else {
            result = {
              turn: "In the next eight minutes, we are breaking down the exact 3 retention leaks killing your videos and the 1 fix for each.",
              beats: [
                {
                  beat_number: 1,
                  timestamp: "0:45",
                  spoken: "First: the opening 15 seconds. If you don't state the viewer and the stakes immediately, half your audience leaves before you finish your coffee.",
                  on_screen: "[ON SCREEN: Audience retention chart showing 0:30 steep drop with red circle]",
                },
                {
                  beat_number: 2,
                  timestamp: "2:15",
                  spoken: "Second: thumbnail duplication. When your thumbnail text says the exact same three words as your title, you cut your click surface in half.",
                  on_screen: "[ON SCREEN: Side-by-side comparison of bad repetitive thumbnail vs contrast thumbnail]",
                },
                {
                  beat_number: 3,
                  timestamp: "4:30",
                  spoken: "Third: dead-air and filler words. Cutting 10 seconds of speech hesitation can lift completion rate by 15 percent.",
                  on_screen: "[ON SCREEN: Timeline in editor highlighting dead gaps and repetitive cues being cut]",
                },
              ],
              payoff: "That is the exact retention checklist. The markdown template is in the description.",
              close: "Pick one video in your analytics today, run the retention check, and cut the first cliff.",
              formula_reasoning: `The "${input.formulaName}" formula works because it establishes immediate empirical stakes before presenting the solution.`,
            };
          }
        }
        break;
      }

      case "package": {
        if (step === "generate_titles") {
          const { systemPrompt, userPrompt } = buildPackageTitlesPrompt(input.topic, voice);
          if (hasKey) {
            result = await callLlmStructured({
              systemPrompt,
              userPrompt: withFeedback(userPrompt),
              schema: PackageTitlesSchema,
            });
          } else {
            result = {
              titles: [
                "I Let an AI Run My YouTube Channel for 30 Days",
                "Why 97% of Creators Quit Before Video 30",
                "How I Fixed My Audience Retention in 24 Hours",
                "The 3-Word Rule for High CTR Thumbnails",
                "Stop Making This 1 Mistake in Your First 15 Seconds",
                "I Tested 100 YouTube Titles: Here Is What Won",
                "Why Your Channel Isn't Growing (It's Not The Algorithm)",
                "How 1 Small Edit Saved 40% of My Watch Time",
                "The YouTube Hook Checklist (Never Record Without This)",
                "AI Ran My Entire YouTube Workflow for a Month",
              ],
            };
          }
        } else if (step === "thumbnail_brief") {
          const { systemPrompt, userPrompt } = buildThumbnailBriefPrompt(input.title, input.topic, voice);
          if (hasKey) {
            result = await callLlmStructured({
              systemPrompt,
              userPrompt: withFeedback(userPrompt),
              schema: PackageThumbBriefSchema,
            });
          } else {
            result = {
              chosen_title: input.title,
              expression: "Focused, slight skepticism looking at laptop screen off-camera.",
              framing: "Medium close-up on right third, leaving left two-thirds for high-contrast graphic.",
              three_words: "AI RAN IT",
              background_contrast: "Dark slate background with neon accent halo behind subject to pop at 168x94px.",
              rationale: "Thumbnail text creates an open loop that compliments the title without repeating any words.",
            };
          }
        }
        break;
      }

      case "comment": {
        const { systemPrompt, userPrompt } = buildCommentPrompt(input.comments, voice);
        if (hasKey) {
          result = await callLlmStructured({
            systemPrompt,
            userPrompt: withFeedback(userPrompt),
            schema: CommentTriageSchema,
          });
        } else {
          result = {
            counts: { questions: 2, corrections: 1, praise: 1, bait: 2 },
            questions: [
              {
                original: "Can you do a tutorial on how to configure DaVinci Resolve to export chapters automatically?",
                reply: "Yes, you use marker exports set to YouTube chapters. Making a dedicated 4-minute tutorial on this next week.",
                next_video_topic: "Automating YouTube chapters in DaVinci Resolve",
              },
              {
                original: "What microphone are you using for this desk setup?",
                reply: "It's a Shure SM7B into an Elgato Wave XLR with light noise suppression.",
              },
            ],
            corrections: [
              {
                original: "Actually at 04:12 you mentioned 1080p bitrate is 12mbps, but YouTube recommends 16mbps for 60fps.",
                reply: "Good catch, you're right for 60fps uploads. Appreciate the correction!",
              },
            ],
            praise: [
              {
                original: "This video completely changed how I think about my first 15 seconds! Thank you so much!",
                reply: "Glad it helped! Focus on the first six words on your next script.",
              },
            ],
            bait: [
              {
                original: "Dude this advice is completely useless, you don't even have 100k subs yourself lol",
                reason_no_reply: "Ad hominem bait without actionable critique. No response needed.",
              },
              {
                original: "Another clickbait video with zero real value.",
                reason_no_reply: "Generic negative dismissal.",
              },
            ],
            pin: {
              comment: "Can you do a tutorial on how to configure DaVinci Resolve to export chapters automatically?",
              why: "It's the most common workflow friction point shared across creators in this niche.",
            },
            heart_these: [
              "This video completely changed how I think about my first 15 seconds! Thank you so much!",
              "Actually at 04:12 you mentioned 1080p bitrate is 12mbps, but YouTube recommends 16mbps for 60fps.",
            ],
          };
        }
        break;
      }

      case "plan": {
        const { systemPrompt, userPrompt } = buildPlanPrompt(
          parseFloat(input.hoursAvailable) || 10,
          input.alreadyMade || "",
          input.bestDay || "Thursday",
          input.niche,
          input.recentVideos,
          voice
        );
        if (hasKey) {
          result = await callLlmStructured({
            systemPrompt,
            userPrompt: withFeedback(userPrompt),
            schema: PlanSchema,
          });
        } else {
          result = {
            uploads: [
              {
                day: input.bestDay || "Thursday",
                format: "Anchor",
                working_title: "How to Fix Your Audience Retention in 24 Hours",
                one_sentence_promise: "The exact 3 edits that stop the 30-second cliff in YouTube Studio.",
                what_already_exists: input.alreadyMade || "Script outline and analytics clips",
                allocated_hours: 6,
              },
              {
                day: "Saturday",
                format: "Cheap",
                working_title: "DaVinci Chapter Automation: 3-Minute Guide",
                one_sentence_promise: "Answer to the most upvoted comment on chapter exports.",
                what_already_exists: "Screen recording clips from previous editing session",
                allocated_hours: 2,
              },
              {
                day: "Tuesday",
                format: "Shorts (Batch of 3)",
                working_title: "3 Retention Leaks Explained",
                one_sentence_promise: "Three 30-second clips cut directly from the Thursday anchor video.",
                what_already_exists: "Thursday anchor master footage",
                allocated_hours: 2,
              },
            ],
            total_hours_cost: 10,
            what_to_drop_first: "Drop the Saturday cheap video first; protect the Thursday anchor and the 3 Shorts at all costs.",
          };
        }
        break;
      }

      case "viral": {
        const { systemPrompt, userPrompt } = buildViralPrompt(JSON.stringify(input.outliers), voice);
        if (hasKey) {
          result = await callLlmStructured({
            systemPrompt,
            userPrompt: withFeedback(userPrompt),
            schema: ViralCommentarySchema,
          });
        } else {
          result = {
            top_outliers_summary: [
              "Outliers rely heavily on empirical challenge titles (I Tried It) and counter-intuitive stats.",
              "Multiple over channel median averaged 4.2x when titles carried a specific number.",
            ],
            one_structural_thing: "Every breakout outlier sets up an experiment with an explicit timeframe (e.g. 30 days) and personal stakes.",
            recommended_to_make_this_week: "I Let an AI Run My YouTube Channel for 30 Days",
            why_fits_voice_and_capacity: "You already have the tooling ready and can document your genuine process without inventing claims.",
            observations: [
              "Channels with 10x multiples avoid abstract tutorials and frame topics as personal trials.",
              "Thumbnails among these outliers average 2.4 words.",
            ],
          };
        }
        break;
      }

      case "retention": {
        const { systemPrompt, userPrompt } = buildRetentionPrompt(JSON.stringify(input.metrics), voice);
        if (hasKey) {
          result = await callLlmStructured({
            systemPrompt,
            userPrompt: withFeedback(userPrompt),
            schema: RetentionAdviceSchema,
          });
        } else {
          const isHealthy = input.metrics.hook_leak < 25;
          result = {
            single_biggest_leak: isHealthy
              ? "Your hook retention is healthy (under 25% lost). The main drop is pacing slide in the mid-section."
              : `Hook leak is ${input.metrics.hook_leak}% lost in the first 30 seconds. Your first sentence is not delivering the promise fast enough.`,
            one_change: isHealthy
              ? "Do not rewrite the script. Send this video to /yt-package to improve the CTR pairing."
              : "Cut the 10-second preamble before the first visual demonstration.",
            is_packaging_problem: isHealthy,
            secondary_notes: [
              "Cliff at 240s indicates an unannounced topic shift.",
              "Middle slide rate of 0.588% can be tightened by trimming pauses.",
            ],
          };
        }
        break;
      }

      case "shorts": {
        const { systemPrompt, userPrompt } = buildShortsPrompt(input.transcript, voice);
        if (hasKey) {
          result = await callLlmStructured({
            systemPrompt,
            userPrompt: withFeedback(userPrompt),
            schema: ShortsCutterSchema,
          });
        } else {
          result = {
            candidates: [
              {
                span_start_timecode: "00:00:00",
                span_end_timecode: "00:00:27",
                duration_seconds: 27,
                opening_line: "So here is how to write a hook that works.",
                new_first_line: "97% of YouTube creators quit before video 30 because of this one mistake.",
                on_screen_text_2s: "STOP LOSING VIEWERS",
                loop_point: "That is the whole workflow, which is why...",
                vertical_crop_note: "Keep the center third centered; screen recording text is slightly small at 9:16.",
              },
              {
                span_start_timecode: "00:00:19",
                span_end_timecode: "00:00:46",
                duration_seconds: 27,
                opening_line: "Now let us talk about thumbnails and the three word rule.",
                new_first_line: "Thumbnails with more than three words turn into a grey smear at feed size.",
                on_screen_text_2s: "THE 3-WORD RULE",
                loop_point: "Which brings us right back to thumbnail design.",
                vertical_crop_note: "Crop out sides, focus tight on the thumbnail preview graphic.",
              },
            ],
          };
        }
        break;
      }

      case "seo": {
        const { systemPrompt, userPrompt } = buildSeoPrompt(input.title, input.topic, input.summary, voice);
        if (hasKey) {
          result = await callLlmStructured({
            systemPrompt,
            userPrompt: withFeedback(userPrompt),
            schema: SeoSchema,
          });
        } else {
          result = {
            first_two_lines: `${input.title}. Here is the complete breakdown and retention blueprint.`,
            link_resource: "https://github.com/Jakeschincariol/youtube-agent-skill",
            chapters_placeholder: "0:00 The Hook Formula\n0:19 Thumbnail Rules\n0:34 Descriptions & SEO",
            long_description: `In this video, we break down how to optimize YouTube retention, title and thumbnail packaging, and editing workflows.\n\nWho this is for: Creators making long-form content who want higher average view duration.\n\nTools mentioned:\n- DaVinci Resolve\n- Hook score diagnostic\n- Whisper captions`,
            tags: [
              "youtube retention",
              "youtube analytics",
              "hook formula",
              "audience retention",
              "davinci resolve",
              "youtube seo",
            ],
            proposed_queries: [
              "why creators quit youtube",
              "how to fix audience retention youtube",
              "youtube hook formulas that work",
            ],
          };
        }
        break;
      }

      case "chapters": {
        const { systemPrompt, userPrompt } = buildChaptersRetitlePrompt(JSON.stringify(input.chapters), voice);
        if (hasKey) {
          result = await callLlmStructured({
            systemPrompt,
            userPrompt: withFeedback(userPrompt),
            schema: ChaptersRetitleSchema,
          });
        } else {
          result = {
            relabelled_chapters: (input.chapters || []).map((c: any, idx: number) => ({
              start: c.start,
              label: c.label,
              relabelled_title: idx === 0 ? "The Hook Blueprint" : idx === 1 ? "The 3-Word Rule" : "Search Snippets & Tags",
              flagged_filler: false,
            })),
          };
        }
        break;
      }

      case "audit": {
        const { systemPrompt, userPrompt } = buildAuditPrompt(JSON.stringify(input), voice);
        if (hasKey) {
          result = await callLlmStructured({
            systemPrompt,
            userPrompt: withFeedback(userPrompt),
            schema: AuditSchema,
          });
        } else {
          result = {
            single_biggest_fix: {
              name: "Fix the first 15 seconds: move from channel introductions to viewer stakes.",
              what_to_do_this_week: "Remove all greetings ('hey guys') from the next recording and open directly with the chosen hook formula.",
            },
            three_things_working: [
              "Title length is disciplined (average 46 chars, well inside desktop search cut).",
              "Weekly upload cadence is consistent with zero multi-week gaps in the last 6 uploads.",
              "Concrete figures appear in 40% of recent titles, anchoring expectations.",
            ],
            what_not_to_do_yet: {
              action: "Do not redesign your channel banner or buy a new camera.",
              why: "Your retention drops happen at 0:15 in the script, not in camera resolution.",
            },
          };
        }
        break;
      }

      default:
        return NextResponse.json({ error: `Unknown module: ${module}` }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("[API Generate Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error occurred." },
      { status: 500 }
    );
  }
}
