"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  WandSparkles, Route, Flame,
  CheckCircle2, XCircle, Award, Coins,
} from "lucide-react";
import { RingProgress } from "@/components/ui/ring-progress";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

function useCountUp(target: number, inView: boolean, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);
  return value;
}

type FeatureId = "ai-review" | "sandbox" | "paths" | "progress";

const FEATURES: { id: FeatureId; letter: string; title: string; description: string }[] = [
  {
    id: "ai-review",
    letter: "A",
    title: "AI code review",
    description:
      "Django, FastAPI, SQL and Go submissions get scored against a real rubric and reviewed by AI, not just checked for pass or fail.",
  },
  {
    id: "sandbox",
    letter: "B",
    title: "Sandboxed execution",
    description:
      "Write and fix Python in an isolated subprocess. Every test case runs for real against your code, no simulated output.",
  },
  {
    id: "paths",
    letter: "C",
    title: "Structured learning paths",
    description:
      "Problems organized by stack and difficulty, from fundamentals to production patterns, so you always know what's next.",
  },
  {
    id: "progress",
    letter: "D",
    title: "XP, streaks and badges",
    description:
      "Earn XP on every first solve, build a daily streak, and unlock badges as you progress through a path.",
  },
];

function GradientCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl border border-brand-border overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-brand-surface"
        style={{
          backgroundImage:
            "radial-gradient(60% 80% at 15% 20%, var(--brand-primary-soft) 0%, transparent 60%), radial-gradient(50% 70% at 85% 85%, var(--brand-primary-tint) 0%, transparent 60%)",
        }}
      />
      <div className="relative flex items-center justify-center min-h-70 p-8">{children}</div>
    </div>
  );
}

function AIReviewVisual() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const score = useCountUp(82, inView);

  const attrs = [
    { label: "Correctness", value: 90 },
    { label: "Design", value: 82 },
    { label: "Clarity", value: 88 },
    { label: "Efficiency", value: 74 },
  ];

  return (
    <div
      ref={ref}
      className="w-full max-w-sm rounded-2xl bg-white shadow-2xl shadow-brand-primary/10 border border-brand-border p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="flex items-center gap-2 text-xs font-semibold text-brand-text">
          <span className="size-6 rounded-full bg-brand-primary/10 flex items-center justify-center">
            <WandSparkles className="size-3.5 text-brand-primary" />
          </span>
          AI Code Review
        </span>
        <span className="text-[10px] text-brand-text-subtle">Reviewed just now</span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative size-16 shrink-0">
          <RingProgress value={score} size={64} stroke={5} inView={inView} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-brand-text tabular-nums">{score}</span>
          </div>
        </div>
        <p className="text-[12px] leading-5 text-brand-text-muted">
          Clean structure and clear naming, but the empty-list edge case is not explicitly
          handled.
        </p>
      </div>

      <div className="space-y-2 mb-4">
        {attrs.map((a) => (
          <div key={a.label}>
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-brand-text-muted">{a.label}</span>
              <span className="text-brand-text-subtle tabular-nums">{a.value}</span>
            </div>
            <div className="h-1 rounded-full bg-brand-surface overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-primary transition-all duration-1000 ease-out"
                style={{ width: inView ? `${a.value}%` : "0%" }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-brand-border space-y-1.5">
        <div className="flex items-center gap-2 text-[12px] text-brand-text">
          <CheckCircle2 className="size-3.5 text-brand-success shrink-0" />
          Correct on all provided examples
        </div>
        <div className="flex items-center gap-2 text-[12px] text-brand-text">
          <XCircle className="size-3.5 text-brand-destructive shrink-0" />
          Missing type hints on the return value
        </div>
      </div>
    </div>
  );
}

function SandboxVisual() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const tests = ["test_basic_counts", "test_empty_input", "test_case_sensitivity"];

  return (
    <div
      ref={ref}
      className="w-full max-w-sm rounded-2xl bg-white shadow-2xl shadow-brand-primary/10 border border-brand-border overflow-hidden"
    >
      <div className="flex items-center gap-1.5 h-9 px-3 border-b border-brand-border bg-brand-surface/50">
        <span className="size-2 rounded-full bg-brand-destructive/70" />
        <span className="size-2 rounded-full bg-brand-warning/70" />
        <span className="size-2 rounded-full bg-brand-success/70" />
        <span className="ml-2 text-[11px] font-mono text-brand-text-subtle">sandbox &middot; python3</span>
      </div>
      <div className="p-4 font-mono text-[12px] leading-6">
        <p className="text-brand-text-muted">
          <span className="text-brand-primary">$</span> python3 -m pytest main.py
        </p>

        <div className="mt-2 space-y-1">
          {tests.map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ ...SPRING, delay: 0.15 * i }}
              className="flex items-center justify-between"
            >
              <span className="text-brand-text-muted">{t}</span>
              <span className="text-brand-success flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="size-3" /> PASSED
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.15 * tests.length + 0.15 }}
          className="mt-3 pt-2 border-t border-brand-border flex items-center justify-between text-[11px]"
        >
          <span className="text-brand-success font-medium flex items-center gap-1">
            <CheckCircle2 className="size-3.5" /> 6 passed, 0 failed
          </span>
          <span className="text-brand-text-subtle">42ms</span>
        </motion.div>

        <p className="mt-1.5 flex items-center">
          <span className="text-brand-primary">$</span>
          <span className="ml-1.5 inline-block w-1.5 h-3 bg-brand-text-subtle animate-pulse" />
        </p>
      </div>
    </div>
  );
}

