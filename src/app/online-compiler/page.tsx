import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";
import { FullscreenCompiler } from "@/components/compiler/fullscreen-compiler";

export const metadata: Metadata = buildMetadata({
  title: "Online Compiler & Code Runner (Python, C++, Java, JS, Go, Rust) — DSALoop by CampusLoop",
  description:
    "Free full-screen multi-language online compiler. Write, compile, and execute Python, C++, Java, JavaScript, TypeScript, Go, and Rust programs directly in browser with stdin support and sub-50ms benchmarks. DSALoop by https://campusloop.space/",
  keywords: [
    "online compiler",
    "online code runner",
    "compile code in browser",
    "online c compiler",
    "online cpp compiler",
    "online python compiler",
    "online java compiler",
    "online ide",
    "dsaloop compiler",
    "campusloop",
  ],
  canonicalPath: "/online-compiler",
});

export default function OnlineCompilerHubPage() {
  const compilerJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "DSALoop Online Compiler Suite",
    applicationCategory: "DeveloperApplication, EducationalApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free multi-language browser compiler and code runner supporting C, C++, Python, Java, JavaScript, TypeScript, Go, and Rust.",
    author: {
      "@type": "Organization",
      name: "CampusLoop",
      url: "https://campusloop.space",
    },
  };

  return (
    <>
      <JsonLd data={compilerJsonLd} />
      <FullscreenCompiler initialLanguageId="python" />
    </>
  );
}
