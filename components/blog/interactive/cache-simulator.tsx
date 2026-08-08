"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Policy = "lru" | "lfu" | "fifo";
type CacheEntry = { key: string; frequency: number; insertedAt: number; lastUsedAt: number };

const CAPACITY = 5;
const REQUESTS = ["A", "B", "C", "D", "A", "B", "E", "A", "C", "F", "A", "B", "D", "A", "G", "B", "A", "C", "H", "A"];

function evictKey(entries: CacheEntry[], policy: Policy): string {
  if (policy === "lru") {
    return entries.reduce((m, e) => (e.lastUsedAt < m.lastUsedAt ? e : m)).key;
  }
  if (policy === "lfu") {
    const minFreq = Math.min(...entries.map((e) => e.frequency));
    return entries.filter((e) => e.frequency === minFreq).reduce((m, e) => (e.lastUsedAt < m.lastUsedAt ? e : m)).key;
  }
  return entries.reduce((m, e) => (e.insertedAt < m.insertedAt ? e : m)).key;
}

export function CacheSimulator() {
  const [policy, setPolicy] = useState<Policy>("lru");
  const [stepIdx, setStepIdx] = useState(0);
  const [cache, setCache] = useState<CacheEntry[]>([]);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [lastResult, setLastResult] = useState<{
    key: string;
    hit: boolean;
    evicted?: string;
  } | null>(null);

  const nextVictim = cache.length >= CAPACITY ? evictKey(cache, policy) : null;
  const total = hits + misses;
  const hitRate = total > 0 ? Math.round((hits / total) * 100) : 0;
  const displayCache = [...cache].sort((a, b) => a.insertedAt - b.insertedAt);

  function step() {
    if (stepIdx >= REQUESTS.length) return;
    const key = REQUESTS[stepIdx];
    const now = stepIdx;
    const existing = cache.find((e) => e.key === key);

    if (existing) {
      setHits((h) => h + 1);
      setLastResult({ key, hit: true });
      setCache((prev) => prev.map((e) => (e.key === key ? { ...e, frequency: e.frequency + 1, lastUsedAt: now } : e)));
    } else {
      setMisses((m) => m + 1);
      if (cache.length < CAPACITY) {
        setLastResult({ key, hit: false });
        setCache((prev) => [...prev, { key, frequency: 1, insertedAt: now, lastUsedAt: now }]);
      } else {
        const evicted = evictKey(cache, policy);
        setLastResult({ key, hit: false, evicted });
        setCache((prev) => [
          ...prev.filter((e) => e.key !== evicted),
          { key, frequency: 1, insertedAt: now, lastUsedAt: now },
        ]);
      }
    }
    setStepIdx((i) => i + 1);
  }

  function doReset() {
    setStepIdx(0);
    setCache([]);
    setHits(0);
    setMisses(0);
    setLastResult(null);
  }

  function changePolicy(p: Policy) {
    setPolicy(p);
    setStepIdx(0);
    setCache([]);
    setHits(0);
    setMisses(0);
    setLastResult(null);
  }

  return (
    <div className="bg-white border border-brand-border rounded-xl p-5 mb-8 not-prose space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          Eviction Policy Explorer
        </span>
        <div className="flex gap-1 p-1 bg-brand-surface rounded-lg">
          {(["lru", "lfu", "fifo"] as Policy[]).map((p) => (
            <button
              key={p}
              onClick={() => changePolicy(p)}
              className={`px-3 py-1 rounded-md text-[10px] font-medium cursor-pointer outline-none transition-all duration-500 ${
                policy === p ? "bg-white shadow-sm text-brand-text" : "text-brand-text-muted hover:text-brand-text"
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-2">
          Incoming requests ({stepIdx}/{REQUESTS.length} processed)
        </p>
        <div className="flex gap-1 flex-wrap">
          {REQUESTS.map((req, i) => (
            <div
              key={i}
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-mono font-bold transition-all duration-300 ${
                i < stepIdx
                  ? "bg-brand-surface/40 text-brand-text-subtle"
                  : i === stepIdx
                  ? "bg-brand-primary text-white ring-2 ring-brand-primary/30"
                  : "bg-brand-surface text-brand-text-muted"
              }`}
            >
              {req}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle">
            Cache ({cache.length}/{CAPACITY} slots used)
          </p>
          {nextVictim && (
            <p className="text-[9px] text-brand-warning font-mono">
              next eviction: <span className="font-bold">{nextVictim}</span>
            </p>
          )}
        </div>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: CAPACITY }).map((_, slotIdx) => {
            const entry = displayCache[slotIdx];
            const isVictim = entry?.key === nextVictim;
            const isJustHit = lastResult?.hit && lastResult.key === entry?.key;
            const isJustAdded = !lastResult?.hit && lastResult?.key === entry?.key;
            return (
              <motion.div
                key={slotIdx}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`h-[68px] rounded-xl border-2 flex flex-col items-center justify-center text-center p-1.5 transition-all duration-300 ${
                  !entry
                    ? "border-dashed border-brand-border/30 bg-transparent"
                    : isJustHit
                    ? "border-brand-primary/60 bg-brand-primary/10"
                    : isJustAdded
                    ? "border-brand-warning/60 bg-brand-warning/10"
                    : isVictim
                    ? "border-brand-warning/30 bg-brand-warning/5"
                    : "border-brand-border bg-white"
                }`}
              >
                {entry ? (
                  <>
                    <span className="text-[17px] font-black font-mono leading-none text-brand-text">{entry.key}</span>
                    <span className="text-[8px] text-brand-text-muted mt-0.5">
                      {policy === "lfu" ? `freq ${entry.frequency}` : policy === "lru" ? `t=${entry.lastUsedAt}` : `in t=${entry.insertedAt}`}
                    </span>
                    {isVictim && <span className="text-[7px] text-brand-warning font-semibold mt-0.5">next out</span>}
                  </>
                ) : (
                  <span className="text-[9px] text-brand-text-subtle font-mono">empty</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="min-h-[32px] flex items-center">
        <AnimatePresence mode="wait">
          {lastResult && (
            <motion.p
              key={stepIdx}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-[11px] font-mono px-3 py-1.5 rounded-lg ${
                lastResult.hit ? "bg-brand-primary/10 text-brand-primary" : "bg-brand-warning/10 text-brand-warning"
              }`}
            >
              {lastResult.hit
                ? `HIT  "${lastResult.key}" served from cache`
                : lastResult.evicted
                ? `MISS  evicted "${lastResult.evicted}", inserted "${lastResult.key}"`
                : `MISS  inserted "${lastResult.key}" (slot was free)`}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-6 text-[11px]">
        <span className="text-brand-text-muted">
          Hits: <span className="font-mono font-semibold text-brand-primary">{hits}</span>
        </span>
        <span className="text-brand-text-muted">
          Misses: <span className="font-mono font-semibold text-brand-warning">{misses}</span>
        </span>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-brand-text-muted">Hit rate</span>
          <span className={`font-mono font-bold text-[14px] ${hitRate >= 40 ? "text-brand-primary" : "text-brand-warning"}`}>
            {hitRate}%
          </span>
        </div>
      </div>

      <div className="h-1 bg-brand-surface rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-brand-primary rounded-full"
          animate={{ width: `${(stepIdx / REQUESTS.length) * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>

      <div className="flex gap-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={step}
          disabled={stepIdx >= REQUESTS.length}
          className="px-3 py-1.5 rounded-lg bg-brand-primary text-white text-[11px] font-medium cursor-pointer outline-none hover:bg-brand-primary-hover transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {stepIdx >= REQUESTS.length ? "Sequence complete" : `Next: "${REQUESTS[stepIdx]}"`}
        </motion.button>
        <button
          onClick={doReset}
          className="px-3 py-1.5 rounded-lg border border-brand-border text-[11px] text-brand-text-muted font-medium cursor-pointer outline-none hover:bg-brand-surface/50 transition-all duration-500"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
