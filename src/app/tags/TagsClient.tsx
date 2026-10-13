"use client";

import React, { useState } from "react";
import { Video, Search, BookmarkCheck, Tag, Sparkles } from "lucide-react";
import { VideoTagsTab } from "@/components/tags/VideoTagsTab";
import { KeywordTagsTab } from "@/components/tags/KeywordTagsTab";
import { MyTagListTab } from "@/components/tags/MyTagListTab";
import { Toast } from "@/components/ui/Toast";

export type TagTabType = "video" | "keyword" | "mylist";

export default function TagsClient() {
  const [activeTab, setActiveTab] = useState<TagTabType>("video");
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({
      isOpen: true,
      message,
      type,
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Toast Notification */}
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Header Banner */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="type-label bg-yt-red text-white px-2.5 py-0.5 rounded-pill font-bold shadow-glow flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" /> YOUTUBE DATA API V3
          </span>
          <span className="type-label bg-surface-2 text-txt-2 border border-line px-2.5 py-0.5 rounded-pill font-medium">
            24H CACHE • 500-CHAR LIMIT GUARD • MULTILINGUAL RTL
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black text-txt tracking-tight uppercase">
            YouTube Tags Finder
          </h1>
          <p className="text-sm sm:text-base text-txt-2 max-w-3xl leading-relaxed">
            Extract hidden tags from any YouTube video, uncover the most frequent tags used by top-ranking videos for any keyword, and build compliant tag lists that never exceed YouTube&apos;s 500-character upload limit.
          </p>
        </div>
      </header>

      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-surface-1 border border-line rounded-pill overflow-x-auto select-none shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab("video")}
          className={`flex items-center gap-2 px-4 py-2 rounded-pill text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "video"
              ? "bg-grad-hot text-white shadow-glow"
              : "text-txt-2 hover:text-txt hover:bg-surface-2"
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Find Tags from Video</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("keyword")}
          className={`flex items-center gap-2 px-4 py-2 rounded-pill text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "keyword"
              ? "bg-grad-hot text-white shadow-glow"
              : "text-txt-2 hover:text-txt hover:bg-surface-2"
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Find Tags by Keyword</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("mylist")}
          className={`flex items-center gap-2 px-4 py-2 rounded-pill text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "mylist"
              ? "bg-grad-hot text-white shadow-glow"
              : "text-txt-2 hover:text-txt hover:bg-surface-2"
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          <span>My Tag List</span>
        </button>
      </div>

      {/* Tab Content Display */}
      <main className="transition-all duration-200">
        {activeTab === "video" && (
          <VideoTagsTab
            onShowToast={showToast}
            onNavigateToMyList={() => setActiveTab("mylist")}
          />
        )}

        {activeTab === "keyword" && (
          <KeywordTagsTab
            onShowToast={showToast}
            onNavigateToMyList={() => setActiveTab("mylist")}
          />
        )}

        {activeTab === "mylist" && (
          <MyTagListTab onShowToast={showToast} />
        )}
      </main>
    </div>
  );
}
