"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

/* ── Language icons (inline SVGs for crisp rendering) ── */

function PythonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M12 2c-1.7 0-3.3.1-4.6.4C5.1 2.9 4 4.3 4 6v2.5h8v1H5.2C3.1 9.5 1.3 11.2 1 14c-.3 2.1.3 4.3 2 5.6.5.4 1.1.7 1.8.9 1 .3 2.3.5 3.7.5h1V18c0-1.7 1.3-3 3-3h4c1.7 0 3-1.3 3-3V6c0-1.7-1.5-3.2-3.5-3.6C15.3 2.1 13.7 2 12 2zm-2.5 2.5a1 1 0 110 2 1 1 0 010-2z"
        fill="#3776AB"
      />
      <path
        d="M12 22c1.7 0 3.3-.1 4.6-.4 2.3-.5 3.4-1.9 3.4-3.6v-2.5h-8v-1h6.8c2.1 0 3.9-1.7 4.2-4.5.3-2.1-.3-4.3-2-5.6-.5-.4-1.1-.7-1.8-.9-1-.3-2.3-.5-3.7-.5h-1V6c0 1.7-1.3 3-3 3H7.5c-1.7 0-3 1.3-3 3v6c0 1.7 1.5 3.2 3.5 3.6 1.7.3 3.3.4 5 .4zm2.5-2.5a1 1 0 110-2 1 1 0 010 2z"
        fill="#FFD43B"
      />
    </svg>
  );
}

function SQLIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function DjangoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M7 2h4v16c-2.1-.2-3.6-.8-4.7-1.7C4.8 15 4 13.1 4 10.5c0-2.3.7-4 2-5.2.5-.4 1-1 1-1.3V2zm0 7.3c0 1.8.4 3 1.2 3.6.4.3.9.5 1.5.6V6.2c-.6.2-1.1.5-1.5 1-.7.8-1.2 2-1.2 3.1zM14 2h3v11h-3V2zm0 14h3v3h-3v-3z"
        fill="#092E20"
      />
    </svg>
  );
}

function FastAPIIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <circle cx="12" cy="12" r="10" stroke="#009688" strokeWidth="1.5" />
      <path d="M13 6l-5 7h4l-1 5 5-7h-4l1-5z" fill="#009688" />
    </svg>
  );
}

/* ── Path data ── */

type LearningPath = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  articleCount: number;
  estimatedHours: number;
  topics: string[];
  status: "ready" | "coming-soon";
  accentClass: string;
};

const paths: LearningPath[] = [
  {
    slug: "python",
    title: "Python",
    subtitle: "From First Principles",
    description:
      "Master Python from the ground up. Every concept explained with analogies, interactive demos, and exhaustive real-world patterns. Not a syntax reference — a deep understanding.",
    icon: PythonIcon,
    articleCount: 15,
    estimatedHours: 8,
    topics: [
      "Variables & Types",
      "Strings",
      "Numbers",
      "Lists",
      "Dictionaries",
      "Functions",
      "Classes",
      "Error Handling",
    ],
    status: "ready",
    accentClass: "text-[#3776AB]",
  },
  {
    slug: "sql",
    title: "SQL",
    subtitle: "Think in Sets",
    description:
      "Learn to think in sets, not loops. From SELECT to window functions, with interactive table visualizations that make joins and aggregations click.",
    icon: SQLIcon,
    articleCount: 12,
    estimatedHours: 6,
    topics: [
      "SELECT & WHERE",
      "JOINs",
      "Aggregations",
      "Subqueries",
      "Window Functions",
      "Indexes",
    ],
    status: "coming-soon",
    accentClass: "text-[#336791]",
  },
  {
    slug: "django",
    title: "Django",
    subtitle: "The Web Framework for Perfectionists",
    description:
      "Build web applications the right way. Models, views, templates, the ORM, and the patterns that make Django projects maintainable at scale.",
    icon: DjangoIcon,
    articleCount: 14,
    estimatedHours: 10,
    topics: [
      "Models & ORM",
      "Views & URLs",
      "Templates",
      "Forms",
      "Authentication",
      "REST Framework",
    ],
    status: "coming-soon",
    accentClass: "text-[#092E20]",
  },
  {
    slug: "fastapi",
    title: "FastAPI",
    subtitle: "Modern Python APIs",
    description:
      "Build fast, modern APIs with automatic validation, documentation, and async support. Type hints as your superpower.",
    icon: FastAPIIcon,
    articleCount: 10,
    estimatedHours: 5,
    topics: [
      "Path Operations",
      "Pydantic Models",
      "Dependency Injection",
      "Async",
      "Authentication",
      "Testing",
    ],
    status: "coming-soon",
    accentClass: "text-[#009688]",
  },
];

/* ── Path Card ── */

function PathCard({ path, index }: { path: LearningPath; index: number }) {
  const Icon = path.icon;
  const isReady = path.status === "ready";

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: index * 0.06 }}
    >
      <motion.div
        whileHover={isReady ? { y: -3 } : undefined}
        transition={spring}
        className={`relative w-full rounded-xl border bg-card p-6 transition-all duration-500 overflow-hidden ${
          isReady
            ? "border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 cursor-pointer group"
            : "border-border/60 opacity-60"
        }`}
      >
        {/* Coming soon overlay */}
        {!isReady && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/60 backdrop-blur-[1px] rounded-xl">
            <Badge variant="secondary" className="text-[11px] px-3 py-1">
              Coming Soon
            </Badge>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold tracking-tight">
                {path.title}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                {path.subtitle}
              </p>
            </div>
          </div>
          {isReady && (
            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-500 flex-shrink-0 mt-1" />
          )}
        </div>

        {/* Description */}
        <p className="text-[12px] text-muted-foreground/80 leading-relaxed mb-4">
          {path.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            <span className="font-mono tabular-nums">{path.articleCount}</span> articles
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            ~{path.estimatedHours}h read
          </span>
        </div>

        {/* Topic tags */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {path.topics.map((topic) => (
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
      <Link href={`/blog/${path.slug}`} className="block">
        {card}
      </Link>
    );
  }

  return card;
}

/* ── Blog Index Page ── */

export default function BlogPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8 space-y-8">
      {/* Hero */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-[10px] uppercase tracking-wider font-medium text-primary">
            Interactive Learning
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Programming from{" "}
          <span className="text-primary">First Principles</span>
        </h1>
        <p className="text-[14px] text-muted-foreground max-w-2xl leading-relaxed">
          Deep, interactive guides that build real understanding. Every concept
          explained with analogies, visuals, and hands-on demos. Click things.
          Break things. Learn why — not just how.
        </p>
      </motion.div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Section label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...spring, delay: 0.1 }}
      >
        <h2 className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground/50">
          Learning Paths
        </h2>
      </motion.div>

      {/* Path grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paths.map((path, i) => (
          <PathCard key={path.slug} path={path} index={i} />
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        className="text-center py-8 space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...spring, delay: 0.4 }}
      >
        <p className="text-[12px] text-muted-foreground">
          Learn the concepts here, then practice with real challenges on Codetail.
        </p>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={spring}
          className="inline-block"
        >
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-primary-foreground bg-primary hover:bg-primary/90 px-5 py-2.5 rounded-lg shadow-sm cursor-pointer transition-all duration-100"
          >
            Start practicing for free
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
