import type { Metadata } from "next";
import Link from "next/link";
import { Terminal, Code, ArrowUpRight, CheckCircle2, Cpu, Sparkles } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/lib/compiler/languages";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Watermark } from "@/components/ui/watermark";
import { OnlineCompiler } from "@/components/compiler/online-compiler";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Online Compiler & Code Runner (C, C++, Python, Java, JS, Go, Rust) — DSALoop by CampusLoop",
  description:
    "Free multi-language online compiler. Write, compile, and execute C, C++, Python, Java, JavaScript, TypeScript, Go, and Rust programs directly in browser with stdin support and benchmark metrics. DSALoop by https://campusloop.space/",
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
    "@type": "SoftwareApplication",
    name: "DSALoop Online Compiler Suite",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free multi-language browser compiler and code runner supporting C, C++, Python, Java, JavaScript, TypeScript, Go, and Rust.",
  };

  return (
    <div className="container py-8 sm:py-12 max-w-6xl">
      <JsonLd data={compilerJsonLd} />

      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Online Compilers", path: "/online-compiler" },
        ]}
      />

      {/* Header */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
              <Terminal className="size-3.5" />
              Online Code Runner &bull; 8+ Compilers
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Online Compiler &amp; Runner
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
            Write, compile, and run code instantly in C, C++, Python, Java, JavaScript, TypeScript, Go, and Rust. Features CodeMirror 6, standard input (stdin) streams, and execution diagnostics.
          </p>
        </div>

        <Watermark variant="pill" className="shrink-0 self-start sm:self-center" />
      </div>

      {/* Watermark Banner */}
      <Watermark
        variant="banner"
        className="mt-6 mb-8"
        subtext="Zero-installation coding playgrounds for CampusLoop students"
      />

      {/* Compiler Hub Component */}
      <OnlineCompiler initialLanguageId="python" />

      {/* Dedicated Compilers Directory */}
      <section className="mt-14 space-y-4">
        <h2 className="font-heading text-xl sm:text-2xl font-black text-foreground">
          Dedicated Language Compilers
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Explore standalone compiler environments optimized with language-specific boilerplates, stdin examples, and documentation.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <Link
              key={lang.id}
              href={lang.route}
              className="group flex flex-col justify-between p-4 rounded-2xl border border-border/80 bg-card/70 hover:border-primary/40 hover:-translate-y-0.5 transition-all shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {lang.name}
                  </span>
                  <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {lang.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>{lang.extension}</span>
                <span className="text-primary font-semibold">Open &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
