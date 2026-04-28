"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Policy = "lru" | "lfu" | "fifo";
type CacheEntry = { key: string; frequency: number; insertedAt: number; lastUsedAt: number };

const CAPACITY = 5;
const REQUESTS = ["A","B","C","D","A","B","E","A","C","F","A","B","D","A","G","B","A","C","H","A"];

function evictKey(entries: CacheEntry[], policy: Policy): string {
  if (policy === "lru") {
    return entries.reduce((m, e) => e.lastUsedAt < m.lastUsedAt ? e : m).key;
  }
  if (policy === "lfu") {
    const minFreq = Math.min(...entries.map(e => e.frequency));
    return entries
      .filter(e => e.frequency === minFreq)
      .reduce((m, e) => e.lastUsedAt < m.lastUsedAt ? e : m).key;
  }
  return entries.reduce((m, e) => e.insertedAt < m.insertedAt ? e : m).key;
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
    const existing = cache.find(e => e.key === key);

    if (existing) {
      setHits(h => h + 1);
      setLastResult({ key, hit: true });
      setCache(prev =>
        prev.map(e => e.key === key ? { ...e, frequency: e.frequency + 1, lastUsedAt: now } : e)
      );
    } else {
      setMisses(m => m + 1);
      if (cache.length < CAPACITY) {
        setLastResult({ key, hit: false });
        setCache(prev => [...prev, { key, frequency: 1, insertedAt: now, lastUsedAt: now }]);
      } else {
        const evicted = evictKey(cache, policy);
        setLastResult({ key, hit: false, evicted });
        setCache(prev => [
          ...prev.filter(e => e.key !== evicted),
          { key, frequency: 1, insertedAt: now, lastUsedAt: now },
        ]);
      }
    }
    setStepIdx(i => i + 1);
  }

  function doReset() {
    setStepIdx(0); setCache([]); setHits(0); setMisses(0); setLastResult(null);
  }

  function changePolicy(p: Policy) {
    setPolicy(p); setStepIdx(0); setCache([]); setHits(0); setMisses(0); setLastResult(null);
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 mb-8 not-prose space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
          Eviction Policy Explorer
        </span>
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          {(["lru", "lfu", "fifo"] as Policy[]).map(p => (
            <button
              key={p}
              onClick={() => changePolicy(p)}
              className={`px-3 py-1 rounded-md text-[10px] font-medium cursor-pointer transition-all duration-500 ${
                policy === p
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-2">
          Incoming requests ({stepIdx}/{REQUESTS.length} processed)
        </p>
        <div className="flex gap-1 flex-wrap">
          {REQUESTS.map((req, i) => (
            <div
              key={i}
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-mono font-bold transition-all duration-300 ${
                i < stepIdx
                  ? "bg-muted/20 text-muted-foreground/25"
                  : i === stepIdx
                  ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {req}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50">
            Cache ({cache.length}/{CAPACITY} slots used)
          </p>
          {nextVictim && (
            <p className="text-[9px] text-orange-500 font-mono">
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
                    ? "border-dashed border-border/30 bg-transparent"
                    : isJustHit
                    ? "border-primary/60 bg-primary/10"
                    : isJustAdded
                    ? "border-orange-400/60 bg-orange-400/10"
                    : isVictim
                    ? "border-orange-400/30 bg-orange-400/5"
                    : "border-border bg-card"
                }`}
              >
                {entry ? (
                  <>
                    <span className="text-[17px] font-black font-mono leading-none">{entry.key}</span>
                    <span className="text-[8px] text-muted-foreground mt-0.5">
                      {policy === "lfu"
                        ? `freq ${entry.frequency}`
                        : policy === "lru"
                        ? `t=${entry.lastUsedAt}`
                        : `in t=${entry.insertedAt}`}
                    </span>
                    {isVictim && (
                      <span className="text-[7px] text-orange-500 font-semibold mt-0.5">next out</span>
                    )}
                  </>
                ) : (
                  <span className="text-[9px] text-muted-foreground/25 font-mono">empty</span>
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
                lastResult.hit
                  ? "bg-primary/10 text-primary"
                  : "bg-orange-400/10 text-orange-500"
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
        <span className="text-muted-foreground">
          Hits: <span className="font-mono font-semibold text-primary">{hits}</span>
        </span>
        <span className="text-muted-foreground">
          Misses: <span className="font-mono font-semibold text-orange-500">{misses}</span>
        </span>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-muted-foreground">Hit rate</span>
          <span className={`font-mono font-bold text-[14px] ${hitRate >= 40 ? "text-primary" : "text-orange-500"}`}>
            {hitRate}%
          </span>
        </div>
      </div>

      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          animate={{ width: `${(stepIdx / REQUESTS.length) * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>

      <div className="flex gap-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={step}
          disabled={stepIdx >= REQUESTS.length}
          className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-medium cursor-pointer hover:bg-primary/90 transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {stepIdx >= REQUESTS.length
            ? "Sequence complete"
            : `Next: "${REQUESTS[stepIdx]}"`}
        </motion.button>
        <button
          onClick={doReset}
          className="px-3 py-1.5 rounded-lg border border-border text-[11px] text-muted-foreground font-medium cursor-pointer hover:bg-muted/50 transition-all duration-500"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
