export const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/** Text analysis — strong reasoning + natural language */
export const GROQ_TEXT_MODEL = "llama-3.3-70b-versatile";

/** Fallback when 70b hits TPM limits — higher throughput on free tier */
export const GROQ_TEXT_MODEL_FAST = "llama-3.1-8b-instant";

/** Image / scan OCR */
export const GROQ_VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

export function getGroqApiKey(): string | undefined {
  return process.env.GROQ_API_KEY?.trim() || undefined;
}
