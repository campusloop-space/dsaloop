import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { getProblemsIndex, PROBLEMS_PAGE_SIZE } from "@/lib/data/problems";
import { ProblemList } from "@/components/problem/problem-list";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";
import { ProblemPagination } from "@/components/problem/problem-pagination";
import { CuteSparkle } from "@/components/ui/cute-illustrations";

export const metadata: Metadata = buildMetadata({
  title: "LeetCode & DSA Problems — Patterns, Roadmaps & Solutions | DSALoop",
  description:
    "Browse 3,000+ coding interview problems with pattern breakdowns, multi-language solutions, and complexity analysis on CampusLoop.",
  keywords: ["leetcode problems", "coding interview problems", "dsa problems", "algorithm solutions", "campusloop dsa"],
  canonicalPath: "/problems",
});

export default function ProblemsPage() {
  const problems = getProblemsIndex();
  const currentProblems = problems.slice(0, PROBLEMS_PAGE_SIZE);

  return (
    <div className="container py-10 md:py-12">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Problems", path: "/problems" }]} />

      <header className="mt-5 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1 text-xs font-semibold text-muted-foreground shadow-2xs">
          <CuteSparkle className="size-3.5 text-primary" />
          <span>Curated Problem Vault</span>
        </div>
        <h1 className="mt-3 font-heading text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          Problems
        </h1>
        <p className="mt-2 text-sm sm:text-base leading-relaxed text-muted-foreground">
          {problems.length.toLocaleString()} problems organized for pattern mastery instead of endless memorization. Select any problem to inspect the algorithmic intuition, solution code, and complexity notes.
        </p>
      </header>

      <div className="mt-7 flex flex-wrap gap-2">
        <Link
          href="/search"
          className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-3.5 py-1.5 text-xs font-semibold shadow-2xs hover:border-border-strong hover:shadow-sm transition-all"
        >
          <Search className="size-3.5 text-muted-foreground" />
          <span>Search problems</span>
        </Link>
        {[
          ["/patterns", "Browse by Pattern"],
          ["/roadmaps", "View Roadmaps"],
          ["/blind-75", "Blind 75 Sheet"],
          ["/topics", "Browse Topics"],
          ["/companies", "Company Tags"],
        ].map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-border-strong hover:text-foreground transition-all"
          >
            <span>{label}</span>
            <ArrowRight className="size-3 text-muted-foreground" />
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <ProblemList problems={currentProblems} />
        <ProblemPagination currentPage={1} totalItems={problems.length} />
      </div>
    </div>
  );
}
