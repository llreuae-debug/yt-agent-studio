import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, ChevronDown, Sparkles } from "lucide-react";
import {
  buildPageMetadata,
  buildBreadcrumbSchema,
  buildFaqSchema,
  BRAND_NAME,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Frequently Asked Questions: Free YouTube Creator Suite | YT Agent Studio",
  description: "Find clear answers on how YT Agent Studio works, local-first privacy, pricing, supported AI models, algorithm limits, and open-source licensing.",
  path: "/faq",
});

const FAQS = [
  {
    question: "What is YT Agent Studio?",
    answer: "YT Agent Studio is a free, local-first web application featuring 11 deterministic tools and AI-assisted skills designed for YouTube creators. It helps write scored hooks, lint titles, generate 3-word thumbnail briefs, trim dead air from transcripts, format compliant chapters, and analyze audience retention graphs.",
  },
  {
    question: "Is YT Agent Studio free to use?",
    answer: "Yes, YT Agent Studio is 100% free and open-source under the MIT License. There are no subscriptions, paywalls, or hidden tier limits.",
  },
  {
    question: "Does YT Agent Studio upload or publish anything to my YouTube channel?",
    answer: "No. YT Agent Studio never connects to YouTube via OAuth, never requests channel credentials, and never publishes videos or descriptions automatically. You review, lint, and copy the outputs to ship manually.",
  },
  {
    question: "Where is my video data and transcript stored?",
    answer: "All data stays completely in your local browser storage (localStorage). We do not operate external databases, cloud storage buckets, or tracking servers. You can export and backup your data as JSON at any time.",
  },
  {
    question: "Can I use YT Agent Studio without an AI API key?",
    answer: "Yes. All deterministic tools (Hook Score calculation, Title Linting, Dead-Air Trimming, Chapter Validation, and Retention Curve Analysis) run natively in your browser with zero latency. For AI writing steps, the app includes realistic built-in mock responses so you can test and explore immediately without an API key.",
  },
  {
    question: "Which AI providers and models are supported?",
    answer: "The app supports Google Gemini (default: gemini-2.5-pro or gemini-1.5-flash) and Anthropic Claude (claude-3-7-sonnet). You can configure your preferred provider in your local environment variables.",
  },
  {
    question: "What does the Hook Score measure?",
    answer: "The Hook Score evaluates your opening 15-second script against 5 empirical properties: Specificity, Address, Stakes, Curiosity, and Brevity. It uses Banker's rounding to deliver a score from 0 to 10 and assigns an actionable score band.",
  },
  {
    question: "Does a high Hook Score guarantee views from the YouTube algorithm?",
    answer: "No. Hook Score is an editorial diagnostic heuristic to help you eliminate weak phrases, generic greetings, and vague promises. No tool can predict the YouTube recommendation algorithm or guarantee impressions.",
  },
  {
    question: "What is the 3-word thumbnail rule?",
    answer: "The 3-word rule requires that thumbnail text contain no more than three high-contrast, easily scannable words. It also checks that thumbnail text does not duplicate words already present in your title, preserving valuable click packaging space.",
  },
  {
    question: "What are the rules for YouTube video chapters?",
    answer: "YouTube enforces three non-negotiable rules for chapters to appear in the player: the first chapter must begin at timestamp 0:00, there must be at least 3 chapters in ascending order, and each chapter must be at least 10 seconds long.",
  },
  {
    question: "What is Hook Leak on a retention graph?",
    answer: "Hook Leak is the percentage of viewers who drop off during the first 30 seconds of your video. A drop greater than 25% indicates that the opening hook is failing to confirm the video's title and thumbnail promise.",
  },
  {
    question: "Can I use YT Agent Studio for commercial YouTube channels?",
    answer: "Yes. Because the software is released under the permissive MIT License, you are free to use it for personal, commercial, and agency client channels.",
  },
  {
    question: "Is YT Agent Studio affiliated with YouTube or Google?",
    answer: "No. YT Agent Studio is an independent open-source project. It is not affiliated with, endorsed by, or sponsored by YouTube or Google LLC.",
  },
];

export default function FaqPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([{ name: "FAQ", path: "/faq" }]);
  const faqSchema = buildFaqSchema(FAQS);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Header */}
      <div className="border-b border-line pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-line text-xs font-mono text-txt-2 mb-4">
          <HelpCircle className="w-3.5 h-3.5 text-yt-red" />
          <span>Creator Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-txt tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-base text-txt-2 leading-relaxed max-w-2xl">
          Everything you need to know about YT Agent Studio: privacy guarantees, deterministic scoring, supported AI models, and YouTube formatting standards.
        </p>
      </div>

      {/* FAQ Grid */}
      <div className="my-10 space-y-4">
        {FAQS.map((faq, idx) => (
          <article
            key={idx}
            className="p-6 rounded-2xl border border-line bg-surface-1 hover:border-line-focus transition-colors"
          >
            <h2 className="text-base sm:text-lg font-bold text-txt">
              {faq.question}
            </h2>
            <p className="mt-3 text-sm text-txt-2 leading-relaxed">
              {faq.answer}
            </p>
          </article>
        ))}
      </div>

      {/* Still have questions */}
      <div className="mt-12 p-6 rounded-2xl border border-line bg-surface-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-txt text-base">Want to learn more about retention and titles?</h3>
          <p className="text-xs text-txt-2 mt-1">Read our deep-dive educational guides on YouTube packaging and video structure.</p>
        </div>
        <Link
          href="/guides/audience-retention"
          className="px-5 py-2 rounded-full bg-yt-red hover:bg-yt-red-hover text-white text-xs font-bold transition-colors shrink-0"
        >
          Explore Creator Guides
        </Link>
      </div>
    </div>
  );
}
