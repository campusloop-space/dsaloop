import fs from "fs";
import path from "path";

interface SearchDoc {
  id: string;
  type: string;
  title: string;
  slug: string;
  path: string;
  description: string;
  keywords: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  topics?: string[];
  patterns?: string[];
  number?: number;
}

function run() {
  const generatedSearchPath = path.resolve(process.cwd(), "data/generated/search-index.json");
  const publicSearchPath = path.resolve(process.cwd(), "public/search-index.json");

  let searchDocs: SearchDoc[] = [];
  if (fs.existsSync(generatedSearchPath)) {
    searchDocs = JSON.parse(fs.readFileSync(generatedSearchPath, "utf-8"));
  }

  // Remove existing system-design or company docs to avoid duplication
  searchDocs = searchDocs.filter((d) => d.type !== "system-design" && d.type !== "company");

  // Ingest system design chapters
  const sysDesignIndexFile = path.resolve(process.cwd(), "data/generated/system-design-index.json");
  if (fs.existsSync(sysDesignIndexFile)) {
    const chapters = JSON.parse(fs.readFileSync(sysDesignIndexFile, "utf-8"));
    for (const ch of chapters) {
      searchDocs.push({
        id: `system-design:${ch.slug}`,
        type: "system design",
        title: `Chapter ${ch.chapterNumber}: ${ch.title}`,
        slug: ch.slug,
        path: `/system-design/${ch.slug}`,
        description: ch.subtitle,
        keywords: [ch.title, ...ch.tags, "system design", "architecture", "distributed systems"].join(" "),
      });
    }
  }

  // Ingest companies
  const companiesIndexFile = path.resolve(process.cwd(), "data/generated/companies-index.json");
  if (fs.existsSync(companiesIndexFile)) {
    const companies = JSON.parse(fs.readFileSync(companiesIndexFile, "utf-8"));
    for (const c of companies) {
      searchDocs.push({
        id: `company:${c.slug}`,
        type: "company track",
        title: `${c.name} Coding Interview Questions`,
        slug: c.slug,
        path: `/companies/${c.slug}`,
        description: c.description,
        keywords: [c.name, c.slug, "interview", "leetcode", "placement", "coding"].join(" "),
      });
    }
  }

  const jsonStr = JSON.stringify(searchDocs, null, 2);
  fs.writeFileSync(generatedSearchPath, jsonStr, "utf-8");
  fs.writeFileSync(publicSearchPath, jsonStr, "utf-8");

  console.log(`Updated search index with ${searchDocs.length} documents!`);
}

run();
