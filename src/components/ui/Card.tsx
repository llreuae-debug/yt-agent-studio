"use client";

import React, { useRef, useState } from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  enableTilt?: boolean;
  enableGlow?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ enableTilt = true, enableGlow = true, className = "", children, ...props }, forwardedRef) => {
    const cardRef = useRef<HTMLDivElement | null>(null);
    const [mousePos, setMousePos] = useState({ x: -100, y: -100, isHovered: false });
    const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePos({ x, y, isHovered: true });

      if (enableTilt) {
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const dx = (x - cx) / cx;
        const dy = (y - cy) / cy;
        // Max 4 degrees tilt
        setTilt({ rx: -dy * 3.5, ry: dx * 3.5 });
      }
    };

    const handleMouseLeave = () => {
      setMousePos(prev => ({ ...prev, isHovered: false }));
      setTilt({ rx: 0, ry: 0 });
    };

    return (
      <div
        ref={(node) => {
          cardRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: tilt.rx !== 0 || tilt.ry !== 0
            ? `perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`
            : undefined,
          transition: mousePos.isHovered ? "none" : "transform 0.4s var(--ease-out)",
        }}
        className={`relative overflow-hidden rounded-card bg-surface-1 border border-line p-6 shadow-sm ${className}`}
        {...props}
      >
        {/* Dynamic pointer glow */}
        {enableGlow && mousePos.isHovered && (
          <div
            className="pointer-events-none absolute -inset-px transition-opacity duration-300"
            style={{
              background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 0, 0, 0.08), transparent 80%)`,
            }}
          />
        )}
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);
Card.displayName = "Card";
