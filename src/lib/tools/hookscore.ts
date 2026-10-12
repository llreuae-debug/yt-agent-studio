import hooksData from "@/data/hooks.json";
import { roundHalfEven } from "@/lib/math";

export interface HookFormula {
  id: string;
  name: string;
  shape: string;
  example: string;
  fails_when: string;
  match: string[];
}

export interface HookProperties {
  SPECIFICITY: number;
  ADDRESS: number;
  STAKES: number;
  CURIOSITY: number;
  BREVITY: number;
}

export interface HookScoreResult {
  hook: string;
  properties: HookProperties;
  verdict: number;
  band: "STRONG" | "WORKABLE" | "WEAK";
  formula: string;
  matched: number;
  weakest: {
    property: keyof HookProperties;
    fix: string;
  };
}

export const FIX: Record<keyof HookProperties, string> = {
  SPECIFICITY: "swap one adjective for a number, a name or a date",
  ADDRESS: "say 'you' in the first six words",
  STAKES: "name what it costs them to keep doing it the current way",
  CURIOSITY: "cut the half of the sentence that answers itself",
  BREVITY: "9 to 24 words. Read it out loud and stop where you run out of breath",
};

const FILLER = new Set([
  "basically", "actually", "literally", "just", "really", "very", "so", "kind", "sort", "like",
  "guys", "hey", "welcome", "today", "video", "subscribe", "channel"
]);

const VAGUE = new Set([
  "amazing", "incredible", "insane", "crazy", "huge", "massive", "game", "changer", "secret",
  "powerful", "ultimate", "best", "revolutionary", "mind", "blowing", "unbelievable"
]);

const CONCRETE_REGEX = /\b(\d[\d,.]*\s?(%|k|m|x|s|m|h)?|\$\d|\d+\s?(second|minute|hour|day|week|month|year)s?)\b/gi;
const YOU_REGEX = /\b(you|your|you're|youre|yourself)\b/gi;
const STAKE_REGEX = /\b(lose|lost|wasting|waste|quit|fail|broke|cost|risk|before|stop|never|die|dying|dead)\b/gi;
const CURIOSITY_REGEX = /\b(why|how|what|which|until|before|but|nobody|almost|except|reason|actually)\b/gi;

export function words(t: string): string[] {
  return t.toLowerCase().match(/[a-z0-9'%$.]+/g) || [];
}

export function specificity(t: string): number {
  const w = words(t);
  if (!w.length) return 0;
  const nums = Array.from(t.matchAll(new RegExp(CONCRETE_REGEX.source, "gi"))).length;
  const vague = w.filter(x => VAGUE.has(x)).length;
  const filler = w.filter(x => FILLER.has(x)).length;
  let s = 34 + nums * 22 - vague * 16 - filler * 5;
  // proper nouns that are not sentence-initial read as named things
  const tokens = t.trim().split(/\s+/);
  const tail = tokens.slice(1);
  const properNouns = tail.filter(x => x.length > 0 && x[0] === x[0].toUpperCase() && x[0] !== x[0].toLowerCase()).length;
  s += Math.min(18, 6 * properNouns);
  return Math.max(0, Math.min(100, s));
}

export function address(t: string): number {
  const n = Array.from(t.matchAll(new RegExp(YOU_REGEX.source, "gi"))).length;
  const firstSix = t.trim().split(/\s+/).slice(0, 6).join(" ");
  const first = new RegExp(YOU_REGEX.source, "i").test(firstSix) ? 30 : 0;
  return Math.max(0, Math.min(100, 26 + n * 20 + first));
}

export function stakes(t: string): number {
  const n = Array.from(t.matchAll(new RegExp(STAKE_REGEX.source, "gi"))).length;
  const hasConcrete = new RegExp(CONCRETE_REGEX.source, "i").test(t);
  return Math.max(0, Math.min(100, 22 + n * 26 + (hasConcrete ? 14 : 0)));
}

export function curiosity(t: string): number {
  const n = Array.from(t.matchAll(new RegExp(CURIOSITY_REGEX.source, "gi"))).length;
  const q = t.trim().endsWith("?") ? 18 : 0;
  const closed = /\b(because|so that|which means)\b/i.test(t) ? -18 : 0;
  return Math.max(0, Math.min(100, 24 + n * 17 + q + closed));
}

export function brevity(t: string): number {
  const n = words(t).length;
  if (n === 0) return 0;
  if (n >= 9 && n <= 24) return 100;
  if (n < 9) return Math.max(30, 100 - (9 - n) * 11);
  return Math.max(10, 100 - (n - 24) * 7);
}

export function classify(t: string): { formula: string; hits: number } {
  let best: HookFormula | null = null;
  let hits = 0;
  const formulas = (hooksData as { hooks: HookFormula[] }).hooks;
  for (const f of formulas) {
    let n = 0;
    for (const p of f.match) {
      if (new RegExp(p, "i").test(t)) {
        n++;
      }
    }
    if (n > hits) {
      best = f;
      hits = n;
    }
  }
  return {
    formula: best ? best.name : "Unclassified",
    hits,
  };
}

export function score(t: string): HookScoreResult {
  const parts: HookProperties = {
    SPECIFICITY: specificity(t),
    ADDRESS: address(t),
    STAKES: stakes(t),
    CURIOSITY: curiosity(t),
    BREVITY: brevity(t),
  };

  const vals = Object.values(parts);
  const sum = vals.reduce((a, b) => a + b, 0);
  const mean = sum / vals.length;
  const minVal = Math.min(...vals);
  const verdict = roundHalfEven(0.6 * mean + 0.4 * minVal);

  const { formula, hits } = classify(t);
  const bandStr: "STRONG" | "WORKABLE" | "WEAK" =
    verdict >= 72 ? "STRONG" : verdict >= 55 ? "WORKABLE" : "WEAK";

  let lowestProp: keyof HookProperties = "SPECIFICITY";
  let lowestVal = Infinity;
  for (const [k, v] of Object.entries(parts) as [keyof HookProperties, number][]) {
    if (v < lowestVal) {
      lowestVal = v;
      lowestProp = k;
    }
  }

  return {
    hook: t.trim(),
    properties: parts,
    verdict,
    band: bandStr,
    formula,
    matched: hits,
    weakest: {
      property: lowestProp,
      fix: FIX[lowestProp],
    },
  };
}
