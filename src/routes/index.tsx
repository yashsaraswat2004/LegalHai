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
import { ensureGuestOnly } from "@/lib/auth.functions";
import { SEO, buildPageMeta, faqJsonLd, jsonLdScript } from "@/lib/seo";

export const Route = createFileRoute("/")({
  beforeLoad: async () => ensureGuestOnly(),
  component: Index,
  head: () =>
    buildPageMeta({
      title: SEO.defaultTitle,
      description: SEO.defaultDescription,
      path: "/",
      fullTitle: true,
    }),
});

function Index() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqJsonLd()) }}
      />
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
    </>
  );
}
