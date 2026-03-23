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

## Production

```bash
make prod-build   # Build + start prod container on :3001
make health-prod  # Verify prod health
make prod-logs    # Tail prod logs
```

Deploy: push to `main` via merged PR → GitHub Actions SSH deploy to `/home/codetail/frontend`.
