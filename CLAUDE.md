# CLAUDE.md

Guidance for Claude Code when working in `webapp/` — the light-mode-first rebuild of Codetail's frontend, built page by page.

## What this is

A fresh Next.js 16 + TypeScript + Tailwind v4 app, separate from `frontend/`. Design direction: premium, world-class UI/UX borrowing heavily from Attio, Linear, Raycast, ElevenLabs, and ClickUp. Light mode is the primary (currently only) theme — no dark mode toggle yet.

## Brand tokens

Colors live in `app/globals.css` as Tailwind v4 `@theme` tokens, prefixed `brand-*` (e.g. `bg-brand-primary`, `text-brand-text-muted`, `border-brand-border`). Never use raw hex values in components — always reference a `brand-*` token. If a needed color doesn't exist yet, add it to `globals.css` first.

## UI/UX Principles — living list, append as we build

- **Buttons: Attio-inspired rounding, not full pill.** Use moderate radius (`rounded-lg`), never `rounded-full`. This applies to all buttons/CTAs across the app.
- Every clickable/hoverable element gets `cursor-pointer`.
- All CSS transitions use `transition-all duration-500`.
- Interactive motion uses Framer Motion spring physics, not `ease-in-out`: hover/tap `stiffness: 400, damping: 25`, entrance `stiffness: 300, damping: 30`. Buttons: `whileHover={{ scale: 1.03 }}`, `whileTap={{ scale: 0.97 }}`.
- Topbar pattern: full-width sticky, transparent over the hero, solidifies to `bg-brand-bg/80 backdrop-blur-md border-b border-brand-border` after ~8px of scroll. See `components/layout/topbar.tsx`.
- No visible scrollbars — hidden globally via `scrollbar-width: none` + `::-webkit-scrollbar { display: none; }` in `globals.css`. Content stays scrollable, just no scrollbar chrome.
- No em dashes in copy (headlines, body text, labels, toasts). Use a period or comma instead; use `·` for inline meta separators. A "—" as a placeholder glyph for an empty value (e.g. a null table cell) is fine, that's not prose.
- **Form inputs: always use `components/ui/input.tsx`, never hand-roll input classNames.** `bg-brand-surface` at rest (transparent border), `bg-white` + `border-brand-primary/60` on focus. No focus rings, border-color change only, `outline-none` to suppress the native browser outline. Buttons/links follow the same border-or-color-only rule for focus-visible states, no `ring-*` utilities.

## Chart palette

For data-viz that needs more than a status color (multi-segment bar charts, hierarchy diagrams,
category legends), use `brand-chart-1` through `brand-chart-6` (defined in `globals.css`). These
are a curated 6-hue palette scoped to charts/diagrams only, never for UI chrome, status, or buttons
(that's what `brand-primary` / `brand-success` / `brand-warning` / `brand-destructive` are for).
First used in `content/system-design/*`. Assign colors by index (chart-1, chart-2, ...) in the order
categories appear; don't hand-pick per meaning.

## Blog Article Voice — applies to all content/* article prose

Every article (Python, Concepts, System Design, Production APIs) is written as if by a principal
engineer who has actually shipped the thing they're explaining and genuinely likes teaching it.
Not a tutorial-site voice, not an AI-assistant voice. Calibration reference:
`content/python/variables-and-types/*.tsx`, audited and confirmed clean.

**Do:**
- State rules and opinions directly: "Rule: use `==` to compare values." / "Gotcha: `int(3.9)` is
  `3`, not `4`." / "In practice: annotate your functions and class attributes."
- Open sections by naming the wrong mental model before giving the right one: "Most tutorials
  describe X as _______. That works for a while, then breaks in confusing ways."
- Use one concrete, specific analogy per concept and commit to it (e.g. "a variable is a sticky
  note on an object, not a box"), don't stack multiple competing metaphors.
- Cite the actual gotcha with real behavior, not a vague warning: show the surprising output, then
  explain why.
- Short, declarative sentences. It's fine to start a sentence with "But" or "So."

**Never:**
- Em dashes or en dashes, anywhere in article prose (same rule as UI copy, see below). Use a
  period, comma, or colon.
- AI-assistant tells: "Let's dive in," "It's important to note," "In today's fast-paced world,"
  "Whether you're a beginner or an expert," "Unlock the power of," "Seamless," "Leverage,"
  "Delve into," "In conclusion," "Robust solution," "Game-changer."
- Hedging qualifiers that don't add information: "might potentially," "in some cases," "generally
  speaking" used as filler rather than a real caveat.
- Explaining what the code does before showing it, when showing it first and explaining the
  surprising part after is punchier. Lead with the gotcha, not the setup.

Before shipping any new article, grep it for `—`, `–`, and the banned-phrase list above.

## Notes

- Working page by page — each page gets reviewed and iterated before moving to the next.
- `frontend/AGENTS.md`'s Next.js 16 warning applies here too: read `node_modules/next/dist/docs/` before writing Next.js-specific code, this version has breaking changes vs training data.
