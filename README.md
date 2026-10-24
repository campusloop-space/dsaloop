<p align="center">
  <img src="https://raw.githubusercontent.com/campusloop-space/.github/main/profile/assets/banner.svg" alt="CampusLoop — All of college. One loop." width="100%" />
</p>

# 🧩 DSALoop — Master DSA & Coding Interviews

**Patterns, roadmaps, and original explanations — plus an online judge, multi-language compilers and a 28-chapter system-design primer.**

<p>
  <a href="https://dsaloop.campusloop.space"><img src="https://img.shields.io/badge/Live-dsaloop.campusloop.space-7C3AED?style=for-the-badge" alt="Live site" /></a>
  <a href="https://campusloop.space"><img src="https://img.shields.io/badge/Part%20of-CampusLoop-9D6CFF?style=for-the-badge" alt="Part of CampusLoop" /></a>
  <img src="https://img.shields.io/badge/Next.js-App%20Router-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js App Router" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</p>

DSALoop (built on the AlgoForge platform) is a production-oriented LeetCode learning platform by **[CampusLoop](https://campusloop.space)**:

- Static-first **Next.js App Router** + TypeScript + Tailwind
- Data pipeline over [kamyu104/LeetCode-Solutions](https://github.com/kamyu104/LeetCode-Solutions) (MIT) — **not a mirror**
- SEO: sitemaps, JSON-LD, programmatic landings, Blind 75 / Grind 169
- Local progress (bookmarks, confidence, streaks) with a pluggable `UserStore` for future cloud sync — solve here, and it can count toward your CampusLoop loop

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

Reference solution code is MIT-licensed from kamyu104/LeetCode-Solutions. Explanations and product UX are original DSALoop/AlgoForge content. See `/about/attribution`.

## License

Application code: MIT (or as designated by maintainers). Upstream solutions retain their MIT copyright.

---

<p align="center">
  <sub>🧩 <strong>DSALoop</strong> is a <a href="https://campusloop.space">CampusLoop</a> product — see also <a href="https://opportunities.campusloop.space">Opportunities</a> for internships, hackathons, scholarships &amp; fellowships.</sub>
</p>
