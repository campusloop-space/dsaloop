import type { Metadata } from "next";
import { getCollection, getProblemsBySlugs } from "@/lib/data/problems";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ProblemList } from "@/components/problem/problem-list";

export const metadata: Metadata = buildMetadata({
  title: "Grind 169 Solutions & Tracker | DSALoop by CampusLoop",
  description: "Grind 169 expanded interview set with DSALoop explanations and patterns.",
  keywords: ["grind 169", "grind 75", "leetcode grind"],
  canonicalPath: "/grind-169",
});

export default function Grind169Page() {
  const col = getCollection("grind-169");
  const problems = getProblemsBySlugs(col?.problemSlugs ?? []);

  return (
    <div className="container py-10">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Grind 169", path: "/grind-169" }]} />
      <h1 className="mt-4 text-3xl font-bold">Grind 169</h1>
      <p className="mt-2 text-muted-foreground max-w-2xl">
        {col?.description ?? "Expanded interview preparation beyond Blind 75."}
      </p>
      <p className="mt-2 text-sm font-medium">{problems.length} problems in catalog</p>
      <div className="mt-8">
        <ProblemList problems={problems} />
      </div>
    </div>
  );
}
