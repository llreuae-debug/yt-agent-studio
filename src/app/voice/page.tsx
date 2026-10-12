import type { Metadata } from "next";
import VoiceClient from "./VoiceClient";
import {
  buildPageMetadata,
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
  buildFaqSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Creator Voice Profile: Tone & Spoken Cadence | YT Agent Studio",
  description: "Define your creator voice profile: audience target, spoken cadence, forbidden words, and video format. Injected into every AI writing step in the studio.",
  path: "/voice",
});

const FAQS = [
  {
    question: "What is a Voice Profile in YT Agent Studio?",
    answer: "A Voice Profile (voice.md) is a structured specification of your channel's target audience, spoken cadence, forbidden words, and video format. It is injected into every AI generation call to ensure outputs sound like you.",
  },
  {
    question: "Why should creators define 'forbidden words'?",
    answer: "LLMs naturally gravitate toward generic marketing buzzwords like 'game-changer', 'dive in', and 'unlock'. Banning these words forces the AI to draft in authentic, conversational creator language.",
  },
  {
    question: "Where is the Voice Profile stored?",
    answer: "Your voice profile is saved directly in your browser's local storage (localStorage). It is never sent to external servers except when included in your active AI generation prompts.",
  },
];

export default function VoicePage() {
  const breadcrumbs = buildBreadcrumbSchema([{ name: "Voice Profile", path: "/voice" }]);
  const webapp = buildWebApplicationSchema({
    path: "/voice",
    name: "Creator Voice Profile Studio",
    description: "Defines target audience, spoken cadence, forbidden words, and format injected into every AI run.",
  });
  const faqSchema = buildFaqSchema(FAQS);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webapp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <VoiceClient />

      <article className="mt-20 border-t border-line/60 pt-12 space-y-12">
        <header className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-txt tracking-tight">
            Creator Voice Profile & Cadence Studio
          </h2>
          <div className="p-5 rounded-xl border border-line-focus bg-surface-1 text-sm text-txt leading-relaxed font-medium">
            A creator voice profile customizes AI text generation to match your authentic personality. This studio defines your target audience, spoken cadence, forbidden words, and video formatting, injecting your unique voice into every hook, script, and comment reply across all 11 modules.
          </div>
        </header>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-txt">How It Works</h3>
          <ol className="grid gap-4 sm:grid-cols-3 list-decimal list-inside text-xs text-txt-2">
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">1. Define Tone & Rules:</strong> Specify who you speak to, your natural rhythm, and words you would never utter on camera.
            </li>
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">2. Or Auto-Infer from Transcripts:</strong> Paste transcripts from your three best videos to automatically extract your natural speech patterns.
            </li>
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt">3. Global Studio Injection:</strong> The voice profile is saved locally and automatically prepended to every AI generation prompt.
            </li>
          </ol>
        </section>

        <div className="grid gap-6 sm:grid-cols-2 text-xs text-txt-2">
          <section className="p-5 rounded-xl border border-line bg-surface-1 space-y-2">
            <h3 className="text-sm font-bold text-txt">What You Get</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Structured voice.md specification</li>
              <li>Markdown export and import for team sharing</li>
              <li>Forbidden word filter (banning generic buzzwords)</li>
              <li>Persistent local storage integration</li>
            </ul>
          </section>

          <section className="p-5 rounded-xl border border-line bg-surface-1 space-y-2">
            <h3 className="text-sm font-bold text-txt">Honest Limits</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>AI models approximate tone based on instructions.</li>
              <li>Manual review is still required for nuanced creator humor.</li>
              <li>Stored in browser localStorage; use JSON export to backup.</li>
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
