import type { Metadata } from "next";
import { getCollection, getProblemsBySlugs } from "@/lib/data/problems";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ProblemList } from "@/components/problem/problem-list";
import { CuteSparkle } from "@/components/ui/cute-illustrations";

export const metadata: Metadata = buildMetadata({
  title: "Blind 75 Sheet & Solutions | DSALoop",
  description:
    "Complete Blind 75 questions list with explanations, pattern breakdowns, and multi-language solutions on CampusLoop.",
  keywords: ["blind 75", "blind 75 leetcode", "blind 75 solutions", "dsa interview prep"],
  canonicalPath: "/blind-75",
});

export default function Blind75Page() {
  const col = getCollection("blind-75");
  const problems = getProblemsBySlugs(col?.problemSlugs ?? []);

  return (
    <div className="container py-10 md:py-12">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Blind 75", path: "/blind-75" }]} />

      <header className="mt-5 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1 text-xs font-semibold text-muted-foreground shadow-2xs">
          <CuteSparkle className="size-3.5 text-primary" />
          <span>Curated Interview Standard</span>
        </div>
        <h1 className="mt-3 font-heading text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          Blind 75 Curated Sheet
        </h1>
        <p className="mt-2 text-sm sm:text-base leading-relaxed text-muted-foreground">
          {col?.description ??
            "The classic high-ROI interview question set. Work through them pattern-by-pattern to build solid placement confidence."}
        </p>
        <div className="mt-4 flex items-center gap-2">
          <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
            {problems.length} Curated Problems Available
          </span>
        </div>
      </header>

      <div className="mt-8">
        <ProblemList problems={problems} />
      </div>
    </div>
  );
}
