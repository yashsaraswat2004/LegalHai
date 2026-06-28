import type { AgreementSummary } from "./types";
import type { AnalyzeParams } from "./analyze-types";
import { prepareDocumentText, type PreparedDocument } from "./truncate-text";

export interface UserContentPart {
  type: "text" | "image";
  text?: string;
  mimeType?: string;
  base64?: string;
}

export function buildAnalysisUserContent(
  params: AnalyzeParams,
  langName: string,
  maxDocChars: number,
): { parts: UserContentPart[]; prepared: PreparedDocument | null } {
  const parts: UserContentPart[] = [];
  const hasImage = Boolean(params.imageBase64 && params.mimeType.startsWith("image/"));
  const prepared = params.text?.trim() ? prepareDocumentText(params.text, maxDocChars) : null;

  if (prepared?.text) {
    const truncNote = prepared.truncated
      ? ` Document shortened from ${prepared.originalCharCount} chars — focus on key clauses shown.`
      : "";
    parts.push({
      type: "text",
      text: `Document: "${params.fileName}". Is this a signable agreement? If not (resume, invoice, ID), set isAgreement:false and recommendation:"not_applicable". Explain in ${langName}.${truncNote}\n\n---\n${prepared.text}\n---`,
    });
  }

  if (hasImage && params.imageBase64) {
    if (!params.text?.trim()) {
      parts.unshift({
        type: "text",
        text: `Photo/scan of "${params.fileName}". Read all visible text, explain in ${langName}.`,
      });
    }
    parts.push({
      type: "image",
      mimeType: params.mimeType,
      base64: params.imageBase64,
    });
  }

  return { parts, prepared };
}

export function finalizeSummaryMeta(
  summary: AgreementSummary,
  params: AnalyzeParams,
  prepared: PreparedDocument | null,
): AgreementSummary {
  return {
    ...summary,
    meta: {
      ...summary.meta,
      outputLanguage: params.language,
      wordCount: params.text?.split(/\s+/).filter(Boolean).length ?? summary.meta.wordCount,
      confidence: prepared?.truncated
        ? Math.min(summary.meta.confidence, 0.88)
        : summary.meta.confidence,
    },
  };
}
