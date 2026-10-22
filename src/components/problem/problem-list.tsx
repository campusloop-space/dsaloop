import Link from "next/link";
import { DifficultyBadge } from "@/components/ui/badge";
import { CuteCatEmpty } from "@/components/ui/cute-illustrations";
import type { ProblemIndexEntry } from "@/lib/schema/types";

export function ProblemList({
  problems,
  emptyMessage = "No problems found.",
}: {
  problems: ProblemIndexEntry[];
  emptyMessage?: string;
}) {
  if (problems.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border/80 bg-card/50 p-12 text-center flex flex-col items-center justify-center">
        <CuteCatEmpty size={100} />
        <p className="mt-4 font-heading text-base font-bold text-foreground">{emptyMessage}</p>
        <p className="mt-1 text-xs text-muted-foreground">Try adjusting your search terms or exploring by topic or roadmap.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xs">
      <div className="grid grid-cols-[3.5rem_minmax(0,1fr)_auto] border-b border-border/60 bg-muted/30 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground sm:grid-cols-[4rem_minmax(0,1fr)_7rem_14rem]">
        <span>#</span>
        <span>Problem</span>
        <span className="hidden sm:block">Difficulty</span>
        <span className="hidden sm:block">Topics</span>
      </div>

      <ul className="divide-y divide-border/60">
        {problems.map((problem) => (
          <li key={problem.slug}>
            <Link
              href={`/problems/${problem.slug}`}
              className="grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none sm:grid-cols-[4rem_minmax(0,1fr)_7rem_14rem] group"
            >
              <span className="font-mono text-xs tabular-nums text-muted-foreground font-semibold">
                {problem.number}
              </span>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {problem.title}
                  </p>
                  <span className="hidden rounded-full bg-muted/60 border border-border/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
                    ~{problem.estimatedMinutes} min
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[11px] capitalize text-muted-foreground sm:hidden">
                  {problem.topics.slice(0, 2).map((t) => t.replace(/-/g, " ")).join(" · ")}
                </p>
              </div>

              <div className="shrink-0">
                <DifficultyBadge difficulty={problem.difficulty} />
              </div>

              <p className="hidden truncate text-xs capitalize text-muted-foreground sm:block">
                {problem.topics.slice(0, 3).map((t) => t.replace(/-/g, " ")).join(" · ")}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
