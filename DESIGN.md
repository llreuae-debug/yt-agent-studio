# YT Agent Studio — Design System Spec

> "It should feel like opening YouTube Studio at 2 a.m. when the video finally makes sense: dark, loud, quick, and satisfying to tap."

Four pillars: **Bold, Tactile, Kinetic, Clear.**

---

## 1. Color System (YouTube Palette)

Dark is the default. Light is a first-class theme ("White YouTube").
All values are defined as CSS custom properties in `src/styles/tokens.css` and mapped in `tailwind.config.ts`. No arbitrary hex values may be hard-coded in markup or components.

### Tokens

| Token | Dark Hex | Light Hex | Role |
|---|---|---|---|
| `--bg` | `#0F0F0F` | `#FFFFFF` | Application canvas background |
| `--surface-1` | `#181818` | `#F9F9F9` | Panels, sidebar rail, base cards |
| `--surface-2` | `#212121` | `#F2F2F2` | Raised cards, inputs, secondary zones |
| `--surface-3` | `#272727` | `#E5E5E5` | Chips, hover fills, track bars |
| `--line` | `#3F3F3F` | `#D9D9D9` | Hairlines, borders, chart axes |
| `--text` | `#F1F1F1` | `#0F0F0F` | Primary high-contrast copy |
| `--text-2` | `#AAAAAA` | `#606060` | Secondary copy, metadata, timestamps |
| `--yt-red` | `#FF0000` | `#FF0000` | Brand moments, large headlines ($\ge 24\text{px}$) |
| `--yt-red-ink`| `#E00000` | `#CC0000` | High-contrast button fills supporting small white text |
| `--yt-red-text`| `#FF4E45`| `#CC0000` | Red text, badges, and icons on dark surfaces |
| `--link` | `#3EA6FF` | `#065FD4` | Hyperlinks, info badges |
| `--ok` | `#2BA640` | `#137333` | Strong scores, passing criteria |
| `--warn` | `#FFB020` | `#B06000` | Workable scores, caveats, advisory notes |
| `--bad` | `#FF4E45` | `#CC0000` | Weak scores, format errors, dropoff cliffs |

### Gradients & Effects
- **`--grad-hot`**: `linear-gradient(135deg, #FF0000 0%, #FF4E45 55%, #FF8A65 100%)` for hero buttons, active nav indicators, and "Ship it" bursts.
- **`--grad-night`**: `radial-gradient(120% 120% at 0% 0%, #2A0A0A 0%, #0F0F0F 55%)` for hero banners and empty states.
- **`--glow-red`**: `0 0 0 1px rgba(255,0,0,.35), 0 8px 40px rgba(255,0,0,.25)` for focused cards and primary active states.
- **Liquid-Glass**: Translucent backdrop blur `rgba(24,24,24,0.65)` + `backdrop-filter: blur(18px) saturate(140%)` with a 1px inner hairline border. Solid fallback on low-power devices.
- **Film Grain**: SVG turbulence overlay at 5% opacity (`mix-blend-mode: overlay`) applied strictly to hero zones.

### Contrast & Legibility Rules
- Pure white text on pure `#FF0000` yields ~4.0:1 contrast, which satisfies WCAG AA for large type ($\ge 24\text{px}$ or $\ge 18.66\text{px}$ bold), but fails normal body copy.
- **Rule**: For small white text on red fills, use `--yt-red-ink` (`#E00000` dark, `#CC0000` light) which delivers $>5.0:1$.
- **Rule**: For red text on dark backgrounds, use `--yt-red-text` (`#FF4E45`) which delivers $5.87:1$.
- Automated verification via `npm run check:contrast` checks 20 token pairs and enforces WCAG AA compliance.

---

## 2. Typography: Helvetica Family Only

Every piece of text uses the Helvetica family. No Google Fonts, no Inter, no Roboto, no monospace for UI copy.

```css
:root {
  --font: "Helvetica Neue", "Helvetica Now Display", "Helvetica Now Text", Helvetica,
          "Nimbus Sans", "Liberation Sans", Arial, sans-serif;
  --font-condensed: "Helvetica Neue Condensed", "Helvetica Neue", Helvetica, Arial, sans-serif;
}
```

