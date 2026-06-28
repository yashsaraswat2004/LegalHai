import { buildSummarizerSystemPrompt } from "./prompt";
import type { AgreementSummary } from "./types";
import {
  GEMINI_TEXT_MODEL,
  GEMINI_TEXT_MODEL_QUALITY,
  getGeminiApiKey,
  geminiGenerateUrl,
} from "./gemini.config";
import { parseModelJson } from "./parse-json";
import { parseAgreementSummary } from "./normalize-summary";
import { GEMINI_DOCUMENT_CHAR_LIMITS, formatProviderError } from "./truncate-text";
import { getLanguagePromptName } from "./languages";
import { buildAnalysisUserContent, finalizeSummaryMeta } from "./build-content";
import type { AnalyzeParams } from "./analyze-types";
import { ProviderError, isGeminiRetryable } from "./provider-errors";
import type { UserContentPart } from "./build-content";

interface GeminiAttempt {
  model: string;
  maxDocChars: number;
  maxOutputTokens: number;
}

function buildGeminiAttempts(hasImageOnly: boolean): GeminiAttempt[] {
  if (hasImageOnly) {
    return [
      { model: GEMINI_TEXT_MODEL, maxDocChars: GEMINI_DOCUMENT_CHAR_LIMITS[0], maxOutputTokens: 8192 },
      { model: GEMINI_TEXT_MODEL_QUALITY, maxDocChars: GEMINI_DOCUMENT_CHAR_LIMITS[1], maxOutputTokens: 8192 },
    ];
  }

  const attempts: GeminiAttempt[] = [];
  for (const maxDocChars of GEMINI_DOCUMENT_CHAR_LIMITS) {
    attempts.push({ model: GEMINI_TEXT_MODEL, maxDocChars, maxOutputTokens: 8192 });
  }
  attempts.push({
    model: GEMINI_TEXT_MODEL_QUALITY,
    maxDocChars: GEMINI_DOCUMENT_CHAR_LIMITS[1],
    maxOutputTokens: 8192,
  });
  return attempts;
}

function toGeminiParts(parts: UserContentPart[]) {
  return parts.map((part) => {
    if (part.type === "image" && part.base64 && part.mimeType) {
      return {
        inlineData: {
          mimeType: part.mimeType,
          data: part.base64,
        },
      };
    }
    return { text: part.text ?? "" };
  });
}

async function requestGemini(
  apiKey: string,
  model: string,
  systemPrompt: string,
  parts: UserContentPart[],
  maxOutputTokens: number,
): Promise<string> {
  const payload = JSON.stringify({
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts: toGeminiParts(parts) }],
    generationConfig: {
      temperature: 0.35,
      maxOutputTokens,
      responseMimeType: "application/json",
    },
  });

  const url = geminiGenerateUrl(model);
  const authModes: Array<{ label: string; url: string; headers: Record<string, string> }> = [
    {
      label: "header",
      url,
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    },
    {
      label: "query",
      url: `${url}?key=${encodeURIComponent(apiKey)}`,
      headers: { "Content-Type": "application/json" },
    },
  ];

  let lastError: ProviderError | null = null;

  for (const mode of authModes) {
    const response = await fetch(mode.url, {
      method: "POST",
      headers: mode.headers,
      body: payload,
    });

    const body = await response.text();

    if (response.ok) {
      let json: {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };

      try {
        json = JSON.parse(body);
      } catch {
        throw new ProviderError("Invalid response from Gemini.", {
          status: 502,
          body,
          retryable: true,
          provider: "gemini",
        });
      }

      const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
      if (!text.trim()) {
        throw new ProviderError("Empty response from Gemini.", {
          status: 502,
          body,
          retryable: true,
          provider: "gemini",
        });
      }

      return text;
    }

    const error = new ProviderError(formatProviderError(response.status, body), {
      status: response.status,
      body,
      retryable: isGeminiRetryable(response.status, body),
      provider: "gemini",
    });

    if (response.status === 401 || response.status === 403) {
      lastError = error;
      continue;
    }

    throw error;
  }

  throw lastError ?? new ProviderError(formatProviderError(401, ""), {
    status: 401,
    body: "",
    retryable: false,
    provider: "gemini",
  });
}

export async function analyzeWithGemini(params: AnalyzeParams): Promise<AgreementSummary> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new ProviderError("Gemini API key not configured.", {
      status: 401,
      body: "",
      retryable: false,
      provider: "gemini",
    });
  }

  const hasImageOnly = Boolean(
    params.imageBase64 && params.mimeType.startsWith("image/") && !params.text?.trim(),
  );
  const langName = getLanguagePromptName(params.language);
  const systemPrompt = buildSummarizerSystemPrompt(langName, params.language);
  const attempts = buildGeminiAttempts(hasImageOnly);

  let lastError: ProviderError | null = null;

  for (const attempt of attempts) {
    const { parts, prepared } = buildAnalysisUserContent(params, langName, attempt.maxDocChars);
    if (parts.length === 0) {
      throw new Error("No document content to analyze.");
    }

    try {
      const content = await requestGemini(
        apiKey,
        attempt.model,
        systemPrompt,
        parts,
        attempt.maxOutputTokens,
      );
      const parsed = parseAgreementSummary(parseModelJson(content), params.fileName);
      return finalizeSummaryMeta(parsed, params, prepared);
    } catch (err) {
      if (err instanceof ProviderError) {
        if (err.retryable) {
          lastError = err;
          continue;
        }
        throw err;
      }
      throw err;
    }
  }

  throw lastError ?? new ProviderError(formatProviderError(503, "Gemini unavailable"), {
    status: 503,
    body: "",
    retryable: true,
    provider: "gemini",
  });
}

export function hasGeminiKey(): boolean {
  return Boolean(getGeminiApiKey());
}
