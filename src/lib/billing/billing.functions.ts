import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAuth } from "@/lib/auth.functions";
import { BILLING_ERRORS } from "./constants";
import { getBillingStatusForUser } from "./entitlements";
import {
  createRazorpayOrder,
  getRazorpayKeyId,
  isRazorpayConfigured,
  verifyRazorpayPaymentSignature,
} from "./razorpay.server";
import {
  activateFromRazorpayPayment,
  buildBillingStatus,
  getOrCreateEntitlement,
  redeemPromoForUser,
} from "./store";
import type { CheckoutPlan } from "./types";

export const getBillingStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { userId } = await requireAuth({ data: { redirectPath: "/billing" } });
  return getBillingStatusForUser(userId);
});

export const getPaymentConfig = createServerFn({ method: "GET" }).handler(async () => ({
  razorpayKeyId: getRazorpayKeyId(),
  paymentsConfigured: isRazorpayConfigured(),
}));

const checkoutSchema = z.object({
  plan: z.enum(["pro", "single"]),
});

/** Creates a Razorpay order — client opens checkout modal with the response */
export const createPaymentOrder = createServerFn({ method: "POST" })
  .inputValidator(checkoutSchema)
  .handler(async ({ data }) => {
    const { userId } = await requireAuth({ data: { redirectPath: "/pricing" } });

    if (!isRazorpayConfigured()) {
      throw new Error(BILLING_ERRORS.RAZORPAY_NOT_CONFIGURED);
    }

    const result = await createRazorpayOrder({
      userId,
      plan: data.plan as CheckoutPlan,
    });

    if ("error" in result) throw new Error(result.error);
    return result;
  });

const verifySchema = z.object({
  orderId: z.string(),
  paymentId: z.string(),
  signature: z.string(),
  plan: z.enum(["pro", "single"]),
});

export const verifyRazorpayPayment = createServerFn({ method: "POST" })
  .inputValidator(verifySchema)
  .handler(async ({ data }) => {
    const { userId } = await requireAuth({ data: { redirectPath: "/billing" } });

    const valid = verifyRazorpayPaymentSignature({
      orderId: data.orderId,
      paymentId: data.paymentId,
      signature: data.signature,
    });

    if (!valid) throw new Error("Payment verification failed");

    const row = await activateFromRazorpayPayment(userId, {
      orderId: data.orderId,
      paymentId: data.paymentId,
      plan: data.plan,
    });

    return buildBillingStatus(row, isRazorpayConfigured());
  });

const promoSchema = z.object({
  code: z.string().min(3).max(32),
});

export const redeemPromoCode = createServerFn({ method: "POST" })
  .inputValidator(promoSchema)
  .handler(async ({ data }) => {
    const { userId } = await requireAuth({ data: { redirectPath: "/pricing" } });
    const result = await redeemPromoForUser(userId, data.code);

    if (!result.ok) {
      if (result.reason === "INVALID_PROMO") {
        throw new Error(BILLING_ERRORS.INVALID_PROMO);
      }
      if (result.reason === "PROMO_ALREADY_USED") {
        throw new Error(BILLING_ERRORS.PROMO_ALREADY_USED);
      }
      throw new Error("Could not apply promo code. Try again.");
    }

    return buildBillingStatus(result.row, isRazorpayConfigured());
  });
