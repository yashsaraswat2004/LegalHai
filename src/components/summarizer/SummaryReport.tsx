import { useRef, useState } from "react";
import {
  AlertOctagon,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  HelpCircle,
  Users,
  BookOpen,
  ShieldAlert,
  Volume2,
} from "lucide-react";
import type { AgreementSummary } from "@/lib/summarizer/types";
import { RECOMMENDATION_CONFIG, RISK_CONFIG } from "@/lib/summarizer/constants";
import { LABELS } from "@/lib/brand";
import { RiskMeter } from "./RiskMeter";
import { ClauseMap } from "./ClauseMap";
import { ClauseCard } from "./ClauseCard";
import { ReportMetaBar, SectionHeading } from "./ReportMetaBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface SummaryReportProps {
  summary: AgreementSummary;
  fileName: string;
  isDemo: boolean;
  onStartOver: () => void;
  hideStartOver?: boolean;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function SummaryReport({ summary, fileName, isDemo, onStartOver, hideStartOver }: SummaryReportProps) {
  const [activeClause, setActiveClause] = useState<string | undefined>();
  const clausesRef = useRef<HTMLDivElement>(null);
  const rec = RECOMMENDATION_CONFIG[summary.verdict.recommendation];

  const scrollToClause = (id: string) => {
    setActiveClause(id);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      <ReportMetaBar
        fileName={fileName}
        languageCode={summary.meta.outputLanguage}
        confidence={summary.meta.confidence}
        clauseCount={summary.clauses.length}
      />

      {isDemo && (
        <div className="rounded-xl border border-saffron/30 bg-saffron/10 px-4 py-3 text-sm text-center text-pretty">
          <span className="font-medium text-saffron">Preview mode</span>
          <span className="text-muted-foreground">
            {" "}
            — Add <code className="font-mono text-xs bg-black/20 px-1 rounded">GROQ_API_KEY</code> to
            your <code className="font-mono text-xs bg-black/20 px-1 rounded">.env</code> for live
            analysis.
          </span>
        </div>
      )}

      {/* Verdict hero */}
      <section className="relative rounded-3xl border border-white/10 bg-card overflow-hidden">
        <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-signal/10 blur-[80px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-emerald/8 blur-[60px]" />

        <div className="relative p-6 sm:p-8 lg:p-10 space-y-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3 max-w-2xl">
              <p className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                <span className="h-1 w-1 rounded-full bg-emerald" />
                {summary.meta.documentType}
              </p>
              <h1 className="font-display text-[clamp(1.5rem,4vw,2.5rem)] leading-[1.15] text-balance">
                {summary.verdict.headline}
              </h1>
            </div>
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shrink-0",
                rec.bg,
                rec.color,
              )}
            >
              <span className="text-base">{rec.icon}</span>
              {rec.label}
            </span>
          </div>

          <div className="ring-divider" />

          <p className="text-base sm:text-[1.125rem] text-foreground/90 leading-[1.75] text-pretty max-w-3xl">
            {summary.verdict.summary}
          </p>

          <div className="grid lg:grid-cols-2 gap-6">
            <RiskMeter score={summary.verdict.riskScore} level={summary.verdict.overallRisk} />
            <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.04] to-transparent p-6 space-y-3">
              <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                Our recommendation
              </p>
              <p className="text-[0.9375rem] leading-[1.7] text-foreground/90 text-pretty">
                {summary.verdict.recommendationReason}
              </p>
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-2 text-xs text-muted-foreground/45 cursor-not-allowed pt-1"
                title="Coming soon"
              >
                <Volume2 className="h-3.5 w-3.5" />
                Listen to this summary — coming soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* At a glance */}
      <section className="space-y-5">
        <SectionHeading subtitle="The essentials — who, when, and what matters most.">
          {LABELS.atAGlance}
        </SectionHeading>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/8 bg-card p-5 sm:p-6 space-y-4 min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              <Users className="h-3.5 w-3.5 shrink-0" />
              Who&apos;s involved
            </div>
            <ul className="space-y-3">
              {summary.parties.map((p) => (
                <li key={`${p.name}-${p.role}`} className="text-sm leading-relaxed min-w-0">
                  <span className="font-medium text-foreground block break-words text-pretty">{p.name}</span>
                  <span className="text-muted-foreground break-words text-pretty">{p.role}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/8 bg-card p-5 sm:p-6 space-y-4 min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              Important dates
            </div>
            <ul className="space-y-3">
              {summary.keyDates.map((d) => (
                <li key={d.label} className="text-sm leading-relaxed min-w-0">
                  <span className="text-muted-foreground block text-xs break-words text-pretty">{d.label}</span>
                  <span className="font-medium text-foreground break-words text-pretty">
                    {d.date ? formatDate(d.date) : d.note ?? "Not specified"}
                  </span>
                  {d.date && d.note && (
                    <span className="text-muted-foreground text-xs block mt-0.5 break-words text-pretty">{d.note}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/8 bg-card p-5 sm:p-6 space-y-4 sm:col-span-2 lg:col-span-1 min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5 shrink-0" />
              Key numbers & terms
            </div>
            <ul className="space-y-3">
              {summary.keyTerms.map((t) => {
                const imp = RISK_CONFIG[t.importance];
                return (
                  <li
                    key={t.label}
                    className="text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0 min-w-0 space-y-1"
                  >
                    <span className="text-muted-foreground text-xs block break-words text-pretty leading-snug">
                      {t.label}
                    </span>
                    <span className="font-medium flex items-start gap-1.5 break-words text-pretty leading-relaxed">
                      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0 mt-1.5", imp.dot)} />
                      <span className="min-w-0">{t.value}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Red flags */}
      {summary.redFlags.length > 0 && (
        <section className="space-y-5">
          <SectionHeading
            subtitle="These stood out as uneven or unclear — worth addressing before you commit."
          >
            <span className="inline-flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive inline" />
              {LABELS.redFlags}
              <span className="text-sm font-mono font-normal text-muted-foreground">
                ({summary.redFlags.length})
              </span>
            </span>
          </SectionHeading>

          <div className="grid gap-3">
            {summary.redFlags.map((flag) => {
              const sev = RISK_CONFIG[flag.severity];
              return (
                <div
                  key={flag.title}
                  className={cn("rounded-2xl border p-5 sm:p-6", sev.bg, sev.border)}
                >
                  <div className="flex items-start gap-4">
                    <AlertOctagon className={cn("h-5 w-5 shrink-0 mt-0.5", sev.color)} />
                    <div className="space-y-2 flex-1 min-w-0">
                      <p className={cn("font-display text-lg", sev.color)}>{flag.title}</p>
                      <p className="text-sm text-foreground/85 leading-[1.65] text-pretty">
                        {flag.explanation}
                      </p>
                      <p className="text-sm leading-relaxed pt-1 border-t border-white/5">
                        <span className="text-signal font-medium">What to do → </span>
                        <span className="text-foreground/90">{flag.action}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Clause breakdown */}
      <section ref={clausesRef} className="space-y-6">
        <SectionHeading subtitle="Each section explained like a human would — original wording, plain meaning, and a real example.">
          {LABELS.clauseBreakdown}
        </SectionHeading>

        <ClauseMap clauses={summary.clauses} activeId={activeClause} onSelect={scrollToClause} />

        <div className="space-y-4">
          {summary.clauses.map((clause, i) => (
            <div key={clause.id} id={clause.id} className="scroll-mt-28">
              <ClauseCard clause={clause} index={i} defaultOpen={i === 0} />
            </div>
          ))}
        </div>
      </section>

      {/* Obligations & before you sign */}
      <section className="space-y-5">
        <SectionHeading subtitle="Your responsibilities, theirs, and a practical checklist before signing.">
          Before you sign
        </SectionHeading>

        <Tabs defaultValue="obligations" className="w-full">
          <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex h-auto p-1 bg-white/5">
            <TabsTrigger value="obligations" className="text-xs sm:text-sm data-[state=active]:bg-card">
              Who does what
            </TabsTrigger>
            <TabsTrigger value="checklist" className="text-xs sm:text-sm data-[state=active]:bg-card">
              Questions & checklist
            </TabsTrigger>
            <TabsTrigger value="glossary" className="text-xs sm:text-sm data-[state=active]:bg-card">
              Plain glossary
            </TabsTrigger>
          </TabsList>

          <TabsContent value="obligations" className="mt-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-signal/20 bg-signal/[0.04] p-5 sm:p-6 space-y-4">
                <p className="text-[11px] font-mono uppercase tracking-widest text-signal">
                  What you must do
                </p>
                <ul className="space-y-3">
                  {summary.obligations.yours.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-[1.65] text-pretty">
                      <CheckCircle2 className="h-4 w-4 text-signal shrink-0 mt-1" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-emerald/20 bg-emerald/[0.04] p-5 sm:p-6 space-y-4">
                <p className="text-[11px] font-mono uppercase tracking-widest text-emerald">
                  What they must do
                </p>
                <ul className="space-y-3">
                  {summary.obligations.theirs.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-[1.65] text-pretty">
                      <CheckCircle2 className="h-4 w-4 text-emerald shrink-0 mt-1" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="checklist" className="mt-5 space-y-4">
            <div className="rounded-2xl border border-white/8 bg-card p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                <HelpCircle className="h-3.5 w-3.5" />
                Ask them directly
              </div>
              <ol className="space-y-3 list-none">
                {summary.beforeYouSign.questions.map((q, i) => (
                  <li key={q} className="flex gap-3 text-sm leading-[1.65] text-pretty">
                    <span className="font-mono text-signal text-xs mt-0.5 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {q}
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-2xl border border-white/8 bg-card p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Your pre-sign checklist
              </div>
              <ul className="space-y-3">
                {summary.beforeYouSign.checklist.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-[1.65] text-pretty">
                    <span className="text-emerald font-mono shrink-0">□</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="glossary" className="mt-5">
            <div className="grid sm:grid-cols-2 gap-3">
              {summary.glossary.map((g) => (
                <div
                  key={g.term}
                  className="rounded-xl border border-white/8 bg-card p-4 sm:p-5 hover:border-white/12 transition"
                >
                  <p className="font-medium text-signal text-sm">{g.term}</p>
                  <p className="text-sm text-muted-foreground mt-2 leading-[1.6] text-pretty">
                    {g.definition}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {!hideStartOver && (
        <div className="flex justify-center pt-6">
          <button
            type="button"
            onClick={onStartOver}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-white/25 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Analyze another agreement
          </button>
        </div>
      )}
    </div>
  );
}
