import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { requireAuth } from "@/lib/auth.functions";
import { BILLING_ERRORS, LAUNCH_PROMO_CODE } from "@/lib/billing/constants";
import { AppNav } from "@/components/app/AppNav";
import { UploadPanel } from "@/components/summarizer/UploadPanel";
import { AnalyzingState } from "@/components/summarizer/AnalyzingState";
import { SummaryReport } from "@/components/summarizer/SummaryReport";
import { NonAgreementReport } from "@/components/summarizer/NonAgreementReport";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { summarizeAgreement } from "@/lib/summarizer/summarize.functions";
import type { AgreementSummary } from "@/lib/summarizer/types";
import { isSignableAgreement } from "@/lib/summarizer/types";
import { BRAND, LABELS } from "@/lib/brand";
import { buildPageMeta } from "@/lib/seo";

export const Route = createFileRoute("/summarize/")({
  component: SummarizePage,
  beforeLoad: async () => requireAuth({ data: { redirectPath: "/summarize" } }),
  head: () =>
    buildPageMeta({
      title: "Analyze a contract",
      description:
        "Upload any agreement and get a plain-language summary with risk highlights, clause explanations, and real-world examples. Available in 12+ Indian languages.",
      path: "/summarize",
      noIndex: true,
    }),
});

function SummarizePage() {
  const [phase, setPhase] = useState<"upload" | "analyzing" | "report" | "error">("upload");
  const [fileName, setFileName] = useState("");
  const [summary, setSummary] = useState<AgreementSummary | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billingBlocked, setBillingBlocked] = useState(false);

  const handleAnalyze = async (file: File, language: string) => {
    setFileName(file.name);
    setPhase("analyzing");
    setError(null);
    setBillingBlocked(false);

    try {
      const { extractDocumentContent } = await import("@/lib/summarizer/extract-text");
      const extracted = await extractDocumentContent(file);

      const result = await summarizeAgreement({
        data: {
          text: extracted.text,
          imageBase64: extracted.imageBase64,
          mimeType: extracted.mimeType,
          fileName: extracted.fileName,
          language,
        },
      });

      setSummary(result.summary);
      setIsDemo(result.isDemo);
      setPhase("report");
    } catch (err) {
      const raw = err instanceof Error ? err.message : "";
      if (raw === BILLING_ERRORS.LIMIT_REACHED) {
        setBillingBlocked(true);
        setError(
          `You've used your free analyses. Upgrade to Pro (₹49/mo) or redeem ${LAUNCH_PROMO_CODE} for 100% off.`,
        );
      } else {
        setBillingBlocked(false);
        const message =
          raw.includes("invalid_enum") || raw.includes("Expected")
            ? "We couldn't analyze this file. LegalHai works best with agreements you sign — try a rent contract, offer letter, or NDA."
            : raw || "Something went wrong. Please try again.";
        setError(message);
      }
      setPhase("error");
    }
  };

  const handleStartOver = () => {
    setPhase("upload");
    setSummary(null);
    setFileName("");
    setError(null);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground grain">
      <AppNav active="summarize" />

      {/* Ambient */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-emerald/8 blur-[160px]" />

      <main className="relative pt-32 pb-16 px-6 lg:px-10">
        <AuthGuard>
        <div className="mx-auto max-w-5xl">
          {phase === "upload" && (
            <div className="space-y-10">
              <header className="text-center space-y-4 max-w-2xl mx-auto">
                <p className="text-xs font-mono uppercase tracking-widest text-signal">
                  {BRAND.beforeYouSign}
                </p>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-balance leading-tight">
                  Understand before{" "}
                  <span className="italic font-light text-emerald">you sign</span>
                </h1>
                <p className="text-muted-foreground text-base sm:text-lg text-pretty">
                  Upload any agreement. Get {LABELS.summary.toLowerCase()}, clause explanations,{" "}
                  {LABELS.redFlags.toLowerCase()}, and real-world examples —{" "}
                  {LABELS.translation.toLowerCase()}.
                </p>
              </header>

              <UploadPanel onAnalyze={handleAnalyze} isAnalyzing={false} />
            </div>
          )}

          {phase === "analyzing" && <AnalyzingState fileName={fileName} />}

          {phase === "error" && (
            <div className="text-center space-y-6 max-w-md mx-auto py-12">
              <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-6 py-5">
                <p className="text-sm text-foreground/90 leading-relaxed text-pretty">{error}</p>
              </div>
              <button
                type="button"
                onClick={handleStartOver}
                className="rounded-full bg-signal text-ink px-6 py-3 text-sm font-semibold hover:brightness-110 transition"
              >
                Try again
              </button>
              {billingBlocked && (
                <Link
                  to="/billing"
                  className="block text-sm text-signal hover:underline font-mono uppercase tracking-wider"
                >
                  Upgrade or apply {LAUNCH_PROMO_CODE} →
                </Link>
              )}
            </div>
          )}

          {phase === "report" && summary && (
            isSignableAgreement(summary) ? (
              <SummaryReport
                summary={summary}
                fileName={fileName}
                isDemo={isDemo}
                onStartOver={handleStartOver}
              />
            ) : (
              <NonAgreementReport
                summary={summary}
                fileName={fileName}
                onStartOver={handleStartOver}
              />
            )
          )}
        </div>
        </AuthGuard>
      </main>
    </div>
  );
}
