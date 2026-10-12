import type { Metadata } from "next";
import ChaptersClient from "./ChaptersClient";
import {
  buildPageMetadata,
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
  buildFaqSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "YouTube Compliant Chapters: Rules & Validation | YT Agent Studio",
  description: "Generate valid YouTube chapters enforced against official platform rules: mandatory 0:00 start, at least 3 chapters, and minimum 10-second duration.",
  path: "/chapters",
});

const FAQS = [
  {
    question: "What are YouTube's non-negotiable rules for chapters?",
    answer: "YouTube enforces 3 rules: the first timestamp must start at 0:00, there must be at least 3 chapters in ascending chronological order, and each chapter must be at least 10 seconds long.",
  },
  {
    question: "Why does the tool analyze pause gaps for chapter boundaries?",
    answer: "Longer pause gaps (e.g. 2 to 4 seconds) in speech transcripts frequently correspond to topic transitions, slide changes, or visual chapter shifts.",
  },
  {
    question: "How do chapters enable Google Search 'Key Moments'?",
    answer: "Google indexes compliant YouTube chapters to create interactive Key Moments in search results, driving direct search traffic to exact solutions in your video.",
  },
];

export default function ChaptersPage() {
  const breadcrumbs = buildBreadcrumbSchema([{ name: "Compliant Chapters", path: "/chapters" }]);
  const webapp = buildWebApplicationSchema({
    path: "/chapters",
    name: "YouTube Compliant Chapters Generator",
    description: "Enforces YouTube's non-negotiable rules (0:00 start, 3+ chapters, 10s minimum) with pause gap analysis and custom retitling.",
  });
  const faqSchema = buildFaqSchema(FAQS);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webapp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ChaptersClient />

      <article className="mt-20 border-t border-line/60 pt-12 space-y-12">
        <header className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-txt tracking-tight">
            YouTube Compliant Chapters Generator
          </h2>
          <div className="p-5 rounded-xl border border-line-focus bg-surface-1 text-sm text-txt leading-relaxed font-medium">
            A YouTube chapter generator converts transcripts into validated player segments. This tool enforces YouTube&apos;s non-negotiable rules (mandatory 0:00 start, at least 3 chapters, and 10s minimum each), analyzes pause gaps and vocabulary shifts, and retitles sections in your creator voice.
          </div>
        </header>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-txt">How It Works</h3>
          <ol className="grid gap-4 sm:grid-cols-3 list-decimal list-inside text-xs text-txt-2">
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">1. Paste Timestamped Transcript:</strong> Load an .srt or .vtt subtitle file.
            </li>
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">2. Boundary Detection:</strong> Clusters pause gaps and topic transitions into candidate timestamp markers while enforcing 0:00 and 10s rules.
            </li>
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">3. Retitle in Creator Voice:</strong> Generates punchy, search-friendly titles for each segment and outputs ready-to-paste timestamps.
            </li>
          </ol>
        </section>

        <div className="grid gap-6 sm:grid-cols-2 text-xs text-txt-2">
          <section className="p-5 rounded-xl border border-line bg-surface-1 space-y-2">
            <h3 className="text-sm font-bold text-txt">What You Get</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>100% YouTube compliant timestamps</li>
              <li>Enforced 0:00 start and &gt;=10s duration verification</li>
              <li>Retitled chapter names in your voice</li>
              <li>One-click copyable description block</li>
            </ul>
          </section>

          <section className="p-5 rounded-xl border border-line bg-surface-1 space-y-2">
            <h3 className="text-sm font-bold text-txt">Honest Limits</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Automatic boundary detection relies on subtitle timestamp accuracy.</li>
              <li>Complex conceptual transitions should be manually double-checked.</li>
              <li>Chapters must be pasted into the description, not comments, for player segments.</li>
            </ul>
          </section>
        </div>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-txt">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-line bg-surface-1">
                <h4 className="font-bold text-sm text-txt">{faq.question}</h4>
                <p className="text-xs text-txt-2 mt-2 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </>
  );
}
