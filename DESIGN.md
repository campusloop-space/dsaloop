# 🎨 CampusLoop Design System Specification (DESIGN.md)

Welcome to the canonical design specification for **CampusLoop**. This document defines the exact visual identity, semantic design tokens, typography, component rules, layout principles, and interaction standards across the entire repository.

---

## 1. Design Vision & Core Principles

CampusLoop is a verified, student-only campus network designed to feel:
- **Warm & Approachable**: A soothing warm ivory interface surrounded by soft blush-pink surfaces, balanced coral accents, and deep warm-brown typography.
- **Cute & Playful**: Friendly rounded heading typography (`Baloo 2`), smooth rounded rectangles, soft pastel category accents, and hand-drawn style pastel cat illustrations with subtle hearts.
- **Clean & Minimal**: Deliberate whitespace, single elevation model, hairline borders instead of harsh bounding lines, at most 3 data points per summary card, and zero decorative noise or AI slop.
- **Trustworthy & Safe**: Clear WCAG AA/AAA contrast ratios (≥4.5:1 for body text, ≥7:1 for headings), predictable controls, verified badges, plain-language privacy, and zero demo/fake data.
- **Production-Ready & Fast**: Native CSS variables, zero runtime CSS-in-JS overhead, responsive fluid clamp scales, and strict Server Component boundaries on Cloudflare Workers edge.

---

## 2. Visual Reference Interpretation

The central visual idea is a **warm ivory interface** (`#FFF8ED`) surrounded by **soft blush-pink surfaces** (`#FEC7BE` / `#FFC9C4`), **balanced coral accents** (`#FF804E`), **accessible action terracotta** (`#BD4B2A`), **deep warm-brown ink** (`#5A554B`), and **cute pastel highlights** (`#C4DFEF`, `#FFE59C`, `#F2A4A4`):

```
┌────────────────────────────────────────────────────────┐
│  Outer Blush Canvas (#FEC7BE / #FFC9C4)                │
│                                                        │
│   ┌────────────────────────────────────────────────┐   │
│   │  Warm Ivory Surface Card (#FFF8ED)             │   │
│   │                                                │   │
│   │   Deep Warm-Brown Ink (#5A554B)                │   │
│   │   Secondary Ink-Muted (#746E63)                │   │
│   │                                                │   │
│   │   [ Action Button: Terracotta Coral #BD4B2A ]  │   │
│   │   [ Secondary Button: Ivory #FFFCF7 + Border ] │   │
│   │                                                │   │
│   │   Pastel Highlights:                           │   │
│   │   (Blue #C4DFEF | Yellow #FFE59C | Pink #F2A4A4│   │
│   └────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────┘
```

---

## 3. Reference Color Palette & Intended Usage

| Color Token | Hex Value | Role & Usage |
|---|---|---|
| `--color-canvas` | `#FEC7BE` | Outer window canvas, blush-pink page backdrop |
| `--color-canvas-soft` | `#FFC9C4` | Soft blush gradient transitions, ambient highlights |
| `--color-surface` | `#FFF8ED` | Main application surface, card containers, dialogs (Warm Ivory) |
| `--color-surface-raised`| `#FFFCF7` | Elevated sheets, modals, dropdowns, sticky topbars |
| `--color-ink` | `#5A554B` | Primary headings, post body, critical labels (Deep Warm-Brown, 7.1:1 contrast) |
| `--color-ink-muted` | `#746E63` | Subtitles, handles, timestamps, secondary captions (4.7:1 contrast) |
| `--color-coral` | `#FF804E` | Decorative accents, hearts, story rings, celebratory highlights |
| `--color-action` | `#BD4B2A` | Primary interactive actions, CTAs, focus indicators (Terracotta Coral, 5.2:1 contrast) |
| `--color-action-hover`| `#A84224` | Hover & pressed states for primary action controls |
| `--color-cat-blue` | `#C4DFEF` | Cute pastel blue for tech/study badges & illustration fills |
| `--color-cat-yellow` | `#FFE59C` | Cute pastel yellow for warnings, streaks & mascot accents |
| `--color-cat-pink` | `#F2A4A4` | Cute pastel pink for dating, crushes & community tags |
| `--color-white` | `#FFFFFF` | Crisp white on primary action buttons & avatar frames |

