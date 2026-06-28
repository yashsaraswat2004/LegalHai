import type { AgreementSummary } from "@/lib/summarizer/types";

export interface SavedAnalysis {
  id: string;
  clerkUserId: string;
  fileName: string;
  language: string;
  summary: AgreementSummary;
  isDemo: boolean;
  createdAt: string;
}

export interface AnalysisListItem {
  id: string;
  fileName: string;
  language: string;
  documentType: string;
  overallRisk: string;
  recommendation: string;
  isDemo: boolean;
  createdAt: string;
}
