import { BILLING_ERRORS } from "./constants";
import { isRazorpayConfigured } from "./razorpay.server";
import {
  buildBillingStatus,
  getOrCreateEntitlement,
  incrementAnalysisUsage,
} from "./store";
import type { BillingStatus } from "./types";

export class BillingLimitError extends Error {
  readonly code = BILLING_ERRORS.LIMIT_REACHED;

  constructor(message: string) {
    super(message);
    this.name = "BillingLimitError";
  }
}

export async function getBillingStatusForUser(userId: string): Promise<BillingStatus> {
  const paymentsConfigured = isRazorpayConfigured();
  const { row, tableExists } = await getOrCreateEntitlement(userId);

  if (!tableExists) {
    return {
      plan: "trial",
      planLabel: "Free trial",
      analysesUsed: 0,
      analysesLimit: null,
      analysesRemaining: null,
      canAnalyze: true,
      promoCode: null,
      hasPaidPlan: false,
      paymentsConfigured,
      periodEnd: null,
    };
  }

  return buildBillingStatus(row, paymentsConfigured);
}

export async function assertCanAnalyze(userId: string): Promise<BillingStatus> {
  const status = await getBillingStatusForUser(userId);
  if (!status.canAnalyze) {
    throw new BillingLimitError(
      `You've used all ${status.analysesLimit} free analyses. Upgrade to Pro or use promo code LAUNCH100 for 100% off.`,
    );
  }
  return status;
}

export async function recordAnalysisUsage(userId: string): Promise<void> {
  const status = await getBillingStatusForUser(userId);
  if (status.analysesLimit !== null) {
    await incrementAnalysisUsage(userId);
  }
}
