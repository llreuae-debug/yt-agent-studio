import type { Metadata } from "next";
import ViralClient from "./ViralClient";
import {
  buildPageMetadata,
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
  buildFaqSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "YouTube Outlier Analysis: Median Multiples | YT Agent Studio",
  description: "Rank collected videos by multiple over channel median, filter noise from thin channels, and classify title formulas behind genuine viral breakouts.",
  path: "/viral",
});

const FAQS = [
  {
    question: "Why measure multiples over channel median instead of raw view count?",
    answer: "A video with 500,000 views on a 5-million subscriber channel is an underperformance (0.1x), while 100,000 views on a 5,000 subscriber channel is a massive 20x outlier. Multiples isolate what packaging genuinely broke through the niche.",
  },
  {
    question: "Why does the tool require at least 4 videos per channel?",
    answer: "Channels with fewer than 4 recorded videos lack statistical baseline data. Calculating a median with 1 or 2 videos produces misleading multiples, so thin channels are skipped.",
  },
  {
    question: "What multiple indicates a true YouTube outlier?",
    answer: "A video achieving 2.5x or higher compared to its channel median is classified as a notable outlier, while 5.0x or higher indicates a runaway viral packaging format worth analyzing.",
  },
];

export default function ViralPage() {
  const breadcrumbs = buildBreadcrumbSchema([{ name: "Outlier Analysis", path: "/viral" }]);
  const webapp = buildWebApplicationSchema({
    path: "/viral",
    name: "YouTube Outlier Analysis & Swipe File",
    description: "Ranks videos by multiple over channel median (minimum 4 videos per channel) and classifies title formulas.",
  });
  const faqSchema = buildFaqSchema(FAQS);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webapp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ViralClient />

      <article className="mt-20 border-t border-line/60 pt-12 space-y-12">
        <header className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-txt tracking-tight">
            YouTube Outlier Analysis & Swipe File Studio
          </h2>
          <div className="p-5 rounded-xl border border-line-focus bg-surface-1 text-sm text-txt leading-relaxed font-medium">
            A YouTube outlier analysis tool separates genuine breakout videos from channel size bias. By calculating each video&apos;s view multiple over its own channel&apos;s median (filtering out thin channels with fewer than 4 videos), this tool reveals the exact packaging formulas causing outsized views in your niche.
          </div>
        </header>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-txt">How It Works</h3>
          <ol className="grid gap-4 sm:grid-cols-3 list-decimal list-inside text-xs text-txt-2">
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">1. Input Swipe List:</strong> Paste titles, view counts, and channel names from your niche research.
            </li>
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">2. Deterministic Filtering:</strong> Calculates the median views per channel, filters channels with &lt;4 uploads, and sorts by performance multiple.
            </li>
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">3. Formula Takeaways:</strong> Synthesizes the structural patterns (e.g. 30-day challenges, empirical stats) driving the top outliers.
            </li>
          </ol>
        </section>

        <div className="grid gap-6 sm:grid-cols-2 text-xs text-txt-2">
          <section className="p-5 rounded-xl border border-line bg-surface-1 space-y-2">
            <h3 className="text-sm font-bold text-txt">What You Get</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Channel median benchmarks</li>
              <li>Multiples ranking table (e.g. 5.2x median)</li>
              <li>Classification against 21 proven title formulas</li>
              <li>Actionable recommendation for your next video</li>
            </ul>
          </section>

          <section className="p-5 rounded-xl border border-line bg-surface-1 space-y-2">
            <h3 className="text-sm font-bold text-txt">Honest Limits</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Requires accurate manual entry of views and channels.</li>
              <li>Niche novelty can influence multiples independently of packaging.</li>
              <li>Outlier formats must still align with your creator voice.</li>
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
