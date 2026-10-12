import type { Metadata } from "next";
import PlanClient from "./PlanClient";
import {
  buildPageMetadata,
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
  buildFaqSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "YouTube Weekly Planner: Capacity-Sized Schedule | YT Agent Studio",
  description: "Plan a realistic 7-day YouTube schedule sized strictly to available creator hours. Schedule 1 anchor, 1 cheap video, and 3 Shorts with an honest cutline.",
  path: "/plan",
});

const FAQS = [
  {
    question: "What is an Anchor video in a YouTube production schedule?",
    answer: "An Anchor video is your highest-effort, primary upload of the week. It requires the most scripting, filming, and editing time, and serves as the core source material from which 3 or more Shorts are extracted.",
  },
  {
    question: "What is a Cheap video format?",
    answer: "A Cheap video is a low-friction upload that takes under 2 hours to produce, such as a screen-recording tutorial, comment reply breakdown, or community Q&A session.",
  },
  {
    question: "What is the 'honest cutline' in production planning?",
    answer: "The honest cutline explicitly names which video or asset to cancel first if your work week is disrupted or creative energy drops, protecting your primary anchor video from burnout.",
  },
];

export default function PlanPage() {
  const breadcrumbs = buildBreadcrumbSchema([{ name: "Weekly Planner", path: "/plan" }]);
  const webapp = buildWebApplicationSchema({
    path: "/plan",
    name: "Weekly YouTube Production Planner",
    description: "Sized strictly to creator capacity (hours available and assets), planning 1 anchor, 1 cheap video, and 3 Shorts with an honest drop line.",
  });
  const faqSchema = buildFaqSchema(FAQS);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webapp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <PlanClient />

      <article className="mt-20 border-t border-line/60 pt-12 space-y-12">
        <header className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-txt tracking-tight">
            Weekly YouTube Production Planner
          </h2>
          <div className="p-5 rounded-xl border border-line-focus bg-surface-1 text-sm text-txt leading-relaxed font-medium">
            A YouTube production planner sizes your upload schedule to real-world creator capacity rather than wishful thinking. This tool balances available hours and existing assets to plan three uploads on a 7-day week (1 anchor, 1 cheap video, and 3 Shorts) with an honest line on what to drop first.
          </div>
        </header>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-txt">How It Works</h3>
          <ol className="grid gap-4 sm:grid-cols-3 list-decimal list-inside text-xs text-txt-2">
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">1. Input Hours & Assets:</strong> Specify available production hours, existing half-made assets, best publishing day, and niche.
            </li>
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">2. Realistic Allocation:</strong> The engine sizes 1 anchor video, 1 cheap format, and 3 derivative Shorts strictly within your time budget.
            </li>
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">3. The Cutline:</strong> Defines what to drop immediately if the week goes sideways to protect consistency without burnout.
            </li>
          </ol>
        </section>

        <div className="grid gap-6 sm:grid-cols-2 text-xs text-txt-2">
          <section className="p-5 rounded-xl border border-line bg-surface-1 space-y-2">
            <h3 className="text-sm font-bold text-txt">What You Get</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Structured 7-day upload schedule</li>
              <li>Hour budgets per format</li>
              <li>Single-sentence promises for each video</li>
              <li>Honest cutline instruction for contingency</li>
            </ul>
          </section>

          <section className="p-5 rounded-xl border border-line bg-surface-1 space-y-2">
            <h3 className="text-sm font-bold text-txt">Honest Limits</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Plans depend on disciplined execution of estimated hours.</li>
              <li>Complex 3D animations or multicam setups may require extra time.</li>
              <li>Prioritizes sustainability over aggressive daily publishing.</li>
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
