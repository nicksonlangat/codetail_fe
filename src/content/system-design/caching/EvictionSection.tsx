import { CacheSimulator } from "@/components/blog/interactive/cache-simulator";

const POLICIES = [
  {
    name: "LRU",
    full: "Least Recently Used",
    rule: "Evict the entry that was accessed least recently.",
    code: `# On access: move to front of list
# On eviction: remove from tail
cache = OrderedDict()
cache.move_to_end(key)      # hit
cache.popitem(last=False)   # evict`,
    pros: [
      "Recency is a strong proxy for future access. Hot data stays warm.",
      "Handles bursty workloads well. A spike of reads on key A keeps A cached.",
    ],
    cons: [
      "Sequential scans pollute the cache. Reading a 1M-row table evicts all hot data.",
      "Requires tracking access order on every read, which adds bookkeeping overhead.",
    ],
    best: "General-purpose web application caching. The right default when unsure.",
  },
  {
    name: "LFU",
    full: "Least Frequently Used",
    rule: "Evict the entry with the lowest access frequency. Ties broken by recency.",
    code: `# Track access counts
# On eviction: find min-frequency key
counts = Counter()
counts[key] += 1        # hit
evict = min(counts, key=lambda k: (counts[k], last_used[k]))`,
    pros: [
      "Better for skewed workloads where a small set of keys is always hot.",
      "Resists cache pollution: one-off access to cold keys does not evict warm ones.",
    ],
    cons: [
      "New keys start at frequency 1 and are immediately vulnerable to eviction.",
      "Historical frequency can be misleading. A key popular two hours ago is stale information.",
    ],
    best: "Read-heavy workloads with a stable hot set (recommendation engines, leaderboards).",
  },
  {
    name: "FIFO",
    full: "First In, First Out",
    rule: "Evict the entry that has been in the cache the longest, regardless of use.",
    code: `# Queue: entries leave in insertion order
from collections import deque
queue = deque()
queue.append(key)       # insert
queue.popleft()         # evict oldest`,
    pros: [
      "Trivially simple to implement. No access tracking required.",
      "Predictable eviction order makes cache behavior easy to reason about.",
    ],
    cons: [
      "Ignores access patterns entirely. A frequently accessed key is evicted just as readily as a cold one.",
      "Performs poorly for workloads with repeated access to a working set.",
    ],
    best: "Rarely the right choice for application caches. Useful for simple buffers with uniform TTLs.",
  },
];

export function EvictionSection() {
  return (
    <section>
      <h2 id="eviction-policies" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Eviction Policies
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        When a cache is full and a new item needs to be stored, something must be removed.
        The eviction policy determines which entry gets dropped. The choice significantly
        affects hit rate for the same cache size.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Use the explorer below to step through a 20-request sequence with a 5-slot cache.
        Switch between LRU, LFU, and FIFO to see how eviction decisions differ and how the
        hit rate changes at the end of the sequence.
      </p>

      <CacheSimulator />

      <div className="space-y-4 mt-2">
        {POLICIES.map(({ name, full, rule, code, pros, cons, best }) => (
          <div key={name} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-4 py-3 bg-secondary/50 border-b border-border flex items-center gap-3">
              <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">
                {name}
              </span>
              <span className="text-[13px] font-semibold">{full}</span>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-[12px] text-muted-foreground italic">{rule}</p>
              <pre className="text-[10px] font-mono bg-muted rounded-lg px-3 py-2.5 overflow-x-auto whitespace-pre">
                {code}
              </pre>
              <div className="grid sm:grid-cols-2 gap-3 text-[11px]">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-medium text-primary mb-1.5">
                    Strengths
                  </p>
                  <ul className="space-y-1">
                    {pros.map(p => (
                      <li key={p} className="flex gap-1.5 text-muted-foreground">
                        <span className="text-primary flex-shrink-0 mt-0.5">+</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-medium text-orange-500 mb-1.5">
                    Weaknesses
                  </p>
                  <ul className="space-y-1">
                    {cons.map(c => (
                      <li key={c} className="flex gap-1.5 text-muted-foreground">
                        <span className="text-orange-500 flex-shrink-0 mt-0.5">-</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground border-t border-border pt-2">
                <span className="font-medium text-foreground">Best for: </span>{best}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mt-6">
        <p className="text-[13px] text-foreground/70">
          Redis uses LRU or LFU eviction, configurable via <code className="font-mono text-[11px] bg-muted px-1 rounded">maxmemory-policy</code>.
          Memcached uses LRU within slabs. Most application-layer caches (Guava, Caffeine, node-lru-cache)
          default to LRU with optional size-based weighting. Start with LRU and only change if profiling
          shows a specific pattern that would benefit from LFU.
        </p>
      </div>
    </section>
  );
}
