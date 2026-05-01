import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LegalHai — India's First WhatsApp-Native Legal Platform" },
      { name: "description", content: "Create legally binding rental agreements, NDAs, and contracts on WhatsApp in 2 minutes. Available in 12+ Indian languages with Aadhaar e-sign and e-stamping. Fast, affordable, and lawyer-verified." },
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
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700;9..144,900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
              "description": "India's first WhatsApp-native legal agreement platform. Create, sign, and store legal contracts on WhatsApp in 2 minutes.",
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
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
