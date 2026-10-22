import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProblemSlugs, getProblem } from "@/lib/data/problems";
import { buildMetadata } from "@/lib/seo/metadata";
import { markdownToHtml } from "@/lib/markdown";
import { LeetCodeWorkspace } from "@/components/problem/leetcode-workspace";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProblemSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const problem = getProblem(slug);
  if (!problem) return {};

  return buildMetadata({
    title: `Practice ${problem.title} — Online IDE & DSA Judge [Beta] | DSALoop by CampusLoop`,
    description: `Solve ${problem.title} in a full LeetCode-style online IDE workspace with CodeMirror 6, custom test cases, and self-hosted judge. DSALoop by https://campusloop.space/`,
    keywords: [
      problem.title,
      "practice",
      "leetcode",
      "online judge",
      "code editor",
      "dsa practice",
      "campusloop",
    ],
    canonicalPath: `/problems/${problem.slug}/practice`,
  });
}

export default async function PracticePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const problem = getProblem(slug);
  if (!problem) notFound();

  const sectionsHtml = await Promise.all(
    problem.content.map(async (s) => ({
      id: s.id,
      title: s.title,
      html: await markdownToHtml(s.bodyMarkdown),
    }))
  );

  return (
    <LeetCodeWorkspace
      problem={problem}
      sectionsHtml={sectionsHtml}
    />
  );
}
