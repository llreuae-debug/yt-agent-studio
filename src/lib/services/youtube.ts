/**
 * YouTube Data API v3 Service
 * Handles server-side fetching of video metadata, tags, and keyword research.
 * Includes a 24-hour cache and graceful fallback for missing API key / quota limit.
 */

import { sanitizeTag } from "../youtube-utils";

export interface VideoTagsResult {
  videoId: string;
  title: string;
  channelTitle: string;
  channelId?: string;
  publishedAt: string;
  viewCount: number | string;
  thumbnailUrl: string;
  tags: string[];
  hasTags: boolean;
  isCached?: boolean;
  isDemo?: boolean;
}

export interface TagFrequency {
  tag: string;
  frequency: number;
  totalVideos: number;
  percentage: number;
}

export interface SourceVideo {
  id: string;
  title: string;
  channelTitle: string;
  viewCount: number | string;
  thumbnailUrl: string;
  publishedAt: string;
  tagCount: number;
}

export interface KeywordTagsResult {
  keyword: string;
  region?: string;
  language?: string;
  totalVideosAnalyzed: number;
  totalTagsFound: number;
  rankedTags: TagFrequency[];
  sourceVideos: SourceVideo[];
  isCached?: boolean;
  isDemo?: boolean;
}

// In-memory 24-hour cache
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const cache = new Map<string, CacheEntry<unknown>>();

function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setToCache<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

/**
 * Fetch tags and metadata for a specific YouTube video.
 */
export async function fetchVideoTags(
  videoId: string,
  apiKey?: string
): Promise<VideoTagsResult> {
  const cacheKey = `video:${videoId}`;
  const cached = getFromCache<VideoTagsResult>(cacheKey);
  if (cached) {
    return { ...cached, isCached: true };
  }

  const key = apiKey || process.env.YOUTUBE_API_KEY;

  if (!key) {
    // Return realistic fallback demo result
    const demo = generateDemoVideoData(videoId);
    setToCache(cacheKey, demo);
    return demo;
  }

  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.searchParams.set("part", "snippet,statistics");
    url.searchParams.set("id", videoId);
    url.searchParams.set("key", key);

    const res = await fetch(url.toString(), {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.warn("YouTube API error (videos.list):", res.status, errorText);

      // If quota exceeded or forbidden, return demo fallback
      if (res.status === 403 || res.status === 429) {
        const demo = generateDemoVideoData(videoId);
        setToCache(cacheKey, demo);
        return demo;
      }
      throw new Error(`YouTube API returned status ${res.status}`);
    }

    const json = await res.json();
    if (!json.items || json.items.length === 0) {
      throw new Error("Video not found or is private/deleted.");
    }

    const item = json.items[0];
    const snippet = item.snippet || {};
    const stats = item.statistics || {};
    const rawTags: string[] = Array.isArray(snippet.tags) ? snippet.tags : [];
    const cleanTags = Array.from(
      new Set(rawTags.map(sanitizeTag).filter(Boolean))
    );

    const thumb =
      snippet.thumbnails?.maxres?.url ||
      snippet.thumbnails?.high?.url ||
      snippet.thumbnails?.medium?.url ||
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    const result: VideoTagsResult = {
      videoId,
      title: snippet.title || "Untitled Video",
      channelTitle: snippet.channelTitle || "Unknown Channel",
      channelId: snippet.channelId,
      publishedAt: snippet.publishedAt || new Date().toISOString(),
      viewCount: stats.viewCount || 0,
      thumbnailUrl: thumb,
      tags: cleanTags,
      hasTags: cleanTags.length > 0,
      isCached: false,
    };

    setToCache(cacheKey, result);
    return result;
  } catch (err: unknown) {
    console.error("fetchVideoTags error:", err);
    // If it's a "Video not found" error, propagate it
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("not found")) {
      throw err;
    }
    // Otherwise fallback to demo data
    const demo = generateDemoVideoData(videoId);
    return demo;
  }
}

/**
 * Fetch top videos for a keyword and aggregate popular tags ranked by frequency.
 */
