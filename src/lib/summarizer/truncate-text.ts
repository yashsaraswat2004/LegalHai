/** Groq on_demand tier ~12k TPM */
export const GROQ_DOCUMENT_CHAR_LIMITS = [7_000, 4_500, 3_000] as const;

/** Gemini Flash-Lite — 1M token context; generous limits with smart head/tail trim */
export const GEMINI_DOCUMENT_CHAR_LIMITS = [120_000, 80_000, 50_000] as const;

/** @deprecated use GROQ_DOCUMENT_CHAR_LIMITS */
export const DOCUMENT_CHAR_LIMITS = GROQ_DOCUMENT_CHAR_LIMITS;

const HEAD_RATIO = 0.62;
const TAIL_RATIO = 0.33;

export interface PreparedDocument {
  text: string;
  truncated: boolean;
  originalCharCount: number;
  maxChars: number;
}

export function prepareDocumentText(
  raw: string,
  maxChars: number = GROQ_DOCUMENT_CHAR_LIMITS[0],
): PreparedDocument {
  const text = raw.trim();
  const originalCharCount = text.length;

  if (originalCharCount <= maxChars) {
    return { text, truncated: false, originalCharCount, maxChars };
  }

  const separator = `\n\n[··· middle section omitted — analyze using the excerpts below ···]\n\n`;
  const budget = maxChars - separator.length;
  const headLen = Math.floor(budget * HEAD_RATIO);
  const tailLen = budget - headLen;

  const prepared = `${text.slice(0, headLen)}${separator}${text.slice(-tailLen)}`;

  return { text: prepared, truncated: true, originalCharCount, maxChars };
}

export function isTokenLimitError(status: number, body: string): boolean {
  const lower = body.toLowerCase();
  return (
    status === 413 ||
    lower.includes("request too large") ||
    lower.includes("tokens per minute") ||
    lower.includes("tpm") ||
    lower.includes("context length") ||
    lower.includes("too many tokens") ||
    lower.includes("token count") ||
    lower.includes("exceeds the maximum") ||
    lower.includes("input token")
  );
}

/** @deprecated */
export const isGroqTokenLimitError = isTokenLimitError;

export function formatProviderError(status: number, body: string): string {
  const lower = body.toLowerCase();

  if (isTokenLimitError(status, body)) {
    return "This document is too long to analyze in one go. Try uploading fewer pages, a smaller PDF, or the most important pages only.";
  }

  if (status === 429 || lower.includes("rate limit") || lower.includes("resource_exhausted")) {
    return "We're getting a lot of requests right now. Please wait a moment and try again.";
  }

  if (status === 401 || status === 403) {
    return "Analysis service authentication failed. Please contact support.";
  }

  try {
    const json = JSON.parse(body) as { error?: { message?: string } };
    if (json.error?.message) {
      return json.error.message.length < 200
        ? json.error.message
        : "Analysis failed. Please try a shorter document.";
    }
  } catch {
    // not JSON
  }

  return "Analysis failed. Please try again with a shorter document.";
}

/** @deprecated */
export const formatGroqError = formatProviderError;
