import type { Metadata } from "next";
import { getLanguageById } from "@/lib/compiler/languages";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Watermark } from "@/components/ui/watermark";
import { OnlineCompiler } from "@/components/compiler/online-compiler";
import { JsonLd } from "@/components/seo/json-ld";
import { Terminal } from "lucide-react";

const lang = getLanguageById("java")!;

export const metadata: Metadata = buildMetadata({
  title: lang.seoTitle,
  description: lang.seoDescription,
  keywords: lang.keywords,
  canonicalPath: lang.route,
});

export default function OnlineJavaCompilerPage() {
  const compilerJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: lang.seoTitle,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: lang.seoDescription,
  };

  return (
    <div className="container py-8 sm:py-12 max-w-6xl">
      <JsonLd data={compilerJsonLd} />

      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Online Compilers", path: "/online-compiler" },
          { name: "Java Compiler", path: lang.route },
        ]}
      />

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
              <Terminal className="size-3.5" />
              OpenJDK 21 LTS &bull; Collections &bull; Scanner
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Online Java Compiler (OpenJDK 21)
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
            Write, compile, and execute Java programs online with OpenJDK 21 LTS. Supports Java Collections, Scanner, Streams, and formatted exception stack traces.
          </p>
        </div>

        <Watermark variant="pill" className="shrink-0 self-start sm:self-center" />
      </div>

      <Watermark
        variant="banner"
        className="mt-6 mb-8"
        subtext="Zero-install Java 21 LTS playground for placements and academic practice"
      />

      <OnlineCompiler initialLanguageId="java" />
    </div>
  );
}
