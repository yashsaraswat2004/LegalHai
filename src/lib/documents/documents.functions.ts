import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAuth } from "@/lib/auth.functions";
import {
  fetchDocumentAnalyses,
  fetchDocumentAnalysis,
  insertDocumentAnalysis,
  removeDocumentAnalysis,
  saveInputSchema,
} from "./store";

export const saveDocumentAnalysis = createServerFn({ method: "POST" })
  .inputValidator(saveInputSchema)
  .handler(async ({ data }) => {
    const { userId } = await requireAuth({ data: { redirectPath: "/summarize" } });
    return insertDocumentAnalysis(userId, data);
  });

export const listDocumentAnalyses = createServerFn().handler(async () => {
  const { userId } = await requireAuth({ data: { redirectPath: "/dashboard" } });
  return fetchDocumentAnalyses(userId);
});

export const getDocumentAnalysis = createServerFn()
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { userId } = await requireAuth({ data: { redirectPath: "/dashboard" } });
    const analysis = await fetchDocumentAnalysis(userId, data.id);
    return { analysis };
  });

export const deleteDocumentAnalysis = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { userId } = await requireAuth({ data: { redirectPath: "/dashboard" } });
    const deleted = await removeDocumentAnalysis(userId, data.id);
    return { deleted };
  });
