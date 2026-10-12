import hooksData from "@/data/hooks.json";
import { HookFormula } from "@/lib/tools/hookscore";
import { roundHalfEven } from "@/lib/math";

export interface VideoInput {
  channel?: string;
  title?: string;
  views?: number | string;
  url?: string;
  duration?: number | string;
}

export interface OutlierResult {
  channel: string;
  title: string;
  views: number;
  median: number;
  multiple: number;
  formula: string;
  url: string;
}

export interface SwipeAnalysisResult {
  totalVideos: number;
  totalChannels: number;
  outliers: OutlierResult[];
  skipped_thin_channels: [string, number][];
  formulaCounts: Record<string, number>;
}

export function classifyTitle(title: string): string {
  const formulas = (hooksData as { hooks: HookFormula[] }).hooks;
  const scored: { hits: number; name: string }[] = [];

  for (const f of formulas) {
    let n = 0;
    for (const p of f.match) {
      if (new RegExp(p, "i").test(title)) {
        n++;
      }
    }
    if (n > 0) {
      scored.push({ hits: n, name: f.name });
    }
  }

  if (!scored.length) return "Unclassified";

  // Replicating Python's tuple sort (hits, name) reverse
  scored.sort((a, b) => {
    if (b.hits !== a.hits) return b.hits - a.hits;
    return b.name.localeCompare(a.name);
  });

  return scored[0].name;
}

export function computeMedian(numbers: number[]): number {
  if (!numbers.length) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

export function analyzeOutliers(
  videos: VideoInput[],
  minMultiple: number = 1.5
): SwipeAnalysisResult {
  const by: Record<string, VideoInput[]> = {};

  for (const v of videos) {
    const ch = v.channel || "?";
    if (!by[ch]) by[ch] = [];
    by[ch].push(v);
  }

  const out: OutlierResult[] = [];
  const thin: [string, number][] = [];

  for (const [ch, vids] of Object.entries(by)) {
    const views = vids.map(v => parseFloat(String(v.views || 0)) || 0);
    const med = computeMedian(views);

    if (vids.length < 4) {
      thin.push([ch, vids.length]);
      continue;
    }

    for (const v of vids) {
      const viewNum = parseFloat(String(v.views || 0)) || 0;
      const m = med > 0 ? viewNum / med : 0;
      const multiple = roundHalfEven(m, 2);

      out.push({
        channel: ch,
        title: v.title || "",
        views: Math.floor(viewNum),
        median: Math.floor(med),
        multiple,
        formula: classifyTitle(v.title || ""),
        url: v.url || "",
      });
    }
  }

  const filtered = out.filter(r => r.multiple >= minMultiple);
  filtered.sort((a, b) => b.multiple - a.multiple);

  const formulaCounts: Record<string, number> = {};
  for (const r of filtered) {
    formulaCounts[r.formula] = (formulaCounts[r.formula] || 0) + 1;
  }

  return {
    totalVideos: videos.length,
    totalChannels: Object.keys(by).length,
    outliers: filtered,
    skipped_thin_channels: thin,
    formulaCounts,
  };
}
