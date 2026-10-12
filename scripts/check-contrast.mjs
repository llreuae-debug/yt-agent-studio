/**
 * Contrast Checker Script (WCAG 2.2 AA)
 * Verifies all text/background token combinations in YT Agent Studio design system.
 */

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  return [num >> 16, (num >> 8) & 255, num & 255];
}

function sRgbToLinear(c) {
  const norm = c / 255;
  return norm <= 0.04045 ? norm / 12.92 : Math.pow((norm + 0.055) / 1.055, 2.4);
}

function getRelativeLuminance(rgb) {
  const [r, g, b] = rgb.map(sRgbToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(hex1, hex2) {
  const l1 = getRelativeLuminance(hexToRgb(hex1));
  const l2 = getRelativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const PAIRS = [
  // Dark Theme Pairs
  { name: "Dark Text on Bg", fg: "#F1F1F1", bg: "#0F0F0F", min: 4.5 },
  { name: "Dark Text on Surface-1", fg: "#F1F1F1", bg: "#181818", min: 4.5 },
  { name: "Dark Text on Surface-2", fg: "#F1F1F1", bg: "#212121", min: 4.5 },
  { name: "Dark Text-2 on Bg", fg: "#AAAAAA", bg: "#0F0F0F", min: 4.5 },
  { name: "Dark Text-2 on Surface-1", fg: "#AAAAAA", bg: "#181818", min: 4.5 },
  { name: "White on Red-Ink (Small text)", fg: "#FFFFFF", bg: "#E00000", min: 4.5 },
  { name: "White on YT-Red (Large text >=24px)", fg: "#FFFFFF", bg: "#FF0000", min: 3.0 },
  { name: "Red-Text on Dark Bg", fg: "#FF4E45", bg: "#0F0F0F", min: 4.5 },
  { name: "Red-Text on Surface-1", fg: "#FF4E45", bg: "#181818", min: 4.5 },
  { name: "Link on Dark Bg", fg: "#3EA6FF", bg: "#0F0F0F", min: 4.5 },
  { name: "Ok Green on Dark Bg", fg: "#2BA640", bg: "#0F0F0F", min: 4.5 },
  { name: "Warn Amber on Dark Bg", fg: "#FFB020", bg: "#0F0F0F", min: 4.5 },

  // Light Theme Pairs
  { name: "Light Text on Bg", fg: "#0F0F0F", bg: "#FFFFFF", min: 4.5 },
  { name: "Light Text on Surface-1", fg: "#0F0F0F", bg: "#F9F9F9", min: 4.5 },
  { name: "Light Text-2 on Bg", fg: "#606060", bg: "#FFFFFF", min: 4.5 },
  { name: "White on Light Red-Ink", fg: "#FFFFFF", bg: "#CC0000", min: 4.5 },
  { name: "Red-Text on Light Bg", fg: "#CC0000", bg: "#FFFFFF", min: 4.5 },
  { name: "Link on Light Bg", fg: "#065FD4", bg: "#FFFFFF", min: 4.5 },
  { name: "Ok Green on Light Bg", fg: "#137333", bg: "#FFFFFF", min: 4.5 },
  { name: "Warn Amber on Light Bg", fg: "#B06000", bg: "#FFFFFF", min: 4.5 },
];

console.log("\n==========================================");
console.log("  WCAG 2.2 AA Contrast Verification Suite");
console.log("==========================================\n");

let failures = 0;

for (const pair of PAIRS) {
  const ratio = getContrastRatio(pair.fg, pair.bg);
  const passed = ratio >= pair.min;
  const status = passed ? "\x1b[32mPASS\x1b[0m" : "\x1b[31mFAIL\x1b[0m";

  console.log(
    `[${status}] ${pair.name.padEnd(36)} ${ratio.toFixed(2)}:1 (Req: ${pair.min}:1) [fg: ${pair.fg}, bg: ${pair.bg}]`
  );

  if (!passed) failures++;
}

console.log("\n------------------------------------------");
if (failures === 0) {
  console.log("\x1b[32mAll token pairs strictly PASS WCAG AA contrast!\x1b[0m\n");
  process.exit(0);
} else {
  console.error(`\x1b[31m${failures} token pair(s) failed WCAG AA requirements!\x1b[0m\n`);
  process.exit(1);
}
