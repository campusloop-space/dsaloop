import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const OUT_DIR = path.join(ROOT, "out");
const GENERATED_DIR = path.join(ROOT, "data", "generated");

const BASE_URL = "https://dsaloop.campusloop.space";
const SITEMAP_CHUNK_SIZE = 45000;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function main() {
  console.log("Generating sitemaps...");

  const existingPathsFile = path.join(GENERATED_DIR, "sitemap-paths.json");
  let paths: string[] = [];
  if (fs.existsSync(existingPathsFile)) {
    paths = JSON.parse(fs.readFileSync(existingPathsFile, "utf8"));
  }

  // Compiler paths
  const compilerPaths = [
    "/online-compiler",
    "/online-python-compiler",
    "/online-cpp-compiler",
    "/online-java-compiler",
    "/online-javascript-compiler",
    "/online-rust-compiler",
    "/online-go-compiler",
    "/online-c-compiler",
    "/online-typescript-compiler",
  ];

  // Practice paths for problems
  const problemsIndexFile = path.join(GENERATED_DIR, "problems-index.json");
  const practicePaths: string[] = [];
  if (fs.existsSync(problemsIndexFile)) {
    const problems = JSON.parse(fs.readFileSync(problemsIndexFile, "utf8"));
    for (const p of problems) {
      if (p.slug) {
        practicePaths.push(`/problems/${p.slug}/practice`);
      }
    }
  }

  // System design chapters
  const sdIndexFile = path.join(GENERATED_DIR, "system-design-index.json");
  const sdPaths: string[] = [];
  if (fs.existsSync(sdIndexFile)) {
    const chapters = JSON.parse(fs.readFileSync(sdIndexFile, "utf8"));
    for (const c of chapters) {
      if (c.slug) {
        sdPaths.push(`/system-design/${c.slug}`);
      }
    }
  }

  const allPaths = Array.from(
    new Set([
      "/",
      ...compilerPaths,
      ...paths,
      ...practicePaths,
      ...sdPaths,
    ])
  ).filter((p) => !p.startsWith("/api/") && !p.startsWith("/dashboard"));

  console.log(`Total URLs indexed in sitemap: ${allPaths.length}`);

  const chunks: string[][] = [];
  for (let i = 0; i < allPaths.length; i += SITEMAP_CHUNK_SIZE) {
    chunks.push(allPaths.slice(i, i + SITEMAP_CHUNK_SIZE));
  }

  const targets = [PUBLIC_DIR];
  if (fs.existsSync(OUT_DIR)) {
    targets.push(OUT_DIR);
  }

  for (const target of targets) {
    const sitemapsDir = path.join(target, "sitemaps");
    ensureDir(sitemapsDir);

    chunks.forEach((chunk, idx) => {
      const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...chunk.map((p) => `  <url><loc>${escapeXml(BASE_URL + p)}</loc><changefreq>weekly</changefreq><priority>${p === "/" ? "1.0" : p.includes("/practice") ? "0.9" : "0.8"}</priority></url>`),
        '</urlset>',
      ].join("\n");
      fs.writeFileSync(path.join(sitemapsDir, `sitemap-${idx + 1}.xml`), xml);
    });

    const indexXml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...chunks.map((_, idx) => `  <sitemap><loc>${BASE_URL}/sitemaps/sitemap-${idx + 1}.xml</loc></sitemap>`),
      '</sitemapindex>',
    ].join("\n");

    fs.writeFileSync(path.join(target, "sitemap.xml"), indexXml);
    console.log(`✓ Wrote sitemap.xml and ${chunks.length} chunks to ${target}`);
  }
}

main();
