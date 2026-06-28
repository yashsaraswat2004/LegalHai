import { buildSummarizerSystemPrompt } from "./prompt";
import type { AgreementSummary } from "./types";
import {
  getGroqApiKey,
  GROQ_API_URL,
  GROQ_TEXT_MODEL,
  GROQ_TEXT_MODEL_FAST,
  GROQ_VISION_MODEL,
} from "./groq.config";
import { parseModelJson } from "./parse-json";
import { parseAgreementSummary } from "./normalize-summary";
import { GROQ_DOCUMENT_CHAR_LIMITS, formatProviderError } from "./truncate-text";
import { getLanguagePromptName } from "./languages";
import { buildAnalysisUserContent, finalizeSummaryMeta } from "./build-content";
import type { AnalyzeParams } from "./analyze-types";
import { ProviderError, isGroqRetryable } from "./provider-errors";
import type { UserContentPart } from "./build-content";

interface GroqAttempt {
  model: string;
  maxDocChars: number;
  maxTokens: number;
}

function buildGroqAttempts(hasImageOnly: boolean): GroqAttempt[] {
  if (hasImageOnly) {
    return [{ model: GROQ_VISION_MODEL, maxDocChars: GROQ_DOCUMENT_CHAR_LIMITS[0], maxTokens: 2048 }];
  }

  const attempts: GroqAttempt[] = [];
  for (const maxDocChars of GROQ_DOCUMENT_CHAR_LIMITS) {
    attempts.push({ model: GROQ_TEXT_MODEL, maxDocChars, maxTokens: 2048 });
  }
  for (const maxDocChars of GROQ_DOCUMENT_CHAR_LIMITS) {
    attempts.push({ model: GROQ_TEXT_MODEL_FAST, maxDocChars, maxTokens: 2048 });
  }
  return attempts;
}

function toGroqUserContent(parts: UserContentPart[]) {
  return parts.map((part) => {
    if (part.type === "image" && part.base64 && part.mimeType) {
      return {
        type: "image_url",
        image_url: { url: `data:${part.mimeType};base64,${part.base64}` },
      };
    }
    return { type: "text", text: part.text ?? "" };
  });
}

async function requestGroq(
  apiKey: string,
  model: string,
  systemPrompt: string,
  parts: UserContentPart[],
  maxTokens: number,
): Promise<string> {
  const userContent = toGroqUserContent(parts);
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: userContent.length === 1 && userContent[0].type === "text" ? userContent[0].text : userContent,
        },
      ],
    }),
  });

  const body = await response.text();

  if (!response.ok) {
    throw new ProviderError(formatProviderError(response.status, body), {
      status: response.status,
      body,
      retryable: isGroqRetryable(response.status, body),
      provider: "groq",
    });
  }

  const json = JSON.parse(body) as { choices?: Array<{ message?: { content?: string } }> };
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new ProviderError("Empty response from Groq.", {
      status: 502,
      body,
      retryable: true,
      provider: "groq",
    });
  }

  return content;
}

export async function analyzeWithGroq(params: AnalyzeParams): Promise<AgreementSummary> {
  const apiKey = getGroqApiKey();
  if (!apiKey) {
    throw new ProviderError("Groq API key not configured.", {
      status: 401,
      body: "",
      retryable: false,
      provider: "groq",
    });
  }

  const hasImageOnly = Boolean(
    params.imageBase64 && params.mimeType.startsWith("image/") && !params.text?.trim(),
  );
  const langName = getLanguagePromptName(params.language);
  const systemPrompt = buildSummarizerSystemPrompt(langName, params.language);
  const attempts = buildGroqAttempts(hasImageOnly);

  let lastError: ProviderError | null = null;

  for (const attempt of attempts) {
    const { parts, prepared } = buildAnalysisUserContent(params, langName, attempt.maxDocChars);
    if (parts.length === 0) {
      throw new Error("No document content to analyze.");
    }

    try {
      const content = await requestGroq(apiKey, attempt.model, systemPrompt, parts, attempt.maxTokens);
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

  throw lastError ?? new ProviderError(formatProviderError(413, "request too large"), {
    status: 413,
    body: "",
    retryable: false,
    provider: "groq",
  });
}

export function hasGroqKey(): boolean {
  return Boolean(getGroqApiKey());
}
