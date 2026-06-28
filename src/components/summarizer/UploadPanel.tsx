import { useCallback, useRef, useState } from "react";
import { FileUp, ImageIcon, FileText, X, Sparkles } from "lucide-react";
import { validateFile } from "@/lib/summarizer/file-validation";
import { LanguagePicker } from "@/components/summarizer/LanguagePicker";
import { cn } from "@/lib/utils";

interface UploadPanelProps {
  onAnalyze: (file: File, language: string) => void;
  isAnalyzing: boolean;
}

export function UploadPanel({ onAnalyze, isAnalyzing }: UploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("en");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((f: File) => {
    const err = validateFile(f);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setFile(f);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const fileIcon = file?.type.startsWith("image/")
    ? ImageIcon
    : file?.type === "application/pdf"
      ? FileText
      : FileUp;

  const FileIcon = file ? fileIcon : FileUp;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <LanguagePicker value={language} onChange={setLanguage} disabled={isAnalyzing} />

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onClick={() => !isAnalyzing && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          "relative rounded-2xl border-2 border-dashed p-10 text-center transition-all cursor-pointer",
          dragOver
            ? "border-signal bg-signal/5 scale-[1.01]"
            : "border-white/15 hover:border-white/25 hover:bg-white/[0.02]",
          isAnalyzing && "pointer-events-none opacity-60",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,.jpg,.jpeg,.png,.webp,application/pdf,text/plain,image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />

        {!file ? (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-signal/10">
              <FileUp className="h-7 w-7 text-signal" />
            </div>
            <p className="font-display text-lg text-foreground">
              Drop your agreement here
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              PDF, image scan, or text file — up to 15 MB
            </p>
            <p className="mt-4 text-xs font-mono text-muted-foreground/70">
              Rental · NDA · Freelance · Employment · Vendor MoU
            </p>
          </>
        ) : (
          <div className="flex items-center gap-4 text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald/10">
              <FileIcon className="h-6 w-6 text-emerald" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-sm text-muted-foreground">{formatSize(file.size)}</p>
            </div>
            {!isAnalyzing && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setError(null);
                }}
                className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive text-center" role="alert">
          {error}
        </p>
      )}

      <button
        type="button"
        disabled={!file || isAnalyzing}
        onClick={() => file && onAnalyze(file, language)}
        className={cn(
          "w-full inline-flex items-center justify-center gap-2 rounded-full py-4 text-base font-semibold transition-all",
          file && !isAnalyzing
            ? "bg-signal text-ink hover:brightness-110 glow"
            : "bg-white/5 text-muted-foreground cursor-not-allowed",
        )}
      >
        <Sparkles className="h-5 w-5" />
        {isAnalyzing ? "Analyzing…" : "Understand this agreement"}
      </button>

      <p className="text-center text-xs text-muted-foreground/60 max-w-md mx-auto">
        Not legal advice. LegalHai explains documents in plain language so you can make informed
        decisions. Always consult a lawyer for binding matters.
      </p>
    </div>
  );
}
