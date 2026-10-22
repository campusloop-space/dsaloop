import type {
  Problem,
  ProblemIndexEntry,
  Topic,
  Pattern,
  Company,
  Collection,
  Roadmap,
  BlogPost,
  LandingPage,
  SiteManifest,
  SearchDocument,
  SystemDesignIndexEntry,
  SystemDesignChapter,
} from "@/lib/schema/types";
import {
  listGeneratedSlugs,
  readGeneratedJson,
  readGeneratedJsonOrThrow,
  hasGeneratedData,
} from "./fs";

export { hasGeneratedData };

export const PROBLEMS_PAGE_SIZE = 100;

export function getProblemsIndex(): ProblemIndexEntry[] {
  return readGeneratedJson<ProblemIndexEntry[]>("problems-index.json") ?? [];
}

export function getProblem(slug: string): Problem | null {
  return readGeneratedJson<Problem>(`problems/${slug}.json`);
}

export function getAllProblemSlugs(): string[] {
  return listGeneratedSlugs("problems");
}

export function getTopicsIndex(): Topic[] {
  return readGeneratedJson<Topic[]>("topics-index.json") ?? [];
}

export function getTopic(slug: string): Topic | null {
  return readGeneratedJson<Topic>(`topics/${slug}.json`);
}

export function getPatternsIndex(): Pattern[] {
  return readGeneratedJson<Pattern[]>("patterns-index.json") ?? [];
}

export function getPattern(slug: string): Pattern | null {
  return readGeneratedJson<Pattern>(`patterns/${slug}.json`);
}

export function getCompaniesIndex(): Company[] {
  return readGeneratedJson<Company[]>("companies-index.json") ?? [];
}

export function getCompany(slug: string): Company | null {
  return readGeneratedJson<Company>(`companies/${slug}.json`);
}

export function getCollection(slug: string): Collection | null {
  return readGeneratedJson<Collection>(`collections/${slug}.json`);
}

export function getCollectionsIndex(): Collection[] {
  return readGeneratedJson<Collection[]>("collections-index.json") ?? [];
}

export function getRoadmapsIndex(): Roadmap[] {
  return readGeneratedJson<Roadmap[]>("roadmaps-index.json") ?? [];
}

export function getRoadmap(slug: string): Roadmap | null {
  return readGeneratedJson<Roadmap>(`roadmaps/${slug}.json`);
}

export function getBlogIndex(): BlogPost[] {
  return readGeneratedJson<BlogPost[]>("blog-index.json") ?? [];
}

export function getBlogPost(slug: string): BlogPost | null {
  return readGeneratedJson<BlogPost>(`blog/${slug}.json`);
}

export function getLanding(slug: string): LandingPage | null {
  return readGeneratedJson<LandingPage>(`landings/${slug}.json`);
}

export function getLandingsIndex(): { slug: string; path: string; h1: string }[] {
  return readGeneratedJson("landings-index.json") ?? [];
}

export function getManifest(): SiteManifest | null {
  return readGeneratedJson<SiteManifest>("site-manifest.json");
}

export function getSearchDocuments(): SearchDocument[] {
  return readGeneratedJson<SearchDocument[]>("search-index.json") ?? [];
}

export function getSitemapPaths(): string[] {
  return readGeneratedJson<string[]>("sitemap-paths.json") ?? ["/"];
}

export function getDifficultyProblems(level: "easy" | "medium" | "hard") {
  return (
    readGeneratedJson<{ level: string; problemSlugs: string[]; problemCount: number }>(
      `difficulty-${level}.json`
    ) ?? { level, problemSlugs: [], problemCount: 0 }
  );
}

export function getLanguagesIndex(): {
  slug: string;
  problemCount: number;
  problemSlugs: string[];
}[] {
  return readGeneratedJson("languages-index.json") ?? [];
}

export function getProblemsBySlugs(slugs: string[]): ProblemIndexEntry[] {
  const index = getProblemsIndex();
  const map = new Map(index.map((p) => [p.slug, p]));
  return slugs.map((s) => map.get(s)).filter(Boolean) as ProblemIndexEntry[];
}

export function requireManifest(): SiteManifest {
  return readGeneratedJsonOrThrow("site-manifest.json");
}

export function getSystemDesignIndex(): SystemDesignIndexEntry[] {
  return readGeneratedJson<SystemDesignIndexEntry[]>("system-design-index.json") ?? [];
}

export function getSystemDesignChapter(slug: string): SystemDesignChapter | null {
  return readGeneratedJson<SystemDesignChapter>(`system-design/${slug}.json`);
}

export function getAllSystemDesignSlugs(): string[] {
  return listGeneratedSlugs("system-design");
}
