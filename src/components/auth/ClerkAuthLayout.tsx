import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BRAND } from "@/lib/brand";

interface ClerkAuthLayoutProps {
  children: ReactNode;
  subtitle?: string;
}

export function ClerkAuthLayout({ children, subtitle }: ClerkAuthLayoutProps) {
  return (
    <div className="relative min-h-screen bg-background text-foreground grain flex flex-col items-center justify-center px-6 py-16">
      <div className="pointer-events-none absolute -top-32 -left-32 h-[460px] w-[460px] rounded-full bg-emerald/12 blur-[130px]" />
      <div className="pointer-events-none absolute top-20 right-0 h-[380px] w-[380px] rounded-full bg-signal/8 blur-[120px]" />

      <div className="relative w-full max-w-[420px] space-y-6 mb-6 text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <span className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg ring-1 ring-white/10">
            <img src="/favicon.png" alt="" className="h-full w-full object-cover" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald animate-pulse" />
          </span>
          <span className="font-display text-2xl tracking-tight">
            Legal<span className="italic font-light text-emerald">Hai</span>
          </span>
        </Link>
        <div className="space-y-1">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-signal">
            {BRAND.beforeYouSign}
          </p>
          <p className="text-sm text-muted-foreground text-pretty">
            {subtitle ?? BRAND.tagline}
          </p>
        </div>
      </div>

      <div className="clerk-auth-root relative w-full max-w-[420px]">{children}</div>

      <p className="relative mt-8 text-center text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
