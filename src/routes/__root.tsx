import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { ClerkProvider } from "@clerk/tanstack-react-start";
import { clerkProviderAppearance } from "@/lib/clerk-appearance";
import { NotFoundPage, ErrorPage } from "@/components/errors/ErrorPages";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LegalHai — Legal Understanding Platform" },
      { name: "description", content: "Understand every agreement before you sign. LegalHai explains contracts in your language, highlights risky clauses, and gives real-life examples — confidence before signing." },
      { name: "keywords", content: "legal contracts India, rental agreement WhatsApp, e-stamp India, Aadhaar e-sign, online legal documents, freelance contract India, NDA India, legal tech Bharat" },
      { name: "author", content: "LegalHai" },
      // Geo-SEO for India
      { name: "geo.region", content: "IN" },
      { name: "geo.placename", content: "India" },
      { name: "geo.position", content: "20.5937;78.9629" },
      { name: "ICBM", content: "20.5937, 78.9629" },
      // Open Graph
      { property: "og:title", content: "LegalHai — Legal contracts on WhatsApp, in 2 minutes" },
      { property: "og:description", content: "India's first WhatsApp-native legal stack. Create, sign, and store contracts in any Indian language." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://legalhai.in" },
      { property: "og:image", content: "https://legalhai.in/logo.png" },
      { property: "og:site_name", content: "LegalHai" },
      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@LegalHai" },
      { name: "twitter:title", content: "LegalHai — Legal contracts on WhatsApp" },
      { name: "twitter:description", content: "Create, sign and store legal contracts on WhatsApp. In your language. In 2 minutes." },
      { name: "twitter:image", content: "https://legalhai.in/logo.png" },
    ],
    links: [
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon.png" },
      { rel: "shortcut icon", href: "/favicon.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700;9..144,900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundPage,
  errorComponent: ({ error, reset }) => (
    <ErrorPage
      error={error}
      onRetry={() => {
        reset();
      }}
    />
  ),
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ colorScheme: "dark" }}>
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "LegalHai",
              "operatingSystem": "All",
              "applicationCategory": "BusinessApplication",
              "description": "The world's most trusted legal understanding platform. Understand, create, and manage agreements in your own language with confidence.",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "1000"
              },
              "areaServed": {
                "@type": "Country",
                "name": "India"
              }
            })
          }}
        />
      </head>
      <body>
        <ClerkProvider appearance={clerkProviderAppearance}>
          {children}
          <Toaster theme="dark" richColors closeButton />
        </ClerkProvider>
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
