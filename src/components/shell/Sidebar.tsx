"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Mic2,
  FileText,
  Package,
  Scissors,
  MessageSquare,
  Calendar,
  Flame,
  LineChart,
  Film,
  Search,
  Bookmark,
  ShieldCheck,
  X,
  Sparkles,
  Palette,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MODULES = [
  { name: "Script", path: "/script", slash: "/yt-script", icon: FileText },
  { name: "Package", path: "/package", slash: "/yt-package", icon: Package },
  { name: "Edit", path: "/edit", slash: "/yt-edit", icon: Scissors },
  { name: "Comment", path: "/comment", slash: "/yt-comment", icon: MessageSquare },
  { name: "Plan", path: "/plan", slash: "/yt-plan", icon: Calendar },
  { name: "Viral", path: "/viral", slash: "/yt-viral", icon: Flame },
  { name: "Retention", path: "/retention", slash: "/yt-retention", icon: LineChart },
  { name: "Shorts", path: "/shorts", slash: "/yt-shorts", icon: Film },
  { name: "SEO", path: "/seo", slash: "/yt-seo", icon: Search },
  { name: "Chapters", path: "/chapters", slash: "/yt-chapters", icon: Bookmark },
  { name: "Audit", path: "/audit", slash: "/yt-audit", icon: ShieldCheck },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Desktop & Mobile Drawer Rail */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-surface-1 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="flex h-8 w-8 items-center justify-center rounded-thumb bg-yt-red text-white shadow-glow">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-tight text-txt leading-none">
                YT AGENT STUDIO
              </span>
              <span className="type-label text-[9px] text-txt-2 tracking-widest mt-0.5">
                11 SKILLS • LOCAL FIRST
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="rounded-pill p-1.5 text-txt-2 hover:bg-surface-3 hover:text-txt lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Workspace Primary */}
          <div className="space-y-1">
            <span className="type-label text-txt-2 px-3 block mb-2 font-bold">
              Core
            </span>
            <Link
              href="/"
              onClick={onClose}
              className={`flex items-center gap-3 rounded-pill px-3.5 py-2 text-sm font-medium transition-all ${
                pathname === "/"
                  ? "bg-grad-hot text-white font-bold shadow-glow"
                  : "text-txt-2 hover:bg-surface-3 hover:text-txt"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/voice"
              onClick={onClose}
              className={`flex items-center justify-between rounded-pill px-3.5 py-2 text-sm font-medium transition-all ${
                pathname === "/voice"
                  ? "bg-grad-hot text-white font-bold shadow-glow"
                  : "text-txt-2 hover:bg-surface-3 hover:text-txt"
              }`}
            >
              <div className="flex items-center gap-3">
                <Mic2 className="h-4 w-4" />
                <span>Voice Profile</span>
              </div>
              <span className="text-[10px] type-label px-1.5 py-0.5 rounded-pill bg-surface-2 text-txt-2">
                voice.md
              </span>
            </Link>
          </div>

          {/* 11 Skills Navigation */}
          <div className="space-y-1">
            <span className="type-label text-txt-2 px-3 block mb-2 font-bold">
              Skills (11 Modules)
            </span>
            {MODULES.map((m) => {
              const Icon = m.icon;
              const isActive = pathname === m.path;
              return (
                <Link
                  key={m.path}
                  href={m.path}
                  onClick={onClose}
                  className={`group flex items-center justify-between rounded-pill px-3.5 py-1.5 text-sm transition-all ${
                    isActive
                      ? "bg-yt-red text-white font-bold shadow-glow"
                      : "text-txt-2 hover:bg-surface-3 hover:text-txt"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-txt-2 group-hover:text-txt"}`} />
                    <span className="truncate">{m.name}</span>
                  </div>
                  <span
                    className={`shrink-0 text-[10px] font-mono px-1.5 py-0.2 rounded-pill ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-surface-2 text-txt-2 group-hover:bg-surface-3 group-hover:text-txt"
                    }`}
                  >
                    {m.slash}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Resources & Guides */}
          <div className="space-y-1 pt-2 border-t border-line/40">
            <span className="type-label text-txt-2 px-3 block mb-1 font-bold">
              Knowledge & Docs
            </span>
            <Link
              href="/guides/audience-retention"
              onClick={onClose}
              className={`flex items-center gap-2.5 rounded-pill px-3.5 py-1.5 text-xs transition-all ${
                pathname.startsWith("/guides")
                  ? "bg-surface-3 text-yt-red font-bold"
                  : "text-txt-2 hover:bg-surface-3 hover:text-txt"
              }`}
            >
              <span>Creator Guides</span>
            </Link>
            <Link
              href="/faq"
              onClick={onClose}
              className={`flex items-center gap-2.5 rounded-pill px-3.5 py-1.5 text-xs transition-all ${
                pathname === "/faq"
                  ? "bg-surface-3 text-yt-red font-bold"
                  : "text-txt-2 hover:bg-surface-3 hover:text-txt"
              }`}
            >
              <span>FAQ</span>
            </Link>
            <Link
              href="/about"
              onClick={onClose}
              className={`flex items-center gap-2.5 rounded-pill px-3.5 py-1.5 text-xs transition-all ${
                pathname === "/about"
                  ? "bg-surface-3 text-yt-red font-bold"
                  : "text-txt-2 hover:bg-surface-3 hover:text-txt"
              }`}
            >
              <span>About & Fact Sheet</span>
            </Link>
          </div>

          {/* Styleguide link */}
          <div className="border-t border-line/60 pt-2">
            <Link
              href="/design-system"
              onClick={onClose}
              className={`flex items-center gap-2.5 rounded-pill px-3.5 py-1.5 text-xs font-bold transition-all ${
                pathname === "/design-system"
                  ? "bg-surface-3 text-yt-red"
                  : "text-txt-2 hover:bg-surface-3 hover:text-txt"
              }`}
            >
              <Palette className="h-3.5 w-3.5 text-yt-red" />
              <span>Design System Spec</span>
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="border-t border-line p-4 text-[11px] text-txt-2">
          <p className="font-bold text-txt">Zero Cloud Storage</p>
          <p className="text-[10px] mt-0.5">Nothing publishes to YouTube. All outputs stay in your browser.</p>
        </div>
      </aside>
    </>
  );
}
