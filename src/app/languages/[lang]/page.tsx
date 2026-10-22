import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLanguagesIndex, getProblemsBySlugs } from "@/lib/data/problems";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ProblemList } from "@/components/problem/problem-list";

export const dynamicParams = false;

export function generateStaticParams() {
  return getLanguagesIndex().map((l) => ({ lang: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return buildMetadata({
    title: `${lang} LeetCode Solutions | DSALoop by CampusLoop`,
    description: `Browse coding interview solutions in ${lang}.`,
    keywords: [`${lang} leetcode`, `${lang} solutions`],
    canonicalPath: `/languages/${lang}`,
  });
}

export default async function LanguagePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const entry = getLanguagesIndex().find((l) => l.slug === lang);
  if (!entry) notFound();
  const problems = getProblemsBySlugs(entry.problemSlugs);

  return (
    <div className="container py-10">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Languages", path: "/problems" },
          { name: lang, path: `/languages/${lang}` },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold">{lang} Solutions</h1>
      <p className="mt-2 text-muted-foreground">{entry.problemCount} problems with {lang} code</p>
      <div className="mt-8">
        <ProblemList problems={problems} />
      </div>
    </div>
  );
}
