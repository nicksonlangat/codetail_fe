"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { CheckCircle2, ArrowRight, Zap, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useRank } from "@/hooks/use-rank";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

// ── Tier definitions — full metadata ─────────────────────────────────────────
const TIERS = [
  {
    name: "Apprentice",
    level: 1,
    min: 0,
    max: 499,
    tagline: "Every expert was once a beginner. You've taken the first step.",
    whyHere: ["Solved your first problem", "Started a learning path", "Created your profile"],
    nextSteps: [
      { action: "Solve 10 problems",       xp: "+100 XP" },
      { action: "Complete your first unit", xp: "+50 XP"  },
      { action: "Hit a 3-day streak",       xp: "+30 XP"  },
    ],
    // colours
    panelBg:   "from-slate-500/25 via-slate-500/10 to-slate-500/5",
    cardBg:    "from-slate-400/10 via-transparent to-transparent",
    pill:      "bg-slate-400/15 text-slate-500 dark:text-slate-300 border-slate-400/25",
    bar:       "bg-slate-400",
    barTrack:  "bg-slate-400/15",
    dot:       "bg-slate-400",
    check:     "text-slate-400",
    arrow:     "text-slate-400",
    // illustration: replace src with real file once generated
    illustration: null as string | null,
    illustrationAlt: "Apprentice developer",
  },
  {
    name: "Junior Engineer",
    level: 2,
    min: 500,
    max: 1499,
    tagline: "You're building intuition. Keep shipping, keep learning.",
    whyHere: ["Solved 10+ problems", "Completed a full unit", "Active for 7+ days"],
    nextSteps: [
      { action: "Solve 25 total problems",  xp: "+200 XP" },
      { action: "Complete a Django unit",   xp: "+120 XP" },
      { action: "Submit a fix_code problem",xp: "+40 XP"  },
    ],
    panelBg:   "from-blue-500/25 via-blue-500/10 to-blue-500/5",
    cardBg:    "from-blue-400/10 via-transparent to-transparent",
    pill:      "bg-blue-400/15 text-blue-500 dark:text-blue-300 border-blue-400/25",
    bar:       "bg-blue-400",
    barTrack:  "bg-blue-400/15",
    dot:       "bg-blue-400",
    check:     "text-blue-400",
    arrow:     "text-blue-400",
    illustration: null as string | null,
    illustrationAlt: "Junior developer",
  },
  {
    name: "Engineer",
    level: 3,
    min: 1500,
    max: 2999,
    tagline: "You write real code. Patterns are becoming instinct.",
    whyHere: ["Solved 24 problems", "7-day streak achieved", "First unit completed"],
    nextSteps: [
      { action: "Solve 15 more problems",      xp: "+150 XP" },
      { action: "Complete the Django path",    xp: "+300 XP" },
      { action: "Hit a 14-day streak",         xp: "+100 XP" },
    ],
    panelBg:   "from-primary/30 via-primary/12 to-primary/5",
    cardBg:    "from-primary/12 via-transparent to-transparent",
    pill:      "bg-primary/15 text-primary border-primary/25",
    bar:       "bg-primary",
    barTrack:  "bg-primary/15",
    dot:       "bg-primary",
    check:     "text-primary",
    arrow:     "text-primary",
    illustration: null as string | null,
    illustrationAlt: "Engineer at dual monitors",
  },
  {
    name: "Senior Engineer",
    level: 4,
    min: 3000,
    max: 5499,
    tagline: "You see problems before they're problems. That's the edge.",
    whyHere: ["40+ problems solved", "Multiple units completed", "Consistent coding habits"],
    nextSteps: [
      { action: "Complete 2 full paths",       xp: "+500 XP" },
      { action: "Solve 5 hard problems",       xp: "+200 XP" },
      { action: "Submit 3 refactor problems",  xp: "+180 XP" },
    ],
    panelBg:   "from-amber-500/25 via-amber-500/10 to-amber-500/5",
    cardBg:    "from-amber-400/10 via-transparent to-transparent",
    pill:      "bg-amber-400/15 text-amber-600 dark:text-amber-300 border-amber-400/25",
    bar:       "bg-amber-400",
    barTrack:  "bg-amber-400/15",
    dot:       "bg-amber-400",
    check:     "text-amber-400",
    arrow:     "text-amber-400",
    illustration: null as string | null,
    illustrationAlt: "Senior engineer reviewing architecture",
  },
  {
    name: "Staff Engineer",
    level: 5,
    min: 5500,
    max: 8499,
    tagline: "You design systems, not just features. Rare air.",
    whyHere: ["65+ problems solved", "All core units completed", "Advanced problem patterns mastered"],
    nextSteps: [
      { action: "Complete all learning paths",  xp: "+800 XP" },
      { action: "Solve 10 hard problems",       xp: "+400 XP" },
      { action: "Maintain a 30-day streak",     xp: "+300 XP" },
    ],
    panelBg:   "from-purple-500/25 via-purple-500/10 to-purple-500/5",
    cardBg:    "from-purple-400/10 via-transparent to-transparent",
    pill:      "bg-purple-400/15 text-purple-500 dark:text-purple-300 border-purple-400/25",
    bar:       "bg-purple-400",
    barTrack:  "bg-purple-400/15",
    dot:       "bg-purple-400",
    check:     "text-purple-400",
    arrow:     "text-purple-400",
    illustration: null as string | null,
    illustrationAlt: "Staff engineer presenting architecture",
  },
  {
    name: "Principal Engineer",
    level: 6,
    min: 8500,
    max: Infinity,
    tagline: "You've reached the top. You are the standard.",
    whyHere: ["All paths completed", "100+ problems solved", "Mastered every concept"],
    nextSteps: [],
    panelBg:   "from-rose-500/25 via-rose-500/10 to-rose-500/5",
    cardBg:    "from-rose-400/10 via-transparent to-transparent",
    pill:      "bg-rose-400/15 text-rose-500 dark:text-rose-300 border-rose-400/25",
    bar:       "bg-rose-400",
    barTrack:  "bg-rose-400/15",
    dot:       "bg-rose-400",
    check:     "text-rose-400",
    arrow:     "text-rose-400",
    illustration: null as string | null,
    illustrationAlt: "Principal engineer, zen minimalist",
  },
] as const;

