import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppNav } from "@/components/app/AppNav";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { PricingCards } from "@/components/billing/PricingCards";
import { requireAuth } from "@/lib/auth.functions";
import { getBillingStatus, redeemPromoCode } from "@/lib/billing/billing.functions";
import { LAUNCH_PROMO_CODE } from "@/lib/billing/constants";
import { useRazorpayCheckout } from "@/lib/billing/useRazorpayCheckout";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/billing")({
  beforeLoad: async () => requireAuth({ data: { redirectPath: "/billing" } }),
  loader: async () => getBillingStatus(),
  component: BillingPage,
  head: () => ({
    meta: [{ title: `Billing — ${BRAND.name}` }],
  }),
});

function BillingPage() {
  const status = Route.useLoaderData();
  const [checkoutLoading, setCheckoutLoading] = useState<"pro" | "single" | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const { pay } = useRazorpayCheckout({
    onSuccess: () => window.location.reload(),
  });

  const handleCheckout = async (plan: "pro" | "single") => {
    setCheckoutLoading(plan);
    try {
      await pay(plan);
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleRedeemPromo = async (code: string) => {
    setPromoLoading(true);
    try {
      await redeemPromoCode({ data: { code } });
      toast.success("Promo applied!");
      window.location.reload();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Invalid code";
      toast.error(msg.includes("PROMO_ALREADY") ? "Already used." : msg);
    } finally {
      setPromoLoading(false);
    }
  };

  const usageLabel =
    status.analysesLimit === null
      ? `${status.analysesUsed} analyses used · unlimited`
      : `${status.analysesUsed} / ${status.analysesLimit} free analyses used`;

  return (
    <div className="relative min-h-screen bg-background text-foreground grain">
      <AppNav />

      <main className="pt-28 pb-16 px-6 lg:px-10">
        <AuthGuard>
          <div className="mx-auto max-w-4xl space-y-10">
            <header>
              <p className="text-xs font-mono uppercase tracking-widest text-signal mb-2">
                Billing
              </p>
              <h1 className="font-display text-3xl md:text-4xl font-light">Your plan</h1>
            </header>

            <div className="rounded-3xl border border-white/10 bg-card/60 p-6 md:p-8 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current plan</p>
                  <p className="font-display text-2xl mt-1 flex items-center gap-2">
                    {status.planLabel}
                    {status.promoCode === LAUNCH_PROMO_CODE && (
                      <Sparkles className="h-5 w-5 text-signal" />
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">{usageLabel}</p>
                  {status.periodEnd && status.plan === "pro" && (
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      Renews / expires{" "}
                      {new Date(status.periodEnd).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-mono uppercase tracking-wider",
                    status.canAnalyze
                      ? "bg-emerald/15 text-emerald border border-emerald/25"
                      : "bg-red-500/15 text-red-300 border border-red-500/25",
                  )}
                >
                  {status.canAnalyze ? "Active" : "Limit reached"}
                </span>
              </div>

              {!status.canAnalyze && (
                <p className="text-sm text-muted-foreground border-t border-white/8 pt-4">
                  Upgrade below or redeem{" "}
                  <span className="font-mono text-signal">{LAUNCH_PROMO_CODE}</span> for 100% off.
                </p>
              )}
            </div>

            <PricingCards
              signedIn
              onCheckout={handleCheckout}
              onRedeemPromo={handleRedeemPromo}
              checkoutLoading={checkoutLoading}
              promoLoading={promoLoading}
            />

            <p className="text-center text-xs text-muted-foreground font-mono">
              <Link to="/summarize" className="hover:text-foreground transition">
                ← Back to analyze
              </Link>
            </p>
          </div>
        </AuthGuard>
      </main>
    </div>
  );
}
