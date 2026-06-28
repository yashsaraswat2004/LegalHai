import { createServerFn } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";
import { z } from "zod";
import { auth } from "@clerk/tanstack-react-start/server";
import { APP_HOME } from "@/lib/routes";

const authInputSchema = z
  .object({
    redirectPath: z.string().optional(),
  })
  .optional();

/** Redirect signed-in users away from marketing / auth pages. Must run on the server. */
export const ensureGuestOnly = createServerFn().handler(async () => {
  const { isAuthenticated } = await auth();
  if (isAuthenticated) {
    throw redirect({ to: APP_HOME });
  }
});

export const requireAuth = createServerFn()
  .inputValidator((data: unknown) => authInputSchema.parse(data))
  .handler(async ({ data }) => {
    const { isAuthenticated, userId } = await auth();
    const redirectPath = data?.redirectPath ?? APP_HOME;

    if (!isAuthenticated || !userId) {
      throw redirect({
        to: "/sign-in",
        search: { redirect_url: redirectPath },
      });
    }

    return { userId };
  });
