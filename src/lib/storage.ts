export interface VoiceProfile {
  targetAudience: string;
  howITalk: string;
  wordsNeverUse: string;
  wordsDoUse: string;
  wontClaim: string;
  format: string;
  updatedAt?: string;
}

export interface HistoryRun {
  id: string;
  module: string;
  timestamp: string;
  inputSummary: string;
  inputData: any;
  outputData: any;
  status: "draft" | "shipped" | "iterated";
  feedbackHistory?: string[];
}

const VOICE_KEY = "yt_agent_studio_voice_profile";
const HISTORY_KEY = "yt_agent_studio_history";

export const DEFAULT_VOICE_PROFILE: VoiceProfile = {
  targetAudience: "",
  howITalk: "",
  wordsNeverUse: "",
  wordsDoUse: "",
  wontClaim: "",
  format: "",
};

export function getVoiceProfile(): VoiceProfile {
  if (typeof window === "undefined") return DEFAULT_VOICE_PROFILE;
  try {
    const raw = localStorage.getItem(VOICE_KEY);
    if (!raw) return DEFAULT_VOICE_PROFILE;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_VOICE_PROFILE;
  }
}

export function saveVoiceProfile(profile: VoiceProfile): void {
  if (typeof window === "undefined") return;
  const toSave = { ...profile, updatedAt: new Date().toISOString() };
  localStorage.setItem(VOICE_KEY, JSON.stringify(toSave));
}

export function isVoiceProfileEmpty(profile: VoiceProfile): boolean {
  return !(
    profile.targetAudience.trim() ||
    profile.howITalk.trim() ||
    profile.wordsNeverUse.trim() ||
    profile.wordsDoUse.trim() ||
    profile.wontClaim.trim() ||
    profile.format.trim()
  );
}

export function getHistory(): HistoryRun[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getModuleHistory(moduleName: string): HistoryRun[] {
  const all = getHistory();
  return all.filter(r => r.module === moduleName);
}

export function saveHistoryRun(run: HistoryRun): void {
  if (typeof window === "undefined") return;
  const all = getHistory();
  const existingIdx = all.findIndex(r => r.id === run.id);
  if (existingIdx !== -1) {
    all[existingIdx] = run;
  } else {
    all.unshift(run);
  }
  localStorage.setItem(HISTORY_KEY, JSON.stringify(all.slice(0, 100)));
}

export function deleteHistoryRun(id: string): void {
  if (typeof window === "undefined") return;
  const all = getHistory().filter(r => r.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(all));
}

export function clearModuleHistory(moduleName: string): void {
  if (typeof window === "undefined") return;
  const all = getHistory().filter(r => r.module !== moduleName);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(all));
}

export function exportAllDataAsJson(): string {
  const data = {
    version: "1.0",
    exportedAt: new Date().toISOString(),
    voiceProfile: getVoiceProfile(),
    history: getHistory(),
  };
  return JSON.stringify(data, null, 2);
}

export function importAllDataFromJson(jsonStr: string): { success: boolean; error?: string } {
  try {
    const data = JSON.parse(jsonStr);
    if (data.voiceProfile) {
      saveVoiceProfile(data.voiceProfile);
    }
    if (Array.isArray(data.history)) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(data.history));
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to parse JSON" };
  }
}

export function voiceProfileToMarkdown(profile: VoiceProfile): string {
  return `# voice.md

## Who I am talking to

${profile.targetAudience.trim() || "_Not specified_"}

## How I actually talk

${profile.howITalk.trim() || "_Not specified_"}

## Words I never use

${profile.wordsNeverUse.trim() || "_Not specified_"}

## Words I do use

${profile.wordsDoUse.trim() || "_Not specified_"}

## What I will not claim

${profile.wontClaim.trim() || "_Not specified_"}

## My format

${profile.format.trim() || "_Not specified_"}
`;
}

export function parseMarkdownToVoiceProfile(md: string): Partial<VoiceProfile> {
  const sections: Partial<VoiceProfile> = {};
  const lines = md.split(/\r?\n/);
  let currentKey: keyof VoiceProfile | null = null;
  const buffers: Record<string, string[]> = {};

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+)$/);
    if (headingMatch) {
      const heading = headingMatch[1].trim().toLowerCase();
      if (heading.includes("who")) currentKey = "targetAudience";
      else if (heading.includes("how i actually talk") || heading.includes("how i talk")) currentKey = "howITalk";
      else if (heading.includes("never use")) currentKey = "wordsNeverUse";
      else if (heading.includes("do use")) currentKey = "wordsDoUse";
      else if (heading.includes("not claim")) currentKey = "wontClaim";
      else if (heading.includes("format")) currentKey = "format";
      else currentKey = null;

      if (currentKey) buffers[currentKey] = [];
    } else if (currentKey) {
      buffers[currentKey].push(line);
    }
  }

  for (const [k, v] of Object.entries(buffers)) {
    (sections as any)[k] = v.join("\n").trim();
  }

  return sections;
}

export function downloadFile(filename: string, content: string, mimeType: string = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
