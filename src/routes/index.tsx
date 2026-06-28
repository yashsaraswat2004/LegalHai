import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/legalhai/Nav";
import { WaitlistDialog } from "@/components/legalhai/WaitlistDialog";
import {
  BeforeYouSignSection,
  ComingSoonSection,
  DocumentsSection,
  EarlyAccessSection,
  HomeFooter,
  HomeHero,
  HowSection,
  MoreThanTranslationSection,
  TrustSection,
  VisionSection,
  WhySection,
} from "@/components/home/HomeSections";
import { PricingSection } from "@/components/billing/PricingCards";
import { BRAND } from "@/lib/brand";
import { ensureGuestOnly } from "@/lib/auth.functions";

export const Route = createFileRoute("/")({
  beforeLoad: async () => ensureGuestOnly(),
  component: Index,
  head: () => ({
    meta: [
      { title: `${BRAND.name} — ${BRAND.tagline}` },
      {
        name: "description",
        content:
          "Understand every agreement before you sign. LegalHai explains contracts in your language with real-life examples and confidence before signing.",
      },
    ],
  }),
});

function Index() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  return (
    <div id="top" className="relative min-h-screen bg-background text-foreground grain">
      <Nav />

      <HomeHero />
      <WhySection />
      <HowSection />
      <DocumentsSection />
      <MoreThanTranslationSection />
      <TrustSection />
      <PricingSection />
      <BeforeYouSignSection />
      <ComingSoonSection />
      <VisionSection />
      <EarlyAccessSection onJoin={() => setWaitlistOpen(true)} />
      <HomeFooter />

      <WaitlistDialog open={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </div>
  );
}
