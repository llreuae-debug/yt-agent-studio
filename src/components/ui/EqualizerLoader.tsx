"use client";

import React, { useEffect, useState, useMemo } from "react";

export interface EqualizerLoaderProps {
  statusMessages?: string[];
  statusTexts?: string[];
  label?: string;
}

const DEFAULT_MESSAGES = [
  "scoring hooks…",
  "linting title rules…",
  "calculating retention…",
  "synthesizing…",
];

export const EqualizerLoader: React.FC<EqualizerLoaderProps> = ({
  statusMessages,
  statusTexts,
  label = "Processing",
}) => {
  const messages = useMemo(() => {
    return statusTexts || statusMessages || DEFAULT_MESSAGES;
  }, [statusTexts, statusMessages]);

  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % messages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4 select-none">
      {/* 4 Animated Red Equalizer Bars */}
      <div className="flex items-end gap-1.5 h-8">
        <div className="w-2 rounded-full bg-yt-red eq-bar-1" />
        <div className="w-2 rounded-full bg-yt-red eq-bar-2" />
        <div className="w-2 rounded-full bg-yt-red eq-bar-3" />
        <div className="w-2 rounded-full bg-yt-red eq-bar-4" />
      </div>

      <div className="text-center">
        <span className="type-label text-yt-red font-bold block">{label}</span>
        <p className="text-xs text-txt-2 font-medium mt-1 animate-pulse">
          {messages[currentIdx]}
        </p>
      </div>
    </div>
  );
};
