import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowRight, HelpCircle, CheckCircle2, Sparkles } from "lucide-react";
import {
  buildPageMetadata,
  buildBreadcrumbSchema,
  buildTechArticleSchema,
  buildFaqSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "21 YouTube Hook Formulas: High-Retention Opening Script Guide | YT Agent Studio",
  description: "Discover the 21 proven YouTube hook formulas from hooks.json. Learn how to craft high-retention openings scored across Specificity, Address, Stakes, Curiosity & Brevity.",
  path: "/guides/youtube-hook-formulas",
});

const FAQS = [
  {
    question: "What is the optimal word count for a YouTube hook?",
    answer: "The optimal length for an opening YouTube hook is 12 to 28 words spoken over approximately 8 to 15 seconds. Hooks with fewer than 8 words lack sufficient context, while hooks exceeding 36 words suffer from conversational drag and trigger viewer drop-off.",
  },
  {
    question: "What are the 5 scoring properties of a good hook?",
    answer: "YT Agent Studio evaluates hooks against 5 dimensions: Specificity (concrete nouns and measurements), Address (direct second-person 'you/your'), Stakes (tangible downside or upside), Curiosity (an unresolved open loop), and Brevity (optimal 12-28 word economy).",
  },
  {
    question: "What is an example of the Contrarian Flip hook formula?",
    answer: "A Contrarian Flip contradicts conventional creator wisdom immediately. For example: 'Everyone says you need to post daily on YouTube. I posted once a week for a year and tripled my revenue.'",
  },
];

const FORMULAS = [
  { name: "The Statistic", formula: "X% of people fail at Y. Here is how the remaining Z% succeed.", example: "97% of creators quit before video 30. Here is what the other 3% do differently." },
  { name: "Contrarian Flip", formula: "Everyone tells you to do X. I did the exact opposite for Y timeframe.", example: "Everyone says post daily. I posted once a month and gained 100k subscribers." },
  { name: "The Mistake", formula: "If you have under X metric, you are probably making this one mistake.", example: "If you have under 1,000 subscribers, you are making this mistake before you even hit record." },
  { name: "Someone Else's Result", formula: "This person went from A to B in timeframe C using one system.", example: "This channel went from 400 subscribers to 200,000 in seven months on one format." },
  { name: "I Tried It", formula: "I tested X for Y days so you don't have to.", example: "I tested 50 hooks on YouTube for 30 days to see which ones stop the scroll." },
  { name: "The Cost of Inaction", formula: "Every day you don't do X, you are losing Y.", example: "Every video you upload without chapters is losing you 20% of your search traffic." },
];

export default function HookFormulasGuidePage() {
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Guides", path: "/guides/audience-retention" },
    { name: "Hook Formulas", path: "/guides/youtube-hook-formulas" },
  ]);
  const articleSchema = buildTechArticleSchema({
    title: "21 YouTube Hook Formulas: High-Retention Opening Script Guide",
    description: "Learn how to craft high-retention openings scored across Specificity, Address, Stakes, Curiosity & Brevity.",
    path: "/guides/youtube-hook-formulas",
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
          <FileText className="w-3.5 h-3.5 text-yt-red" />
          <span>Scriptwriting & Retention Explainer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-txt tracking-tight">
          The 21 YouTube Hook Formulas
        </h1>
        <p className="mt-2 text-xs text-txt-3">
          Published: <time dateTime="2026-10-13">October 13, 2026</time> • 7 min read
        </p>

        {/* Direct Answer Block (40-60 words AEO target) */}
        <div className="mt-6 p-5 rounded-xl border border-line-focus bg-surface-1 text-sm text-txt leading-relaxed font-medium">
          A YouTube hook is the opening 8 to 15 seconds (12 to 28 words) of your video. Its sole purpose is to confirm the premise promised in the title and thumbnail, establish personal stakes for the viewer, and open an irresistible narrative loop before introducing yourself.
        </div>
      </div>

      <div className="my-10 space-y-10 text-sm text-txt-2 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-txt">1. The 5 Dimensions of the Hook Score</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 rounded-xl border border-line bg-surface-1">
              <h3 className="font-bold text-xs uppercase tracking-wider text-txt mb-1">Specificity (25%)</h3>
              <p className="text-xs text-txt-2">Concrete numbers, named tools, and exact timeframes. Avoid abstract generalizations.</p>
            </div>
            <div className="p-4 rounded-xl border border-line bg-surface-1">
              <h3 className="font-bold text-xs uppercase tracking-wider text-txt mb-1">Address (25%)</h3>
              <p className="text-xs text-txt-2">Direct second-person (&quot;you&quot;, &quot;your&quot;). Never start with &quot;Hey guys&quot; or plural greetings.</p>
            </div>
            <div className="p-4 rounded-xl border border-line bg-surface-1">
              <h3 className="font-bold text-xs uppercase tracking-wider text-txt mb-1">Stakes (20%)</h3>
              <p className="text-xs text-txt-2">Explicit cost of inaction or life-changing upside. What happens if they don&apos;t watch?</p>
            </div>
            <div className="p-4 rounded-xl border border-line bg-surface-1">
              <h3 className="font-bold text-xs uppercase tracking-wider text-txt mb-1">Curiosity (15%)</h3>
              <p className="text-xs text-txt-2">An open question or contrarian paradox that demands the next 5 minutes to resolve.</p>
            </div>
            <div className="p-4 rounded-xl border border-line bg-surface-1">
              <h3 className="font-bold text-xs uppercase tracking-wider text-txt mb-1">Brevity (15%)</h3>
              <p className="text-xs text-txt-2">Ideal range is 12 to 28 words. Heavy penalties below 8 words or above 36 words.</p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-txt">2. High-Impact Hook Formula Examples</h2>
          <div className="space-y-4">
            {FORMULAS.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-line bg-surface-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-yt-red/10 text-yt-red font-mono font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h3 className="font-bold text-sm text-txt">{item.name}</h3>
                </div>
                <p className="text-xs font-mono text-txt-3">Pattern: {item.formula}</p>
                <div className="p-3 rounded-lg bg-surface-2 text-xs text-txt font-medium italic">
                  &ldquo;{item.example}&rdquo;
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Module Link Callout */}
        <div className="p-6 rounded-2xl border border-line bg-surface-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-txt text-base">Write & Score 5 Hooks for Your Next Idea</h3>
            <p className="text-xs text-txt-2 mt-1">Input your video premise to generate candidate hooks tagged with the 21 formulas, calculate deterministic scores, and write full scripts.</p>
          </div>
          <Link
            href="/script"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-yt-red hover:bg-yt-red-hover text-white text-xs font-bold transition-all shadow-glow shrink-0"
          >
            <span>Open Script Engine</span>
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
