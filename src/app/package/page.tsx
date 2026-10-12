import type { Metadata } from "next";
import PackageClient from "./PackageClient";
import {
  buildPageMetadata,
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
  buildFaqSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "YouTube Title & Thumbnail Studio: 3-Word Rule | YT Agent Studio",
  description: "Lint 10 titles against 40-char mobile and 60-char desktop cutoffs, generate 3-word thumbnail briefs, and check title-thumbnail word duplication.",
  path: "/package",
});

const FAQS = [
  {
    question: "Why does the linter flag titles longer than 60 characters?",
    answer: "YouTube desktop search results truncate titles with an ellipsis after approximately 60 characters. Placing your core hook within the first 60 characters guarantees it remains visible.",
  },
  {
    question: "Why is there a 40-character mobile title cutoff?",
    answer: "On mobile devices and suggested video feeds, titles frequently cut off after 40 to 45 characters. Testing against 40 characters ensures mobile viewers see the full premise.",
  },
  {
    question: "What is the 3-word thumbnail rule?",
    answer: "The 3-word thumbnail rule states that thumbnail graphics should display a maximum of three high-contrast words to prevent visual clutter at small mobile feed sizes (168x94px).",
  },
  {
    question: "Why should thumbnail words differ from title words?",
    answer: "Repeating the title in the thumbnail wastes valuable packaging real estate. Complementary thumbnail text creates an open loop that increases click-through rates.",
  },
];

export default function PackagePage() {
  const breadcrumbs = buildBreadcrumbSchema([{ name: "Package Studio", path: "/package" }]);
  const webapp = buildWebApplicationSchema({
    path: "/package",
    name: "YouTube Title & Thumbnail Studio",
    description: "Generates 10 titles, lints down to the top three using desktop and mobile cutoffs, and writes thumbnail 3-word briefs.",
  });
  const faqSchema = buildFaqSchema(FAQS);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webapp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <PackageClient />

      <article className="mt-20 border-t border-line/60 pt-12 space-y-12">
        <header className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-txt tracking-tight">
            YouTube Title & Thumbnail Packaging Studio
          </h2>
          <div className="p-5 rounded-xl border border-line-focus bg-surface-1 text-sm text-txt leading-relaxed font-medium">
            YouTube packaging connects the title and thumbnail into a unified click surface. This studio generates 10 titles, lints them against 60-character desktop and 40-character mobile cutoffs, eliminates title-thumbnail word repetition, and drafts a 3-word thumbnail brief.
          </div>
        </header>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-txt">How It Works</h3>
          <ol className="grid gap-4 sm:grid-cols-3 list-decimal list-inside text-xs text-txt-2">
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">1. Input Video Topic:</strong> Enter your video premise or transcript summary. The generator drafts 10 distinct titles.
            </li>
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">2. Deterministic Linting:</strong> Titles are checked for all-caps shouting, concrete figures, desktop limits (60 chars), and mobile limits (40 chars).
            </li>
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">3. 3-Word Thumbnail Brief:</strong> Select your top title to generate facial expression notes, framing guidelines, and non-duplicate thumbnail text.
            </li>
          </ol>
        </section>

        <div className="grid gap-6 sm:grid-cols-2 text-xs text-txt-2">
          <section className="p-5 rounded-xl border border-line bg-surface-1 space-y-2">
            <h3 className="text-sm font-bold text-txt">What You Get</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>10 candidate titles with character count gauges</li>
              <li>Top 3 linted title recommendations</li>
              <li>3-word high-contrast thumbnail brief</li>
              <li>Word-overlap duplication warnings</li>
            </ul>
          </section>

          <section className="p-5 rounded-xl border border-line bg-surface-1 space-y-2">
            <h3 className="text-sm font-bold text-txt">Honest Limits</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Character cutoffs reflect standard YouTube responsive breakpoints.</li>
              <li>High-CTR titles still require content delivery to maintain retention.</li>
              <li>Thumbnails should always be tested at mobile sizes before uploading.</li>
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
