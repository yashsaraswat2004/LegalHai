import { Link } from "@tanstack/react-router";
import { UserButton } from "@clerk/tanstack-react-start";
import { FileSearch, Home } from "lucide-react";
import { clerkUserButtonAppearance } from "@/lib/clerk-appearance";
import { BRAND } from "@/lib/brand";

export function SummarizerNav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-md">
            <img src="/favicon.png" alt="LegalHai" className="h-full w-full object-cover" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald animate-pulse" />
          </span>
          <span className="font-display text-xl tracking-tight">
            Legal<span className="italic font-light">Hai</span>
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
          <FileSearch className="h-3.5 w-3.5 text-signal" />
          {BRAND.beforeYouSign}
        </div>

        <div className="flex items-center gap-2">
          <UserButton
            appearance={clerkUserButtonAppearance}
            userProfileProps={{ appearance: clerkUserButtonAppearance }}
          />
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
