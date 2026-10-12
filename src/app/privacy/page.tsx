import type { Metadata } from "next";
import { ShieldCheck, Lock, Database, EyeOff } from "lucide-react";
import {
  buildPageMetadata,
  buildBreadcrumbSchema,
  BRAND_NAME,
  CONTACT_EMAIL,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy: Local-First Data Architecture | YT Agent Studio",
  description: "Read our transparent privacy policy. YT Agent Studio stores zero transcripts, ideas, or metrics on external servers. All data stays in your browser.",
  path: "/privacy",
});

export default function PrivacyPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([{ name: "Privacy Policy", path: "/privacy" }]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Header */}
      <div className="border-b border-line pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-line text-xs font-mono text-txt-2 mb-4">
          <Lock className="w-3.5 h-3.5 text-ok" />
          <span>Privacy by Design</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-txt tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-4 text-base text-txt-2 leading-relaxed max-w-2xl">
          YT Agent Studio is architected around local-first privacy. We do not track you, sell your information, or store your creative work in cloud databases.
        </p>
        <p className="mt-2 text-xs text-txt-3">Last updated: October 13, 2026</p>
      </div>

      <div className="my-10 space-y-8 text-sm text-txt-2 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-txt">1. Where Your Data Is Stored</h2>
          <p>
            All video transcripts, working titles, thumbnail briefs, notes, custom voice profiles, and run histories are stored exclusively in your local browser using HTML5 <code className="font-mono text-xs bg-surface-2 px-1.5 py-0.5 rounded text-txt">localStorage</code>.
          </p>
          <p>
            This data never leaves your device unless you initiate an AI generation request or export a JSON backup file. You can permanently clear all stored data at any time through your browser settings or via the in-app backup utility.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-txt">2. AI Generation Requests</h2>
          <p>
            When you invoke an AI writing step (e.g. generating candidate hooks or comment replies), your prompt text and voice profile are transmitted over HTTPS to our serverless endpoint (<code className="font-mono text-xs bg-surface-2 px-1.5 py-0.5 rounded text-txt">/api/generate</code>) to communicate with your selected AI model provider (Google Gemini or Anthropic Claude).
          </p>
          <p>
            We do not log, retain, or store your prompts or the resulting outputs on our servers. Processing occurs entirely in-memory during the duration of the API call.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-txt">3. Analytics and Telemetry</h2>
          <p>
            We do not use invasive third-party tracking scripts, advertising trackers, or fingerprinting cookies. Standard HTTP server access logs (IP address, user-agent, and requested path) may be temporarily processed by our hosting infrastructure (Vercel) for DDoS mitigation, rate limiting, and server security.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-txt">4. YouTube Account Access</h2>
          <p>
            YT Agent Studio does not connect to YouTube via OAuth, does not access your Google Account, and cannot view your private channel settings. We never have access to your video uploads, account credentials, or private analytics.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-txt">5. Contact</h2>
          <p>
            If you have questions about our privacy practices, you can contact us at{" "}
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
