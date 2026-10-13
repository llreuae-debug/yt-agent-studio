"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Search,
  Copy,
  PlusCircle,
  ExternalLink,
  Filter,
  ArrowUpDown,
  Sparkles,
  TrendingUp,
  Globe2,
  Video,
  CheckSquare,
  Square,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { KeywordTagsResult, TagFrequency } from "@/lib/services/youtube";
import { addTagsToList, getSavedTagLists } from "@/lib/tag-storage";
import { formatNumber, formatDate, isRTL } from "@/lib/youtube-utils";

interface KeywordTagsTabProps {
  onShowToast: (message: string, type?: "success" | "error" | "info") => void;
  onNavigateToMyList?: () => void;
}

const REGION_LANG_OPTIONS = [
  { label: "Global / English", region: "US", lang: "en" },
  { label: "Urdu (Pakistan)", region: "PK", lang: "ur" },
  { label: "Hindi (India)", region: "IN", lang: "hi" },
  { label: "Arabic (Middle East)", region: "AE", lang: "ar" },
  { label: "Spanish (Global)", region: "ES", lang: "es" },
];

const SAMPLE_KEYWORDS = [
  "how to edit videos",
  "ai coding tools",
  "urdu tech news",
  "fitness motivation",
  "real estate investing",
];