function PathRow({
  title, meta, pct, inView, delay,
}: {
  title: string; meta: string; pct: number; inView: boolean; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ ...SPRING, delay }}
      className="flex items-center gap-3 py-2.5 border-b border-brand-border last:border-0"
    >
      <div className="relative size-9 shrink-0">
        <RingProgress value={pct} size={36} stroke={3} inView={inView} />
        <div className="absolute inset-0 flex items-center justify-center text-[9px] font-semibold text-brand-text tabular-nums">
          {pct}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[12.5px] font-medium text-brand-text truncate">{title}</p>
        <p className="text-[11px] text-brand-text-subtle">{meta}</p>
      </div>
    </motion.div>
  );
}

function PathsVisual() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div
      ref={ref}
      className="w-full max-w-sm rounded-2xl bg-white shadow-2xl shadow-brand-primary/10 border border-brand-border p-5"
    >
      <span className="flex items-center gap-2 text-xs font-semibold text-brand-text mb-1">
        <span className="size-6 rounded-full bg-brand-primary/10 flex items-center justify-center">
          <Route className="size-3.5 text-brand-primary" />
        </span>
        In progress
      </span>
      <div className="mt-2">
        <PathRow title="Python Fundamentals" meta="8 of 12 problems" pct={64} inView={inView} delay={0} />
        <PathRow title="Django ORM Patterns" meta="2 of 10 problems" pct={20} inView={inView} delay={0.1} />
        <PathRow title="SQL Window Functions" meta="Not started" pct={0} inView={inView} delay={0.2} />
      </div>
    </div>
  );
}

function ProgressVisual() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const xp = useCountUp(1240, inView, 1100);
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const active = [true, true, true, false, true, true, false];

  return (
    <div
      ref={ref}
      className="w-full max-w-sm rounded-2xl bg-white shadow-2xl shadow-brand-primary/10 border border-brand-border p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="relative size-11 shrink-0">
          <div aria-hidden className="absolute inset-0 rounded-full bg-brand-warning/20 blur-md" />
          <div className="relative size-11 rounded-full bg-brand-warning/10 flex items-center justify-center">
            <Flame className="size-5 text-brand-warning" />
          </div>
        </div>
        <div>
          <p className="text-xl font-bold leading-none text-brand-text tabular-nums">
            12 <span className="text-xs font-normal text-brand-text-muted">day streak</span>
          </p>
          <p className="text-[11px] text-brand-text-subtle mt-1">Longest streak: 18 days</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        {days.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className={`size-6 rounded-md ${active[i] ? "bg-brand-primary" : "bg-brand-surface"}`} />
            <span className="text-[9px] text-brand-text-subtle">{d}</span>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-brand-border flex items-center justify-between text-[12px]">
        <span className="flex items-center gap-1.5 text-brand-text font-medium">
          <Coins className="size-3.5 text-brand-primary" />
          <span className="tabular-nums">{xp.toLocaleString()}</span> XP
        </span>
        <span className="flex items-center gap-1.5 text-brand-text-muted">
          <Award className="size-3.5" /> 6 badges
        </span>
      </div>
    </div>
  );
}

const VISUALS: Record<FeatureId, React.ComponentType> = {
  "ai-review": AIReviewVisual,
  sandbox: SandboxVisual,
  paths: PathsVisual,
  progress: ProgressVisual,
};

export function Features() {
  const [active, setActive] = useState<FeatureId>("ai-review");
  const sectionRefs = useRef<Partial<Record<FeatureId, HTMLDivElement | null>>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id as FeatureId);
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-2xl font-semibold tracking-tight text-brand-text leading-tight">
            Four systems, one learning loop.
          </h2>
          <p className="mt-3 text-[13px] leading-6 text-brand-text-muted">
            Codetail brings AI review, sandboxed execution, structured paths and progress
            tracking into one place, built around how developers actually practice.
          </p>

          <div className="mt-7 border-t border-brand-border">
            {FEATURES.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() =>
                  document.getElementById(f.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                className="flex items-center gap-3 w-full text-left py-3.5 border-b border-brand-border cursor-pointer transition-all duration-500"
              >
                <span
                  className={`text-xs font-semibold ${
                    active === f.id ? "text-brand-primary" : "text-brand-text-subtle"
                  }`}
                >
                  {f.letter}
                </span>
                <span
                  className={`text-sm ${
                    active === f.id
                      ? "text-brand-text font-medium"
                      : "text-brand-text-muted"
                  }`}
                >
                  {f.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-16">
          {FEATURES.map((f) => {
            const Visual = VISUALS[f.id];
            return (
              <div
                key={f.id}
                id={f.id}
                ref={(el) => {
                  sectionRefs.current[f.id] = el;
                }}
                className="scroll-mt-24"
              >
                <div className="flex items-baseline gap-2.5 mb-2">
                  <span className="text-sm font-semibold text-brand-text-subtle">{f.letter}.</span>
                  <h3 className="text-xl font-semibold text-brand-text">{f.title}</h3>
                </div>
                <p className="text-[13px] leading-6 text-brand-text-muted mb-5 max-w-lg">
                  {f.description}
                </p>
                <GradientCard>
                  <Visual />
                </GradientCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
