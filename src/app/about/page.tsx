import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, ShieldCheck, Code, Heart, Sparkles } from "lucide-react";
import {
  buildPageMetadata,
  buildBreadcrumbSchema,
  buildOrganizationSchema,
  SITE_URL,
  BRAND_NAME,
  CONTACT_EMAIL,
  DISCLAIMER_TEXT,
  UPSTREAM_CREDIT,
  UPSTREAM_URL,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About YT Agent Studio: Local-First YouTube Creator Suite",
  description: "Learn how YT Agent Studio turns 11 creator skills and deterministic algorithms into an open-source, local-first web app with zero cloud storage.",
  path: "/about",
});

export default function AboutPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([{ name: "About", path: "/about" }]);
  const orgSchema = buildOrganizationSchema();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      {/* Header */}
      <div className="border-b border-line pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-line text-xs font-mono text-txt-2 mb-4">
          <Code className="w-3.5 h-3.5 text-yt-red" />
          <span>Open-Source Creator Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-txt tracking-tight">
          About YT Agent Studio
        </h1>
        <p className="mt-4 text-base text-txt-2 leading-relaxed max-w-2xl">
          YT Agent Studio is an independent, local-first web suite engineered for YouTube creators, editors, and channel strategists. It provides deterministic linting, scoring, and writing workflows without external databases or account locks.
        </p>
      </div>

      {/* AI & Machine Readable Fact Sheet Block (GEO optimized) */}
      <section className="my-10 p-6 rounded-2xl border border-line bg-surface-1">
        <div className="flex items-center gap-2 text-sm font-bold text-txt mb-4">
          <Sparkles className="w-4 h-4 text-yt-red" />
          <h2>Product Fact Sheet (Machine & Human Readable)</h2>
        </div>
        <dl className="grid gap-3 sm:grid-cols-2 text-xs">
          <div className="p-3 rounded-lg bg-surface-2 border border-line/60">
            <dt className="text-txt-2 font-mono text-[10px] uppercase">Product Name</dt>
            <dd className="font-bold text-txt mt-0.5">{BRAND_NAME}</dd>
          </div>
          <div className="p-3 rounded-lg bg-surface-2 border border-line/60">
            <dt className="text-txt-2 font-mono text-[10px] uppercase">Primary Function</dt>
            <dd className="font-bold text-txt mt-0.5">11 deterministic tools & AI writing skills for YouTube creators</dd>
          </div>
          <div className="p-3 rounded-lg bg-surface-2 border border-line/60">
            <dt className="text-txt-2 font-mono text-[10px] uppercase">Operating Platform</dt>
            <dd className="font-bold text-txt mt-0.5">Web Browser (HTML5, Modern ECMAScript, LocalStorage)</dd>
          </div>
          <div className="p-3 rounded-lg bg-surface-2 border border-line/60">
            <dt className="text-txt-2 font-mono text-[10px] uppercase">Price & Model</dt>
            <dd className="font-bold text-txt mt-0.5">Free & Open-Source (Zero subscriptions, zero paywalls)</dd>
          </div>
          <div className="p-3 rounded-lg bg-surface-2 border border-line/60">
            <dt className="text-txt-2 font-mono text-[10px] uppercase">Software License</dt>
            <dd className="font-bold text-txt mt-0.5">MIT License (Open-Source)</dd>
          </div>
          <div className="p-3 rounded-lg bg-surface-2 border border-line/60">
            <dt className="text-txt-2 font-mono text-[10px] uppercase">Data Storage Architecture</dt>
            <dd className="font-bold text-txt mt-0.5">Local-first browser storage (0 transcripts uploaded to cloud)</dd>
          </div>
          <div className="p-3 rounded-lg bg-surface-2 border border-line/60">
            <dt className="text-txt-2 font-mono text-[10px] uppercase">Last Updated</dt>
            <dd className="font-bold text-txt mt-0.5"><time dateTime="2026-10-13">October 13, 2026</time></dd>
          </div>
          <div className="p-3 rounded-lg bg-surface-2 border border-line/60">
            <dt className="text-txt-2 font-mono text-[10px] uppercase">Support Contact</dt>
            <dd className="font-bold text-txt mt-0.5"><a href={`mailto:${CONTACT_EMAIL}`} className="text-link hover:underline">{CONTACT_EMAIL}</a></dd>
          </div>
        </dl>
      </section>

      {/* Origin & Upstream Attribution */}
      <section className="space-y-4 my-10">
        <h2 className="text-2xl font-bold text-txt">Origin & Open-Source Lineage</h2>
        <p className="text-sm text-txt-2 leading-relaxed">
          YT Agent Studio was created by porting the 11 modular skills and 6 Python command-line tools from the open-source project{" "}
          <a
            href={UPSTREAM_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="text-link hover:underline inline-flex items-center gap-1 font-semibold"
          >
            {UPSTREAM_CREDIT}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          . We converted all Python scoring and linting routines into pure, deterministic TypeScript libraries that run client-side in the browser, eliminating external Python dependencies and making the suite immediately accessible through an intuitive interface.
        </p>
      </section>

      {/* Core Engineering Guardrails */}
      <section className="space-y-4 my-10">
        <h2 className="text-2xl font-bold text-txt">Core Engineering Principles</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-4 rounded-xl border border-line bg-surface-1">
            <h3 className="font-bold text-sm text-txt mb-1">1. Deterministic First, AI Second</h3>
            <p className="text-xs text-txt-2 leading-relaxed">
              Scores, cutoffs, word counts, and chapter timestamps are strictly calculated using mathematics and regular expressions. The AI never fabricates or eyeballs retention metrics.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-line bg-surface-1">
            <h3 className="font-bold text-sm text-txt mb-1">2. Zero Invented Numbers</h3>
            <p className="text-xs text-txt-2 leading-relaxed">
              Our automated number audit inspects all generated copy. Any figure or claim not present in your input data is flagged with an advisory warning chip.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-line bg-surface-1">
            <h3 className="font-bold text-sm text-txt mb-1">3. Zero Account Locks</h3>
            <p className="text-xs text-txt-2 leading-relaxed">
              We never require OAuth sign-in or YouTube channel access. You paste transcripts, lint your ideas, review the decisions, and ship them yourself.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-line bg-surface-1">
            <h3 className="font-bold text-sm text-txt mb-1">4. Honest Limits</h3>
            <p className="text-xs text-txt-2 leading-relaxed">
              We never claim to predict the YouTube algorithm. The Hook Score is an editorial heuristic based on specificity, address, stakes, curiosity, and brevity.
            </p>
          </div>
        </div>
      </section>

      {/* Mandatory Legal & Trademark Notice */}
      <section className="my-10 p-5 rounded-xl border border-line bg-surface-2 text-xs text-txt-2 space-y-2">
        <div className="flex items-center gap-2 font-bold text-txt text-sm">
          <ShieldCheck className="w-4 h-4 text-yt-red" />
          <h3>Legal Notice & Non-Affiliation Disclaimer</h3>
        </div>
        <p className="leading-relaxed">
          {DISCLAIMER_TEXT}
        </p>
        <p className="text-[11px] text-txt-3">
          &quot;YouTube&quot; is a registered trademark of Google LLC. References to YouTube are used solely in a descriptive capacity to describe compatibility with YouTube video specifications, character limits, and analytics formats.
        </p>
      </section>
    </div>
  );
}
