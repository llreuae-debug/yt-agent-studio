import type { Metadata } from "next";
import EditClient from "./EditClient";
import {
  buildPageMetadata,
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
  buildFaqSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "YouTube EDL Cutter: Dead-Air & Filler Detection | YT Agent Studio",
  description: "Analyze .srt, .vtt, or Whisper transcripts to detect speech gaps above a customizable floor, filler sounds, and restarts. Export to CSV and plain text.",
  path: "/edit",
});

const FAQS = [
  {
    question: "What is an Edit Decision List (EDL) in YouTube video editing?",
    answer: "An Edit Decision List (EDL) is an ordered list of timecodes specifying where to make cuts or trims in raw footage. Creators use EDLs to remove dead air, hesitations, and false takes before fine editing.",
  },
  {
    question: "What subtitle transcript formats are supported?",
    answer: "The tool accepts SubRip (.srt), WebVTT (.vtt), and OpenAI Whisper JSON transcripts with word-level or segment-level timestamps.",
  },
  {
    question: "How does dead-air detection work?",
    answer: "The algorithm calculates the time gap between the end time of one subtitle block and the start time of the next. Gaps exceeding your chosen threshold (default 1.2s) are flagged for trimming.",
  },
  {
    question: "Can I export cuts to DaVinci Resolve or Adobe Premiere?",
    answer: "Yes. You can export the flagged cuts directly as a comma-separated value (CSV) file or plain text list to import into editing timelines.",
  },
];

export default function EditPage() {
  const breadcrumbs = buildBreadcrumbSchema([{ name: "EDL Cutter", path: "/edit" }]);
  const webapp = buildWebApplicationSchema({
    path: "/edit",
    name: "Edit Decision List (EDL) Dead-Air Cutter",
    description: "Pure deterministic analysis of .srt, .vtt, or Whisper JSON transcripts detecting dead-air pauses and filler words.",
  });
  const faqSchema = buildFaqSchema(FAQS);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webapp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <EditClient />

      <article className="mt-20 border-t border-line/60 pt-12 space-y-12">
        <header className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-txt tracking-tight">
            YouTube Edit Decision List (EDL) & Dead-Air Cutter
          </h2>
          <div className="p-5 rounded-xl border border-line-focus bg-surface-1 text-sm text-txt leading-relaxed font-medium">
            An Edit Decision List cutter analyzes timestamped subtitle transcripts to detect speech pauses, filler sounds (&quot;um&quot;, &quot;uh&quot;), and stuttered restarts. This tool calculates total savable runtime, flags specific timecodes, and exports cut lists directly to CSV or plain text.
          </div>
        </header>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-txt">How It Works</h3>
          <ol className="grid gap-4 sm:grid-cols-3 list-decimal list-inside text-xs text-txt-2">
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">1. Paste or Upload Transcript:</strong> Load an .srt, .vtt, or Whisper JSON file with timestamp markers.
            </li>
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">2. Deterministic Analysis:</strong> The tool scans timestamp gaps against your floor (e.g. 1.2s), identifies filler vocables, and detects false sentence starts.
            </li>
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">3. Export Decision List:</strong> Review flagged cuts with duration metrics and export to CSV or formatted text.
            </li>
          </ol>
        </section>

        <div className="grid gap-6 sm:grid-cols-2 text-xs text-txt-2">
          <section className="p-5 rounded-xl border border-line bg-surface-1 space-y-2">
            <h3 className="text-sm font-bold text-txt">What You Get</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Exact start and end timecodes for every pause gap</li>
              <li>Total estimated seconds saved from editing</li>
              <li>Filler word instances (&quot;um&quot;, &quot;uh&quot;, &quot;like&quot;) flagged</li>
              <li>CSV and plain text export options</li>
            </ul>
          </section>

          <section className="p-5 rounded-xl border border-line bg-surface-1 space-y-2">
            <h3 className="text-sm font-bold text-txt">Honest Limits</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Analysis quality depends on subtitle timestamp precision.</li>
              <li>Dramatic or comedic pauses may occasionally be flagged.</li>
              <li>Final visual pacing should always be previewed in your NLE.</li>
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
