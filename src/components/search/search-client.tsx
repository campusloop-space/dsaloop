"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import MiniSearch from "minisearch";
import { Search } from "lucide-react";
import type { SearchDocument } from "@/lib/schema/types";
import { DifficultyBadge } from "@/components/ui/badge";
import { CuteCatEmpty, CuteCatSearch } from "@/components/ui/cute-illustrations";

export function SearchClient() {
  const [query, setQuery] = useState("");
  const [documents, setDocuments] = useState<SearchDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!query.trim() || documents.length || loading) return;

    setLoading(true);
    fetch("/search-index.json", { cache: "force-cache" })
      .then((response) => {
        if (!response.ok) throw new Error("Search index could not be loaded.");
        return response.json() as Promise<SearchDocument[]>;
      })
      .then((data) => setDocuments(data))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Search index could not be loaded.");
      })
      .finally(() => setLoading(false));
  }, [query, documents.length, loading]);

  const index = useMemo(() => {
    if (!documents.length) return null;

    const mini = new MiniSearch<SearchDocument>({
      idField: "id",
      fields: ["title", "description", "keywords", "slug"],
      storeFields: [
        "id",
        "type",
        "title",
        "slug",
        "path",
        "description",
        "difficulty",
        "topics",
        "patterns",
        "number",
      ],
      searchOptions: {
        boost: { title: 3, keywords: 2 },
        fuzzy: 0.2,
        prefix: true,
      },
    });

    const seen = new Set<string>();
    mini.addAll(
      documents.filter((d) => {
        if (seen.has(d.id)) return false;
        seen.add(d.id);
        return true;
      })
    );
    return mini;
  }, [documents]);

  const results = useMemo<SearchDocument[]>(() => {
    if (!query.trim() || !index) return [];
    return index.search(query, { combineWith: "AND" }).slice(0, 30) as unknown as SearchDocument[];
  }, [query, index]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <label htmlFor="search" className="sr-only">
          Search problems, topics, patterns
        </label>
        <div className="relative flex items-center">
          <Search className="absolute left-4 size-4 text-muted-foreground pointer-events-none" />
          <input
            id="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search problems (e.g. Two Sum, Sliding Window, DP, Blind 75)…"
            className="w-full rounded-2xl border border-border/80 bg-card pl-11 pr-4 py-3.5 text-sm font-medium shadow-2xs transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
            autoFocus
          />
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground px-1">
          Fast client-side indexing across 3,000+ problems, company tags, and patterns.
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-12 text-sm text-muted-foreground gap-2">
          <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Loading search index…</span>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-xs font-semibold text-destructive">
          {error}
        </div>
      )}

      {!loading && !error && !query.trim() && (
        <div className="rounded-3xl border border-border/60 bg-card/40 p-12 text-center flex flex-col items-center justify-center">
          <CuteCatSearch size={90} />
          <p className="mt-4 font-heading text-base font-bold text-foreground">
            Search anything in the DSA vault
          </p>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm">
            Type problem names, techniques, or companies like &ldquo;Google&rdquo; or &ldquo;Two Pointers&rdquo;.
          </p>
        </div>
      )}

      {!loading && !error && query.trim() && results.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border/80 bg-card/50 p-12 text-center flex flex-col items-center justify-center">
          <CuteCatEmpty size={90} />
          <p className="mt-4 font-heading text-base font-bold text-foreground">
            No results found for &ldquo;{query}&rdquo;
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try searching for a simpler keyword, pattern name, or problem number.
          </p>
        </div>
      )}

      <ul className="space-y-2.5">
        {results.map((r) => (
          <li key={r.id}>
            <Link
              href={r.path}
              className="block rounded-2xl border border-border/80 bg-card p-4 transition-all hover:border-border-strong hover:shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="flex flex-wrap items-center gap-2">
                {r.number != null && (
                  <span className="font-mono text-xs font-bold text-muted-foreground">
                    #{r.number}
                  </span>
                )}
                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground bg-muted/60 border border-border/40 px-2 py-0.5 rounded-md">
                  {r.type}
                </span>
                {r.difficulty && <DifficultyBadge difficulty={r.difficulty} />}
              </div>
              <p className="mt-1.5 font-heading text-sm font-bold text-foreground">{r.title}</p>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {r.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
