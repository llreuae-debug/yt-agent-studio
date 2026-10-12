import { Cue } from "@/lib/tools/deadair";
import { roundHalfEven } from "@/lib/math";

export interface Chapter {
  start: number;
  label: string;
  draft_title: string;
  seconds: number;
}

export interface ChaptersResult {
  valid: boolean;
  chapters: Chapter[];
  validationErrors?: string[];
}

const STOP = new Set(
  ("the a an of for to in on and or is are was were be been with this that it as at by from " +
   "you your i my we our they them he she but so if then than there here what which who how " +
   "when where why not no yes do does did just really very like about into over out up down " +
   "can could will would should have has had get got make made go going went one two").split(/\s+/)
);

export function keywords(text: string): Set<string> {
  const matches = text.toLowerCase().match(/[a-z']{4,}/g) || [];
  return new Set(matches.filter(w => !STOP.has(w)));
}

export function mmss(t: number): string {
  const sec = Math.floor(t);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const sPad = s.toString().padStart(2, "0");
  if (h > 0) {
    const mPad = m.toString().padStart(2, "0");
    return `${h}:${mPad}:${sPad}`;
  }
  return `${m}:${sPad}`;
}

export function countSubstring(str: string, sub: string): number {
  if (!sub.length) return 0;
  let count = 0;
  let pos = 0;
  while ((pos = str.indexOf(sub, pos)) !== -1) {
    count++;
    pos += sub.length;
  }
  return count;
}

export function computeChapters(cues: Cue[], target: number = 7): ChaptersResult {
  if (cues.length < 6) {
    return {
      valid: false,
      chapters: [],
      validationErrors: ["Too few cues to chapter (minimum 6 cues required)"],
    };
  }

  const dur = cues[cues.length - 1].end;
  const cand: { score: number; time: number; index: number }[] = [];

  for (let i = 1; i < cues.length; i++) {
    const gap = cues[i].start - cues[i - 1].end;
    const beforeSlice = cues.slice(Math.max(0, i - 12), i);
    const afterSlice = cues.slice(i, i + 12);
    const before = beforeSlice.map(c => c.text).join(" ");
    const after = afterSlice.map(c => c.text).join(" ");

    const kb = keywords(before);
    const ka = keywords(after);

    let intersectionCount = 0;
    for (const w of Array.from(kb)) {
      if (ka.has(w)) intersectionCount++;
    }
    const unionSet = new Set([...Array.from(kb), ...Array.from(ka)]);
    const shift = unionSet.size ? 1 - (intersectionCount / unionSet.size) : 0;

    cand.push({
      score: gap * 1.6 + shift * 3.2,
      time: cues[i].start,
      index: i,
    });
  }

  // Tuple sort matching Python: (score, time, index) descending
  cand.sort((a, b) => {
    if (Math.abs(b.score - a.score) > 1e-9) return b.score - a.score;
    if (Math.abs(b.time - a.time) > 1e-9) return b.time - a.time;
    return b.index - a.index;
  });

  const picked: number[] = [0.0];
  const MIN = 10.0;

  for (const item of cand) {
    if (picked.length >= target) break;
    const t = item.time;
    if (picked.every(p => Math.abs(t - p) >= MIN) && (dur - t >= MIN)) {
      picked.push(t);
    }
  }

  picked.sort((a, b) => a - b);

  const chapters: Chapter[] = [];
  for (let n = 0; n < picked.length; n++) {
    const t = picked[n];
    const end = (n + 1 < picked.length) ? picked[n + 1] : dur;
    const text = cues
      .filter(c => c.start >= t && c.end <= end)
      .map(c => c.text)
      .join(" ");

    const kw = Array.from(keywords(text));
    const lowerText = text.toLowerCase();
    kw.sort((a, b) => countSubstring(lowerText, b) - countSubstring(lowerText, a));

    const titleWords = kw.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1));
    const title = titleWords.length ? titleWords.join(" ") : "Section";

    chapters.push({
      start: roundHalfEven(t, 2),
      label: mmss(t),
      draft_title: title,
      seconds: roundHalfEven(end - t, 2),
    });
  }

  const errors: string[] = [];
  if (chapters.length < 3) errors.push("YouTube requires at least 3 chapters");
  if (chapters.length === 0 || chapters[0].start !== 0) errors.push("First chapter must start at 0:00");
  if (!chapters.every(c => c.seconds >= MIN)) errors.push("Each chapter must be at least 10 seconds long");

  const ok = errors.length === 0;

  return {
    valid: ok,
    chapters,
    validationErrors: errors.length ? errors : undefined,
  };
}
