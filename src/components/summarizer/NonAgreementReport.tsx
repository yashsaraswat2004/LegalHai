import { ArrowLeft, FileQuestion } from "lucide-react";
import type { AgreementSummary } from "@/lib/summarizer/types";
import { BRAND } from "@/lib/brand";

interface NonAgreementReportProps {
  summary: AgreementSummary;
  fileName: string;
  onStartOver: () => void;
  hideStartOver?: boolean;
}

const SUGGESTED_UPLOADS = [
  "Rent or lease agreements",
  "Job offer letters & employment contracts",
  "NDAs & freelance contracts",
  "Loan or vendor agreements",
  "Partnership or business MoUs",
];

export function NonAgreementReport({ summary, fileName, onStartOver, hideStartOver }: NonAgreementReportProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 pb-20 animate-in fade-in duration-700">
      <div className="rounded-3xl border border-white/10 bg-card overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 h-40 bg-gradient-to-b from-saffron/8 to-transparent" />
        <div className="relative p-8 sm:p-10 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-saffron/10 border border-saffron/20">
            <FileQuestion className="h-8 w-8 text-saffron" />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-widest text-saffron">
              {summary.meta.documentType}
            </p>
            <h1 className="font-display text-2xl sm:text-3xl text-balance leading-tight">
              {summary.verdict.headline}
            </h1>
            <p className="text-sm text-muted-foreground truncate">{fileName}</p>
          </div>

          <p className="text-base text-foreground/90 leading-relaxed text-pretty max-w-lg mx-auto">
            {summary.verdict.summary}
          </p>

          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 text-left space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              What {BRAND.name} is for
            </p>
            <p className="text-sm leading-relaxed text-pretty text-foreground/85">
              {summary.verdict.recommendationReason}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-emerald/20 bg-emerald/[0.04] p-6 space-y-4">
        <p className="text-sm font-medium text-emerald">Try uploading one of these instead</p>
        <ul className="space-y-2">
          {SUGGESTED_UPLOADS.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-muted-foreground">
              <span className="text-emerald">→</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {!hideStartOver && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onStartOver}
            className="inline-flex items-center gap-2 rounded-full bg-signal text-ink px-8 py-3.5 text-sm font-semibold hover:brightness-110 transition glow"
          >
            <ArrowLeft className="h-4 w-4" />
            Upload an agreement
          </button>
        </div>
      )}
    </div>
  );
}