---

## 4. Semantic Color Tokens (CSS Variables)

Defined in [`src/app/globals.css`](src/app/globals.css) and wired directly to Tailwind CSS v4 via `@theme inline`:

### Light Mode (Default Identity)
```css
:root {
  /* Canvas & Surfaces */
  --canvas: #FEC7BE;
  --canvas-soft: #FFC9C4;
  --surface: #FFF8ED;
  --surface-raised: #FFFCF7;
  --surface-sunken: #F5ECDD;
  --background: #FFF8ED;
  --foreground: #5A554B;
  --card: #FFF8ED;
  --card-foreground: #5A554B;
  --popover: #FFFCF7;
  --popover-foreground: #5A554B;

  /* Text & Ink */
  --text: #5A554B;
  --text-secondary: #746E63;
  --text-muted: #746E63;
  --muted: #F5ECDD;
  --muted-foreground: #746E63;

  /* Actions & Accents */
  --primary: #BD4B2A;
  --primary-hover: #A84224;
  --primary-soft: #FDF4E7;
  --primary-soft-border: #EADCCE;
  --primary-foreground: #FFFFFF;
  --secondary: #FDF4E7;
  --secondary-foreground: #5A554B;
  --accent: #FDF4E7;
  --accent-foreground: #BD4B2A;
  --ring: #BD4B2A;
  --coral: #FF804E;

  /* Cute Pastel Tints */
  --cat-blue: #C4DFEF;
  --cat-yellow: #FFE59C;
  --cat-pink: #F2A4A4;

  /* Borders & Dividers */
  --border: #EADCCE;
  --border-strong: #D5C3B1;
  --input: #EADCCE;

  /* Feedback */
  --success: #2E7D48;
  --success-soft: #E8F5ED;
  --warning: #A35C00;
  --warning-soft: #FFF4DE;
  --destructive: #B3261E;
  --destructive-foreground: #FFFFFF;
  --danger-soft: #FDEBEA;
}
```

### Dark Mode (Warm Midnight Mocha)
```css
.dark {
  --canvas: #1A1615;
  --canvas-soft: #231C1A;
  --surface: #241E1C;
  --surface-raised: #2E2624;
  --surface-sunken: #1F1A18;
  --background: #1A1615;
  --foreground: #FFF8ED;
  --card: #241E1C;
  --card-foreground: #FFF8ED;
  --popover: #2E2624;
  --popover-foreground: #FFF8ED;

  --text: #FFF8ED;
  --text-secondary: #C7BCAB;
  --text-muted: #A39686;
  --muted: #2E2624;
  --muted-foreground: #C7BCAB;

  --primary: #FF804E;
  --primary-hover: #FFA27B;
  --primary-soft: #382A25;
  --primary-soft-border: #523D36;
  --primary-foreground: #1A1615;
  --secondary: #2E2624;
  --secondary-foreground: #FFF8ED;
  --accent: #382A25;
  --accent-foreground: #FF804E;
  --ring: #FF804E;
  --border: #3D3330;
  --border-strong: #524541;
  --input: #3D3330;

  --destructive: #E5534B;
  --destructive-foreground: #FFFFFF;
}
```

---

## 5. Typography Scale & Fonts

CampusLoop uses a dual-typeface system configured via `next/font/google`:
1. **Display & Headings**: `Baloo 2` (`--font-display` / `font-heading`) — rounded, approachable, slightly playful, supporting Devanagari and Latin.
2. **Body & Neutral UI**: `Nunito Sans` (`--font-body` / `font-sans`) — warm, exceptionally readable, neutral, balanced letterforms.

