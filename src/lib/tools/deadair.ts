import { roundHalfEven } from "@/lib/math";

export interface Cue {
  start: number;
  end: number;
  text: string;
}

export interface Cut {
  kind: "DEAD" | "FILLER" | "REPEAT";
  start: number;
  end: number;
  why: string;
}

export interface DeadAirResult {
  source?: string;
  duration: number;
  cuts: Cut[];
  removed: number;
  out: number;
  percentShorter: number;
}

export const FILLER_ONLY = /^[\s,.-]*((um+|uh+|er+|ah+|so|okay|ok|right|yeah|like|anyway|basically|actually|you know|i mean|let me see|hold on)[\s,.-]*)+$/i;

export function parseTs(s: string): number {
  const clean = s.trim().replace(",", ".");
  const p = clean.split(":");
  if (p.length === 3) {
    return parseInt(p[0], 10) * 3600 + parseInt(p[1], 10) * 60 + parseFloat(p[2]);
  } else if (p.length === 2) {
    return parseInt(p[0], 10) * 60 + parseFloat(p[1]);
  }
  return parseFloat(clean) || 0;
}

export function parseTranscript(raw: string, filename?: string): Cue[] {
  const isJson = filename?.endsWith(".json") || (raw.trim().startsWith("{") || raw.trim().startsWith("["));
  if (isJson) {
    try {
      const d = JSON.parse(raw);
      const segs = Array.isArray(d) ? d : (d.segments || []);
      return segs.map((s: { start: number | string; end: number | string; text?: string }) => ({
        start: parseFloat(String(s.start)),
        end: parseFloat(String(s.end)),
        text: (s.text || "").trim(),
      }));
    } catch {
      // fallback to srt/vtt parser if JSON parse fails
    }
  }

  const cues: { start: number; end: number; lines: string[] }[] = [];
  let cur: { start: number; end: number; lines: string[] } | null = null;

  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/\s*(\d[\d:.,]+)\s*-->\s*(\d[\d:.,]+)/);
    if (m) {
      cur = {
        start: parseTs(m[1]),
        end: parseTs(m[2]),
        lines: [],
      };
      cues.push(cur);
    } else if (cur !== null && line.trim() && !/^\d+$/.test(line.trim())) {
      cur.lines.push(line.trim());
    }
  }

  return cues
    .filter(c => c.lines.length > 0)
    .map(c => ({
      start: c.start,
      end: c.end,
      text: c.lines.join(" "),
    }));
}

export function norm(t: string): string[] {
  return t.toLowerCase().replace(/[^a-z ]/g, "").trim().split(/\s+/).filter(Boolean);
}

export function computeDeadAir(cues: Cue[], floor: number = 0.45, sourceName?: string): DeadAirResult {
  if (!cues.length) {
    return {
      source: sourceName,
      duration: 0,
      cuts: [],
      removed: 0,
      out: 0,
      percentShorter: 0,
    };
  }

  const dur = cues[cues.length - 1].end;
  const cuts: Cut[] = [];

  for (let i = 0; i < cues.length; i++) {
    const { start: s, end: e, text: t } = cues[i];

    if (FILLER_ONLY.test(t)) {
      cuts.push({
        kind: "FILLER",
        start: s,
        end: e,
        why: t.trim().slice(0, 48),
      });
    }

    if (i > 0) {
      const prevEnd = cues[i - 1].end;
      const gap = s - prevEnd;
      if (gap > floor) {
        const keep = floor / 2;
        cuts.push({
          kind: "DEAD",
          start: roundHalfEven(prevEnd + keep, 3),
          end: roundHalfEven(s - keep, 3),
          why: `${gap.toFixed(2)}s gap`,
        });
      }
    }

    // A restart is compared against the last cue that was actually SPEECH.
    if (t.trim() && !FILLER_ONLY.test(t)) {
      let j = i - 1;
      while (j >= 0 && (FILLER_ONLY.test(cues[j].text) || !cues[j].text.trim())) {
        j--;
      }
      if (j >= 0) {
        const a1 = norm(cues[j].text).slice(0, 5);
        const b1 = norm(t).slice(0, 5);
        if (a1.length >= 3 && a1.length === b1.length && a1.every((w, idx) => w === b1[idx])) {
          cuts.push({
            kind: "REPEAT",
            start: cues[j].start,
            end: cues[j].end,
            why: `restart of "${a1.join(" ")}"`,
          });
        }
      }
    }
  }

  const validCuts = cuts.filter(c => c.end > c.start);
  validCuts.sort((a, b) => a.start - b.start);

  const removed = roundHalfEven(validCuts.reduce((acc, c) => acc + (c.end - c.start), 0), 3);
  const out = roundHalfEven(dur - removed, 3);
  const percentShorter = dur > 0 ? roundHalfEven((removed / dur) * 100, 1) : 0;

  return {
    source: sourceName,
    duration: dur,
    cuts: validCuts,
    removed,
    out,
    percentShorter,
  };
}
