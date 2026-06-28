/** Public pricing — shown on marketing + /pricing */
export const PRICING = {
  currency: "INR",
  currencySymbol: "₹",
  trial: {
    id: "trial",
    name: "Free trial",
    priceInr: 0,
    analyses: 2,
    description: "2 document analyses — no card required",
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceInr: 49,
    priceLabel: "₹49",
    period: "month",
    description: "Unlimited analyses for individuals",
  },
  single: {
    id: "single",
    name: "Pay per document",
    priceInr: 19,
    priceLabel: "₹19",
    description: "One-time analysis — no subscription",
  },
} as const;

/** Launch promo — 100% off Pro */
export const LAUNCH_PROMO_CODE = "LAUNCH100";

export const PROMO_CODES: Record<
  string,
  {
    plan: "pro_promo";
    label: string;
    description: string;
    maxPerUser: number;
  }
> = {
  [LAUNCH_PROMO_CODE]: {
    plan: "pro_promo",
    label: "Launch special",
    description: "100% off Pro — unlimited analyses during launch",
    maxPerUser: 1,
  },
};

export const BILLING_ERRORS = {
  LIMIT_REACHED: "BILLING_LIMIT_REACHED",
  INVALID_PROMO: "INVALID_PROMO",
  PROMO_ALREADY_USED: "PROMO_ALREADY_USED",
  RAZORPAY_NOT_CONFIGURED: "RAZORPAY_NOT_CONFIGURED",
} as const;

/** Pro plan duration after Razorpay payment (days) */
export const PRO_PLAN_DAYS = 30;
