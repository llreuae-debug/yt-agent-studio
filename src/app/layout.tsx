import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/shell/AppShell";
import {
  SITE_URL,
  BRAND_NAME,
  TAGLINE,
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "@/lib/seo";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0c0d0e" },
    { media: "(prefers-color-scheme: light)", color: "#f8f9fa" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "YouTube Creator Tools & Retention Skills | YT Agent Studio",
    template: "%s | YT Agent Studio",
  },
  description: TAGLINE,
  applicationName: BRAND_NAME,
  authors: [{ name: "YT Agent Studio Contributors", url: SITE_URL }],
  creator: "YT Agent Studio Contributors",
  publisher: BRAND_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: BRAND_NAME,
    title: "YouTube Creator Tools & Retention Skills | YT Agent Studio",
    description: TAGLINE,
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "YT Agent Studio — 11 Creator Skills & Deterministic Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Creator Tools & Retention Skills | YT Agent Studio",
    description: TAGLINE,
    images: [`${SITE_URL}/opengraph-image`],
  },
  icons: {
    icon: "/icon",
    shortcut: "/icon",
    apple: "/icon",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = buildOrganizationSchema();
  const websiteSchema = buildWebSiteSchema();

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
