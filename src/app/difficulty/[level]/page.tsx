import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDifficultyProblems, getProblemsBySlugs } from "@/lib/data/problems";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ProblemList } from "@/components/problem/problem-list";

const LEVELS = ["easy", "medium", "hard"] as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return LEVELS.map((level) => ({ level }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ level: string }>;
}): Promise<Metadata> {
  const { level } = await params;
  const label = level.charAt(0).toUpperCase() + level.slice(1);
  return buildMetadata({
    title: `${label} LeetCode Problems | DSALoop by CampusLoop`,
    description: `Browse ${label.toLowerCase()} coding interview problems with solutions and patterns.`,
    keywords: [`${level} leetcode`, `${level} interview questions`],
    canonicalPath: `/difficulty/${level}`,
  });
}

export default async function DifficultyPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  if (!LEVELS.includes(level as (typeof LEVELS)[number])) notFound();
  const data = getDifficultyProblems(level as "easy" | "medium" | "hard");
  const problems = getProblemsBySlugs(data.problemSlugs);

  return (
    <div className="container py-10">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Problems", path: "/problems" },
          { name: data.level, path: `/difficulty/${level}` },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold">{data.level} Problems</h1>
      <p className="mt-2 text-muted-foreground">{data.problemCount} problems</p>
      <div className="mt-8">
        <ProblemList problems={problems} />
      </div>
    </div>
  );
}
