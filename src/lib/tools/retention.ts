import { Cue } from "@/lib/tools/deadair";
import { roundHalfEven } from "@/lib/math";

export interface Cliff {
  from: number;
  to: number;
  lost: number;
  at_seconds: number | null;
  said?: string;
}

export interface RetentionResult {
  points: number;
  start: number;
  hook_leak: number;
  end: number;
  verdict: "healthy" | "leaking" | "severe";
  cliffs: Cliff[];
  slide_per_unit: number;
  said: Record<string, string>;
  rows: { x: number; y: number; timeSec?: number }[];
}

export function parseRetentionCsv(csvText: string): [number, number][] {
  const rows: [number, number][] = [];
  const lines = csvText.split(/\r?\n/);

  for (const line of lines) {
    if (!line.trim()) continue;
    const parts = line.split(",").map(c => c.trim().replace(/%/g, ""));
    const nums: number[] = [];
    for (const p of parts) {
      const n = parseFloat(p);
      if (!isNaN(n)) nums.push(n);
    }
    if (nums.length >= 2) {
      rows.push([nums[0], nums[1]]);
    }
  }

  return rows;
}

export function computeRetention(
  dataRows: [number, number][],
  durationSec?: number,
  cues?: Cue[]
): RetentionResult {
  if (dataRows.length < 8) {
    throw new Error(`Could not read at least 8 data points from retention CSV (found ${dataRows.length})`);
  }

  const xs = dataRows.map(r => r[0]);
  const ys = dataRows.map(r => r[1]);
  const pct_axis = Math.max(...xs) <= 100.5;
  const dur = durationSec;

  const at = (x: number): number => {
    return (pct_axis && dur) ? (x / 100.0 * dur) : x;
  };

  const start = ys[0] || 100.0;
  const cutoff = !pct_axis ? 30.0 : ((dur ? (30.0 / dur * 100) : 10.0));

  const hookRows = dataRows.filter(r => r[0] <= cutoff);
  const hook_end = hookRows.length > 0 ? Math.min(...hookRows.map(r => r[1])) : start;
  const hook_leak = roundHalfEven(start - hook_end, 2);

  const drops: { rate: number; from: number; to: number; lost: number }[] = [];
  for (let i = 1; i < dataRows.length; i++) {
    const d = ys[i - 1] - ys[i];
    const span = xs[i] - xs[i - 1] || 1;
    drops.push({
      rate: d / span,
      from: xs[i - 1],
      to: xs[i],
      lost: d,
    });
  }

  // Tuple sort matching Python: (rate, from, to, lost) descending
  drops.sort((a, b) => {
    if (Math.abs(b.rate - a.rate) > 1e-9) return b.rate - a.rate;
    if (Math.abs(b.from - a.from) > 1e-9) return b.from - a.from;
    if (Math.abs(b.to - a.to) > 1e-9) return b.to - a.to;
    return b.lost - a.lost;
  });

  const cliffs: Cliff[] = drops
    .slice(0, 5)
    .filter(dr => dr.lost > 0.8)
    .map(dr => {
      const atSeconds = (!pct_axis || dur) ? roundHalfEven(at(dr.from), 1) : null;
      return {
        from: roundHalfEven(dr.from, 2),
        to: roundHalfEven(dr.to, 2),
        lost: roundHalfEven(dr.lost, 2),
        at_seconds: atSeconds,
      };
    });

  const midDrops = drops.filter(dr => dr.from > cutoff).map(dr => dr.rate);
  const slide = midDrops.length > 0 ? midDrops.reduce((a, b) => a + b, 0) / midDrops.length : 0;
  const slide_per_unit = roundHalfEven(slide, 3);

  const said: Record<string, string> = {};
  if (cues && cues.length > 0) {
    for (const c of cliffs) {
      if (c.at_seconds === null) continue;
      const t = c.at_seconds;
      const near = cues
        .filter(q => q.start <= t + 4 && q.end >= t - 4)
        .map(q => q.text);
      const spoken = near.join(" ").slice(0, 140);
      said[String(c.from)] = spoken;
      c.said = spoken;
    }
  }

  const verdict = hook_leak < 25 ? "healthy" : hook_leak < 40 ? "leaking" : "severe";

  const rowsWithTime = dataRows.map(r => ({
    x: r[0],
    y: r[1],
    timeSec: (!pct_axis || dur) ? at(r[0]) : undefined,
  }));

  return {
    points: dataRows.length,
    start,
    hook_leak,
    end: ys[ys.length - 1],
    verdict,
    cliffs,
    slide_per_unit,
    said,
    rows: rowsWithTime,
  };
}
