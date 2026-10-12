import type { Metadata } from "next";
import Link from "next/link";
import { History, Tag, CheckCircle2 } from "lucide-react";
import {
  buildPageMetadata,
  buildBreadcrumbSchema,
  BRAND_NAME,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Changelog & Release Notes | YT Agent Studio",
  description: "Track version history, feature releases, algorithm updates, and performance enhancements across YT Agent Studio.",
  path: "/changelog",
});

const RELEASES = [
  {
    version: "v1.1.0",
    date: "2026-10-13",
    title: "SEO, AEO & GEO Metadata Architecture & Guides",
    changes: [
      "Engineered full technical SEO, OpenGraph images, and PWA manifest.",
      "Added /llms.txt and /llms-full.txt machine-readable discovery indices.",
      "Added comprehensive creator guides for retention, titles, chapters, and hook formulas.",
      "Introduced automated schema.org validation tests (npm run check:schema) with strict zero-fake-rating checks.",
      "Added semantic footer with MIT licensing attribution and non-affiliation disclaimers.",
    ],
  },
  {
    version: "v1.0.0",
    date: "2026-10-12",
    title: "Initial Production Release: 11 Creator Skills Suite",
    changes: [
      "Ported 11 skills and 6 Python tools from Jakeschincariol/youtube-agent-skill into pure TypeScript.",
      "Built deterministic Hook Score calculator with Banker's rounding and 21 formula regexes.",
      "Implemented Title Linter with desktop (60 char) and mobile (40 char) cutoffs and thumbnail word overlap detection.",
      "Integrated Edit Decision List (EDL) dead-air pause and conversational filler cutter.",
      "Created 4-pile comment triage with pin recommendation and strict character budget.",
      "Built weekly production capacity planner with honest drop line.",
      "Added retention curve visualizer with Hook Leak (first 30s) and Cliff drop diagnosis.",
      "Added Shorts transcript cutter with 9:16 vertical crop framing notes.",
      "Implemented YouTube compliant chapter validator (0:00 start, 3+ chapters, >=10s duration).",
      "Created Channel Audit studio with upload spread variance and 168x94px mobile feed preview simulator.",
      "Added Voice Profile studio with localStorage persistence and markdown export/import.",
    ],
  },
];

export default function ChangelogPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([{ name: "Changelog", path: "/changelog" }]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Header */}
      <div className="border-b border-line pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-line text-xs font-mono text-txt-2 mb-4">
          <History className="w-3.5 h-3.5 text-yt-red" />
          <span>Release History & Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-txt tracking-tight">
          Product Changelog
        </h1>
        <p className="mt-4 text-base text-txt-2 leading-relaxed max-w-2xl">
          A chronological log of all new creator tools, deterministic scoring upgrades, and documentation improvements.
        </p>
      </div>

      {/* Timeline */}
      <div className="my-10 space-y-12">
        {RELEASES.map((rel, idx) => (
          <article key={idx} className="relative pl-8 border-l border-line">
            <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-surface-1 border-2 border-yt-red" />
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-yt-red/10 border border-yt-red/20 text-yt-red font-mono font-bold text-xs">
                {rel.version}
              </span>
              <time dateTime={rel.date} className="text-xs text-txt-2 font-mono">
                {rel.date}
              </time>
            </div>
            <h2 className="text-xl font-bold text-txt mb-4">{rel.title}</h2>
            <ul className="space-y-2 text-sm text-txt-2">
              {rel.changes.map((change, cIdx) => (
                <li key={cIdx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-ok shrink-0 mt-0.5" />
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
