# CareerOs Playground — Design System Study

## What is this?

The `/playground` directory is a **living design system** — a self-contained showcase of every UI primitive, interaction pattern, and animation used across CareerOs. It follows the design philosophy of tools like **Linear**, **Attio**, and **Raycast**: dense, functional, quietly opulent interfaces where every pixel earns its place.

The style is best described as **"Engineered Minimalism"** — sometimes called **"Tool Aesthetic"**, **"Linear-style UI"**, or **"Developer-grade Product Design"**. It sits at the intersection of Scandinavian minimalism and Japanese precision: restrained color, obsessive spacing, physics-based motion, and zero decoration that doesn't serve function.

---

## 1. Architectural Decisions

### Self-Contained Component Playground

Each page under `/playground/*` is a **fully self-contained prototype** — mock data, local state, micro-components, and animations all live in a single file. No global state, no context providers, no external dependencies beyond Framer Motion and Lucide icons.

This is deliberate: every component can be evaluated in isolation, iterated on without side effects, and dropped into the production app when ready.

### Zero External UI Libraries

No shadcn/ui, no Radix, no Material UI, no Chakra. Every component is **hand-built with Tailwind CSS + Framer Motion**. This gives complete control over the visual language — no fighting library defaults, no overriding opinionated styles. The cost is higher implementation effort; the payoff is pixel-perfect brand consistency.

### Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 16 + React 19 | App router, server components, latest React |
| Styling | Tailwind CSS v4 | `@theme inline` support, zero-config tokens |
| Animation | Framer Motion 12 | Spring physics, layout animations, presence |
| Icons | Lucide React | Consistent 24px grid, tree-shakeable |
| Fonts | Geist Sans / Geist Mono | Vercel's typeface — designed for UI density |

---

## 2. The Nova Color System

The palette is called **"Nova"** — defined as CSS custom properties in `globals.css` and bridged into Tailwind via `@theme inline`.

### What makes it special

**Blue-violet gray undertone.** The grays aren't neutral — they carry a subtle blue-violet hue (`#121129`, `#3C3F59`, `#676D89`). This is the same technique Linear and Figma use. It makes the UI feel warmer and more intentional than pure gray, without being distracting.

**11 semantic color ramps** (gray, blue, purple, cyan, green, red, pink, orange, yellow, lime) — each with 11 stops from 50 to 950. Every color has been chosen to work at low opacity for tinted backgrounds (`#175CFF14` = 8% blue) and at full saturation for text and icons.

### Status color mapping

```
To apply    → #046DF6 (blue)      — action needed
Applied     → #7C3AED (purple)    — in progress
Interviewing→ #FBBC04 (yellow)    — active, pulsing dot
Offer       → #00ac47 (green)     — positive outcome
Rejected    → #EA4335 (red)       — closed
```

Status badges use a three-layer formula: **tinted background** (`color + 14` hex = ~8% opacity) + **tinted border** (`color + 30` = ~19% opacity) + **full-color text and dot**. This creates depth without heaviness.

### Surface hierarchy

```
Page background   → #F6F6F9  (brand-gray-50)
Card surface      → #FFFFFF
Elevated surface  → #EDEEF3  (brand-gray-100)
Border            → #E5E6ED  (brand-gray-200)
Hover fill        → #F6F6F9
```

Three levels of surface, no more. Clean depth without shadows or gradients.

---

## 3. Typography

**Geist Sans** — Vercel's typeface, designed for high-density UI. Monospace numbers via `tabular-nums` for aligned columns.

### The scale is deliberately tight

```
10px  — Labels, captions, secondary metadata
11px  — Form labels, small buttons, dates
12px  — Body text, list items, descriptions
13px  — Card titles, secondary headings
14px  — Primary body text (text-sm)
20px  — Section headings (text-xl)
32px  — Hero numbers (score displays)
```

Most text lives at 10-13px. This is the hallmark of the "tool aesthetic" — dense information display that respects the user's expertise. No 18px body text, no 48px hero headings. Every label earns its space.

**Uppercase tracking** (`text-[9px] uppercase tracking-wider`) for form labels and section markers creates visual hierarchy without size inflation.

---

## 4. Animation Philosophy — Spring Physics Everywhere

This is where the playground truly separates itself. Every animation uses **spring physics** instead of easing curves. Springs feel alive — they overshoot slightly, they settle naturally, they respond to interruption.

