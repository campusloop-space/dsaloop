import Link from "next/link";
import { ArrowRight, BookOpen, Compass, Layers3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CuteCatStudy, CuteSparkle } from "@/components/ui/cute-illustrations";

export function TerminalHero({
  problemCount,
  patternCount,
  topicCount,
  languageCount,
}: {
  problemCount: number;
  patternCount: number;
  topicCount: number;
  languageCount: number;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-canvas-soft/20 via-background to-background py-10 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-14">
          {/* Left Column: Heading & CTAs */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-muted-foreground shadow-2xs">
              <CuteSparkle className="size-3.5 text-primary" />
              <span className="font-heading font-black text-foreground">
                DSA<span className="text-primary font-black">Loop</span>
              </span>
              <span>by</span>
              <a
                href="https://campusloop.space/"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-foreground hover:text-primary transition-colors underline-offset-2 hover:underline"
              >
                https://campusloop.space/
              </a>
              <span className="size-1 rounded-full bg-border" />
              <span className="text-primary font-bold">Free &amp; Open Source</span>
            </div>

            <h1 className="mt-5 font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.05]">
              Stop grinding at random.
              <span className="block text-primary mt-1">Master reusable patterns.</span>
            </h1>

            <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
              DSALoop turns overwhelming LeetCode lists into structured roadmaps, recognizable algorithmic patterns, and clean multi-language solutions. Designed for college students and developers preparing for campus placements.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="rounded-full shadow-2xs">
                <Link href="/roadmaps/dsa-fundamentals">
                  <Compass className="size-4" />
                  <span>Start Roadmap</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="rounded-full">
                <Link href="/problems">
                  <BookOpen className="size-4" />
                  <span>Browse Problems</span>
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link href="/patterns">
                  <Layers3 className="size-4" />
                  <span>Pattern Index</span>
                </Link>
              </Button>
            </div>

            {/* Quick Metrics Cards */}
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Problems", problemCount],
                ["Patterns", patternCount],
                ["Topics", topicCount],
                ["Languages", languageCount],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-border/80 bg-card p-3.5 shadow-2xs transition-all hover:border-border-strong hover:shadow-sm"
                >
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-1 font-heading text-2xl font-bold text-foreground tabular-nums">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Featured Study Card with Mascot */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-2xs">
                    <CuteCatStudy size={32} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Today&apos;s Featured Pattern
                    </span>
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      Sliding Window
                    </h3>
                  </div>
                </div>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary border border-primary/20">
                  Pattern #01
                </span>
              </div>

              {/* Signal Box */}
              <div className="mt-5 rounded-2xl border border-primary-soft-border bg-primary-soft p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                  <Sparkles className="size-3.5" />
                  <span>How to recognize the signal</span>
                </div>
                <p className="mt-2 text-sm font-bold text-foreground">
                  &ldquo;Contiguous subarray / substring + moving constraint + target sum / length&rdquo;
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Instead of quadratic re-computation, maintain two pointers and slide the window boundary incrementally in O(n) time.
                </p>
              </div>

              {/* Step by step */}
              <div className="mt-4 grid grid-cols-3 gap-2.5">
                {[
                  { step: "01", title: "Spot", desc: "Contiguous window" },
                  { step: "02", title: "Expand", desc: "Right pointer moves" },
                  { step: "03", title: "Shrink", desc: "Left pointer adjusts" },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="rounded-xl border border-border/70 bg-surface-raised p-2.5 text-center"
                  >
                    <span className="font-mono text-[10px] font-bold text-primary">
                      {item.step}
                    </span>
                    <p className="font-bold text-xs text-foreground mt-0.5">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Action button */}
              <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-foreground">Target Practice Set</p>
                  <p className="text-[11px] text-muted-foreground">3 classic problems to cement the pattern</p>
                </div>
                <Button asChild size="sm" variant="secondary" className="rounded-full">
                  <Link href="/patterns/sliding-window">
                    <span>Solve Set</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
