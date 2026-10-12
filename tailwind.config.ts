import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: {
          1: "var(--surface-1)",
          2: "var(--surface-2)",
          3: "var(--surface-3)",
        },
        line: "var(--line)",
        txt: {
          DEFAULT: "var(--text)",
          2: "var(--text-2)",
        },
        yt: {
          red: "var(--yt-red)",
          "red-ink": "var(--yt-red-ink)",
          "red-text": "var(--yt-red-text)",
        },
        link: "var(--link)",
        ok: "var(--ok)",
        warn: "var(--warn)",
        bad: "var(--bad)",
        // Keep previous mappings for backwards-compatibility
        background: "var(--bg)",
        foreground: "var(--text)",
        card: "var(--surface-1)",
        "card-foreground": "var(--text)",
        border: "var(--line)",
        muted: "var(--surface-2)",
        "muted-foreground": "var(--text-2)",
        primary: {
          DEFAULT: "var(--yt-red)",
          hover: "var(--yt-red-ink)",
          foreground: "#ffffff",
        },
      },
      borderRadius: {
        card: "24px",
        input: "16px",
        pill: "9999px",
        thumb: "12px",
      },
      fontFamily: {
        sans: ["var(--font)"],
        condensed: ["var(--font-condensed)"],
      },
      transitionTimingFunction: {
        spring: "var(--ease-spring)",
        "custom-out": "var(--ease-out)",
      },
      boxShadow: {
        glow: "var(--glow-red)",
      },
      backgroundImage: {
        "grad-hot": "var(--grad-hot)",
        "grad-night": "var(--grad-night)",
      },
    },
  },
  plugins: [],
};
export default config;
