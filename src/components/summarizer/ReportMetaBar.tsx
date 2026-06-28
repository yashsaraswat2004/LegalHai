import { getLanguageLabel } from "@/lib/summarizer/languages";
import { LABELS } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { FileText, Globe, Sparkles } from "lucide-react";

interface ReportMetaBarProps {
  fileName: string;
  languageCode: string;
  confidence: number;
  clauseCount: number;
  className?: string;
}

export function ReportMetaBar({
  fileName,
  languageCode,
  confidence,
  clauseCount,
  className,
}: ReportMetaBarProps) {
  const confidencePct = Math.round(confidence * 100);
  const readMins = Math.max(2, Math.ceil(clauseCount * 0.8));

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3 text-xs",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1.5 text-muted-foreground min-w-0">
        <FileText className="h-3.5 w-3.5 shrink-0 text-emerald" />
        <span className="truncate max-w-[200px] sm:max-w-xs">{fileName}</span>
      </span>
      <span className="hidden sm:inline h-3 w-px bg-white/10" />
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
        <Globe className="h-3.5 w-3.5 text-signal" />
        Explained in <strong className="text-foreground font-medium">{getLanguageLabel(languageCode)}</strong>
      </span>
      <span className="hidden sm:inline h-3 w-px bg-white/10" />
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-saffron" />
        {confidencePct}% document confidence · ~{readMins} min read
      </span>
    </div>
  );
}

function SectionHeading({
  children,
  subtitle,
}: {
  children: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="space-y-1">
      <h2 className="font-display text-xl sm:text-2xl tracking-tight">{children}</h2>
      {subtitle && <p className="text-sm text-muted-foreground text-pretty max-w-2xl">{subtitle}</p>}
    </div>
  );
}

export { SectionHeading };
