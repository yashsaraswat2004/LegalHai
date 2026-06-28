import { Link } from "@tanstack/react-router";

export function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="mx-auto max-w-6xl px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-md">
            <img src="/favicon.png" alt="LegalHai" className="h-full w-full object-cover" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald animate-pulse" />
          </span>
          <span className="font-display text-xl tracking-tight">
            Legal<span className="italic font-light">Hai</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#how" className="hover:text-foreground transition">
            How it works
          </a>
          <Link to="/pricing" className="hover:text-foreground transition">
            Pricing
          </Link>
          <a href="#documents" className="hover:text-foreground transition">
            What we explain
          </a>
          <a href="#early-access" className="hover:text-foreground transition">
            Early access
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            to="/sign-in"
            search={{ redirect_url: "/dashboard" }}
            className="text-sm text-muted-foreground hover:text-foreground transition px-2"
          >
            Sign in
          </Link>
          <Link
            to="/sign-up"
            search={{ redirect_url: "/dashboard" }}
            className="inline-flex items-center gap-2 rounded-full bg-signal text-ink px-4 py-2 text-sm font-semibold hover:brightness-110 transition"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
