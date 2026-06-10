"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, ChevronRight, ChevronDown, WandSparkles, BookOpen,
  Star, Lock, CheckCircle2, Code2, Wrench, Trash2,
  HelpCircle, RefreshCcw, Loader2, Play, Zap,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPath, getPathProblems, getPathUnits, getProblem } from "@/lib/api/paths";
import { deleteGeneratedProblem, generatePractice } from "@/lib/api/submissions";
import { UpgradeModal } from "@/components/paywall/upgrade-modal";
import { TipTapRenderer } from "@/components/editors/tiptap-renderer";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

const shimmer =
  "bg-muted relative overflow-hidden before:absolute before:inset-0 before:translate-x-[-100%] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:animate-[shimmer_1.5s_infinite]";

const difficultyDot: Record<string, string> = {
  easy: "bg-difficulty-easy",
  medium: "bg-difficulty-medium",
  hard: "bg-difficulty-hard",
};

const typeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  write_code: {
    label: "Code",
    icon: <Code2 className="w-3 h-3" />,
    color: "text-blue-500 dark:text-blue-400",
  },
  fix_code: {
    label: "Fix",
    icon: <Wrench className="w-3 h-3" />,
    color: "text-orange-500 dark:text-orange-400",
  },
  mcq: {
    label: "MCQ",
    icon: <HelpCircle className="w-3 h-3" />,
    color: "text-purple-500 dark:text-purple-400",
  },
  refactor: {
    label: "Refactor",
    icon: <RefreshCcw className="w-3 h-3" />,
    color: "text-emerald-500 dark:text-emerald-400",
  },
};

function StatusBadge({ status }: { status: string | null }) {
  if (status === "solved")
    return <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-green-500/10 text-green-600 border border-green-500/20 shrink-0">Solved</span>;
  if (status === "attempted")
    return <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 shrink-0">In progress</span>;
  return null;
}

function TypeBadge({ type }: { type: string }) {
  const tc = typeConfig[type];
  if (!tc) return null;
  return (
    <span className={`hidden sm:flex items-center gap-1 text-[10px] font-medium ${tc.color}`}>
      {tc.icon} {tc.label}
    </span>
  );
}

