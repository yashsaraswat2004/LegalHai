import type { AgreementSummary } from "./types";
import { getDemoSummary } from "./demo-summary";
import type { AnalyzeParams } from "./analyze-types";
import { analyzeWithGemini, hasGeminiKey } from "./gemini.provider";
import { analyzeWithGroq, hasGroqKey } from "./groq.provider";
import { isProviderError, shouldFallbackToNextProvider } from "./provider-errors";

export type { AnalyzeParams } from "./analyze-types";

type Provider = "groq" | "gemini";

function buildProviderChain(): Provider[] {
  const chain: Provider[] = [];
  // Groq (gsk_) is reliable in production; Gemini AQ keys often 401 on Workers.
  if (hasGroqKey()) chain.push("groq");
  if (hasGeminiKey()) chain.push("gemini");
  return chain;
}

export async function analyzeAgreement(params: AnalyzeParams): Promise<{
  summary: AgreementSummary;
  isDemo: boolean;
}> {
  const chain = buildProviderChain();

  if (chain.length === 0) {
    await new Promise((r) => setTimeout(r, 1800));
    return { summary: getDemoSummary(params.language, params.fileName), isDemo: true };
  }

  let lastError: unknown;

  for (let i = 0; i < chain.length; i++) {
    const provider = chain[i]!;
    const hasFallback = i < chain.length - 1;

    try {
      const summary =
        provider === "groq" ? await analyzeWithGroq(params) : await analyzeWithGemini(params);
      return { summary, isDemo: false };
    } catch (err) {
      lastError = err;
      if (hasFallback && shouldFallbackToNextProvider(err)) {
        console.warn(
          `[LegalHai] ${provider} failed, trying ${chain[i + 1]}:`,
          err instanceof Error ? err.message : err,
          isProviderError(err) ? { status: err.status, provider: err.provider } : undefined,
        );
        continue;
      }
      throw err;
    }
  }

  throw lastError ?? new Error("Analysis failed.");
}
