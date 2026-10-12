"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Mic2,
  FileText,
  Package,
  MoreHorizontal,
  X,
  Scissors,
  MessageSquare,
  Calendar,
  Flame,
  LineChart,
  Film,
  Search,
  Bookmark,
  ShieldCheck,
  Palette,
} from "lucide-react";

const MAIN_ITEMS = [
  { name: "Home", path: "/", icon: LayoutDashboard },
  { name: "Voice", path: "/voice", icon: Mic2 },
  { name: "Script", path: "/script", icon: FileText },
  { name: "Package", path: "/package", icon: Package },
];

const MORE_MODULES = [
  { name: "Edit", path: "/edit", slash: "/yt-edit", icon: Scissors },
  { name: "Comment", path: "/comment", slash: "/yt-comment", icon: MessageSquare },
  { name: "Plan", path: "/plan", slash: "/yt-plan", icon: Calendar },
  { name: "Viral", path: "/viral", slash: "/yt-viral", icon: Flame },
  { name: "Retention", path: "/retention", slash: "/yt-retention", icon: LineChart },
  { name: "Shorts", path: "/shorts", slash: "/yt-shorts", icon: Film },
  { name: "SEO", path: "/seo", slash: "/yt-seo", icon: Search },
  { name: "Chapters", path: "/chapters", slash: "/yt-chapters", icon: Bookmark },
  { name: "Audit", path: "/audit", slash: "/yt-audit", icon: ShieldCheck },
  { name: "Design System", path: "/design-system", slash: "/design-system", icon: Palette },
];

export const MobileDock: React.FC = () => {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      {/* Floating Bottom Dock (Mobile Only) */}
      <div className="fixed bottom-4 inset-x-4 z-40 lg:hidden">
        <nav className="liquid-glass rounded-pill px-4 py-2.5 flex items-center justify-around shadow-2xl border border-line">
          {MAIN_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  isActive ? "text-yt-red font-bold" : "text-txt-2 hover:text-txt"
                }`}
              >
                <div className={`p-1.5 rounded-pill ${isActive ? "bg-yt-red/10 text-yt-red" : ""}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] type-label">{item.name}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setShowMore(true)}
            className="flex flex-col items-center gap-1 text-txt-2 hover:text-txt transition-colors"
          >
            <div className="p-1.5 rounded-pill">
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span className="text-[10px] type-label">More</span>
          </button>
        </nav>
      </div>

      {/* More Bottom Sheet */}
      {showMore && (
        <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowMore(false)} />
          <div className="relative z-10 w-full rounded-t-card liquid-glass border-t border-line p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
              <span className="type-label text-txt font-bold">All Skills &amp; Tools</span>
              <button
                onClick={() => setShowMore(false)}
                className="p-1 text-txt-2 hover:text-txt"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pb-6">
              {MORE_MODULES.map((m) => {
                const Icon = m.icon;
                const isActive = pathname === m.path;
                return (
                  <Link
                    key={m.path}
                    href={m.path}
                    onClick={() => setShowMore(false)}
                    className={`flex items-center gap-3 p-3 rounded-input border transition-all ${
                      isActive
                        ? "bg-yt-red text-white border-yt-red"
                        : "bg-surface-2 text-txt border-line hover:border-line"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <div className="truncate">
                      <span className="font-bold text-xs block leading-tight truncate">{m.name}</span>
                      <span className={`text-[10px] font-mono ${isActive ? "text-white/80" : "text-txt-2"}`}>
                        {m.slash}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
