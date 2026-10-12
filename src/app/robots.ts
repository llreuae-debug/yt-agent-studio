import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          // Standard Search Crawlers
          "Googlebot",
          "Bingbot",
          "Slurp",
          "DuckDuckBot",
          "Baiduspider",
          "YandexBot",
          // AI & Generative Search Crawlers (GEO Discovery)
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-SearchBot",
          "PerplexityBot",
          "Google-Extended",
          "Applebot-Extended",
          "cohere-ai",
        ],
        allow: "/",
        disallow: ["/api/", "/design-system/"],
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/design-system/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
