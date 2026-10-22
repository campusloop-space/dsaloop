"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight, Flame, Calendar, Clock, BookOpen, Search, CheckCircle2 } from "lucide-react";
import type { Company, CompanyProblemEntry } from "@/lib/schema/types";
import { DifficultyBadge } from "@/components/ui/badge";

type TimeframeKey = "thirtyDays" | "threeMonths" | "sixMonths" | "allTime";

interface CompanyTrackViewProps {
  company: Company;
}

export function CompanyTrackView({ company }: CompanyTrackViewProps) {
  const timeframes = company.timeframes;

  // Pick initial tab: thirtyDays if available, else threeMonths, sixMonths, or allTime
  const defaultTab: TimeframeKey = useMemo(() => {
    if (timeframes?.thirtyDays && timeframes.thirtyDays.length > 0) return "thirtyDays";
    if (timeframes?.threeMonths && timeframes.threeMonths.length > 0) return "threeMonths";
    if (timeframes?.sixMonths && timeframes.sixMonths.length > 0) return "sixMonths";
    return "allTime";
  }, [timeframes]);

  const [activeTab, setActiveTab] = useState<TimeframeKey>(defaultTab);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  const currentList = useMemo(() => {
    let list: CompanyProblemEntry[] = [];
    if (timeframes && timeframes[activeTab]) {
      list = timeframes[activeTab];
    } else {
      // Fallback
      list = company.problemSlugs.map((slug) => ({
        slug,
        title: slug.replace(/-/g, " "),
        difficulty: "Medium" as const,
        frequency: 50,
      }));
    }

    if (difficultyFilter !== "all") {
      list = list.filter((p) => p.difficulty.toLowerCase() === difficultyFilter.toLowerCase());
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          (p.number && String(p.number).includes(q))
      );
    }

    return list;
  }, [timeframes, activeTab, company.problemSlugs, difficultyFilter, search]);

  const tabs: { key: TimeframeKey; label: string; icon: typeof Flame; count: number }[] = [
    {
      key: "thirtyDays",
      label: "Past 30 Days",
      icon: Flame,
      count: timeframes?.thirtyDays?.length ?? 0,
    },
    {
      key: "threeMonths",
      label: "Past 3 Months",
      icon: Clock,
      count: timeframes?.threeMonths?.length ?? 0,
    },
    {
      key: "sixMonths",
      label: "Past 6 Months",
      icon: Calendar,
      count: timeframes?.sixMonths?.length ?? 0,
    },
    {
      key: "allTime",
      label: "All Time",
      icon: BookOpen,
      count: timeframes?.allTime?.length ?? company.problemCount,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Timeframe selector tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          const isFire = tab.key === "thirtyDays";

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-2xs scale-102"
                  : "bg-muted/40 hover:bg-muted/70 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`size-3.5 ${isFire && !isActive ? "text-coral" : ""}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-white/20 text-white" : "bg-card text-muted-foreground border border-border/40"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and difficulty filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems in this track..."
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-border/80 bg-card/60 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="flex items-center gap-1">
          {["all", "easy", "medium", "hard"].map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => setDifficultyFilter(diff)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                difficultyFilter === diff
                  ? "bg-foreground text-background font-bold shadow-2xs"
                  : "bg-muted/30 hover:bg-muted/60 text-muted-foreground"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Problems Table */}
      {currentList.length === 0 ? (
        <div className="py-12 text-center rounded-2xl border border-dashed border-border/70 p-6">
          <p className="text-xs font-semibold text-muted-foreground">
            No problems found for this filter.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/80 bg-card/60 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-bold">
                <tr>
                  <th className="py-3 px-4 w-16">#</th>
                  <th className="py-3 px-4">Problem</th>
                  <th className="py-3 px-4 w-28">Difficulty</th>
                  <th className="py-3 px-4 w-36">Frequency</th>
                  <th className="py-3 px-4 w-24 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {currentList.map((prob) => {
                  const freq = Math.round(prob.frequency ?? 50);

                  return (
                    <tr
                      key={prob.slug}
                      className="group hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-muted-foreground">
                        {prob.number ? `#${prob.number}` : "—"}
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/problems/${prob.slug}`}
                          className="font-semibold text-foreground group-hover:text-primary transition-colors inline-flex items-center gap-1.5"
                        >
                          <span>{prob.title}</span>
                          <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <DifficultyBadge difficulty={prob.difficulty} />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-muted/60 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${Math.min(100, freq)}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] font-bold text-muted-foreground">
                            {freq}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/problems/${prob.slug}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-bold transition-colors"
                        >
                          <span>Solve</span>
                          <ArrowUpRight className="size-2.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
