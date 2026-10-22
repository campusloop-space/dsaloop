import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { PracticeClient } from "@/components/practice/practice-client";

export const metadata: Metadata = buildMetadata({
  title: "Practice Modes | DSALoop by CampusLoop",
  description: "Daily, random, and timed coding interview practice without an account.",
  keywords: ["leetcode practice", "daily challenge", "coding interview practice"],
  canonicalPath: "/practice",
});

export default function PracticePage() {
  return (
    <div className="container py-10">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Practice", path: "/practice" }]} />
      <h1 className="mt-4 text-3xl font-bold">Practice</h1>
      <p className="mt-2 text-muted-foreground">Local modes — no account required.</p>
      <div className="mt-8"><PracticeClient /></div>
    </div>
  );
}
