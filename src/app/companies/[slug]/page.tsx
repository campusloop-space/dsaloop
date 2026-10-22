import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCompany, getCompaniesIndex } from "@/lib/data/problems";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Watermark } from "@/components/ui/watermark";
import { CompanyTrackView } from "@/components/companies/company-track-view";
import { Building2 } from "lucide-react";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCompaniesIndex().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company = getCompany(slug);
  if (!company) return {};

  return buildMetadata({
    title: `${company.name} Interview Questions & Problems — DSALoop by CampusLoop`,
    description: `Master high-frequency ${company.name} coding interview questions, problem frequency, and solutions. DSALoop by https://campusloop.space/`,
    canonicalPath: `/companies/${company.slug}`,
    keywords: [
      `${company.name.toLowerCase()} interview questions`,
      `${company.name.toLowerCase()} leetcode`,
      `${company.name.toLowerCase()} coding test`,
      `${company.name.toLowerCase()} online assessment`,
      "placement preparation",
      "dsaloop",
      "campusloop",
    ],
  });
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = getCompany(slug);
  if (!company) notFound();

  const initial = company.name.charAt(0).toUpperCase();

  return (
    <div className="container py-8 sm:py-12 max-w-6xl">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Companies", path: "/companies" },
          { name: company.name, path: `/companies/${company.slug}` },
        ]}
      />

      {/* Company Header */}
      <header className="mt-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-11 sm:size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-heading font-black text-xl text-primary shadow-2xs">
              {initial}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                  Company Track
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-[11px] font-semibold text-muted-foreground">
                  {company.problemCount} Tagged Problems
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground">
                {company.name} Interview Questions
              </h1>
            </div>
          </div>

          <Watermark variant="pill" />
        </div>

        <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
          {company.description}
        </p>

        {company.difficultyBreakdown && (
          <div className="flex items-center gap-2 pt-1 font-mono text-xs">
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
              {company.difficultyBreakdown.easy} Easy
            </span>
            <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold">
              {company.difficultyBreakdown.medium} Medium
            </span>
            <span className="px-2.5 py-1 rounded-md bg-coral/10 text-coral border border-coral/20 font-bold">
              {company.difficultyBreakdown.hard} Hard
            </span>
          </div>
        )}
      </header>

      {/* Watermark Banner */}
      <Watermark
        variant="banner"
        className="mt-6 mb-8"
        subtext={`Curated ${company.name} technical interview questions for CampusLoop students`}
      />

      {/* Interactive Timeframe Track Table */}
      <CompanyTrackView company={company} />

      {/* Watermark Card at Bottom */}
      <Watermark variant="card" className="mt-14" />
    </div>
  );
}
