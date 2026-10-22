import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { SearchClient } from "@/components/search/search-client";

export const metadata: Metadata = buildMetadata(
  {
    title: "Search Problems, Patterns & Guides | DSALoop by CampusLoop",
    description: "Search across coding problems, topics, patterns, companies, roadmaps, and guides.",
    keywords: ["leetcode search", "algorithm search", "coding interview search"],
    canonicalPath: "/search",
  },
  { robots: { index: false, follow: true } },
);

export default function SearchPage() {
  return (
    <div className="container py-10 md:py-12">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Search", path: "/search" }]} />
      <header className="mt-5 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Library search</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Search</h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">Find a problem, concept, company, pattern, roadmap, or guide without leaving the learning flow.</p>
      </header>
      <div className="mt-8"><SearchClient /></div>
    </div>
  );
}
