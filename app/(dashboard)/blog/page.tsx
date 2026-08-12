"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Boxes, Brain, Clock, Compass, LibraryBig, Network, Search, ShieldAlert, Sparkles, WandSparkles } from "lucide-react";
import { RingProgress } from "@/components/ui/ring-progress";
import { Input } from "@/components/ui/input";
import { PythonLogo } from "@/components/brand/stack-logos";
import { pythonArticles } from "@/content/python/registry";
import { systemDesignArticles } from "@/content/system-design/registry";
import { llmsFromScratchArticles } from "@/content/llms-from-scratch/registry";
import { webSecurityArticles } from "@/content/web-security/registry";
import { aiEngineeringArticles } from "@/content/ai-engineering/registry";
import { oopRemasterArticles } from "@/content/oop-remaster/registry";
import { modernPythonArticles } from "@/content/modern-python/registry";
import type { ArticleMeta } from "@/content/python/registry";

const ENTRANCE = { type: "spring" as const, stiffness: 300, damping: 30 };

type Series = {
  slug: string;
  title: string;
  subtitle: string;
  blurb: string;
  basePath: string;
  icon: React.ComponentType<{ className?: string }>;
  articles: ArticleMeta[];
};

const SERIES: Series[] = [
  {
    slug: "python",
    title: "Python",
    subtitle: "From First Principles",
    blurb:
      "Every fundamental concept, taught through analogies and hands-on demos instead of a syntax dump.",
    basePath: "/blog/python",
    icon: PythonLogo,
    articles: pythonArticles,
  },
  {
    slug: "system-design",
    title: "System Design",
    subtitle: "From First Principles",
    blurb:
      "How real systems are built at scale, through interactive diagrams and worked trade-offs, not buzzwords.",
    basePath: "/blog/system-design",
    icon: Network,
    articles: systemDesignArticles,
  },
  {
    slug: "llms-from-scratch",
    title: "LLMs",
    subtitle: "From Scratch",
    blurb:
      "A large language model built up from next-token prediction to a working GPT you code yourself.",
    basePath: "/blog/llms-from-scratch",
    icon: Brain,
    articles: llmsFromScratchArticles,
  },
  {
    slug: "web-security",
    title: "Web Security",
    subtitle: "From Exploit to Fix",
    blurb:
      "Every major vulnerability class shown breaking real code, then fixed. Ends in a consolidated OWASP Top 10 checklist.",
    basePath: "/blog/web-security",
    icon: ShieldAlert,
    articles: webSecurityArticles,
  },
  {
    slug: "ai-engineering",
    title: "AI Engineering",
    subtitle: "From Prompt to Production",
    blurb:
      "Building real products on hosted models: prompting, RAG, agents, evals, cost, and shipping, not a LangChain tutorial.",
    basePath: "/blog/ai-engineering",
    icon: WandSparkles,
    articles: aiEngineeringArticles,
  },
  {
    slug: "oop-remaster",
    title: "OOP Remaster",
    subtitle: "Object-Oriented Python Rebuilt",
    blurb:
      "Eight articles rebuilding OOP from first principles. Objects, the four pillars, magic methods, and modern patterns. No prior OOP knowledge assumed.",
    basePath: "/blog/oop-remaster",
    icon: Boxes,
    articles: oopRemasterArticles,
  },
  {
    slug: "modern-python",
    title: "Modern Python",
    subtitle: "Write It the Way It Was Meant",
    blurb:
      "Every article is a before/after: the pattern you wrote in 3.5-3.8, and the cleaner version available now. Type hints, pattern matching, dataclasses, and the stdlib you are not using yet.",
    basePath: "/blog/modern-python",
    icon: Sparkles,
    articles: modernPythonArticles,
  },
];

type FlatArticle = ArticleMeta & { seriesTitle: string; basePath: string; Icon: React.ComponentType<{ className?: string }> };

const FLAT_ARTICLES: FlatArticle[] = SERIES.flatMap((s) =>
  s.articles.map((a) => ({ ...a, seriesTitle: `${s.title} ${s.subtitle}`, basePath: s.basePath, Icon: s.icon }))
);

function hours(articles: ArticleMeta[]) {
  return Math.round(articles.reduce((sum, a) => sum + a.estimatedMinutes, 0) / 60);
}

function topTags(articles: ArticleMeta[], n: number) {
  const seen: string[] = [];
  for (const a of articles) {
    for (const t of a.tags) {
      if (!seen.includes(t)) seen.push(t);
      if (seen.length >= n) return seen;
    }
  }
  return seen;
}

function LibrarySearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return FLAT_ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.subtitle.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [query]);

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setQuery("");
            setOpen(false);
          }
        }}
        placeholder={`Search ${FLAT_ARTICLES.length} articles across every series`}
        className="pl-10"
      />
      <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-brand-text-subtle" />

      {open && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 z-20 rounded-xl border border-brand-border bg-white shadow-xl p-2 max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-brand-text-muted">
              No articles match &ldquo;{query}&rdquo;.
            </p>
          ) : (
            results.map((a) => (
              <Link
                key={`${a.basePath}-${a.slug}`}
                href={`${a.basePath}/${a.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-500 hover:bg-brand-surface/70 group"
              >
                <span className="size-7 rounded-md bg-brand-primary/10 flex items-center justify-center shrink-0">
                  <a.Icon className="size-3.5 text-brand-primary" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-text truncate transition-all duration-500 group-hover:text-brand-primary">
                    {a.title}
                  </p>
                  <p className="text-[11px] text-brand-text-muted truncate">{a.subtitle}</p>
                </div>
                <span className="text-[10px] uppercase tracking-wide text-brand-text-subtle shrink-0">
                  {a.seriesTitle}
                </span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function BlogPage() {
  const totalArticles = FLAT_ARTICLES.length;
  const totalHours = SERIES.reduce((sum, s) => sum + hours(s.articles), 0);

  return (
    <div className="w-full max-w-6xl px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={ENTRANCE}
        className="flex items-start justify-between gap-6 flex-wrap"
      >
        <div className="max-w-xl">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="size-8 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
              <LibraryBig className="size-4 text-brand-primary" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
              Codetail Library
            </span>
          </div>
          <h1 className="text-[28px] font-bold tracking-tight text-brand-text leading-tight">
            Deep dives that start from <span className="text-brand-primary">first principles</span>.
          </h1>
          <p className="mt-3 text-sm text-brand-text-muted leading-6">
            Exhaustive, code-first series for engineers who want to understand the machinery, not
            just pass an interview. No prior background assumed, nothing hand-waved.
          </p>
        </div>

        <div className="flex gap-3 shrink-0">
          {[
            { icon: LibraryBig, value: SERIES.length, label: "Series" },
            { icon: BookOpen, value: totalArticles, label: "Articles" },
            { icon: Clock, value: `${totalHours}h`, label: "Content" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 border border-brand-border rounded-xl px-5 py-3"
            >
              <div className="size-9 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
                <s.icon className="size-4 text-brand-primary" />
              </div>
              <div>
                <p className="text-lg font-bold leading-none text-brand-text">{s.value}</p>
                <p className="text-xs text-brand-text-muted whitespace-nowrap">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...ENTRANCE, delay: 0.05 }}
        className="mt-8"
      >
        <LibrarySearch />
      </motion.div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERIES.map((s, i) => (
          <motion.div
            key={s.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...ENTRANCE, delay: 0.1 + i * 0.05 }}
          >
            <Link
              href={s.basePath}
              className="group flex flex-col h-full rounded-2xl border border-brand-border bg-white p-6 cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:border-brand-primary/30 hover:shadow-lg"
            >
              <div className="flex items-start justify-between mb-5">
                <span className="size-11 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                  <s.icon className="size-5 text-brand-primary" />
                </span>
                <div className="relative size-9 shrink-0">
                  <RingProgress value={0} size={36} stroke={3} inView />
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-semibold text-brand-text-muted">
                    0%
                  </span>
                </div>
              </div>

              <h2 className="text-lg font-bold text-brand-text leading-tight">{s.title}</h2>
              <p className="text-[13px] text-brand-primary font-medium mt-0.5">{s.subtitle}</p>
              <p className="text-[13px] text-brand-text-muted leading-6 mt-3 flex-1">{s.blurb}</p>

              <div className="flex flex-wrap gap-1.5 mt-4">
                {topTags(s.articles, 4).map((t) => (
                  <span
                    key={t}
                    className="text-[10px] bg-brand-surface text-brand-text-muted px-2 py-0.5 rounded-md"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-5 pt-5 border-t border-brand-border">
                <div className="flex items-center gap-3 text-[11px] text-brand-text-subtle">
                  <span className="flex items-center gap-1">
                    <BookOpen className="size-3.5" /> {s.articles.length}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" /> ~{hours(s.articles)}h
                  </span>
                </div>
                <span className="flex items-center gap-1 text-sm font-medium text-brand-primary">
                  Start
                  <ArrowRight className="size-3.5 transition-all duration-500 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...ENTRANCE, delay: 0.25 }}
        className="mt-6 flex items-center gap-3 rounded-xl border border-dashed border-brand-border px-5 py-4"
      >
        <span className="size-8 rounded-lg bg-brand-surface flex items-center justify-center shrink-0">
          <Compass className="size-4 text-brand-text-subtle" />
        </span>
        <p className="text-[13px] text-brand-text-muted">
          More series are on the way. We&apos;re always writing the next one.
        </p>
      </motion.div>
    </div>
  );
}