export const KeywordTagsTab: React.FC<KeywordTagsTabProps> = ({
  onShowToast,
  onNavigateToMyList,
}) => {
  const [keyword, setKeyword] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(REGION_LANG_OPTIONS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<KeywordTagsResult | null>(null);

  // Table filter and sort
  const [tableFilter, setTableFilter] = useState("");
  const [sortKey, setSortKey] = useState<"freq" | "alpha" | "length">("freq");
  const [sortAsc, setSortAsc] = useState(false);

  // Selected tags for bulk add/copy
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const handleSearch = async (overrideKw?: string) => {
    const q = overrideKw || keyword;
    if (!q.trim()) {
      setError("Please enter a keyword to search popular YouTube tags.");
      return;
    }

    setError(null);
    setLoading(true);
    setSelectedTags(new Set());

    try {
      const url = new URL("/api/tags", window.location.origin);
      url.searchParams.set("type", "keyword");
      url.searchParams.set("q", q.trim());
      if (selectedPreset.region) url.searchParams.set("region", selectedPreset.region);
      if (selectedPreset.lang) url.searchParams.set("lang", selectedPreset.lang);

      const res = await fetch(url.toString());
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to search keyword tags.");
      }

      setResult(json.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error querying YouTube API.";
      setError(msg);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Toggle selection
  const toggleSelectTag = (t: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(t)) {
        next.delete(t);
      } else {
        next.add(t);
      }
      return next;
    });
  };

  const handleSelectAllVisible = (visibleTags: TagFrequency[]) => {
    const visibleSet = new Set(visibleTags.map((item) => item.tag));
    const allSelected = visibleTags.every((item) => selectedTags.has(item.tag));

    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        visibleSet.forEach((t) => next.delete(t));
      } else {
        visibleSet.forEach((t) => next.add(t));
      }
      return next;
    });
  };

  const handleAddSelectedToList = () => {
    if (selectedTags.size === 0) {
      onShowToast("Select tags first before adding to list.", "error");
      return;
    }

    const lists = getSavedTagLists();
    const activeList = lists[0];
    const { addedCount } = addTagsToList(activeList.id, Array.from(selectedTags));

    if (addedCount > 0) {
      onShowToast(`Added ${addedCount} tags to "${activeList.name}"!`, "success");
    } else {
      onShowToast(`All selected tags are already in "${activeList.name}".`, "info");
    }
  };

  const handleCopySelected = async () => {
    if (selectedTags.size === 0) {
      onShowToast("No tags selected.", "error");
      return;
    }
    const tagsArr = Array.from(selectedTags);
    try {
      await navigator.clipboard.writeText(tagsArr.join(", "));
      onShowToast(`Copied ${tagsArr.length} tags to clipboard!`, "success");
    } catch {
      onShowToast("Failed to copy to clipboard.", "error");
    }
  };

  // Filtering and Sorting
  const filteredTags = (result?.rankedTags || []).filter((item) => {
    if (!tableFilter.trim()) return true;
    return item.tag.toLowerCase().includes(tableFilter.toLowerCase());
  });

  const sortedTags = [...filteredTags].sort((a, b) => {
    if (sortKey === "freq") {
      return sortAsc ? a.frequency - b.frequency : b.frequency - a.frequency;
    }
    if (sortKey === "alpha") {
      return sortAsc ? a.tag.localeCompare(b.tag) : b.tag.localeCompare(a.tag);
    }
    if (sortKey === "length") {
      return sortAsc ? a.tag.length - b.tag.length : b.tag.length - a.tag.length;
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Search Bar Card */}
      <div className="bg-surface-1 border border-line rounded-card p-4 md:p-6 shadow-sm">
        <div className="max-w-4xl space-y-4">
          <div>
            <label htmlFor="keyword-search-input" className="block text-sm font-semibold text-txt mb-2">
              Discover High-Ranking YouTube Tags by Keyword
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-3 pointer-events-none" />
                <input
                  id="keyword-search-input"
                  type="text"
                  value={keyword}
                  onChange={(e) => {
                    setKeyword(e.target.value);
                    if (error) setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  placeholder="e.g. video editing tutorial, ai tools, cricket highlights..."
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-2 border border-line rounded-pill text-sm text-txt placeholder:text-txt-3 focus:outline-none focus:border-yt-red focus:ring-1 focus:ring-yt-red transition-all"
                />
              </div>

              {/* Region / Language Dropdown */}
              <div className="relative sm:w-56 shrink-0">
                <Globe2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-3 pointer-events-none" />
                <select
                  value={`${selectedPreset.region}-${selectedPreset.lang}`}
                  onChange={(e) => {
                    const match = REGION_LANG_OPTIONS.find(
                      (opt) => `${opt.region}-${opt.lang}` === e.target.value
                    );
                    if (match) setSelectedPreset(match);
                  }}
                  className="w-full pl-10 pr-8 py-2.5 bg-surface-2 border border-line rounded-pill text-xs md:text-sm text-txt focus:outline-none focus:border-yt-red appearance-none cursor-pointer"
                >
                  {REGION_LANG_OPTIONS.map((opt) => (
                    <option key={`${opt.region}-${opt.lang}`} value={`${opt.region}-${opt.lang}`}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-txt-3 text-xs">
                  ▼
                </div>
              </div>

              <Button
                variant="primary"
                onClick={() => handleSearch()}
                disabled={loading}
                className="shrink-0"
              >
                {loading ? "Analyzing..." : "Discover Tags"}
              </Button>
            </div>
          </div>

          {/* Quick Keywords */}
          <div className="flex items-center flex-wrap gap-2 text-xs text-txt-3">
            <span className="flex items-center gap-1 text-txt-2 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-yt-red" /> Trending topics:
            </span>
            {SAMPLE_KEYWORDS.map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => {
                  setKeyword(kw);
                  handleSearch(kw);
                }}
                className="px-2.5 py-0.5 rounded-pill bg-surface-2 border border-line hover:border-txt-3/30 hover:text-txt transition-colors text-txt-2"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-3.5 rounded-card bg-bad/10 border border-bad/20 flex items-start gap-2.5 text-sm text-bad">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Search Failed</p>
              <p className="text-xs opacity-90 mt-0.5">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-surface-1 border border-line rounded-card p-6 space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-48 rounded-pill" />
            <Skeleton className="h-9 w-32 rounded-pill" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-card" />
            ))}
          </div>
        </div>
      )}

      {/* Results Section */}
      {!loading && result && (
        <div className="space-y-6">
          {/* Summary Stats Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-surface-1 border border-line rounded-card p-4">
              <p className="text-xs text-txt-3">Keyword Query</p>
              <p className="text-base font-bold text-txt truncate mt-0.5">{result.keyword}</p>
            </div>
            <div className="bg-surface-1 border border-line rounded-card p-4">
              <p className="text-xs text-txt-3">Videos Analyzed</p>
              <p className="text-base font-bold text-txt mt-0.5">
                {result.totalVideosAnalyzed} top videos
              </p>
            </div>
            <div className="bg-surface-1 border border-line rounded-card p-4">
              <p className="text-xs text-txt-3">Unique Tags Found</p>
              <p className="text-base font-bold text-txt mt-0.5">
                {result.totalTagsFound} tags
              </p>
            </div>
            <div className="bg-surface-1 border border-line rounded-card p-4">
              <p className="text-xs text-txt-3">Target Region / Lang</p>
              <p className="text-base font-bold text-txt mt-0.5">
                {selectedPreset.label.split(" ")[0]}
              </p>
            </div>
          </div>

          {/* Tag Frequency Table Card */}
          <div className="bg-surface-1 border border-line rounded-card p-4 md:p-6 shadow-sm space-y-4">
            {/* Table Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-yt-red" />
                <h3 className="text-sm font-bold text-txt">
                  Tag Frequency Breakdown ({sortedTags.length})
                </h3>
              </div>

              {/* Action Buttons for Selection */}
              <div className="flex items-center flex-wrap gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleSelectAllVisible(sortedTags)}
                >
                  {sortedTags.every((item) => selectedTags.has(item.tag)) && sortedTags.length > 0 ? (
                    <>
                      <Square className="w-3.5 h-3.5" /> Deselect Visible
                    </>
                  ) : (
                    <>
                      <CheckSquare className="w-3.5 h-3.5" /> Select All ({sortedTags.length})
                    </>
                  )}
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  disabled={selectedTags.size === 0}
                  onClick={handleCopySelected}
                >
                  <Copy className="w-3.5 h-3.5" /> Copy ({selectedTags.size})
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  disabled={selectedTags.size === 0}
                  onClick={handleAddSelectedToList}
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Add to My List ({selectedTags.size})
                </Button>
              </div>
            </div>

            {/* Filter and Sort Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="relative flex-1">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-txt-3 pointer-events-none" />
                <input
                  type="text"
                  value={tableFilter}
                  onChange={(e) => setTableFilter(e.target.value)}
                  placeholder="Filter tags by name..."
                  className="w-full pl-9 pr-3 py-1.5 bg-surface-2 border border-line rounded-pill text-xs text-txt placeholder:text-txt-3 focus:outline-none focus:border-yt-red"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-txt-3 flex items-center gap-1">
                  <ArrowUpDown className="w-3 h-3" /> Sort:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (sortKey === "freq") setSortAsc(!sortAsc);
                    else {
                      setSortKey("freq");
                      setSortAsc(false);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-pill border ${
                    sortKey === "freq"
                      ? "bg-surface-3 text-txt border-yt-red font-bold"
                      : "bg-surface-2 text-txt-2 border-line hover:text-txt"
                  }`}
                >
                  Frequency {sortKey === "freq" && (sortAsc ? "↑" : "↓")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (sortKey === "alpha") setSortAsc(!sortAsc);
                    else {
                      setSortKey("alpha");
                      setSortAsc(true);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-pill border ${
                    sortKey === "alpha"
                      ? "bg-surface-3 text-txt border-yt-red font-bold"
                      : "bg-surface-2 text-txt-2 border-line hover:text-txt"
                  }`}
                >
                  A-Z {sortKey === "alpha" && (sortAsc ? "↑" : "↓")}
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-line rounded-card">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-surface-2/80 border-b border-line text-txt-3 text-xs uppercase font-semibold">
                    <th className="py-2.5 px-3 w-10 text-center">Select</th>
                    <th className="py-2.5 px-3">Tag Name</th>
                    <th className="py-2.5 px-3 text-right">Frequency</th>
                    <th className="py-2.5 px-3">Used in Videos</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {sortedTags.map((item) => {
                    const isSelected = selectedTags.has(item.tag);
                    const rtl = isRTL(item.tag);

                    return (
                      <tr
                        key={item.tag}
                        onClick={() => toggleSelectTag(item.tag)}
                        className={`hover:bg-surface-2/60 transition-colors cursor-pointer select-none ${
                          isSelected ? "bg-yt-red/5" : ""
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectTag(item.tag)}
                            className="rounded accent-yt-red w-4 h-4 cursor-pointer"
                          />
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-txt" dir={rtl ? "rtl" : "ltr"}>
                          <span className={rtl ? "font-sans text-right block" : ""}>
                            {item.tag}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-txt">
                          {item.frequency}x
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-surface-3 rounded-pill h-2 max-w-[120px] overflow-hidden">
                              <div
                                className="bg-yt-red h-full rounded-pill transition-all"
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-txt-3 whitespace-nowrap">
                              {item.frequency} / {item.totalVideos} ({item.percentage}%)
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={async () => {
                              await navigator.clipboard.writeText(item.tag);
                              onShowToast(`Copied "${item.tag}"!`, "success");
                            }}
                            className="p-1 rounded-full hover:bg-surface-3 text-txt-3 hover:text-txt transition-colors"
                            title="Copy tag"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {sortedTags.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-txt-3">
                        No tags match your search filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Source Videos Section */}
          <div className="bg-surface-1 border border-line rounded-card p-4 md:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-yt-red" />
                <h3 className="text-sm font-bold text-txt">
                  Source Videos Analyzed ({result.sourceVideos.length})
                </h3>
              </div>
              <span className="text-xs text-txt-3">Ordered by YouTube view count</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.sourceVideos.map((vid) => (
                <div
                  key={vid.id}
                  className="flex gap-3 p-3 bg-surface-2 border border-line rounded-card hover:border-txt-3/30 transition-all group"
                >
                  <div className="relative w-28 aspect-video rounded-card overflow-hidden bg-surface-3 shrink-0">
                    <Image
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      fill
                      sizes="112px"
                      className="object-cover group-hover:scale-105 transition-transform"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <a
                        href={`https://www.youtube.com/watch?v=${vid.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-txt line-clamp-2 hover:text-yt-red transition-colors flex items-start gap-1"
                      >
                        <span className="flex-1">{vid.title}</span>
                        <ExternalLink className="w-3 h-3 shrink-0 mt-0.5 opacity-60" />
                      </a>
                      <p className="text-[11px] text-txt-3 truncate mt-0.5">{vid.channelTitle}</p>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-txt-3 pt-1">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {formatNumber(vid.viewCount)}
                      </span>
                      <span>•</span>
                      <span>{vid.tagCount} tags</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Initial Empty State */}
      {!loading && !result && !error && (
        <div className="bg-surface-1 border border-line rounded-card p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-yt-red/10 text-yt-red flex items-center justify-center mx-auto">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-txt">Find Top-Performing Keywords & Tags</h3>
          <p className="text-xs md:text-sm text-txt-2 max-w-md mx-auto">
            Search any topic to analyze the highest-viewed videos on YouTube, extract all their tags, and rank them by popularity.
          </p>
        </div>
      )}
    </div>
  );
};
