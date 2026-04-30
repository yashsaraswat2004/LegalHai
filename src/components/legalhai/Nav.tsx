export function Nav({ onJoin }: { onJoin: () => void }) {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      {/* BIG HYPЕ BANNER */}
      <div className="bg-signal text-ink py-2.5 px-4 text-center relative overflow-hidden border-b border-ink/5">
        <div className="absolute inset-0 bg-white/10 animate-pulse" />
        <div className="relative flex items-center justify-center gap-3 text-[10px] sm:text-xs font-mono font-bold tracking-tight uppercase">
          <span className="flex h-1.5 w-1.5 rounded-full bg-ink animate-ping" />
          Something big is coming to Bharat — Launching Soon
          <span className="hidden md:inline opacity-50">✦</span>
          <span className="hidden md:inline">Join 1,000+ on the waitlist</span>
        </div>
      </div>

      <div className="bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-4 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2 group">
            <span className="relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-md">
              <img src="/logo.png" alt="LegalHai Logo" className="h-full w-full object-cover" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald animate-pulse" />
            </span>
            <span className="font-display text-xl tracking-tight">
              Legal<span className="italic font-light">Hai</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#story" aria-label="Learn about the problem LegalHai solves" className="hover:text-foreground transition">The story</a>
            <a href="#how" aria-label="Learn how to create contracts on WhatsApp" className="hover:text-foreground transition">How it works</a>
            <a href="#why" aria-label="Discover the benefits of using WhatsApp for legal tech" className="hover:text-foreground transition">Why WhatsApp</a>
            <a href="#faq" aria-label="Frequently asked questions about legal validity and pricing" className="hover:text-foreground transition">FAQ</a>
          </nav>

          <button
            onClick={onJoin}
            className="inline-flex items-center gap-2 rounded-full bg-paper px-4 py-1.5 text-sm font-medium text-ink hover:bg-paper/90 transition"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" />
            Join waitlist
          </button>
        </div>
      </div>
    </header>
  );
}
