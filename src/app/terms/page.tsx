import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ShieldAlert } from "lucide-react";
import {
  buildPageMetadata,
  buildBreadcrumbSchema,
  BRAND_NAME,
  LICENSE_NAME,
  DISCLAIMER_TEXT,
  CONTACT_EMAIL,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Use: MIT Open-Source License | YT Agent Studio",
  description: "Read the terms of use for YT Agent Studio. Licensed under the open-source MIT License with clear limits on algorithm warranties.",
  path: "/terms",
});

export default function TermsPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([{ name: "Terms of Use", path: "/terms" }]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Header */}
      <div className="border-b border-line pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-line text-xs font-mono text-txt-2 mb-4">
          <FileText className="w-3.5 h-3.5 text-yt-red" />
          <span>Legal & Licensing Terms</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-txt tracking-tight">
          Terms of Use
        </h1>
        <p className="mt-4 text-base text-txt-2 leading-relaxed max-w-2xl">
          By using YT Agent Studio, you agree to these open-source software terms and understand the operational scope and limits of the suite.
        </p>
        <p className="mt-2 text-xs text-txt-3">Last updated: October 13, 2026</p>
      </div>

      <div className="my-10 space-y-8 text-sm text-txt-2 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-txt">1. Open-Source MIT License</h2>
          <p>
            YT Agent Studio is licensed under the permissive {LICENSE_NAME}. You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software for personal or commercial projects, subject to the conditions of the MIT License:
          </p>
          <div className="p-4 rounded-xl border border-line bg-surface-2 font-mono text-xs text-txt-2 leading-normal">
            THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY.
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-txt">2. Non-Affiliation with YouTube / Google</h2>
          <div className="p-4 rounded-xl border border-line bg-surface-2 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-warn shrink-0 mt-0.5" />
            <p className="text-xs">
              <strong>Notice:</strong> {DISCLAIMER_TEXT} The service is an independent editorial suite that formats content in compliance with public YouTube creator conventions.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-txt">3. Honest Algorithm Limitations</h2>
          <p>
            The scoring rubrics (including Hook Score, Title Linter, Dead-Air Cutoffs, and Retention Curve Analysis) represent structured heuristic evaluations designed to assist human editorial review.
          </p>
          <p>
            We do not claim, warrant, or guarantee that any title, script, hook, or thumbnail generated or scored by this software will achieve specific view counts, subscriber growth, monetization status, or recommendation distribution by third-party algorithms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-txt">4. User Responsibility</h2>
          <p>
            You are solely responsible for all content, titles, and video assets you publish to YouTube or any other platform. You must ensure your content adheres to the YouTube Community Guidelines, copyright law, and relevant advertising disclosures.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-txt">5. Questions</h2>
          <p>
            For inquiries regarding terms and software usage, email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-link hover:underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
