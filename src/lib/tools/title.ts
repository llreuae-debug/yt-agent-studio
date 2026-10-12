export interface TitleCheckResult {
  title: string;
  chars: number;
  score: number;
  issues: [string, string][];
  good: string[];
}

const DESKTOP = 60;
const MOBILE = 40;
const HARD = 100;

const VAGUE = new Set([
  "amazing", "incredible", "insane", "crazy", "huge", "massive", "ultimate", "best", "powerful",
  "secret", "revolutionary", "mindblowing", "epic", "perfect", "complete", "everything"
]);

const STOP = new Set([
  "the", "a", "an", "of", "for", "to", "in", "on", "and", "or", "is", "are", "with", "your", "you", "my", "i",
  "this", "that", "it", "how", "what", "why"
]);

export function words(t: string): string[] {
  return t.toLowerCase().match(/[a-z0-9']+/g) || [];
}

export function checkTitle(title: string, thumb?: string | null): TitleCheckResult {
  const t = title.trim();
  const n = t.length;
  const issues: [string, string][] = [];
  const good: string[] = [];

  if (n > HARD) {
    issues.push(["length", `${n} characters - YouTube's hard limit is ${HARD}`]);
  } else if (n > DESKTOP) {
    issues.push(["length", `${n} characters - desktop search cuts near ${DESKTOP}`]);
  } else {
    good.push(`${n} characters, inside the ${DESKTOP}-character desktop cut`);
  }

  if (n > MOBILE) {
    const headSub = t.slice(0, MOBILE);
    const lastSpace = headSub.lastIndexOf(" ");
    const head = lastSpace !== -1 ? headSub.slice(0, lastSpace) : headSub;
    issues.push(["mobile", `a mobile feed shows about "${head}..." - check the subject survives`]);
  }

  const tokens = t.split(/\s+/);
  const caps = tokens.filter(w => w.length > 2 && /[a-z]/i.test(w) && w === w.toUpperCase());
  if (caps.length > 2) {
    issues.push(["shouting", `${caps.length} all-caps words - two is the ceiling before it reads as spam`]);
  } else if (caps.length > 0) {
    good.push(`${caps.length} all-caps word for emphasis`);
  }

  const v = words(t).filter(w => VAGUE.has(w));
  if (v.length > 0) {
    const uniqueVague = Array.from(new Set(v)).sort();
    issues.push(["vague", `${uniqueVague.join(", ")} - swap for a number, a name or a date`]);
  }

  const nums = t.match(/\d[\d,.]*%?/g) || [];
  if (nums.length > 0) {
    good.push(`carries a concrete figure (${nums.slice(0, 3).join(", ")})`);
  } else {
    issues.push(["no-number", "no number, date or name - the most reliable single fix"]);
  }

  if (t.endsWith("?")) {
    good.push("open question in the title");
  }

  const front = words(t).slice(0, 3).filter(w => !STOP.has(w));
  if (front.length === 0) {
    issues.push(["front-load", "the first three words are all filler - move the subject forward"]);
  }

  if (thumb && thumb.trim()) {
    const tw = new Set(words(t).filter(w => !STOP.has(w)));
    const hw = new Set(words(thumb).filter(w => !STOP.has(w)));
    const shared = Array.from(tw).filter(w => hw.has(w)).sort();

    if (shared.length > 0) {
      issues.push([
        "duplicate",
        `thumbnail repeats the title on ${shared.join(", ")} - the thumbnail should say what the title does not`
      ]);
    } else {
      good.push("thumbnail and title carry different words");
    }

    if (words(thumb).length > 4) {
      issues.push([
        "thumb-length",
        `${words(thumb).length} words on the thumbnail - three is the ceiling at feed size`
      ]);
    }
  }

  const score = Math.max(0, Math.min(100, 100 - 14 * issues.length + 4 * good.length));
  return {
    title: t,
    chars: n,
    score,
    issues,
    good,
  };
}
