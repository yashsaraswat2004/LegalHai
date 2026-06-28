import { RISK_CONFIG } from "@/lib/summarizer/constants";
import type { AgreementSummary } from "@/lib/summarizer/types";
import { cn } from "@/lib/utils";

interface ClauseMapProps {
  clauses: AgreementSummary["clauses"];
  activeId?: string;
  onSelect: (id: string) => void;
}

export function ClauseMap({ clauses, activeId, onSelect }: ClauseMapProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
        Clause map — jump to section
      </p>
      <div className="flex flex-wrap gap-2">
        {clauses.map((clause, i) => {
          const risk = RISK_CONFIG[clause.risk];
          const isActive = activeId === clause.id;

          return (
            <button
              key={clause.id}
              type="button"
              onClick={() => onSelect(clause.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-all",
                isActive
                  ? "border-signal/50 bg-signal/10 text-foreground"
                  : "border-white/8 bg-card hover:border-white/15 text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="font-mono text-[10px] opacity-60">{String(i + 1).padStart(2, "0")}</span>
              <span className={cn("h-2 w-2 rounded-full shrink-0", risk.dot)} />
              <span className="truncate max-w-[140px]">{clause.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
