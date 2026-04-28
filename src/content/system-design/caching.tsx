import { WhatIsCachingSection } from "./caching/WhatIsCachingSection";
import { EvictionSection } from "./caching/EvictionSection";
import { WriteStrategiesSection } from "./caching/WriteStrategiesSection";
import { InvalidationSection } from "./caching/InvalidationSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "why-caching-matters", title: "Why Caching Matters" },
  { id: "eviction-policies", title: "Eviction Policies" },
  { id: "write-strategies", title: "Write Strategies" },
  { id: "cache-invalidation", title: "Cache Invalidation" },
  { id: "summary", title: "Summary" },
];

export default function CachingArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Your database can handle a thousand queries per second. Your cache can handle a million.
          That gap is why caching is the single highest-leverage optimization in most systems.
          A cache hit skips the database entirely: no connection overhead, no disk I/O, no query
          planning. The result is already in memory, milliseconds away.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          But caching is not just about speed. Done wrong, it introduces silent correctness bugs:
          users reading stale data, inconsistencies between what the database knows and what the
          cache serves, and thundering-herd failures when a popular key expires. The mechanics
          of caching are simple. The design decisions are hard.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          This article covers the memory hierarchy that makes caching effective, the eviction
          policies that determine what stays and what goes, the write strategies that keep
          your cache and database in sync, and the invalidation patterns that prevent stale data.
        </p>
      </section>

      <WhatIsCachingSection />
      <EvictionSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <WriteStrategiesSection />
      <InvalidationSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "⚡",
              label: "Every cache hit skips the database",
              desc: "RAM access is ~100 ns. A database round-trip is 1–100 ms. Caching a hot query provides a 10,000x latency improvement.",
            },
            {
              icon: "📐",
              label: "Cache layers compound",
              desc: "Browser cache, CDN, in-memory app cache, Redis, and DB buffer pool all stack. Design caching as a hierarchy, not a single layer.",
            },
            {
              icon: "🔄",
              label: "LRU is the right default eviction policy",
              desc: "Recency predicts future access better than frequency for most web workloads. Change to LFU only after profiling shows a stable hot set.",
            },
            {
              icon: "✍️",
              label: "Cache-aside is the safest write strategy",
              desc: "Write to the database first. On success, delete the cache key. The next read repopulates it. Simple, correct, and resilient to cache failures.",
            },
            {
              icon: "⏱️",
              label: "TTL is a correctness budget",
              desc: "Set it to the maximum staleness each resource can tolerate. A product price and a static asset have completely different acceptable windows.",
            },
            {
              icon: "🚨",
              label: "Design invalidation before population",
              desc: "Stale data served silently is worse than a slow cache miss. Decide how cache keys get invalidated on writes before you decide how they get populated.",
            },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="flex gap-3 p-4 bg-card border border-border rounded-xl">
              <span className="text-lg flex-shrink-0">{icon}</span>
              <div>
                <p className="text-[13px] font-semibold mb-0.5">{label}</p>
                <p className="text-[12px] text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
