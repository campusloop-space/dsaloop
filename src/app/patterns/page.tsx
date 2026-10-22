import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Layers3 } from "lucide-react";
import { getPatternsIndex } from "@/lib/data/problems";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { CuteSparkle } from "@/components/ui/cute-illustrations";

export const metadata: Metadata = buildMetadata({
  title: "Algorithm Patterns Explorer | DSALoop",
  description: "Master sliding window, two pointers, DP, Union-Find, and reusable interview coding patterns.",
  keywords: ["coding patterns", "sliding window", "two pointers", "union find", "interview patterns", "dsa patterns"],
  canonicalPath: "/patterns",
});

export default function PatternsPage() {
  const patterns = getPatternsIndex().sort((a, b) => b.problemCount - a.problemCount);

  return (
    <div className="container py-10 md:py-12">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Patterns", path: "/patterns" }]} />

      <header className="mt-5 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1 text-xs font-semibold text-muted-foreground shadow-2xs">
          <CuteSparkle className="size-3.5 text-primary" />
          <span>Pattern Recognition Lab</span>
        </div>
        <h1 className="mt-3 font-heading text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          Algorithmic Patterns
        </h1>
        <p className="mt-2 text-sm sm:text-base leading-relaxed text-muted-foreground">
          Pattern recognition is the single fastest shortcut from random LeetCode grinding to real interview problem-solving intuition.
        </p>
      </header>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {patterns.map((p) => (
          <Link
            key={p.slug}
            href={`/patterns/${p.slug}`}
            className="group rounded-2xl border border-border/80 bg-card p-5 shadow-2xs transition-all hover:border-border-strong hover:shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {p.name}
                </h2>
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                  <ArrowRight className="size-3.5" />
                </div>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                {p.description}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
              <span className="font-semibold text-primary">{p.problemCount} curated problems</span>
              <span className="text-[11px] text-muted-foreground">O(n) target</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
