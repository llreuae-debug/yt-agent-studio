import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-13T00:00:00.000Z");

  const routes = [
    // Core Product Hub
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/faq", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/changelog", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/privacy", priority: 0.5, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.5, changeFrequency: "yearly" as const },

    // 11 Core Tool / Skill Modules
    { path: "/script", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/package", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/edit", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/comment", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/plan", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/viral", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/retention", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/shorts", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/seo", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/tags", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/chapters", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/audit", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/voice", priority: 0.8, changeFrequency: "monthly" as const },

    // High-Intent Educational Guides (AEO / GEO)
    { path: "/guides/audience-retention", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/guides/youtube-title-rules", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/guides/youtube-chapters", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/guides/youtube-hook-formulas", priority: 0.85, changeFrequency: "monthly" as const },
  ];

  return routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
