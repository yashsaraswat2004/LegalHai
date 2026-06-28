import { z } from "zod";

export const riskLevelSchema = z.enum(["low", "medium", "high", "critical"]);
export type RiskLevel = z.infer<typeof riskLevelSchema>;

export const recommendationSchema = z.enum([
  "sign",
  "negotiate",
  "reject",
  "seek_lawyer",
  "not_applicable",
]);
export type Recommendation = z.infer<typeof recommendationSchema>;

export const agreementSummarySchema = z.object({
  meta: z.object({
    documentType: z.string(),
    isAgreement: z.boolean().default(true),
    confidence: z.number().min(0).max(1),
    outputLanguage: z.string(),
    wordCount: z.number(),
  }),
  verdict: z.object({
    headline: z.string(),
    summary: z.string(),
    overallRisk: riskLevelSchema,
    riskScore: z.number().min(0).max(100),
    recommendation: recommendationSchema,
    recommendationReason: z.string(),
  }),
  parties: z.array(
    z.object({
      name: z.string(),
      role: z.string(),
    }),
  ),
  keyDates: z.array(
    z.object({
      label: z.string(),
      date: z.string().nullable(),
      note: z.string().optional(),
    }),
  ),
  keyTerms: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      importance: riskLevelSchema,
    }),
  ),
  clauses: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      category: z.string(),
      originalExcerpt: z.string(),
      plainLanguage: z.string(),
      risk: riskLevelSchema,
      riskReason: z.string().optional(),
      realWorldExample: z.string(),
      whatToWatch: z.string(),
      negotiable: z.boolean(),
    }),
  ),
  redFlags: z.array(
    z.object({
      title: z.string(),
      severity: riskLevelSchema,
      explanation: z.string(),
      clauseRef: z.string().optional(),
      action: z.string(),
    }),
  ),
  obligations: z.object({
    yours: z.array(z.string()),
    theirs: z.array(z.string()),
  }),
  beforeYouSign: z.object({
    questions: z.array(z.string()),
    checklist: z.array(z.string()),
  }),
  glossary: z.array(
    z.object({
      term: z.string(),
      definition: z.string(),
    }),
  ),
});

export type AgreementSummary = z.infer<typeof agreementSummarySchema>;

export const summarizeInputSchema = z.object({
  text: z.string().optional(),
  imageBase64: z.string().optional(),
  mimeType: z.string(),
  fileName: z.string(),
  language: z.string(),
});

export type SummarizeInput = z.infer<typeof summarizeInputSchema>;

export type AnalysisPhase =
  | "idle"
  | "reading"
  | "understanding"
  | "mapping"
  | "highlighting"
  | "complete"
  | "error";

export function isSignableAgreement(summary: AgreementSummary): boolean {
  return summary.meta.isAgreement !== false && summary.verdict.recommendation !== "not_applicable";
}
