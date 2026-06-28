import { useUser } from "@clerk/tanstack-react-start";
import { toast } from "sonner";
import {
  createPaymentOrder,
  verifyRazorpayPayment,
} from "@/lib/billing/billing.functions";
import { BILLING_ERRORS } from "@/lib/billing/constants";
import { openRazorpayCheckout } from "@/lib/billing/razorpay-checkout";
import type { CheckoutPlan } from "@/lib/billing/types";

export function useRazorpayCheckout(options?: {
  onSuccess?: () => void;
}) {
  const { user } = useUser();

  const pay = async (plan: CheckoutPlan) => {
    try {
      const order = await createPaymentOrder({ data: { plan } });

      await openRazorpayCheckout({
        keyId: order.keyId,
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        description: order.description,
        userName: user?.fullName,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        onSuccess: async (response) => {
          try {
            await verifyRazorpayPayment({
              data: {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                plan,
              },
            });
            toast.success("Payment successful! Your plan is active.");
            options?.onSuccess?.();
          } catch {
            toast.error("Payment received but verification failed. Contact support.");
          }
        },
        onDismiss: () => {
          toast.message("Payment cancelled");
        },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Payment failed";
      if (msg === BILLING_ERRORS.RAZORPAY_NOT_CONFIGURED) {
        toast.error("Payments are being set up. Use promo code LAUNCH100 for free access.");
      } else {
        toast.error(msg);
      }
      throw err;
    }
  };

  return { pay };
}
