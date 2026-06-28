import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, FileQuestion, Home, RotateCcw } from "lucide-react";
import { BRAND } from "@/lib/brand";

function ErrorShell({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background text-foreground grain flex items-center justify-center px-6 py-16">
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-emerald/8 blur-[140px]" />

      <div className="relative w-full max-w-md text-center space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 mx-auto">
          <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-md">
            <img src="/favicon.png" alt={BRAND.name} className="h-full w-full object-cover" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald animate-pulse" />
          </span>
          <span className="font-display text-2xl tracking-tight">
            Legal<span className="italic font-light">Hai</span>
          </span>
        </Link>

        <div className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/20">
            {icon}
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-light text-balance">{title}</h1>
            <p className="text-sm text-muted-foreground text-pretty leading-relaxed">{description}</p>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <ErrorShell
      icon={<FileQuestion className="h-8 w-8 text-saffron" />}
      title="Page not found"
      description="This page doesn't exist or may have been moved. Head back home or sign in to your workspace."
    >
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-signal text-ink px-6 py-3 text-sm font-semibold hover:brightness-110 transition w-full sm:w-auto justify-center"
        >
          <Home className="h-4 w-4" />
          Go home
        </Link>
        <Link
          to="/sign-in"
          search={{ redirect_url: "/dashboard" }}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-white/25 transition w-full sm:w-auto justify-center"
        >
          Sign in
        </Link>
      </div>
    </ErrorShell>
  );
}

interface ErrorPageProps {
  error?: Error;
  onRetry?: () => void;
}

export function ErrorPage({ error, onRetry }: ErrorPageProps) {
  const showDetails = import.meta.env.DEV && error?.message;

  return (
    <ErrorShell
      icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
      title="Something went wrong"
      description="An unexpected error occurred. Please try again — if it keeps happening, sign out and back in."
    >
      {showDetails && (
        <pre className="max-h-36 overflow-auto rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-left font-mono text-xs text-destructive/90 text-pretty">
          {error.message}
        </pre>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-full bg-signal text-ink px-6 py-3 text-sm font-semibold hover:brightness-110 transition w-full sm:w-auto justify-center"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>
        )}
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-white/25 transition w-full sm:w-auto justify-center"
        >
          <Home className="h-4 w-4" />
          Go home
        </Link>
      </div>
    </ErrorShell>
  );
}
