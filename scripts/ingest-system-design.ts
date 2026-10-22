import fs from "fs";
import path from "path";
import { markdownToHtml } from "../src/lib/markdown";

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface ChapterMeta {
  chapterNumber: number;
  slug: string;
  title: string;
  subtitle: string;
  readTimeMinutes: number;
  tags: string[];
  imagesCount: number;
}

interface ChapterDetail extends ChapterMeta {
  markdown: string;
  html: string;
  tableOfContents: TocItem[];
  prevChapter?: { slug: string; title: string; chapterNumber: number };
  nextChapter?: { slug: string; title: string; chapterNumber: number };
}

const CHAPTER_TAGS: Record<number, string[]> = {
  1: ["Scalability", "Architecture", "Database", "Caching"],
  2: ["Estimation", "Math", "Capacity Planning"],
  3: ["Interview Framework", "Strategy", "Communication"],
  4: ["Rate Limiter", "Concurrency", "Security", "Token Bucket"],
  5: ["Consistent Hashing", "Distributed Systems", "Hashing"],
  6: ["Key-Value Store", "Storage", "CAP Theorem", "Quorum"],
  7: ["Unique ID", "Snowflake", "Distributed Systems"],
  8: ["URL Shortener", "Base62", "Database", "Hashing"],
  9: ["Web Crawler", "Networking", "Distributed Systems", "Graph"],
  10: ["Notifications", "APNs", "FCM", "Message Queue"],
  11: ["News Feed", "Fan-out", "Caching", "Social Graph"],
  12: ["Chat System", "WebSocket", "Real-time", "Presence"],
  13: ["Search Autocomplete", "Trie", "Caching", "Typeahead"],
  14: ["YouTube", "Video Streaming", "CDN", "Transcoding"],
  15: ["Google Drive", "File Storage", "Block Level Sync", "Cloud"],
  16: ["Proximity Service", "Geohash", "QuadTree", "LBS"],
  17: ["Nearby Friends", "WebSocket", "Redis PubSub", "Location"],
  18: ["Google Maps", "Pathfinding", "Navigation", "Tiling"],
  19: ["Message Queue", "Kafka", "Pub/Sub", "Replication"],
  20: ["Monitoring", "Time Series", "Alerting", "Observability"],
  21: ["Event Aggregation", "MapReduce", "Streaming", "Analytics"],
  22: ["Hotel Reservation", "Concurrency", "Transactions", "Booking"],
  23: ["Email Service", "SMTP", "IMAP", "Distributed Storage"],
  24: ["S3 Object Storage", "Blob Storage", "Erasure Coding", "Replication"],
  25: ["Leaderboard", "Redis Sorted Sets", "Real-time Gaming"],
  26: ["Payment System", "Idempotency", "Reconciliation", "FinTech"],
  27: ["Digital Wallet", "Double-Entry Ledger", "Transactions", "FinTech"],
  28: ["Stock Exchange", "Matching Engine", "Low Latency", "Finance"],
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function run() {
  const sourceDir = path.resolve(process.cwd(), "scratch/system-design-notes");
  if (!fs.existsSync(sourceDir)) {
    console.error("Source directory scratch/system-design-notes not found!");
    process.exit(1);
  }

  const outDataDir = path.resolve(process.cwd(), "data/generated/system-design");
  fs.mkdirSync(outDataDir, { recursive: true });

  const publicAssetsDir = path.resolve(process.cwd(), "public/system-design-assets");
  fs.mkdirSync(publicAssetsDir, { recursive: true });

  const dirs = fs
    .readdirSync(sourceDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("."))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

  console.log(`Found ${dirs.length} system design chapters.`);

  const chapterList: ChapterDetail[] = [];

  for (let i = 0; i < dirs.length; i++) {
    const d = dirs[i];
    const chapterNum = i + 1;
    const chapterDir = path.join(sourceDir, d.name);

    const readmeName = fs.existsSync(path.join(chapterDir, "Readme.md")) ? "Readme.md" : "README.md";
    const rawContent = fs.readFileSync(path.join(chapterDir, readmeName), "utf-8");

    // Title parsing
    const titleMatch = rawContent.match(/^#\s+(?:Chapter\s+\d+:\s*)?(.*)$/m);
    const title = titleMatch ? titleMatch[1].trim() : d.name.replace(/^\d+\.\s*/, "");

    const slug = slugify(d.name.replace(/^\d+\.\s*/, ""));

    // Copy images
    const imagesSrc = path.join(chapterDir, "images");
    let imagesCount = 0;
    const targetImagesDir = path.join(publicAssetsDir, slug, "images");

    if (fs.existsSync(imagesSrc)) {
      fs.mkdirSync(targetImagesDir, { recursive: true });
      const imageFiles = fs.readdirSync(imagesSrc).filter((f) => !f.startsWith("."));
      imagesCount = imageFiles.length;
      for (const img of imageFiles) {
        fs.copyFileSync(path.join(imagesSrc, img), path.join(targetImagesDir, img));
      }
    }

    // Process markdown to normalize image paths and clean up raw HTML tags
    let processed = rawContent;

    // Remove first H1 if present since the page template renders the H1
    processed = processed.replace(/^#\s+.*$/m, "").trim();

    // Remove wrapping divs around images
    processed = processed.replace(/<\/?div[^>]*>/gi, "\n\n");

    // Convert raw img tags:
    // <img src="./images/foo.png" alt="bar" ...>
    processed = processed.replace(
      /<img[^>]*src=["'](?:\.\/)?images\/([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi,
      `\n\n![$2](/system-design-assets/${slug}/images/$1)\n\n`
    );
    processed = processed.replace(
      /<img[^>]*alt=["']([^"']*)["'][^>]*src=["'](?:\.\/)?images\/([^"']+)["'][^>]*>/gi,
      `\n\n![$1](/system-design-assets/${slug}/images/$2)\n\n`
    );
    processed = processed.replace(
      /<img[^>]*src=["'](?:\.\/)?images\/([^"']+)["'][^>]*>/gi,
      `\n\n![](/system-design-assets/${slug}/images/$1)\n\n`
    );

    // Markdown image syntax: ![alt](./images/foo.png) or ![alt](images/foo.png)
    processed = processed.replace(
      /!\[(.*?)\]\((\.\/)?images\/(.*?)\)/g,
      `![$1](/system-design-assets/${slug}/images/$3)`
    );

    // Table of contents extraction
    const tableOfContents: TocItem[] = [];
    const lines = processed.split("\n");
    for (const line of lines) {
      const headingMatch = line.match(/^(#{2,3})\s+(.*)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const headingTitle = headingMatch[2].replace(/[*_`]/g, "").trim();
        const id = slugify(headingTitle);
        tableOfContents.push({ id, title: headingTitle, level });
      }
    }

    // Add watermark note to the end of the markdown content
    processed += `\n\n---\n\n> 🎓 **DSALoop by [CampusLoop](https://campusloop.space/)** — Master high-level and low-level system design with clean, pattern-oriented walkthroughs.`;

    // Word count & read time
    const wordCount = processed.split(/\s+/).length;
    const readTimeMinutes = Math.max(2, Math.round(wordCount / 180));

    // Subtitle / Intro summary
    const introMatch = processed.match(/##\s+Introduction\s+([\s\S]*?)(?=##|$)/i);
    let subtitle = `Comprehensive interview guide for ${title}. Architecture, trade-offs, and key deep dives.`;
    if (introMatch && introMatch[1].trim()) {
      const firstPara = introMatch[1].trim().split("\n\n")[0].replace(/\n/g, " ");
      if (firstPara.length > 20 && firstPara.length < 280) {
        subtitle = firstPara;
      }
    }

    // Generate HTML
    const html = await markdownToHtml(processed);

    chapterList.push({
      chapterNumber: chapterNum,
      slug,
      title,
      subtitle,
      readTimeMinutes,
      tags: CHAPTER_TAGS[chapterNum] ?? ["System Design", "Architecture"],
      imagesCount,
      markdown: processed,
      html,
      tableOfContents,
    });
  }

  // Wire prev & next links
  for (let i = 0; i < chapterList.length; i++) {
    const ch = chapterList[i];
    if (i > 0) {
      ch.prevChapter = {
        slug: chapterList[i - 1].slug,
        title: chapterList[i - 1].title,
        chapterNumber: chapterList[i - 1].chapterNumber,
      };
    }
    if (i < chapterList.length - 1) {
      ch.nextChapter = {
        slug: chapterList[i + 1].slug,
        title: chapterList[i + 1].title,
        chapterNumber: chapterList[i + 1].chapterNumber,
      };
    }

    // Write individual chapter file
    fs.writeFileSync(path.join(outDataDir, `${ch.slug}.json`), JSON.stringify(ch, null, 2), "utf-8");
  }

  // Write index file
  const indexEntries: ChapterMeta[] = chapterList.map((ch) => ({
    chapterNumber: ch.chapterNumber,
    slug: ch.slug,
    title: ch.title,
    subtitle: ch.subtitle,
    readTimeMinutes: ch.readTimeMinutes,
    tags: ch.tags,
    imagesCount: ch.imagesCount,
  }));

  fs.writeFileSync(
    path.resolve(process.cwd(), "data/generated/system-design-index.json"),
    JSON.stringify(indexEntries, null, 2),
    "utf-8"
  );

  fs.writeFileSync(
    path.resolve(process.cwd(), "public/system-design-index.json"),
    JSON.stringify(indexEntries, null, 2),
    "utf-8"
  );

  console.log(`Successfully ingested ${chapterList.length} system design chapters!`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
