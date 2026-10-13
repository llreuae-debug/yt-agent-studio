/**
 * YouTube Utility Functions
 * URL parsing, validation, sanitization, and tag formatting.
 */

const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

/**
 * Extracts and validates a YouTube video ID from various URL formats or plain ID.
 * Supports:
 * - https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://youtu.be/dQw4w9WgXcQ
 * - https://www.youtube.com/shorts/dQw4w9WgXcQ
 * - https://www.youtube.com/embed/dQw4w9WgXcQ
 * - https://www.youtube.com/live/dQw4w9WgXcQ
 * - m.youtube.com formats
 * - Plain 11-char ID
 */
export function extractVideoId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // Plain 11-char ID check
  if (YOUTUBE_ID_REGEX.test(trimmed)) {
    return trimmed;
  }

  try {
    // Add protocol if user pasted youtube.com/... without https://
    const urlStr = trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;
    const url = new URL(urlStr);

    const host = url.hostname.toLowerCase().replace(/^www\./, "").replace(/^m\./, "");

    // 1. youtu.be/<id>
    if (host === "youtu.be") {
      const id = url.pathname.slice(1).split("/")[0].split("?")[0];
      if (YOUTUBE_ID_REGEX.test(id)) return id;
    }

    // 2. youtube.com domains
    if (host === "youtube.com") {
      // /watch?v=<id>
      const vParam = url.searchParams.get("v");
      if (vParam && YOUTUBE_ID_REGEX.test(vParam)) {
        return vParam;
      }

      // /shorts/<id>, /embed/<id>, /live/<id>, /v/<id>
      const pathParts = url.pathname.split("/").filter(Boolean);
      if (pathParts.length >= 2) {
        const [prefix, id] = pathParts;
        if (["shorts", "embed", "live", "v"].includes(prefix.toLowerCase())) {
          const cleanId = id.split("?")[0];
          if (YOUTUBE_ID_REGEX.test(cleanId)) return cleanId;
        }
      }
    }
  } catch {
    // URL parsing failed, try fallback regex
  }

  // Fallback regex pattern matching
  const regexMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/
  );
  if (regexMatch && regexMatch[1]) {
    return regexMatch[1];
  }

  return null;
}

/**
 * Formats view count into readable shorthand (e.g. 1.45M, 850K).
 */
export function formatNumber(num: number | string | undefined): string {
  if (num === undefined || num === null) return "0";
  const val = typeof num === "string" ? parseInt(num, 10) : num;
  if (isNaN(val)) return "0";

  if (val >= 1_000_000_000) {
    return (val / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (val >= 1_000_000) {
    return (val / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (val >= 1_000) {
    return (val / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return val.toLocaleString();
}

/**
 * Formats ISO date string into readable format (e.g. "Oct 12, 2024").
 */
export function formatDate(isoString: string | undefined): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
}

/**
 * Sanitizes tag string (removes leading #, unescapes, trims spaces).
 */
export function sanitizeTag(tag: string): string {
  if (!tag) return "";
  return tag
    .trim()
    .replace(/^#+/, "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Calculates character usage against YouTube's 500-char limit.
 * YouTube counts the characters in each tag plus 1 comma per tag.
 */
export function calculateYouTubeTagLength(tags: string[]): number {
  if (!tags || tags.length === 0) return 0;
  // YouTube joins tags by commas in the upload box
  return tags.join(",").length;
}

/**
 * Checks if a string contains Right-to-Left characters (Urdu, Arabic, Persian, Hebrew).
 */
export function isRTL(text: string): boolean {
  const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  return rtlChars.test(text);
}
