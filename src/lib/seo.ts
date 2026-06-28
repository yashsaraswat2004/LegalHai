import { BRAND } from "@/lib/brand";

export const SITE_URL = "https://legalhai.in";

export const SEO = {
  siteName: BRAND.name,
  siteUrl: SITE_URL,
  locale: "en_IN",
  twitterHandle: "@LegalHai",
  ogImage: `${SITE_URL}/logo.png`,
  defaultTitle: `${BRAND.name} — Understand Any Contract Before You Sign | AI Legal Analyzer India`,
  defaultDescription:
    "Upload rental agreements, job offers, NDAs, and contracts. LegalHai explains them in plain language and Hindi, Tamil, Bengali & 12+ Indian languages — highlights risky clauses before you sign. Free trial.",
  keywords: [
    "contract analyzer India",
    "understand rental agreement",
    "legal document summary",
    "AI contract review India",
    "NDA analyzer",
    "employment offer letter review",
    "agreement explainer Hindi",
    "legal tech India",
    "before you sign contract",
    "clause risk analysis",
    "freelance contract India",
    "legalhai",
  ].join(", "),
  ogTitle: `${BRAND.name} — AI Contract Analyzer | Understand Before You Sign`,
  ogDescription:
    "India's legal understanding platform. Upload any agreement, get plain-language summaries, risk highlights, and clause-by-clause explanations in your language.",
  twitterTitle: `${BRAND.name} — Understand Contracts Before You Sign`,
  twitterDescription:
    "Free trial: 2 document analyses. Explains rental agreements, NDAs & job contracts in 12+ Indian languages. ₹49/month Pro.",
} as const;

export type PageSeoOptions = {
  /** Page title without site suffix, or full title */
  title: string;
  description: string;
  /** Path for canonical, e.g. `/pricing` */
  path?: string;
  /** Set true for auth-only or private pages */
  noIndex?: boolean;
  /** Use full title as-is (skip appending site name) */
  fullTitle?: boolean;
};

export function pageTitle(title: string, fullTitle = false): string {
  if (fullTitle) return title;
  return `${title} | ${BRAND.name}`;
}

export function canonicalUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return SITE_URL;
  return `${SITE_URL}${normalized}`;
}

/** Default meta tags shared across public pages (also set in root as fallbacks). */
export function buildPageMeta(options: PageSeoOptions) {
  const title = options.fullTitle ? options.title : pageTitle(options.title);
  const url = canonicalUrl(options.path ?? "/");
  const robots = options.noIndex ? "noindex, nofollow" : "index, follow";

  return {
    meta: [
      { title },
      { name: "description", content: options.description },
      { name: "robots", content: robots },
      { name: "googlebot", content: robots },
      { property: "og:title", content: title },
      { property: "og:description", content: options.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: SEO.ogImage },
      { property: "og:site_name", content: SEO.siteName },
      { property: "og:locale", content: SEO.locale },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: SEO.twitterHandle },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: options.description },
      { name: "twitter:image", content: SEO.ogImage },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.name,
    url: SITE_URL,
    logo: SEO.ogImage,
    description: BRAND.vision,
    areaServed: { "@type": "Country", name: "India" },
    sameAs: [],
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND.name,
    url: SITE_URL,
    description: SEO.defaultDescription,
    inLanguage: ["en", "hi"],
    publisher: { "@type": "Organization", name: BRAND.name },
  };
}

export function softwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: BRAND.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    description: SEO.defaultDescription,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      description: "Free trial — 2 document analyses",
    },
    featureList: [
      "Plain-language contract summaries",
      "Risky clause detection",
      "12+ Indian language explanations",
      "PDF and document upload",
      "Clause-by-clause breakdown",
    ],
    areaServed: { "@type": "Country", name: "India" },
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is LegalHai?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "LegalHai is an AI-powered legal understanding platform that explains contracts, rental agreements, NDAs, and job offers in simple language before you sign.",
        },
      },
      {
        "@type": "Question",
        name: "Is LegalHai free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You get 2 free document analyses. Pro is ₹49/month for unlimited analyses. Use promo code LAUNCH100 for 100% off during launch.",
        },
      },
      {
        "@type": "Question",
        name: "Which documents can I upload?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Rental agreements, employment contracts, NDAs, freelance agreements, service contracts, offer letters, and other legal documents in PDF format.",
        },
      },
      {
        "@type": "Question",
        name: "Does LegalHai work in Hindi and regional languages?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. LegalHai explains agreements in Hindi, Tamil, Bengali, Telugu, Marathi, and 12+ Indian languages.",
        },
      },
    ],
  };
}

export function jsonLdScript(data: object) {
  return JSON.stringify(data);
}
