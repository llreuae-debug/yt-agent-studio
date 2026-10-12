"use client";

import { HookScoreResult } from "@/lib/tools/hookscore";
import { ScorePanel, PropertyScore } from "@/components/ui/ScorePanel";

interface HookScorePanelProps {
  scoreResult: HookScoreResult;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function HookScorePanel({ scoreResult, isSelected, onSelect }: HookScorePanelProps) {
  const { hook, properties, verdict, band, formula, weakest } = scoreResult;

  const propertyList: PropertyScore[] = (
    Object.entries(properties) as [string, number][]
  ).map(([name, score]) => ({
    name,
    score,
    isWeakest: name === weakest.property,
  }));

  return (
    <ScorePanel
      hookText={hook}
      formula={formula}
      verdict={verdict}
      band={band}
      properties={propertyList}
      weakestFix={weakest.fix}
      isSelected={isSelected}
      onSelect={onSelect}
    />
  );
}
