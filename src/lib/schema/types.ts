/** Canonical DSALoop data model — shared by pipeline and Next.js app. */

export type Difficulty = "Easy" | "Medium" | "Hard";
export type ContentStatus = "ready" | "placeholder";

export interface ContentSection {
  id: string;
  title: string;
  bodyMarkdown: string;
  status: ContentStatus;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SeoFields {
  title: string;
  description: string;
  keywords: string[];
  canonicalPath: string;
  ogImage?: string;
}

export interface SolutionFile {
  language: string;
  languageSlug: string;
  filename: string;
  code: string;
  sourcePath: string;
}

export interface Problem {
  id: string;
  number: number;
  slug: string;
  title: string;
  difficulty: Difficulty;
  topics: string[];
  patterns: string[];
  companies: string[];
  languages: string[];
  timeComplexity: string;
  spaceComplexity: string;
  premium: boolean;
  leetcodeUrl: string;
  notes: string[];
  relatedSlugs: string[];
  prevSlug: string | null;
  nextSlug: string | null;
  estimatedMinutes: number;
  content: ContentSection[];
  solutions: Record<string, SolutionFile>;
  seo: SeoFields;
  faqs: FaqItem[];
  studyChecklist: string[];
  revisionNotes: string;
  visualizationDescription: string;
}

export interface EntitySummary {
  slug: string;
  name: string;
  description: string;
  problemCount: number;
  problemSlugs: string[];
  seo: SeoFields;
}

export interface Topic extends EntitySummary {
  type: "topic";
}

export interface Pattern extends EntitySummary {
  type: "pattern";
  relatedTopics: string[];
}

export interface CompanyProblemEntry {
  slug: string;
  number?: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  frequency?: number;
  acceptanceRate?: string;
  topics?: string[];
}

export interface CompanyTimeframes {
  thirtyDays: CompanyProblemEntry[];
  threeMonths: CompanyProblemEntry[];
  sixMonths: CompanyProblemEntry[];
  allTime: CompanyProblemEntry[];
}

export interface Company extends EntitySummary {
  type: "company";
  difficultyBreakdown?: {
    easy: number;
    medium: number;
    hard: number;
  };
  timeframes?: CompanyTimeframes;
  timeframeCounts?: {
    thirtyDays: number;
    threeMonths: number;
    sixMonths: number;
    allTime: number;
  };
}

export interface SystemDesignTocItem {
  id: string;
  title: string;
  level: number;
}

export interface SystemDesignIndexEntry {
  chapterNumber: number;
  slug: string;
  title: string;
  subtitle: string;
  readTimeMinutes: number;
  tags: string[];
  imagesCount: number;
}

export interface SystemDesignChapter extends SystemDesignIndexEntry {
  markdown: string;
  html: string;
  tableOfContents: SystemDesignTocItem[];
  prevChapter?: { slug: string; title: string; chapterNumber: number };
  nextChapter?: { slug: string; title: string; chapterNumber: number };
}

export interface Collection {
  slug: string;
  name: string;
  description: string;
  problemSlugs: string[];
  seo: SeoFields;
  order?: number;
}

export interface RoadmapStep {
  title: string;
  description: string;
  topicSlugs?: string[];
  patternSlugs?: string[];
  problemSlugs?: string[];
}

export interface Roadmap {
  slug: string;
  name: string;
  description: string;
  steps: RoadmapStep[];
  seo: SeoFields;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  bodyMarkdown: string;
  seo: SeoFields;
  readingMinutes: number;
}

export interface LandingPage {
  slug: string;
  path: string;
  h1: string;
  intro: string;
  problemSlugs: string[];
  faqs: FaqItem[];
  relatedLinks: { href: string; label: string }[];
  seo: SeoFields;
  kind: "company-topic" | "difficulty-pattern" | "topic-difficulty" | "custom";
}

export interface SearchDocument {
  id: string;
  type: "problem" | "topic" | "pattern" | "company" | "collection" | "blog" | "roadmap";
  title: string;
  slug: string;
  path: string;
  description: string;
  difficulty?: Difficulty;
  topics?: string[];
  patterns?: string[];
  keywords: string;
  number?: number;
}

export interface SiteManifest {
  generatedAt: string;
  problemCount: number;
  topicCount: number;
  patternCount: number;
  companyCount: number;
  collectionCount: number;
  landingCount: number;
  languages: string[];
  version: string;
}

export interface ProblemIndexEntry {
  number: number;
  slug: string;
  title: string;
  difficulty: Difficulty;
  topics: string[];
  patterns: string[];
  companies: string[];
  languages: string[];
  premium: boolean;
  timeComplexity: string;
  spaceComplexity: string;
  estimatedMinutes: number;
}

export const LANGUAGE_MAP: Record<string, string> = {
  Python: "python",
  Python3: "python3",
  "C++": "cpp",
  Java: "java",
  JavaScript: "javascript",
  TypeScript: "typescript",
  Golang: "go",
  Go: "go",
  Rust: "rust",
  Kotlin: "kotlin",
  Swift: "swift",
  Ruby: "ruby",
  PHP: "php",
  "C#": "csharp",
  MySQL: "mysql",
  Shell: "shell",
};

export const LANGUAGE_EXTENSIONS: Record<string, string> = {
  python: "py",
  python3: "py",
  cpp: "cpp",
  java: "java",
  javascript: "js",
  typescript: "ts",
  go: "go",
  rust: "rs",
  kotlin: "kt",
  swift: "swift",
  ruby: "rb",
  php: "php",
  csharp: "cs",
  mysql: "sql",
  shell: "sh",
};
