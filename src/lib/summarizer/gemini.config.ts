export const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";

/**
 * Primary — fast, low cost, 1M context window.
 * Handles full agreements without aggressive truncation.
 */
export const GEMINI_TEXT_MODEL = "gemini-2.0-flash-lite";

/** Quality fallback within Gemini before switching to Groq */
export const GEMINI_TEXT_MODEL_QUALITY = "gemini-2.0-flash";

export function getGeminiApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY?.trim() || undefined;
}

export function geminiGenerateUrl(model: string, apiKey: string): string {
  return `${GEMINI_API_BASE}/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
}
