"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ChevronRight, Lock, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPath, getPathUnits, type UnitItem } from "@/lib/api/paths";
import { getIcon } from "@/lib/icons";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };
const shimmer = "bg-muted relative overflow-hidden before:absolute before:inset-0 before:translate-x-[-100%] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:animate-[shimmer_1.5s_infinite]";

type UnitState = "completed" | "in_progress" | "not_started";

function getUnitState(unit: UnitItem): UnitState {
  if (unit.total > 0 && unit.solved === unit.total) return "completed";
  if (unit.solved > 0) return "in_progress";
  return "not_started";
}

const diffColor: Record<string, string> = {
  beginner: "bg-difficulty-easy/10 text-difficulty-easy",
  intermediate: "bg-difficulty-medium/10 text-difficulty-medium",
  advanced: "bg-difficulty-hard/10 text-difficulty-hard",
};

function PythonLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 110 110" className={className} xmlns="http://www.w3.org/2000/svg">
      <path fill="#4584B6" d="M54.9 5C34.1 5 35.4 13.8 35.4 13.8L35.4 23H55.2V26H22.3C22.3 26 11 24.6 11 45.6C11 66.7 20.8 66 20.8 66H26.6V55.4C26.6 55.4 26.3 45.6 36.3 45.6H55.9C55.9 45.6 65.2 45.7 65.2 36.6V16C65.2 16 66.6 5 54.9 5ZM44.8 11.4C46.8 11.4 48.4 13 48.4 15C48.4 17 46.8 18.6 44.8 18.6C42.8 18.6 41.2 17 41.2 15C41.2 13 42.8 11.4 44.8 11.4Z"/>
      <path fill="#FFD43B" d="M55.1 105C75.9 105 74.6 96.2 74.6 96.2L74.6 87H54.8V84H87.7C87.7 84 99 85.4 99 64.4C99 43.3 89.2 44 89.2 44H83.4V54.6C83.4 54.6 83.7 64.4 73.7 64.4H54.1C54.1 64.4 44.8 64.3 44.8 73.4V94C44.8 94 43.4 105 55.1 105ZM65.2 98.6C63.2 98.6 61.6 97 61.6 95C61.6 93 63.2 91.4 65.2 91.4C67.2 91.4 68.8 93 68.8 95C68.8 97 67.2 98.6 65.2 98.6Z"/>
    </svg>
  );
}