### The spring vocabulary

| Context | Stiffness | Damping | Feel |
|---------|-----------|---------|------|
| Hover lift/scale | 300-500 | 20-30 | Snappy, responsive |
| Score ring fill | 40-60 | 15-20 | Slow, satisfying reveal |
| Modal entrance | 400 | 25 | Quick with gentle settle |
| Layout shift | 300 | 25-30 | Smooth repositioning |
| Number counter | 60 | 20 | Gradual count-up |
| Error shake | tween | — | `x: [0, -8, 8, -6, 6, -3, 3, 0]` |

### Key animation patterns

**1. Animated Score Rings**
Custom SVG circles with `strokeDashoffset` animated via spring. The number inside counts up using `useSpring` → `useTransform` → `Math.round()`. The ring and number animate independently but feel synchronized.

```tsx
const springScore = useSpring(0, { stiffness: 60, damping: 20 });
const display = useTransform(springScore, (v) => Math.round(v));
```

**2. Layout ID Transitions**
Active navigation indicators and tone selectors use Framer Motion's `layoutId` — the highlight *slides* between items rather than appearing/disappearing. This is the exact pattern Linear uses for tab navigation.

```tsx
{isActive && (
  <motion.div layoutId="nav-active" className="absolute inset-0 rounded-lg"
    style={{ background: '#175CFF14' }}
    transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
)}
```

**3. AnimatePresence for Enter/Exit**
Every conditional element — modals, dropdowns, toasts, expanded sections — is wrapped in `AnimatePresence` for orchestrated mount/unmount animations. Elements don't just appear; they arrive.

**4. Staggered Progress Bars**
Multiple score bars animate in sequence with increasing delay (`delay: 0.3 + i * 0.1`), creating a cascade effect that draws the eye down.

**5. Hover Micro-interactions**
Every interactive element has a hover response:
- Cards: `whileHover={{ y: -2 }}` — subtle lift
- Buttons: `whileHover={{ scale: 1.03 }}` + `whileTap={{ scale: 0.97 }}` — press feedback
- Icons: `animate={{ scale: hovered ? 1.2 : 1, rotate: hovered ? 5 : 0 }}` — playful tilt
- Rows: `whileHover={{ backgroundColor: '#F6F6F9' }}` — fill change

**6. Contextual Reveal**
`SectionCheck` rows show detail text only on hover, animating in from the left. `KeywordChip` reveals its category on hover with an expanding width animation. Information density increases as the user focuses.

---

## 5. Micro-Interaction Catalog

### Buttons
- Scale up on hover (`1.03`), scale down on tap (`0.97`)
- Spring transition on all transforms
- `cursor-pointer` on everything clickable (project-wide rule)
- `transition-all duration-500` as the CSS baseline

### Modals
- Backdrop: `bg-[#0a083B]/60 backdrop-blur-sm` — dark overlay with blur
- Panel: scale `0.95 → 1`, opacity `0 → 1`, y `20 → 0`
- Escape key dismissal + click-outside
- Body scroll lock while open

### Toasts
- Enter from bottom-right with spring (`y: 20 → 0, scale: 0.9 → 1`)
- Exit to the right (`x: 80, scale: 0.9`)
- Auto-dismiss after 3 seconds
- Stacked with `space-y-2`

### OTP Input
- 6-digit boxes with individual focus states
- Paste support (splits string across inputs)
- Backspace navigates to previous input
- **Error shake**: `x: [0, -8, 8, -6, 6, -3, 3, 0]` with tween — a keyframe sequence that feels physical
- `whileFocus={{ scale: 1.05, borderColor: '#175CFF' }}`

### File Upload
- Drag state changes border to blue + background to gray
- Upload icon lifts with spring (`y: -4`)
- Spinner with scale entrance
- Uploaded state: file icon bounces in with `scale: 0, rotate: -20 → scale: 1, rotate: 0`

### Expandable Rows
- Chevron rotates `0° → 90°` with spring
- Content animates `height: 0 → auto` + opacity
- "Current vs Improved" comparison cards side by side
- Applied state: green left border accent + checkmark with scale spring

### Status Badge (Dropdown)
- Pulsing dot for "Interviewing" status: `scale: [1, 1.3, 1]` on infinite repeat
- Dropdown enters with `y: 4 → 0, scale: 0.95 → 1`
- Each option has hover fill + color dot + checkmark for selected

