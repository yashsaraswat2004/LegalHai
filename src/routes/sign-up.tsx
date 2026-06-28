import { createFileRoute } from "@tanstack/react-router";

import { SignUp } from "@clerk/tanstack-react-start";

import { ClerkAuthLayout } from "@/components/auth/ClerkAuthLayout";

import { clerkAppearance, clerkLocalization } from "@/lib/clerk-appearance";

import { BRAND } from "@/lib/brand";

import { APP_HOME } from "@/lib/routes";

import { ensureGuestOnly } from "@/lib/auth.functions";



type SignUpSearch = { redirect_url?: string };



export const Route = createFileRoute("/sign-up")({

  beforeLoad: async () => ensureGuestOnly(),

  validateSearch: (search: Record<string, unknown>): SignUpSearch => ({

    redirect_url: typeof search.redirect_url === "string" ? search.redirect_url : APP_HOME,

  }),

  component: SignUpPage,

  head: () => ({

    meta: [{ title: `Sign up — ${BRAND.name}` }],

  }),

});



function SignUpPage() {

  const { redirect_url = APP_HOME } = Route.useSearch();



  return (

    <ClerkAuthLayout subtitle="Create a free account — understand before you sign.">

      <SignUp

        appearance={clerkAppearance}

        localization={clerkLocalization}

        routing="virtual"

        signInUrl="/sign-in"

        forceRedirectUrl={redirect_url}

        fallbackRedirectUrl={APP_HOME}

      />

    </ClerkAuthLayout>

  );

}

