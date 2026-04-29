"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Zap } from "lucide-react";
import { fastapiArticles } from "@/content/production-apis/fastapi/registry";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

const CONSTRAINT_ARC = [
  { label: "Baseline", icon: "🔧" },
  { label: "Concurrency", icon: "👥" },
  { label: "Slow Queries", icon: "🐢" },
  { label: "Auth", icon: "🔐" },
  { label: "Observability", icon: "🔭" },
  { label: "Security", icon: "🛡️" },
  { label: "Latency", icon: "⚡" },
  { label: "Deployments", icon: "🚢" },
  { label: "Resilience", icon: "🧯" },
  { label: "10k RPS", icon: "🚀" },
];

export default function FastAPISeriesPage() {
  const totalMinutes = fastapiArticles.reduce((sum, a) => sum + a.estimatedMinutes, 0);
  const totalHours = Math.round(totalMinutes / 60);

  return (
    <main className="max-w-4xl mx-auto px-6 lg:px-8 py-8 space-y-10">
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={spring}
      >
        <Link
          href="/blog/production-apis"
          className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All stacks</span>
        </Link>
      </motion.div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.05 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚙️</span>
          <span
            className="text-[10px] uppercase tracking-wider font-medium px-1.5 py-0.5 rounded"
            style={{ color: "#009688", backgroundColor: "#00968818" }}
          >
            FastAPI
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Production-Ready APIs
        </h1>
        <p className="text-[14px] text-muted-foreground max-w-2xl leading-relaxed">
          Build a FastAPI task management API from naive first principles to a system that
          handles 10,000 requests per second. Each article introduces one new constraint,
          breaks the current code, and shows the exact fix.
        </p>
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            {fastapiArticles.length} articles
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            ~{totalHours}h read
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...spring, delay: 0.1 }}
      >
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={spring}>
          <Link
            href={`/blog/production-apis/fastapi/${fastapiArticles[0].slug}`}
            className="inline-flex items-center gap-2 text-[13px] font-medium text-primary-foreground bg-primary hover:bg-primary/90 px-5 py-2.5 rounded-lg shadow-sm cursor-pointer transition-all duration-100"
          >
            Start from the baseline
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...spring, delay: 0.13 }}
        className="bg-card border border-border rounded-xl p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px] font-semibold">The constraint arc</span>
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {CONSTRAINT_ARC.map((step, i) => (
            <div key={step.label} className="flex items-center gap-1">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <span>{step.icon}</span>
                <span>{step.label}</span>
              </span>
              {i < CONSTRAINT_ARC.length - 1 && (
                <ArrowRight className="w-3 h-3 text-border flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      <div className="h-px bg-border" />

      <div className="space-y-3">
        <motion.h2
          className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...spring, delay: 0.18 }}
        >
          Articles
        </motion.h2>

        <div className="space-y-2">
          {fastapiArticles.map((article, index) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.2 + index * 0.03 }}
            >
              <Link
                href={`/blog/production-apis/fastapi/${article.slug}`}
                className="flex items-center gap-4 p-3 rounded-lg border border-border/60 hover:border-primary/30 hover:bg-secondary/30 transition-all duration-200 group cursor-pointer"
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-md bg-secondary flex items-center justify-center text-[11px] font-medium text-muted-foreground tabular-nums">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-foreground group-hover:text-primary transition-colors">
                      {article.title}
                    </span>
                    <span className="text-base">{article.icon}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {article.subtitle}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground flex-shrink-0">
                  <span
                    className="hidden sm:block font-mono px-1.5 py-0.5 rounded text-[9px]"
                    style={{ color: "#009688", backgroundColor: "#00968812" }}
                  >
                    {article.constraint}
                  </span>
                  <Clock className="w-3 h-3" />
                  <span className="tabular-nums">{article.estimatedMinutes}m</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
