import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Plus, Trash2 } from "lucide-react";
import { useUser } from "@clerk/tanstack-react-start";
import { requireAuth } from "@/lib/auth.functions";
import { listDocumentAnalyses, deleteDocumentAnalysis } from "@/lib/documents/documents.functions";
import { AppNav } from "@/components/app/AppNav";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { RECOMMENDATION_CONFIG, RISK_CONFIG } from "@/lib/summarizer/constants";
import type { RiskLevel, Recommendation } from "@/lib/summarizer/types";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
  beforeLoad: async () => requireAuth({ data: { redirectPath: "/dashboard" } }),
  loader: async () => listDocumentAnalyses(),
  head: () => ({
    meta: [{ title: `My documents — ${BRAND.name}` }],
  }),
});

function formatWhen(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DashboardPage() {
  const { user } = useUser();
  const initial = Route.useLoaderData();
  const [items, setItems] = useState(initial.items);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const firstName = user?.firstName ?? "there";

  const handleDelete = async (id: string, fileName: string) => {
    if (!confirm(`Remove "${fileName}" from your documents?`)) return;
    setDeletingId(id);
    try {
      const { deleted } = await deleteDocumentAnalysis({ data: { id } });
      if (deleted) setItems((prev) => prev.filter((item) => item.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground grain">
      <AppNav active="dashboard" />

      <main className="relative pt-28 pb-16 px-6 lg:px-10">
        <AuthGuard>
          <div className="mx-auto max-w-5xl space-y-10">
            <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div className="space-y-2">
                <p className="text-xs font-mono uppercase tracking-widest text-signal">
                  Your workspace
                </p>
                <h1 className="font-display text-3xl sm:text-4xl font-light">
                  Welcome back, {firstName}
                </h1>
                <p className="text-muted-foreground text-pretty max-w-lg">
                  Every agreement you&apos;ve analyzed lives here. Open one to review, or upload a
                  new document.
                </p>
              </div>
              <Link
                to="/summarize"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-signal text-ink px-6 py-3 text-sm font-semibold hover:brightness-110 transition shrink-0"
              >
                <Plus className="h-4 w-4" />
                Analyze new document
              </Link>
            </header>

            {items.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/15 bg-card/50 px-8 py-16 text-center space-y-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
                  <FileText className="h-7 w-7 text-muted-foreground" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h2 className="font-display text-2xl">No documents yet</h2>
                  <p className="text-muted-foreground text-sm text-pretty">
                    Upload your first rent agreement, employment contract, or NDA to get a
                    plain-language breakdown with risk highlights.
                  </p>
                </div>
                <Link
                  to="/summarize"
                  className="inline-flex items-center gap-2 rounded-full bg-signal text-ink px-6 py-3 text-sm font-semibold hover:brightness-110 transition"
                >
                  <Plus className="h-4 w-4" />
                  Upload your first agreement
                </Link>
              </div>
            ) : (
              <ul className="grid gap-3">
                {items.map((item) => {
                  const risk = RISK_CONFIG[item.overallRisk as RiskLevel] ?? RISK_CONFIG.medium;
                  const rec =
                    RECOMMENDATION_CONFIG[item.recommendation as Recommendation] ??
                    RECOMMENDATION_CONFIG.seek_lawyer;

                  return (
                    <li
                      key={item.id}
                      className="group rounded-2xl border border-white/8 bg-card p-5 sm:p-6 hover:border-white/15 transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                                risk.bg,
                                risk.color,
                              )}
                            >
                              <span className={cn("h-1.5 w-1.5 rounded-full", risk.dot)} />
                              {risk.label}
                            </span>
                            <span
                              className={cn(
                                "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                                rec.bg,
                                rec.color,
                              )}
                            >
                              {rec.label}
                            </span>
                            {item.isDemo && (
                              <span className="text-[11px] font-mono text-muted-foreground">
                                demo
                              </span>
                            )}
                          </div>
                          <p className="font-medium text-foreground truncate">{item.fileName}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.documentType} · {item.language} · {formatWhen(item.createdAt)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Link
                            to="/dashboard/$analysisId"
                            params={{ analysisId: item.id }}
                            className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/15 transition"
                          >
                            View report
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.fileName)}
                            disabled={deletingId === item.id}
                            className="inline-flex items-center justify-center rounded-full border border-white/10 p-2 text-muted-foreground hover:text-destructive hover:border-destructive/30 transition disabled:opacity-50"
                            aria-label={`Delete ${item.fileName}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </AuthGuard>
      </main>
    </div>
  );
}
