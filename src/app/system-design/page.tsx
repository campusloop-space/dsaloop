import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Clock, FileText, Image as ImageIcon, Sparkles, Layers } from "lucide-react";
import { getSystemDesignIndex } from "@/lib/data/problems";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Watermark } from "@/components/ui/watermark";

export const metadata: Metadata = buildMetadata({
  title: "System Design Interview Primer (28 Chapters) — DSALoop by CampusLoop",
  description:
    "Comprehensive 28-chapter system design guide with architecture diagrams, back-of-the-envelope estimation, rate limiters, distributed message queues, and real-world system designs. DSALoop by https://campusloop.space/",
  keywords: [
    "system design interview",
    "system design primer",
    "system design notes",
    "rate limiter design",
    "distributed systems",
    "url shortener system design",
    "chat system design",
    "dsaloop",
    "campusloop",
  ],
  canonicalPath: "/system-design",
});

export default function SystemDesignPage() {
  const chapters = getSystemDesignIndex().sort((a, b) => a.chapterNumber - b.chapterNumber);

  return (
    <div className="container py-8 sm:py-12 max-w-6xl">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "System Design", path: "/system-design" },
        ]}
      />

      {/* Header section */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
              <BookOpen className="size-3.5" />
              28 Chapters &bull; Architecture Deep Dives
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            System Design Interview Guide
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
            From zero to millions of users. Master step-by-step high-level architecture, capacity estimation, trade-offs, and deep dives with 300+ clear system diagrams.
          </p>
        </div>

        <Watermark variant="pill" className="shrink-0 self-start sm:self-center" />
      </div>

      {/* Watermark Banner */}
      <Watermark
        variant="banner"
        className="mt-6"
        subtext="Complete system design interview companion for CampusLoop students"
      />

      {/* Chapters Grid */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {chapters.map((chapter) => (
          <Link
            key={chapter.slug}
            href={`/system-design/${chapter.slug}`}
            className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card/70 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-heading font-black text-xs px-2 py-0.5 rounded-md bg-muted/60 border border-border/60 text-muted-foreground group-hover:text-primary group-hover:border-primary/30 transition-colors">
                  Chapter {String(chapter.chapterNumber).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3" />
                    {chapter.readTimeMinutes} min
                  </span>
                  {chapter.imagesCount > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <ImageIcon className="size-3" />
                      {chapter.imagesCount}
                    </span>
                  )}
                </div>
              </div>

              <h2 className="mt-3 font-heading text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {chapter.title}
              </h2>

              <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                {chapter.subtitle}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-border/40 flex flex-wrap gap-1.5">
              {chapter.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted/40 text-muted-foreground border border-border/40"
                >
                  {tag}
                </span>
              ))}
              {chapter.tags.length > 3 && (
                <span className="text-[10px] text-muted-foreground">
                  +{chapter.tags.length - 3}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Watermark Card at Bottom */}
      <Watermark variant="card" className="mt-14" />
    </div>
  );
}
