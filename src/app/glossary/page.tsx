import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = buildMetadata({
  title: "Algorithm Glossary | DSALoop by CampusLoop",
  description: "Definitions of common algorithms, data structures, and interview patterns.",
  keywords: ["algorithm glossary", "data structure definitions"],
  canonicalPath: "/glossary",
});

const terms = [
  { term: "Two Pointers", href: "/patterns/two-pointers", def: "Pair of indices scanning a sequence to find pairs or partitions." },
  { term: "Sliding Window", href: "/patterns/sliding-window", def: "Maintain a contiguous window with O(1) updates for subarray/substring goals." },
  { term: "Binary Search", href: "/patterns/binary-search", def: "Halve a monotonic search space each step." },
  { term: "Dynamic Programming", href: "/patterns/dynamic-programming", def: "Solve overlapping subproblems via memoization or tabulation." },
  { term: "Union Find", href: "/patterns/union-find", def: "Disjoint-set structure for connectivity queries and merges." },
  { term: "BFS", href: "/patterns/queue-bfs", def: "Level-order graph/tree exploration; shortest path in unweighted graphs." },
  { term: "DFS", href: "/patterns/dfs-backtracking", def: "Deep recursive exploration for components, paths, and search trees." },
  { term: "Trie", href: "/patterns/trie", def: "Prefix tree for efficient string dictionary operations." },
  { term: "Heap", href: "/patterns/heap", def: "Priority queue supporting extract-min/max in logarithmic time." },
  { term: "Kadane", href: "/patterns/kadane", def: "Linear-time maximum subarray via local optimal running sums." },
];

export default function GlossaryPage() {
  return (
    <div className="container py-10">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Glossary", path: "/glossary" }]} />
      <h1 className="mt-4 text-3xl font-bold">Glossary</h1>
      <dl className="mt-8 space-y-4 max-w-3xl">
        {terms.map((t) => (
          <div key={t.term} className="rounded-xl border border-border bg-card p-4">
            <dt className="font-semibold">
              <Link href={t.href} className="hover:text-primary">
                {t.term}
              </Link>
            </dt>
            <dd className="mt-1 text-sm text-muted-foreground">{t.def}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
