import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { requireAuth } from "@/lib/auth.functions";
import { getDocumentAnalysis } from "@/lib/documents/documents.functions";
import { AppNav } from "@/components/app/AppNav";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { SummaryReport } from "@/components/summarizer/SummaryReport";
import { NonAgreementReport } from "@/components/summarizer/NonAgreementReport";
import { isSignableAgreement } from "@/lib/summarizer/types";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/dashboard/$analysisId")({
  component: AnalysisDetailPage,
  beforeLoad: async () => requireAuth({ data: { redirectPath: "/dashboard" } }),
  loader: async ({ params }) => getDocumentAnalysis({ data: { id: params.analysisId } }),
  head: () => ({
    meta: [{ title: `Document report — ${BRAND.name}` }],
  }),
});

function AnalysisDetailPage() {
  const { analysis } = Route.useLoaderData();

  if (!analysis) {
    return (
      <div className="relative min-h-screen bg-background text-foreground grain">
        <AppNav active="dashboard" />
        <main className="relative pt-28 pb-16 px-6 text-center">
          <AuthGuard>
            <p className="text-muted-foreground mb-6">This document wasn&apos;t found.</p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-signal text-ink px-6 py-3 text-sm font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to documents
            </Link>
          </AuthGuard>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground grain">
      <AppNav active="dashboard" />

      <main className="relative pt-28 pb-16 px-6 lg:px-10">
        <AuthGuard>
          <div className="mx-auto max-w-5xl space-y-6">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to my documents
            </Link>

            {isSignableAgreement(analysis.summary) ? (
              <SummaryReport
                summary={analysis.summary}
                fileName={analysis.fileName}
                isDemo={analysis.isDemo}
                onStartOver={() => {}}
                hideStartOver
              />
            ) : (
              <NonAgreementReport
                summary={analysis.summary}
                fileName={analysis.fileName}
                onStartOver={() => {}}
                hideStartOver
              />
            )}
          </div>
        </AuthGuard>
      </main>
    </div>
  );
}
