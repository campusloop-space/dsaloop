import type { Metadata } from "next";
import Link from "next/link";
import { getTopicsIndex } from "@/lib/data/problems";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = buildMetadata({
  title: "DSA Topics — Interview Problem Collections | DSALoop by CampusLoop",
  description: "Explore coding interview topics: arrays, graphs, DP, trees, and more.",
  keywords: ["dsa topics", "leetcode topics", "graph", "dynamic programming"],
  canonicalPath: "/topics",
});

export default function TopicsPage() {
  const topics = getTopicsIndex().sort((a, b) => b.problemCount - a.problemCount);
  return (
    <div className="container py-10">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Topics", path: "/topics" }]} />
      <h1 className="mt-4 text-3xl font-bold">Topics</h1>
      <p className="mt-2 text-muted-foreground">Browse problems by data structure and algorithm topic.</p>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((t) => (
          <Link
            key={t.slug}
            href={`/topics/${t.slug}`}
            className="rounded-xl border border-border bg-card p-5 hover:border-primary/40"
          >
            <h2 className="font-semibold text-lg">{t.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{t.description}</p>
            <p className="mt-3 text-xs font-medium text-primary">{t.problemCount} problems</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