type Tier = typeof TIERS[number];


function getTier(xp: number): Tier {
  return (TIERS.find((t) => xp >= t.min && xp <= t.max) ?? TIERS[0]) as Tier;
}
function getNextTier(xp: number): Tier | null {
  const idx = TIERS.findIndex((t) => xp >= t.min && xp <= t.max);
  return idx >= 0 && idx < TIERS.length - 1 ? TIERS[idx + 1] as Tier : null;
}

// ── Per-tier illustration placeholder ────────────────────────────────────────
// Each SVG is a stylised abstract developer character.
// SWAP: replace with <Image src="/illustrations/rank-l{n}.png" ...> once generated.
function TierIllustration({ tier, className }: { tier: Tier; className?: string }) {
  // If a real illustration file exists, use it
  if (tier.illustration) {
    return (
      <Image
        src={tier.illustration}
        alt={tier.illustrationAlt}
        width={220}
        height={260}
        className={`object-contain ${className}`}
      />
    );
  }

  // Abstract geometric placeholder — intentionally styled, not "broken"
  const level = tier.level;
  const colors = {
    1: { head: "hsl(215 16% 60% / 0.5)",  body: "hsl(215 16% 60% / 0.25)", accent: "hsl(215 16% 60% / 0.35)", glow: "hsl(215 16% 60% / 0.1)"  },
    2: { head: "hsl(217 91% 60% / 0.5)",  body: "hsl(217 91% 60% / 0.25)", accent: "hsl(217 91% 60% / 0.35)", glow: "hsl(217 91% 60% / 0.1)"  },
    3: { head: "hsl(164 70% 40% / 0.55)", body: "hsl(164 70% 40% / 0.25)", accent: "hsl(164 70% 40% / 0.4)",  glow: "hsl(164 70% 40% / 0.12)" },
    4: { head: "hsl(38 92% 50% / 0.55)",  body: "hsl(38 92% 50% / 0.25)",  accent: "hsl(38 92% 50% / 0.4)",   glow: "hsl(38 92% 50% / 0.12)"  },
    5: { head: "hsl(270 70% 60% / 0.55)", body: "hsl(270 70% 60% / 0.25)", accent: "hsl(270 70% 60% / 0.4)",  glow: "hsl(270 70% 60% / 0.12)" },
    6: { head: "hsl(346 84% 61% / 0.5)",  body: "hsl(346 84% 61% / 0.22)", accent: "hsl(346 84% 61% / 0.35)", glow: "hsl(346 84% 61% / 0.1)"  },
  }[level] ?? { head: "#888", body: "#555", accent: "#666", glow: "#333" };

  return (
    <svg
      viewBox="0 0 200 240"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={tier.illustrationAlt}
    >
      {/* Ambient glow disc */}
      <circle cx="100" cy="130" r="80" fill={colors.glow} />

      {/* ── Characters differ by level ── */}
      {level === 1 && (
        <>
          {/* Laptop body */}
          <rect x="52" y="138" width="96" height="60" rx="8" fill={colors.body} />
          <rect x="59" y="144" width="82" height="46" rx="5" fill={colors.accent} />
          {/* Code lines */}
          {[0,8,16,24,32].map((y, i) => (
            <rect key={i} x="66" y={152+y} width={[28,42,20,35,15][i]} height="3" rx="1.5" fill={colors.head} opacity={0.7 - i * 0.1} />
          ))}
          {/* Head */}
          <circle cx="100" cy="108" r="20" fill={colors.body} />
          <circle cx="100" cy="108" r="13" fill={colors.head} />
          {/* Stars / learning sparks */}
          {[[30,70],[165,80],[28,170],[170,155]].map(([x, y], i) => (
            <text key={i} x={x} y={y} fontSize="9" fill={colors.accent} fontFamily="monospace" opacity="0.6">★</text>
          ))}
        </>
      )}

      {level === 2 && (
        <>
          {/* Monitor */}
          <rect x="45" y="132" width="110" height="72" rx="8" fill={colors.body} />
          <rect x="52" y="138" width="96" height="54" rx="5" fill={colors.accent} />
          {[0,9,18,27,36].map((y, i) => (
            <rect key={i} x="60" y={148+y} width={[50,32,44,20,36][i]} height="3" rx="1.5" fill={colors.head} opacity={0.65 - i * 0.08} />
          ))}
          {/* Head */}
          <circle cx="100" cy="102" r="22" fill={colors.body} />
          <circle cx="100" cy="102" r="15" fill={colors.head} />
          {/* Coffee cup */}
          <rect x="155" y="158" width="14" height="16" rx="3" fill={colors.accent} />
          <path d="M 169 163 Q 176 163 176 170 Q 176 177 169 177" stroke={colors.head} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Code floaters */}
          {[["⟨/⟩",22,72], ["{}",158,90], ["[]",155,145], ["→",26,148]].map(([t,x,y], i) => (
            <text key={i} x={x as number} y={y as number} fontSize="9" fill={colors.accent} fontFamily="monospace" opacity="0.55">{t}</text>
          ))}
        </>
      )}

      {level === 3 && (
        <>
          {/* Dual monitors */}
          <rect x="22" y="136" width="70" height="52" rx="6" fill={colors.body} />
          <rect x="27" y="141" width="60" height="40" rx="4" fill={colors.accent} />
          <rect x="108" y="136" width="70" height="52" rx="6" fill={colors.body} />
          <rect x="113" y="141" width="60" height="40" rx="4" fill={colors.accent} />
          {/* Code lines left */}
          {[0,8,16,24].map((y,i) => (
            <rect key={i} x="31" y={149+y} width={[32,22,38,15][i]} height="2.5" rx="1.25" fill={colors.head} opacity={0.7 - i*0.1} />
          ))}
          {/* Code lines right */}
          {[0,8,16,24].map((y,i) => (
            <rect key={i} x="117" y={149+y} width={[40,28,18,34][i]} height="2.5" rx="1.25" fill={colors.head} opacity={0.65 - i*0.1} />
          ))}
          {/* Head */}
          <circle cx="100" cy="100" r="24" fill={colors.body} />
          <circle cx="100" cy="100" r="16" fill={colors.head} />
          {/* Headphones */}
          <path d="M 78 95 Q 78 68 100 68 Q 122 68 122 95" stroke={colors.head} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <circle cx="78" cy="97" r="6" fill={colors.head} />
          <circle cx="122" cy="97" r="6" fill={colors.head} />
          {/* Floating code */}
          {[["⟨/⟩",16,68],["fn()",158,72],["git",14,175],["=>",163,170]].map(([t,x,y],i) => (
            <text key={i} x={x as number} y={y as number} fontSize="9" fill={colors.accent} fontFamily="monospace" opacity="0.5">{t}</text>
          ))}
        </>
      )}

      {level === 4 && (
        <>
          {/* Whiteboard / standing figure */}
          <rect x="110" y="80" width="70" height="90" rx="6" fill={colors.body} />
          {/* Diagram on board */}
          <circle cx="135" cy="105" r="8" fill="none" stroke={colors.head} strokeWidth="2" opacity="0.7"/>
          <circle cx="165" cy="105" r="8" fill="none" stroke={colors.head} strokeWidth="2" opacity="0.7"/>
          <line x1="143" y1="105" x2="157" y2="105" stroke={colors.head} strokeWidth="2" opacity="0.5"/>
          <circle cx="150" cy="128" r="8" fill="none" stroke={colors.head} strokeWidth="2" opacity="0.7"/>
          <line x1="135" y1="113" x2="148" y2="120" stroke={colors.head} strokeWidth="1.5" opacity="0.5"/>
          <line x1="165" y1="113" x2="152" y2="120" stroke={colors.head} strokeWidth="1.5" opacity="0.5"/>
          {/* Person */}
          <circle cx="72" cy="96" r="22" fill={colors.body} />
          <circle cx="72" cy="96" r="15" fill={colors.head} />
          <rect x="55" y="123" width="34" height="48" rx="10" fill={colors.body} />
          {/* Arm pointing to board */}
          <path d="M 89 132 Q 108 120 112 115" stroke={colors.body} strokeWidth="10" fill="none" strokeLinecap="round"/>
          <path d="M 89 132 Q 108 120 112 115" stroke={colors.head} strokeWidth="6" fill="none" strokeLinecap="round"/>
          {/* Aura rings */}
          <circle cx="72" cy="140" r="50" fill="none" stroke={colors.accent} strokeWidth="1" strokeDasharray="4 6" opacity="0.3"/>
          <circle cx="72" cy="140" r="65" fill="none" stroke={colors.accent} strokeWidth="1" strokeDasharray="3 8" opacity="0.18"/>
        </>
      )}

      {level === 5 && (
        <>
          {/* Architecture diagram / nodes */}
          {[[100,60],[60,110],[140,110],[40,165],[100,165],[160,165]].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r={i===0?14:10} fill={colors.body} stroke={colors.head} strokeWidth="2" opacity="0.8"/>
          ))}
          {/* Connections */}
          {[[100,74,60,100],[100,74,140,100],[60,120,40,155],[60,120,100,155],[140,120,100,155],[140,120,160,155]].map(([x1,y1,x2,y2],i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors.accent} strokeWidth="2" opacity="0.5"/>
          ))}
          {/* Centre icon */}
          <text x="93" y="65" fontSize="10" fill={colors.head} opacity="0.9">⬡</text>
          {/* Outer glow ring */}
          <circle cx="100" cy="120" r="85" fill="none" stroke={colors.accent} strokeWidth="1.5" strokeDasharray="5 7" opacity="0.2"/>
          <circle cx="100" cy="120" r="70" fill="none" stroke={colors.accent} strokeWidth="1" strokeDasharray="3 9" opacity="0.15"/>
        </>
      )}

      {level === 6 && (
        <>
          {/* Zen floating code fragments */}
          {[
            [80, 55, "12", "⟨/⟩"],
            [130, 70, "10", "{}"],
            [50, 120, "9",  "fn"],
            [155, 115, "9", "()"],
            [70, 175, "8",  "[]"],
            [138, 180, "8", "=>"],
            [100, 210, "9", "∞"],
          ].map(([x,y,size,text], i) => (
            <text key={i} x={x as number} y={y as number} fontSize={size as string} fill={colors.head} fontFamily="monospace" opacity={0.4 + (i % 3) * 0.15} textAnchor="middle">
              {text}
            </text>
          ))}
          {/* Central circle — minimal */}
          <circle cx="100" cy="118" r="38" fill={colors.body} />
          <circle cx="100" cy="118" r="26" fill={colors.head} />
          <circle cx="100" cy="118" r="5" fill={colors.accent} opacity="0.8" />
          {/* Orbit rings */}
          <circle cx="100" cy="118" r="52" fill="none" stroke={colors.accent} strokeWidth="1" strokeDasharray="4 6" opacity="0.3"/>
          <circle cx="100" cy="118" r="68" fill="none" stroke={colors.accent} strokeWidth="1" strokeDasharray="2 8" opacity="0.2"/>
        </>
      )}

      {/* Floating dots — all levels */}
      {[[18,95],[182,88],[22,195],[180,200]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={2.5} fill={colors.accent} opacity={0.3 + i * 0.05} />
      ))}
    </svg>
  );
}

