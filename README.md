# AlgoForge

**Master coding interviews with patterns, roadmaps, and original explanations.**

AlgoForge is a production-oriented LeetCode learning platform:

- Static-first **Next.js App Router** + TypeScript + Tailwind
- Data pipeline over [kamyu104/LeetCode-Solutions](https://github.com/kamyu104/LeetCode-Solutions) (MIT) — **not a mirror**
- SEO: sitemaps, JSON-LD, programmatic landings, Blind 75 / Grind 169
- Local progress (bookmarks, confidence, streaks) with a pluggable `UserStore` for future cloud sync

## Quick start

```bash
npm install
npm run pipeline   # fetch upstream + generate data/generated
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run fetch` | Shallow clone/update solution repo |
| `npm run generate` | Build JSON graph, search index, sitemaps |
| `npm run pipeline` | fetch + generate |
| `npm run build` | Next.js production build (runs generate via prebuild) |
| `npm run dev` | Local development |

## Key URLs

- `/online-compiler` — multi-language online compiler directory (Python, C++, Java, JS, TS, Go, Rust, C)
- `/online-python-compiler`, `/online-cpp-compiler`, `/online-c-compiler`, `/online-java-compiler`
- `/problems/[slug]` — interactive CodeMirror 6 workspace, test cases, and online judge
- `/topics/*`, `/patterns/*`, `/companies/*`
- `/system-design/*` — 28-chapter system design primer
- `/blind-75`, `/grind-169`, `/neetcode-alternatives`
- `/roadmaps/*`, `/blog/*`, `/explore/*`
- `/search`, `/practice`, `/dashboard`

## Documentation

- [Online Compiler & Judge Engine](./docs/COMPILER_AND_JUDGE.md)
- [Architecture](./docs/architecture.md)
- [Data pipeline](./docs/data-pipeline.md)
- [SEO](./docs/seo.md)
- [Deployment](./docs/deployment.md)

## Attribution

Reference solution code is MIT-licensed from kamyu104/LeetCode-Solutions. Explanations and product UX are original AlgoForge content. See `/about/attribution`.

## License

Application code: MIT (or as designated by maintainers). Upstream solutions retain their MIT copyright.
