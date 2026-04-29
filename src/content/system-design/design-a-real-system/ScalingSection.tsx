const READ_PATH = [
  {
    layer: "Redis cache",
    detail: "Cache short_code → long_url with TTL equal to the URL expiry. Cache hit rate above 90% is achievable because traffic is highly skewed: 20% of URLs receive 80% of clicks.",
    latency: "~1ms",
  },
  {
    layer: "CDN edge (popular URLs)",
    detail: "For URLs with very high click volume, serve the 302 redirect directly from CDN edge nodes. The CDN caches the redirect response with a short max-age (60s). Reduces origin traffic by an order of magnitude for viral links.",
    latency: "<5ms",
  },
  {
    layer: "Read replica",
    detail: "Route cache misses to a PostgreSQL read replica rather than the primary. Analytics queries (aggregations over click events) go to read replicas and never contend with writes.",
    latency: "~10ms",
  },
  {
    layer: "Primary database",
    detail: "Only write operations (new URLs, expiry updates, deletions) go to the primary. With a healthy cache hit rate, the primary receives a small fraction of total traffic.",
    latency: "~15ms",
  },
];

export function ScalingSection() {
  return (
    <section>
      <h2 id="scaling" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Scaling the Read and Write Paths
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The URL shortener is read-heavy by design. At a 100:1 read/write ratio, scaling
        the redirect path matters far more than scaling the creation path. The strategy
        is to serve as many redirects as possible without touching the database.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Read path: layered caching</h3>

      <div className="space-y-2 mb-8">
        {READ_PATH.map(({ layer, detail, latency }) => (
          <div key={layer} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
              <span className="text-[11px] font-semibold">{layer}</span>
              <span className="font-mono text-[9px] text-primary">{latency}</span>
            </div>
            <div className="px-4 py-3">
              <p className="text-[11px] text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Cache invalidation</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Two events invalidate a cached URL: the user deletes it, or it expires. For deletion,
        issue a Redis DEL and a CDN cache purge immediately on write. For expiry, rely on the
        Redis TTL set at insertion time; the key self-expires. Never serve an expired URL: check
        the database after a cache miss to verify the URL has not expired since it was cached.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-8 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          Cache invalidation on URL deletion
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`async def delete_url(short_code: str, user_id: int):
    # 1. Delete from DB (authoritative)
    deleted = await db.execute(
        "DELETE FROM urls WHERE short_code = $1 AND user_id = $2",
        short_code, user_id,
    )
    if not deleted:
        raise HTTPException(status_code=404)

    # 2. Invalidate Redis immediately
    await redis.delete(f"url:{short_code}")

    # 3. Purge CDN cache for this path (fire-and-forget)
    asyncio.create_task(cdn_purge(f"/{short_code}"))`}
        </pre>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Write path: rate limiting and deduplication</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The write path needs two protections: rate limiting to prevent abuse, and deduplication
        so the same user submitting the same long URL twice gets the same short code back.
      </p>

      <div className="space-y-2 mb-6">
        {[
          {
            title: "Per-user rate limit",
            detail: "Limit URL creation to N per minute per authenticated user. Unauthenticated requests get a lower limit tied to IP. Use a sliding window counter in Redis (see the Rate Limiting article). Return 429 with a Retry-After header when exceeded.",
          },
          {
            title: "Deduplication",
            detail: "When a user creates a URL, hash the long URL and check for an existing record with the same hash and user_id. Return the existing short code rather than creating a new one. Reduces storage and prevents clutter in user dashboards.",
          },
          {
            title: "Idempotency key",
            detail: "Accept an optional Idempotency-Key header on POST /urls. Two requests with the same key within a time window return the same response. Prevents duplicate URLs from network retries.",
          },
        ].map(({ title, detail }) => (
          <div key={title} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="text-primary font-bold text-sm flex-shrink-0 mt-0.5">→</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{title}</p>
              <p className="text-[11px] text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Database: indexes and read replicas</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The short_code index is the single most important database optimization. Every cache
        miss triggers a lookup by short_code. This index must fit in memory (the working set
        of a PostgreSQL B-tree for 500M URLs with 10-byte codes is roughly 15 GB, well within
        a single large instance). When the write throughput or query complexity grows, promote
        one replica to serve read traffic and reserve the primary for writes only.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          {
            label: "When to add a read replica",
            items: ["Redirect query latency on the primary exceeds 10ms p99", "Analytics queries are visible in slow query logs", "CPU on the primary exceeds 60% sustained"],
          },
          {
            label: "When to shard",
            items: ["Single-node storage exceeds 5 TB", "Write throughput exceeds 50K writes/sec", "A single Redis node no longer fits the hot set in memory"],
          },
        ].map(({ label, items }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-3">
            <p className="text-[11px] font-semibold mb-2">{label}</p>
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item} className="text-[11px] text-muted-foreground flex gap-2">
                  <span className="text-primary flex-shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
