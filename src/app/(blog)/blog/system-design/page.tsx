"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock, CheckCircle2 } from "lucide-react";
import { systemDesignArticles } from "@/content/system-design/registry";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

export default function SystemDesignSeriesPage() {
  const totalMinutes = systemDesignArticles.reduce((sum, a) => sum + a.estimatedMinutes, 0);
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
          <span className="text-2xl">🏛️</span>
          <span className="text-[10px] uppercase tracking-wider font-medium text-primary">
            Learning Path
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          System Design &{" "}
          <span className="text-primary">Architecture</span>
        </h1>
        <p className="text-[14px] text-muted-foreground max-w-2xl leading-relaxed">
          15 deep-dive articles on how large-scale systems are built. Every concept explained
          from first principles — with interactive diagrams, flow charts, and simulators that
          make abstract ideas concrete.
        </p>
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            {systemDesignArticles.length} articles
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            ~{totalHours}h read
          </span>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...spring, delay: 0.1 }}
      >
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={spring}>
          <Link
            href={`/blog/system-design/${systemDesignArticles[0].slug}`}
            className="inline-flex items-center gap-2 text-[13px] font-medium text-primary-foreground bg-primary hover:bg-primary/90 px-5 py-2.5 rounded-lg shadow-sm cursor-pointer transition-all duration-100"
          >
            Start learning
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
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
          { icon: "🌐", label: "Networking & DNS" },
          { icon: "⚖️", label: "Load Balancing" },
          { icon: "⚡", label: "Caching Strategies" },
          { icon: "🗄️", label: "Database Design" },
          { icon: "📨", label: "Async & Queues" },
          { icon: "🛡️", label: "Resilience Patterns" },
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
          {systemDesignArticles.map((article, index) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.22 + index * 0.03 }}
            >
              <Link
                href={`/blog/system-design/${article.slug}`}
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
        transition={{ ...spring, delay: 0.6 }}
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
