import { getSupabaseServer } from "@/lib/supabase.server";
import { PRICING, PROMO_CODES, PRO_PLAN_DAYS } from "./constants";
import type { BillingStatus, CheckoutPlan, PlanId } from "./types";

export type EntitlementRow = {
  clerk_user_id: string;
  plan: PlanId;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_subscription_status: string | null;
  promo_code: string | null;
  analyses_used: number;
  trial_limit: number;
  period_end: string | null;
  created_at: string;
  updated_at: string;
};

function planLabel(plan: PlanId, promoCode: string | null): string {
  if (plan === "pro_promo" && promoCode) {
    return PROMO_CODES[promoCode]?.label ?? "Pro (promo)";
  }
  if (plan === "pro") return PRICING.pro.name;
  if (plan === "single") return PRICING.single.name;
  return PRICING.trial.name;
}

function analysesLimitForPlan(plan: PlanId, trialLimit: number): number | null {
  if (plan === "trial") return trialLimit;
  return null;
}

export function buildBillingStatus(
  row: EntitlementRow | null,
  paymentsConfigured: boolean,
): BillingStatus {
  const plan: PlanId = row?.plan ?? "trial";
  const analysesUsed = row?.analyses_used ?? 0;
  const trialLimit = row?.trial_limit ?? PRICING.trial.analyses;
  const limit = analysesLimitForPlan(plan, trialLimit);
  const remaining = limit === null ? null : Math.max(0, limit - analysesUsed);
  const canAnalyze = limit === null || analysesUsed < limit;
  const hasPaidPlan =
    plan === "pro" ||
    plan === "pro_promo" ||
    (plan === "single" && canAnalyze) ||
    Boolean(row?.stripe_subscription_id && row.stripe_subscription_status === "active");

  return {
    plan,
    planLabel: planLabel(plan, row?.promo_code ?? null),
    analysesUsed,
    analysesLimit: limit,
    analysesRemaining: remaining,
    canAnalyze,
    promoCode: row?.promo_code ?? null,
    hasPaidPlan,
    paymentsConfigured,
    periodEnd: row?.period_end ?? null,
  };
}

export async function getOrCreateEntitlement(userId: string): Promise<{
  row: EntitlementRow | null;
  tableExists: boolean;
}> {
  const supabase = getSupabaseServer();
  if (!supabase) return { row: null, tableExists: false };

  const { data: existing, error: fetchError } = await supabase
    .from("user_entitlements")
    .select("*")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (fetchError) {
    const missingTable =
      fetchError.code === "PGRST205" ||
      fetchError.message.includes("Could not find the table") ||
      fetchError.message.includes("schema cache");
    if (missingTable) return { row: null, tableExists: false };
    console.error("Failed to fetch entitlement:", fetchError.message);
    return { row: null, tableExists: true };
  }

  if (existing) return { row: existing as EntitlementRow, tableExists: true };

  const { data: created, error: insertError } = await supabase
    .from("user_entitlements")
    .insert({
      clerk_user_id: userId,
      plan: "trial",
      analyses_used: 0,
      trial_limit: PRICING.trial.analyses,
    })
    .select("*")
    .single();

  if (insertError) {
    console.error("Failed to create entitlement:", insertError.message);
    return { row: null, tableExists: true };
  }

  return { row: created as EntitlementRow, tableExists: true };
}

export async function incrementAnalysisUsage(userId: string): Promise<void> {
  const supabase = getSupabaseServer();
  if (!supabase) return;

  const { row } = await getOrCreateEntitlement(userId);
  if (!row) return;

  await supabase
    .from("user_entitlements")
    .update({
      analyses_used: row.analyses_used + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("clerk_user_id", userId);
}

export async function redeemPromoForUser(
  userId: string,
  code: string,
): Promise<{ ok: true; row: EntitlementRow } | { ok: false; reason: string }> {
  const normalized = code.trim().toUpperCase();
  const promo = PROMO_CODES[normalized];
  if (!promo) return { ok: false, reason: "INVALID_PROMO" };

  const supabase = getSupabaseServer();
  if (!supabase) return { ok: false, reason: "STORAGE_UNAVAILABLE" };

  const { row } = await getOrCreateEntitlement(userId);
  if (!row) return { ok: false, reason: "STORAGE_UNAVAILABLE" };

  if (row.promo_code === normalized) {
    return { ok: false, reason: "PROMO_ALREADY_USED" };
  }

  const { data: updated, error } = await supabase
    .from("user_entitlements")
    .update({
      plan: promo.plan,
      promo_code: normalized,
      updated_at: new Date().toISOString(),
    })
    .eq("clerk_user_id", userId)
    .select("*")
    .single();

  if (error || !updated) {
    console.error("Promo redeem failed:", error?.message);
    return { ok: false, reason: "STORAGE_UNAVAILABLE" };
  }

  return { ok: true, row: updated as EntitlementRow };
}

export async function activateFromRazorpayPayment(
  userId: string,
  data: { orderId: string; paymentId: string; plan: CheckoutPlan },
): Promise<EntitlementRow | null> {
  const supabase = getSupabaseServer();
  if (!supabase) return null;

  await getOrCreateEntitlement(userId);

  if (data.plan === "single") {
    await grantSingleAnalysis(userId);
    const { row } = await getOrCreateEntitlement(userId);
    if (row) {
      await supabase
        .from("user_entitlements")
        .update({
          stripe_subscription_id: data.paymentId,
          stripe_subscription_status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("clerk_user_id", userId);
    }
    const refreshed = await getOrCreateEntitlement(userId);
    return refreshed.row;
  }

  const periodEnd = new Date();
  periodEnd.setDate(periodEnd.getDate() + PRO_PLAN_DAYS);

  const { data: updated, error } = await supabase
    .from("user_entitlements")
    .update({
      plan: "pro",
      stripe_subscription_id: data.paymentId,
      stripe_subscription_status: "active",
      period_end: periodEnd.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("clerk_user_id", userId)
    .select("*")
    .single();

  if (error) {
    console.error("Razorpay activation failed:", error.message);
    return null;
  }

  return updated as EntitlementRow;
}

export async function grantSingleAnalysis(userId: string): Promise<void> {
  const supabase = getSupabaseServer();
  if (!supabase) return;

  const { row } = await getOrCreateEntitlement(userId);
  if (!row) return;

  const trialLimit = row.trial_limit + 1;
  await supabase
    .from("user_entitlements")
    .update({
      plan: "single",
      trial_limit: trialLimit,
      updated_at: new Date().toISOString(),
    })
    .eq("clerk_user_id", userId);
}
