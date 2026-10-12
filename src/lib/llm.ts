import { z } from "zod";

export interface LlmCallOptions<T> {
  systemPrompt: string;
  userPrompt: string;
  schema: z.ZodSchema<T>;
  maxTokens?: number;
  temperature?: number;
}

export async function callLlmStructured<T>(options: LlmCallOptions<T>): Promise<T> {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();

  // Attempt 1
  try {
    const rawJson = await executeLlmCall(provider, options.systemPrompt, options.userPrompt, options.maxTokens, options.temperature);
    const parsed = JSON.parse(cleanJsonString(rawJson));
    return options.schema.parse(parsed);
  } catch (err1: any) {
    console.warn(`[LLM Attempt 1 Failed]: ${err1.message}. Retrying once with error feedback...`);
    // Retry once with error guidance
    const retryUserPrompt = `${options.userPrompt}\n\n[CRITICAL NOTE]: Your previous output failed JSON validation with this error: ${err1.message}. Output ONLY valid JSON matching the requested structure.`;
    try {
      const rawJsonRetry = await executeLlmCall(provider, options.systemPrompt, retryUserPrompt, options.maxTokens, options.temperature);
      const parsedRetry = JSON.parse(cleanJsonString(rawJsonRetry));
      return options.schema.parse(parsedRetry);
    } catch (err2: any) {
      throw new Error(`LLM call failed after retry: ${err2.message}`);
    }
  }
}

async function executeLlmCall(
  provider: string,
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 4000,
  temperature: number = 0.7
): Promise<string> {
  if (provider === "anthropic") {
    return callAnthropic(systemPrompt, userPrompt, maxTokens, temperature);
  } else {
    return callGemini(systemPrompt, userPrompt, maxTokens, temperature);
  }
}

async function callGemini(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number,
  temperature: number
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
  }

  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-pro";

  try {
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemPrompt}\n\n---\n\n${userPrompt}` }],
        },
      ],
      config: {
        responseMimeType: "application/json",
        temperature,
        maxOutputTokens: maxTokens,
      },
    });

    const text = response.text || "";
    if (!text) {
      throw new Error("Gemini returned empty response text.");
    }
    return text;
  } catch (err: any) {
    // If modern @google/genai interface fails or differences occur, try fallback REST endpoint
    if (err.message?.includes("is not set") || err.message?.includes("fetch")) {
      throw err;
    }
    throw new Error(`Gemini API error: ${err.message}`);
  }
}

async function callAnthropic(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number,
  temperature: number
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set in environment variables.");
  }

  const modelName = process.env.ANTHROPIC_MODEL || "claude-3-7-sonnet-20250219";

  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const anthropic = new Anthropic({ apiKey });

  const response = await anthropic.messages.create({
    model: modelName,
    max_tokens: maxTokens,
    temperature,
    system: `${systemPrompt}\nYou must output pure, valid JSON with NO backticks and NO markdown wrappers.`,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  const contentBlock = response.content[0];
  if (contentBlock.type !== "text") {
    throw new Error("Anthropic returned non-text content.");
  }
  return contentBlock.text;
}

function cleanJsonString(str: string): string {
  let cleaned = str.trim();
  // Strip ```json and ``` if present
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
}
