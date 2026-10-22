import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  getTopicsIndex,
  getPatternsIndex,
  getCompaniesIndex,
  getRoadmapsIndex,
  getBlogIndex,
  getSystemDesignIndex,
} from "@/lib/data/problems";
import { Watermark } from "@/components/ui/watermark";

export const metadata: Metadata = buildMetadata({
  title: "HTML Sitemap | DSALoop by CampusLoop",
  description: "Human-readable sitemap of major DSALoop sections.",
  keywords: ["sitemap"],
  canonicalPath: "/sitemap-html",
});

export default function HtmlSitemapPage() {
  const topics = getTopicsIndex();
  const patterns = getPatternsIndex();
  const companies = getCompaniesIndex();
  const roadmaps = getRoadmapsIndex();
  const blogs = getBlogIndex();
  const systemDesign = getSystemDesignIndex();

  return (
    <div className="container py-10 max-w-6xl">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Sitemap</h1>
        <Watermark variant="pill" />
      </div>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-sm">
        <section>
          <h2 className="font-bold mb-2">Core Tracks</h2>
          <ul className="space-y-1">
            {[
              "/",
              "/problems",
              "/companies",
              "/system-design",
              "/search",
              "/blind-75",
              "/grind-169",
              "/roadmaps",
              "/patterns",
              "/topics",
              "/about",
            ].map((p) => (
              <li key={p}>
                <Link href={p} className="text-primary hover:underline">
                  {p}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-bold mb-2">Online Compilers &amp; Judge</h2>
          <ul className="space-y-1">
            {[
              { href: "/online-compiler", label: "Multi-Language Compiler Hub" },
              { href: "/online-python-compiler", label: "Online Python 3 Compiler" },
              { href: "/online-cpp-compiler", label: "Online C++ (GCC) Compiler" },
              { href: "/online-c-compiler", label: "Online C Compiler" },
              { href: "/online-java-compiler", label: "Online Java Compiler" },
              { href: "/online-javascript-compiler", label: "Online JavaScript (Node) Compiler" },
              { href: "/online-typescript-compiler", label: "Online TypeScript Compiler" },
              { href: "/online-go-compiler", label: "Online Go Compiler" },
              { href: "/online-rust-compiler", label: "Online Rust Compiler" },
            ].map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="text-primary hover:underline">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-bold mb-2">System Design (28 Chapters)</h2>
          <ul className="space-y-1 max-h-64 overflow-auto">
            {systemDesign.map((sd) => (
              <li key={sd.slug}>
                <Link href={`/system-design/${sd.slug}`} className="text-primary hover:underline">
                  Chapter {sd.chapterNumber}: {sd.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-bold mb-2">Topics</h2>
          <ul className="space-y-1 max-h-64 overflow-auto">
            {topics.map((t) => (
              <li key={t.slug}>
                <Link href={`/topics/${t.slug}`} className="text-primary hover:underline">
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-bold mb-2">Patterns</h2>
          <ul className="space-y-1 max-h-64 overflow-auto">
            {patterns.map((t) => (
              <li key={t.slug}>
                <Link href={`/patterns/${t.slug}`} className="text-primary hover:underline">
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-bold mb-2">Companies & more</h2>
          <ul className="space-y-1">
            {companies.map((c) => (
              <li key={c.slug}>
                <Link href={`/companies/${c.slug}`} className="text-primary hover:underline">
                  {c.name}
                </Link>
              </li>
            ))}
            {roadmaps.map((r) => (
              <li key={r.slug}>
                <Link href={`/roadmaps/${r.slug}`} className="text-primary hover:underline">
                  {r.name}
                </Link>
              </li>
            ))}
            {blogs.map((b) => (
              <li key={b.slug}>
                <Link href={`/blog/${b.slug}`} className="text-primary hover:underline">
                  {b.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
