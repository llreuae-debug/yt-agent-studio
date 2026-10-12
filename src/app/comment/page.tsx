import type { Metadata } from "next";
import CommentClient from "./CommentClient";
import {
  buildPageMetadata,
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
  buildFaqSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "YouTube Comment Replier: 4-Pile Triage & Pin | YT Agent Studio",
  description: "Triage YouTube comments into 4 piles (Questions, Corrections, Praise, Bait), generate concise under-30-word replies, and select one comment to pin.",
  path: "/comment",
});

const FAQS = [
  {
    question: "Why should YouTube comment replies stay under 30 words?",
    answer: "Short, punchy replies under 30 words respect viewer time, maintain conversational energy, and encourage follow-up comments, which boosts community engagement signals.",
  },
  {
    question: "How does 4-pile comment triage work?",
    answer: "Comments are triaged into Questions (requiring answers), Corrections (factual updates), Praise (supporters to acknowledge), and Bait (trolls to deliberately ignore).",
  },
  {
    question: "Which comment should a creator pin to the top of a video?",
    answer: "Pin the question or observation that addresses the most common viewer confusion or highlights a shared community friction point to stimulate productive discussion.",
  },
  {
    question: "Does this tool automatically post replies to YouTube?",
    answer: "No. You review and copy generated replies to paste into YouTube Studio by hand, ensuring authentic creator moderation.",
  },
];

export default function CommentPage() {
  const breadcrumbs = buildBreadcrumbSchema([{ name: "Comment Replier", path: "/comment" }]);
  const webapp = buildWebApplicationSchema({
    path: "/comment",
    name: "YouTube Comment Replier & Triage",
    description: "Triages comments into 4 piles, enforces strict under-30-word replies, and selects which comment to pin.",
  });
  const faqSchema = buildFaqSchema(FAQS);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webapp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <CommentClient />

      <article className="mt-20 border-t border-line/60 pt-12 space-y-12">
        <header className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-txt tracking-tight">
            YouTube Comment Replier & 4-Pile Triage
          </h2>
          <div className="p-5 rounded-xl border border-line-focus bg-surface-1 text-sm text-txt leading-relaxed font-medium">
            A YouTube comment replier organizes audience feedback to boost engagement without wasting hours. This tool triages comments into four piles (Questions, Corrections, Praise, and Bait), enforces concise under-30-word replies in your voice, and picks exactly one comment to pin.
          </div>
        </header>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-txt">How It Works</h3>
          <ol className="grid gap-4 sm:grid-cols-3 list-decimal list-inside text-xs text-txt-2">
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">1. Paste Video Comments:</strong> Copy and paste recent comment threads from your latest upload into the input box.
            </li>
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">2. 4-Pile Categorization:</strong> Comments are split into Questions, Corrections, Praise, and Bait with count badges.
            </li>
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">3. Draft & Pin:</strong> Review drafted replies (&lt;30 words), identify future video ideas, and copy the designated pinned comment.
            </li>
          </ol>
        </section>

        <div className="grid gap-6 sm:grid-cols-2 text-xs text-txt-2">
          <section className="p-5 rounded-xl border border-line bg-surface-1 space-y-2">
            <h3 className="text-sm font-bold text-txt">What You Get</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Category counts across all 4 piles</li>
              <li>Concise replies under 30 words</li>
              <li>Recommended single comment to pin with rationale</li>
              <li>Troll and bait comments filtered out with explanations</li>
            </ul>
          </section>

          <section className="p-5 rounded-xl border border-line bg-surface-1 space-y-2">
            <h3 className="text-sm font-bold text-txt">Honest Limits</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Replies are suggested drafts that you copy and paste manually.</li>
              <li>Contextual nuances should be verified before posting.</li>
              <li>Bait classification focuses on ad-hominem and non-constructive feedback.</li>
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
