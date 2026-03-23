@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git Rules — STRICTLY ENFORCED

- **NEVER push directly to `main`.** Always create a feature branch and open a PR.
- **NEVER use `Co-Authored-By: Claude` or any AI attribution** in commit messages or PR descriptions.
- **PRs must be well-described:** clear title, summary of changes, test plan.
- Branch naming: `feat/`, `fix/`, `refactor/`, `chore/` prefixes (e.g., `feat/dashboard-api`).
- One logical change per PR. Don't bundle unrelated changes.

## Running the Application

```bash
npm run dev       # Dev server on :3000
npm run build     # Production build
```

## Architecture

Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui.

**Directory structure:**

- `src/app/` — Next.js App Router pages. `(app)/` = authenticated routes with TopBar, `(auth)/` = auth pages.
- `src/components/` — UI components. `ui/` = shadcn primitives, `layout/` = TopBar, `dashboard/` = dashboard cards, `challenge/` = challenge IDE, `playground/` = design explorations.
- `src/features/` — Feature modules with hooks, services, types.
- `src/data/` — Mock data (paths, challenges). Will be replaced by API calls.
- `src/providers/` — ThemeProvider, QueryProvider, AppProviders.
- `src/stores/` — Zustand stores (auth).
- `src/lib/` — Axios client, utils, constants, icons.
- `src/types/` — Shared TypeScript types.

**Key conventions:**

- Max 300 lines per file.
- Every clickable/hoverable element: `cursor-pointer`.
- All CSS transitions: `transition-all duration-500`.
- Use `"use client"` only where needed (hooks, interactivity).
- Use `next/link` and `next/navigation` — never `react-router-dom`.
- Brand color: teal (`hsl(164 70% 40%)`) via `bg-primary`, `text-primary`.
- Dark/light mode via `next-themes` with `class` strategy.

**State management:**

- Server state: TanStack Query + Axios
- Client state: Zustand
- Form state: React Hook Form + Zod

## UI/UX Philosophy

Codetail must feel like **world-class, premium software** — the kind of tool developers *want* to open. Every interaction should be satisfying. Every click should feel intentional. Every transition should be smooth. The goal is delight — software you enjoy being inside of.

Think: Linear, Raycast, Arc Browser. Dense, functional, quietly opulent. Every pixel earns its place.

**The feel we're after:**
- Satisfying clicks — spring physics make buttons feel physical
- Smooth animations — elements arrive, they don't just appear
- Helpful feedback — every action has a visible response
- Subtle transitions — state changes feel connected, not jarring
- Calm at rest, informative on engagement — hover reveals detail
- Zero jank — no layout shifts, no flash of unstyled content, no loading flicker

## UI/UX Rules — STRICTLY ENFORCED

### Interaction Design
- Every clickable/hoverable element MUST have `cursor-pointer`.
- All CSS transitions MUST use `transition-all duration-500`.
- All animations use **spring physics** via Framer Motion — never `ease-in-out`.
- Spring defaults: hover/tap `stiffness: 400, damping: 25`, entrance `stiffness: 300, damping: 30`.
- Buttons: `whileHover={{ scale: 1.03 }}`, `whileTap={{ scale: 0.97 }}`.
- Cards on hover: `whileHover={{ y: -2 }}` — subtle lift.
- Use `AnimatePresence` for all conditional elements (modals, dropdowns, toasts).
- Use `layoutId` for sliding indicators (tabs, navigation highlights).

### Visual Language
- Engineered minimalism — no decoration that doesn't serve function.
- Three surface levels max: `bg-background` > `bg-card` > `bg-muted`.
- Status badges: three-layer formula — tinted background (8% opacity) + tinted border (19% opacity) + full-color text and dot.
- Difficulty colors: Easy = green (`text-difficulty-easy`), Medium = orange (`text-difficulty-medium`), Hard = red (`text-difficulty-hard`).
- No solid colored backgrounds for badges — always use tinted/muted variants.

### Typography
- Tight scale: 10px–13px for most UI text. Reserve 14px+ for primary body and headings.
- Labels: `text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50`.
- Monospace for: code, numbers, keyboard shortcuts, timestamps (`font-mono tabular-nums`).
- Max two font weights visible in any card/section. Don't over-bold.

### Color
- Brand primary: teal `hsl(164 70% 40%)` — use for CTAs, active states, progress indicators.
- Never use raw hex colors — always use design tokens (`text-primary`, `bg-primary/10`, etc.).
- Semantic colors: `success` for positive, `warning` for caution, `destructive` for errors, `info` for neutral highlights.
- Dark mode must work — use CSS variables, not hardcoded colors.

### Components
- Max 300 lines per file. Split into sub-components if exceeding.
- Self-contained: mock data at top of file, local state, no unnecessary global dependencies.
- Progressive disclosure: show more info on hover/expand, not all at once.
- Empty states must be designed — never show a blank page. Use icons + messaging + CTA.
- Loading states use skeleton shimmer, not spinners (except inline actions).

### Spacing & Layout
- Use Tailwind spacing scale consistently — don't mix arbitrary values.
- Cards: `rounded-xl`, `surface-elevated` or `bg-card border border-border`.
- Section spacing: `space-y-6` between major sections, `space-y-2` within sections.
- Page max width: `max-w-5xl mx-auto px-6`.

## Production

```bash
make prod-build   # Build + start prod container on :3001
make health-prod  # Verify prod health
make prod-logs    # Tail prod logs
```

Deploy: push to `main` via merged PR → GitHub Actions SSH deploy to `/home/codetail/frontend`.
