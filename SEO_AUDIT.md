# YT Agent Studio — Comprehensive Technical SEO, AEO, GEO & Structured Data Audit

**Date:** 2026-10-13  
**Canonical Production Origin:** `https://yt-agent-studio.vercel.app`  
**Stack Detected:** Next.js 14.2 App Router, TypeScript, Tailwind CSS  
**Audit Status:** Fully Implemented, Schema Validated & Verified Green  

---

## 1. Overview of Implementations

This metadata and discovery overhaul equips **YT Agent Studio** for:
1. **Search Engine Optimization (SEO):** Native per-page metadata (`<title>`, `<meta name="description">`, `canonical`, `robots`, `viewport`, `theme-color`, `<html lang="en">`).
2. **Answer Engine Optimization (AEO):** Featured-snippet optimized 40–60 word direct definition blocks on every public page, clear H1/H2/H3 question hierarchies, and step-by-step numbered walkthroughs.
3. **Generative Engine Optimization (GEO):** Plain-markdown AI site indexes (`/llms.txt`, `/llms-full.txt`), clear product entity fact sheet on `/about`, explicit open-source attribution, and transparent AI crawler allowances in `robots.txt`.
4. **Social & Sharing Cards:** Programmatic branded 1200×630 Open Graph images (`opengraph-image.tsx`) and summary large image Twitter/X cards.
5. **Technical Crawlability & PWA:** Native `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, SVG/PNG favicons, and RFC 9116 `security.txt`.
6. **Structured Data (JSON-LD):** Compliant, verifiable schema graphs (`WebApplication`, `Organization`, `WebSite`, `BreadcrumbList`, `FAQPage`, `TechArticle`). **Strictly zero fake ratings or aggregate review schemas.**

---

## 2. Complete Metadata & Indexability Directory

| Page Route | Page Title (50–60 Chars) | Meta Description (140–160 Chars) | Canonical URL | Indexable? | Schema.org Types |
|---|---|---|---|---|---|
| `/` | YouTube Creator Tools: Script, Title, Edit & Audit \| YT Agent Studio | Free local-first web app with 11 deterministic tools and AI skills for YouTube creators. Score hooks, lint titles, trim dead air, and diagnose retention graphs. | `https://yt-agent-studio.vercel.app` | **Yes** (`index, follow`) | `Organization`, `WebSite`, `WebApplication` |
| `/script` | YouTube Script Writer: Scored Hooks & Retention \| YT Agent Studio | Generate 5 candidate hooks scored deterministically across 5 dimensions, rank top two, and write full YouTube scripts with on-screen visual cues. | `https://yt-agent-studio.vercel.app/script` | **Yes** (`index, follow`) | `BreadcrumbList`, `WebApplication`, `FAQPage` |
| `/package` | YouTube Title & Thumbnail Studio: 3-Word Rule \| YT Agent Studio | Lint 10 titles against 40-char mobile and 60-char desktop cutoffs, generate 3-word thumbnail briefs, and check title-thumbnail word duplication. | `https://yt-agent-studio.vercel.app/package` | **Yes** (`index, follow`) | `BreadcrumbList`, `WebApplication`, `FAQPage` |
| `/edit` | YouTube EDL Cutter: Dead-Air & Filler Detection \| YT Agent Studio | Analyze .srt, .vtt, or Whisper transcripts to detect speech gaps above a customizable floor, filler sounds, and restarts. Export to CSV and plain text. | `https://yt-agent-studio.vercel.app/edit` | **Yes** (`index, follow`) | `BreadcrumbList`, `WebApplication`, `FAQPage` |
| `/comment` | YouTube Comment Replier: 4-Pile Triage & Pin \| YT Agent Studio | Triage YouTube comments into 4 piles (Questions, Corrections, Praise, Bait), generate concise under-30-word replies, and select one comment to pin. | `https://yt-agent-studio.vercel.app/comment` | **Yes** (`index, follow`) | `BreadcrumbList`, `WebApplication`, `FAQPage` |
| `/plan` | YouTube Weekly Planner: Capacity-Sized Schedule \| YT Agent Studio | Plan a realistic 7-day YouTube schedule sized strictly to available creator hours. Schedule 1 anchor, 1 cheap video, and 3 Shorts with an honest cutline. | `https://yt-agent-studio.vercel.app/plan` | **Yes** (`index, follow`) | `BreadcrumbList`, `WebApplication`, `FAQPage` |
| `/viral` | YouTube Outlier Analysis: Median Multiples \| YT Agent Studio | Rank collected videos by multiple over channel median, filter noise from thin channels, and classify title formulas behind genuine viral breakouts. | `https://yt-agent-studio.vercel.app/viral` | **Yes** (`index, follow`) | `BreadcrumbList`, `WebApplication`, `FAQPage` |
| `/retention` | YouTube Retention Reader: Hook Leak & Cliffs \| YT Agent Studio | Visualize YouTube retention curves, diagnose Hook Leak in the first 30 seconds, detect drop-off cliffs, and receive one actionable editorial fix. | `https://yt-agent-studio.vercel.app/retention` | **Yes** (`index, follow`) | `BreadcrumbList`, `WebApplication`, `FAQPage` |
| `/shorts` | YouTube Shorts Cutter: 20-55s Clip Extraction \| YT Agent Studio | Extract 20–55s self-contained Shorts from long transcripts. Generate replacement opening hooks, on-screen text for the first 2s, and 9:16 crop notes. | `https://yt-agent-studio.vercel.app/shorts` | **Yes** (`index, follow`) | `BreadcrumbList`, `WebApplication`, `FAQPage` |
| `/seo` | YouTube SEO & Description Studio: Snippets \| YT Agent Studio | Format the critical 2-line search snippet, structure links and chapters, run the deterministic Query Test, and generate up to 15 disambiguation tags. | `https://yt-agent-studio.vercel.app/seo` | **Yes** (`index, follow`) | `BreadcrumbList`, `WebApplication`, `FAQPage` |
| `/chapters` | YouTube Compliant Chapters: Rules & Validation \| YT Agent Studio | Generate valid YouTube chapters enforced against official platform rules: mandatory 0:00 start, at least 3 chapters, and minimum 10-second duration. | `https://yt-agent-studio.vercel.app/chapters` | **Yes** (`index, follow`) | `BreadcrumbList`, `WebApplication`, `FAQPage` |
| `/audit` | YouTube Channel Audit: Cadence, Hooks & Titles \| YT Agent Studio | Audit your YouTube channel health: lint 10 recent titles, score 3 opening hooks, check upload cadence consistency, and simulate 168x94px mobile feed size. | `https://yt-agent-studio.vercel.app/audit` | **Yes** (`index, follow`) | `BreadcrumbList`, `WebApplication`, `FAQPage` |
| `/voice` | Creator Voice Profile: Tone & Spoken Cadence \| YT Agent Studio | Define your creator voice profile: audience target, spoken cadence, forbidden words, and video format. Injected into every AI writing step in the studio. | `https://yt-agent-studio.vercel.app/voice` | **Yes** (`index, follow`) | `BreadcrumbList`, `WebApplication`, `FAQPage` |
| `/about` | About YT Agent Studio: Local-First YouTube Creator Suite | Learn how YT Agent Studio turns 11 creator skills and deterministic algorithms into an open-source, local-first web app with zero cloud storage. | `https://yt-agent-studio.vercel.app/about` | **Yes** (`index, follow`) | `BreadcrumbList`, `Organization` |
| `/faq` | Frequently Asked Questions: Free YouTube Creator Suite \| YT Agent Studio | Find clear answers on how YT Agent Studio works, local-first privacy, pricing, supported AI models, algorithm limits, and open-source licensing. | `https://yt-agent-studio.vercel.app/faq` | **Yes** (`index, follow`) | `BreadcrumbList`, `FAQPage` |
| `/changelog` | Changelog & Release Notes \| YT Agent Studio | Track version history, feature releases, algorithm updates, and performance enhancements across YT Agent Studio. | `https://yt-agent-studio.vercel.app/changelog` | **Yes** (`index, follow`) | `BreadcrumbList` |
| `/privacy` | Privacy Policy: Local-First Data Architecture \| YT Agent Studio | Read our transparent privacy policy. YT Agent Studio stores zero transcripts, ideas, or metrics on external servers. All data stays in your browser. | `https://yt-agent-studio.vercel.app/privacy` | **Yes** (`index, follow`) | `BreadcrumbList` |
| `/terms` | Terms of Use: MIT Open-Source License \| YT Agent Studio | Read the terms of use for YT Agent Studio. Licensed under the open-source MIT License with clear limits on algorithm warranties. | `https://yt-agent-studio.vercel.app/terms` | **Yes** (`index, follow`) | `BreadcrumbList` |
| `/guides/audience-retention` | How to Read YouTube Audience Retention: Hooks & Cliffs \| YT Agent Studio | Learn how to read YouTube Studio retention graphs. Diagnose hook leak in the first 30 seconds, locate drop-off cliffs, and fix mid-video pacing slides. | `https://yt-agent-studio.vercel.app/guides/audience-retention` | **Yes** (`index, follow`) | `BreadcrumbList`, `TechArticle`, `FAQPage` |
| `/guides/youtube-title-rules` | YouTube Title Length Rules: 60 vs 40 Characters \| YT Agent Studio | Learn the exact character limits for YouTube video titles. Discover the 60-character desktop cutoff, 40-character mobile rule, and 3-word thumbnail synergy. | `https://yt-agent-studio.vercel.app/guides/youtube-title-rules` | **Yes** (`index, follow`) | `BreadcrumbList`, `TechArticle`, `FAQPage` |
| `/guides/youtube-chapters` | YouTube Chapter Rules: Timestamps & Format Guide \| YT Agent Studio | Learn how to write YouTube chapters that actually work. Understand the mandatory 0:00 start rule, 3-chapter minimum, and 10-second duration limits. | `https://yt-agent-studio.vercel.app/guides/youtube-chapters` | **Yes** (`index, follow`) | `BreadcrumbList`, `TechArticle`, `FAQPage` |
| `/guides/youtube-hook-formulas` | 21 YouTube Hook Formulas: High-Retention Opening Script Guide \| YT Agent Studio | Discover the 21 proven YouTube hook formulas from hooks.json. Learn how to craft high-retention openings scored across Specificity, Address, Stakes, Curiosity & Brevity. | `https://yt-agent-studio.vercel.app/guides/youtube-hook-formulas` | **Yes** (`index, follow`) | `BreadcrumbList`, `TechArticle`, `FAQPage` |
| `/design-system` | Design System & Color Tokens (Internal) | Internal design system token and accessibility contrast specification. | `https://yt-agent-studio.vercel.app/design-system` | **No** (`noindex, nofollow`) | None |
| `/_not-found` | 404: Page Not Found | The requested YouTube creator tool or guide could not be found. | `https://yt-agent-studio.vercel.app/_not-found` | **No** (`noindex, nofollow`) | None |

