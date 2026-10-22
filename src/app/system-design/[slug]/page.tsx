import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Image as ImageIcon, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import {
  getAllSystemDesignSlugs,
  getSystemDesignChapter,
} from "@/lib/data/problems";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { MarkdownBody } from "@/components/markdown-body";
import { Watermark } from "@/components/ui/watermark";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSystemDesignSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getSystemDesignChapter(slug);
  if (!chapter) return {};

  return buildMetadata({
    title: `${chapter.title} (Chapter ${chapter.chapterNumber}) — System Design Interview | DSALoop by CampusLoop`,
    description: `${chapter.subtitle} • DSALoop by https://campusloop.space/`,
    canonicalPath: `/system-design/${chapter.slug}`,
    keywords: [
      ...chapter.tags.map((t) => t.toLowerCase()),
      "system design interview",
      "distributed systems architecture",
      "dsaloop",
      "campusloop",
    ],
  });
}

export default async function SystemDesignChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = getSystemDesignChapter(slug);
  if (!chapter) notFound();

  return (
    <div className="container py-8 sm:py-12 max-w-6xl">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "System Design", path: "/system-design" },
          { name: chapter.title, path: `/system-design/${chapter.slug}` },
        ]}
      />

      {/* Chapter header */}
      <header className="mt-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-heading font-black text-xs px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary">
              Chapter {String(chapter.chapterNumber).padStart(2, "0")}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground px-2 py-0.5 rounded-md bg-muted/50 border border-border/40">
              <Clock className="size-3" />
              {chapter.readTimeMinutes} min read
            </span>
            {chapter.imagesCount > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground px-2 py-0.5 rounded-md bg-muted/50 border border-border/40">
                <ImageIcon className="size-3" />
                {chapter.imagesCount} diagrams
              </span>
            )}
          </div>

          <Watermark variant="pill" />
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
          {chapter.title}
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
          {chapter.subtitle}
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {chapter.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted/50 text-muted-foreground border border-border/60"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* Watermark Banner */}
      <Watermark variant="banner" className="mt-6 mb-8" />

      {/* Content & Sidebar Grid */}
      <div className="grid lg:grid-cols-[1fr_260px] gap-10">
        <article className="min-w-0">
          <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:underline-offset-4 prose-img:rounded-2xl prose-img:border prose-img:border-border/80 prose-img:shadow-2xs prose-img:mx-auto prose-img:my-8 prose-img:max-h-[500px] prose-img:object-contain prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-xl">
            <MarkdownBody html={chapter.html} />
          </div>

          {/* Navigation between chapters */}
          <nav
            className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/60 pt-6"
            aria-label="Chapter navigation"
          >
            {chapter.prevChapter ? (
              <Link
                href={`/system-design/${chapter.prevChapter.slug}`}
                className="group flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors self-start"
              >
                <div className="size-8 rounded-full bg-muted/60 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <ChevronLeft className="size-4" />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] uppercase font-bold text-muted-foreground">Previous Chapter</span>
                  <span className="font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                    {chapter.prevChapter.title}
                  </span>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {chapter.nextChapter ? (
              <Link
                href={`/system-design/${chapter.nextChapter.slug}`}
                className="group flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors self-end"
              >
                <div className="text-right">
                  <span className="block text-[10px] uppercase font-bold text-muted-foreground">Next Chapter</span>
                  <span className="font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                    {chapter.nextChapter.title}
                  </span>
                </div>
                <div className="size-8 rounded-full bg-muted/60 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <ChevronRight className="size-4" />
                </div>
              </Link>
            ) : (
              <div />
            )}
          </nav>

          {/* Watermark Card at Bottom */}
          <Watermark variant="card" className="mt-10" />
        </article>

        {/* Sticky Table of Contents Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-2xl border border-border/80 bg-card/60 p-4 shadow-2xs backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <BookOpen className="size-3.5 text-primary" />
                <span>On This Page</span>
              </div>

              {chapter.tableOfContents.length > 0 ? (
                <ul className="space-y-1.5 text-xs max-h-[60vh] overflow-y-auto pr-2">
                  {chapter.tableOfContents.map((item, idx) => (
                    <li
                      key={idx}
                      className={item.level === 3 ? "pl-3 text-muted-foreground" : "font-medium text-foreground"}
                    >
                      <a
                        href={`#${item.id}`}
                        className="hover:text-primary transition-colors block py-0.5 line-clamp-1"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">Architecture deep dive</p>
              )}

              <div className="mt-4 pt-3 border-t border-border/40">
                <Watermark variant="inline" />
              </div>
            </div>

            <Link
              href="/system-design"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted/70 px-4 py-2.5 text-xs font-bold text-foreground transition-colors"
            >
              <BookOpen className="size-3.5" />
              <span>All 28 Chapters</span>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
