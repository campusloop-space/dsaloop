import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = buildMetadata({
  title: "Attribution & Licenses | DSALoop by CampusLoop",
  description: "Source attribution for DSALoop solution code and content policy.",
  keywords: ["attribution", "mit license"],
  canonicalPath: "/about/attribution",
});

export default function AttributionPage() {
  return (
    <div className="container py-10 max-w-3xl">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
          { name: "Attribution", path: "/about/attribution" },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold">Attribution</h1>
      <section className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
        <p>
          Multi-language reference solutions are derived from the MIT-licensed repository{" "}
          <a
            href={siteConfig.links.github}
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            kamyu104/LeetCode-Solutions
          </a>
          . Copyright remains with the original authors. The MIT license requires retention of the
          copyright notice.
        </p>
        <p>
          Problem titles and links point to LeetCode. DSALoop does not host official problem
          statements. All teaching explanations, FAQs, roadmaps, and UI copy are original DSALoop
          content.
        </p>
        <p>
          Company tags are editorial associations for practice — not official company endorsement or
          leaked internal banks.
        </p>
      </section>
    </div>
  );
}
