import { RISK_CONFIG } from "@/lib/summarizer/constants";
import type { RiskLevel } from "@/lib/summarizer/types";
import { cn } from "@/lib/utils";

interface RiskMeterProps {
  score: number;
  level: RiskLevel;
  className?: string;
}

export function RiskMeter({ score, level, className }: RiskMeterProps) {
  const config = RISK_CONFIG[level];

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Risk score
          </p>
          <p className={cn("font-display text-4xl font-semibold tabular-nums", config.color)}>
            {score}
            <span className="text-lg text-muted-foreground font-normal">/100</span>
          </p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
            config.bg,
            config.border,
            config.color,
          )}
        >
          <span className={cn("h-2 w-2 rounded-full", config.dot)} />
          {config.label}
        </span>
      </div>

      <div className="relative h-3 rounded-full bg-white/5 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${score}%`,
            background: `linear-gradient(90deg, var(--emerald), var(--saffron) ${score > 50 ? "50%" : "100%"}, var(--destructive) ${score > 70 ? "100%" : "0%"})`,
          }}
        />
      </div>

      <div className="flex justify-between text-[10px] font-mono uppercase text-muted-foreground/50">
        <span>Safe</span>
        <span>Caution</span>
        <span>Danger</span>
      </div>
    </div>
  );
}