---

## 6. Component Composition Patterns

### Inline Micro-Components

Rather than extracting every small piece into `/components`, the playground defines micro-components (`AnimNum`, `Ring`, `Spark`, `ScoreBar`) at the top of each page file. These are **page-scoped utilities** — shared within a page but not across pages.

This is pragmatic: it avoids premature abstraction while keeping the code readable.

### Reusable Primitives

Components that *are* shared live in `/components`:
- `Modal.tsx` — AnimatePresence + backdrop blur + escape key + scroll lock
- `Button.tsx` — variant system (primary/secondary/ghost) + loading state
- `StepIndicator.tsx` — animated progress bar for multi-step flows

### Data Pattern

All playground pages use **inline mock data objects** at the top of the file. This keeps prototypes self-contained and makes it obvious what shape the real API data needs to take.

---

## 7. What Specific Patterns Are "World Class"

### 1. Physics-based motion language
Not a single `ease-in-out` in the codebase. Every animation uses springs with tuned stiffness/damping. This creates a **coherent motion identity** — the app feels like a physical object, not a slideshow.

### 2. Progressive disclosure on hover
Information density increases as the user focuses. Hover a section check row → detail appears. Hover a keyword chip → category reveals. Hover a table row → action chevron slides in. The UI is calm at rest and informative on engagement.

### 3. Three-layer status badges
`tinted bg + tinted border + full-color text` — this formula is used by Linear, Attio, and Notion. It creates semantic color without the visual weight of solid backgrounds.

### 4. The ring + animated number combo
Custom SVG ring progress with spring-based stroke animation *plus* a count-up number in the center. Both animate independently with springs, creating a rich but not overwhelming effect.

### 5. Layout ID for navigation
The active indicator physically moves between nav items rather than appearing/disappearing. This is a small detail that makes the entire navigation feel connected and fluid.

### 6. Consistent interaction grammar
Every button scales the same way. Every dropdown enters the same way. Every hover lift is the same `y: -2`. The user never has to learn a new interaction pattern — the grammar is consistent across every component.

### 7. Tight typography at small sizes
10-13px text with careful weight hierarchy (400/500/600/700) and semantic color (primary `#121129`, secondary `#676D89`, tertiary `#BABDCF`). This is the typography of tools built for power users, not marketing pages.

---

## 8. Design Lineage

This design sits squarely in the **"Modern SaaS Tool"** lineage:

| Influence | What was borrowed |
|-----------|-------------------|
| **Linear** | Spring animations, layout ID navigation, dense typography, tinted status badges |
| **Attio** | Blue-violet grays, card-based layouts, hover reveals, semantic color system |
| **Raycast** | Compact component density, spring physics, keyboard-first patterns |
| **Figma** | Blue accent color, subtle surface hierarchy, icon animation on hover |
| **Vercel** | Geist typeface, clean black/white/blue palette, minimal decoration |
| **Notion** | Expandable rows, inline editing patterns, calm empty states |

The style doesn't have one official name, but the community calls it variations of:
- **"Linear-style UI"**
- **"Tool Aesthetic"**
- **"Engineered Minimalism"**
- **"Dense SaaS Design"**
- **"Product-grade UI"**

It is characterized by: extreme density, spring physics, semantic color, no decoration, hover-reveal information architecture, and a sense that every detail was considered.

---

## 9. File Map

```
/playground
├── page.tsx              22+ micro-components (ScoreCard, KeywordChip, StatusBadge, etc.)
├── analyses/page.tsx     Job analysis list with search, filters, ghost cards
├── analysis/page.tsx     Deep analysis detail — scores, keywords, suggestions, format checks
├── colors/page.tsx       Nova palette reference grid
├── editor/page.tsx       Resume section editor with collapsible panels
├── login/page.tsx        Auth flow with OAuth + form validation
├── mood/page.tsx         Theme/palette explorer
├── onboarding/page.tsx   5-step wizard (account → OTP → upload → purpose → done)
├── profile/page.tsx      Dashboard with score history, sparklines, analysis grid
├── reset-password/       Password reset with OTP verification
└── resume/page.tsx       Resume dashboard with ring scores, suggestions, section status
```

---

*This playground is not a component library demo. It is a design language expressed in code — a single source of truth for how CareerOs looks, moves, and feels.*
