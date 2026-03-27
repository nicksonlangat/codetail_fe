"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, Code, Bug, Wrench, ListChecks, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getTodayChallenges } from "@/lib/api/submissions";
import { useAuthStore } from "@/stores/auth-store";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

const typeConfig: Record<string, { icon: typeof Code; dot: string }> = {
  write_code: { icon: Code, dot: "bg-primary" },
  fix_code: { icon: Bug, dot: "bg-orange-500" },
  refactor: { icon: Wrench, dot: "bg-purple-500" },
  mcq: { icon: ListChecks, dot: "bg-blue-500" },
};

const diffColor: Record<string, string> = {
  easy: "text-difficulty-easy",
  medium: "text-difficulty-medium",
  hard: "text-difficulty-hard",
};

export function TodayChallenges() {
  const { user } = useAuthStore();
  const isPro = user?.tier === "pro";
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["today-challenges"],
    queryFn: getTodayChallenges,
    enabled: isPro,
    staleTime: 60000,
  });

  if (!isPro || isLoading) return null;

  const problems = data?.problems ?? [];
  if (!problems.length) return null;

  const attempted = problems.filter((p) => p.attempted).length;
  const total = problems.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-primary" />
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-primary/80">
            Today&apos;s Challenges
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Progress dots */}
          <div className="flex items-center gap-1">
            {problems.map((p, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                p.attempted ? "bg-primary" : "bg-muted"
              }`} />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground tabular-nums font-mono">
            {attempted}/{total}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 relative">
        {/* Timeline line */}
        <motion.div
          className="absolute left-[27px] top-4 bottom-4 w-[2px] bg-border/40 origin-top"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ ...spring, delay: 0.2 }}
        />

        <div className="space-y-0">
          {problems.map((problem, i) => {
            const config = typeConfig[problem.type] ?? typeConfig.write_code;
            const Icon = config.icon;
            const isHovered = hoveredIdx === i;
            const pathSlug = problem.stack === "django" ? "django-models" : "python-fundamentals";

            return (
              <Link key={problem.id} href={`/challenge/${pathSlug}/${problem.id}`}>
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...spring, delay: 0.1 + i * 0.06 }}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="relative flex items-start gap-3 py-2.5 cursor-pointer group"
                >
                  {/* Dot */}
                  <motion.div
                    animate={{ scale: isHovered ? 1.3 : 1 }}
                    transition={spring}
                    className={`w-[24px] h-[24px] rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      problem.attempted ? "bg-primary/15" : `${config.dot}/15`
                    } transition-all duration-500`}
                  >
                    {problem.attempted ? (
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                    ) : (
                      <div className={`w-[8px] h-[8px] rounded-full ${config.dot} transition-all duration-500`} />
                    )}
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    animate={{ y: isHovered ? -1 : 0 }}
                    transition={spring}
                    className="flex-1 min-w-0"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3 h-3 text-muted-foreground/60 flex-shrink-0" />
                      <span className={`text-[12px] font-semibold tracking-tight truncate ${
                        problem.attempted ? "text-muted-foreground line-through" : "text-foreground"
                      }`}>
                        {problem.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 ml-5">
                      <span className={`text-[10px] font-semibold ${diffColor[problem.difficulty] ?? ""}`}>
                        {problem.difficulty}
                      </span>
                      {problem.concept && (
                        <>
                          <span className="text-muted-foreground/30">·</span>
                          <span className="text-[10px] text-muted-foreground">{problem.concept}</span>
                        </>
                      )}
                    </div>

                    {/* Hover reveal */}
                    <AnimatePresence>
                      {isHovered && !problem.attempted && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden ml-5"
                        >
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-primary font-medium mt-1">
                            Start challenge <ArrowRight className="w-2.5 h-2.5" />
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Number */}
                  <span className="text-[10px] text-muted-foreground/30 font-mono tabular-nums flex-shrink-0 pt-0.5">
                    #{i + 1}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
