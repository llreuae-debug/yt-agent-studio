"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "success",
  isOpen,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [isOpen, onClose, duration]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto animate-bounce-short">
      <div className="liquid-glass rounded-pill px-5 py-3 shadow-2xl flex items-center gap-2.5 text-sm font-bold text-txt border border-line">
        {type === "success" && <CheckCircle2 className="w-4 h-4 text-ok shrink-0" />}
        {type === "error" && <AlertCircle className="w-4 h-4 text-bad shrink-0" />}
        <span>{message}</span>
      </div>
    </div>
  );
};
