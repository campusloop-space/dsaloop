import fs from "fs";
import path from "path";

interface ProblemIndexEntry {
  slug: string;
  number: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

interface CsvRow {
  difficulty: "Easy" | "Medium" | "Hard";
  title: string;
  frequency: number;
  acceptanceRate: string;
  link: string;
  topics: string[];
  slug: string;
}

interface CompanyProblemEntry {
  slug: string;
  number?: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  frequency: number;
  acceptanceRate: string;
  topics: string[];
}

interface CompanyData {
  type: "company";
  slug: string;
  name: string;
  description: string;
  problemCount: number;
  problemSlugs: string[];
  difficultyBreakdown: {
    easy: number;
    medium: number;
    hard: number;
  };
  timeframes: {
    thirtyDays: CompanyProblemEntry[];
    threeMonths: CompanyProblemEntry[];
    sixMonths: CompanyProblemEntry[];
    allTime: CompanyProblemEntry[];
  };
  seo: {
    title: string;
    description: string;
    canonicalPath: string;
    keywords: string[];
  };
}

const KNOWN_NAMES: Record<string, string> = {
  google: "Google",
  meta: "Meta",
  amazon: "Amazon",
  apple: "Apple",
  microsoft: "Microsoft",
  netflix: "Netflix",
  uber: "Uber",
  linkedin: "LinkedIn",
  bloomberg: "Bloomberg",
  adobe: "Adobe",
  tcs: "TCS",
  infosys: "Infosys",
  wipro: "Wipro",
  cognizant: "Cognizant",
  tiktok: "TikTok",
  bytedance: "ByteDance",
  oracle: "Oracle",
  salesforce: "Salesforce",
  "goldman-sachs": "Goldman Sachs",
  "jpmorgan-chase": "JPMorgan Chase",
  "jpmorgan": "JPMorgan Chase",
  "morgan-stanley": "Morgan Stanley",
  "de-shaw": "D. E. Shaw",
  citadel: "Citadel",
  "jane-street": "Jane Street",
  "two-sigma": "Two Sigma",
  walmart: "Walmart",
  "walmart-labs": "Walmart Labs",
  nvidia: "Nvidia",
  amd: "AMD",
  intel: "Intel",
  cisco: "Cisco",
  ibm: "IBM",
  visa: "Visa",
  mastercard: "Mastercard",
  paypal: "PayPal",
  stripe: "Stripe",
  square: "Block (Square)",
  flipkart: "Flipkart",
  phonepe: "PhonePe",
  razorpay: "Razorpay",
  swiggy: "Swiggy",
  zomato: "Zomato",
  paytm: "Paytm",
  zoho: "Zoho",
  atlassian: "Atlassian",
  spotify: "Spotify",
  pinterest: "Pinterest",
  snap: "Snapchat",
  snapchat: "Snapchat",
  roblox: "Roblox",
  coinbase: "Coinbase",
  doordash: "DoorDash",
  airbnb: "Airbnb",
  twitter: "X (Twitter)",
  x: "X (Twitter)",
  databricks: "Databricks",
  snowflake: "Snowflake",
  palantir: "Palantir",
  accenture: "Accenture",
  capgemini: "Capgemini",
  hcl: "HCLTech",
  "hcl-technologies": "HCLTech",
  intuit: "Intuit",
  servicenow: "ServiceNow",
  vmware: "VMware",
};

const KNOWN_DESCRIPTIONS: Record<string, string> = {
  google: "Graph, systems thinking, dynamic programming, and clean complexity analysis are heavily tested in Google technical interviews.",
  meta: "Product-focused coding rounds with arrays, graphs, trees, and system design hybrids.",
  amazon: "Leadership principles paired with OA-style arrays, trees, heaps, and greedy algorithms.",
  apple: "Solid computer science fundamentals across trees, recursion, memory efficiency, and low-level clarity.",
  microsoft: "Classic data structures and algorithms with binary trees, DP, strings, and linked lists.",
  netflix: "High bar on system design, concurrency, streaming architectures, and clean algorithmic problem-solving.",
  uber: "Graph algorithms, geospatial and interval math, BFS/DFS, and practical coding speed under pressure.",
  linkedin: "Graphs, two pointers, sliding window, and scalable production-minded solutions.",
  bloomberg: "High-performance systems flavor with arrays, strings, hash maps, queues, and object-oriented design.",
  adobe: "Classic interview sets spanning dynamic programming, binary trees, bit manipulation, and math.",
  tcs: "Common campus placement and NQT coding questions focusing on arrays, strings, and fundamental math.",
  infosys: "InfyTQ and HackWithInfy problems spanning arrays, dynamic programming, recursion, and string manipulation.",
  "goldman-sachs": "Math, dynamic programming, arrays, and high-frequency quantitative coding problems.",
  nvidia: "Low-level algorithms, bit manipulation, memory management, and parallel computing logic.",
  flipkart: "System design, recursion, DP, and greedy problem sets for SDE-1 and SDE-2 campus hiring.",
  phonepe: "Data structures, modular OOP design, low-level design (LLD), and clean problem-solving.",
  razorpay: "Fintech engineering rounds focusing on concurrency, transaction flows, and algorithmic correctness.",
  citadel: "Extremely rigorous algorithmic and quantitative coding rounds covering advanced graphs, DP, and math.",
};

function parseCsv(content: string, problemsMap: Map<string, ProblemIndexEntry>): CsvRow[] {
  const lines = content.split("\n");
  const rows: CsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Regex to match CSV with possible quotes:
    // Difficulty, Title, Frequency, Acceptance Rate, Link, Topics
    const linkMatch = line.match(/https:\/\/leetcode\.com\/problems\/([^/,\s]+)/);
    if (!linkMatch) continue;

    const rawSlug = linkMatch[1];
    // Clean up slug if there are query params or trailing fragments
    const slug = rawSlug.split("?")[0].split("#")[0].toLowerCase().trim();

    if (!problemsMap.has(slug)) continue;

    const prob = problemsMap.get(slug)!;

    // Extract frequency
    const freqMatch = line.match(/,\s*([\d.]+)\s*,\s*[\d.]+\s*,\s*https/);
    const frequency = freqMatch ? parseFloat(freqMatch[1]) : 50.0;

    let diff: "Easy" | "Medium" | "Hard" = prob.difficulty;
    if (line.startsWith("EASY")) diff = "Easy";
    else if (line.startsWith("MEDIUM")) diff = "Medium";
    else if (line.startsWith("HARD")) diff = "Hard";

    rows.push({
      difficulty: diff,
      title: prob.title,
      frequency: isNaN(frequency) ? 50.0 : frequency,
      acceptanceRate: "50%",
      link: `https://leetcode.com/problems/${slug}`,
      topics: [],
      slug,
    });
  }

