import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllProblemSlugs,
  getProblem,
  getProblemsBySlugs,
} from "@/lib/data/problems";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { articleJsonLd, faqJsonLd, howToJsonLd } from "@/lib/seo/jsonld";
import { DifficultyBadge, Badge } from "@/components/ui/badge";
import { CodeTabs } from "@/components/problem/code-tabs";
import { ProblemWorkspace } from "@/components/problem/problem-workspace";
import { BookmarkButton } from "@/components/problem/bookmark-button";
import { ConfidenceTracker } from "@/components/problem/confidence-tracker";
import { ProblemVisualizer } from "@/components/problem/problem-visualizer";
import { StudyPanel } from "@/components/problem/study-panel";
import { MarkdownBody } from "@/components/markdown-body";
import { markdownToHtml } from "@/lib/markdown";
import { ProblemList } from "@/components/problem/problem-list";
import { Watermark } from "@/components/ui/watermark";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProblemSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const problem = getProblem(slug);
  if (!problem) return {};
  return buildMetadata(problem.seo);
}

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const problem = getProblem(slug);
  if (!problem) notFound();

  const sectionsHtml = await Promise.all(
    problem.content.map(async (s) => ({
      ...s,
      html: await markdownToHtml(s.bodyMarkdown),
    }))
  );

  const related = getProblemsBySlugs(problem.relatedSlugs);
  const toc = problem.content.map((s) => ({ id: s.id, title: s.title }));

  return (
    <div className="container py-8">
      <JsonLd
        data={articleJsonLd({
          title: problem.title,
          description: problem.seo.description,
          path: problem.seo.canonicalPath,
        })}
      />
      <JsonLd data={faqJsonLd(problem.faqs)} />
      <JsonLd
        data={howToJsonLd({
          name: `How to solve ${problem.title}`,
          description: problem.seo.description,
          steps: problem.studyChecklist,
        })}
      />

      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Problems", path: "/problems" },
          { name: problem.title, path: `/problems/${problem.slug}` },
        ]}
      />

      <div className="mt-6 grid lg:grid-cols-[1fr_280px] gap-10">
        <article className="min-w-0">
          <header className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground tabular-nums">#{problem.number}</span>
                <DifficultyBadge difficulty={problem.difficulty} />
                {problem.premium && <Badge variant="muted">Premium on LC</Badge>}
                <Badge variant="outline">~{problem.estimatedMinutes} min</Badge>
              </div>
              <Watermark variant="pill" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{problem.title}</h1>
            <p className="text-muted-foreground max-w-2xl">
              Time <strong className="text-foreground">{problem.timeComplexity}</strong>
              {" · "}
              Space <strong className="text-foreground">{problem.spaceComplexity}</strong>
              {" · "}
              <a
                href={problem.leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-2 hover:underline"
              >
                Official statement on LeetCode
              </a>
            </p>
            <div className="flex flex-wrap gap-2">
              {problem.topics.map((t) => (
                <Link key={t} href={`/topics/${t}`}>
                  <Badge variant="default">{t.replace(/-/g, " ")}</Badge>
                </Link>
              ))}
              {problem.patterns.map((p) => (
                <Link key={p} href={`/patterns/${p}`}>
                  <Badge variant="outline">{p.replace(/-/g, " ")}</Badge>
                </Link>
              ))}
              {problem.companies.map((c) => (
                <Link key={c} href={`/companies/${c}`}>
                  <Badge variant="muted">{c}</Badge>
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <BookmarkButton slug={problem.slug} />
              <a
                href="#workspace"
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors inline-flex items-center gap-1"
              >
                ⚡ Code & Judge
              </a>
              {problem.languages.map((lang) => (
                <a key={lang} href="#solutions" className="text-sm text-primary hover:underline">
                  {lang}
                </a>
              ))}
            </div>
          </header>

          <section className="mt-8" id="workspace">
            <ProblemWorkspace
              slug={problem.slug}
              title={problem.title}
              solutions={problem.solutions}
            />
          </section>

          <section className="mt-10" id="solutions">
            <h2 className="text-xl font-bold mb-3">Solutions</h2>
            <CodeTabs solutions={problem.solutions} />
          </section>

          {sectionsHtml.map((section) => (
            <section key={section.id} id={section.id} className="mt-10 scroll-mt-24">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-xl font-bold">{section.title}</h2>
                {section.status === "placeholder" && (
                  <Badge variant="muted">AI expand later</Badge>
                )}
              </div>
              <MarkdownBody html={section.html} />
            </section>
          ))}

          <section id="visualization" className="mt-10 scroll-mt-24">
            <h2 className="text-xl font-bold mb-3">Visualization</h2>
            <ProblemVisualizer slug={problem.slug} fallbackDescription={problem.visualizationDescription} />
          </section>

          <section id="checklist" className="mt-10 scroll-mt-24">
            <h2 className="text-xl font-bold mb-3">Study checklist</h2>
            <ul className="space-y-2">
              {problem.studyChecklist.map((item) => (
                <li key={item} className="flex gap-2 text-sm">
                  <span className="text-primary" aria-hidden>
                    ☐
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section id="revision" className="mt-10 scroll-mt-24">
            <h2 className="text-xl font-bold mb-3">Revision notes</h2>
            <p className="text-sm rounded-xl border border-border bg-card p-4">
              {problem.revisionNotes}
            </p>
          </section>

          <section id="faq" className="mt-10 scroll-mt-24">
            <h2 className="text-xl font-bold mb-3">FAQs</h2>
            <div className="space-y-3">
              {problem.faqs.map((f) => (
                <details
                  key={f.question}
                  className="rounded-xl border border-border bg-card p-4 group"
                >
                  <summary className="font-medium cursor-pointer list-none flex justify-between gap-2">
                    {f.question}
                    <span className="text-muted-foreground group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {related.length > 0 && (
            <section id="related" className="mt-12 scroll-mt-24">
              <h2 className="text-xl font-bold mb-3">Related problems</h2>
              <ProblemList problems={related} />
            </section>
          )}

          <Watermark variant="card" className="mt-12" />

          <nav
            className="mt-12 flex justify-between gap-4 border-t border-border pt-6 text-sm"
            aria-label="Previous and next problem"
          >
            {problem.prevSlug ? (
              <Link href={`/problems/${problem.prevSlug}`} className="text-primary hover:underline">
                ← Previous
              </Link>
            ) : (
              <span />
            )}
            {problem.nextSlug ? (
              <Link href={`/problems/${problem.nextSlug}`} className="text-primary hover:underline">
                Next →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </article>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <ConfidenceTracker slug={problem.slug} />
          <StudyPanel slug={problem.slug} title={problem.title} />
          <nav
            aria-label="Table of contents"
            className="rounded-xl border border-border bg-card p-4 hidden lg:block"
          >
            <p className="text-sm font-semibold mb-2">On this page</p>
            <ul className="space-y-1.5 text-sm">
              <li>
                <a href="#workspace" className="text-muted-foreground hover:text-primary font-medium">
                  ⚡ Code & Judge
                </a>
              </li>
              <li>
                <a href="#solutions" className="text-muted-foreground hover:text-primary">
                  Solutions
                </a>
              </li>
              {toc.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="text-muted-foreground hover:text-primary">
                    {t.title}
                  </a>
                </li>
              ))}
              <li>
                <a href="#faq" className="text-muted-foreground hover:text-primary">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#related" className="text-muted-foreground hover:text-primary">
                  Related
                </a>
              </li>
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  );
}
