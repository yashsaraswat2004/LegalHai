import { createServerFn } from "@tanstack/react-start";
import { analyzeAgreement } from "./ai.server";
import { summarizeInputSchema } from "./types";
import { requireAuth } from "@/lib/auth.functions";
import { insertDocumentAnalysis } from "@/lib/documents/store";
import { assertCanAnalyze, recordAnalysisUsage, BillingLimitError } from "@/lib/billing/entitlements";
import { BILLING_ERRORS } from "@/lib/billing/constants";

export const summarizeAgreement = createServerFn({ method: "POST" })
  .inputValidator(summarizeInputSchema)
  .handler(async ({ data }) => {
    if (!data.text?.trim() && !data.imageBase64) {
      throw new Error("Please upload a document with readable content.");
    }

    const { userId } = await requireAuth({ data: { redirectPath: "/summarize" } });

    try {
      await assertCanAnalyze(userId);
    } catch (err) {
      if (err instanceof BillingLimitError) {
        throw new Error(BILLING_ERRORS.LIMIT_REACHED);
      }
      throw err;
    }

    const result = await analyzeAgreement({
      text: data.text,
      imageBase64: data.imageBase64,
      mimeType: data.mimeType,
      fileName: data.fileName,
      language: data.language,
    });

    const analyzedAt = new Date().toISOString();

    const saveResult = await insertDocumentAnalysis(userId, {
      fileName: data.fileName,
      language: data.language,
      summary: result.summary,
      isDemo: result.isDemo,
    });

    if (!result.isDemo) {
      await recordAnalysisUsage(userId);
    }

    return {
      ...result,
      analyzedAt,
      analysisId: saveResult.id,
      saved: saveResult.saved,
      saveError: saveResult.error,
    };
  });

