export function extractNumbers(text: string): Set<string> {
  const set = new Set<string>();
  if (!text) return set;
  // Match digits with optional decimals or percent
  const matches = text.match(/\b\d+(?:[.,]\d+)?%?\b/g) || [];
  for (const m of matches) {
    const clean = m.replace(/%/g, "").trim();
    if (clean) {
      set.add(clean);
      // also add integer part if decimal
      if (clean.includes(".")) {
        const intPart = clean.split(".")[0];
        if (intPart) set.add(intPart);
      }
    }
  }
  return set;
}

export interface LineNumberAudit {
  line: string;
  hasWarning: boolean;
  unknownNumbers: string[];
}

export function auditNumbersInText(
  aiOutput: string,
  userInputs: string[],
  toolOutputs: string[] = []
): LineNumberAudit[] {
  const knownNumbers = new Set<string>();

  // Add numbers from inputs and deterministic tools
  for (const src of [...userInputs, ...toolOutputs]) {
    for (const num of Array.from(extractNumbers(src))) {
      knownNumbers.add(num);
    }
  }

  // Always permit standard step markers, small integers 0-5, and common timing references
  const benignCommon = new Set(["0", "1", "2", "3", "4", "5", "10", "15", "30", "45", "60"]);
  for (const b of Array.from(benignCommon)) {
    knownNumbers.add(b);
  }

  const lines = aiOutput.split(/\r?\n/);
  return lines.map(line => {
    const lineNums = extractNumbers(line);
    const unknown: string[] = [];
    for (const num of Array.from(lineNums)) {
      if (!knownNumbers.has(num)) {
        unknown.push(num);
      }
    }
    return {
      line,
      hasWarning: unknown.length > 0,
      unknownNumbers: unknown,
    };
  });
}
