import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProblemsIndex, PROBLEMS_PAGE_SIZE } from "@/lib/data/problems";
import { ProblemList } from "@/components/problem/problem-list";
import { ProblemPagination } from "@/components/problem/problem-pagination";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  const totalPages = Math.ceil(getProblemsIndex().length / PROBLEMS_PAGE_SIZE);
  return Array.from({ length: totalPages }, (_, index) => ({
    page: String(index + 2),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  const pageNumber = Number(page);
  const totalItems = getProblemsIndex().length;
  const totalPages = Math.ceil(totalItems / PROBLEMS_PAGE_SIZE);
  if (!Number.isInteger(pageNumber) || pageNumber < 2 || pageNumber > totalPages) return {};

  const start = (pageNumber - 1) * PROBLEMS_PAGE_SIZE + 1;
  const end = Math.min(pageNumber * PROBLEMS_PAGE_SIZE, totalItems);

  return buildMetadata({
    title: `LeetCode Problems ${start}–${end} — DSALoop by CampusLoop`,
    description: `Browse problems ${start}–${end} from DSALoop's structured coding interview library.`,
    keywords: ["leetcode problems", "coding interview problems", "dsa problems"],
    canonicalPath: `/problems/page/${pageNumber}`,
  });
}

export default async function ProblemsPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const pageNumber = Number(page);
  const problems = getProblemsIndex();
  const totalPages = Math.ceil(problems.length / PROBLEMS_PAGE_SIZE);

  if (!Number.isInteger(pageNumber) || pageNumber < 2 || pageNumber > totalPages) {
    notFound();
  }

  const startIndex = (pageNumber - 1) * PROBLEMS_PAGE_SIZE;
  const currentProblems = problems.slice(startIndex, startIndex + PROBLEMS_PAGE_SIZE);
  const start = startIndex + 1;
  const end = startIndex + currentProblems.length;

  return (
    <div className="container py-10 md:py-12">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Problems", path: "/problems" },
          { name: `Page ${pageNumber}`, path: `/problems/page/${pageNumber}` },
        ]}
      />

      <header className="mt-5 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Practice library</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Problems {start}–{end}
        </h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          Continue through the DSALoop interview problem library. Every problem links to its own canonical learning page.
        </p>
      </header>

      <div className="mt-8">
        <ProblemList problems={currentProblems} />
        <ProblemPagination currentPage={pageNumber} totalItems={problems.length} />
      </div>
    </div>
  );
}
