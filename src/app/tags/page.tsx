import type { Metadata } from "next";
import TagsClient from "./TagsClient";
import {
  buildPageMetadata,
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
  buildFaqSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "YouTube Tags Finder: Extract Video Tags & Keyword Research | YT Agent Studio",
  description: "Extract hidden tags from any YouTube video URL or ID, discover top keyword tag frequencies, and manage custom 500-character tag lists with YouTube Data API v3.",
  path: "/tags",
});

const FAQS = [
  {
    question: "How do I find the hidden tags of any YouTube video?",
    answer: "Paste any YouTube link (watch URL, shorts, youtu.be, or video ID) into the 'Find Tags from Video' tab. YT Agent Studio extracts the public tags via the YouTube Data API v3 snippet and displays them as copyable chips.",
  },
  {
    question: "What is YouTube's official character limit for video tags?",
    answer: "YouTube enforces a strict 500-character limit across all video tags combined (including commas). If your tags exceed 500 characters, YouTube Studio displays an error and will not save your video metadata. Our live counter protects you from exceeding this limit.",
  },
  {
    question: "Do tags help my video rank in YouTube search?",
    answer: "Tags help YouTube understand commonly misspelled search terms and niche context. When combined with strong titles and descriptions, relevant tags ensure your video appears in correct category recommendations.",
  },
  {
    question: "Is my YouTube API key secure?",
    answer: "Yes. All YouTube Data API calls are routed through a protected server-side backend route (/api/tags). API keys are never exposed to browser network tabs or client-side bundles.",
  },
];

export default function TagsPage() {
  const breadcrumbs = buildBreadcrumbSchema([{ name: "Tags Finder", path: "/tags" }]);
  const webapp = buildWebApplicationSchema({
    path: "/tags",
    name: "YouTube Tags Finder & Research Studio",
    description: "Extract hidden tags from video URLs, discover high-frequency tags for any keyword, and build compliant tag lists.",
  });
  const faqSchema = buildFaqSchema(FAQS);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webapp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <TagsClient />

      {/* SEO & Knowledge Guide Section */}
      <article className="mt-20 border-t border-line/60 pt-12 space-y-12">
        <header className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-txt tracking-tight">
            How YouTube Tags Finder Works
          </h2>
          <div className="p-5 rounded-xl border border-line-focus bg-surface-1 text-sm text-txt leading-relaxed font-medium">
            YouTube video tags provide critical disambiguation signals for the recommendation engine and search crawler. This studio allows creators to inspect existing high-ranking videos, discover the most common tags across top search results, and curate custom tag lists that strictly comply with YouTube&apos;s 500-character ceiling.
          </div>
        </header>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-txt">Feature Capabilities</h3>
          <ol className="grid gap-4 sm:grid-cols-3 list-decimal list-inside text-xs text-txt-2">
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt block mb-1">1. Video Tag Extraction</strong>
              Parse watch, shorts, and youtu.be links instantly to reveal all public tags, view counts, and published dates.
            </li>
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt block mb-1">2. Keyword Frequency Ranking</strong>
              Analyze top videos for any keyword across English, Urdu, Hindi, or Arabic, ranking tags by usage frequency.
            </li>
            <li className="p-4 rounded-xl border border-line bg-surface-1">
              <strong className="text-txt block mb-1">3. 500-Char Limit Tag Builder</strong>
              Manage multiple lists in localStorage, auto-deduplicate tags, reorder via drag-and-drop, and export to CSV or TXT.
            </li>
          </ol>
        </section>
      </article>
    </>
  );
}
