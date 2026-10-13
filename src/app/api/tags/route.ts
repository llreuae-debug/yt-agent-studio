import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limiter";
import { extractVideoId } from "@/lib/youtube-utils";
import { fetchVideoTags, fetchKeywordTags } from "@/lib/services/youtube";

export const runtime = "nodejs";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "127.0.0.1";
}

export async function GET(req: NextRequest) {
  return handleRequest(req);
}

export async function POST(req: NextRequest) {
  return handleRequest(req);
}

async function handleRequest(req: NextRequest) {
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(ip, 40, 60_000); // 40 requests per minute

  if (!rateLimit.success) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded. Please wait a minute before making more requests.",
        retryAfterMs: rateLimit.resetMs,
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(rateLimit.resetMs / 1000).toString(),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // Parse query parameters or JSON body
  let type: string | null = null;
  let videoInput: string | null = null;
  let keyword: string | null = null;
  let region: string = "";
  let lang: string = "";

  if (req.method === "POST") {
    try {
      const body = await req.json();
      type = body.type || null;
      videoInput = body.url || body.id || body.videoId || null;
      keyword = body.keyword || body.q || null;
      region = body.region || body.regionCode || "";
      lang = body.lang || body.relevanceLanguage || "";
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }
  } else {
    const { searchParams } = new URL(req.url);
    type = searchParams.get("type");
    videoInput = searchParams.get("id") || searchParams.get("url") || searchParams.get("videoId");
    keyword = searchParams.get("q") || searchParams.get("keyword");
    region = searchParams.get("region") || searchParams.get("regionCode") || "";
    lang = searchParams.get("lang") || searchParams.get("relevanceLanguage") || "";
  }

  try {
    // 1. VIDEO TAGS EXTRACTION
    if (type === "video" || (!type && videoInput)) {
      if (!videoInput) {
        return NextResponse.json(
          { error: "Missing video URL or video ID." },
          { status: 400 }
        );
      }

      const videoId = extractVideoId(videoInput);
      if (!videoId) {
        return NextResponse.json(
          { error: "Invalid YouTube URL or Video ID. Please provide a valid watch link, shorts, youtu.be, or 11-character ID." },
          { status: 400 }
        );
      }

      const data = await fetchVideoTags(videoId);
      return NextResponse.json(
        { success: true, data },
        {
          status: 200,
          headers: {
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          },
        }
      );
    }

    // 2. KEYWORD TAGS RESEARCH
    if (type === "keyword" || (!type && keyword)) {
      if (!keyword || !keyword.trim()) {
        return NextResponse.json(
          { error: "Missing search keyword." },
          { status: 400 }
        );
      }

      const data = await fetchKeywordTags(keyword.trim(), {
        regionCode: region.trim() || undefined,
        relevanceLanguage: lang.trim() || undefined,
        maxResults: 15,
      });

      return NextResponse.json(
        { success: true, data },
        {
          status: 200,
          headers: {
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          },
        }
      );
    }

    return NextResponse.json(
      { error: "Invalid query. Please specify type='video' with a URL/ID, or type='keyword' with a query." },
      { status: 400 }
    );
  } catch (err: unknown) {
    console.error("Tags API Error:", err);
    const msg = err instanceof Error ? err.message : "Internal server error occurred while processing tags.";
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
