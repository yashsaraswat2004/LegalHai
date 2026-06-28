import { Link } from "@tanstack/react-router";
import { ArrowDown, FileText, Languages, Shield } from "lucide-react";
import { Reveal } from "@/components/legalhai/Reveal";
import { BRAND, LABELS } from "@/lib/brand";
import { cn } from "@/lib/utils";

const HERO_FEATURES = [
  {
    icon: FileText,
    label: LABELS.summary,
    desc: "Plain-language breakdown of every clause",
  },
  {
    icon: Shield,
    label: LABELS.redFlags,
    desc: "Uneven terms surfaced before you commit",
  },
  {
    icon: Languages,
    label: LABELS.translation,
    desc: "Hindi, Tamil, Bengali, and 9+ more",
  },
] as const;

export function HomeHero() {
  return (
    <section className="relative min-h-[calc(100svh-4rem)] flex items-center pt-28 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-emerald/12 blur-[130px]" />
      <div className="pointer-events-none absolute top-20 right-0 h-[400px] w-[400px] rounded-full bg-signal/8 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-[280px] w-[min(900px,90vw)] rounded-full bg-emerald/6 blur-[100px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse at center, black 25%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 lg:px-10 text-center">
        <Reveal>
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-signal mb-6">
            {BRAND.platformType}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="font-display font-light text-[clamp(2.25rem,6vw,4.75rem)] leading-[1.05] tracking-tight text-balance max-w-4xl mx-auto">
            Understand every agreement{" "}
            <span className="italic text-emerald">before you sign.</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-8 text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed max-w-2xl mx-auto">
            Upload any agreement and LegalHai explains it in your language, highlights risky
            clauses, gives real-life examples, and helps you understand exactly what you&apos;re
            signing.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/sign-up"
              search={{ redirect_url: "/dashboard" }}
              className="group inline-flex items-center gap-3 rounded-full bg-signal text-ink px-8 py-4 text-base font-semibold hover:brightness-110 transition glow"
            >
              Get started free
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink text-signal group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-4 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-white/25 transition"
            >
              See how it works
            </a>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <div className="mt-14 lg:mt-20 mx-auto max-w-4xl">
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-px shadow-[0_0_100px_-40px_rgba(232,255,51,0.35)]">
              <div className="rounded-[calc(1.5rem-1px)] bg-card/80 backdrop-blur-md px-6 py-8 md:px-10 md:py-10">
                <div className="grid sm:grid-cols-3 gap-6 md:gap-8">
                  {HERO_FEATURES.map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="space-y-3 text-center">
                      <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-xl bg-signal/10 border border-signal/20">
                        <Icon className="h-4 w-4 text-signal" />
                      </div>
                      <p className="font-display text-lg text-foreground leading-snug">{label}</p>
                      <p className="text-sm text-muted-foreground text-pretty leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center">
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-signal/90">
                    {BRAND.beforeYouSign}
                  </span>
                  <span className="hidden sm:block h-3 w-px bg-white/15" aria-hidden />
                  <span className="text-sm text-muted-foreground font-display italic">
                    {BRAND.tagline}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function WhySection() {
  const pains = ["too long", "too technical", "full of legal jargon", "impossible for ordinary people"];

  return (
    <section id="why" className="py-24 lg:py-32 border-t border-white/5">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <Reveal>
          <h2 className="font-display text-3xl md:text-5xl font-light text-balance text-center">
            Why LegalHai?
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mt-8 text-lg md:text-xl text-center text-muted-foreground text-pretty leading-relaxed max-w-2xl mx-auto">
            Every day millions of people sign documents they don&apos;t fully understand.
          </p>
        </Reveal>
        <Reveal delay={180}>
          <p className="mt-4 text-center text-foreground/80 text-lg">
            Not because they don&apos;t care.
          </p>
        </Reveal>
        <Reveal delay={260}>
          <p className="mt-10 text-center text-muted-foreground mb-6">Because contracts are:</p>
          <ul className="grid sm:grid-cols-2 gap-3 max-w-xl mx-auto">
            {pains.map((p) => (
              <li
                key={p}
                className="rounded-xl border border-white/8 bg-card px-4 py-3 text-sm text-center text-foreground/90"
              >
                {p}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={340}>
          <p className="mt-12 text-center font-display text-2xl md:text-3xl text-signal">
            LegalHai changes that.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

const HOW_STEPS = [
  {
    step: "1",
    title: "Upload",
    body: "Upload any PDF or image.",
    detail: "Rent agreements, offer letters, bank forms — if you can photograph it, we can read it.",
  },
  {
    step: "2",
    title: "Choose Language",
    body: "Explain it in Hindi, English, and more.",
    detail: "12+ Indian languages. Everyday words, not textbook translations.",
  },
  {
    step: "3",
    title: "Understand",
    body: "Receive a complete breakdown:",
    bullets: [
      `${LABELS.summary}`,
      "Important clauses",
      LABELS.riskyClauses,
      "Real-world examples",
      "Questions to ask",
    ],
  },
];

export function HowSection() {
  return (
    <section id="how" className="py-24 lg:py-32 bg-card/20 border-y border-white/5">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <Reveal>
          <h2 className="font-display text-3xl md:text-5xl font-light text-center mb-16">
            How it works
          </h2>
        </Reveal>

        <div className="space-y-0">
          {HOW_STEPS.map((s, i) => (
            <Reveal key={s.step} delay={i * 100}>
              <div className="relative grid md:grid-cols-[auto_1fr] gap-6 md:gap-10 py-10 border-t border-white/8 first:border-t-0">
                {i < HOW_STEPS.length - 1 && (
                  <div className="hidden md:block absolute left-[1.65rem] top-full h-10 w-px bg-gradient-to-b from-signal/40 to-transparent" />
                )}
                <div className="flex flex-col items-center md:items-start">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-signal/10 border border-signal/20 font-mono text-lg text-signal">
                    {s.step}
                  </span>
                  {i < HOW_STEPS.length - 1 && (
                    <ArrowDown className="h-5 w-5 text-muted-foreground/30 mt-4 md:hidden" />
                  )}
                </div>
                <div className="space-y-3 text-center md:text-left">
                  <h3 className="font-display text-2xl md:text-3xl">{s.title}</h3>
                  <p className="text-lg text-foreground/90">{s.body}</p>
                  {s.detail && (
                    <p className="text-muted-foreground text-pretty leading-relaxed">{s.detail}</p>
                  )}
                  {s.bullets && (
                    <ul className="grid sm:grid-cols-2 gap-2 pt-2">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="text-emerald">✔</span> {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const DOC_TYPES = [
  { label: "Job Offer Letters", emoji: "📄" },
  { label: "Rent Agreements", emoji: "🏠" },
  { label: "Bank Documents", emoji: "🏦" },
  { label: "Government Forms", emoji: "📑" },
  { label: "Business Agreements", emoji: "🤝" },
  { label: "Freelance Contracts", emoji: "📜" },
];

export function DocumentsSection() {
  return (
    <section id="documents" className="py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <Reveal>
          <h2 className="font-display text-3xl md:text-5xl font-light text-center mb-4">
            What LegalHai explains
          </h2>
          <p className="text-center text-muted-foreground mb-14 max-w-xl mx-auto text-pretty">
            If it has your signature on the line, we can help you understand it first.
          </p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DOC_TYPES.map((d, i) => (
            <Reveal key={d.label} delay={i * 60}>
              <div className="group rounded-2xl border border-white/8 bg-card p-6 hover:border-signal/25 hover:bg-signal/[0.03] transition-all">
                <span className="text-3xl mb-4 block">{d.emoji}</span>
                <h3 className="font-display text-xl group-hover:text-signal transition-colors">
                  {d.label}
                </h3>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MoreThanTranslationSection() {
  return (
    <section className="py-24 lg:py-32 bg-card/20 border-y border-white/5">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <Reveal>
          <h2 className="font-display text-3xl md:text-5xl font-light text-center">
            More than {LABELS.translation.toLowerCase()}
          </h2>
          <p className="mt-6 text-center text-xl text-muted-foreground">
            Normal AI translates. <span className="text-foreground">LegalHai explains.</span>
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-14 grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/8 bg-background p-6 sm:p-8 space-y-4">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Original clause
              </p>
              <p className="font-mono text-sm text-muted-foreground/90 leading-relaxed italic">
                &ldquo;Employee shall provide thirty days written notice prior to voluntary
                resignation.&rdquo;
              </p>
            </div>
            <div className="rounded-2xl border border-emerald/20 bg-emerald/[0.04] p-6 sm:p-8 space-y-4">
              <p className="text-xs font-mono uppercase tracking-widest text-emerald">
                LegalHai — {LABELS.summary}
              </p>
              <p className="text-base leading-relaxed text-pretty">
                If you decide to leave your job, you must tell your company one month before your
                last working day.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-6 rounded-2xl border border-saffron/20 bg-saffron/[0.04] p-6 sm:p-8">
            <p className="text-xs font-mono uppercase tracking-widest text-saffron mb-3">
              Real-world example
            </p>
            <p className="text-base leading-relaxed text-pretty text-foreground/90">
              If you resign today and leave tomorrow, the company may deduct your salary or hold
              back your full and final settlement.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const TRUST_POINTS = [
  "No prompt writing",
  "No legal jargon",
  "Native language",
  "Storytelling explanations",
  "Real-life examples",
  "Human-first design",
];

export function TrustSection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center">
        <Reveal>
          <h2 className="font-display text-3xl md:text-5xl font-light mb-12">
            Why people trust LegalHai
          </h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 gap-3 text-left">
          {TRUST_POINTS.map((t, i) => (
            <Reveal key={t} delay={i * 50}>
              <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-card px-5 py-4">
                <span className="text-emerald text-lg">✔</span>
                <span className="text-foreground/90">{t}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const FUTURE_FEATURES = [
  { emoji: "🏗", title: "Agreement Builder", desc: "Generate legally structured agreements in minutes." },
  { emoji: "🎤", title: "Audio Explanation", desc: "Listen instead of reading." },
  { emoji: "✍", title: "Digital Signature", desc: "Sign directly inside LegalHai." },
  { emoji: "🧠", title: "AI Legal Assistant", desc: "Ask follow-up questions." },
  { emoji: "📚", title: "Smart Legal Vault", desc: "Store all agreements securely." },
  { emoji: "📱", title: "Mobile App", desc: "Analyze agreements on the go — coming soon.", muted: true },
];

export function ComingSoonSection() {
  return (
    <section id="coming-soon" className="py-24 lg:py-32 bg-card/20 border-y border-white/5">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <Reveal>
          <p className="text-xs font-mono uppercase tracking-widest text-signal text-center mb-4">
            Coming soon
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-light text-center mb-14">
            The full legal desk — one platform
          </h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FUTURE_FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 50}>
              <div
                className={cn(
                  "rounded-2xl border p-6 space-y-2 h-full",
                  f.muted
                    ? "border-white/5 bg-white/[0.02] opacity-70"
                    : "border-white/8 bg-card hover:border-white/15 transition",
                )}
              >
                <span className="text-2xl">{f.emoji}</span>
                <h3 className="font-display text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BeforeYouSignSection() {
  const steps = ["Understand.", "Question.", "Decide.", "Only then sign."];

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-signal/[0.03] to-transparent" />
      <div className="relative mx-auto max-w-3xl px-6 lg:px-10 text-center">
        <Reveal>
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-signal mb-4">
            Our signature
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-light tracking-tight">
            {BRAND.beforeYouSign}
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xl md:text-2xl font-display">
            {steps.map((s, i) => (
              <span key={s} className={cn(i === steps.length - 1 && "text-emerald italic")}>
                {s}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function VisionSection() {
  return (
    <section id="vision" className="py-24 lg:py-32 border-t border-white/5">
      <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center">
        <Reveal>
          <h2 className="font-display text-3xl md:text-5xl font-light mb-8">Our vision</h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="text-xl md:text-2xl text-muted-foreground text-pretty leading-relaxed">
            We believe no one should sign something they don&apos;t understand.
          </p>
        </Reveal>
        <Reveal delay={180}>
          <p className="mt-8 text-lg text-foreground/85 text-pretty leading-relaxed">
            LegalHai exists to make law understandable for everyone — from a student receiving
            their first offer letter to a farmer signing land papers.
          </p>
        </Reveal>
        <Reveal delay={260}>
          <p className="mt-10 text-sm font-mono text-muted-foreground/80 text-pretty leading-relaxed max-w-2xl mx-auto border-t border-white/8 pt-8">
            {BRAND.vision}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function EarlyAccessSection({ onJoin }: { onJoin: () => void }) {
  return (
    <section id="early-access" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-signal opacity-[0.12]" />
      <div className="relative mx-auto max-w-3xl px-6 lg:px-10 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-card/80 px-4 py-1.5 text-xs font-mono text-muted-foreground mb-6">
            <Shield className="h-3.5 w-3.5 text-emerald" />
            Early access
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-light text-balance">
            Help shape the future of legal understanding
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mt-6 text-lg text-muted-foreground text-pretty leading-relaxed">
            We&apos;re building LegalHai right now. Become one of our first users and tell us what
            would make you feel confident before every signature.
          </p>
        </Reveal>
        <Reveal delay={180}>
          <button
            type="button"
            onClick={onJoin}
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-signal text-ink px-8 py-4 text-base font-semibold hover:brightness-110 transition glow"
          >
            Join Waitlist
            <span>→</span>
          </button>
        </Reveal>
      </div>
    </section>
  );
}

export function HomeFooter() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
        <div className="flex items-center gap-2">
          <img src="/favicon.png" alt="" className="h-6 w-6 rounded" />
          <span>
            LegalHai · {BRAND.tagline}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>© {new Date().getFullYear()}</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" />
            Building in Bharat
          </span>
        </div>
      </div>
    </footer>
  );
}
