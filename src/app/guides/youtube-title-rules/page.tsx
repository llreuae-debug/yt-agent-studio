import type { Metadata } from "next";
import Link from "next/link";
import { Package, ArrowRight, HelpCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import {
  buildPageMetadata,
  buildBreadcrumbSchema,
  buildTechArticleSchema,
  buildFaqSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "YouTube Title Length Rules: 60 vs 40 Characters | YT Agent Studio",
  description: "Learn the exact character limits for YouTube video titles. Discover the 60-character desktop cutoff, 40-character mobile rule, and 3-word thumbnail synergy.",
  path: "/guides/youtube-title-rules",
});

const FAQS = [
  {
    question: "What is the maximum allowed title length on YouTube?",
    answer: "YouTube permits up to 100 characters in a video title. However, titles exceeding 60 characters are truncated with an ellipsis on desktop, and titles exceeding 40 to 50 characters are cut off on mobile search and suggested feeds.",
  },
  {
    question: "Why should you keep YouTube titles under 60 characters?",
    answer: "Keeping your title under 60 characters guarantees that the entire core hook and promise are visible across desktop browse pages and YouTube search results without being cut off by an ellipsis.",
  },
  {
    question: "What is the 3-word thumbnail rule?",
    answer: "The 3-word thumbnail rule is an editorial guideline stating that thumbnail overlay text should not exceed 3 high-contrast words and should not duplicate words already used in the title. This pairs the two assets together to maximize curiosity.",
  },
];

export default function TitleRulesGuidePage() {
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Guides", path: "/guides/audience-retention" },
    { name: "Title Rules", path: "/guides/youtube-title-rules" },
  ]);
  const articleSchema = buildTechArticleSchema({
    title: "How Long Should a YouTube Title Be? Desktop vs Mobile Rules",
    description: "Learn the 60-character desktop cutoff, 40-character mobile rule, and 3-word thumbnail synergy.",
    path: "/guides/youtube-title-rules",
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
          <Package className="w-3.5 h-3.5 text-yt-red" />
          <span>Packaging & CTR Explainer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-txt tracking-tight">
          How Long Should a YouTube Title Be? (Desktop vs. Mobile)
        </h1>
        <p className="mt-2 text-xs text-txt-3">
          Published: <time dateTime="2026-10-13">October 13, 2026</time> • 5 min read
        </p>

        {/* Direct Answer Block (40-60 words AEO target) */}
        <div className="mt-6 p-5 rounded-xl border border-line-focus bg-surface-1 text-sm text-txt leading-relaxed font-medium">
          While YouTube technically permits up to 100 characters in a title, the optimal title length is between <strong>40 and 60 characters</strong>. Titles are truncated with an ellipsis after 60 characters on desktop search results and after approximately 40 characters in mobile suggested feeds.
        </div>
      </div>

      <div className="my-10 space-y-10 text-sm text-txt-2 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-txt">1. The Two Critical Cutoff Boundaries</h2>
          <div className="grid gap-4 sm:grid-cols-2 my-4">
            <div className="p-4 rounded-xl border border-line bg-surface-1">
              <h3 className="font-bold text-sm text-txt mb-1">Desktop Cutoff: 60 Characters</h3>
              <p className="text-xs text-txt-2">
                On desktop browsers, YouTube allocates approximately 60 characters before cutting off remaining words with &quot;...&quot;. If your key premise is at character 68, desktop searchers will never see it.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-line bg-surface-1">
              <h3 className="font-bold text-sm text-txt mb-1">Mobile Cutoff: 40 Characters</h3>
              <p className="text-xs text-txt-2">
                With over 70% of YouTube views originating from mobile devices, feeds and push notifications frequently cut titles after 40 to 45 characters. Place your highest-intent words in the first 4 words.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-txt">2. Avoid Title-Thumbnail Word Duplication</h2>
          <p>
            One of the most frequent packaging mistakes is repeating the exact same words on both the thumbnail graphic and the title text.
          </p>
          <p>
            When your thumbnail reads &quot;HOW TO EDIT FAST&quot; and your title reads &quot;How to Edit Fast in Premiere Pro&quot;, you waste half of your available pitch surface. Instead, use the <strong>3-Word Rule</strong>:
          </p>
          <div className="p-4 rounded-xl border border-line bg-surface-2 space-y-2 text-xs">
            <p><strong>Title:</strong> How I Cut 10 Hours From My Editing Workflow</p>
            <p><strong>Thumbnail Graphic (3 Words):</strong> &quot;NEVER DO THIS&quot; or &quot;10 HOURS SAVED&quot;</p>
            <p className="text-txt-3">Result: The thumbnail creates curiosity, and the title delivers the concrete benefit without repeating words.</p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-txt">3. Four Deterministic Linter Rules</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Concrete Figures:</strong> Titles that include numbers (e.g. &quot;30 Days&quot;, &quot;$400&quot;, &quot;3 Edits&quot;) establish immediate tangible stakes.</li>
            <li><strong>No ALL CAPS Shouting:</strong> Excessive uppercase text triggers spam perception and degrades click-through rates over time.</li>
            <li><strong>Front-Loaded Value:</strong> Place the primary noun or result in the first half of the title rather than burying it at the end.</li>
            <li><strong>Vagueness Filter:</strong> Avoid generic terms like &quot;Must Watch&quot; or &quot;Crazy Results&quot; that offer zero categorical information.</li>
          </ul>
        </section>

        {/* Module Link Callout */}
        <div className="p-6 rounded-2xl border border-line bg-surface-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-txt text-base">Lint Your Titles Instantly</h3>
            <p className="text-xs text-txt-2 mt-1">Use our Package Studio to check 40-character mobile cutoffs, 60-character desktop limits, and thumbnail word overlaps in real time.</p>
          </div>
          <Link
            href="/package"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-yt-red hover:bg-yt-red-hover text-white text-xs font-bold transition-all shadow-glow shrink-0"
          >
            <span>Open Package Studio</span>
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
