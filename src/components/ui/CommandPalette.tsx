"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, ArrowRight, X } from "lucide-react";

interface CommandItem {
  name: string;
  slash: string;
  path: string;
  desc: string;
}

const COMMANDS: CommandItem[] = [
  { name: "Dashboard", slash: "/dashboard", path: "/", desc: "Studio Overview & Bento Grid" },
  { name: "Voice Profile", slash: "/voice", path: "/voice", desc: "Voice Profile (voice.md)" },
  { name: "Script", slash: "/yt-script", path: "/script", desc: "Hook & Retention Beat Script" },
  { name: "Package", slash: "/yt-package", path: "/package", desc: "Title & Thumbnail Pairing Lint" },
  { name: "Edit", slash: "/yt-edit", path: "/edit", desc: "EDL Dead-Air & Restart Cuts" },
  { name: "Comment", slash: "/yt-comment", path: "/comment", desc: "Triage & <30-Word Replies" },
  { name: "Plan", slash: "/yt-plan", path: "/plan", desc: "3-Upload Weekly Production Calendar" },
  { name: "Viral", slash: "/yt-viral", path: "/viral", desc: "Niche Outlier Median Multipliers" },
  { name: "Retention", slash: "/yt-retention", path: "/retention", desc: "Studio Retention CSV Reader & Cliffs" },
  { name: "Shorts", slash: "/yt-shorts", path: "/shorts", desc: "20-55s Transcript Cutter & Hook Rewrite" },
  { name: "SEO", slash: "/yt-seo", path: "/seo", desc: "Description Snippet & Query Win Test" },
  { name: "Chapters", slash: "/yt-chapters", path: "/chapters", desc: "YouTube Validated Timestamps" },
  { name: "Audit", slash: "/yt-audit", path: "/audit", desc: "Feed-Size Thumbnail & 1 Big Fix" },
  { name: "Design System", slash: "/design-system", path: "/design-system", desc: "Live Tokens, Helvetica Specimen & Components" },
];

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIdx(0);
      setQuery("");
    }
  }, [isOpen]);

  const filtered = COMMANDS.filter((c) => {
    const q = query.toLowerCase().trim();
    return c.name.toLowerCase().includes(q) || c.slash.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q);
  });

  const handleSelect = (item: CommandItem) => {
    setIsOpen(false);
    router.push(item.path);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
    } else if (e.key === "Enter" && filtered[selectedIdx]) {
      e.preventDefault();
      handleSelect(filtered[selectedIdx]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-xl rounded-card liquid-glass border border-line shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-line">
          <Search className="w-5 h-5 text-txt-2 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIdx(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Type a slash command (/yt-script, /yt-package)..."
            className="w-full bg-transparent text-sm text-txt placeholder:text-txt-2/60 focus:outline-none"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-pill text-txt-2 hover:text-txt hover:bg-surface-3 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-txt-2">
              No matching modules found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={item.path}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIdx(idx)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-input cursor-pointer transition-colors ${
                  idx === selectedIdx
                    ? "bg-yt-red text-white"
                    : "text-txt hover:bg-surface-2"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`type-label font-bold px-2 py-0.5 rounded-pill ${
                    idx === selectedIdx ? "bg-white/20 text-white" : "bg-surface-3 text-yt-red-text"
                  }`}>
                    {item.slash}
                  </span>
                  <div>
                    <span className="font-bold text-sm block leading-tight">{item.name}</span>
                    <span className={`text-xs ${idx === selectedIdx ? "text-white/80" : "text-txt-2"}`}>
                      {item.desc}
                    </span>
                  </div>
                </div>
                <ArrowRight className={`w-4 h-4 ${idx === selectedIdx ? "text-white" : "text-txt-2"}`} />
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-line text-[11px] text-txt-2 font-mono">
          <span>Navigate with &uarr; &darr;</span>
          <span>Select with Enter</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
};
