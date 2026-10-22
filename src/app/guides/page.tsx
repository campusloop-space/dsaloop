import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = buildMetadata({
  title: "Interview Guides | DSALoop by CampusLoop",
  description: "Guides for interview preparation, patterns, and system design fundamentals.",
  keywords: ["coding interview guide", "dsa guide"],
  canonicalPath: "/guides",
});

const guides = [
  { href: "/interview-preparation", title: "Interview preparation", desc: "End-to-end prep plan." },
  { href: "/system-design", title: "System design", desc: "High-level design primer for interviews." },
  { href: "/glossary", title: "Glossary", desc: "Algorithm & data structure terms." },
  { href: "/blog/how-to-master-dynamic-programming", title: "Master DP", desc: "DP framework guide." },
  { href: "/blog/complete-dfs-guide", title: "DFS guide", desc: "Trees, graphs, backtracking." },
  { href: "/blog/why-sliding-window-works", title: "Sliding window", desc: "Why the invariant works." },
];

export default function GuidesPage() {
  return (
    <div className="container py-10">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }]} />
      <h1 className="mt-4 text-3xl font-bold">Guides</h1>
      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        {guides.map((g) => (
          <Link
            key={g.href}
            href={g.href}
            className="rounded-xl border border-border bg-card p-5 hover:border-primary/40"
          >
            <h2 className="font-semibold">{g.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{g.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
