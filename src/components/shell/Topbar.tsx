"use client";

import { useState, useEffect } from "react";
import { Menu, Sun, Moon, History, Download, Search } from "lucide-react";
import { ExportImportModal } from "@/components/common/ExportImportModal";
import { HistoryDrawer } from "@/components/common/HistoryDrawer";

interface TopbarProps {
  onOpenSidebar: () => void;
}

export function Topbar({ onOpenSidebar }: TopbarProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    const isDark =
      document.documentElement.classList.contains("dark") ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (isDark) {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setTheme("dark");
    }
  };

  const triggerCommandPalette = () => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      })
    );
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-line bg-surface-1/90 px-4 backdrop-blur-md lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="rounded-pill p-2 text-txt-2 hover:bg-surface-3 hover:text-txt lg:hidden transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Cmd+K Search Bar button */}
          <button
            onClick={triggerCommandPalette}
            className="flex items-center gap-2.5 rounded-pill bg-surface-2 border border-line px-3.5 py-1.5 text-xs text-txt-2 hover:border-yt-red hover:text-txt transition-all group"
            title="Search modules (Cmd+K)"
          >
            <Search className="h-3.5 w-3.5 text-txt-2 group-hover:text-yt-red transition-colors" />
            <span className="hidden sm:inline font-medium">Jump to module...</span>
            <span className="sm:hidden font-medium">Search...</span>
            <kbd className="hidden sm:inline-block rounded-pill bg-surface-3 px-2 py-0.5 text-[10px] font-mono text-txt-2">
              ⌘K
            </kbd>
          </button>

          <div className="hidden md:flex items-center gap-2 text-xs text-txt-2">
            <span className="inline-block h-2 w-2 rounded-full bg-ok animate-pulse" />
            <span className="type-label font-bold text-[10px] tracking-wider text-txt-2">
              LOCAL ENGINE ACTIVE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* History Drawer Trigger */}
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-1.5 rounded-pill border border-line bg-surface-2 px-3 py-1.5 text-xs font-bold text-txt hover:bg-surface-3 hover:border-yt-red transition-all"
            title="Open Module History"
          >
            <History className="h-3.5 w-3.5 text-txt-2" />
            <span className="hidden sm:inline">History</span>
          </button>

          {/* Backup / Restore Modal Trigger */}
          <button
            onClick={() => setIsExportImportOpen(true)}
            className="flex items-center gap-1.5 rounded-pill border border-line bg-surface-2 px-3 py-1.5 text-xs font-bold text-txt hover:bg-surface-3 hover:border-yt-red transition-all"
            title="Backup & Restore (Export / Import)"
          >
            <Download className="h-3.5 w-3.5 text-txt-2" />
            <span className="hidden sm:inline">Backup</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-pill border border-line bg-surface-2 p-2 text-txt-2 hover:bg-surface-3 hover:text-txt transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-warn" />
            ) : (
              <Moon className="h-4 w-4 text-link" />
            )}
          </button>
        </div>
      </header>

      {/* History Drawer Component */}
      <HistoryDrawer isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />

      {/* Export / Import Modal Component */}
      <ExportImportModal isOpen={isExportImportOpen} onClose={() => setIsExportImportOpen(false)} />
    </>
  );
}
