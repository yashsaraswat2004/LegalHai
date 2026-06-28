import { Link } from "@tanstack/react-router";
import { Check, CreditCard, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/legalhai/Reveal";
import { LAUNCH_PROMO_CODE, PRICING } from "@/lib/billing/constants";
import { cn } from "@/lib/utils";

type PricingCardsProps = {
  compact?: boolean;
  signedIn?: boolean;
  onCheckout?: (plan: "pro" | "single") => void;
  onRedeemPromo?: (code: string) => Promise<void>;
  checkoutLoading?: "pro" | "single" | null;
  promoLoading?: boolean;
};

const PRO_FEATURES = [
  "Unlimited document analyses",
  "12+ Indian languages",
  "Risk highlights & clause map",
  "Saved history on dashboard",
] as const;

const TRIAL_FEATURES = [
  `${PRICING.trial.analyses} analyses — no card`,
  "Full report quality",
  "Upgrade anytime",
] as const;

export function PricingCards({
  compact = false,
  signedIn = false,
  onCheckout,
  onRedeemPromo,
  checkoutLoading = null,
  promoLoading = false,
}: PricingCardsProps) {
  const [promoInput, setPromoInput] = useState(LAUNCH_PROMO_CODE);

  const handleRedeem = async () => {
    if (!onRedeemPromo || !promoInput.trim()) return;
    await onRedeemPromo(promoInput.trim());
  };

  return (
    <div className={cn("space-y-10", compact && "space-y-8")}>
      <div
        className={cn(
          "grid gap-6",
          compact ? "md:grid-cols-2" : "lg:grid-cols-3",
        )}
      >
        {/* Trial */}
        <Reveal>
          <div className="relative h-full rounded-3xl border border-white/10 bg-card/60 p-6 md:p-8 flex flex-col">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
              Start here
            </p>
            <h3 className="font-display text-2xl font-light">{PRICING.trial.name}</h3>
            <p className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-4xl">Free</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{PRICING.trial.description}</p>
            <ul className="mt-6 space-y-3 flex-1">
              {TRIAL_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-emerald shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to={signedIn ? "/summarize" : "/sign-up"}
              search={signedIn ? undefined : { redirect_url: "/summarize" }}
              className="mt-8 inline-flex justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-medium hover:border-white/30 transition"
            >
              {signedIn ? "Start analyzing" : "Start free trial"}
            </Link>
          </div>
        </Reveal>

        {/* Pro */}
        <Reveal delay={80}>
          <div className="relative h-full rounded-3xl border border-signal/40 bg-gradient-to-b from-signal/10 to-card/80 p-6 md:p-8 flex flex-col shadow-[0_0_80px_-30px_rgba(232,255,51,0.4)]">
            <div className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-signal text-ink px-3 py-1 text-[10px] font-mono uppercase tracking-wider font-semibold">
              <Sparkles className="h-3 w-3" />
              Launch offer
            </div>
            <p className="text-xs font-mono uppercase tracking-widest text-signal mb-3">
              Best value
            </p>
            <h3 className="font-display text-2xl font-light">{PRICING.pro.name}</h3>
            <p className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-4xl">{PRICING.pro.priceLabel}</span>
              <span className="text-muted-foreground text-sm">/{PRICING.pro.period}</span>
            </p>
            <p className="mt-2 text-sm text-emerald">
              Use code <span className="font-mono font-semibold">{LAUNCH_PROMO_CODE}</span> for 100%
              off now
            </p>
            <ul className="mt-6 space-y-3 flex-1">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-signal shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            {signedIn && onCheckout ? (
              <button
                type="button"
                disabled={checkoutLoading === "pro"}
                onClick={() => onCheckout("pro")}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-signal text-ink px-6 py-3 text-sm font-semibold hover:brightness-110 transition disabled:opacity-60"
              >
                <CreditCard className="h-4 w-4" />
                {checkoutLoading === "pro" ? "Opening Razorpay…" : "Pay with Razorpay"}
              </button>
            ) : (
              <Link
                to="/sign-up"
                search={{ redirect_url: "/pricing" }}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-signal text-ink px-6 py-3 text-sm font-semibold hover:brightness-110 transition"
              >
                <CreditCard className="h-4 w-4" />
                Get Pro
              </Link>
            )}
          </div>
        </Reveal>

        {/* Single — hide in compact mode on home */}
        {!compact && (
          <Reveal delay={160}>
            <div className="relative h-full rounded-3xl border border-white/10 bg-card/60 p-6 md:p-8 flex flex-col">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
                One-off
              </p>
              <h3 className="font-display text-2xl font-light">{PRICING.single.name}</h3>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl">{PRICING.single.priceLabel}</span>
                <span className="text-muted-foreground text-sm">/document</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{PRICING.single.description}</p>
              <ul className="mt-6 space-y-3 flex-1">
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4 text-emerald shrink-0 mt-0.5" />
                  Pay only when you need one more analysis
                </li>
              </ul>
              {signedIn && onCheckout ? (
                <button
                  type="button"
                  disabled={checkoutLoading === "single"}
                  onClick={() => onCheckout("single")}
                  className="mt-8 inline-flex justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-medium hover:border-white/30 transition disabled:opacity-60"
                >
                  {checkoutLoading === "single" ? "Opening checkout…" : "Pay per document"}
                </button>
              ) : (
                <Link
                  to="/sign-up"
                  search={{ redirect_url: "/pricing" }}
                  className="mt-8 inline-flex justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-medium hover:border-white/30 transition"
                >
                  Sign up to pay
                </Link>
              )}
            </div>
          </Reveal>
        )}
      </div>

      {/* Promo redeem */}
      {signedIn && onRedeemPromo && (
        <Reveal delay={200}>
          <div className="rounded-2xl border border-white/10 bg-card/50 p-6 md:p-8 max-w-xl mx-auto">
            <p className="text-xs font-mono uppercase tracking-widest text-signal mb-2">
              Launch promo
            </p>
            <h4 className="font-display text-xl font-light mb-2">Redeem 100% off</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Enter <span className="font-mono text-foreground">{LAUNCH_PROMO_CODE}</span> for
              unlimited analyses during our launch — no payment required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                placeholder="Promo code"
                className="flex-1 rounded-xl border border-white/10 bg-background/80 px-4 py-3 text-sm font-mono uppercase tracking-wider focus:outline-none focus:border-signal/50"
              />
              <button
                type="button"
                onClick={handleRedeem}
                disabled={promoLoading}
                className="rounded-xl bg-emerald/20 border border-emerald/30 text-emerald px-6 py-3 text-sm font-semibold hover:bg-emerald/30 transition disabled:opacity-60"
              >
                {promoLoading ? "Applying…" : "Apply code"}
              </button>
            </div>
          </div>
        </Reveal>
      )}
    </div>
  );
}

export function PricingSection({ id = "pricing" }: { id?: string }) {
  return (
    <section id={id} className="py-24 lg:py-32 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <Reveal>
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-signal mb-4 text-center">
            Simple pricing
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-light text-center text-balance">
            Try free. Pay only when you need more.
          </h2>
          <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto text-pretty">
            Start with {PRICING.trial.analyses} free analyses. Pro is just {PRICING.pro.priceLabel}
            /month — or use <span className="font-mono text-signal">{LAUNCH_PROMO_CODE}</span> for
            100% off at launch.
          </p>
        </Reveal>
        <div className="mt-14">
          <PricingCards compact />
        </div>
        <Reveal delay={120}>
          <p className="mt-10 text-center text-xs font-mono text-muted-foreground">
            Secure payments via Razorpay · UPI, cards & wallets
          </p>
        </Reveal>
      </div>
    </section>
  );
}
