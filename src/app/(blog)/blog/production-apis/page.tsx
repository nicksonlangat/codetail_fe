"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

const stacks = [
  {
    slug: "fastapi",
    name: "FastAPI",
    subtitle: "Async Python",
    description:
      "Build a task API from SQLite and sync handlers to a production system handling 10k RPS. Every constraint introduced progressively, every fix shown in runnable code.",
    articleCount: 10,
    estimatedHours: 5,
    status: "ready" as const,
    accentColor: "#009688",
    topics: ["Connection pooling", "JWT auth", "Redis caching", "Circuit breakers", "10k RPS"],
  },
  {
    slug: "django",
    name: "Django",
    subtitle: "Batteries Included",
    description:
      "The same constraint arc applied to Django REST Framework: ORM query optimization, Celery background jobs, and zero-downtime schema migrations.",
    articleCount: 10,
    estimatedHours: 5,
    status: "coming-soon" as const,
    accentColor: "#092E20",
    topics: ["Django ORM", "DRF", "Celery", "Migrations", "10k RPS"],
  },
  {
    slug: "go",
    name: "Go",
    subtitle: "net/http + pgx",
    description:
      "The same 10 constraints solved in idiomatic Go: goroutine worker pools, pgx connection management, and the concurrency patterns that make Go fast.",
    articleCount: 10,
    estimatedHours: 5,
    status: "coming-soon" as const,
    accentColor: "#00ACD7",
    topics: ["net/http", "pgx", "Goroutines", "Channels", "10k RPS"],
  },
];

export default function ProductionApisPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 lg:px-8 py-8 space-y-10">
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚙️</span>
          <span className="text-[10px] uppercase tracking-wider font-medium text-primary">
            Learning Path
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Production-Ready APIs
        </h1>
        <p className="text-[14px] text-muted-foreground max-w-2xl leading-relaxed">
          Build a real API from scratch and watch it evolve under progressively tighter
          production constraints. Every article introduces a new constraint, breaks the
          current code, and shows the exact fix. Three stacks, same constraint arc.
        </p>
      </motion.div>

      <motion.div
        className="grid gap-3 sm:grid-cols-3 text-[11px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...spring, delay: 0.08 }}
      >
        {[
          { icon: "🔧", label: "Constraint-driven" },
          { icon: "📋", label: "Before/after diffs" },
          { icon: "📊", label: "Real benchmarks" },
        ].map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50">
            <span>{icon}</span>
            <span className="font-medium text-foreground/80">{label}</span>
          </div>
        ))}
      </motion.div>

      <div className="h-px bg-border" />

      <div className="space-y-3">
        <motion.p
          className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...spring, delay: 0.15 }}
        >
          Choose your stack
        </motion.p>

        <div className="space-y-3">
          {stacks.map((stack, index) => {
            const isReady = stack.status === "ready";

            const card = (
              <motion.div
                key={stack.slug}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: 0.18 + index * 0.06 }}
              >
                <motion.div
                  whileHover={isReady ? { y: -2 } : undefined}
                  transition={spring}
                  className={`relative rounded-xl border bg-card p-5 transition-all duration-500 overflow-hidden ${
                    isReady
                      ? "border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 cursor-pointer group"
                      : "border-border/60 opacity-60"
                  }`}
                >
                  {!isReady && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/60 backdrop-blur-[1px] rounded-xl">
                      <Badge variant="secondary" className="text-[11px] px-3 py-1">
                        Coming Soon
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-[15px] font-semibold">{stack.name}</h3>
                        <span
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                          style={{
                            color: stack.accentColor,
                            backgroundColor: `${stack.accentColor}18`,
                          }}
                        >
                          {stack.subtitle}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {stack.articleCount} articles
                        </span>
                        <span className="text-border">·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          ~{stack.estimatedHours}h read
                        </span>
                      </div>
                    </div>
                    {isReady && (
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-500 flex-shrink-0" />
                    )}
                  </div>

                  <p className="text-[12px] text-muted-foreground/80 leading-relaxed mb-3">
                    {stack.description}
                  </p>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {stack.topics.map((topic) => (
                      <span
                        key={topic}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            );

            if (isReady) {
              return (
                <Link key={stack.slug} href={`/blog/production-apis/${stack.slug}`} className="block">
                  {card}
                </Link>
              );
            }
            return card;
          })}
        </div>
      </div>
    </main>
  );
}
