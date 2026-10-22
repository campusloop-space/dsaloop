import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { siteConfig } from "@/lib/config";
import { CuteCatMascot, CuteSparkle } from "@/components/ui/cute-illustrations";

export const metadata: Metadata = buildMetadata({
  title: "About DSALoop — CampusLoop DSA Workspace",
  description: siteConfig.description,
  keywords: ["about dsaloop", "campusloop dsa", "campusloop interview platform"],
  canonicalPath: "/about",
});

export default function AboutPage() {
  return (
    <div className="container py-10 md:py-12 max-w-3xl">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }]} />

      <div className="mt-8 rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-2xs shrink-0">
            <CuteCatMascot size={40} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
              <CuteSparkle className="size-3.5" />
              <span>CampusLoop Ecosystem</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-foreground">
              About DSALoop
            </h1>
          </div>
        </div>

        <p className="mt-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
          DSALoop is an open, student-first DSA and coding interview platform built for the{" "}
          <a
            href="https://campusloop.space"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-foreground hover:text-primary transition-colors underline"
          >
            CampusLoop
          </a>{" "}
          community. We organize open solution datasets into a pattern-first learning workspace with curated roadmaps, multi-language solutions, and zero-distraction browser-local progress tracking.
        </p>

        <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
          We focus on building true algorithmic intuition—spotting why two pointers works, when to slide a window, or how tree recursion maps directly into dynamic programming.
        </p>

        <p className="mt-4 text-xs sm:text-sm text-muted-foreground leading-relaxed pt-4 border-t border-border/50">
          We do not republish official proprietary LeetCode content. Always reference the official platform for full contest benchmarks and live judge testing. Solution implementations are attributed under MIT license — see{" "}
          <Link href="/about/attribution" className="text-primary font-bold hover:underline">
            attribution
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
