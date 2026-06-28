import { z } from "zod";
import { getSupabaseServer } from "@/lib/supabase.server";
import { agreementSummarySchema } from "@/lib/summarizer/types";
import type { AgreementSummary } from "@/lib/summarizer/types";
import type { AnalysisListItem, SavedAnalysis } from "./types";

export const saveInputSchema = z.object({
  fileName: z.string(),
  language: z.string(),
  summary: agreementSummarySchema,
  isDemo: z.boolean(),
});

export type SaveAnalysisInput = z.infer<typeof saveInputSchema>;

function rowToListItem(row: {
  id: string;
  file_name: string;
  language: string;
  summary: unknown;
  is_demo: boolean;
  created_at: string;
}): AnalysisListItem {
  const summary = row.summary as {
    meta?: { documentType?: string };
    verdict?: { overallRisk?: string; recommendation?: string };
  };
  return {
    id: row.id,
    fileName: row.file_name,
    language: row.language,
    documentType: summary.meta?.documentType ?? "Document",
    overallRisk: summary.verdict?.overallRisk ?? "medium",
    recommendation: summary.verdict?.recommendation ?? "seek_lawyer",
    isDemo: row.is_demo,
    createdAt: row.created_at,
  };
}

export async function insertDocumentAnalysis(
  userId: string,
  data: SaveAnalysisInput,
): Promise<{ id: string | null; saved: boolean; error?: string }> {
  const supabase = getSupabaseServer();
  if (!supabase) {
    return { id: null, saved: false, error: "Supabase not configured on server." };
  }

  const { data: row, error } = await supabase
    .from("document_analyses")
    .insert({
      clerk_user_id: userId,
      file_name: data.fileName,
      language: data.language,
      summary: data.summary,
      is_demo: data.isDemo,
    })
    .select("id")
    .single();

  if (error) {
    const message = `${error.message}${error.code ? ` (${error.code})` : ""}`;
    console.error("Failed to save analysis:", message, { userId, fileName: data.fileName });
    return {
      id: null,
      saved: false,
      error:
        error.code === "42501" || error.message.includes("row-level security")
          ? "Database permissions blocked the save. Run supabase/fix-rls.sql in Supabase SQL Editor, or add SUPABASE_SECRET_KEY to .env."
          : message,
    };
  }

  return { id: row.id as string, saved: true };
}

export async function fetchDocumentAnalyses(userId: string): Promise<{
  items: AnalysisListItem[];
  storageEnabled: boolean;
  tableExists: boolean;
}> {
  const supabase = getSupabaseServer();
  if (!supabase) return { items: [], storageEnabled: false, tableExists: false };

  const { data, error } = await supabase
    .from("document_analyses")
    .select("id, file_name, language, summary, is_demo, created_at")
    .eq("clerk_user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    const missingTable =
      error.code === "PGRST205" ||
      error.message.includes("Could not find the table") ||
      error.message.includes("schema cache");

    if (missingTable) {
      console.warn("document_analyses table missing — run supabase/setup.sql in Supabase SQL Editor");
      return { items: [], storageEnabled: true, tableExists: false };
    }

    console.error("Failed to list analyses:", error.message);
    return { items: [], storageEnabled: true, tableExists: true };
  }

  return {
    items: (data ?? []).map(rowToListItem),
    storageEnabled: true,
    tableExists: true,
  };
}

export async function fetchDocumentAnalysis(
  userId: string,
  id: string,
): Promise<SavedAnalysis | null> {
  const supabase = getSupabaseServer();
  if (!supabase) return null;

  const { data: row, error } = await supabase
    .from("document_analyses")
    .select("*")
    .eq("id", id)
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (error || !row) return null;

  const parsed = agreementSummarySchema.safeParse(row.summary);
  if (!parsed.success) return null;

  return {
    id: row.id,
    clerkUserId: row.clerk_user_id,
    fileName: row.file_name,
    language: row.language,
    summary: parsed.data,
    isDemo: row.is_demo,
    createdAt: row.created_at,
  };
}

export async function removeDocumentAnalysis(userId: string, id: string): Promise<boolean> {
  const supabase = getSupabaseServer();
  if (!supabase) return false;

  const { error } = await supabase
    .from("document_analyses")
    .delete()
    .eq("id", id)
    .eq("clerk_user_id", userId);

  return !error;
}
