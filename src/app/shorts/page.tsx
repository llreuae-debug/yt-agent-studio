import type { Metadata } from "next";
import ShortsClient from "./ShortsClient";
import {
  buildPageMetadata,
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
  buildFaqSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "YouTube Shorts Cutter: 20-55s Clip Extraction | YT Agent Studio",
  description: "Extract 20–55s self-contained Shorts from long transcripts. Generate replacement opening hooks, on-screen text for the first 2s, and 9:16 crop notes.",
  path: "/shorts",
});

const FAQS = [
  {
    question: "Why should YouTube Shorts stay between 20 and 55 seconds?",
    answer: "Shorts under 20 seconds often lack sufficient depth to trigger high engagement, while Shorts approaching 60 seconds suffer steep drop-offs before completion. The 20–55s window optimizes for 80%+ average percentage viewed.",
  },
  {
    question: "Why do extracted Shorts need a replacement opening line?",
    answer: "A line taken from the middle of a 10-minute video assumes prior context. Rewriting the first sentence into a punchy standalone hook ensures mobile viewers scrolling the Shorts feed immediately understand the premise.",
  },
  {
    question: "What is the purpose of on-screen text in the first 2 seconds?",
    answer: "Many viewers scroll the Shorts feed with low or muted audio. Large, bold on-screen text in the first two seconds hooks visual attention before audio recognition occurs.",
  },
  {
    question: "What are 9:16 vertical crop framing notes?",
    answer: "When converting 16:9 horizontal master footage to 9:16 vertical video, crucial visual elements or text overlays can be cropped off. Framing notes instruct editors on where to center the crop box.",
  },
];

export default function ShortsPage() {
  const breadcrumbs = buildBreadcrumbSchema([{ name: "Shorts Cutter", path: "/shorts" }]);
  const webapp = buildWebApplicationSchema({
    path: "/shorts",
    name: "YouTube Shorts Transcript Cutter",
    description: "Extracts 20–55s self-contained moments from long transcripts with replacement hooks and 9:16 vertical crop notes.",
  });
  const faqSchema = buildFaqSchema(FAQS);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webapp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ShortsClient />

      <article className="mt-20 border-t border-line/60 pt-12 space-y-12">
        <header className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-txt tracking-tight">
            YouTube Shorts Transcript Cutter
          </h2>
          <div className="p-5 rounded-xl border border-line-focus bg-surface-1 text-sm text-txt leading-relaxed font-medium">
            A YouTube Shorts transcript cutter finds high-impact standalone segments inside long-form videos. This tool extracts 20–55s moments from subtitle transcripts, writes punchy replacement opening hooks, generates 2-second on-screen overlay text, creates seamless loop points, and specifies 9:16 vertical framing.
          </div>
        </header>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-txt">How It Works</h3>
          <ol className="grid gap-4 sm:grid-cols-3 list-decimal list-inside text-xs text-txt-2">
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">1. Paste Master Transcript:</strong> Load the full timestamped transcript of your long-form anchor video.
            </li>
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">2. Isolate 20–55s Spans:</strong> The engine identifies self-contained stories, punchy insights, or surprising counterpoints within the duration limits.
            </li>
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">3. Packaging & Framing:</strong> Provides replacement first lines, 2s bold text hooks, loop connection points, and 9:16 reframing guidelines.
            </li>
          </ol>
        </section>

        <div className="grid gap-6 sm:grid-cols-2 text-xs text-txt-2">
          <section className="p-5 rounded-xl border border-line bg-surface-1 space-y-2">
            <h3 className="text-sm font-bold text-txt">What You Get</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Candidate clip timecode spans (start & end)</li>
              <li>Calculated duration in seconds (20–55s)</li>
              <li>Replacement standalone first lines</li>
              <li>First 2-second on-screen text overlays</li>
              <li>9:16 vertical crop positioning notes</li>
            </ul>
          </section>

          <section className="p-5 rounded-xl border border-line bg-surface-1 space-y-2">
            <h3 className="text-sm font-bold text-txt">Honest Limits</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Visual reframing must be executed in your editing software.</li>
              <li>Not every long-form video contains natural short-form clips.</li>
              <li>Speech cadence affects whether a clip feels complete in 30 seconds.</li>
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