export async function fetchKeywordTags(
  keyword: string,
  options: {
    regionCode?: string;
    relevanceLanguage?: string;
    maxResults?: number;
  } = {},
  apiKey?: string
): Promise<KeywordTagsResult> {
  const cleanKeyword = keyword.trim();
  const region = options.regionCode || "";
  const lang = options.relevanceLanguage || "";
  const maxResults = options.maxResults || 15;

  const cacheKey = `kw:${cleanKeyword.toLowerCase()}:${region}:${lang}:${maxResults}`;
  const cached = getFromCache<KeywordTagsResult>(cacheKey);
  if (cached) {
    return { ...cached, isCached: true };
  }

  const key = apiKey || process.env.YOUTUBE_API_KEY;

  if (!key) {
    const demo = generateDemoKeywordData(cleanKeyword, region, lang);
    setToCache(cacheKey, demo);
    return demo;
  }

  try {
    // Step 1: search.list (type=video, order=viewCount, maxResults=15)
    const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    searchUrl.searchParams.set("part", "id");
    searchUrl.searchParams.set("type", "video");
    searchUrl.searchParams.set("order", "viewCount");
    searchUrl.searchParams.set("q", cleanKeyword);
    searchUrl.searchParams.set("maxResults", String(maxResults));
    searchUrl.searchParams.set("key", key);

    if (region) searchUrl.searchParams.set("regionCode", region);
    if (lang) searchUrl.searchParams.set("relevanceLanguage", lang);

    const searchRes = await fetch(searchUrl.toString(), {
      next: { revalidate: 86400 },
    });

    if (!searchRes.ok) {
      if (searchRes.status === 403 || searchRes.status === 429) {
        const demo = generateDemoKeywordData(cleanKeyword, region, lang);
        setToCache(cacheKey, demo);
        return demo;
      }
      throw new Error(`YouTube Search API returned status ${searchRes.status}`);
    }

    const searchJson = await searchRes.json();
    const videoIds: string[] = (searchJson.items || [])
      .map((item: { id?: { videoId?: string } }) => item.id?.videoId)
      .filter((id: unknown): id is string => typeof id === "string" && Boolean(id));

    if (videoIds.length === 0) {
      return {
        keyword: cleanKeyword,
        region,
        language: lang,
        totalVideosAnalyzed: 0,
        totalTagsFound: 0,
        rankedTags: [],
        sourceVideos: [],
      };
    }

    // Step 2: videos.list for snippet and statistics
    const videosUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
    videosUrl.searchParams.set("part", "snippet,statistics");
    videosUrl.searchParams.set("id", videoIds.join(","));
    videosUrl.searchParams.set("key", key);

    const videosRes = await fetch(videosUrl.toString(), {
      next: { revalidate: 86400 },
    });

    if (!videosRes.ok) {
      throw new Error(`YouTube Videos API returned status ${videosRes.status}`);
    }

    const videosJson = await videosRes.json();
    const items = videosJson.items || [];

    // Aggregate tags and frequency
    const tagFreqMap = new Map<string, number>();
    const sourceVideos: SourceVideo[] = [];

    for (const item of items) {
      const vidId = item.id;
      const snippet = item.snippet || {};
      const stats = item.statistics || {};
      const tags: string[] = Array.isArray(snippet.tags) ? snippet.tags : [];
      const cleanVideoTags = Array.from(
        new Set(tags.map(sanitizeTag).filter(Boolean))
      );

      for (const t of cleanVideoTags) {
        const lower = t.toLowerCase();
        tagFreqMap.set(lower, (tagFreqMap.get(lower) || 0) + 1);
      }

      sourceVideos.push({
        id: vidId,
        title: snippet.title || "Untitled",
        channelTitle: snippet.channelTitle || "Creator",
        viewCount: stats.viewCount || 0,
        thumbnailUrl:
          snippet.thumbnails?.medium?.url ||
          `https://i.ytimg.com/vi/${vidId}/mqdefault.jpg`,
        publishedAt: snippet.publishedAt || "",
        tagCount: cleanVideoTags.length,
      });
    }

    const totalVideos = sourceVideos.length;
    const rankedTags: TagFrequency[] = Array.from(tagFreqMap.entries())
      .map(([tag, freq]) => ({
        tag,
        frequency: freq,
        totalVideos,
        percentage: totalVideos > 0 ? Math.round((freq / totalVideos) * 100) : 0,
      }))
      .sort((a, b) => b.frequency - a.frequency || a.tag.localeCompare(b.tag));

    const result: KeywordTagsResult = {
      keyword: cleanKeyword,
      region,
      language: lang,
      totalVideosAnalyzed: totalVideos,
      totalTagsFound: tagFreqMap.size,
      rankedTags,
      sourceVideos,
      isCached: false,
    };

    setToCache(cacheKey, result);
    return result;
  } catch (err) {
    console.error("fetchKeywordTags error:", err);
    const demo = generateDemoKeywordData(cleanKeyword, region, lang);
    return demo;
  }
}

// ---------------- Demo / Fallback Generators ----------------

function generateDemoVideoData(videoId: string): VideoTagsResult {
  const isMusic = videoId.toLowerCase().includes("rick") || videoId === "dQw4w9WgXcQ";

  const tags = isMusic
    ? [
        "rick astley",
        "never gonna give you up",
        "official music video",
        "80s pop",
        "rickroll",
        "remastered 4k",
        "synthpop",
        "dance pop",
        "music hits",
        "classic songs",
      ]
    : [
        "youtube growth",
        "video editing tutorial",
        "viral video formula",
        "content creator tips",
        "youtube seo",
        "how to get more views",
        "algorithm secrets",
        "thumbnail design",
        "retention editing",
        "youtube automation",
        "creator economy",
        "high cpm tags",
      ];

  return {
    videoId,
    title: isMusic
      ? "Rick Astley - Never Gonna Give You Up (Official Music Video)"
      : "The Ultimate YouTube Strategy for Explosive Growth in 2026",
    channelTitle: isMusic ? "Rick Astley" : "Creator Studio Insights",
    channelId: "UC_demo_channel",
    publishedAt: "2024-03-15T12:00:00Z",
    viewCount: isMusic ? 1540890000 : 842500,
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    tags,
    hasTags: true,
    isCached: false,
    isDemo: true,
  };
}

