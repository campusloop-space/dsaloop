"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Building2, Flame, ArrowUpRight } from "lucide-react";
import type { Company } from "@/lib/schema/types";

interface CompanyIndexItem extends Company {
  difficultyBreakdown?: {
    easy: number;
    medium: number;
    hard: number;
  };
  timeframeCounts?: {
    thirtyDays: number;
    threeMonths: number;
    sixMonths: number;
    allTime: number;
  };
}

export function CompanyDirectory({ companies }: { companies: CompanyIndexItem[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "recent" | "faang" | "fintech" | "india">("all");

  const FAANG_SLUGS = new Set(["google", "meta", "amazon", "apple", "microsoft", "netflix", "uber", "bloomberg", "adobe", "salesforce", "oracle", "tiktok"]);
  const FINTECH_SLUGS = new Set(["goldman-sachs", "citadel", "de-shaw", "two-sigma", "jane-street", "jpmorgan", "morgan-stanley", "stripe", "paypal", "coinbase", "visa", "mastercard", "razorpay", "phonepe", "paytm"]);
  const INDIA_SLUGS = new Set(["tcs", "infosys", "wipro", "cognizant", "flipkart", "phonepe", "razorpay", "swiggy", "zomato", "paytm", "zoho", "hcl", "accenture"]);

  const filtered = useMemo(() => {
    let list = companies;

    if (filter === "recent") {
      list = list.filter((c) => (c.timeframeCounts?.thirtyDays ?? 0) > 0);
    } else if (filter === "faang") {
      list = list.filter((c) => FAANG_SLUGS.has(c.slug));
    } else if (filter === "fintech") {
      list = list.filter((c) => FINTECH_SLUGS.has(c.slug));
    } else if (filter === "india") {
      list = list.filter((c) => INDIA_SLUGS.has(c.slug));
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.slug.includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    return list;
  }, [companies, search, filter]);

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search 180+ companies (Google, Meta, TCS, Citadel)..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-border/80 bg-card/60 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-2xs"
          />
        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filter === "all"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "bg-muted/40 hover:bg-muted/70 text-muted-foreground"
            }`}
          >
            All ({companies.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("recent")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap inline-flex items-center gap-1 transition-colors cursor-pointer ${
              filter === "recent"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "bg-muted/40 hover:bg-muted/70 text-muted-foreground"
            }`}
          >
            <Flame className="size-3 text-coral" />
            <span>Past 30 Days</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter("faang")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filter === "faang"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "bg-muted/40 hover:bg-muted/70 text-muted-foreground"
            }`}
          >
            Big Tech / FAANG
          </button>
          <button
            type="button"
            onClick={() => setFilter("fintech")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filter === "fintech"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "bg-muted/40 hover:bg-muted/70 text-muted-foreground"
            }`}
          >
            Fintech &amp; Quant
          </button>
          <button
            type="button"
            onClick={() => setFilter("india")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filter === "india"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "bg-muted/40 hover:bg-muted/70 text-muted-foreground"
            }`}
          >
            Indian Tech &amp; Placement
          </button>
        </div>
      </div>

      {/* Grid of Companies */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-border/70 p-8">
          <p className="text-sm font-semibold text-muted-foreground">
            No companies matching &quot;{search}&quot;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setFilter("all");
            }}
            className="mt-3 text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((company) => {
            const hasRecent = (company.timeframeCounts?.thirtyDays ?? 0) > 0;
            const initial = company.name.charAt(0).toUpperCase();

            return (
              <Link
                key={company.slug}
                href={`/companies/${company.slug}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card/70 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-heading font-black text-sm text-primary group-hover:scale-105 transition-transform shadow-2xs">
                        {initial}
                      </div>
                      <div>
                        <h2 className="font-heading font-bold text-base text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                          <span>{company.name}</span>
                          <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h2>
                        <span className="text-[11px] font-bold text-primary">
                          {company.problemCount} questions
                        </span>
                      </div>
                    </div>

                    {hasRecent && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-coral/10 text-coral border border-coral/20">
                        <Flame className="size-2.5" />
                        {company.timeframeCounts?.thirtyDays} recent
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {company.description}
                  </p>
                </div>

                {/* Difficulty distribution pill */}
                {company.difficultyBreakdown && (
                  <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 font-mono text-[10px]">
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        {company.difficultyBreakdown.easy} Easy
                      </span>
                      <span className="text-muted-foreground/40">•</span>
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">
                        {company.difficultyBreakdown.medium} Med
                      </span>
                      <span className="text-muted-foreground/40">•</span>
                      <span className="text-coral font-semibold">
                        {company.difficultyBreakdown.hard} Hard
                      </span>
                    </div>

                    <span className="text-[10px] text-muted-foreground font-semibold group-hover:text-foreground transition-colors">
                      View Track &rarr;
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
