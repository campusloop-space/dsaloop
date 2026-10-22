import type { Metadata } from "next";
import Link from "next/link";
import { getBlogIndex } from "@/lib/data/problems";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = buildMetadata({
  title: "DSALoop Blog — DSA & Interview Guides",
  description: "In-depth guides on dynamic programming, DFS, sliding window, and interview strategy.",
  keywords: ["leetcode blog", "dsa guides", "coding interview blog"],
  canonicalPath: "/blog",
});

export default function BlogPage() {
  const posts = getBlogIndex();
  return (
    <div className="container py-10">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }]} />
      <h1 className="mt-4 text-3xl font-bold">Blog</h1>
      <div className="mt-8 space-y-4">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="block rounded-xl border border-border bg-card p-5 hover:border-primary/40"
          >
            <p className="text-xs text-muted-foreground">{p.date} · {p.readingMinutes} min read</p>
            <h2 className="mt-1 text-xl font-bold">{p.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