function ChallengeRow({
  problem,
  index,
  pathSlug,
  expanded,
  onToggle,
  onDelete,
}: {
  problem: { id: string; title: string; type: string; difficulty: string; concept: string; time_estimate: string; user_status: string | null; best_score: number | null };
  index: number;
  pathSlug: string;
  expanded: boolean;
  onToggle: () => void;
  onDelete?: (id: string) => void;
}) {
  const [description, setDescription] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  function prefetch() {
    if (description === null && !fetching) {
      setFetching(true);
      getProblem(problem.id)
        .then((d) => setDescription(d.description ?? ""))
        .catch(() => setDescription(""))
        .finally(() => setFetching(false));
    }
  }

  const ctaLabel = problem.user_status === "solved" ? "Revisit" : problem.user_status === "attempted" ? "Continue" : "Start Challenge";

  return (
    <motion.div layout="position" className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer">
      {/* Header row */}
      <div
        onClick={onToggle}
        onMouseEnter={prefetch}
        className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-muted/20 transition-colors duration-150 group"
      >
        {/* Number */}
        <span className="text-[28px] font-bold text-muted-foreground/12 tabular-nums w-10 shrink-0 leading-none select-none">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[14px] font-semibold text-foreground group-hover:text-primary transition-colors duration-150">
              {problem.title}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${difficultyDot[problem.difficulty] ?? "bg-muted-foreground/20"}`} />
            <span className="text-[11px] text-muted-foreground/50 capitalize">{problem.difficulty}</span>
            {problem.concept && (
              <>
                <span className="text-muted-foreground/20">·</span>
                <span className="text-[11px] text-muted-foreground/40">{problem.concept}</span>
              </>
            )}
            <span className="text-muted-foreground/20">·</span>
            <TypeBadge type={problem.type} />
          </div>
        </div>

        {/* Right: status + score + type + delete + chevron */}
        <div className="flex items-center gap-3 shrink-0">
          {problem.user_status && problem.user_status !== "not_started" && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50">Status</span>
                <StatusBadge status={problem.user_status} />
              </div>
              {problem.best_score != null && problem.best_score > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50">Score</span>
                  <span className={`text-[11px] font-mono font-semibold tabular-nums ${
                    problem.best_score >= 90 ? "text-green-500"
                    : problem.best_score >= 70 ? "text-primary"
                    : problem.best_score >= 50 ? "text-yellow-500"
                    : "text-red-500"
                  }`}>
                    {problem.best_score}%
                  </span>
                </div>
              )}
              <div className="w-px h-4 bg-border/40" />
            </div>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(problem.id); }}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/10 text-muted-foreground/30 hover:text-red-500 cursor-pointer transition-all duration-150"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
          <div className="text-muted-foreground/30">
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expanded panel — fixed 180px so height never re-animates when description arrives */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 180, opacity: 1, transition: { type: "spring", stiffness: 280, damping: 28 } }}
            exit={{ height: 0, opacity: 0, transition: { type: "spring", stiffness: 320, damping: 36 } }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/50 h-full flex flex-col">
              {/* Description preview — fades in independently, no height change */}
              <div className="flex-1 relative px-5 pt-4 pb-0 overflow-hidden">
                {fetching || description === null ? (
                  <div className="flex items-center gap-2 py-1">
                    <Loader2 className="w-3 h-3 text-muted-foreground/30 animate-spin" />
                  </div>
                ) : description ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className="text-[12px] text-muted-foreground/70 leading-relaxed"
                  >
                    <TipTapRenderer content={description} />
                  </motion.div>
                ) : null}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-card to-transparent pointer-events-none" />
              </div>

              {/* CTA row */}
              <div className="flex items-center gap-4 px-5 py-3 shrink-0">
                <Link href={`/challenge/${pathSlug}/${problem.id}`} className="cursor-pointer">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={spring}
                    className="flex items-center gap-2 text-[12px] font-semibold text-primary-foreground bg-primary hover:bg-primary/90 px-5 py-2 rounded cursor-pointer transition-colors duration-150"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    {ctaLabel}
                  </motion.button>
                </Link>
                {problem.best_score != null && problem.best_score > 0 && (
                  <span className="text-[11px] text-muted-foreground/40">{problem.best_score}% best score</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function UnitPage() {
  const { pathId: slug, unit } = useParams<{ pathId: string; unit: string }>();
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [generatedOpen, setGeneratedOpen] = useState(true);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!path) return;
    setGenerating(true);
    setGenError(null);
    try {
      const newProblem = await generatePractice({ path_slug: slug, unit });
      router.push(`/challenge/${slug}/${newProblem.id}`);
    } catch {
      setGenError("Generation failed — try again.");
      setGenerating(false);
    }
  }

  const { data: path } = useQuery({ queryKey: ["path", slug], queryFn: () => getPath(slug) });
  const { data: problems, isLoading, refetch } = useQuery({
    queryKey: ["path-problems", slug, unit],
    queryFn: () => getPathProblems(slug, unit),
  });
  const { data: units } = useQuery({
    queryKey: ["path-units", slug],
    queryFn: () => getPathUnits(slug),
    enabled: !!path,
  });

  const unitLabel = unit.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const moduleNumber = useMemo(() => {
    if (!units) return null;
    const idx = units.findIndex((u) => u.unit === unit);
    return idx >= 0 ? idx + 1 : null;
  }, [units, unit]);

  const { curated, generated } = useMemo(() => {
    const all = problems ?? [];
    return {
      curated: all.filter((p) => !p.is_generated),
      generated: all.filter((p) => p.is_generated),
    };
  }, [problems]);

  // Split by tier + access
  const freeTierRows  = curated.filter((p) => p.is_free && !p.locked);
  const proTierRows   = curated.filter((p) => !p.is_free && !p.locked); // unlocked pro (subscribers)
  const lockedRows    = curated.filter((p) => p.locked);                // locked pro (free users)
  const accessible    = [...freeTierRows, ...proTierRows];

  const solvedCount = curated.filter((p) => p.user_status === "solved").length;
  const progressPct = curated.length > 0 ? Math.round((solvedCount / curated.length) * 100) : 0;

  const resumeProblem = accessible.find((p) => p.user_status === "attempted")
    ?? accessible.find((p) => !p.user_status || p.user_status === "not_started");

  const freeCount = useMemo(() => curated.filter((p) => p.is_free).length, [curated]);
  const proCount  = useMemo(() => curated.filter((p) => !p.is_free).length, [curated]);

  if (isLoading) {
    return (
      <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8 space-y-6">
        <div className={`h-3 w-32 rounded ${shimmer}`} />
        <div className="flex gap-6">
          <div className="flex-1 space-y-4">
            <div className={`h-12 w-48 rounded ${shimmer}`} />
            <div className={`h-3 w-60 rounded ${shimmer}`} />
            <div className="flex gap-2">{[1,2,3].map(i=><div key={i} className={`h-7 w-20 rounded ${shimmer}`}/>)}</div>
          </div>
          <div className={`w-56 h-36 rounded-lg ${shimmer}`} />
        </div>
        <div className={`h-8 rounded ${shimmer}`} />
        <div className="space-y-3">{[1,2,3,4,5].map(i=><div key={i} className={`h-16 rounded-lg ${shimmer}`}/>)}</div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8">

      {/* Breadcrumb */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <Link
          href={`/paths/${slug}`}
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground border border-border/60 bg-card px-3 py-1.5 rounded hover:border-border hover:text-foreground cursor-pointer transition-colors duration-150"
        >
          <ArrowLeft className="w-3 h-3" /> {path?.title ?? "Path"}
        </Link>
      </motion.div>

      {/* Hero: title + resume card */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="flex gap-8 items-start mb-8"
      >
        {/* Left */}
        <div className="flex-1 min-w-0">
          {moduleNumber && (
            <p className="text-[11px] font-semibold text-primary tracking-widest uppercase mb-3">
              Module {String(moduleNumber).padStart(2, "0")} · {path?.title}
            </p>
          )}
          <h1 className="text-[52px] font-black tracking-tighter text-foreground leading-none mb-3">
            {unitLabel}
          </h1>
          {units?.find(u => u.unit === unit)?.description && (
            <p className="text-[13px] text-muted-foreground leading-relaxed mb-4 max-w-lg">
              {units.find(u => u.unit === unit)!.description}
            </p>
          )}
          {/* Stats pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60 border border-border/60 px-2.5 py-1 rounded">
              <BookOpen className="w-3 h-3" /> {curated.length} challenges
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60 border border-border/60 px-2.5 py-1 rounded">
              {freeCount} free · {proCount} pro
            </span>
            <button
              onClick={() => setShowUpgrade(true)}
              className="flex items-center gap-1.5 text-[11px] text-amber-600 border border-amber-400/40 bg-amber-400/8 px-2.5 py-1 rounded cursor-pointer hover:bg-amber-400/15 transition-colors duration-150"
            >
              <WandSparkles className="w-3 h-3" /> unlimited AI with Pro
            </button>
          </div>
        </div>

        {/* Resume card — solid teal */}
        {resumeProblem && (
          <div className="relative w-64 shrink-0 rounded-lg bg-primary p-5 space-y-4 overflow-hidden">
            {/* Decorative circle */}
            <div className="pointer-events-none absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10" />
            <p className="text-[9px] font-semibold uppercase tracking-widest text-white/70 flex items-center gap-1.5 relative">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Jump back in
            </p>
            <div className="relative">
              <p className="text-[10px] text-white/50 font-mono mb-1">
                Challenge {String(curated.indexOf(resumeProblem) + 1).padStart(2, "0")}
              </p>
              <p className="text-[18px] font-bold text-white leading-snug">{resumeProblem.title}</p>
            </div>
            {resumeProblem.best_score != null && resumeProblem.best_score > 0 && (
              <div className="space-y-1.5 relative">
                <div className="h-1 rounded bg-white/20 overflow-hidden">
                  <div className="h-full bg-white rounded" style={{ width: `${resumeProblem.best_score}%` }} />
                </div>
                <p className="text-[10px] text-white/50">{resumeProblem.best_score}% · resuming</p>
              </div>
            )}
            <Link href={`/challenge/${slug}/${resumeProblem.id}`} className="relative block cursor-pointer">
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={spring}
                className="w-full flex items-center justify-center gap-2 text-[13px] font-bold text-primary bg-white hover:bg-white/90 px-4 py-2.5 rounded-full cursor-pointer transition-colors duration-150"
              >
                <Play className="w-3 h-3 fill-primary" />
                {resumeProblem.user_status === "attempted" ? "Resume Challenge" : "Start Challenge"}
              </motion.button>
            </Link>
          </div>
        )}
      </motion.div>

      {/* Progress bar */}
      {curated.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...spring, delay: 0.05 }}
          className="flex items-center gap-4 mb-8 px-5 py-3 rounded-lg bg-card border border-border/50"
        >
          <span className="text-[11px] font-medium text-muted-foreground/50 shrink-0">Your progress</span>
          <div className="flex-1 h-2 rounded bg-muted overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
            />
          </div>
          <span className="text-[11px] font-mono tabular-nums text-muted-foreground/50 shrink-0">
            {solvedCount} / {curated.length} complete
          </span>
        </motion.div>
      )}

      {/* ── Free section ────────────────────────────────── */}
      {freeTierRows.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...spring, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Free</span>
            <span className="text-[10px] font-mono text-muted-foreground/30">{freeTierRows.length}</span>
            <div className="flex-1 h-px bg-border/50" />
          </div>
          <div className="space-y-3">
            {freeTierRows.map((problem, i) => (
              <motion.div key={problem.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: i * 0.04 }}>
                <ChallengeRow problem={problem} index={i} pathSlug={slug} expanded={expandedId === problem.id} onToggle={() => setExpandedId(expandedId === problem.id ? null : problem.id)} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Pro section — unlocked (subscribers) ─────── */}
      {proTierRows.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...spring, delay: 0.15 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <Star className="w-3 h-3 text-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">Pro</span>
            <span className="text-[10px] font-mono text-muted-foreground/30">{proTierRows.length}</span>
            <div className="flex-1 h-px bg-amber-400/30" />
          </div>
          <div className="space-y-3">
            {proTierRows.map((problem, i) => (
              <motion.div key={problem.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: i * 0.04 }}>
                <ChallengeRow problem={problem} index={freeTierRows.length + i} pathSlug={slug} expanded={expandedId === problem.id} onToggle={() => setExpandedId(expandedId === problem.id ? null : problem.id)} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Pro section — locked (free users) ────────── */}
      {lockedRows.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...spring, delay: 0.15 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <Star className="w-3 h-3 text-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">Pro</span>
            <span className="text-[10px] font-mono text-muted-foreground/30">{lockedRows.length}</span>
            <div className="flex-1 h-px bg-amber-400/30" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4">
            {/* Locked list */}
            <div className="rounded-lg border border-amber-200/60 dark:border-amber-800/30 bg-amber-50/50 dark:bg-amber-900/10 overflow-hidden">
              <div className="divide-y divide-amber-200/30 dark:divide-amber-800/20">
                {lockedRows.map((problem) => {
                  const tc = typeConfig[problem.type];
                  return (
                    <div key={problem.id} className="flex items-center gap-3 px-5 py-3.5">
                      <div className="w-7 h-7 rounded border border-amber-200/60 dark:border-amber-700/30 bg-amber-100/50 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
                        <Lock className="w-3 h-3 text-amber-500/60" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-foreground">{problem.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${difficultyDot[problem.difficulty] ?? "bg-muted-foreground/20"}`} />
                          <span className="text-[10px] text-muted-foreground/50 capitalize">{problem.difficulty}</span>
                          {tc && (
                            <span className={`flex items-center gap-0.5 text-[10px] font-medium ${tc.color}`}>
                              {tc.icon} {tc.label}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upgrade card */}
            <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-5">
              <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-widest text-amber-600 bg-amber-400/10 border border-amber-400/25 px-2 py-1 rounded w-fit">
                <Star className="w-2.5 h-2.5" /> Codetail Pro
              </span>
              <div>
                <p className="text-[18px] font-bold text-foreground leading-tight mb-2">
                  Finish what you <span className="text-amber-500">started.</span>
                </p>
                <p className="text-[12px] text-muted-foreground/60 leading-relaxed">
                  Unlock the rest of {unitLabel} — and every Pro challenge across all paths.
                </p>
              </div>
              <ul className="space-y-2">
                {[
                  `All ${lockedRows.length} Pro challenges in ${unitLabel}`,
                  "Worked solutions & hints",
                  "Every Pro path, unlimited",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[12px] text-muted-foreground/70">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500/70 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div>
                <button
                  onClick={() => setShowUpgrade(true)}
                  className="w-full flex items-center justify-center gap-2 text-[13px] font-bold text-white bg-amber-500 hover:bg-amber-400 px-4 py-2.5 rounded cursor-pointer transition-colors duration-150"
                >
                  <Zap className="w-3.5 h-3.5" /> Go Pro
                </button>
                <p className="text-[10px] text-muted-foreground/30 text-center mt-2">Cancel anytime</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── AI section ───────────────────────────────── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...spring, delay: 0.2 }}>
        {/* Header row: label + generate button + collapse toggle */}
        <div className="flex items-center gap-2.5 mb-4">
          <WandSparkles className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">AI</span>
          {generated.length > 0 && (
            <span className="text-[10px] font-mono text-muted-foreground/30">{generated.length}</span>
          )}
          <div className="flex-1 h-px bg-primary/20" />
          <AnimatePresence>
            {genError && (
              <motion.span
                initial={{ opacity: 0, x: 4 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="text-[10px] text-destructive"
              >
                {genError}
              </motion.span>
            )}
          </AnimatePresence>
          <motion.button
            onClick={handleGenerate}
            disabled={generating}
            whileHover={generating ? {} : { scale: 1.02 }}
            whileTap={generating ? {} : { scale: 0.97 }}
            transition={spring}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-primary-foreground bg-primary hover:bg-primary/90 px-3 py-1 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          >
            {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : <WandSparkles className="w-3 h-3" />}
            {generating ? "Generating…" : "Generate"}
          </motion.button>
          {generated.length > 0 && (
            <motion.button
              onClick={() => setGeneratedOpen((o) => !o)}
              className="text-muted-foreground/30 hover:text-muted-foreground cursor-pointer transition-colors duration-150"
            >
              <motion.div animate={{ rotate: generatedOpen ? 90 : 0 }} transition={spring}>
                <ChevronRight className="w-3.5 h-3.5" />
              </motion.div>
            </motion.button>
          )}
        </div>

        {/* Cards */}
        <AnimatePresence initial={false}>
          {generated.length === 0 && !generating && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 px-5 py-4 rounded-lg border border-dashed border-primary/20 bg-primary/4 text-[12px] text-muted-foreground/50"
            >
              <WandSparkles className="w-4 h-4 text-primary/30 shrink-0" />
              Hit <span className="font-semibold text-primary/60">Generate</span> to create a custom {unitLabel} challenge tailored to you.
            </motion.div>
          )}
          {generating && generated.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 px-5 py-4 rounded-lg border border-primary/20 bg-primary/4"
            >
              <Loader2 className="w-4 h-4 text-primary/50 animate-spin shrink-0" />
              <span className="text-[12px] text-primary/60">Building your challenge — this takes ~20s…</span>
            </motion.div>
          )}
          {generatedOpen && generated.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1, transition: spring }}
              exit={{ height: 0, opacity: 0, transition: { type: "spring", stiffness: 320, damping: 36 } }}
              className="overflow-hidden space-y-1"
            >
              {generated.map((problem, i) => (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: i * 0.04 }}
                >
                  <ChallengeRow
                    problem={problem}
                    index={freeTierRows.length + proTierRows.length + i}
                    pathSlug={slug}
                    expanded={expandedId === problem.id}
                    onToggle={() => setExpandedId(expandedId === problem.id ? null : problem.id)}
                    onDelete={async (id: string) => { await deleteGeneratedProblem(id); refetch(); }}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} trigger={`Unlock all Pro challenges in ${unitLabel}.`} />
    </main>
  );
}
