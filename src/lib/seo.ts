import type { Metadata } from "next";

export const SITE_URL = "https://yt-agent-studio.vercel.app";
export const BRAND_NAME = "YT Agent Studio";
export const TAGLINE = "11 deterministic tools & AI skills for YouTube creators to write, package, edit, and audit videos.";
export const AUTHOR_NAME = "YT Agent Studio Contributors";
export const CONTACT_EMAIL = "security@ytagentstudio.com";
export const LICENSE_NAME = "MIT License";
export const REPO_URL = "https://github.com/llreuae-debug/yt-agent-studio";
export const UPSTREAM_CREDIT = "Jakeschincariol/youtube-agent-skill";
export const UPSTREAM_URL = "https://github.com/Jakeschincariol/youtube-agent-skill";
export const DISCLAIMER_TEXT = "YT Agent Studio is an independent open-source tool for YouTube creators. Not affiliated with, endorsed by, or sponsored by YouTube or Google.";

export interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}

/**
 * Builds standard compliant Next.js metadata for any route
 */
export function buildPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const canonicalUrl = `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
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
      url: canonicalUrl,
      siteName: BRAND_NAME,
      title,
      description,
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${BRAND_NAME} — Creator Workflow Suite`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/opengraph-image`],
    },
  };
}

/**
 * Generates valid Organization schema
 */
export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: BRAND_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon`,
    description: TAGLINE,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "technical support",
      email: CONTACT_EMAIL,
    },
  };
}

/**
 * Generates valid WebSite schema
 */
export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: BRAND_NAME,
    url: SITE_URL,
    inLanguage: "en-US",
    description: TAGLINE,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
}

/**
 * Generates valid WebApplication schema (Zero fake reviews)
 */
export function buildWebApplicationSchema({
  name = BRAND_NAME,
  description = TAGLINE,
  path = "/",
  featureList = [
    "YouTube Script Writer with Scored Hooks",
    "Title & Thumbnail Packaging Studio",
    "Edit Decision List (EDL) Dead-Air Cutter",
    "Comment Replier & 4-Pile Triage",
    "Weekly Production Capacity Planner",
    "Niche Outlier Multiples & Swipe Analysis",
    "Audience Retention Graph Reader",
    "Shorts Transcript Cutter (20-55s)",
    "Video Description & SEO Studio",
    "YouTube Compliant Chapter Generator",
    "Channel Audit Studio (Cadence & Feed Simulator)",
  ],
}: {
  name?: string;
  description?: string;
  path?: string;
  featureList?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${SITE_URL}${path}#webapp`,
    name,
    description,
    url: `${SITE_URL}${path}`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any (modern web browser)",
    browserRequirements: "Requires JavaScript and modern browser supporting HTML5 and Web Storage",
    featureList,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/OnlineOnly",
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    license: "https://opensource.org/licenses/MIT",
  };
}

/**
 * Generates BreadcrumbList schema
 */
export function buildBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      ...items.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 2,
        name: item.name,
        item: `${SITE_URL}${item.path}`,
      })),
    ],
  };
}

/**
 * Generates FAQPage schema
 */
export function buildFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generates TechArticle schema for guides
 */
export function buildTechArticleSchema({
  title,
  description,
  path,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${SITE_URL}${path}#article`,
    headline: title,
    description,
    url: `${SITE_URL}${path}`,
    inLanguage: "en-US",
    datePublished,
    dateModified,
    author: {
      "@type": "Organization",
      name: AUTHOR_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}${path}`,
    },
  };
}
