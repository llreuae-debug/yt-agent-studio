"use client";

import { useState } from "react";
import { Check, Send, RotateCcw, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Confetti } from "@/components/ui/Confetti";
import { Toast } from "@/components/ui/Toast";

interface GateProps {
  onShip: () => void;
  onChange: (feedback: string) => void;
  isIterating?: boolean;
  shipped?: boolean;
}

export function Gate({ onShip, onChange, isIterating, shipped }: GateProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleShipClick = () => {
    setShowConfetti(true);
    setShowToast(true);
    onShip();
  };

  const handleSubmitChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    onChange(feedback.trim());
    setFeedback("");
    setShowFeedback(false);
  };

  return (
    <>
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
      <Toast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        message="Copied. Go upload it."
        type="success"
      />

      <div className="sticky bottom-4 z-30 mt-10 rounded-card liquid-glass p-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="type-h3 text-txt font-black">
              Ship it, or change it?
            </h3>
            <p className="text-xs text-txt-2 mt-0.5">
              {shipped
                ? "Marked as shipped! Copied to clipboard."
                : "Approve to finalize & copy, or refine with prompt feedback."}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {shipped ? (
              <div className="flex items-center gap-2 rounded-pill bg-ok/10 border border-ok/30 px-5 py-2.5 text-xs font-bold text-ok">
                <CheckCircle2 className="h-4 w-4" />
                <span>Shipped to Clipboard</span>
              </div>
            ) : (
              <>
                <Button
                  variant="primary"
                  onClick={handleShipClick}
                  disabled={isIterating}
                  className="flex-1 sm:flex-none shadow-glow"
                >
                  <Check className="h-4 w-4 stroke-[3]" />
                  <span>Ship it</span>
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => setShowFeedback(!showFeedback)}
                  disabled={isIterating}
                  className="flex-1 sm:flex-none"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Change it</span>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Feedback Refinement Drawer */}
        {showFeedback && (
          <form onSubmit={handleSubmitChange} className="mt-4 border-t border-line/60 pt-4">
            <label className="type-label text-txt block mb-1.5 font-bold">
              What should change?
            </label>
            <div className="flex gap-2.5">
              <input
                type="text"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="e.g. Make the hook more contrarian, cut 2 beats from the middle, tighten the payoff..."
                className="flex-1 rounded-input bg-surface-2 border border-line px-4 py-2.5 text-xs text-txt placeholder:text-txt-2/60 focus:outline-none focus:border-yt-red focus:ring-2 focus:ring-yt-red/20 transition-all"
                autoFocus
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isIterating || !feedback.trim()}
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isIterating ? "Updating..." : "Re-run"}</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
