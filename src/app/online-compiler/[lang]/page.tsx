import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  SUPPORTED_LANGUAGES,
  getLanguageById,
  type LanguageDefinition,
} from "@/lib/compiler/languages";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";
import { FullscreenCompiler } from "@/components/compiler/fullscreen-compiler";
import { siteConfig } from "@/lib/config";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export const dynamic = "force-static";

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({
    lang: lang.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = getLanguageById(langParam);
  if (!lang) return {};

  return buildMetadata({
    title: `Online ${lang.name} Compiler & Runner — DSALoop by CampusLoop`,
    description: `Write, compile, and run ${lang.name} programs online instantly. Features CodeMirror 6, standard input (stdin) streams, sub-50ms self-hosted execution, and execution benchmarking. DSALoop by https://campusloop.space/`,
    keywords: [
      `online ${lang.name.toLowerCase()} compiler`,
      `run ${lang.name.toLowerCase()} online`,
      `online ${lang.id} compiler`,
      `compile ${lang.name.toLowerCase()} in browser`,
      `online compiler`,
      `dsaloop compiler`,
      `campusloop`,
      ...lang.keywords,
    ],
    canonicalPath: `/online-compiler/${lang.id}`,
  });
}

export default async function OnlineLanguageCompilerPage({ params }: PageProps) {
  const { lang: langParam } = await params;
  const lang = getLanguageById(langParam);

  if (!lang) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `Online ${lang.name} Compiler — DSALoop`,
    applicationCategory: "DeveloperApplication, EducationalApplication",
    operatingSystem: "All",
    browserRequirements: "Requires modern JavaScript and HTML5",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: `Free browser-based online ${lang.name} compiler and runner with standard input support and execution diagnostics.`,
    featureList: [
      `Instant ${lang.name} compilation & execution`,
      "CodeMirror 6 editor with syntax highlighting",
      "Standard input (stdin) interactive runner",
      "Sub-50ms self-hosted execution sandbox",
      "Local draft autosave",
    ],
    author: {
      "@type": "Organization",
      name: "CampusLoop",
      url: "https://campusloop.space",
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <FullscreenCompiler initialLanguageId={lang.id} />
    </>
  );
}
