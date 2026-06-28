export type PlanId = "trial" | "pro" | "pro_promo" | "single";

export type BillingStatus = {
  plan: PlanId;
  planLabel: string;
  analysesUsed: number;
  analysesLimit: number | null;
  analysesRemaining: number | null;
  canAnalyze: boolean;
  promoCode: string | null;
  hasPaidPlan: boolean;
  paymentsConfigured: boolean;
  periodEnd: string | null;
};

export type CheckoutPlan = "pro" | "single";
