import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProblemSlugs, getProblem } from "@/lib/data/problems";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { CodeTabs } from "@/components/problem/code-tabs";
import { DifficultyBadge } from "@/components/ui/badge";

export const dynamicParams = false;

/** Primary languages only — keeps SSG page count manageable. */
const SSG_LANGS = new Set(["python", "cpp", "java", "typescript", "go"]);

export function generateStaticParams() {
  const params: { slug: string; lang: string }[] = [];
  for (const slug of getAllProblemSlugs()) {
    const p = getProblem(slug);
    if (!p) continue;
    for (const lang of p.languages) {
      if (!SSG_LANGS.has(lang)) continue;
      params.push({ slug, lang });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}): Promise<Metadata> {
  const { slug, lang } = await params;
  const problem = getProblem(slug);
  if (!problem || !problem.solutions[lang]) return {};
  return buildMetadata({
    title: `${problem.title} ${problem.solutions[lang].language} Solution | DSALoop by CampusLoop`,
    description: `${problem.solutions[lang].language} solution for ${problem.title} (LeetCode #${problem.number}). Time ${problem.timeComplexity}, space ${problem.spaceComplexity}.`,
    keywords: [
      `${problem.title} ${lang}`,
      `${problem.title} ${problem.solutions[lang].language}`,
      `${lang} leetcode`,
    ],
    canonicalPath: `/problems/${slug}/${lang}`,
  });
}

export default async function ProblemLangPage({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}) {
  const { slug, lang } = await params;
  const problem = getProblem(slug);
  if (!problem || !problem.solutions[lang]) notFound();

  return (
    <div className="container py-10">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Problems", path: "/problems" },
          { name: problem.title, path: `/problems/${slug}` },
          { name: problem.solutions[lang].language, path: `/problems/${slug}/${lang}` },
        ]}
      />
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <DifficultyBadge difficulty={problem.difficulty} />
      </div>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">
        {problem.title} — {problem.solutions[lang].language}
      </h1>
      <p className="mt-2 text-muted-foreground">
        <Link href={`/problems/${slug}`} className="text-primary hover:underline">
          Full explanation
        </Link>
        {" · "}
        Time {problem.timeComplexity} · Space {problem.spaceComplexity}
      </p>
      <div className="mt-8">
        <CodeTabs solutions={problem.solutions} defaultLang={lang} />
      </div>
    </div>
  );
}