  // Deduplicate and sort by frequency descending
  const seen = new Set<string>();
  const uniqueRows: CsvRow[] = [];
  for (const r of rows) {
    if (!seen.has(r.slug)) {
      seen.add(r.slug);
      uniqueRows.push(r);
    }
  }

  return uniqueRows.sort((a, b) => b.frequency - a.frequency);
}

function capitalizeWords(str: string): string {
  return str
    .split(/[\s-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

async function run() {
  const problemsIndex: ProblemIndexEntry[] = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), "data/generated/problems-index.json"), "utf-8")
  );
  const problemsMap = new Map<string, ProblemIndexEntry>();
  problemsIndex.forEach((p) => problemsMap.set(p.slug, p));

  const baseDir = path.resolve(process.cwd(), "scratch/leetcode-company-wise-problems");
  if (!fs.existsSync(baseDir)) {
    console.error("Base directory scratch/leetcode-company-wise-problems not found!");
    process.exit(1);
  }

  const outCompaniesDir = path.resolve(process.cwd(), "data/generated/companies");
  fs.mkdirSync(outCompaniesDir, { recursive: true });

  const dirs = fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("."));

  console.log(`Processing ${dirs.length} company directories...`);

  const processedCompanies: CompanyData[] = [];
  const companyTagsMap: Record<string, string[]> = {};

  for (const d of dirs) {
    const rawDirName = d.name.trim();
    const slug = rawDirName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const allCsvPath = path.join(baseDir, d.name, "5. All.csv");
    if (!fs.existsSync(allCsvPath)) continue;

    const allTimeRows = parseCsv(fs.readFileSync(allCsvPath, "utf-8"), problemsMap);
    if (allTimeRows.length < 8 && !KNOWN_NAMES[slug]) continue; // Skip companies with fewer than 8 questions unless explicitly known

    const thirtyDaysPath = path.join(baseDir, d.name, "1. Thirty Days.csv");
    const thirtyDaysRows = fs.existsSync(thirtyDaysPath)
      ? parseCsv(fs.readFileSync(thirtyDaysPath, "utf-8"), problemsMap)
      : [];

    const threeMonthsPath = path.join(baseDir, d.name, "2. Three Months.csv");
    const threeMonthsRows = fs.existsSync(threeMonthsPath)
      ? parseCsv(fs.readFileSync(threeMonthsPath, "utf-8"), problemsMap)
      : [];

    const sixMonthsPath = path.join(baseDir, d.name, "3. Six Months.csv");
    const sixMonthsRows = fs.existsSync(sixMonthsPath)
      ? parseCsv(fs.readFileSync(sixMonthsPath, "utf-8"), problemsMap)
      : [];

    const displayName = KNOWN_NAMES[slug] ?? capitalizeWords(rawDirName);
    const description =
      KNOWN_DESCRIPTIONS[slug] ??
      `Top coding interview questions, assessments, and DSA frequency asked in ${displayName} hiring and placement rounds.`;

    const allUniqueSlugs = Array.from(new Set(allTimeRows.map((r) => r.slug)));

    let easyCount = 0;
    let mediumCount = 0;
    let hardCount = 0;

    for (const r of allTimeRows) {
      if (r.difficulty === "Easy") easyCount++;
      else if (r.difficulty === "Medium") mediumCount++;
      else if (r.difficulty === "Hard") hardCount++;

      // Populate company tags for problems
      if (!companyTagsMap[r.slug]) companyTagsMap[r.slug] = [];
      if (!companyTagsMap[r.slug].includes(slug)) {
        companyTagsMap[r.slug].push(slug);
      }
    }

    const companyData: CompanyData = {
      type: "company",
      slug,
      name: displayName,
      description,
      problemCount: allUniqueSlugs.length,
      problemSlugs: allUniqueSlugs,
      difficultyBreakdown: {
        easy: easyCount,
        medium: mediumCount,
        hard: hardCount,
      },
      timeframes: {
        thirtyDays: thirtyDaysRows.map((r) => ({
          slug: r.slug,
          number: problemsMap.get(r.slug)?.number,
          title: r.title,
          difficulty: r.difficulty,
          frequency: r.frequency,
          acceptanceRate: r.acceptanceRate,
          topics: r.topics,
        })),
        threeMonths: threeMonthsRows.map((r) => ({
          slug: r.slug,
          number: problemsMap.get(r.slug)?.number,
          title: r.title,
          difficulty: r.difficulty,
          frequency: r.frequency,
          acceptanceRate: r.acceptanceRate,
          topics: r.topics,
        })),
        sixMonths: sixMonthsRows.map((r) => ({
          slug: r.slug,
          number: problemsMap.get(r.slug)?.number,
          title: r.title,
          difficulty: r.difficulty,
          frequency: r.frequency,
          acceptanceRate: r.acceptanceRate,
          topics: r.topics,
        })),
        allTime: allTimeRows.map((r) => ({
          slug: r.slug,
          number: problemsMap.get(r.slug)?.number,
          title: r.title,
          difficulty: r.difficulty,
          frequency: r.frequency,
          acceptanceRate: r.acceptanceRate,
          topics: r.topics,
        })),
      },
      seo: {
        title: `${displayName} Interview Questions — DSALoop by CampusLoop`,
        description: `Master top ${displayName} coding interview questions, problem frequency, and solutions. DSALoop by https://campusloop.space/`,
        canonicalPath: `/companies/${slug}`,
        keywords: [
          `${displayName.toLowerCase()} interview questions`,
          `${displayName.toLowerCase()} leetcode`,
          `${displayName.toLowerCase()} coding questions`,
          `${displayName.toLowerCase()} online assessment`,
          "campus placement dsa",
          "dsaloop",
          "campusloop",
        ],
      },
    };

    fs.writeFileSync(
      path.join(outCompaniesDir, `${slug}.json`),
      JSON.stringify(companyData, null, 2),
      "utf-8"
    );

    processedCompanies.push(companyData);
  }

  // Sort companies by problem count descending
  processedCompanies.sort((a, b) => b.problemCount - a.problemCount);

  // Write companies-index.json
  const companiesIndex = processedCompanies.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
    problemCount: c.problemCount,
    problemSlugs: c.problemSlugs,
    difficultyBreakdown: c.difficultyBreakdown,
    timeframeCounts: {
      thirtyDays: c.timeframes.thirtyDays.length,
      threeMonths: c.timeframes.threeMonths.length,
      sixMonths: c.timeframes.sixMonths.length,
      allTime: c.timeframes.allTime.length,
    },
    seo: c.seo,
  }));

  fs.writeFileSync(
    path.resolve(process.cwd(), "data/generated/companies-index.json"),
    JSON.stringify(companiesIndex, null, 2),
    "utf-8"
  );

  // Update data/curated/companies.json
  const curatedCompanies = processedCompanies.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
  }));
  fs.writeFileSync(
    path.resolve(process.cwd(), "data/curated/companies.json"),
    JSON.stringify(curatedCompanies, null, 2),
    "utf-8"
  );

  console.log(`Successfully ingested ${processedCompanies.length} companies!`);
  console.log(`Top 10:`, processedCompanies.slice(0, 10).map((c) => `${c.name} (${c.problemCount})`));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
