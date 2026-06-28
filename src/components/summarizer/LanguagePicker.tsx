import { OUTPUT_LANGUAGES } from "@/lib/summarizer/languages";
import { cn } from "@/lib/utils";
import { Languages } from "lucide-react";

interface LanguagePickerProps {
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
}

export function LanguagePicker({ value, onChange, disabled }: LanguagePickerProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Languages className="h-4 w-4 text-signal" />
        <label className="text-sm font-medium text-foreground">
          Your summary language
        </label>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        We&apos;ll explain everything — verdict, clauses, examples — in the language you pick.
        Natural, everyday wording, not machine translation.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {OUTPUT_LANGUAGES.map((lang) => {
          const selected = value === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              disabled={disabled}
              onClick={() => onChange(lang.code)}
              className={cn(
                "group relative rounded-xl border px-3 py-3 text-left transition-all",
                selected
                  ? "border-signal/60 bg-signal/10 ring-1 ring-signal/30"
                  : "border-white/10 bg-card hover:border-white/20 hover:bg-white/[0.03]",
                disabled && "opacity-50 cursor-not-allowed",
              )}
            >
              <span
                className={cn(
                  "block font-display text-base leading-tight",
                  selected ? "text-foreground" : "text-foreground/90",
                )}
              >
                {lang.native}
              </span>
              <span className="block text-[11px] text-muted-foreground mt-0.5">{lang.label}</span>
              {selected && (
                <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-signal" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
