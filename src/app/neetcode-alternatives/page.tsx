import type { Metadata } from "next";
import Link from "next/link";
import { getCollection, getProblemsBySlugs } from "@/lib/data/problems";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ProblemList } from "@/components/problem/problem-list";

export const metadata: Metadata = buildMetadata({
  title: "NeetCode Alternatives — Free Pattern Roadmap | DSALoop by CampusLoop",
  description:
    "Looking for NeetCode alternatives? DSALoop offers free pattern roadmaps, Blind 75, Grind 169, and original explanations.",
  keywords: ["neetcode alternatives", "neetcode free", "leetcode patterns free"],
  canonicalPath: "/neetcode-alternatives",
});

export default function NeetcodeAlternativesPage() {
  const col = getCollection("neetcode-alternatives");
  const problems = getProblemsBySlugs(col?.problemSlugs ?? []);

  return (
    <div className="container py-10">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "NeetCode alternatives", path: "/neetcode-alternatives" },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold">NeetCode Alternatives</h1>
      <p className="mt-2 text-muted-foreground max-w-2xl">
        DSALoop is a free, pattern-first alternative: Blind 75 coverage, roadmaps, company pages,
        and original explanations — without locking learning behind a paywall.
      </p>
      <ul className="mt-6 space-y-2 text-sm">
        <li>
          <Link href="/blind-75" className="text-primary hover:underline">
            Blind 75 track
          </Link>
        </li>
        <li>
          <Link href="/patterns" className="text-primary hover:underline">
            Pattern explorer
          </Link>
        </li>
        <li>
          <Link href="/roadmaps" className="text-primary hover:underline">
            Structured roadmaps
          </Link>
        </li>
      </ul>
      <div className="mt-8">
        <ProblemList problems={problems} />
      </div>
    </div>
  );
}
