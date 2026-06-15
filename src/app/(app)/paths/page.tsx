"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPaths, type PathResponse } from "@/lib/api/paths";
import { StackLogo } from "@/components/brand/stack-logos";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };
const springFast = { type: "spring" as const, stiffness: 400, damping: 25 };

const sh = "overflow-hidden before:absolute before:inset-0 before:translate-x-[-100%] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:animate-[shimmer_1.5s_infinite]";

const COMING_SOON = [
  {
    stack: "fastapi",
    title: "FastAPI",
    description: "Build lightning-fast Python APIs with automatic docs, type safety, and async support.",
    topics: ["Routing", "Pydantic", "Async", "Auth", "Middleware"],
  },
  {
    stack: "go",
    title: "Golang",
    description: "Systems-level performance meets modern simplicity. Goroutines, channels, and production Go.",
    topics: ["Goroutines", "Channels", "HTTP", "Testing", "Modules"],
  },
];

export default function PathsPage() {
  const { data: paths, isLoading } = useQuery({
    queryKey: ["paths"],
    queryFn: () => getPaths(),
  });

  const list = Array.isArray(paths) ? paths : [];

  return (
    <main className="max-w-5xl mx-auto px-6 lg:px-8 py-10 space-y-8">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="space-y-2"
      >
        <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50">
          Curated curriculum
        </p>
        <h1 className="text-[30px] font-black tracking-tight leading-none">Learning Paths</h1>
        <p className="text-[13px] text-muted-foreground max-w-sm leading-relaxed">
          Structured tracks to take you from fundamentals to production-ready code.
        </p>
      </motion.div>

      {/* ── Content ────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="space-y-4">
          <div className={`relative rounded-xl bg-muted h-36 ${sh}`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`relative rounded-xl bg-muted h-40 ${sh}`} />
            ))}
          </div>
        </div>

      ) : !list.length ? (
        <div className="py-20 text-center">
          <p className="text-[13px] text-muted-foreground">No learning paths available yet.</p>
        </div>

      ) : (
        <div className="space-y-4">
          {/* Featured — first path full-width */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.02 }}
          >
            <FeaturedCard path={list[0]} />
          </motion.div>

          {/* Remaining live + coming soon — 3-col grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.slice(1).map((path, i) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: 0.06 + i * 0.05 }}
              >
                <PathCard path={path} />
              </motion.div>
            ))}
            {COMING_SOON.map((cs, i) => (
              <motion.div
                key={cs.stack}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: 0.06 + (list.slice(1).length + i) * 0.05 }}
              >
                <ComingSoonCard {...cs} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

/* ── Featured card ─────────────────────────────────────────────────────── */

function FeaturedCard({ path }: { path: PathResponse }) {
  return (
    <Link href={`/paths/${path.slug}`} className="block group cursor-pointer">
      <motion.div
        transition={springFast}
        className="relative rounded-xl bg-card/50 p-6 transition-all duration-500 hover:shadow-md overflow-hidden"
      >
        {/* Top teal accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-primary/70 via-primary/25 to-transparent" />
        {/* Hover gradient wash */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

        <div className="relative flex items-start gap-5">
          {/* Logo */}
          <StackLogo stack={path.stack} className="w-12 h-12 shrink-0 mt-0.5" />

          {/* Body */}
          <div className="flex-1 min-w-0 space-y-3">
            <h2 className="text-[18px] font-bold tracking-tight">{path.title}</h2>

            <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-2 max-w-xl">
              {path.description}
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[11px] text-muted-foreground font-mono tabular-nums">
                {path.problem_count} problems
              </span>
              <span className="text-muted-foreground/30 text-[10px]">·</span>
              <span className="text-[11px] text-muted-foreground capitalize">{path.stack}</span>
              <div className="flex items-center gap-1 flex-wrap">
                {path.topics.slice(0, 5).map((t) => (
                  <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">
                    {t}
                  </span>
                ))}
                {path.topics.length > 5 && (
                  <span className="text-[10px] text-muted-foreground/50">+{path.topics.length - 5}</span>
                )}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 -translate-x-1.5 group-hover:translate-x-0 transition-all duration-300 pt-0.5 shrink-0">
            <span className="text-[12px] font-semibold">Start</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

/* ── Coming soon card ──────────────────────────────────────────────────── */

function ComingSoonCard({ stack, title, description, topics }: { stack: string; title: string; description: string; topics: string[] }) {
  return (
    <div className="relative flex flex-col rounded-xl bg-card/50 p-5 overflow-hidden h-full opacity-60 select-none">
      <div className="absolute inset-0 bg-linear-to-br from-muted/30 to-transparent pointer-events-none" />

      <div className="relative flex flex-col gap-4 flex-1">
        <div className="flex items-start justify-between gap-3">
          <StackLogo stack={stack} className="w-9 h-9 shrink-0 grayscale" />
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-border bg-muted/60 text-muted-foreground/70 whitespace-nowrap">
            Coming Soon
          </span>
        </div>

        <div className="flex-1 space-y-1.5">
          <h3 className="text-[14px] font-semibold tracking-tight leading-snug">{title}</h3>
          <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{description}</p>
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          {topics.slice(0, 3).map((t) => (
            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted/50 text-muted-foreground/60">
              {t}
            </span>
          ))}
          {topics.length > 3 && (
            <span className="text-[10px] text-muted-foreground/40">+{topics.length - 3}</span>
          )}
        </div>

        <div className="border-t border-border/40 pt-3 mt-auto">
          <span className="text-[11px] text-muted-foreground/50 capitalize">{stack}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Regular path card ─────────────────────────────────────────────────── */

function PathCard({ path }: { path: PathResponse }) {
  return (
    <Link href={`/paths/${path.slug}`} className="block group cursor-pointer h-full">
      <motion.div
        transition={springFast}
        className="relative flex flex-col rounded-xl bg-card/50 p-5 transition-all duration-500 hover:shadow-sm overflow-hidden h-full"
      >
        <div className="absolute inset-0 bg-linear-to-br from-primary/2 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

        <div className="relative flex flex-col gap-4 flex-1">
          {/* Header */}
          <StackLogo stack={path.stack} className="w-9 h-9 shrink-0" />

          {/* Title + desc */}
          <div className="flex-1 space-y-1.5">
            <h3 className="text-[14px] font-semibold tracking-tight leading-snug">{path.title}</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{path.description}</p>
          </div>

          {/* Topics */}
          <div className="flex items-center gap-1 flex-wrap">
            {path.topics.slice(0, 3).map((t) => (
              <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">
                {t}
              </span>
            ))}
            {path.topics.length > 3 && (
              <span className="text-[10px] text-muted-foreground/50">+{path.topics.length - 3}</span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border/60 pt-3 mt-auto">
            <span className="text-[11px] text-muted-foreground font-mono tabular-nums">
              {path.problem_count} problems
              <span className="mx-1.5 opacity-40">·</span>
              <span className="capitalize">{path.stack}</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