function generateDemoKeywordData(
  keyword: string,
  region?: string,
  lang?: string
): KeywordTagsResult {
  const kw = keyword.toLowerCase();

  // Pick realistic tags tailored to common queries or multilingual prompts
  let baseTags: string[] = [];

  if (lang === "ur" || kw.includes("urdu") || /[\u0600-\u06FF]/.test(kw)) {
    baseTags = [
      keyword,
      "اردو ٹیوٹوریل",
      "یوٹیوب ٹپس اردو",
      "آن لائن ارننگ",
      "ڈیجیٹل مارکیٹنگ",
      "فری لانسنگ",
      "ٹیکنالوجی اردو",
      "یوٹیوب گروتھ",
      "ویڈیو ایڈیٹنگ",
      "یوٹیوب پر ویوز کیسے بڑھائیں",
      "viral tags urdu",
      "urdu tech guide",
    ];
  } else if (lang === "ar" || kw.includes("arabic")) {
    baseTags = [
      keyword,
      "يوتيوب بالعربي",
      "كيف تزيد المشاهدات",
      "تصميم فيديو",
      "ذكاء اصطناعي",
      "تسويق الكتروني",
      "الربح من اليوتيوب",
      "صناعة المحتوى",
      "نصائح لليوتيوبرز",
      "خوارزميات اليوتيوب",
      "أفضل الكلمات المفتاحية",
    ];
  } else if (lang === "hi" || kw.includes("hindi")) {
    baseTags = [
      keyword,
      "youtube growth hindi",
      "views kaise badhaye",
      "subscribers kaise badhaye",
      "video editing tutorial hindi",
      "viral tags for youtube",
      "youtube algorithm hindi",
      "how to grow youtube channel fast",
      "youtube tips and tricks hindi",
      "creator studio hindi",
    ];
  } else {
    baseTags = [
      keyword,
      `${keyword} tutorial`,
      `${keyword} 2026`,
      `how to ${keyword}`,
      `best ${keyword} tips`,
      `${keyword} for beginners`,
      `${keyword} strategy`,
      "youtube algorithm",
      "content creator",
      "viral video strategy",
      "high retention editing",
      "get more views",
      "youtube seo ranking",
      "trending topic tags",
    ];
  }

  const totalVideos = 15;
  const rankedTags: TagFrequency[] = baseTags.map((t, idx) => {
    // Realistic decaying frequency
    const freq = Math.max(2, Math.round(totalVideos * Math.pow(0.88, idx)));
    return {
      tag: t,
      frequency: freq,
      totalVideos,
      percentage: Math.round((freq / totalVideos) * 100),
    };
  });

  const sourceVideos: SourceVideo[] = [
    {
      id: "dQw4w9WgXcQ",
      title: `Complete Masterclass on ${keyword} (Step-by-Step Guide)`,
      channelTitle: "Masterclass Pro",
      viewCount: 1450000,
      thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
      publishedAt: "2024-01-10T14:30:00Z",
      tagCount: 18,
    },
    {
      id: "9bZkp7q19f0",
      title: `How We Ranked #1 for "${keyword}" in 48 Hours`,
      channelTitle: "Creator Alchemy",
      viewCount: 890000,
      thumbnailUrl: "https://i.ytimg.com/vi/9bZkp7q19f0/mqdefault.jpg",
      publishedAt: "2024-02-18T10:15:00Z",
      tagCount: 14,
    },
    {
      id: "kJQP7kiw5Fk",
      title: `Top 10 Viral Secrets for ${keyword} Revealed`,
      channelTitle: "Studio Trends",
      viewCount: 620000,
      thumbnailUrl: "https://i.ytimg.com/vi/kJQP7kiw5Fk/mqdefault.jpg",
      publishedAt: "2024-04-01T08:00:00Z",
      tagCount: 16,
    },
    {
      id: "fJ9rUzIMcZQ",
      title: `The Truth About ${keyword} Nobody Tells You`,
      channelTitle: "Creator Blueprint",
      viewCount: 430000,
      thumbnailUrl: "https://i.ytimg.com/vi/fJ9rUzIMcZQ/mqdefault.jpg",
      publishedAt: "2024-05-12T16:45:00Z",
      tagCount: 12,
    },
  ];

  return {
    keyword,
    region,
    language: lang,
    totalVideosAnalyzed: totalVideos,
    totalTagsFound: rankedTags.length,
    rankedTags,
    sourceVideos,
    isCached: false,
    isDemo: true,
  };
}
