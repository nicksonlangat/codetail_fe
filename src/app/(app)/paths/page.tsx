"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { getPathsByCategory } from "@/data/paths";
import { getIcon } from "@/lib/icons";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { PathCategory } from "@/types";

export default function PathsPage() {
  const [activeCategory, setActiveCategory] = useState<PathCategory>("dsa");
  const filtered = useMemo(() => getPathsByCategory(activeCategory), [activeCategory]);

  return (
    <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8 space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-[15px] font-semibold tracking-tight text-foreground">
          Learning Paths
        </h1>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          Structured tracks to guide your practice — complete them in order for best results.
        </p>
      </motion.div>

      {/* Category tabs */}
      <Tabs
        defaultValue="dsa"
        onValueChange={(val) => setActiveCategory(val as PathCategory)}
      >
        <TabsList>
          <TabsTrigger value="dsa">DSA &amp; Python</TabsTrigger>
          <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
        </TabsList>

        <TabsContent value={activeCategory}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {filtered.map((path, i) => {
              const completed = path.problems.filter(
                (p) => p.status === "completed"
              ).length;
              const total = path.problems.length;
              const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
              const done = pct === 100;
              const Icon = getIcon(path.icon);

              return (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                >
                  <PathCard
                    path={path}
                    Icon={Icon}
                    completed={completed}
                    total={total}
                    pct={pct}
                    done={done}
                  />
                </motion.div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}

function PathCard({
  path,
  Icon,
  completed,
  total,
  pct,
  done,
}: {
  path: ReturnType<typeof getPathsByCategory>[number];
  Icon: React.ComponentType<{ className?: string }>;
  completed: number;
  total: number;
  pct: number;
  done: boolean;
}) {
  const content = (
    <div
      className={`relative w-full text-left rounded-xl border p-5 transition-colors duration-75 group overflow-hidden ${
        path.unlocked
          ? "bg-card hover:bg-secondary/40 cursor-pointer border-border"
          : "bg-muted/20 cursor-default border-border/40"
      }`}
    >
      {/* Lock overlay */}
      {!path.unlocked && (
        <div className="absolute inset-0 z-10 backdrop-blur-[3px] bg-background/50 flex flex-col items-center justify-center rounded-xl gap-1.5">
          <span className="text-xs font-semibold text-foreground/70">
            {path.title}
          </span>
          <Lock className="w-4 h-4 text-muted-foreground" />
          <span className="text-[10px] font-medium text-primary">
            Upgrade to unlock
          </span>
        </div>
      )}

      <div className="flex items-start gap-3.5">
        {/* Icon */}
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
            done
              ? "bg-accent text-accent-foreground"
              : path.unlocked
              ? "bg-secondary text-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {!path.unlocked ? (
            <Lock className="w-4 h-4" />
          ) : done ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <Icon className="w-4 h-4" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-foreground">
              {path.title}
            </span>
            <Badge
              variant="secondary"
              className={`text-[10px] px-1.5 py-px h-auto ${
                path.difficulty === "Beginner"
                  ? "text-difficulty-easy"
                  : path.difficulty === "Intermediate"
                  ? "text-difficulty-medium"
                  : "text-difficulty-hard"
              }`}
            >
              {path.difficulty}
            </Badge>
          </div>

          <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
            {path.description}
          </p>

          {/* Progress */}
          <div className="flex items-center gap-3 mt-3.5">
            <Progress value={pct} className="h-1 flex-1" />
            <span className="text-[11px] text-muted-foreground tabular-nums whitespace-nowrap">
              {completed}/{total}
            </span>
          </div>

          {/* Topic tags */}
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            {path.topics.map((t) => (
              <span
                key={t}
                className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Arrow */}
        {path.unlocked && (
          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-75 mt-1 flex-shrink-0" />
        )}
      </div>
    </div>
  );

  if (path.unlocked) {
    return (
      <Link href={`/paths/${path.id}`} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
