import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@clerk/tanstack-react-start";
import { useState } from "react";
import { toast } from "sonner";
import { PricingCards } from "@/components/billing/PricingCards";
import { Nav } from "@/components/legalhai/Nav";
import { AppNav } from "@/components/app/AppNav";
import { HomeFooter } from "@/components/home/HomeSections";
import { buildPageMeta } from "@/lib/seo";
import { getBillingStatus, redeemPromoCode } from "@/lib/billing/billing.functions";
import { BILLING_ERRORS, LAUNCH_PROMO_CODE } from "@/lib/billing/constants";
import { useRazorpayCheckout } from "@/lib/billing/useRazorpayCheckout";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () =>
    buildPageMeta({
      title: "Pricing — AI Contract Analysis from ₹49/month",
      description: `Start with 2 free document analyses. Pro plan ₹49/month for unlimited contract reviews. Per-document ₹19. Use promo ${LAUNCH_PROMO_CODE} for 100% off at launch.`,
      path: "/pricing",
    }),
});

function PricingPage() {
  const { isSignedIn } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState<"pro" | "single" | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const { pay } = useRazorpayCheckout({
    onSuccess: () => {
      window.location.href = "/billing?checkout=success";
    },
  });

  const handleCheckout = async (plan: "pro" | "single") => {
    setCheckoutLoading(plan);
    try {
      await pay(plan);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Checkout failed";
      if (msg !== BILLING_ERRORS.RAZORPAY_NOT_CONFIGURED) {
        /* toast shown in hook */
      }
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleRedeemPromo = async (code: string) => {
    setPromoLoading(true);
    try {
      await redeemPromoCode({ data: { code } });
      toast.success("Promo applied! You have unlimited analyses.");
      await getBillingStatus();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Invalid code";
      if (msg === BILLING_ERRORS.INVALID_PROMO) {
        toast.error("Invalid promo code.");
      } else if (msg === BILLING_ERRORS.PROMO_ALREADY_USED) {
        toast.error("You've already used this promo code.");
      } else {
        toast.error(msg);
      }
    } finally {
      setPromoLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground grain">
      {isSignedIn ? <AppNav /> : <Nav />}

      <main className={isSignedIn ? "pt-28 pb-20" : "pt-24 pb-20"}>
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="text-center mb-14">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-signal mb-4">
              Pricing
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-balance">
              Understand agreements for less than a cup of chai.
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              {isSignedIn ? (
                <>
                  Redeem <span className="font-mono text-signal">{LAUNCH_PROMO_CODE}</span> below, or
                  pay via Razorpay.{" "}
                  <Link to="/billing" className="text-emerald hover:underline">
                    View billing
                  </Link>
                </>
              ) : (
                <>
                  Sign up for 2 free analyses. Launch promo{" "}
                  <span className="font-mono text-signal">{LAUNCH_PROMO_CODE}</span> gives 100% off
                  Pro.
                </>
              )}
            </p>
          </div>

          <PricingCards
            signedIn={isSignedIn ?? false}
            onCheckout={isSignedIn ? handleCheckout : undefined}
            onRedeemPromo={isSignedIn ? handleRedeemPromo : undefined}
            checkoutLoading={checkoutLoading}
            promoLoading={promoLoading}
          />
        </div>
      </main>

      {!isSignedIn && <HomeFooter />}
    </div>
  );
}
