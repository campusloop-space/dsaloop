import Link from "next/link";
import { ArrowRight, BookOpen, Layers3, Route, Search, Sparkles, Target, Server, Building2, Flame } from "lucide-react";
import { getManifest, getProblemsIndex, getTopicsIndex, getRoadmapsIndex, getCompaniesIndex, getSystemDesignIndex } from "@/lib/data/problems";
import { DifficultyBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TerminalHero } from "@/components/terminal/terminal-hero";
import { CuteSparkle } from "@/components/ui/cute-illustrations";
import { Watermark } from "@/components/ui/watermark";

export default function HomePage() {
  const manifest = getManifest();
  const problems = getProblemsIndex().slice(0, 6);
  const topics = getTopicsIndex().slice(0, 6);
  const roadmaps = getRoadmapsIndex().slice(0, 4);
  const companies = getCompaniesIndex().slice(0, 6);
  const systemDesign = getSystemDesignIndex().slice(0, 6);

  return (
    <div className="site-shell">
      <TerminalHero
        problemCount={manifest?.problemCount ?? 0}
        patternCount={manifest?.patternCount ?? 0}
        topicCount={manifest?.topicCount ?? 0}
        languageCount={manifest?.languages.length ?? 0}
      />

      {/* Watermark Banner */}
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        <Watermark
          variant="banner"
          subtext="The pattern-first DSA, 185+ company problem sets, and 28-chapter system design primer"
        />
      </div>

      {/* Outcome Paths Section */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            Choose your learning mode
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Start with an outcome, not an endless list.
          </h2>
          <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-muted-foreground">
            Every route is built to take you from concept → pattern recognition → targeted practice without curriculum fatigue.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              href: "/roadmaps/dsa-fundamentals",
              icon: Route,
              title: "Follow a Roadmap",
              desc: "A progressive path from arrays and hashing up through trees, graphs, and dynamic programming.",
              action: "Explore Roadmaps",
            },
            {
              href: "/system-design",
              icon: Server,
              title: "System Design",
              desc: "28 comprehensive chapters from zero to millions of users, with 300+ clear architecture diagrams.",
              action: "Read 28 Chapters",
            },
            {
              href: "/companies",
              icon: Building2,
              title: "Company Tracks",
              desc: "185+ companies (Google, Meta, TCS, Citadel) filtered by 30-day, 3-month recency frequencies.",
              action: "View Companies",
            },
            {
              href: "/patterns",
              icon: Layers3,
              title: "Learn by Pattern",
              desc: "Master reusable algorithmic paradigms: two pointers, sliding window, BFS/DFS, and interval merges.",
              action: "View All Patterns",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="group">
                <Card className="h-full flex flex-col justify-between">
                  <CardHeader>
                    <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-2xs group-hover:scale-105 transition-transform">
                      <Icon className="size-4" />
                    </div>
                    <CardTitle className="mt-3 text-base">{item.title}</CardTitle>
                    <CardDescription className="mt-1 text-xs">{item.desc}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <span className="inline-flex items-center text-xs font-bold text-primary group-hover:underline">
                      {item.action}
                      <ArrowRight className="ml-1 size-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Structured Roadmaps Section */}
      <section className="border-y border-border/60 bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                Structured Curriculums
              </p>
              <h2 className="mt-1 font-heading text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Roadmaps with real conceptual sequence
              </h2>
            </div>
            <Link
              href="/roadmaps"
              className="hidden items-center gap-1 text-xs font-bold text-primary hover:underline sm:flex"
            >
              <span>View all roadmaps</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {roadmaps.map((roadmap) => (
              <Link key={roadmap.slug} href={`/roadmaps/${roadmap.slug}`} className="group">
                <Card className="h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-heading text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          {roadmap.name}
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                          {roadmap.description}
                        </p>
                      </div>
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                        <ArrowRight className="size-3.5" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 pt-3 border-t border-border/50 text-[11px] font-semibold text-muted-foreground">
                      <span className="rounded-md bg-muted px-2 py-0.5 text-foreground font-mono">
                        {roadmap.steps.length} milestones
                      </span>
                      <span>•</span>
                      <span>Self-paced progression</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Practice & Destinations Section */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Problems preview */}
          <div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  Warm-Up Practice
                </p>
                <h2 className="mt-1 font-heading text-2xl font-black tracking-tight text-foreground">
                  A focused set to get moving
                </h2>
              </div>
              <Link
                href="/problems"
                className="hidden items-center gap-1 text-xs font-bold text-primary hover:underline sm:flex"
              >
                <span>All problems</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="mt-6 divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xs">
              {problems.map((problem) => (
                <Link
                  key={problem.slug}
                  href={`/problems/${problem.slug}`}
                  className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-muted/40 group"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      <span className="mr-2 font-mono text-[11px] text-muted-foreground">#{problem.number}</span>
                      {problem.title}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                      {problem.topics.slice(0, 2).map((t) => t.replace(/-/g, " ")).join(" · ")}
                    </p>
                  </div>
                  <DifficultyBadge difficulty={problem.difficulty} />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick study collections */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              Curated Collections
            </p>
            <h2 className="mt-1 font-heading text-2xl font-black tracking-tight text-foreground">
              Interview-ready study sheets
            </h2>

            <div className="mt-6 grid gap-3">
              {[
                {
                  href: "/blind-75",
                  title: "Blind 75 Curated Sheet",
                  desc: "The most frequent 75 interview questions covering core patterns.",
                  badge: "75 Problems",
                },
                {
                  href: "/grind-169",
                  title: "Grind 169 Extended Path",
                  desc: "Comprehensive coverage when you have 4-8 weeks to prepare.",
                  badge: "169 Problems",
                },
                {
                  href: "/companies",
                  title: "Company Question Sets",
                  desc: "Browse problems tagged by recent company interview history.",
                  badge: "Hiring Prep",
                },
                {
                  href: "/dashboard",
                  title: "Your Progress & Bookmarks",
                  desc: "Track completed questions, bookmarks, and confidence ratings locally.",
                  badge: "Private & Local",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-border/80 bg-card p-3.5 shadow-2xs transition-all hover:border-border-strong hover:shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </p>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          {item.badge}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Watermark Card */}
      <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <Watermark variant="card" />
      </div>

      {/* Minimal Loop Philosophy CTA Banner */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-2xs">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <CuteSparkle className="size-3.5" />
                <span>Zero Account Barrier</span>
              </div>
              <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Study with intent. Keep progress right in your browser.
              </h2>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                DSALoop stores bookmarks, review queues, and solved status locally on your device. Fast, private, and always available offline without signups.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/dashboard">
                  <span>Open Progress</span>
                  <Target className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
