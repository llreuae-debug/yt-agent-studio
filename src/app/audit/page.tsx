import type { Metadata } from "next";
import AuditClient from "./AuditClient";
import {
  buildPageMetadata,
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
  buildFaqSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "YouTube Channel Audit: Cadence, Hooks & Titles | YT Agent Studio",
  description: "Audit your YouTube channel health: lint 10 recent titles, score 3 opening hooks, check upload cadence consistency, and simulate 168x94px mobile feed size.",
  path: "/audit",
});

const FAQS = [
  {
    question: "What does the 168x94px thumbnail preview simulator test?",
    answer: "On mobile YouTube app feeds, thumbnails shrink to approximately 168x94 pixels. The simulator tests whether your thumbnail text and focal subject are instantly legible at this reduced size.",
  },
  {
    question: "How is upload cadence variance calculated?",
    answer: "The tool measures the spacing in days between consecutive uploads. A low spread variance indicates consistent publishing cadence, which stabilizes algorithmic viewer expectations.",
  },
  {
    question: "What is the single biggest fix in a channel audit?",
    answer: "Instead of overwhelming you with minor critiques, the audit synthesizes your titles, hooks, and thumbnail legibility to highlight the single most impactful editorial change to make on your next upload.",
  },
];

export default function AuditPage() {
  const breadcrumbs = buildBreadcrumbSchema([{ name: "Channel Audit", path: "/audit" }]);
  const webapp = buildWebApplicationSchema({
    path: "/audit",
    name: "YouTube Channel Audit Studio",
    description: "Lints 10 titles, scores 3 recent opening hooks, checks upload cadence consistency, and simulates thumbnail readability at mobile feed size.",
  });
  const faqSchema = buildFaqSchema(FAQS);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webapp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <AuditClient />

      <article className="mt-20 border-t border-line/60 pt-12 space-y-12">
        <header className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-txt tracking-tight">
            YouTube Channel Audit Studio
          </h2>
          <div className="p-5 rounded-xl border border-line-focus bg-surface-1 text-sm text-txt leading-relaxed font-medium">
            A YouTube channel audit assesses your packaging, hook delivery, and publishing rhythm. This tool lints 10 recent titles, scores 3 opening video hooks, checks upload cadence consistency (spread variance), simulates thumbnail readability at mobile feed size (168x94px), and delivers the single biggest fix.
          </div>
        </header>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-txt">How It Works</h3>
          <ol className="grid gap-4 sm:grid-cols-3 list-decimal list-inside text-xs text-txt-2">
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">1. Input Channel Sample:</strong> Enter 10 recent titles, upload dates, and opening hook transcripts from your last 3 uploads.
            </li>
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">2. Deterministic Linting:</strong> Evaluates title lengths, shouting flags, hook scores, upload intervals, and thumbnail legibility.
            </li>
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">3. The 1 Big Fix:</strong> Synthesizes what is working well, what not to do yet, and the single highest-leverage improvement for your channel.
            </li>
          </ol>
        </section>

        <div className="grid gap-6 sm:grid-cols-2 text-xs text-txt-2">
          <section className="p-5 rounded-xl border border-line bg-surface-1 space-y-2">
            <h3 className="text-sm font-bold text-txt">What You Get</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Comprehensive 10-title linting report</li>
              <li>3 opening hook diagnostic scores</li>
              <li>Upload cadence spread variance score</li>
              <li>Mobile feed size thumbnail previewer</li>
              <li>The single biggest fix for your next video</li>
            </ul>
          </section>

          <section className="p-5 rounded-xl border border-line bg-surface-1 space-y-2">
            <h3 className="text-sm font-bold text-txt">Honest Limits</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Evaluates packaging and scriptcraft, not video production budget.</li>
              <li>Cadence consistency is healthy, but content quality remains primary.</li>
              <li>Audit does not require or connect to your YouTube channel login.</li>
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
