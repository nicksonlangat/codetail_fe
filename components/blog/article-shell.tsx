"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import type { ArticleMeta } from "@/content/python/registry";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

type ArticleShellProps = {
  article: ArticleMeta;
  totalArticles: number;
  basePath: string;
  backLabel: string;
  prev: ArticleMeta | null;
  next: ArticleMeta | null;
  children: React.ReactNode;
};

export function ArticleShell({
  article, totalArticles, basePath, backLabel, prev, next, children,
}: ArticleShellProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={SPRING}
        className="mb-6"
      >
        <Link
          href={basePath}
          className="inline-flex items-center gap-1.5 text-[11px] text-brand-text-muted hover:text-brand-text transition-all duration-500"
        >
          <ArrowLeft className="size-3.5" />
          <span>{backLabel}</span>
        </Link>
      </motion.div>

      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.05 }}
        className="mb-8"
      >
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-primary">
          Article {article.order} of {totalArticles}
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-text mt-2 mb-2">
          {article.title}
        </h1>
        <p className="text-[14px] text-brand-text-muted mb-4">{article.subtitle}</p>
        <div className="flex items-center gap-3 text-[10px] text-brand-text-subtle">
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {article.estimatedMinutes} min read
          </span>
        </div>
      </motion.header>

      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...SPRING, delay: 0.1 }}
      >
        {children}
      </motion.article>

      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...SPRING, delay: 0.2 }}
        className="flex items-center justify-between mt-12 pt-8 border-t border-brand-border"
      >
        {prev ? (
          <Link
            href={`${basePath}/${prev.slug}`}
            className="group flex items-center gap-2 text-[12px] text-brand-text-muted hover:text-brand-text transition-all duration-500"
          >
            <ArrowLeft className="size-3.5 transition-transform duration-500 group-hover:-translate-x-0.5" />
            <span>{prev.title}</span>
          </Link>
        ) : (
          <div />
        )}
        {next && (
          <Link
            href={`${basePath}/${next.slug}`}
            className="group flex items-center gap-2 text-[12px] text-brand-text-muted hover:text-brand-text transition-all duration-500"
          >
            <span>{next.title}</span>
            <ArrowRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-0.5" />
          </Link>
        )}
      </motion.nav>
    </>
  );
}
