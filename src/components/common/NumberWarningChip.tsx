"use client";

import { AlertCircle } from "lucide-react";

interface NumberWarningChipProps {
  unknownNumbers: string[];
}

export function NumberWarningChip({ unknownNumbers }: NumberWarningChipProps) {
  if (!unknownNumbers || unknownNumbers.length === 0) return null;

  return (
    <span
      className="inline-flex items-center gap-1.5 ml-2 rounded-pill border border-warn/30 bg-warn/10 px-2.5 py-0.5 text-[10px] font-bold text-warn"
      title={`Figures detected not found in input: ${unknownNumbers.join(", ")}. Verify before recording.`}
    >
      <AlertCircle className="h-3 w-3 shrink-0" />
      <span>Check number: not from input ({unknownNumbers.join(", ")})</span>
    </span>
  );
}
