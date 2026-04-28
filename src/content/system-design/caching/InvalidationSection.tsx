const TTL_EXAMPLES = [
  { resource: "User profile", ttl: "5 min", rationale: "Changes infrequently. Short TTL covers rare updates without DB pressure." },
  { resource: "Product price", ttl: "30 sec", rationale: "Can change rapidly. Stale price shown to a buyer is a business problem." },
  { resource: "Homepage feed", ttl: "1 min", rationale: "Slightly stale is acceptable. Reduces DB load massively at scale." },
  { resource: "Auth token validity", ttl: "0 / never", rationale: "Must invalidate on logout. TTL alone is insufficient for security." },
  { resource: "Static asset (JS/CSS)", ttl: "1 year", rationale: "Filename includes content hash. Cache forever; deploy new hash to bust." },
  { resource: "Search results", ttl: "10 min", rationale: "Fresh enough for most queries. Index updates do not require immediate flush." },
];

const STRATEGIES = [
  {
    name: "TTL (time-to-live)",
    icon: "⏱️",
    how: "Every cache entry expires after a fixed duration. The next request after expiry triggers a database fetch and repopulates the cache.",
    tradeoff: "Simple to implement everywhere. Allows staleness up to the TTL window. No coordination required.",
    code: `redis.set("user:42", json, ex=300)  # expires in 5 min`,
  },
  {
    name: "Event-driven invalidation",
    icon: "📡",
    how: "When data changes in the database, publish an event. Cache nodes subscribe and delete (or update) the affected keys immediately.",
    tradeoff: "Zero staleness window. Requires a messaging layer (Redis pub/sub, Kafka, webhooks) and careful key mapping.",
    code: `# On user update:
db.update(user)
redis.delete(f"user:{user.id}")
# or: publish("cache.invalidate", key)`,
  },
  {
    name: "Cache versioning",
    icon: "🔑",
    how: "Embed a version or hash in the cache key. When data changes, increment the version. Old keys are never explicitly deleted; they expire via TTL or fall off via eviction.",
    tradeoff: "No coordination needed. Old keys waste memory until evicted. Works well for static assets with content-addressed filenames.",
    code: `# Cache key includes schema version
key = f"user:{user_id}:v{SCHEMA_VERSION}"
# Deploy with new SCHEMA_VERSION to bust all keys`,
  },
];

export function InvalidationSection() {
  return (
    <section>
      <h2 id="cache-invalidation" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Cache Invalidation
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        There is a famous quip in computer science: there are only two hard problems,
        cache invalidation and naming things. The reason cache invalidation is hard is not
        technical: it is a consistency problem. Your cache and your database can disagree,
        and every user who hits a stale cache entry gets wrong data silently.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Serving stale data is worse than a cache miss in most contexts. A miss is slow.
        Stale data is incorrect. Design your invalidation strategy before you design cache
        population, not after.
      </p>

      <div className="space-y-3 mb-8">
        {STRATEGIES.map(({ name, icon, how, tradeoff, code }) => (
          <div key={name} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-4 py-3 bg-secondary/50 border-b border-border flex items-center gap-2">
              <span>{icon}</span>
              <span className="text-[13px] font-semibold">{name}</span>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-[12px] text-muted-foreground leading-relaxed">{how}</p>
              <pre className="text-[10px] font-mono bg-muted rounded-lg px-3 py-2.5 overflow-x-auto whitespace-pre">
                {code}
              </pre>
              <p className="text-[11px] text-muted-foreground border-t border-border/50 pt-2">
                <span className="font-semibold text-foreground">Trade-off: </span>{tradeoff}
              </p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Choosing a TTL</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        TTL is a correctness budget. Set it to the maximum staleness your users can tolerate
        for each resource. There is no universal answer: a product price and a static asset
        have completely different tolerances.
      </p>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Resource</th>
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Typical TTL</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Rationale</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {TTL_EXAMPLES.map(({ resource, ttl, rationale }) => (
              <tr key={resource}>
                <td className="py-2 pr-4 font-medium text-foreground/80 align-top">{resource}</td>
                <td className="py-2 pr-4 font-mono text-primary align-top whitespace-nowrap">{ttl}</td>
                <td className="py-2 text-muted-foreground">{rationale}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">The cache stampede problem</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        When a popular cache key expires, dozens or hundreds of requests can simultaneously
        see a miss and all rush to the database to repopulate it. The database receives a
        spike of identical queries at once.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        {[
          {
            name: "Probabilistic early expiration",
            desc: "Before a key expires, randomly decide to refresh it early based on proximity to TTL. Spreads the refresh load over time.",
            code: `# XFetch algorithm
if now - computed_at > ttl - beta * log(rand()):
    recompute_and_cache()`,
          },
          {
            name: "Locking / mutex",
            desc: "When a miss occurs, the first process acquires a lock and fetches from DB. Others wait. On release, all processes read the now-warm cache.",
            code: `if not cache.get(key):
    with cache.lock(key, timeout=2):
        if not cache.get(key):  # re-check
            cache.set(key, db.fetch())`,
          },
        ].map(({ name, desc, code }) => (
          <div key={name} className="p-4 rounded-xl border border-border bg-card space-y-2">
            <p className="text-[12px] font-semibold">{name}</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{desc}</p>
            <pre className="text-[9px] font-mono bg-muted rounded px-2 py-1.5 overflow-x-auto whitespace-pre">
              {code}
            </pre>
          </div>
        ))}
      </div>

      <div className="border-l-2 border-warning bg-warning/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-foreground/70">
          For most applications, cache-aside with TTL plus event-driven invalidation on writes
          covers 95% of needs. Add stampede protection only after you observe it in production.
          Premature complexity in cache layers is a frequent cause of subtle bugs.
        </p>
      </div>
    </section>
  );
}