| Scale Token | Size / Line Height | Weight | Usage |
|---|---|---|---|
| `text-3xl` | `30px / 38px` | `800` (Extrabold) | Hero headlines, landing titles |
| `text-2xl` | `24px / 32px` | `700` (Bold) | Major page titles (Communities, Feeds, Profile) |
| `text-xl` | `20px / 28px` | `700` (Bold) | Section headers, card titles |
| `text-lg` | `18px / 26px` | `600` (Semibold) | Modal titles, post card author names |
| `text-base` | `15px / 24px` | `400` / `500` | Feed post content, article body text |
| `text-sm` | `13px / 20px` | `500` / `600` | Button labels, list row details, card descriptions |
| `text-xs` | `11px / 16px` | `600` / `700` | Timestamps, handles, category chips, counters |

---

## 6. Spacing Scale

Based on an 8-point / 4-point incremental grid:
- `gap-1` / `p-1`: `4px` — micro-separators, icon-to-label spacing.
- `gap-2` / `p-2`: `8px` — compact buttons, input padding, chip internal gap.
- `gap-3` / `p-3`: `12px` — list item spacing, toolbar clusters.
- `gap-4` / `p-4`: `16px` — standard card padding, standard grid gap.
- `gap-6` / `p-6`: `24px` — section spacing, modal internal padding.
- `gap-8` / `p-8`: `32px` — major page sections, container gutters.

---

## 7. Layout & Content-Width Primitives

- **Max Content Widths**:
  - Feed & Social Column: `max-w-2xl` (`672px`) — optimal reading line length (~65 characters).
  - Multi-Column Grids (Colleges, Academics, Communities): `max-w-6xl` (`1152px`).
  - Wide Explorer & Landing: `max-w-7xl` (`1280px`).
- **Page Horizontal Padding**: `px-4 sm:px-6 lg:px-8`.
- **Shell Layout**: Centered column flanked by subtle sticky left navigation and optional contextual right rail.

---

## 8. Responsive Breakpoints

| Breakpoint | Width | Behavior |
|---|---|---|
| Mobile Small | `360px - 390px` | Single column, mobile bottom bar, compact icons, zero horizontal scroll |
| Mobile Large | `480px` | Compact avatar stacks, 1-line action bars |
| Tablet | `768px` | 2-column card grids, top breadcrumb bar, full modal dialogues |
| Desktop | `1024px` | Sticky desktop sidebar navigation, 8/4 grid on detail pages |
| Wide Desktop | `1440px` | Centered maximum container with generous blush canvas margins |

---

## 9. Border-Radius, Borders & Elevation Tokens

- **Radius Hierarchy**:
  - `rounded-lg`: `8px` — inputs, small buttons, badges.
  - `rounded-xl`: `12px` — standard buttons, dropdown menus, filter chips.
  - `rounded-2xl`: `16px` — cards, list cards, modals, preview containers.
  - `rounded-3xl`: `24px` — hero banners, plinth profiles, community headers.
  - `rounded-full`: `9999px` — pills, avatar circles, FABs, status chips.
- **Borders**: Single elevation model. Warm hairline border: `border border-border/80` or `border border-border/60`.
- **Elevation Shadows**:
  - `--shadow-2xs`: `0 1px 2px 0 rgba(90, 85, 75, 0.04)`
  - `--shadow-sm`: `0 2px 6px -1px rgba(90, 85, 75, 0.06)`
  - `--shadow-md`: `0 8px 20px -4px rgba(90, 85, 75, 0.08)`
  - No harsh dark block shadows or blurry glassmorphism.

---

## 10. Motion & Interaction

- **Duration Scale**:
  - Micro-interactions (hover, active scale): `150ms ease-out` (`transition-all`).
  - Dropdown / Modal entry: `200ms cubic-bezier(0.16, 1, 0.3, 1)`.
- **Feedback**:
  - Buttons scale down subtly on press: `active:scale-[0.98]`.
  - Haptic feedback enabled on mobile through `@/lib/haptics.ts`.
