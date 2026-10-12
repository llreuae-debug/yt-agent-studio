# YT Agent Studio

> Turn the open-source [Jakeschincariol/youtube-agent-skill](https://github.com/Jakeschincariol/youtube-agent-skill) suite (11 Claude skills + 6 Python tools) into a point-and-click studio for YouTube creators.

YT Agent Studio is a production-ready, local-first web application designed for YouTube creators. The application runs deterministic linting, scoring, and editing algorithms directly in TypeScript on both client and server, uses server-side LLM routes (Gemini by default, Anthropic optional) for structured writing, and strictly enforces retention and packaging rules.

The app **never publishes anything to YouTube, never uses OAuth, and never scrapes**. You review, lint, score, and ship by hand.

---

## Features (All 11 YouTube Skills)

1. **`/yt-script` — Script Engine**: Writes 5 candidate hooks tagged with the 21 formulas from `hooks.json`, scores each deterministically across 5 properties, ranks down to the top two, and writes a full retention script with `[ON SCREEN: ...]` visual cues on every beat.
2. **`/yt-package` — Title & Thumbnail Studio**: Generates 10 titles, lints down to the top three using desktop (60-char) and mobile (40-char) cutoffs, writes thumbnail 3-word rule briefs, and checks title-thumbnail word overlap. Also features an instant zero-latency manual linting mode.
3. **`/yt-edit` — Edit Decision List (EDL)**: Pure deterministic analysis of `.srt`, `.vtt`, or Whisper `.json` transcripts. Detects dead-air pauses above a customizable floor, filler sounds ("um"), and restarted sentences. Exports to CSV and plain text.
4. **`/yt-comment` — Comment Replier & Triage**: Triages comments into 4 distinct piles (Questions, Corrections, Praise, Bait) with count badges displayed before replies. Enforces strict &lt;30 word replies, picks which one comment to pin, and ignores bait.
5. **`/yt-plan` — Weekly Production Planner**: Sized strictly to creator capacity (hours available and half-made assets). Plans 3 uploads on a 7-day week (1 anchor, 1 cheap video, 3 Shorts cut from anchor) with the honest line: what to drop first if the week goes wrong.
6. **`/yt-viral` — Niche Outliers & Swipe Analysis**: Ranks collected videos by multiple over their own channel's median (minimum 4 videos per channel to prevent noise). Classifies title formulas and highlights structural takeaways.
7. **`/yt-retention` — Audience Retention Reader**: Visualizes YouTube Studio audience retention exports with Recharts. Diagnoses Hook Leak (first 30s), steep drop Cliffs (mapped to spoken words), and middle Slide rate. Delivers exactly one primary fix.
8. **`/yt-shorts` — Shorts Transcript Cutter**: Extracts 20–55s self-contained moments from long transcripts. Writes a replacement hook, on-screen text for the first 2 seconds, seamless loop points, and 9:16 vertical crop framing notes.
9. **`/yt-seo` — Description & SEO Studio**: Formats the search snippet (top two lines above "...more"), links, chapters, and max 15 disambiguation tags. Executes the deterministic Query Test (checking that title and snippet contain proposed query keywords).
10. **`/yt-chapters` — YouTube Compliant Chapters**: Enforces YouTube's non-negotiable rules (0:00 start, 3+ chapters, 10s minimum each). Analyzes pause gaps and vocabulary shifts, and retitles each section in the creator's voice.
11. **`/yt-audit` — Channel Audit**: Lints 10 titles, scores 3 recent opening hooks, checks upload cadence consistency (spread variance), simulates thumbnail readability at mobile feed size (168x94px), and provides the single biggest fix.

---

## Global Rules Enforced

- **Voice First**: The Voice Profile (`voice.md`) defines target audience, spoken cadence, forbidden words, and format. Injected into every AI call. Warns if empty.
- **Never Invent Figures**: Client-side digit audit (`numberCheck.ts`) flags any number in AI output not present in the user's input or deterministic tools with a warning chip.
- **The Gate ("Ship it, or change it?")**: Every module terminates in a copyable card and sticky footer. "Ship it" copies markdown to clipboard and records history; "Change it" re-runs with feedback.
- **Deterministic First**: Algorithms calculate scores, cuts, chapters, and multiples in TypeScript; AI never fabricates or eyeballs scores.
- **Honest Limits**: Clarifies that Hook Score is a diagnostic heuristic, not an algorithm predictor.
- **Local-First Privacy**: Zero external database. All voice profiles and run history persist in `localStorage` with one-click JSON backup and restore.

---

## Quick Start

### 1. Installation

```bash
git clone https://github.com/your-username/yt-agent-studio.git
cd yt-agent-studio
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure your LLM provider in `.env.local`:

```env
# AI Provider: "gemini" (default) or "anthropic"
AI_PROVIDER=gemini

# Google Gemini Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-pro

# Anthropic Configuration (optional)
# ANTHROPIC_API_KEY=your_anthropic_api_key_here
# ANTHROPIC_MODEL=claude-3-7-sonnet-20250219
```

> **Note**: If run without an API key, the app seamlessly provides realistic built-in mock responses so you can demo, click through, and test all 11 modules immediately.

### 3. Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Testing & Verification

Run the full Vitest golden test suite:

```bash
npm run test
```

This verifies the exact outputs of the ported Python tools against the golden vectors:
- **`hookscore.ts`**: Specificity, Address, Stakes, Curiosity, Brevity, Banker's rounding verdict, band, and formula classification.
- **`title.ts`**: Desktop 60 / mobile 40 truncation, shouting, vagueness, concrete numbers, and thumbnail duplicate overlap.
- **`deadair.ts`**: Gaps, filler words, repeat sentence restarts, and runtime calculation on timestamped transcripts.
- **`chapters.ts`**: Boundary detection, 0:00 start, 3+ chapters, and 10s minimum YouTube validation.
- **`retention.ts`**: Hook leak, top 5 cliff drops, and middle slide rate per unit.
- **`swipe.ts`**: Channel median calculations, multiple filtering, formula matching, and thin-channel skipping.
- **`hooks.json`**: Compiles all 21 regex patterns to valid regular expressions.

---

## Deployment (Vercel Ready)

This project is built with Next.js (App Router) and is ready for 1-click deployment on Vercel:

1. Push your repository to GitHub / GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Under **Environment Variables**, set:
   - `AI_PROVIDER`: `gemini`
   - `GEMINI_API_KEY`: your Google Gemini API key
4. Deploy!

---

## License

MIT License. Derived from [Jakeschincariol/youtube-agent-skill](https://github.com/Jakeschincariol/youtube-agent-skill).
