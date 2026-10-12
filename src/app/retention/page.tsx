import type { Metadata } from "next";
import RetentionClient from "./RetentionClient";
import {
  buildPageMetadata,
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
  buildFaqSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "YouTube Retention Reader: Hook Leak & Cliffs | YT Agent Studio",
  description: "Visualize YouTube retention curves, diagnose Hook Leak in the first 30 seconds, detect drop-off cliffs, and receive one actionable editorial fix.",
  path: "/retention",
});

const FAQS = [
  {
    question: "What is Hook Leak on a YouTube retention graph?",
    answer: "Hook Leak is the percentage of viewers who stop watching during the first 30 seconds. A drop greater than 25% indicates that the opening hook is failing to confirm the premise promised in the title and thumbnail.",
  },
  {
    question: "How does the tool identify retention cliffs?",
    answer: "The algorithm calculates moving negative slopes along the retention curve and flags the top 5 steepest percentage drops occurring in 5-second intervals.",
  },
  {
    question: "What is the Middle Slide rate?",
    answer: "Middle Slide measures the rate of gradual audience attrition between 0:30 and the final 30 seconds. High slide rates indicate conversational drag or lack of visual variety.",
  },
  {
    question: "Why does the tool deliver only one primary fix?",
    answer: "Overloading creators with a dozen minor edits creates analysis paralysis. Prioritizing the single largest point of viewer drop-off ensures immediate editorial impact on your next upload.",
  },
];

export default function RetentionPage() {
  const breadcrumbs = buildBreadcrumbSchema([{ name: "Retention Reader", path: "/retention" }]);
  const webapp = buildWebApplicationSchema({
    path: "/retention",
    name: "YouTube Audience Retention Reader",
    description: "Visualizes retention curves, diagnoses Hook Leak, cliff drops, and middle slide rates, delivering exactly one primary fix.",
  });
  const faqSchema = buildFaqSchema(FAQS);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webapp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <RetentionClient />

      <article className="mt-20 border-t border-line/60 pt-12 space-y-12">
        <header className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-txt tracking-tight">
            YouTube Audience Retention Graph Reader
          </h2>
          <div className="p-5 rounded-xl border border-line-focus bg-surface-1 text-sm text-txt leading-relaxed font-medium">
            An audience retention reader interprets YouTube Studio percentage watch-time exports. This tool charts your retention curve with interactive tooltips, diagnoses Hook Leak in the first 30 seconds, isolates steep drop Cliffs, measures mid-video Slide rates, and prescribes exactly one primary fix.
          </div>
        </header>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-txt">How It Works</h3>
          <ol className="grid gap-4 sm:grid-cols-3 list-decimal list-inside text-xs text-txt-2">
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">1. Paste Retention Array:</strong> Copy the percentage retention series from YouTube Studio analytics or load sample data.
            </li>
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">2. Curve Diagnosis:</strong> Deterministic algorithms measure 0–30s Hook Leak, find the 5 steepest drop-off cliffs, and calculate slide rate per unit.
            </li>
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">3. Single Primary Fix:</strong> Synthesizes whether your video suffered an editorial preamble issue or a title-packaging disconnect.
            </li>
          </ol>
        </section>

        <div className="grid gap-6 sm:grid-cols-2 text-xs text-txt-2">
          <section className="p-5 rounded-xl border border-line bg-surface-1 space-y-2">
            <h3 className="text-sm font-bold text-txt">What You Get</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Interactive retention curve chart</li>
              <li>Hook Leak percentage benchmark (&lt;25% target)</li>
              <li>Top 5 steepest drop cliffs mapped to timestamps</li>
              <li>Exactly one focused editorial change for your next video</li>
            </ul>
          </section>

          <section className="p-5 rounded-xl border border-line bg-surface-1 space-y-2">
            <h3 className="text-sm font-bold text-txt">Honest Limits</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Diagnostics reflect relative viewer retention, not absolute impressions.</li>
              <li>Requires exported numerical series from YouTube Studio.</li>
              <li>Pacing fixes apply to future video recordings and edits.</li>
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
