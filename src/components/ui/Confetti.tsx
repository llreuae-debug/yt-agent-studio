"use client";

import React, { useEffect, useState } from "react";

export interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  rotation: number;
  vr: number;
  sizeW: number;
  sizeH: number;
}

export const Confetti: React.FC<ConfettiProps> = ({ active, onComplete }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) return;

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (onComplete) onComplete();
      return;
    }

    // Trigger haptic tick
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try { navigator.vibrate(10); } catch {}
    }

    const colors = ["#FF0000", "#FF4E45", "#FFFFFF", "#E00000", "#FF8A65"];
    const count = 36;
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 4 + Math.random() * 9;
      newParticles.push({
        id: i,
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 20,
        sizeW: 8 + Math.random() * 6,
        sizeH: 4 + Math.random() * 4,
      });
    }

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
      if (onComplete) onComplete();
    }, 700);

    return () => clearTimeout(timer);
  }, [active, onComplete]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
      <style>{`
        @keyframes confettiPop {
          0% { opacity: 1; transform: translate(0, 0) rotate(0deg) scale(0.8); }
          80% { opacity: 0.9; }
          100% { opacity: 0; transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) scale(1.1); }
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            width: `${p.sizeW}px`,
            height: `${p.sizeH}px`,
            backgroundColor: p.color,
            borderRadius: "3px",
            // @ts-ignore
            "--dx": `${p.vx * 35}px`,
            "--dy": `${p.vy * 35 + 40}px`,
            "--rot": `${p.rotation + p.vr * 15}deg`,
            animation: "confettiPop 700ms cubic-bezier(0.1, 0.9, 0.2, 1) forwards",
          }}
        />
      ))}
    </div>
  );
};
