"use client";

import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  haptic?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", haptic = true, className = "", children, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (haptic && typeof window !== "undefined" && "vibrate" in navigator) {
        try { navigator.vibrate(10); } catch {}
      }
      if (onClick) onClick(e);
    };

    const sizeClasses = {
      sm: "px-3.5 py-1.5 text-xs h-8",
      md: "px-5 py-2.5 text-sm h-11",
      lg: "px-7 py-3.5 text-base h-13",
    }[size];

    let variantClasses = "";
    if (variant === "primary") {
      variantClasses = "bg-grad-hot text-white font-bold hover:shadow-glow hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200 border-none";
    } else if (variant === "secondary") {
      variantClasses = "bg-surface-3 text-txt hover:bg-line active:scale-[0.98] transition-all duration-200 border border-line";
    } else if (variant === "ghost") {
      variantClasses = "bg-transparent text-txt hover:text-yt-red transition-colors relative after:absolute after:bottom-1 after:left-4 after:right-4 after:h-[1px] after:bg-yt-red after:scale-x-0 hover:after:scale-x-100 after:transition-transform";
    } else if (variant === "danger") {
      variantClasses = "bg-bad text-white font-bold hover:brightness-110 active:scale-[0.97] transition-all duration-200";
    }

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-2 rounded-pill font-medium select-none disabled:opacity-40 disabled:pointer-events-none cursor-pointer ${sizeClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