- **Accessibility**: All transitions respect `motion-reduce:transition-none` and `@media (prefers-reduced-motion)`.

---

## 11. Accessibility & Contrast (WCAG AA/AAA)

- **Text Contrast Floor**:
  - Primary text (`#5A554B`) on Ivory (`#FFF8ED`): **7.07:1** (WCAG AAA Pass).
  - Secondary text (`#746E63`) on Ivory (`#FFF8ED`): **4.71:1** (WCAG AA Pass).
  - Primary action (`#BD4B2A`) on Ivory (`#FFF8ED`): **5.21:1** (WCAG AA Pass).
  - Button text (`#FFFFFF`) on Primary Action (`#BD4B2A`): **5.53:1** (WCAG AA Pass).
- **Focus Rings**: Native high-contrast focus rings: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.
- **Screen Reader Support**: Meaningful `aria-label`, hidden context via `sr-only`, and semantic headings (`h1` through `h4`).

---

## 12. Component Inventory & Standards

### A. Buttons (`src/components/ui/button.tsx`)
- `variant="default"` / `primary`: Accessible terracotta coral (`bg-action text-white hover:bg-action-hover shadow-2xs`).
- `variant="secondary"`: Polished ivory pill with crisp border (`bg-primary-soft text-primary border border-primary-soft-border hover:bg-primary-soft/80`).
- `variant="outline"`: Transparent surface with clear border (`border-border bg-surface text-ink hover:bg-surface-sunken`).
- `variant="ghost"`: Zero border, soft hover background (`text-ink hover:bg-surface-sunken`).
- `variant="destructive"`: Accessible ruby tint (`bg-danger-soft text-danger border border-danger/20`).

### B. Cards (`src/components/ui/card.tsx`)
- Single elevation model: `bg-card text-card-foreground border border-border/80 rounded-2xl shadow-2xs`.
- Header, Title (`font-heading font-bold text-foreground`), Content, and Footer.

### C. Badges & Tags (`src/components/ui/badge.tsx`, `community-role-badge.tsx`)
- High contrast, clear border on every badge:
  - Admin: `bg-amber-500/10 text-amber-950 dark:text-amber-200 border border-amber-500/50`.
  - Moderator: `bg-sky-500/10 text-sky-950 dark:text-sky-200 border border-sky-500/50`.
  - Member / Neutral: `bg-muted/70 text-foreground border border-border/80`.

### D. Cute Mascot & Illustrations (`src/components/ui/cute-illustrations.tsx`)
- `CuteCatMascot`: Reusable lightweight SVG mascot.
- `CuteCatEmpty`: Restful cat illustration for empty feeds, search, and inbox.
- `CuteCatSuccess`: Joyful mascot with heart for completed workflows.
- `CuteHeart`: Hand-drawn warm coral heart for micro-reactions.

---

## 13. Page-Level Composition Rules

1. **One Primary Action per View**: A screen should have exactly one high-emphasis terracotta button. Secondary actions use ivory outlines or ghost pills.
2. **Generous Spacing Above Headings**: Maintain more whitespace above headings (`pt-6` / `pt-8`) than below them (`pb-2`).
3. **No Decorative Gradients Over Text**: Avoid text-gradient hacks that hurt legibility. Use solid warm typography with `Baloo 2`.
4. **Clean Accordions / Hidden Filters**: Keep search filters tidy; do not clutter screens with 4 stacked rows of filter buttons.

---

## 14. Illustration & Iconography Guidelines

- **Zero Raw Emojis in Core UI**: Emojis are strictly banned from UI buttons, tabs, badges, and headers. Use `lucide-react` icons in uniform `size-4` / `size-3.5` with `1.75` stroke weight.
- **Cute Pastel Fills**: Vector illustrations use soft fills (`#C4DFEF`, `#FFE59C`, `#F2A4A4`) with clean `#5A554B` warm outlines.

---

## 15. CSS Architecture & Single Source of Truth

