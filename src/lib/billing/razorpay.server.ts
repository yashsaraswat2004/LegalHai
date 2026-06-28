import Razorpay from "razorpay";
import { createHmac, timingSafeEqual } from "node:crypto";
import { PRICING } from "./constants";
import type { CheckoutPlan } from "./types";

let razorpayClient: Razorpay | null | undefined;

export function getRazorpayKeyId(): string {
  return (
    process.env.RAZORPAY_KEY_ID?.trim() ||
    process.env.VITE_RAZORPAY_KEY_ID?.trim() ||
    ""
  );
}

export function isRazorpayConfigured(): boolean {
  return Boolean(getRazorpayKeyId() && process.env.RAZORPAY_KEY_SECRET?.trim());
}

export function getRazorpay(): Razorpay | null {
  if (razorpayClient !== undefined) return razorpayClient;

  const keyId = getRazorpayKeyId();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keyId || !keySecret) {
    razorpayClient = null;
    return null;
  }

  razorpayClient = new Razorpay({ key_id: keyId, key_secret: keySecret });
  return razorpayClient;
}

function amountPaiseForPlan(plan: CheckoutPlan): number {
  const inr = plan === "pro" ? PRICING.pro.priceInr : PRICING.single.priceInr;
  return inr * 100;
}

function descriptionForPlan(plan: CheckoutPlan): string {
  return plan === "pro"
    ? `${PRICING.pro.name} — ${PRICING.pro.priceLabel}/${PRICING.pro.period}`
    : PRICING.single.name;
}

export async function createRazorpayOrder(options: {
  userId: string;
  plan: CheckoutPlan;
}): Promise<
  | {
      orderId: string;
      amount: number;
      currency: string;
      keyId: string;
      description: string;
    }
  | { error: string }
> {
  const razorpay = getRazorpay();
  const keyId = getRazorpayKeyId();
  if (!razorpay || !keyId) return { error: "RAZORPAY_NOT_CONFIGURED" };

  const amount = amountPaiseForPlan(options.plan);
  const receipt = `lh_${options.userId.slice(-8)}_${Date.now()}`.slice(0, 40);

  try {
    const order = await razorpay.orders.create({
      amount,
      currency: PRICING.currency,
      receipt,
      notes: {
        clerk_user_id: options.userId,
        plan: options.plan,
      },
    });

    return {
      orderId: order.id,
      amount: Number(order.amount),
      currency: order.currency,
      keyId,
      description: descriptionForPlan(options.plan),
    };
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    return { error: "Failed to create payment order" };
  }
}

export function verifyRazorpayPaymentSignature(options: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!secret) return false;

  const body = `${options.orderId}|${options.paymentId}`;
  const expected = createHmac("sha256", secret).update(body).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(options.signature));
  } catch {
    return false;
  }
}

export function verifyRazorpayWebhook(payload: string, signature: string | null): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  if (!secret || !signature) return false;

  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}
