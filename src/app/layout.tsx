import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { defaultMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";
import {
  organizationJsonLd,
  websiteJsonLd,
  softwareApplicationJsonLd,
} from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/config";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFF8ED" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1615" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  ...defaultMetadata(),
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  creator: siteConfig.creator,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: { icon: "/favicon.ico" },
  verification: {
    google: "_rPi-600gMFYjNa9qzMTuIQg1_aey417EeAdaiIqgFg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        <ThemeProvider>
          <JsonLd data={organizationJsonLd()} />
          <JsonLd data={websiteJsonLd()} />
          <JsonLd data={softwareApplicationJsonLd()} />

          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-QDGSX2YTBT"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QDGSX2YTBT');
            `}
          </Script>

          <SiteHeader />
          <main id="main" className="min-h-[75vh]">
            {children}
          </main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