### Self-Hosted Font Option
If the organization owns a Monotype Helvetica Now / Neue web license, drop WOFF2 files into `public/fonts/` and uncomment the `@font-face` definitions in `src/styles/fonts.css`.

### Fluid Scale (`clamp`)

| Token Class | Size Rule | Weight | Role |
|---|---|---|---|
| `.type-hero` | `clamp(48px, 9vw, 128px)` | 900 (Black) | Dashboard hero headline, oversized numbers |
| `.type-h1` | `clamp(32px, 5vw, 64px)` | 900 (Black) | Module screen titles, slash commands |
| `.type-h2` | `clamp(24px, 3vw, 36px)` | 700 (Bold) | Bento card titles, section headers |
| `.type-h3` | `20px` | 700 (Bold) | Card titles, "Ship it, or change it?" header |
| `.type-body` | `16px` | 400 (500 emphasis)| Standard paragraphs, transcript copy |
| `.type-small`| `14px` | 400 (Roman) | Helper copy, descriptions, table subtitles |
| `.type-label`| `12px` | 700, UPPERCASE | Metric tags, field labels, metadata chips |
| `.type-tabular`| Tabular numbers | 900 / 700 | Scores, countdowns, timestamps, timecodes |

---

## 3. Shape, Depth & Spacing

- **Base grid**: 4px. Card padding: 24–32px desktop, 16px mobile.
- **Radii tokens**:
  - Cards: `rounded-card` (24px)
  - Inputs / Textareas: `rounded-input` (16px)
  - Buttons / Chips / Badges: `rounded-pill` (9999px)
  - Thumbnails: `rounded-thumb` (12px, matching YouTube feed)
- **Sticker Accents**: Small rotated (-3° to 3°) pill badges (`TOP 1`, `STRONG`, `10.0x`, `NEW`) with 1px border and hard offset drop shadows. Limit to 1–2 per viewport.

---

## 4. Component Rules

- **Button (`src/components/ui/Button.tsx`)**: Pill shape. Primary uses `--grad-hot`, scale 0.97 spring press, hover lift + red glow, and optional haptic feedback on touch.
- **ScorePanel (`src/components/ui/ScorePanel.tsx`)**: 5 horizontal equalizer bars with spring fill animation, count-up numeric score, and band stickers (`STRONG` / `WORKABLE` / `WEAK`) with contextual icons.
- **Gate (`src/components/common/Gate.tsx`)**: Sticky liquid-glass bar asking *"Ship it, or change it?"*. "Ship it" triggers a red & white confetti burst, copies to clipboard, vibrates mobile haptics (`navigator.vibrate(10)`), and fires a toast *"Copied. Go upload it."*
- **Command Palette (`src/components/ui/CommandPalette.tsx`)**: Global Cmd/Ctrl+K search interface to jump to any of the 11 modules instantly.
- **Mobile Dock (`src/components/shell/MobileDock.tsx`)**: Floating liquid-glass bottom dock with 5 main destinations + a "More" bottom sheet.
- **EqualizerLoader (`src/components/ui/EqualizerLoader.tsx`)**: Red equalizer bouncing bars with a cycling status ticker during async processing.

---

## 5. Motion Rules & Reduced Motion

- **Easing tokens**: `--ease-out: cubic-bezier(.2,.8,.2,1)`, `--ease-spring: cubic-bezier(.175,.885,.32,1.275)`.
- **Durations**: Micro (120ms), UI (220ms), Reveal (420ms), Page (500ms). Maximum animation cap: 700ms.
- **`prefers-reduced-motion: reduce`**:
  - All transitions and animations reduce to immediate (0.01ms).
  - Marquee scrolling halts.
  - Card tilt and cursor tracking disable.
  - Cliff pulsing and count-up animations render immediately with final values.
  - Handled universally via `@media (prefers-reduced-motion: reduce)` in `src/app/globals.css`.

---

## 6. Review & Testing Commands

```bash
# Verify WCAG AA contrast for all 20 token combinations:
npm run check:contrast

# Run test suite:
npm run test

# Build production bundle:
npm run build

# Review live design system in browser:
# Open http://localhost:3005/design-system
```