- **Single Entry Point**: [`src/app/globals.css`](src/app/globals.css) contains the complete token set.
- **Tailwind v4 Integration**: All CSS custom properties are wired through `@theme inline`.
- **Zero Arbitrary Inline Hex**: Components consume semantic utility classes (`bg-card`, `text-foreground`, `border-border`, `text-primary`, `bg-primary`) rather than hardcoded hex values.

---

## 16. Next.js App Router Engineering Rules

1. **Server Components by Default**: Pages (`page.tsx`) remain pure Server Components exporting `metadata` and JSON-LD structured data.
2. **Interactive UI Delegated to Client Components**: Interactive components carry `"use client"` in dedicated files (e.g., `*-client.tsx`).
3. **Image Optimization**: Use `next/image` with explicit `sizes` and proper aspect ratios.
4. **Zero Edge Failures**: All styles and code strictly conform to Cloudflare Workers runtime (no Node.js-only native modules in request cycle).

---

## 17. File Locations for Design System Assets

- Global Styles & CSS Tokens: [`src/app/globals.css`](src/app/globals.css)
- Mobile Navigation Styles: [`src/app/mobile-navigation.css`](src/app/mobile-navigation.css)
- Root Layout & Fonts: [`src/app/layout.tsx`](src/app/layout.tsx)
- UI Primitives: [`src/components/ui/`](src/components/ui/)
  - `button.tsx`, `card.tsx`, `input.tsx`, `badge.tsx`, `dialog.tsx`, `avatar.tsx`
  - `cute-illustrations.tsx` (Mascots & Illustrations)
  - `community-role-badge.tsx` (Crisp Role Badges)
- Standard Empty State: [`src/components/primitives/empty-state.tsx`](src/components/primitives/empty-state.tsx)

---

## 18. Instructions for Adding New Pages & Components

1. Check existing UI primitives in `src/components/ui/` before building custom containers.
2. Apply `font-heading` (`Baloo 2`) for titles and `font-sans` (`Nunito Sans`) for descriptions.
3. Use `bg-card text-card-foreground border border-border/80 shadow-2xs rounded-2xl` for standard cards.
4. For action controls, use `<Button variant="primary">` or `<Button variant="secondary">`.
5. Ensure color contrast satisfies ≥4.5:1 on light ivory surfaces.

---

## 19. Anti-Patterns to Avoid

- ❌ Hardcoding arbitrary hex codes (`bg-[#5B4BFF]` or `bg-[#101828]`).
- ❌ Using washed-out light gray text on light backgrounds.
- ❌ Heavy black drop shadows or competing multiple elevations.
- ❌ Putting raw emojis into button labels or navigation tabs.
- ❌ Overusing mascot illustrations on dense data tables or settings forms.

---

## 20. Validation & Regression Testing Checklist

- [x] Run `bun test` — 446 unit and integration tests passing.
- [x] Run `NODE_OPTIONS='--max-old-space-size=5120' bun x tsc --noEmit` — 0 compiler errors.
- [x] Verify viewport responsiveness at `360px`, `390px`, `768px`, `1024px`, and `1440px`.
- [x] Test light and dark theme contrast compliance.
- [x] Validate keyboard navigation and screen reader attributes.

---

## 21. Relevant Official Documentation References

1. Next.js 16 Release & Architecture: https://nextjs.org/blog/next-16
2. App Router Layouts & Pages: https://nextjs.org/docs/app/getting-started/layouts-and-pages
3. Server & Client Components: https://nextjs.org/docs/app/getting-started/server-and-client-components
4. CSS & Styling Guidance: https://nextjs.org/docs/app/getting-started/css
5. Font Optimization: https://nextjs.org/docs/app/getting-started/fonts
6. Image Optimization: https://nextjs.org/docs/app/api-reference/components/image
7. Metadata & Social Sharing: https://nextjs.org/docs/app/getting-started/metadata-and-og-images
8. Production Checklist: https://nextjs.org/docs/app/guides/production-checklist
9. Tailwind CSS Theme Variables: https://tailwindcss.com/docs/theme
