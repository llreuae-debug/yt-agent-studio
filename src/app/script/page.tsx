import type { Metadata } from "next";
import ScriptClient from "./ScriptClient";
import {
  buildPageMetadata,
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
  buildFaqSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "YouTube Script Writer: Scored Hooks & Retention | YT Agent Studio",
  description: "Generate 5 candidate hooks scored deterministically across 5 dimensions, rank top two, and write full YouTube scripts with on-screen visual cues.",
  path: "/script",
});

const FAQS = [
  {
    question: "How do I write a good YouTube hook?",
    answer: "A strong YouTube hook is 12 to 28 words long and confirms the title and thumbnail promise immediately. State the specific subject, speak directly to the viewer ('you'), establish tangible stakes, and open an unresolved curiosity loop before introducing yourself.",
  },
  {
    question: "What are the 5 scoring properties for hooks in this tool?",
    answer: "Every candidate hook is scored out of 10 across Specificity (concrete details), Address (second-person singular 'you'), Stakes (consequences of inaction), Curiosity (unresolved loop), and Brevity (optimal 12-28 word count), using Banker's rounding.",
  },
  {
    question: "What does an on-screen cue in a YouTube script do?",
    answer: "On-screen cues (formatted as [ON SCREEN: ...]) instruct the editor on what visual b-roll, motion graphic, or zoom should occur simultaneously with spoken words. Visual changes every 4 to 7 seconds significantly reduce mid-video viewer drop-offs.",
  },
  {
    question: "Can Hook Score predict YouTube video views?",
    answer: "No. The Hook Score is an editorial diagnostic heuristic to help writers eliminate generic greetings, fluff, and vague wording. No tool can predict the YouTube recommendation algorithm.",
  },
];

export default function ScriptPage() {
  const breadcrumbs = buildBreadcrumbSchema([{ name: "Script Engine", path: "/script" }]);
  const webapp = buildWebApplicationSchema({
    path: "/script",
    name: "YouTube Script Writer with Scored Hooks",
    description: "Generates 5 candidate hooks tagged with the 21 formulas, scores them deterministically, and writes a retention script with visual cues.",
  });
  const faqSchema = buildFaqSchema(FAQS);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webapp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Interactive Tool Workspace */}
      <ScriptClient />

      {/* Server-Rendered Educational Content & AEO Block */}
      <article className="mt-20 border-t border-line/60 pt-12 space-y-12">
        <header className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-txt tracking-tight">
            YouTube Script Writer with Scored Hooks
          </h2>
          {/* Direct Answer Block (40-60 words) */}
          <div className="p-5 rounded-xl border border-line-focus bg-surface-1 text-sm text-txt leading-relaxed font-medium">
            A YouTube script writer transforms a raw video idea into an engaging spoken draft. This tool generates 5 candidate hooks tagged with 21 proven formulas, evaluates them deterministically across 5 properties, ranks down to the top two, and writes a complete retention script with visual [ON SCREEN: ...] cues.
          </div>
        </header>

        {/* How It Works */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-txt">How It Works</h3>
          <ol className="grid gap-4 sm:grid-cols-3 list-decimal list-inside text-xs text-txt-2">
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">1. Input Idea & Title:</strong> Paste your topic, working title, and target length. The engine injects your custom Voice Profile.
            </li>
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">2. Deterministic Scoring:</strong> The tool drafts 5 hooks, parses regex patterns, and scores each across Specificity, Address, Stakes, Curiosity, and Brevity.
            </li>
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">3. Retention Scripting:</strong> Select your top hook to generate spoken beats matched with exact [ON SCREEN: ...] visual directions for editors.
            </li>
          </ol>
        </section>

        {/* What You Get & Limits */}
        <div className="grid gap-6 sm:grid-cols-2 text-xs text-txt-2">
          <section className="p-5 rounded-xl border border-line bg-surface-1 space-y-2">
            <h3 className="text-sm font-bold text-txt">What You Get</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>5 candidate hooks classified by formula</li>
              <li>Detailed 5-property score breakdowns (0–10)</li>
              <li>Top 2 ranked hook recommendations</li>
              <li>Full video script with timestamps and visual notes</li>
            </ul>
          </section>

          <section className="p-5 rounded-xl border border-line bg-surface-1 space-y-2">
            <h3 className="text-sm font-bold text-txt">Honest Limits</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Hook Score is an editorial heuristic, not an algorithm predictor.</li>
              <li>Scores measure language economy, not subject matter appeal.</li>
              <li>All scripts require creator review and delivery practice.</li>
            </ul>
          </section>
        </div>

        {/* Visible FAQ */}
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
