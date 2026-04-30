import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav } from "@/components/legalhai/Nav";
import { WhatsAppMock } from "@/components/legalhai/WhatsAppMock";
import { WaitlistDialog } from "@/components/legalhai/WaitlistDialog";
import { Reveal } from "@/components/legalhai/Reveal";

export const Route = createFileRoute("/")({
  component: Index,
});

const CONTRACTS = [
  "Rental Agreement",
  "किराया अनुबंध",
  "NDA",
  "Freelance Contract",
  "Vendor MoU",
  "ஒப்பந்தம்",
  "Founder Agreement",
  "Sale Deed",
  "ಒಪ್ಪಂದ",
  "Employment Letter",
  "Partnership Deed",
  "অঙ্গীকারপত্র",
];

const STEPS = [
  {
    n: "01",
    hi: "बोलो",
    en: "Tell us in plain words",
    body: "Open WhatsApp. Type or voice-note what you need — in Hindi, Tamil, Marathi, English, or any of 12 Indian languages.",
  },
  {
    n: "02",
    hi: "बनाओ",
    en: "Watch it draft itself",
    body: "Our legal AI assembles a lawyer-reviewed contract template, fills in your details, and asks only what's missing.",
  },
  {
    n: "03",
    hi: "हस्ताक्षर",
    en: "Sign without leaving the chat",
    body: "Aadhaar e-sign + e-stamp baked in. The other party signs by tapping a WhatsApp link. Done in under two minutes.",
  },
  {
    n: "04",
    hi: "तिजोरी",
    en: "Locked in your vault",
    body: "Encrypted, timestamped, and legally enforceable. Forward, download, or pull it up with a single message — forever.",
  },
];