function UnitCard({ unit, index, slug, isPython }: { unit: UnitItem; index: number; slug: string; isPython: boolean }) {
  const state = getUnitState(unit);
  const pct = unit.total > 0 ? (unit.solved / unit.total) * 100 : 0;
  const proCount = unit.total - unit.free;

  const borderClass =
    state === "completed" ? "border-green-500/25 hover:border-green-500/40"
    : state === "in_progress" ? "border-primary/25 hover:border-primary/40"
    : "border-border hover:border-border";

  const stateLabel =
    state === "completed" ? "Complete"
    : state === "in_progress" ? "In Progress"
    : "Not Started";

  const stateLabelColor =
    state === "completed" ? "text-green-500/70 bg-green-500/8 border-green-500/20"
    : state === "in_progress" ? "text-primary bg-primary/8 border-primary/20"
    : "text-muted-foreground/40 bg-muted/40 border-border/40";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: 0.15 + index * 0.05 }}
    >
      <Link href={`/paths/${slug}/${unit.unit}`} className="cursor-pointer">
        <motion.div
          whileHover={{ y: -2 }}
          transition={spring}
          className={`relative bg-card border rounded-xl cursor-pointer overflow-hidden transition-all duration-500 ${borderClass}`}
        >
          {/* Python logo watermark */}
          {isPython && (
            <PythonLogo className="absolute -bottom-3 -right-3 w-24 h-24 opacity-[0.18] mix-blend-multiply dark:mix-blend-screen pointer-events-none select-none" />
          )}

          <div className="p-5">
            {/* Top row: index + state pill */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono tabular-nums text-muted-foreground/25 font-bold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border ${stateLabelColor}`}>
                {stateLabel}
              </span>
            </div>

            {/* Unit name */}
            <div className="flex items-start justify-between gap-2 mb-4">
              <div>
                {isPython && (
                  <PythonLogo className="w-6 h-6 mb-2" />
                )}
                <h3 className={`text-[15px] font-bold leading-tight mb-1 ${state === "completed" ? "text-muted-foreground/60" : "text-foreground"}`}>
                  {unit.label}
                </h3>
                {unit.description && (
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {unit.description}
                  </p>
                )}
              </div>
              {state === "completed" && (
                <CheckCircle2 className="w-4 h-4 text-green-500/60 shrink-0 mt-0.5" />
              )}
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-1.5 flex-wrap mb-4">
              <span className="text-[10px] font-mono tabular-nums text-muted-foreground/50">{unit.total} problems</span>
              <span className="text-muted-foreground/20 text-[10px]">·</span>
              <span className="text-[10px] text-primary/70 bg-primary/8 border border-primary/15 px-1.5 py-px rounded-full">{unit.free} free</span>
              {proCount > 0 && (
                <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground/40">
                  <Lock className="w-2.5 h-2.5" />{proCount} pro
                </span>
              )}
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${state === "completed" ? "bg-green-500/60" : "bg-primary"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.3 + index * 0.05 }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground/40 font-mono tabular-nums">
                  {unit.solved} / {unit.total} solved
                </span>
                <ChevronRight className="w-3 h-3 text-muted-foreground/25" />
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function PathDetailPage() {
  const { pathId: slug } = useParams<{ pathId: string }>();

  const { data: path, isLoading: pathLoading } = useQuery({
    queryKey: ["path", slug],
    queryFn: () => getPath(slug),
  });

  const { data: units, isLoading: unitsLoading } = useQuery({
    queryKey: ["path-units", slug],
    queryFn: () => getPathUnits(slug),
    enabled: !!path,
  });

  const isLoading = pathLoading || unitsLoading;
  const totalSolved = units?.reduce((s, u) => s + u.solved, 0) ?? 0;
  const totalProblems = units?.reduce((s, u) => s + u.total, 0) ?? 0;
  const overallPct = totalProblems > 0 ? (totalSolved / totalProblems) * 100 : 0;
  const nextUnit = units?.find(u => getUnitState(u) !== "completed") ?? null;

  if (isLoading) {
    return (
      <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8 space-y-6">
        <div className={`h-3 w-14 rounded ${shimmer}`} />
        <div className="flex gap-4">
          <div className={`w-10 h-10 rounded-xl shrink-0 ${shimmer}`} />
          <div className="flex-1 space-y-2">
            <div className={`h-5 w-48 rounded ${shimmer}`} />
            <div className={`h-3 w-80 rounded ${shimmer}`} />
            <div className="flex gap-1.5">{[1,2,3].map(i => <div key={i} className={`h-4 w-16 rounded ${shimmer}`} />)}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => <div key={i} className={`h-44 rounded-xl ${shimmer}`} />)}
        </div>
      </main>
    );
  }

  if (!path) {
    return (
      <main className="flex items-center justify-center py-20">
        <p className="text-[13px] text-muted-foreground">Path not found.</p>
      </main>
    );
  }

  const Icon = getIcon(path.icon);
  const isPython = path.stack === "python";

  return (
    <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Link href="/paths" className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500">
          <ArrowLeft className="w-3 h-3" /> Paths
        </Link>
      </motion.div>

      {/* Path header */}
      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            {isPython ? <PythonLogo className="w-6 h-6" /> : <Icon className="w-5 h-5 text-primary" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-[20px] font-bold tracking-tight">{path.title}</h1>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${diffColor[path.difficulty] ?? "bg-muted text-muted-foreground"}`}>
                {path.difficulty}
              </span>
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed mb-3">{path.description}</p>
            {path.topics.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {path.topics.map(t => (
                  <span key={t} className="text-[10px] font-medium text-muted-foreground/50 bg-muted/60 px-2 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* Progress — far right */}
          <div className="shrink-0 text-right hidden sm:block">
            <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50 block mb-1.5">Progress</span>
            <span className="text-[13px] font-mono tabular-nums font-semibold text-foreground">{totalSolved}<span className="text-muted-foreground/40 font-normal">/{totalProblems}</span></span>
            <div className="w-28 h-1 bg-muted rounded-full overflow-hidden mt-1.5">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${overallPct}%` }}
                transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.4 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Resume / start banner */}
      {nextUnit && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.1 }}>
          <Link href={`/paths/${slug}/${nextUnit.unit}`} className="cursor-pointer">
            <motion.div
              whileHover={{ y: -2 }} transition={spring}
              className="relative bg-foreground dark:bg-card rounded-xl px-6 py-5 cursor-pointer overflow-hidden transition-all duration-500"
            >
              {/* Watermark */}
              {isPython && (
                <PythonLogo className="absolute -bottom-4 -right-4 w-32 h-32 opacity-[0.07] mix-blend-screen pointer-events-none select-none" />
              )}

              <div className="relative flex items-end justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-white/30 mb-2">
                    {getUnitState(nextUnit) === "in_progress" ? "Continue" : "Up Next"}
                  </p>
                  <h3 className="text-[28px] font-black tracking-tight text-white leading-none mb-2">
                    {nextUnit.label}
                  </h3>
                  {nextUnit.description && (
                    <p className="text-[11px] text-white/40 leading-relaxed max-w-sm">
                      {nextUnit.description}
                    </p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-white/30 mb-1">Solved</p>
                  <p className="text-[32px] font-black font-mono tabular-nums text-white leading-none">
                    {nextUnit.solved}
                    <span className="text-white/25 text-[18px] font-normal">/{nextUnit.total}</span>
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative mt-5 h-0.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${nextUnit.total > 0 ? (nextUnit.solved / nextUnit.total) * 100 : 0}%` }}
                  transition={{ type: "spring", stiffness: 60, damping: 20, delay: 0.5 }}
                />
              </div>
            </motion.div>
          </Link>
        </motion.div>
      )}

      {/* Unit grid */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...spring, delay: 0.15 }}>
        <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50 mb-3 px-1">
          {units?.length ?? 0} units
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {units?.map((unit, i) => (
            <UnitCard key={unit.unit} unit={unit} index={i} slug={slug} isPython={isPython} />
          ))}
        </div>
      </motion.div>
    </main>
  );
}
