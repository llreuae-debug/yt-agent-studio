"use client";

import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: "pill" | "input" | "card" | "md";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  rounded = "input",
  className = "",
  ...props
}) => {
  const roundedClass = {
    pill: "rounded-pill",
    input: "rounded-input",
    card: "rounded-card",
    md: "rounded-xl",
  }[rounded];

  return (
    <div
      className={`relative overflow-hidden bg-surface-2 ${roundedClass} ${className}`}
      {...props}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite]"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255, 0, 0, 0.08), transparent)",
        }}
      />
    </div>
  );
};
