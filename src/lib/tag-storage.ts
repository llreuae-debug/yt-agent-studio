/**
 * Tag Storage & Export Utilities
 * Local-first persistence for named YouTube tag lists.
 */

import { sanitizeTag } from "./youtube-utils";

export interface SavedTagList {
  id: string;
  name: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "yt_agent_studio_tag_lists";
const ACTIVE_LIST_KEY = "yt_agent_studio_active_tag_list";

const DEFAULT_STARTER_LIST: SavedTagList = {
  id: "list-default",
  name: "Main Channel Tags",
  tags: ["youtube tips", "video creator", "audience retention", "content strategy"],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function getSavedTagLists(): SavedTagList[] {
  if (typeof window === "undefined") return [DEFAULT_STARTER_LIST];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([DEFAULT_STARTER_LIST]));
      return [DEFAULT_STARTER_LIST];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [DEFAULT_STARTER_LIST];
  } catch {
    return [DEFAULT_STARTER_LIST];
  }
}

export function saveTagList(name: string, tags: string[], existingId?: string): SavedTagList {
  if (typeof window === "undefined") return DEFAULT_STARTER_LIST;

  const lists = getSavedTagLists();
  const cleanTags = deduplicateTags(tags);
  const now = new Date().toISOString();

  let target: SavedTagList;

  if (existingId) {
    const idx = lists.findIndex((l) => l.id === existingId);
    if (idx !== -1) {
      target = {
        ...lists[idx],
        name: name.trim() || lists[idx].name,
        tags: cleanTags,
        updatedAt: now,
      };
      lists[idx] = target;
    } else {
      target = {
        id: existingId,
        name: name.trim() || "Untitled List",
        tags: cleanTags,
        createdAt: now,
        updatedAt: now,
      };
      lists.push(target);
    }
  } else {
    target = {
      id: `list-${Date.now()}`,
      name: name.trim() || "Untitled List",
      tags: cleanTags,
      createdAt: now,
      updatedAt: now,
    };
    lists.push(target);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  return target;
}

export function deleteTagList(id: string): void {
  if (typeof window === "undefined") return;
  const lists = getSavedTagLists().filter((l) => l.id !== id);
  if (lists.length === 0) {
    lists.push(DEFAULT_STARTER_LIST);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
}

export function getActiveListId(): string {
  if (typeof window === "undefined") return DEFAULT_STARTER_LIST.id;
  try {
    return localStorage.getItem(ACTIVE_LIST_KEY) || DEFAULT_STARTER_LIST.id;
  } catch {
    return DEFAULT_STARTER_LIST.id;
  }
}

export function setActiveListId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_LIST_KEY, id);
}

export function addTagsToList(listId: string, newTags: string[]): { list: SavedTagList; addedCount: number } {
  const lists = getSavedTagLists();
  const list = lists.find((l) => l.id === listId) || lists[0];
  const initialCount = list.tags.length;

  const merged = deduplicateTags([...list.tags, ...newTags]);
  const updatedList = saveTagList(list.name, merged, list.id);

  return {
    list: updatedList,
    addedCount: merged.length - initialCount,
  };
}

export function deduplicateTags(tags: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const t of tags) {
    const cleaned = sanitizeTag(t);
    if (!cleaned) continue;
    const lower = cleaned.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      result.push(cleaned);
    }
  }

  return result;
}

export function exportTagsAsCsv(tags: string[], listName: string = "YouTube Tags"): string {
  const header = `Tag,Length,Characters`;
  const rows = tags.map((t) => `"${t.replace(/"/g, '""')}",${t.length},${t.length + 1}`);
  return `${header}\n${rows.join("\n")}\n\n# Total Tags: ${tags.length}\n# Total YouTube Characters: ${tags.join(",").length} / 500`;
}

export function exportTagsAsTxt(tags: string[]): string {
  return tags.join("\n");
}
