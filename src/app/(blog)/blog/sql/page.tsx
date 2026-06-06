"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock, CheckCircle2 } from "lucide-react";
import { sqlArticles } from "@/content/sql/registry";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

export default function SQLSeriesPage() {
  const totalMinutes = sqlArticles.reduce((sum, a) => sum + a.estimatedMinutes, 0);
  const totalHours = Math.round(totalMinutes / 60);

  return (
    <main className="max-w-4xl mx-auto px-6 lg:px-8 py-8 space-y-10">
      {/* Hero */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">🗄️</span>
          <span className="text-[10px] uppercase tracking-wider font-medium text-primary">
            SQL
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          SQL from{" "}
          <span className="text-primary">First Principles</span>
        </h1>
        <p className="text-[14px] text-muted-foreground max-w-2xl leading-relaxed">
          Think in sets, not loops. From SELECT to window functions, each article
          builds precise understanding of how SQL actually works — not just the syntax,
          but why queries behave the way they do.
        </p>
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            {sqlArticles.length} articles
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            ~{totalHours}h read
          </span>
        </div>
      </motion.div>

      <div className="h-px bg-border" />

      {/* What you'll learn */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...spring, delay: 0.15 }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
      >
        {[
          { icon: "🔍", label: "SELECT & WHERE" },
          { icon: "🔗", label: "JOINs" },
          { icon: "📊", label: "Aggregations" },
          { icon: "🪟", label: "Window Functions" },
          { icon: "⚡", label: "Indexes" },
          { icon: "🔬", label: "Query Optimization" },
        ].map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50">
            <span className="text-base">{icon}</span>
            <span className="text-[11px] font-medium text-foreground/80">{label}</span>
          </div>
        ))}
      </motion.div>

      {/* Article list */}
      <div className="space-y-3">
        <motion.h2
          className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...spring, delay: 0.2 }}
        >
          Articles
        </motion.h2>

        <div className="space-y-2">
          {sqlArticles.map((article, index) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.22 + index * 0.04 }}
            >
              <Link
                href={`/blog/sql/${article.slug}`}
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
                  <Clock className="w-3 h-3" />
                  <span className="tabular-nums">{article.estimatedMinutes}m</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        className="flex items-center justify-center gap-4 py-8 border-t border-border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...spring, delay: 0.5 }}
      >
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span>Articles free forever</span>
        </div>
        <div className="text-border">·</div>
        <Link href="/signup" className="text-[12px] font-medium text-primary hover:underline cursor-pointer">
          Practice on Codetail →
        </Link>
      </motion.div>
    </main>
  );
}
