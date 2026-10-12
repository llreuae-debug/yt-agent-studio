import type { Metadata } from "next";
import SeoClient from "./SeoClient";
import {
  buildPageMetadata,
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
  buildFaqSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "YouTube SEO & Description Studio: Snippets | YT Agent Studio",
  description: "Format the critical 2-line search snippet, structure links and chapters, run the deterministic Query Test, and generate up to 15 disambiguation tags.",
  path: "/seo",
});

const FAQS = [
  {
    question: "Why are the first two lines of a YouTube description so important?",
    answer: "The first two lines (approximately 150 characters) appear in YouTube and Google search result snippets and above the '...more' fold on mobile. They must contain your primary keywords and value proposition.",
  },
  {
    question: "What is the deterministic Query Test?",
    answer: "The Query Test checks whether words from proposed search queries actually appear in both your video title and the opening description snippet, confirming search relevance.",
  },
  {
    question: "Why does the tool limit tags to 15?",
    answer: "Over-tagging dilutes semantic relevance and triggers spam filters. YouTube officially states that tags play a minor role and over-stuffing can penalize video discovery.",
  },
];

export default function SeoPage() {
  const breadcrumbs = buildBreadcrumbSchema([{ name: "SEO Studio", path: "/seo" }]);
  const webapp = buildWebApplicationSchema({
    path: "/seo",
    name: "YouTube Description & SEO Studio",
    description: "Formats the search snippet, links, chapters, and max 15 tags with the deterministic Query Test.",
  });
  const faqSchema = buildFaqSchema(FAQS);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webapp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <SeoClient />

      <article className="mt-20 border-t border-line/60 pt-12 space-y-12">
        <header className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-txt tracking-tight">
            YouTube Description & SEO Studio
          </h2>
          <div className="p-5 rounded-xl border border-line-focus bg-surface-1 text-sm text-txt leading-relaxed font-medium">
            A YouTube video description studio structures metadata for search engines and viewers. This tool formats the search snippet (top two lines visible above &quot;...more&quot;), structures external links and timestamps, generates a maximum of 15 disambiguation tags, and runs the deterministic Query Test.
          </div>
        </header>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-txt">How It Works</h3>
          <ol className="grid gap-4 sm:grid-cols-3 list-decimal list-inside text-xs text-txt-2">
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">1. Input Title & Topic:</strong> Provide your approved title, topic premise, and summary of links or resources mentioned.
            </li>
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">2. Snippet Formatting:</strong> Crafts the high-priority top two lines, formats links with labels, and places timestamp chapter placeholders.
            </li>
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">3. The Query Test:</strong> Verifies that search keywords proposed for discovery are explicitly present in the title and opening lines.
            </li>
          </ol>
        </section>

        <div className="grid gap-6 sm:grid-cols-2 text-xs text-txt-2">
          <section className="p-5 rounded-xl border border-line bg-surface-1 space-y-2">
            <h3 className="text-sm font-bold text-txt">What You Get</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>First 2 lines formatted for the mobile snippet fold</li>
              <li>Clean description body with link formatting</li>
              <li>Strictly capped disambiguation tags (max 15)</li>
              <li>Deterministic Query Test validation badges</li>
            </ul>
          </section>

          <section className="p-5 rounded-xl border border-line bg-surface-1 space-y-2">
            <h3 className="text-sm font-bold text-txt">Honest Limits</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Description SEO primarily impacts Search and Suggested browse indexing.</li>
              <li>Tags have minimal algorithm weight compared to title and watch time.</li>
              <li>Always check external links before pasting into YouTube Studio.</li>
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
