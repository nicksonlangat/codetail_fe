"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { pythonArticles } from "@/content/python/registry";
import type { ArticleMeta } from "@/content/python/registry";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

type ArticleContentProps = {
  article: ArticleMeta;
  prev: ArticleMeta | null;
  next: ArticleMeta | null;
  children: React.ReactNode;
};

export function ArticleContent({ article, prev, next, children }: ArticleContentProps) {
  return (
    <>
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={spring}
        className="mb-6"
      >
        <Link
          href="/blog/python"
          className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Python articles</span>
        </Link>
      </motion.div>

      {/* Article header */}
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.05 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{article.icon}</span>
          <span className="text-[10px] uppercase tracking-wider font-medium text-primary">
            Article {article.order} of {pythonArticles.length}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          {article.title}
        </h1>
        <p className="text-[14px] text-muted-foreground mb-4">
          {article.subtitle}
        </p>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.estimatedMinutes} min read
          </span>
        </div>
      </motion.header>

      {/* Article content */}
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...spring, delay: 0.1 }}
        className="prose prose-slate dark:prose-invert max-w-none"
      >
        {children}
      </motion.article>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...spring, delay: 0.2 }}
        className="flex items-center justify-between mt-12 pt-8 border-t border-border"
      >
        {prev ? (
          <Link
            href={`/blog/python/${prev.slug}`}
            className="group flex items-center gap-2 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>← {prev.title}</span>
          </Link>
        ) : (
          <div />
        )}
        {next && (
          <Link
            href={`/blog/python/${next.slug}`}
            className="group flex items-center gap-2 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>{next.title} →</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </motion.nav>
    </>
  );
}

// Need to import Clock here since we're in client component
import { Clock } from "lucide-react";