import { useEffect, useState } from "react";
import type { AnalysisPhase } from "@/lib/summarizer/types";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const PHASES: { id: AnalysisPhase; label: string; progress: number }[] = [
  { id: "reading", label: "Reading your document", progress: 20 },
  { id: "understanding", label: "Understanding legal language", progress: 45 },
  { id: "mapping", label: "Mapping clauses & obligations", progress: 70 },
  { id: "highlighting", label: "Highlighting risks & red flags", progress: 90 },
];

interface AnalyzingStateProps {
  fileName: string;
}

export function AnalyzingState({ fileName }: AnalyzingStateProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIndex((i) => (i < PHASES.length - 1 ? i + 1 : i));
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  const current = PHASES[phaseIndex];

  return (
    <div className="w-full max-w-lg mx-auto text-center space-y-8 py-12">
      <div className="relative mx-auto h-24 w-24">
        <div className="absolute inset-0 rounded-full bg-signal/20 animate-ping" />
        <div className="relative flex h-full w-full items-center justify-center rounded-full bg-card border border-signal/30">
          <span className="font-mono text-2xl font-bold text-signal">{current.progress}%</span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-display text-xl text-foreground blink">{current.label}</p>
        <p className="text-sm text-muted-foreground truncate px-4">{fileName}</p>
      </div>

      <Progress value={current.progress} className="h-1.5" />

      <div className="space-y-2 text-left max-w-xs mx-auto">
        {PHASES.map((phase, i) => (
          <div
            key={phase.id}
            className={cn(
              "flex items-center gap-3 text-sm transition-all duration-500",
              i <= phaseIndex ? "text-foreground" : "text-muted-foreground/40",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full shrink-0 transition-colors",
                i < phaseIndex ? "bg-emerald" : i === phaseIndex ? "bg-signal animate-pulse" : "bg-white/20",
              )}
            />
            {phase.label}
          </div>
        ))}
      </div>
    </div>
  );
}
