import type { AgreementSummary } from "./types";
import { getDemoSummary } from "./demo-summary";
import type { AnalyzeParams } from "./analyze-types";
import { analyzeWithGemini, hasGeminiKey } from "./gemini.provider";
import { analyzeWithGroq, hasGroqKey } from "./groq.provider";
import { shouldFallbackToNextProvider } from "./provider-errors";

export type { AnalyzeParams } from "./analyze-types";

export async function analyzeAgreement(params: AnalyzeParams): Promise<{
  summary: AgreementSummary;
  isDemo: boolean;
}> {
  const hasGemini = hasGeminiKey();
  const hasGroq = hasGroqKey();

  if (!hasGemini && !hasGroq) {
    await new Promise((r) => setTimeout(r, 1800));
    return { summary: getDemoSummary(params.language, params.fileName), isDemo: true };
  }

  if (hasGemini) {
    try {
      const summary = await analyzeWithGemini(params);
      return { summary, isDemo: false };
    } catch (err) {
      if (hasGroq && shouldFallbackToNextProvider(err)) {
        console.warn("[LegalHai] Gemini unavailable, falling back to Groq:", err instanceof Error ? err.message : err);
      } else {
        throw err;
      }
    }
  }

  const summary = await analyzeWithGroq(params);
  return { summary, isDemo: false };
}
