import Link from "next/link";
import { ShieldCheck, Heart, ExternalLink } from "lucide-react";
import { DISCLAIMER_TEXT, UPSTREAM_CREDIT, UPSTREAM_URL } from "@/lib/seo";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line/60 bg-surface-1/40 py-12 text-txt-2 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {/* Col 1: Brand & Purpose */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-txt font-bold text-sm">
            <span className="w-4 h-4 rounded bg-yt-red flex items-center justify-center text-white text-[10px]">
              ▶
            </span>
            <span>YT Agent Studio</span>
          </div>
          <p className="text-txt-2 leading-relaxed text-[11px]">
            11 deterministic tools & AI skills for YouTube creators to write, package, edit, and audit videos with zero cloud persistence.
          </p>
          <p className="text-[10px] text-txt-3">
            Local-first browser architecture. All transcripts and runs stay in your device.
          </p>
        </div>

        {/* Col 2: Creator Tools */}
        <div className="space-y-2">
          <h3 className="font-bold text-txt text-xs tracking-wider uppercase">Creator Tools</h3>
          <ul className="space-y-1.5 text-[11px]">
            <li><Link href="/script" className="hover:text-txt transition-colors">Script Engine (Hook Scoring)</Link></li>
            <li><Link href="/package" className="hover:text-txt transition-colors">Package Studio (3-Word Rule)</Link></li>
            <li><Link href="/edit" className="hover:text-txt transition-colors">Edit Decision List (EDL)</Link></li>
            <li><Link href="/retention" className="hover:text-txt transition-colors">Audience Retention Reader</Link></li>
            <li><Link href="/comment" className="hover:text-txt transition-colors">Comment Triage & Replier</Link></li>
            <li><Link href="/chapters" className="hover:text-txt transition-colors">Compliant Chapters</Link></li>
            <li><Link href="/audit" className="hover:text-txt transition-colors">Channel Audit</Link></li>
          </ul>
        </div>

        {/* Col 3: Educational Guides */}
        <div className="space-y-2">
          <h3 className="font-bold text-txt text-xs tracking-wider uppercase">Creator Guides</h3>
          <ul className="space-y-1.5 text-[11px]">
            <li><Link href="/guides/audience-retention" className="hover:text-txt transition-colors">Read Retention Graphs</Link></li>
            <li><Link href="/guides/youtube-title-rules" className="hover:text-txt transition-colors">Title Length Rules (60 vs 40)</Link></li>
            <li><Link href="/guides/youtube-chapters" className="hover:text-txt transition-colors">Chapter Timestamp Rules</Link></li>
            <li><Link href="/guides/youtube-hook-formulas" className="hover:text-txt transition-colors">21 Hook Formulas Breakdown</Link></li>
            <li><Link href="/faq" className="hover:text-txt transition-colors">Frequently Asked Questions</Link></li>
          </ul>
        </div>

        {/* Col 4: Project & Trust */}
        <div className="space-y-2">
          <h3 className="font-bold text-txt text-xs tracking-wider uppercase">Transparency & Legal</h3>
          <ul className="space-y-1.5 text-[11px]">
            <li><Link href="/about" className="hover:text-txt transition-colors">About & Fact Sheet</Link></li>
            <li><Link href="/changelog" className="hover:text-txt transition-colors">Changelog & Releases</Link></li>
            <li><Link href="/privacy" className="hover:text-txt transition-colors">Privacy Policy (Local-First)</Link></li>
            <li><Link href="/terms" className="hover:text-txt transition-colors">Terms of Use & License</Link></li>
            <li>
              <a
                href={UPSTREAM_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 text-txt-2 hover:text-txt transition-colors"
              >
                <span>Based on {UPSTREAM_CREDIT}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Mandatory Disclaimer & License Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-10 pt-6 border-t border-line/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-txt-3">
        <p className="max-w-2xl text-center sm:text-left">
          <strong>Disclaimer:</strong> {DISCLAIMER_TEXT}
        </p>
        <div className="flex items-center gap-4 shrink-0">
          <span>MIT License</span>
          <span>•</span>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:underline">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
