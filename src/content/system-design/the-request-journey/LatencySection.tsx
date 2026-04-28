"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

type HopLatency = {
  label: string;
  icon: string;
  min: number;
  max: number;
  optimized: number;
  color: string;
  tip: string;
};

const HOPS: HopLatency[] = [
  { label: "DNS Lookup",       icon: "📡", min: 1,   max: 50,  optimized: 0,   color: "bg-blue-400",   tip: "Cache hit (browser or OS cache) = 0ms" },
  { label: "TCP + TLS",        icon: "🔗", min: 30,  max: 150, optimized: 20,  color: "bg-violet-400", tip: "HTTP/3 + nearby CDN PoP reduces to ~20ms" },
  { label: "Network transit",  icon: "🌐", min: 1,   max: 100, optimized: 5,   color: "bg-sky-400",    tip: "CDN edge close to user: ~5ms" },
  { label: "Load balancer",    icon: "⚖️", min: 0,   max: 2,   optimized: 0,   color: "bg-teal-400",   tip: "Modern LBs add <1ms overhead" },
  { label: "App server",       icon: "🖥️", min: 5,   max: 100, optimized: 5,   color: "bg-primary",    tip: "Cache hit on Redis: ~1ms. Auth + logic: ~5ms" },
  { label: "Database query",   icon: "🗄️", min: 1,   max: 500, optimized: 2,   color: "bg-orange-400", tip: "Indexed query with warm cache: ~2ms" },
  { label: "Response transit", icon: "📦", min: 1,   max: 100, optimized: 5,   color: "bg-sky-400",    tip: "Same as request transit, often compressed" },
];

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
      <motion.div
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  );
}

export function LatencySection() {
  const [showOptimized, setShowOptimized] = useState(false);

  const hops = HOPS;
  const totalMin = hops.reduce((s, h) => s + h.min, 0);
  const totalMax = hops.reduce((s, h) => s + h.max, 0);
  const totalOpt = hops.reduce((s, h) => s + h.optimized, 0);
  const barMax = showOptimized ? totalOpt : totalMax;

  return (
    <section>
      <h2 id="latency-budget" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        The Latency Budget
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        System design is fundamentally about latency budgets. Every hop in the request journey
        costs time. The question is: how much does each hop cost, and where can you recover it?
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Toggle between the typical worst-case budget and what's achievable with modern infrastructure.
        The difference — 700ms vs 37ms — illustrates exactly why companies invest heavily in CDNs,
        caching, and database optimization.
      </p>

      {/* Toggle */}
      <div className="bg-card border border-border rounded-xl p-5 mb-6 not-prose">
        <div className="flex items-center justify-between mb-5">
          <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
            Latency Budget Breakdown
          </span>
          <div className="flex items-center rounded-lg bg-secondary p-0.5 text-[10px] font-medium">
            {(["Unoptimized", "Optimized"] as const).map((label, i) => (
              <button
                key={label}
                onClick={() => setShowOptimized(i === 1)}
                className={`px-2.5 py-1 rounded-md transition-all duration-200 cursor-pointer ${
                  showOptimized === (i === 1)
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {hops.map((hop) => {
            const value = showOptimized ? hop.optimized : hop.max;
            const displayMax = showOptimized ? totalOpt + 10 : totalMax;
            return (
              <div key={hop.label} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm w-5 flex-shrink-0">{hop.icon}</span>
                  <span className="text-[11px] font-medium text-foreground flex-1">{hop.label}</span>
                  <span className="text-[10px] font-mono text-muted-foreground tabular-nums w-12 text-right">
                    {showOptimized ? `~${hop.optimized}ms` : `${hop.min}–${hop.max}ms`}
                  </span>
                </div>
                <div className="flex items-center gap-2 pl-7">
                  <Bar value={value} max={displayMax} color={hop.color} />
                </div>
                {showOptimized && hop.optimized < hop.max && (
                  <p className="text-[9px] text-muted-foreground pl-7">{hop.tip}</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
          <span className="text-[11px] font-medium text-foreground">Total round trip</span>
          <motion.span
            key={showOptimized ? "opt" : "unopt"}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={spring}
            className="text-[18px] font-bold text-primary tabular-nums"
          >
            {showOptimized ? `~${totalOpt}ms` : `${totalMin}–${totalMax}ms`}
          </motion.span>
        </div>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Numbers every engineer should know</h3>

      <div className="grid gap-2 sm:grid-cols-2 mb-6">
        {[
          { value: "0ms", label: "DNS cache hit (browser)" },
          { value: "~1ms", label: "Redis cache lookup" },
          { value: "~5ms", label: "Same-region DB query (indexed)" },
          { value: "~70ms", label: "NY → London (speed of light limit)" },
          { value: "100ms", label: "Perceptible delay threshold" },
          { value: "300ms", label: "Noticeable lag — users frustrated" },
          { value: "1000ms", label: "Users leave for slower completion" },
          { value: "~180ms", label: "NY → Sydney (speed of light limit)" },
        ].map(({ value, label }) => (
          <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
            <span className="text-[14px] font-bold font-mono text-primary tabular-nums min-w-[60px]">{value}</span>
            <span className="text-[11px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-foreground/70">
          The speed-of-light latency floor is <strong>physical</strong> — no software optimization can
          beat it. This is why CDNs, edge computing, and regional replication exist. The goal is to serve
          from a location close enough that the physics works in your favor.
        </p>
      </div>
    </section>
  );
}
