"use client";

import React, { useState, useEffect } from "react";
import {
  Bookmark,
  Plus,
  Trash2,
  Copy,
  Download,
  AlertTriangle,
  FolderPlus,
  Edit2,
  Check,
  X,
  FileSpreadsheet,
  FileText,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TagChip } from "./TagChip";
import {
  SavedTagList,
  getSavedTagLists,
  saveTagList,
  deleteTagList,
  getActiveListId,
  setActiveListId,
  deduplicateTags,
  exportTagsAsCsv,
  exportTagsAsTxt,
} from "@/lib/tag-storage";
import { calculateYouTubeTagLength, sanitizeTag } from "@/lib/youtube-utils";

interface MyTagListTabProps {
  onShowToast: (message: string, type?: "success" | "error" | "info") => void;
}

export const MyTagListTab: React.FC<MyTagListTabProps> = ({ onShowToast }) => {
  const [lists, setLists] = useState<SavedTagList[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [singleTagInput, setSingleTagInput] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  // Editing list name inline
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState("");

  // Editing single tag inline
  const [editingTagIndex, setEditingTagIndex] = useState<number | null>(null);
  const [editingTagValue, setEditingTagValue] = useState("");

  // New list modal or prompt
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListName, setNewListName] = useState("");

  // Drag and drop state
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  useEffect(() => {
    const loaded = getSavedTagLists();
    setLists(loaded);
    const active = getActiveListId();
    const exists = loaded.some((l) => l.id === active);
    setActiveId(exists ? active : loaded[0]?.id || "");
  }, []);

  const activeList = lists.find((l) => l.id === activeId) || lists[0];

  const updateActiveTags = (newTags: string[]) => {
    if (!activeList) return;
    const cleanTags = deduplicateTags(newTags);
    const updated = saveTagList(activeList.name, cleanTags, activeList.id);
    setLists((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };

  // Add single tag
  const handleAddSingleTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = sanitizeTag(singleTagInput);
    if (!clean) return;

    if (activeList?.tags.some((t) => t.toLowerCase() === clean.toLowerCase())) {
      onShowToast(`"${clean}" already exists in this list.`, "info");
      return;
    }

    updateActiveTags([...(activeList?.tags || []), clean]);
    setSingleTagInput("");
    onShowToast(`Added "${clean}"`, "success");
  };

  // Add bulk tags (comma or newline separated)
  const handleAddBulkTags = () => {
    if (!bulkInput.trim()) return;
    const split = bulkInput
      .split(/[,\n]/)
      .map((t) => sanitizeTag(t))
      .filter(Boolean);

    if (split.length === 0) return;

    const initialCount = activeList?.tags.length || 0;
    const combined = [...(activeList?.tags || []), ...split];
    updateActiveTags(combined);
    const updatedLists = getSavedTagLists();
    const updatedList = updatedLists.find((l) => l.id === activeId);
    const addedCount = (updatedList?.tags.length || 0) - initialCount;

    setBulkInput("");
    setIsBulkOpen(false);
    onShowToast(`Added ${addedCount} new tags (duplicates skipped).`, "success");
  };

  // Remove single tag
  const handleRemoveTag = (tagToRemove: string) => {
    if (!activeList) return;
    const filtered = activeList.tags.filter((t) => t !== tagToRemove);
    updateActiveTags(filtered);
    onShowToast(`Removed "${tagToRemove}"`, "info");
  };

  // Save inline edited tag
  const handleSaveEditedTag = (index: number) => {
    if (!activeList) return;
    const clean = sanitizeTag(editingTagValue);
    if (!clean) {
      handleRemoveTag(activeList.tags[index]);
    } else {
      const updated = [...activeList.tags];
      updated[index] = clean;
      updateActiveTags(updated);
    }
    setEditingTagIndex(null);
    setEditingTagValue("");
  };

  // Reorder tags (drag and drop)
  const handleDragStart = (index: number) => {
    setDraggedIdx(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index || !activeList) return;
    const newTags = [...activeList.tags];
    const item = newTags.splice(draggedIdx, 1)[0];
    newTags.splice(index, 0, item);
    updateActiveTags(newTags);
    setDraggedIdx(index);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  // Create new list
  const handleCreateList = () => {
    const name = newListName.trim();
    if (!name) return;
    const created = saveTagList(name, []);
    setLists(getSavedTagLists());
    setActiveId(created.id);
    setActiveListId(created.id);
    setNewListName("");
    setIsCreatingList(false);
    onShowToast(`Created list "${name}"`, "success");
  };

  // Delete current list
  const handleDeleteCurrentList = () => {
    if (lists.length <= 1) {
      onShowToast("Cannot delete the only tag list.", "error");
      return;
    }
    if (confirm(`Are you sure you want to delete "${activeList.name}"?`)) {
      deleteTagList(activeList.id);
      const remaining = getSavedTagLists();
      setLists(remaining);
      setActiveId(remaining[0].id);
      setActiveListId(remaining[0].id);
      onShowToast("Tag list deleted.", "info");
    }
  };

  // Save list rename
  const handleSaveRename = () => {
    if (!activeList) return;
    const newName = editNameValue.trim() || activeList.name;
    const updated = saveTagList(newName, activeList.tags, activeList.id);
    setLists((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    setIsEditingName(false);
    onShowToast(`Renamed list to "${newName}"`, "success");
  };

  // Exports
  const handleCopyCommaSeparated = async () => {
    if (!activeList?.tags || activeList.tags.length === 0) {
      onShowToast("List is empty.", "error");
      return;
    }
    const text = activeList.tags.join(", ");
    try {
      await navigator.clipboard.writeText(text);
      onShowToast(`Copied ${activeList.tags.length} tags to clipboard!`, "success");
    } catch {
      onShowToast("Failed to copy to clipboard.", "error");
    }
  };

  const handleDownloadCsv = () => {
    if (!activeList?.tags || activeList.tags.length === 0) {
      onShowToast("List is empty.", "error");
      return;
    }
    const csvContent = exportTagsAsCsv(activeList.tags, activeList.name);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeList.name.toLowerCase().replace(/\s+/g, "_")}_tags.csv`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast("Downloaded CSV file!", "success");
  };

  const handleDownloadTxt = () => {
    if (!activeList?.tags || activeList.tags.length === 0) {
      onShowToast("List is empty.", "error");
      return;
    }
    const txtContent = exportTagsAsTxt(activeList.tags);
    const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeList.name.toLowerCase().replace(/\s+/g, "_")}_tags.txt`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast("Downloaded TXT file!", "success");
  };

  const charCount = activeList ? calculateYouTubeTagLength(activeList.tags) : 0;
  const isOverLimit = charCount > 500;
  const percentUsed = Math.min(100, Math.round((charCount / 500) * 100));

  return (
    <div className="space-y-6">
      {/* List Selector & Management Card */}
      <div className="bg-surface-1 border border-line rounded-card p-4 md:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Active List Dropdown / Title */}
          <div className="flex items-center gap-3 flex-wrap">
            <Bookmark className="w-5 h-5 text-yt-red shrink-0" />
            {isEditingName ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={editNameValue}
                  onChange={(e) => setEditNameValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveRename();
                    if (e.key === "Escape") setIsEditingName(false);
                  }}
                  autoFocus
                  className="px-2.5 py-1 bg-surface-2 border border-line rounded-pill text-sm text-txt font-bold focus:outline-none focus:border-yt-red"
                />
                <button
                  type="button"
                  onClick={handleSaveRename}
                  className="p-1 rounded-full bg-ok/20 text-ok hover:bg-ok/30"
                  title="Save name"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="p-1 rounded-full bg-surface-3 text-txt-3 hover:text-txt"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <select
                  value={activeId}
                  onChange={(e) => {
                    setActiveId(e.target.value);
                    setActiveListId(e.target.value);
                  }}
                  className="bg-surface-2 border border-line rounded-pill px-3 py-1.5 text-sm font-bold text-txt focus:outline-none focus:border-yt-red cursor-pointer"
                >
                  {lists.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.tags.length} tags)
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    setEditNameValue(activeList?.name || "");
                    setIsEditingName(true);
                  }}
                  className="p-1.5 rounded-full hover:bg-surface-2 text-txt-3 hover:text-txt transition-colors"
                  title="Rename current list"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                {lists.length > 1 && (
                  <button
                    type="button"
                    onClick={handleDeleteCurrentList}
                    className="p-1.5 rounded-full hover:bg-bad/20 text-txt-3 hover:text-bad transition-colors"
                    title="Delete current list"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* New List Button */}
          <div>
            {isCreatingList ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateList();
                    if (e.key === "Escape") setIsCreatingList(false);
                  }}
                  placeholder="List name (e.g. Shorts, Gaming)..."
                  autoFocus
                  className="px-3 py-1 bg-surface-2 border border-line rounded-pill text-xs text-txt focus:outline-none focus:border-yt-red"
                />
                <Button size="sm" variant="primary" onClick={handleCreateList}>
                  Save
                </Button>
                <button
                  type="button"
                  onClick={() => setIsCreatingList(false)}
                  className="text-xs text-txt-3 hover:text-txt"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsCreatingList(true)}
              >
                <FolderPlus className="w-3.5 h-3.5" /> New List
              </Button>
            )}
          </div>
        </div>

        {/* 500-Character YouTube Limit Meter */}
        <div className="mt-5 p-3.5 bg-surface-2 rounded-card border border-line space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-txt flex items-center gap-1.5">
              YouTube Tag Character Counter
              {isOverLimit && (
                <span className="text-bad flex items-center gap-1 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5" /> Exceeds 500 characters!
                </span>
              )}
            </span>
            <span
              className={`font-bold ${
                isOverLimit ? "text-bad" : charCount > 450 ? "text-amber-500" : "text-txt-2"
              }`}
            >
              {charCount} / 500 characters ({percentUsed}%)
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-surface-3 rounded-pill h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-pill transition-all duration-300 ${
                isOverLimit
                  ? "bg-bad"
                  : charCount > 450
                  ? "bg-amber-500"
                  : "bg-grad-hot"
              }`}
              style={{ width: `${Math.min(100, (charCount / 500) * 100)}%` }}
            />
          </div>

          {isOverLimit && (
            <p className="text-[11px] text-bad mt-1">
              Warning: YouTube Studio rejects tags totaling more than 500 characters. Please delete or shorten a few tags.
            </p>
          )}
        </div>
      </div>

      {/* Add Tags Section */}
      <div className="bg-surface-1 border border-line rounded-card p-4 md:p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-txt">Add Tags to &ldquo;{activeList?.name}&rdquo;</h3>

        {/* Single Tag Input Form */}
        <form onSubmit={handleAddSingleTag} className="flex gap-2">
          <input
            type="text"
            value={singleTagInput}
            onChange={(e) => setSingleTagInput(e.target.value)}
            placeholder="Type a tag and press Enter (e.g. video tips, viral reels)..."
            className="flex-1 px-4 py-2 bg-surface-2 border border-line rounded-pill text-xs md:text-sm text-txt placeholder:text-txt-3 focus:outline-none focus:border-yt-red"
          />
          <Button type="submit" variant="primary" size="sm">
            <Plus className="w-3.5 h-3.5" /> Add
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setIsBulkOpen(!isBulkOpen)}
          >
            {isBulkOpen ? "Close Paste" : "Paste List"}
          </Button>
        </form>

        {/* Bulk Paste Dropdown */}
        {isBulkOpen && (
          <div className="p-4 bg-surface-2 rounded-card border border-line space-y-3 animate-fadeIn">
            <label htmlFor="bulk-tag-input" className="block text-xs font-semibold text-txt">
              Paste comma-separated or newline-separated tags:
            </label>
            <textarea
              id="bulk-tag-input"
              rows={4}
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              placeholder="youtube growth, video editing, retention, algorithm 2026&#10;viral shorts&#10;creator studio"
              className="w-full p-3 bg-surface-1 border border-line rounded-card text-xs md:text-sm text-txt placeholder:text-txt-3 focus:outline-none focus:border-yt-red resize-y"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-txt-3">
                Duplicates are automatically skipped and extra spaces trimmed.
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => setIsBulkOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" onClick={handleAddBulkTags}>
                  Import Tags
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tag Management Canvas & Reorder */}
      <div className="bg-surface-1 border border-line rounded-card p-4 md:p-6 shadow-sm space-y-4">
        {/* Header & Export Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-txt">
              Tags in this list ({activeList?.tags.length || 0})
            </h3>
            <p className="text-xs text-txt-3 mt-0.5">
              Drag tags to reorder. Click a tag to edit inline, or click &#x2715; to delete.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyCommaSeparated}
              disabled={!activeList?.tags.length}
            >
              <Copy className="w-3.5 h-3.5" /> Copy (comma)
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownloadCsv}
              disabled={!activeList?.tags.length}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownloadTxt}
              disabled={!activeList?.tags.length}
            >
              <FileText className="w-3.5 h-3.5" /> TXT
            </Button>

            {activeList?.tags && activeList.tags.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm("Clear all tags in this list?")) {
                    updateActiveTags([]);
                    onShowToast("Cleared all tags.", "info");
                  }
                }}
                className="p-1.5 rounded-full hover:bg-bad/20 text-txt-3 hover:text-bad transition-colors"
                title="Clear all tags"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tags Canvas */}
        {!activeList?.tags || activeList.tags.length === 0 ? (
          <div className="p-8 text-center bg-surface-2/60 border border-dashed border-line rounded-card space-y-2">
            <Sparkles className="w-6 h-6 text-txt-3 mx-auto" />
            <h4 className="text-sm font-bold text-txt">This list is currently empty</h4>
            <p className="text-xs text-txt-3 max-w-sm mx-auto">
              Add tags using the input above, or use the &ldquo;Find Tags from Video&rdquo; and &ldquo;Find Tags by Keyword&rdquo; tabs to send tags here.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 p-3.5 bg-surface-2/40 border border-line/60 rounded-card min-h-[140px]">
            {activeList.tags.map((tag, idx) => {
              if (editingTagIndex === idx) {
                return (
                  <div
                    key={`edit-${idx}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-1 border border-yt-red rounded-pill text-xs"
                  >
                    <input
                      type="text"
                      value={editingTagValue}
                      onChange={(e) => setEditingTagValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEditedTag(idx);
                        if (e.key === "Escape") setEditingTagIndex(null);
                      }}
                      autoFocus
                      className="bg-transparent text-txt focus:outline-none text-xs w-28"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveEditedTag(idx)}
                      className="text-ok hover:text-ok/80"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingTagIndex(null)}
                      className="text-txt-3 hover:text-txt"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              }

              return (
                <div
                  key={`${tag}-${idx}`}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`transition-opacity cursor-grab active:cursor-grabbing ${
                    draggedIdx === idx ? "opacity-40" : "opacity-100"
                  }`}
                  onDoubleClick={() => {
                    setEditingTagIndex(idx);
                    setEditingTagValue(tag);
                  }}
                  title="Double click to edit • Drag to reorder"
                >
                  <TagChip
                    tag={tag}
                    onRemove={handleRemoveTag}
                    showCopyOnClick={false}
                    className="hover:border-yt-red/60"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
