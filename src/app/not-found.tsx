import Link from "next/link";
import { ArrowLeft, Search, FileText, Package, LineChart, Scissors, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404: Page Not Found",
  description: "The requested YouTube creator tool or guide could not be found.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  const quickLinks = [
    { title: "Script Engine", href: "/script", icon: FileText, desc: "Write 5 scored hooks and full retention script" },
    { title: "Package Studio", href: "/package", icon: Package, desc: "3-word thumbnail briefs & title character limits" },
    { title: "EDL Dead-Air Cutter", href: "/edit", icon: Scissors, desc: "Clean transcripts and trim pause gaps" },
    { title: "Retention Reader", href: "/retention", icon: LineChart, desc: "Diagnose hook leak & audience cliffs" },
    { title: "Creator Guides", href: "/guides/audience-retention", icon: BookOpen, desc: "Educational explainers on retention & titles" },
  ];

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-2 border border-line mb-6 text-yt-red font-mono text-2xl font-bold">
        404
      </div>
      <h1 className="text-3xl font-extrabold text-txt tracking-tight sm:text-4xl">
        Page Not Found
      </h1>
      <p className="mt-3 text-base text-txt-2 leading-relaxed">
        The creator tool, guide, or resource you are looking for has been moved, renamed, or does not exist.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 text-left">
        {quickLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="p-4 rounded-xl border border-line bg-surface-1 hover:border-line-focus hover:bg-surface-2 transition-colors group flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-surface-3 text-yt-red group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-txt group-hover:text-yt-red transition-colors">
                  {item.title}
                </h2>
                <p className="text-xs text-txt-2 mt-0.5">{item.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-yt-red hover:bg-yt-red-hover text-white text-sm font-bold shadow-glow transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