// ── Tier road ─────────────────────────────────────────────────────────────────
function TierRoad({ currentLevel }: { currentLevel: number }) {
  return (
    <div className="flex items-center gap-1">
      {TIERS.map((t, i) => {
        const done    = t.level < currentLevel;
        const active  = t.level === currentLevel;
        const locked  = t.level > currentLevel;
        return (
          <div key={t.level} className="flex items-center gap-1">
            <div className={`relative flex items-center justify-center transition-all duration-300 ${
              active ? "w-5 h-5 rounded-full bg-card border-2 border-primary shadow-sm" : "w-3 h-3 rounded-full"
            } ${done ? "bg-primary/60" : ""} ${locked ? "bg-muted" : ""}`}>
              {active && (
                <span className="text-[8px] font-black text-primary">{t.level}</span>
              )}
              {done && !active && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary/80 block" />
              )}
            </div>
            {i < TIERS.length - 1 && (
              <div className={`h-px w-4 ${i < currentLevel - 1 ? "bg-primary/50" : "bg-muted"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function RankCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-card/50 flex min-h-65">
      <div className="shrink-0 w-50 xl:w-60 bg-muted/40 animate-pulse" />
      <div className="flex-1 flex flex-col gap-4 p-5 xl:p-6">
        <div className="flex items-center justify-between">
          <div className="h-2.5 w-24 rounded bg-muted animate-pulse" />
          <div className="flex gap-2">
            {[60, 52, 56].map((w, i) => (
              <div key={i} className="h-5 rounded-md bg-muted animate-pulse" style={{ width: w }} />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-7 w-44 rounded bg-muted animate-pulse" />
          <div className="h-3 w-72 rounded bg-muted animate-pulse" />
        </div>
        <div className="space-y-1.5">
          <div className="h-2 rounded-full bg-muted animate-pulse" />
          <div className="flex justify-between">
            <div className="h-2.5 w-16 rounded bg-muted animate-pulse" />
            <div className="h-2.5 w-24 rounded bg-muted animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 flex-1">
          {[0, 1].map((col) => (
            <div key={col} className="space-y-2">
              <div className="h-2 w-20 rounded bg-muted animate-pulse" />
              {[0, 1, 2].map((row) => (
                <div key={row} className="h-3 rounded bg-muted animate-pulse" style={{ width: `${70 + row * 10}%` }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function RankCard() {
  const { data, isLoading } = useRank();

  const xp            = data?.xp            ?? 0;
  const xp_today      = data?.xp_today      ?? 0;
  const xp_week       = data?.xp_week       ?? 0;
  const xp_month      = data?.xp_month      ?? 0;

  const tier = getTier(xp);
  const next = getNextTier(xp);

  const pct = next
    ? Math.round(((xp - tier.min) / (next.min - tier.min)) * 100)
    : 100;
  const toNext = next ? next.min - xp : 0;

  const raw      = useMotionValue(0);
  const smoothed = useSpring(raw, { stiffness: 45, damping: 18 });
  const barWidth = useTransform(smoothed, (v) => `${v}%`);

  useEffect(() => {
    if (isLoading) return;
    const t = setTimeout(() => raw.set(pct), 400);
    return () => clearTimeout(t);
  }, [raw, pct, isLoading]);

  if (isLoading) return <RankCardSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="relative overflow-hidden rounded-xl bg-card/50"
    >
      {/* Overall card gradient wash */}
      <div className={`absolute inset-0 bg-linear-to-br ${tier.cardBg} pointer-events-none`} />

      <div className="relative flex min-h-65">

        {/* ── Left: illustration panel ─────────────────────────── */}
        <div className={`relative shrink-0 w-50 xl:w-60 flex items-center justify-center bg-linear-to-br ${tier.panelBg} border-r border-border/50 overflow-hidden`}>
          {/* Decorative radial glow behind illustration */}
          <div className={`absolute inset-0 bg-radial from-white/5 to-transparent dark:from-white/3 pointer-events-none`} />

          {/* ILLUSTRATION — swap TierIllustration with <Image> once you have the files */}
          {/* File naming convention: /public/illustrations/rank-l1.png through rank-l6.png */}
          {/* Recommended ChatGPT prompt (run separately per level): */}
          {/*   "3D cartoon developer character, [level-specific pose], transparent background, */}
          {/*    flat-3D isometric style, modern SaaS illustration aesthetic, [tier color] palette, */}
          {/*    PNG 400×480px. Level {n} = [Apprentice: beginner at laptop | Junior: coffee+code | */}
          {/*    Engineer: dual monitors+headphones | Senior: pointing at whiteboard | */}
          {/*    Staff: standing with architecture diagram | Principal: zen floating code]" */}
          <TierIllustration
            tier={tier}
            className="w-40 xl:w-47.5 h-auto drop-shadow-sm"
          />

          {/* Level badge — bottom left corner */}
          <div className={`absolute bottom-4 left-4 text-[10px] font-black px-2.5 py-1 rounded-full border ${tier.pill} backdrop-blur-sm`}>
            L{tier.level}
          </div>
        </div>

        {/* ── Right: content panel ─────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-4 p-5 xl:p-6 min-w-0">

          {/* Row 1: label + XP stats */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
              Codetail Rank
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/60">
                <Zap className="w-2.5 h-2.5 text-primary shrink-0" />
                <span className="text-[10px] font-semibold tabular-nums">+{xp_today}</span>
                <span className="text-[9px] text-muted-foreground/50">today</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/60">
                <TrendingUp className="w-2.5 h-2.5 text-primary shrink-0" />
                <span className="text-[10px] font-semibold tabular-nums">+{xp_week}</span>
                <span className="text-[9px] text-muted-foreground/50">week</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/60">
                <span className="text-[10px] font-semibold tabular-nums">+{xp_month}</span>
                <span className="text-[9px] text-muted-foreground/50">month</span>
              </div>
            </div>
          </div>

          {/* Row 2: tier name + tagline */}
          <div>
            <h2 className="text-[26px] font-black tracking-tight leading-none text-foreground">
              {tier.name}
            </h2>
            <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed max-w-sm">
              {tier.tagline}
            </p>
          </div>

          {/* Row 3: XP progress bar */}
          <div className="space-y-1.5">
            <div className={`h-2 rounded-full overflow-hidden ${tier.barTrack}`}>
              <motion.div className={`h-full rounded-full ${tier.bar}`} style={{ width: barWidth }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono tabular-nums text-muted-foreground">
                {xp.toLocaleString()} XP
              </span>
              {next ? (
                <span className="text-[10px] text-muted-foreground/50">
                  <span className="font-semibold text-foreground tabular-nums">{toNext.toLocaleString()}</span> XP to {next.name}
                </span>
              ) : (
                <span className="text-[10px] text-primary font-semibold">Max rank ✓</span>
              )}
            </div>
          </div>

          {/* Row 4: Why here + Next steps — 2 col */}
          <div className="grid grid-cols-2 gap-4 flex-1">

            {/* Why you're here */}
            <div className="space-y-2">
              <p className="text-[9px] uppercase tracking-widest font-semibold text-muted-foreground/40">
                Why you&apos;re here
              </p>
              <ul className="space-y-1.5">
                {tier.whyHere.map((reason) => (
                  <li key={reason} className="flex items-start gap-1.5">
                    <CheckCircle2 className={`w-3 h-3 shrink-0 mt-0.5 ${tier.check}`} />
                    <span className="text-[11px] text-foreground/80 leading-snug">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Next level */}
            {next && tier.nextSteps.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[9px] uppercase tracking-widest font-semibold text-muted-foreground/40">
                  To reach {next.name}
                </p>
                <ul className="space-y-1.5">
                  {tier.nextSteps.map((step) => (
                    <li key={step.action} className="flex items-start gap-1.5">
                      <ArrowRight className={`w-3 h-3 shrink-0 mt-0.5 ${tier.arrow}`} />
                      <span className="text-[11px] text-foreground/80 leading-snug flex-1">
                        {step.action}
                      </span>
                      <span className={`text-[9px] font-mono font-semibold shrink-0 ${tier.check} opacity-70`}>
                        {step.xp}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <p className="text-[11px] text-muted-foreground/40 text-center leading-relaxed italic">
                  You've reached the pinnacle.
                </p>
              </div>
            )}
          </div>

          {/* Row 5: tier road */}
          <div className="flex items-center justify-between border-t border-border/40 pt-3">
            <TierRoad currentLevel={tier.level} />
            <span className="text-[9px] text-muted-foreground/40 font-mono tabular-nums">
              {xp.toLocaleString()} / {next ? next.min.toLocaleString() : "∞"} XP
            </span>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
