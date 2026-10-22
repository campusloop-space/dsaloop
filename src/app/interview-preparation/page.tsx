import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = buildMetadata({
  title: "Coding Interview Preparation Guide | DSALoop by CampusLoop",
  description:
    "A complete interview preparation plan: patterns, Blind 75, company tracks, mock strategy.",
  keywords: ["coding interview preparation", "faang interview prep"],
  canonicalPath: "/interview-preparation",
});

export default function InterviewPrepPage() {
  return (
    <div className="container py-10 max-w-3xl">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Interview preparation", path: "/interview-preparation" },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold">Interview preparation</h1>
      <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
        <p>
          Treat interview prep as pattern acquisition + communication skill — not a race to 500
          green checks.
        </p>
        <ol className="list-decimal ml-5 space-y-2">
          <li>
            Finish{" "}
            <Link href="/roadmaps/dsa-fundamentals" className="text-primary hover:underline">
              DSA fundamentals
            </Link>
            .
          </li>
          <li>
            Complete{" "}
            <Link href="/blind-75" className="text-primary hover:underline">
              Blind 75
            </Link>{" "}
            with spaced repetition.
          </li>
          <li>
            Drill weak patterns via the{" "}
            <Link href="/patterns" className="text-primary hover:underline">
              pattern explorer
            </Link>
            .
          </li>
          <li>
            Add a company track from{" "}
            <Link href="/companies" className="text-primary hover:underline">
              companies
            </Link>
            .
          </li>
          <li>Do timed mocks weekly; explain solutions out loud.</li>
        </ol>
      </div>
    </div>
  );
}
