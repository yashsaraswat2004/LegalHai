import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { ClerkProvider } from "@clerk/tanstack-react-start";
import { clerkProviderAppearance } from "@/lib/clerk-appearance";
import { NotFoundPage, ErrorPage } from "@/components/errors/ErrorPages";
import { Toaster } from "@/components/ui/sonner";
import {
  SEO,
  canonicalUrl,
  jsonLdScript,
  organizationJsonLd,
  softwareApplicationJsonLd,
  webSiteJsonLd,
} from "@/lib/seo";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SEO.defaultTitle },
      { name: "description", content: SEO.defaultDescription },
      { name: "keywords", content: SEO.keywords },
      { name: "author", content: SEO.siteName },
      { name: "application-name", content: SEO.siteName },
      { name: "theme-color", content: "#e8ff33" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "googlebot", content: "index, follow" },
      { name: "geo.region", content: "IN" },
      { name: "geo.placename", content: "India" },
      { name: "geo.position", content: "20.5937;78.9629" },
      { name: "ICBM", content: "20.5937, 78.9629" },
      { property: "og:title", content: SEO.ogTitle },
      { property: "og:description", content: SEO.ogDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalUrl() },
      { property: "og:image", content: SEO.ogImage },
      { property: "og:site_name", content: SEO.siteName },
      { property: "og:locale", content: SEO.locale },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: SEO.twitterHandle },
      { name: "twitter:title", content: SEO.twitterTitle },
      { name: "twitter:description", content: SEO.twitterDescription },
      { name: "twitter:image", content: SEO.ogImage },
    ],
    links: [
      { rel: "canonical", href: canonicalUrl() },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon.png" },
      { rel: "shortcut icon", href: "/favicon.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700;9..144,900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
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
    <html lang="en-IN" style={{ colorScheme: "dark" }}>
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(webSiteJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(softwareApplicationJsonLd()) }}
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