function Index() {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const t = () =>
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata",
        }) + " IST"
      );
    t();
    const i = setInterval(t, 30000);
    return () => clearInterval(i);
  }, []);

  return (
    <div id="top" className="relative min-h-screen bg-background text-foreground grain">
      <Nav onJoin={() => setOpen(true)} />

      {/* HERO */}
      <section className="relative pt-32 pb-20 lg:pt-36 lg:pb-28 overflow-hidden">
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-[460px] w-[460px] rounded-full bg-emerald/15 blur-[120px]" />
        <div className="pointer-events-none absolute top-40 right-0 h-[420px] w-[420px] rounded-full bg-signal/10 blur-[140px]" />
        {/* faint grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground mb-10">
            <span className="h-2 w-2 rounded-full bg-emerald animate-pulse" />
            <span>VOL.01 / EARLY ACCESS / {time}</span>
            <span className="hidden sm:inline">— India's first WhatsApp-native legal stack</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* LEFT — copy */}
            <div className="lg:col-span-7">
              <h1 className="font-display font-light leading-[0.95] tracking-[-0.03em] text-[clamp(2.75rem,6.4vw,6.5rem)] text-balance">
                Your lawyer
                <br />
                <span className="italic">now lives</span> on
                <br />
                <span className="ink-underline relative whitespace-nowrap">
                  WhatsApp.
                  <svg viewBox="0 0 600 24" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M4 14 C 120 4, 240 22, 360 10 S 560 6, 596 14" />
                  </svg>
                </span>
              </h1>

              <p className="mt-8 text-base md:text-lg text-muted-foreground text-pretty leading-relaxed max-w-xl">
                LegalHai turns the world's most-used chat app into India's
                fastest legal desk. Create, sign and store contracts —
                <span className="text-foreground"> in your language, in two minutes.</span>
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setOpen(true)}
                  className="group relative inline-flex items-center gap-3 rounded-full bg-signal text-ink px-7 py-4 text-base font-medium hover:brightness-110 transition glow"
                >
                  Join the waitlist
                  <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-ink text-signal group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <a
                  href="#story"
                  className="text-sm text-muted-foreground hover:text-foreground transition flex items-center gap-2"
                >
                  <span className="h-px w-8 bg-paper/30" />
                  Scroll the story
                </a>
              </div>

              <div className="mt-10 flex items-center gap-6 text-xs font-mono text-muted-foreground">
                <div>
                  <div className="text-foreground text-base font-display">2<span className="text-signal">m</span></div>
                  avg time
                </div>
                <div className="h-8 w-px bg-border" />
                <div>
                  <div className="text-foreground text-base font-display">12</div>
                  Indian languages
                </div>
                <div className="h-8 w-px bg-border" />
                <div>
                  <div className="text-foreground text-base font-display">₹0</div>
                  to start
                </div>
              </div>
            </div>

            {/* RIGHT — phone */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <WhatsAppMock />
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-border py-6 overflow-hidden bg-card/40">
        <div className="marquee text-2xl md:text-4xl font-display italic">
          {[...CONTRACTS, ...CONTRACTS].map((c, i) => (
            <span key={i} className="flex items-center gap-12 text-muted-foreground">
              {c}
              <span className="text-signal">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* STORY / PROBLEM */}
      <section id="story" className="relative py-32 lg:py-44">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <Reveal>
            <div className="text-xs font-mono text-signal uppercase tracking-widest mb-6">Chapter one — the problem</div>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="font-display text-4xl md:text-7xl font-light leading-[1.05] tracking-tight text-balance max-w-4xl">
              India runs on <span className="italic">trust</span> — and trust runs on
              <span className="text-signal"> paperwork nobody reads.</span>
            </h2>
          </Reveal>

          <div className="mt-20 grid md:grid-cols-3 gap-8">
            {[
              {
                stat: "₹4,200",
                label: "Average lawyer fee for a one-page rental agreement.",
              },
              {
                stat: "6 days",
                label: "Time wasted between draft, print, sign and stamp.",
              },
              {
                stat: "73%",
                label: "Of small business deals in India still happen on a handshake — unenforceable.",
              },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 120} className="border-t border-border pt-6">
                <div className="font-display text-5xl md:text-6xl text-signal mb-3">{s.stat}</div>
                <p className="text-muted-foreground text-pretty leading-relaxed">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="relative py-32 lg:py-44 bg-card/30 border-y border-border">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <Reveal>
            <div className="text-xs font-mono text-signal uppercase tracking-widest mb-6">Chapter two — the magic</div>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="font-display text-4xl md:text-7xl font-light leading-[1.05] tracking-tight text-balance max-w-4xl mb-20">
              Four taps. <span className="italic">No app to download.</span>
            </h2>
          </Reveal>

          <div className="space-y-2">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 100}>
                <div className="group grid md:grid-cols-12 gap-6 py-8 border-t border-border hover:bg-secondary/40 transition rounded-lg px-2 md:px-4">
                  <div className="md:col-span-1 font-mono text-sm text-muted-foreground">{step.n}</div>
                  <div className="md:col-span-3">
                    <div className="font-display text-3xl text-signal">{step.hi}</div>
                    <div className="text-sm text-muted-foreground mt-1">{step.en}</div>
                  </div>
                  <div className="md:col-span-7 text-lg text-pretty text-foreground/90 leading-relaxed">
                    {step.body}
                  </div>
                  <div className="md:col-span-1 flex md:justify-end items-start text-muted-foreground group-hover:text-signal group-hover:translate-x-1 transition">→</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY WHATSAPP */}
      <section id="why" className="relative py-32 lg:py-44">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="text-xs font-mono text-signal uppercase tracking-widest mb-6">Chapter three — why here</div>
            </Reveal>
            <Reveal delay={120}>
              <h2 className="font-display text-4xl md:text-6xl font-light leading-[1.05] tracking-tight text-balance">
                500 million Indians already
                <span className="italic"> open WhatsApp before they open their eyes.</span>
              </h2>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-8 text-lg text-muted-foreground text-pretty leading-relaxed">
                We didn't build another portal you'll forget to log into.
                We slipped a full legal department into the chat thread you
                already use to send memes, money, and good-mornings.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {[
              { t: "Aadhaar e-Sign", d: "UIDAI-grade signing, baked into WhatsApp. No printer required.", c: "bg-card" },
              { t: "Pan-India e-Stamp", d: "Auto-paid stamp duty for every state. No SHCIL queues.", c: "bg-signal text-ink" },
              { t: "12 Languages", d: "हिन्दी · தமிழ் · తెలుగు · বাংলা · मराठी · ગુજરાતી · ಕನ್ನಡ · മലയാളം · ਪੰਜਾਬੀ · ଓଡ଼ିଆ · অসমীয়া · English", c: "bg-card sm:col-span-2" },
              { t: "Court-admissible", d: "Every contract carries a tamper-proof audit trail.", c: "bg-emerald text-ink" },
              { t: "Forever vault", d: "End-to-end encrypted storage. Recall any contract by typing its name.", c: "bg-card" },
            ].map((f, i) => (
              <Reveal key={i} delay={i * 80} className={`rounded-2xl border border-border p-6 ${f.c}`}>
                <div className="font-display text-2xl mb-2">{f.t}</div>
                <p className={`text-sm leading-relaxed ${f.c.includes("ink") ? "opacity-80" : "text-muted-foreground"}`}>
                  {f.d}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL / QUOTE */}
      <section className="py-32 border-y border-border bg-card/40">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <Reveal>
            <div className="text-xs font-mono text-signal uppercase tracking-widest mb-8">Heard during early trials</div>
          </Reveal>
          <Reveal delay={120}>
            <blockquote className="font-display text-3xl md:text-5xl font-light leading-[1.15] tracking-tight text-balance">
              <span className="text-signal text-6xl leading-none mr-2">“</span>
              I rented out my Pune flat to a tenant in Hyderabad. We never met.
              The whole thing — draft, stamp, signatures — happened on
              WhatsApp before my chai got cold.
              <span className="text-signal text-6xl leading-none ml-1">”</span>
            </blockquote>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
              <div className="h-10 w-10 rounded-full bg-gradient-warm" />
              <div>
                <div className="text-foreground">Ananya R.</div>
                <div>Landlord · Pune · pilot user</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-32 lg:py-44">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <Reveal>
            <div className="text-xs font-mono text-signal uppercase tracking-widest mb-6">Last chapter — the small print</div>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="font-display text-4xl md:text-6xl font-light leading-[1.05] tracking-tight mb-16 text-balance">
              Questions <span className="italic">you'd whisper to a lawyer.</span>
            </h2>
          </Reveal>

          <div className="divide-y divide-border border-y border-border">
            {[
              { q: "Is a WhatsApp-signed contract actually legal?", a: "Yes. Aadhaar e-Sign is recognised under the IT Act, 2000 and Indian Evidence Act. Every LegalHai contract carries a tamper-proof audit trail and stamp duty paid for the relevant state." },
              { q: "Which contracts can I create today?", a: "Rental, NDA, freelance, vendor MoU, employment, founder & partnership agreements at launch. New templates ship every week, vetted by practising advocates." },
              { q: "Do both parties need a LegalHai account?", a: "No. The other party signs by tapping a WhatsApp link. They never download anything." },
              { q: "What does it cost?", a: "Joining the waitlist is free. At launch, we'll have a generous free tier and pay-per-contract pricing — no subscriptions, no surprise lawyer bills." },
              { q: "Where is my data stored?", a: "End-to-end encrypted, hosted in India, never sold. You can delete or export everything at any time." },
            ].map((f, i) => (
              <FaqItem key={i} q={f.q} a={f.a} idx={i} />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-32 lg:py-44 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-signal opacity-90" />
        <div className="pointer-events-none absolute inset-0 grain" />
        <div className="relative mx-auto max-w-5xl px-6 lg:px-10 text-ink text-center">
          <Reveal>
            <div className="text-xs font-mono uppercase tracking-widest mb-6 opacity-70">Doors open soon</div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="font-display font-light text-5xl md:text-8xl leading-[0.95] tracking-tight text-balance">
              Stop printing.
              <br />
              <span className="italic">Start chatting.</span>
            </h2>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-8 text-lg md:text-xl max-w-xl mx-auto opacity-80 text-pretty">
              The first 10 names on the waitlist get lifetime free contracts and a personal launch call from our founder.
            </p>
          </Reveal>
          <Reveal delay={360}>
            <button
              onClick={() => setOpen(true)}
              className="mt-10 inline-flex items-center gap-3 rounded-full bg-ink text-paper px-8 py-4 text-base font-medium hover:bg-ink/90 transition"
            >
              Reserve my spot
              <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-signal text-ink">→</span>
            </button>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center overflow-hidden rounded bg-signal">
              <img src="/logo.png" alt="LegalHai Logo" className="h-full w-full object-cover" />
            </span>
            LegalHai · Made with ❤ in Bharat
          </div>
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()}</span>
            <span>Privacy</span>
            <span>Terms</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" />
              Pre-launch
            </span>
          </div>
        </div>
      </footer>

      <WaitlistDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

function FaqItem({ q, a, idx }: { q: string; a: string; idx: number }) {
  const [open, setOpen] = useState(idx === 0);
  return (
    <div className="py-6">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start justify-between gap-6 text-left group"
      >
        <span className="font-display text-xl md:text-2xl text-balance group-hover:text-signal transition">
          {q}
        </span>
        <span className={`mt-1 text-signal font-mono text-xl transition-transform ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      <div
        className="grid transition-all duration-500 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="pt-4 text-muted-foreground text-pretty leading-relaxed max-w-3xl">{a}</p>
        </div>
      </div>
    </div>
  );
}
