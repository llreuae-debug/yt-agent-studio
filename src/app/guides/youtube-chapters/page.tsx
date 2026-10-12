import type { Metadata } from "next";
import Link from "next/link";
import { Bookmark, ArrowRight, HelpCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import {
  buildPageMetadata,
  buildBreadcrumbSchema,
  buildTechArticleSchema,
  buildFaqSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "YouTube Chapter Rules: Timestamps & Format Guide | YT Agent Studio",
  description: "Learn how to write YouTube chapters that actually work. Understand the mandatory 0:00 start rule, 3-chapter minimum, and 10-second duration limits.",
  path: "/guides/youtube-chapters",
});

const FAQS = [
  {
    question: "Why are my YouTube chapters not working in the video player?",
    answer: "Chapters will not appear on YouTube if the first timestamp does not start at 0:00, if you have fewer than 3 total chapters, if any chapter is shorter than 10 seconds, or if timestamps are not formatted correctly in ascending order.",
  },
  {
    question: "What is the proper format for YouTube timestamps in descriptions?",
    answer: "Format timestamps as MM:SS (or HH:MM:SS for videos over an hour), followed by a space and a descriptive chapter title. For example: '0:00 Introduction', '2:15 The 3-Word Rule', and '5:40 Final Verdict'.",
  },
  {
    question: "Do chapters help video SEO on Google and YouTube?",
    answer: "Yes. Google uses properly formatted YouTube chapters to generate 'Key Moments' in organic search results, enabling searchers to jump directly to specific answers within your video.",
  },
];

export default function ChaptersGuidePage() {
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Guides", path: "/guides/audience-retention" },
    { name: "YouTube Chapters", path: "/guides/youtube-chapters" },
  ]);
  const articleSchema = buildTechArticleSchema({
    title: "How to Write YouTube Chapters That Work: Rules & Timestamps",
    description: "Understand the mandatory 0:00 start rule, 3-chapter minimum, and 10-second duration limits.",
    path: "/guides/youtube-chapters",
    datePublished: "2026-10-13",
    dateModified: "2026-10-13",
  });
  const faqSchema = buildFaqSchema(FAQS);

  return (
    <article className="max-w-4xl mx-auto py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Header */}
      <div className="border-b border-line pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-line text-xs font-mono text-txt-2 mb-4">
          <Bookmark className="w-3.5 h-3.5 text-yt-red" />
          <span>Navigation & SEO Explainer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-txt tracking-tight">
          How to Write YouTube Chapters That Work
        </h1>
        <p className="mt-2 text-xs text-txt-3">
          Published: <time dateTime="2026-10-13">October 13, 2026</time> • 5 min read
        </p>

        {/* Direct Answer Block (40-60 words AEO target) */}
        <div className="mt-6 p-5 rounded-xl border border-line-focus bg-surface-1 text-sm text-txt leading-relaxed font-medium">
          YouTube chapters split your video timeline into titled segments. For chapters to appear in the player and enable Google Key Moments, you must follow three strict rules: the first chapter must begin at <strong>0:00</strong>, there must be at least <strong>3 chapters</strong> listed in chronological order, and each chapter must be at least <strong>10 seconds</strong> long.
        </div>
      </div>

      <div className="my-10 space-y-10 text-sm text-txt-2 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-txt">1. The Three Non-Negotiable Rules</h2>
          <div className="grid gap-4 sm:grid-cols-3 my-4">
            <div className="p-4 rounded-xl border border-line bg-surface-1">
              <h3 className="font-bold text-sm text-txt mb-1">Rule 1: Start at 0:00</h3>
              <p className="text-xs text-txt-2">
                Your first chapter must explicitly begin at timestamp <code className="font-mono text-yt-red">0:00</code>. Starting at 0:05 or 0:15 will cause YouTube to ignore all chapters completely.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-line bg-surface-1">
              <h3 className="font-bold text-sm text-txt mb-1">Rule 2: Minimum 3 Chapters</h3>
              <p className="text-xs text-txt-2">
                YouTube requires at least three chapters. Listing only two timestamps will fail validation and will not generate timeline segments.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-line bg-surface-1">
              <h3 className="font-bold text-sm text-txt mb-1">Rule 3: Minimum 10 Seconds</h3>
              <p className="text-xs text-txt-2">
                Each chapter span must be at least 10 seconds in duration. Any marker spaced closer than 10 seconds to the previous one is disqualified.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-txt">2. Proper Timestamp Formatting Example</h2>
          <p>
            Paste your timestamps into the video description on their own dedicated lines. The timestamp must be placed on the left, followed by a space and the chapter name:
          </p>
          <div className="p-4 rounded-xl border border-line bg-surface-2 font-mono text-xs text-txt leading-relaxed">
            0:00 The Hook Blueprint<br />
            0:45 Why 97% of Creators Quit<br />
            2:30 The 3-Word Thumbnail Rule<br />
            5:10 Editing Out Dead Air<br />
            8:00 Retention Checklist & Next Steps
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-txt">3. Best Practices for Chapter Titles</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Write in the Creator&apos;s Voice:</strong> Instead of generic labels like &quot;Step 1&quot; or &quot;Middle&quot;, write action-oriented titles like &quot;The 3-Word Rule&quot;.</li>
            <li><strong>Match Search Intent:</strong> Use exact query terminology for tutorial sections so Google surfaces them as rich &quot;Key Moments&quot; in Google Search.</li>
            <li><strong>Never Spoil the Climax:</strong> If your video revolves around a mystery or reveal, use curiosity-inducing labels rather than giving away the punchline early.</li>
          </ul>
        </section>

        {/* Module Link Callout */}
        <div className="p-6 rounded-2xl border border-line bg-surface-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-txt text-base">Generate Valid Chapters Automatically</h3>
            <p className="text-xs text-txt-2 mt-1">Paste your subtitle transcript to automatically detect natural pauses, enforce 0:00 and 10s rules, and re-title in your voice.</p>
          </div>
          <Link
            href="/chapters"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-yt-red hover:bg-yt-red-hover text-white text-xs font-bold transition-all shadow-glow shrink-0"
          >
            <span>Open Chapter Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* FAQ Section */}
        <section className="space-y-4 pt-6 border-t border-line">
          <h2 className="text-2xl font-bold text-txt">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="p-4 rounded-xl border border-line bg-surface-1">
                <h3 className="font-bold text-sm text-txt">{faq.question}</h3>
                <p className="text-xs text-txt-2 mt-2 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
