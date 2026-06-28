import { createFileRoute } from "@tanstack/react-router";

import { SignIn } from "@clerk/tanstack-react-start";

import { ClerkAuthLayout } from "@/components/auth/ClerkAuthLayout";

import { clerkAppearance, clerkLocalization } from "@/lib/clerk-appearance";

import { BRAND } from "@/lib/brand";

import { APP_HOME } from "@/lib/routes";

import { ensureGuestOnly } from "@/lib/auth.functions";



type SignInSearch = { redirect_url?: string };



export const Route = createFileRoute("/sign-in")({

  beforeLoad: async () => ensureGuestOnly(),

  validateSearch: (search: Record<string, unknown>): SignInSearch => ({

    redirect_url: typeof search.redirect_url === "string" ? search.redirect_url : APP_HOME,

  }),

  component: SignInPage,

  head: () => ({

    meta: [{ title: `Sign in — ${BRAND.name}` }],

  }),

});



function SignInPage() {

  const { redirect_url = APP_HOME } = Route.useSearch();



  return (

    <ClerkAuthLayout subtitle="Sign in to upload and understand your agreements.">

      <SignIn

        appearance={clerkAppearance}

        localization={clerkLocalization}

        routing="virtual"

        signUpUrl="/sign-up"

        forceRedirectUrl={redirect_url}

        fallbackRedirectUrl={APP_HOME}

      />

    </ClerkAuthLayout>

  );

}

