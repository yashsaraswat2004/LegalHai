export function Nav({ onJoin }: { onJoin: () => void }) {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-5 flex items-center justify-between">
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
          <a href="#story" className="hover:text-foreground transition">The story</a>
          <a href="#how" className="hover:text-foreground transition">How it works</a>
          <a href="#why" className="hover:text-foreground transition">Why WhatsApp</a>
          <a href="#faq" className="hover:text-foreground transition">FAQ</a>
        </nav>

        <button
          onClick={onJoin}
          className="group relative inline-flex items-center gap-2 rounded-full bg-paper text-ink px-4 py-2 text-sm font-medium hover:bg-signal transition-colors"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald group-hover:bg-ink transition-colors" />
          Join waitlist
        </button>
      </div>
    </header>
  );
}
