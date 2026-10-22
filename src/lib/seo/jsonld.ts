import { siteConfig } from "@/lib/config";
import { absoluteUrl } from "./metadata";
import type { FaqItem } from "@/lib/schema/types";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CampusLoop",
    alternateName: "DSALoop by CampusLoop",
    url: "https://campusloop.space",
    logo: absoluteUrl("/logo.png"),
    image: absoluteUrl("/og-image.png"),
    sameAs: [
      "https://github.com/campusloop-space/dsaloop",
      "https://campusloop.space",
      "https://dsaloop.campusloop.space"
    ],
    description: siteConfig.description,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DSALoop by https://campusloop.space/",
    alternateName: "DSALoop",
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/search?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function softwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "DSALoop by https://campusloop.space/",
    alternateName: ["DSALoop", "DSALoop Compiler", "DSALoop LeetCode Practice Workspace"],
    applicationCategory: "EducationalApplication, DeveloperApplication",
    operatingSystem: "All (Web, Android, iOS, Windows, macOS, Linux)",
    browserRequirements: "Requires modern JavaScript and HTML5 support",
    installUrl: absoluteUrl("/"),
    screenshot: absoluteUrl("/og-image.png"),
    featureList: [
      "Multi-Language Online Compiler (Python, C++, Java, Node.js, Go, Rust)",
      "LeetCode-Style Practice IDE with Test Cases and Standard Input",
      "Authoritative Hidden Test-Case Judge Engine",
      "185+ Company-Tagged Question Tracks (Google, Amazon, Meta, Microsoft)",
      "28-Chapter Interactive System Design Primer",
      "Offline-Ready Progressive Web App (PWA)"
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: siteConfig.description,
    author: {
      "@type": "Organization",
      name: "CampusLoop",
      url: "https://campusloop.space"
    }
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function articleJsonLd(opts: {
  title: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
}) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    url: absoluteUrl(opts.path),
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  };

  if (opts.datePublished) data.datePublished = opts.datePublished;
  if (opts.dateModified) data.dateModified = opts.dateModified;

  return data;
}

export function howToJsonLd(opts: {
  name: string;
  description: string;
  steps: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: opts.name,
    description: opts.description,
    step: opts.steps.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text,
    })),
  };
}
