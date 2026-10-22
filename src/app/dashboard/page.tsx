import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { DashboardClient } from "@/components/dashboard-client";
import { CuteSparkle } from "@/components/ui/cute-illustrations";

export const metadata: Metadata = buildMetadata(
  {
    title: "Progress Dashboard & Bookmarks | DSALoop",
    description: "Local progress, bookmarks, practice streaks, notes, and review queue on CampusLoop.",
    keywords: ["leetcode progress", "study streak", "coding practice dashboard", "dsaloop progress"],
    canonicalPath: "/dashboard",
  },
  {
    robots: {
      index: false,
      follow: true,
    },
  },
);

export default function DashboardPage() {
  return (
    <div className="container py-10 md:py-12">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Progress", path: "/dashboard" }]} />

      <header className="mt-5 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1 text-xs font-semibold text-muted-foreground shadow-2xs">
          <CuteSparkle className="size-3.5 text-primary" />
          <span>Local Device Storage</span>
        </div>
        <h1 className="mt-3 font-heading text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          Your Progress &amp; Vault
        </h1>
        <p className="mt-2 text-sm sm:text-base leading-relaxed text-muted-foreground">
          Your study state is persisted securely in your local browser storage. Solved problems, active streaks, notes, and review items stay lightweight, zero-login, and always available.
        </p>
      </header>

      <div className="mt-8">
        <DashboardClient />
      </div>
    </div>
  );
}
