import { Link } from "@tanstack/react-router";
import { UserButton } from "@clerk/tanstack-react-start";
import { CreditCard, FileSearch, LayoutDashboard } from "lucide-react";
import { clerkUserButtonAppearance } from "@/lib/clerk-appearance";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

interface AppNavProps {
  active?: "dashboard" | "summarize";
}

export function AppNav({ active }: AppNavProps) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
        <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
          <span className="relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-md">
            <img src="/favicon.png" alt="LegalHai" className="h-full w-full object-cover" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald animate-pulse" />
          </span>
          <span className="font-display text-xl tracking-tight">
            Legal<span className="italic font-light">Hai</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/dashboard"
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 sm:px-4 py-2 text-sm transition",
              active === "dashboard"
                ? "bg-white/10 text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">My documents</span>
          </Link>
          <Link
            to="/summarize"
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 sm:px-4 py-2 text-sm transition",
              active === "summarize"
                ? "bg-signal text-ink font-semibold"
                : "text-muted-foreground hover:text-foreground border border-white/10",
            )}
          >
            <FileSearch className="h-4 w-4" />
            <span className="hidden sm:inline">Analyze new</span>
            <span className="sm:hidden">New</span>
          </Link>
          <Link
            to="/billing"
            className="hidden md:inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <CreditCard className="h-4 w-4" />
            Billing
          </Link>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <UserButton
            appearance={clerkUserButtonAppearance}
            userProfileProps={{ appearance: clerkUserButtonAppearance }}
          />
        </div>
      </div>
      {active === "summarize" && (
        <div className="border-t border-white/5 py-1.5 text-center">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            {BRAND.beforeYouSign}
          </p>
        </div>
      )}
    </header>
  );
}
