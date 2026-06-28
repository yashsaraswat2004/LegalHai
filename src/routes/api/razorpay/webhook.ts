import { createFileRoute } from "@tanstack/react-router";
import {
  activateFromRazorpayPayment,
} from "@/lib/billing/store";
import { verifyRazorpayWebhook } from "@/lib/billing/razorpay.server";
import type { CheckoutPlan } from "@/lib/billing/types";

export const Route = createFileRoute("/api/razorpay/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const payload = await request.text();
        const signature = request.headers.get("x-razorpay-signature");

        if (!verifyRazorpayWebhook(payload, signature)) {
          return new Response("Invalid signature", { status: 400 });
        }

        try {
          const event = JSON.parse(payload) as {
            event: string;
            payload?: {
              payment?: {
                entity?: {
                  id: string;
                  order_id: string;
                  status: string;
                  notes?: { clerk_user_id?: string; plan?: string };
                };
              };
            };
          };

          if (event.event === "payment.captured") {
            const payment = event.payload?.payment?.entity;
            const userId = payment?.notes?.clerk_user_id;
            const plan = (payment?.notes?.plan ?? "pro") as CheckoutPlan;

            if (userId && payment?.id && payment.order_id && payment.status === "captured") {
              await activateFromRazorpayPayment(userId, {
                orderId: payment.order_id,
                paymentId: payment.id,
                plan,
              });
            }
          }
        } catch (err) {
          console.error("Razorpay webhook error:", err);
          return new Response("Handler failed", { status: 500 });
        }

        return Response.json({ received: true });
      },
    },
  },
});
