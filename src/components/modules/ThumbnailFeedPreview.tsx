"use client";

import Image from "next/image";

interface ThumbnailFeedPreviewProps {
  title?: string;
  threeWords?: string;
  imageUrl?: string;
  channelName?: string;
}

export function ThumbnailFeedPreview({
  title = "Video Title",
  threeWords = "AI RAN IT",
  imageUrl,
  channelName = "Your Channel",
}: ThumbnailFeedPreviewProps) {
  const words = (threeWords || "").trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const isTooManyWords = wordCount > 3;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="type-label font-bold text-txt">FEED SIMULATOR &amp; 3-WORD RULE</span>
        <div className="flex items-center gap-2">
          <span className="type-label text-[10px] text-txt-2">WORD COUNT:</span>
          <span
            className={`type-tabular text-xs font-bold px-2 py-0.5 rounded-pill border ${
              isTooManyWords
                ? "bg-bad/10 border-bad text-bad"
                : "bg-ok/10 border-ok text-ok"
            }`}
          >
            {wordCount}/3 words {isTooManyWords ? "• TOO LONG" : "• VALID"}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Real Mobile Feed Size (168x94px) */}
        <div className="space-y-1.5 shrink-0">
          <span className="type-label text-[10px] text-txt-2 block">168×94 REAL FEED VIEW</span>
          <div className="w-[168px] rounded-card border border-line bg-surface-2 p-2 shadow-md space-y-1.5 select-none">
            {/* Thumbnail Box */}
            <div className="relative h-[94px] w-full rounded-thumb bg-black border border-line flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Thumb"
                  fill
                  sizes="168px"
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-2 text-center">
                  <span className="text-[12px] font-black uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-tight">
                    {threeWords}
                  </span>
                </div>
              )}
              <span className="absolute bottom-1 right-1 rounded bg-black/85 px-1 py-0.2 text-[8px] font-bold text-white font-mono z-10">
                08:24
              </span>
            </div>

            {/* Video metadata */}
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-txt leading-tight line-clamp-2">
                {title}
              </p>
              <div className="flex items-center gap-1 text-[8px] text-txt-2">
                <span>{channelName}</span>
                <span>•</span>
                <span>48k views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Larger View (Zoomed Inspection) */}
        <div className="space-y-1.5 flex-1 min-w-0 w-full">
          <span className="type-label text-[10px] text-txt-2 block">ENLARGED INSPECTOR</span>
          <div className="relative aspect-video w-full rounded-card bg-black border border-line flex items-center justify-center overflow-hidden p-4 shadow-md">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Thumb"
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="text-center space-y-1">
                <span className="type-h2 font-black uppercase text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] tracking-tighter">
                  {threeWords || "NO TEXT"}
                </span>
                <span className="block text-[10px] text-white/60 font-mono">
                  {isTooManyWords ? "Exceeds 3-word rule for feed glancing" : "Clean glanceability"}
                </span>
              </div>
            )}
            <span className="absolute bottom-2 right-2 rounded-pill bg-black/85 px-2 py-0.5 text-xs font-bold text-white font-mono z-10">
              08:24
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
