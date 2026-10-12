import type { Metadata } from "next";
import Link from "next/link";
import { LineChart, ArrowRight, HelpCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import {
  buildPageMetadata,
  buildBreadcrumbSchema,
  buildTechArticleSchema,
  buildFaqSchema,
  SITE_URL,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "How to Read YouTube Audience Retention: Hooks & Cliffs | YT Agent Studio",
  description: "Learn how to read YouTube Studio retention graphs. Diagnose hook leak in the first 30 seconds, locate drop-off cliffs, and fix mid-video pacing slides.",
  path: "/guides/audience-retention",
});

const FAQS = [
  {
    question: "What is a good audience retention percentage on YouTube?",
    answer: "For long-form YouTube videos (8 to 15 minutes), an average view duration (AVD) of 45% to 55% is generally considered strong by creators. For shorter videos under 5 minutes, retention above 60% is typically required for wider browse distribution.",
  },
  {
    question: "What causes a cliff drop in a retention graph?",
    answer: "A cliff is a steep, sudden drop in retention within 5 to 10 seconds. Cliffs are typically caused by unannounced topic transitions, prolonged sponsored segments, boring digressions, or verbal clues that the video is wrapping up early.",
  },
  {
    question: "How do I diagnose Hook Leak in YouTube Studio?",
    answer: "Hook Leak measures the percentage of viewers who abandon the video between 0:00 and 0:30. If your retention drops below 70% in the first 30 seconds (more than 30% leak), your opening hook failed to immediately confirm the premise promised in the title and thumbnail.",
  },
];

export default function RetentionGuidePage() {
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Guides", path: "/guides/audience-retention" },
    { name: "Audience Retention", path: "/guides/audience-retention" },
  ]);
  const articleSchema = buildTechArticleSchema({
    title: "How to Read Your YouTube Audience Retention Graph",
    description: "Diagnose hook leak in the first 30 seconds, locate drop-off cliffs, and fix mid-video pacing slides.",
    path: "/guides/audience-retention",
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
          <LineChart className="w-3.5 h-3.5 text-yt-red" />
          <span>Creator Analytics Explainer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-txt tracking-tight">
          How to Read Your YouTube Audience Retention Graph
        </h1>
        <p className="mt-2 text-xs text-txt-3">
          Published: <time dateTime="2026-10-13">October 13, 2026</time> • 6 min read
        </p>

        {/* Direct Answer Block (40-60 words AEO target) */}
        <div className="mt-6 p-5 rounded-xl border border-line-focus bg-surface-1 text-sm text-txt leading-relaxed font-medium">
          A YouTube audience retention graph visualizes the percentage of viewers watching your video at every second. To diagnose performance, analyze three key regions: the first 30 seconds for <strong>Hook Leak</strong>, sudden downward spikes for <strong>Cliffs</strong>, and the overall slope of the middle section for <strong>Pacing Slide</strong>.
        </div>
      </div>

      <div className="my-10 space-y-10 text-sm text-txt-2 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-txt">1. Diagnosing Hook Leak (0:00 to 0:30)</h2>
          <p>
            The first 30 seconds of your video is the most volatile window on YouTube. Viewers decide whether to stay based on whether the video immediately confirms the promise established by the title and thumbnail.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 my-4">
            <div className="p-4 rounded-xl border border-line bg-surface-1">
              <h3 className="font-bold text-sm text-ok mb-1">Healthy Hook (Under 25% Loss)</h3>
              <p className="text-xs text-txt-2">
                At least 75% of viewers remain at the 30-second mark. The opening spoken line directly addresses the viewer, establishes the stakes, and dives into the payoff without an intro sequence.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-line bg-surface-1">
              <h3 className="font-bold text-sm text-yt-red mb-1">Hook Leak (Over 30% Loss)</h3>
              <p className="text-xs text-txt-2">
                More than 30% of viewers leave before 0:30. Typically caused by animated logos, generic greetings (&quot;Hey guys, welcome back&quot;), or channel housekeeping before delivering value.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-txt">2. Identifying Retention Cliffs</h2>
          <p>
            A &quot;cliff&quot; is an abrupt drop of 3% or more within a short 5-to-10 second timeframe. When viewing your retention curve in YouTube Studio, look at the exact spoken words and visual cues right where the cliff begins:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Unannounced Topic Shifts:</strong> Jumping to an unrelated concept without setting up why it matters to the core premise.</li>
            <li><strong>Monotonous B-Roll:</strong> Showing a static screen or unchanging talking head for more than 15 consecutive seconds.</li>
            <li><strong>Premature Outros:</strong> Saying phrases like &quot;In conclusion&quot; or &quot;To wrap things up&quot; 60 seconds before the video ends causes an immediate viewer exodus.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-txt">3. Measuring Middle Slide Rate</h2>
          <p>
            The middle slide represents the gradual decline in viewership between 0:30 and the final 30 seconds. A steep downward slope indicates cumulative pacing friction. Trimming dead-air pauses and verbal fillers (&quot;um&quot;, &quot;uh&quot;) using transcript cuts can reduce this attrition by keeping rhythm tight.
          </p>
        </section>

        {/* Module Link Callout */}
        <div className="p-6 rounded-2xl border border-line bg-surface-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-txt text-base">Analyze Your YouTube Retention Data</h3>
            <p className="text-xs text-txt-2 mt-1">Paste your YouTube Studio percentage array into our diagnostic tool to identify cliffs and receive a single primary fix.</p>
          </div>
          <Link
            href="/retention"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-yt-red hover:bg-yt-red-hover text-white text-xs font-bold transition-all shadow-glow shrink-0"
          >
            <span>Launch Retention Reader</span>
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
