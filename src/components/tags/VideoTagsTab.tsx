"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Search,
  Copy,
  PlusCircle,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Eye,
  Calendar,
  CheckSquare,
  Square,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { TagChip } from "./TagChip";
import { extractVideoId, formatNumber, formatDate, calculateYouTubeTagLength } from "@/lib/youtube-utils";
import { VideoTagsResult } from "@/lib/services/youtube";
import { addTagsToList, getSavedTagLists } from "@/lib/tag-storage";

interface VideoTagsTabProps {
  onShowToast: (message: string, type?: "success" | "error" | "info") => void;
  onNavigateToMyList?: () => void;
}

const SAMPLE_VIDEOS = [
  { label: "MrBeast Viral", id: "0e3GPea1Tyg" },
  { label: "Rick Astley", id: "dQw4w9WgXcQ" },
  { label: "MKBHD Tech", id: "Y5PtgmC35Wk" },
];

export const VideoTagsTab: React.FC<VideoTagsTabProps> = ({
  onShowToast,
  onNavigateToMyList,
}) => {
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<VideoTagsResult | null>(null);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const handleFetchTags = async (overrideId?: string) => {
    const raw = overrideId || inputUrl;
    if (!raw.trim()) {
      setError("Please paste a YouTube video URL or 11-character video ID.");
      return;
    }

    const videoId = extractVideoId(raw);
    if (!videoId) {
      setError("Invalid YouTube URL. Supported formats: watch?v=..., youtu.be/..., shorts/..., embed/..., or plain 11-char ID.");
      return;
    }

    setError(null);
    setLoading(true);
    setSelectedTags(new Set());

    try {
      const res = await fetch(`/api/tags?type=video&id=${encodeURIComponent(videoId)}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to fetch tags for this video.");
      }

      setVideoData(json.data);
      // Auto-select all tags initially for quick add
      if (json.data.tags && json.data.tags.length > 0) {
        setSelectedTags(new Set(json.data.tags));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error connecting to YouTube API.";
      setError(msg);
      setVideoData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAll = async () => {
    if (!videoData?.tags || videoData.tags.length === 0) return;
    const text = videoData.tags.join(", ");
    try {
      await navigator.clipboard.writeText(text);
      onShowToast(`Copied ${videoData.tags.length} tags to clipboard!`, "success");
    } catch {
      onShowToast("Failed to copy tags to clipboard.", "error");
    }
  };

  const handleCopySelected = async () => {
    if (selectedTags.size === 0) {
      onShowToast("No tags selected to copy.", "error");
      return;
    }
    const tagsToCopy = Array.from(selectedTags);
    const text = tagsToCopy.join(", ");
    try {
      await navigator.clipboard.writeText(text);
      onShowToast(`Copied ${tagsToCopy.length} selected tags!`, "success");
    } catch {
      onShowToast("Failed to copy tags.", "error");
    }
  };

  const toggleSelectTag = (tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (!videoData?.tags) return;
    if (selectedTags.size === videoData.tags.length) {
      setSelectedTags(new Set());
    } else {
      setSelectedTags(new Set(videoData.tags));
    }
  };

  const handleAddToMyList = (tagsToAdd: string[]) => {
    if (tagsToAdd.length === 0) {
      onShowToast("No tags selected to add.", "error");
      return;
    }

    const lists = getSavedTagLists();
    const activeList = lists[0];
    const { addedCount } = addTagsToList(activeList.id, tagsToAdd);

    if (addedCount > 0) {
      onShowToast(`Added ${addedCount} tags to "${activeList.name}"!`, "success");
    } else {
      onShowToast(`All ${tagsToAdd.length} tags already exist in "${activeList.name}".`, "info");
    }
  };

  const totalCharCount = videoData?.tags ? calculateYouTubeTagLength(videoData.tags) : 0;

  return (
    <div className="space-y-6">
      {/* Search Header Card */}
      <div className="bg-surface-1 border border-line rounded-card p-4 md:p-6 shadow-sm">
        <div className="max-w-3xl">
          <label htmlFor="video-url-input" className="block text-sm font-semibold text-txt mb-2">
            Paste YouTube Video Link or Video ID
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-3 pointer-events-none" />
              <input
                id="video-url-input"
                type="text"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  if (error) setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleFetchTags();
                }}
                placeholder="https://www.youtube.com/watch?v=... or shorts / youtu.be"
                className="w-full pl-10 pr-4 py-2.5 bg-surface-2 border border-line rounded-pill text-sm text-txt placeholder:text-txt-3 focus:outline-none focus:border-yt-red focus:ring-1 focus:ring-yt-red transition-all"
              />
              {inputUrl && (
                <button
                  type="button"
                  onClick={() => setInputUrl("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-txt-3 hover:text-txt"
                >
                  Clear
                </button>
              )}
            </div>
            <Button
              variant="primary"
              onClick={() => handleFetchTags()}
              disabled={loading}
              className="shrink-0"
            >
              {loading ? "Extracting..." : "Extract Tags"}
            </Button>
          </div>

          {/* Quick Sample Links */}
          <div className="mt-3 flex items-center flex-wrap gap-2 text-xs text-txt-3">
            <span className="flex items-center gap-1 text-txt-2 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-yt-red" /> Try sample:
            </span>
            {SAMPLE_VIDEOS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => {
                  setInputUrl(sample.id);
                  handleFetchTags(sample.id);
                }}
                className="px-2.5 py-0.5 rounded-pill bg-surface-2 border border-line hover:border-txt-3/30 hover:text-txt transition-colors text-txt-2"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-3.5 rounded-card bg-bad/10 border border-bad/20 flex items-start gap-2.5 text-sm text-bad">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Unable to load tags</p>
              <p className="text-xs opacity-90 mt-0.5">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-surface-1 border border-line rounded-card p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-5 items-start">
            <Skeleton className="w-full md:w-56 h-36 rounded-card shrink-0" />
            <div className="flex-1 space-y-3 w-full">
              <Skeleton className="h-6 w-3/4 rounded-pill" />
              <Skeleton className="h-4 w-1/2 rounded-pill" />
              <div className="flex gap-4 pt-2">
                <Skeleton className="h-4 w-20 rounded-pill" />
                <Skeleton className="h-4 w-24 rounded-pill" />
              </div>
            </div>
          </div>
          <div className="space-y-3 pt-4 border-t border-line">
            <Skeleton className="h-5 w-32 rounded-pill" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-pill" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Video Result Content */}
      {!loading && videoData && (
        <div className="bg-surface-1 border border-line rounded-card p-4 md:p-6 shadow-sm space-y-6">
          {/* Video Metadata Header */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-start">
            {/* Thumbnail */}
            <div className="relative w-full sm:w-56 aspect-video rounded-card overflow-hidden bg-surface-2 border border-line shrink-0 group">
              <Image
                src={videoData.thumbnailUrl}
                alt={videoData.title}
                fill
                sizes="(max-width: 640px) 100vw, 224px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />
              <a
                href={`https://www.youtube.com/watch?v=${videoData.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1 backdrop-blur-[2px]"
              >
                Watch on YouTube <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Video Details */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-pill text-[11px] font-bold bg-surface-3 text-txt-2 border border-line">
                  ID: {videoData.videoId}
                </span>
                {videoData.isDemo && (
                  <span className="px-2 py-0.5 rounded-pill text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    Preview Data
                  </span>
                )}
                {videoData.isCached && (
                  <span className="px-2 py-0.5 rounded-pill text-[10px] font-bold bg-ok/10 text-ok border border-ok/20">
                    24h Cached
                  </span>
                )}
              </div>

              <h2 className="text-base md:text-lg font-bold text-txt leading-snug line-clamp-2">
                {videoData.title}
              </h2>

              <p className="text-xs md:text-sm text-txt-2 font-medium">
                Channel: <span className="text-txt font-semibold">{videoData.channelTitle}</span>
              </p>

              {/* View Count & Published Date */}
              <div className="flex items-center gap-4 text-xs text-txt-3 pt-1">
                <span className="flex items-center gap-1 text-txt-2">
                  <Eye className="w-3.5 h-3.5" />
                  <strong>{formatNumber(videoData.viewCount)}</strong> views
                </span>
                <span className="flex items-center gap-1 text-txt-2">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(videoData.publishedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="pt-4 border-t border-line space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-txt flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-yt-red" />
                    Public Tags ({videoData.tags.length})
                  </h3>
                  <span className="text-xs text-txt-3">
                    • {totalCharCount} / 500 characters
                  </span>
                </div>
                <p className="text-xs text-txt-3 mt-0.5">
                  Click any tag to copy individually, or select multiple tags to add to your list.
                </p>
              </div>

              {/* Action Buttons */}
              {videoData.tags.length > 0 && (
                <div className="flex items-center flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-pill text-xs font-semibold bg-surface-2 hover:bg-surface-3 text-txt border border-line transition-colors"
                  >
                    {selectedTags.size === videoData.tags.length ? (
                      <>
                        <Square className="w-3.5 h-3.5" /> Deselect All
                      </>
                    ) : (
                      <>
                        <CheckSquare className="w-3.5 h-3.5" /> Select All ({selectedTags.size}/{videoData.tags.length})
                      </>
                    )}
                  </button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCopyAll}
                    title="Copy all tags comma separated"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy All
                  </Button>

                  {selectedTags.size > 0 && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAddToMyList(Array.from(selectedTags))}
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Add Selected ({selectedTags.size})
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Tags Grid / Empty State */}
            {videoData.tags.length === 0 ? (
              <div className="p-8 text-center bg-surface-2/60 border border-dashed border-line rounded-card space-y-2">
                <Info className="w-7 h-7 text-txt-3 mx-auto" />
                <h4 className="text-sm font-bold text-txt">No Public Tags Found</h4>
                <p className="text-xs text-txt-3 max-w-md mx-auto">
                  This video does not have any public tags set in its metadata. YouTube creators sometimes leave tags blank or YouTube does not expose them.
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 p-3 bg-surface-2/40 border border-line/60 rounded-card min-h-[100px]">
                {videoData.tags.map((tag) => (
                  <TagChip
                    key={tag}
                    tag={tag}
                    selectable
                    selected={selectedTags.has(tag)}
                    onToggleSelect={toggleSelectTag}
                    onCopy={(copiedTag) => onShowToast(`Copied "${copiedTag}"!`, "success")}
                  />
                ))}
              </div>
            )}

            {/* Bottom Actions Bar */}
            {videoData.tags.length > 0 && (
              <div className="flex items-center justify-between pt-2 text-xs text-txt-3">
                <span>{selectedTags.size} tags selected</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopySelected}
                    className="hover:text-txt underline transition-colors"
                  >
                    Copy selected as comma-separated
                  </button>
                  {onNavigateToMyList && (
                    <>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={onNavigateToMyList}
                        className="text-yt-red hover:underline font-semibold"
                      >
                        Open My Tag List →
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State when no search has been made */}
      {!loading && !videoData && !error && (
        <div className="bg-surface-1 border border-line rounded-card p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-yt-red/10 text-yt-red flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-txt">Inspect Any YouTube Video’s Hidden Tags</h3>
          <p className="text-xs md:text-sm text-txt-2 max-w-md mx-auto">
            Paste any YouTube video link above to see the exact tags the creator used to rank, optimize, and categorize their content.
          </p>
        </div>
      )}
    </div>
  );
};