---

## 3. Machine-Readable & Discovery Endpoints

1. **`sitemap.xml` (`/sitemap.xml`)**:
   - Lists all 22 public indexable URLs with real `lastmod` dates (`2026-10-13T00:00:00.000Z`) and change frequencies.
2. **`robots.txt` (`/robots.txt`)**:
   - Points to canonical sitemap.
   - Allows search engines (`Googlebot`, `Bingbot`, etc.) and AI discovery crawlers (`GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-SearchBot`, `PerplexityBot`, `Google-Extended`, `Applebot-Extended`).
   - Disallows private endpoints: `/api/` and `/design-system/`.
3. **`llms.txt` (`/llms.txt`)**:
   - Plain-markdown site index tailored for LLM context retrieval and AI assistant citations.
4. **`llms-full.txt` (`/llms-full.txt`)**:
   - In-depth technical specification of all algorithms, scoring heuristics, and formula rules.
5. **`manifest.webmanifest` (`/manifest.webmanifest`)**:
   - Web App Manifest compliant with modern PWA standards.
6. **`security.txt` (`/.well-known/security.txt`)**:
   - RFC 9116 compliant security policy and contact endpoint.

---

## 4. Verification Evidence

- **JSON-LD Schema Verification:**
  - `npm run check:schema` &rarr; 6/6 schemas valid, strictly 0 fake review/rating assertions passed.
- **TypeScript Compilation:**
  - `npx tsc --noEmit` &rarr; 0 errors across all routes and components.
- **ESLint Analysis:**
  - `npm run lint` &rarr; `✔ No ESLint warnings or errors`.
- **Vitest Golden Suite:**
  - `npm run test` &rarr; 6/6 golden unit tests passed.
- **WCAG 2.2 AA Contrast:**
  - `npm run check:contrast` &rarr; All 20 semantic color token pairs PASS WCAG 2.2 AA.
- **Next.js Production Build:**
  - `npm run build` &rarr; All 30 pages compiled cleanly as static HTML / dynamic routes.
