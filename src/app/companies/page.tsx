import type { Metadata } from "next";
import { getCompaniesIndex } from "@/lib/data/problems";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Watermark } from "@/components/ui/watermark";
import { CompanyDirectory } from "@/components/companies/company-directory";
import { Building2 } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Company-Tagged Coding Questions (185+ Companies) — DSALoop by CampusLoop",
  description:
    "Curated LeetCode company-tagged problems for Google, Meta, Amazon, Microsoft, Goldman Sachs, TCS, and 180+ tech companies. Filter by last 30 days, 3 months, 6 months, and all-time. DSALoop by https://campusloop.space/",
  keywords: [
    "company tagged leetcode",
    "google coding interview questions",
    "amazon oa questions",
    "meta coding interview",
    "tcs nqt coding questions",
    "goldman sachs coding questions",
    "dsaloop",
    "campusloop",
  ],
  canonicalPath: "/companies",
});

export default function CompaniesPage() {
  const companies = getCompaniesIndex();

  return (
    <div className="container py-8 sm:py-12 max-w-6xl">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Companies", path: "/companies" },
        ]}
      />

      {/* Header section */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
              <Building2 className="size-3.5" />
              185 Companies &bull; Recency &amp; Frequency Breakdown
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Company-Tagged Questions
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
            Practice problems filtered by frequency and time interval (last 30 days, 3 months, 6 months, all-time) from real technical interview rounds.
          </p>
        </div>

        <Watermark variant="pill" className="shrink-0 self-start sm:self-center" />
      </div>

      {/* Watermark Banner */}
      <Watermark
        variant="banner"
        className="mt-6 mb-8"
        subtext="Real interview question frequencies curated for CampusLoop placements"
      />

      {/* Interactive Directory */}
      <CompanyDirectory companies={companies as any} />

      {/* Watermark Card at Bottom */}
      <Watermark variant="card" className="mt-14" />
    </div>
  );
}
