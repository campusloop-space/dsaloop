import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Route } from "lucide-react";
import { getRoadmapsIndex } from "@/lib/data/problems";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { CuteSparkle } from "@/components/ui/cute-illustrations";

export const metadata: Metadata = buildMetadata({
  title: "Structured DSA Roadmaps | DSALoop",
  description: "Curated, ordered learning paths for DSA fundamentals, dynamic programming, trees, and graphs.",
  keywords: ["dsa roadmap", "leetcode roadmap", "interview roadmap", "campus placements roadmap"],
  canonicalPath: "/roadmaps",
});

export default function RoadmapsPage() {
  const roadmaps = getRoadmapsIndex();

  return (
    <div className="container py-10 md:py-12">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Roadmaps", path: "/roadmaps" }]} />

      <header className="mt-5 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1 text-xs font-semibold text-muted-foreground shadow-2xs">
          <CuteSparkle className="size-3.5 text-primary" />
          <span>Progression Roadmaps</span>
        </div>
        <h1 className="mt-3 font-heading text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          Structured Roadmaps
        </h1>
        <p className="mt-2 text-sm sm:text-base leading-relaxed text-muted-foreground">
          Follow ordered conceptual pathways that build intuition progressively from basic data structures to advanced techniques.
        </p>
      </header>

      <div className="mt-8 grid md:grid-cols-2 gap-4">
        {roadmaps.map((r) => (
          <Link
            key={r.slug}
            href={`/roadmaps/${r.slug}`}
            className="group rounded-2xl border border-border/80 bg-card p-6 shadow-2xs transition-all hover:border-border-strong hover:shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-heading text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {r.name}
                </h2>
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                  <ArrowRight className="size-3.5" />
                </div>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {r.description}
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-border/40 flex items-center justify-between text-xs">
              <span className="font-semibold text-primary">{r.steps.length} learning stages</span>
              <span className="text-[11px] text-muted-foreground">Step-by-step recall</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
