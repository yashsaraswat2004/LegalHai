import { AlertTriangle, Lightbulb, MessageSquareQuote, Scale } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RISK_CONFIG } from "@/lib/summarizer/constants";
import type { AgreementSummary } from "@/lib/summarizer/types";
import { cn } from "@/lib/utils";

type Clause = AgreementSummary["clauses"][number];

interface ClauseCardProps {
  clause: Clause;
  index: number;
  defaultOpen?: boolean;
}

export function ClauseCard({ clause, index, defaultOpen }: ClauseCardProps) {
  const risk = RISK_CONFIG[clause.risk];

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ? clause.id : undefined}
      className="rounded-2xl border border-white/8 bg-card overflow-hidden shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]"
    >
      <AccordionItem value={clause.id} className="border-none">
        <AccordionTrigger className="px-5 sm:px-6 py-5 hover:no-underline hover:bg-white/[0.02] [&[data-state=open]]:bg-white/[0.02]">
          <div className="flex items-start gap-4 text-left w-full pr-2">
            <span className="font-mono text-xs text-muted-foreground/70 mt-1 shrink-0 tabular-nums">
              §{String(index + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display text-base sm:text-lg text-foreground">{clause.title}</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground px-2 py-0.5 rounded-md bg-white/5">
                  {clause.category}
                </span>
                {clause.negotiable && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald px-2 py-0.5 rounded-md bg-emerald/10">
                    You can negotiate this
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed text-pretty">
                {clause.plainLanguage}
              </p>
            </div>
            <span
              className={cn(
                "shrink-0 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide",
                risk.bg,
                risk.border,
                risk.color,
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", risk.dot)} />
              {clause.risk}
            </span>
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-5 sm:px-6 pb-6">
          <div className="ml-6 sm:ml-8 space-y-5 border-l-2 border-white/8 pl-5 sm:pl-6">
            {clause.originalExcerpt && (
              <blockquote className="relative text-sm italic text-muted-foreground/90 leading-relaxed pl-4 border-l-2 border-paper/20">
                <span className="absolute -left-px top-0 bottom-0 w-0.5 bg-signal/50 rounded-full" />
                &ldquo;{clause.originalExcerpt}&rdquo;
              </blockquote>
            )}

            <div className="rounded-xl bg-gradient-to-br from-white/[0.05] to-transparent p-4 sm:p-5 space-y-2">
              <p className="text-[11px] font-mono uppercase tracking-widest text-signal flex items-center gap-1.5">
                <MessageSquareQuote className="h-3 w-3" />
                What it really means
              </p>
              <p className="text-[0.9375rem] text-foreground leading-[1.7] text-pretty">
                {clause.plainLanguage}
              </p>
            </div>

            {clause.riskReason && clause.risk !== "low" && (
              <div className="flex gap-3 text-sm rounded-lg bg-saffron/5 border border-saffron/15 p-4">
                <AlertTriangle className="h-4 w-4 text-saffron shrink-0 mt-0.5" />
                <p className="text-foreground/85 leading-[1.65] text-pretty">{clause.riskReason}</p>
              </div>
            )}

            <div className="rounded-xl border border-emerald/25 bg-emerald/[0.06] p-4 sm:p-5 space-y-2">
              <p className="text-[11px] font-mono uppercase tracking-widest text-emerald flex items-center gap-1.5">
                <Lightbulb className="h-3 w-3" />
                Picture this
              </p>
              <p className="text-[0.9375rem] text-foreground/90 leading-[1.7] text-pretty">
                {clause.realWorldExample}
              </p>
            </div>

            <div className="flex gap-3 text-sm rounded-lg border border-white/8 p-4">
              <Scale className="h-4 w-4 text-signal shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                  Before you agree
                </p>
                <p className="text-foreground/90 leading-[1.65] text-pretty">{clause.whatToWatch}</p>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
