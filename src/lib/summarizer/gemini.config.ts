export const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";

/**
 * Primary — fast, low cost, 1M context window.
 * Handles full agreements without aggressive truncation.
 */
export const GEMINI_TEXT_MODEL = "gemini-2.0-flash-lite";

/** Quality fallback within Gemini before switching to Groq */
export const GEMINI_TEXT_MODEL_QUALITY = "gemini-2.0-flash";

import { readServerEnv } from "@/lib/server-env";

export function getGeminiApiKey(): string | undefined {
  return readServerEnv("GEMINI_API_KEY") ?? readServerEnv("GOOGLE_API_KEY");
}

export function geminiGenerateUrl(model: string): string {
  return `${GEMINI_API_BASE}/models/${model}:generateContent`;
}
