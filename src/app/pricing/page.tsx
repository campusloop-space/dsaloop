import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = buildMetadata({
  title: "Pricing | DSALoop by CampusLoop",
  description: "Free forever learning. Premium for sync, AI coach, and personalization — coming soon.",
  keywords: ["algoforge pricing", "interview prep premium"],
  canonicalPath: "/pricing",
});

const tiers = [
  {
    name: "Free",
    price: "$0",
    features: [
      "All problem explanations",
      "Multi-language solutions",
      "Roadmaps & Blind 75",
      "Local bookmarks & progress",
      "Search",
    ],
  },
  {
    name: "Pro",
    price: "Soon",
    features: [
      "Cloud sync",
      "AI explanations & hints",
      "Personalized roadmap",
      "Weak topic detection",
      "PDF export & flashcards",
    ],
  },
  {
    name: "Teams / Campus",
    price: "Soon",
    features: [
      "Enterprise dashboard",
      "Campus licenses",
      "Cohort progress",
      "SSO (future)",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="container py-10">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }]} />
      <h1 className="mt-4 text-3xl font-bold">Pricing</h1>
      <p className="mt-2 text-muted-foreground max-w-xl">
        Core learning content stays free and indexable. Premium unlocks personalization and sync —
        never the basic explanations.
      </p>
      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {tiers.map((t) => (
          <div key={t.name} className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold">{t.name}</h2>
            <p className="mt-2 text-3xl font-bold">{t.price}</p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              {t.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
