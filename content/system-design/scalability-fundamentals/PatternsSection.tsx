export function PatternsSection() {
  return (
    <section>
      <h2 id="scaling-patterns" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Real-World Scaling Patterns
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-6">
        Every high-scale system uses a combination of techniques rather than a single scaling strategy.
        Here are the patterns that appear repeatedly across large-scale architectures.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">Database read replicas</h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Most applications read far more than they write (read:write ratio often 10:1 or higher).
        Horizontal scaling the app tier is easy, but the database becomes a chokepoint because
        every server hits the same primary. <strong>Read replicas</strong> solve the read side.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-5 mb-6 not-prose">
        <div className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle mb-4">
          Read replica architecture
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <div className="px-4 py-2.5 rounded-xl border border-brand-primary/30 bg-brand-primary/5 text-[11px] font-semibold text-brand-primary text-center">
              🗄️ Primary DB
              <br />
              <span className="font-normal text-[9px] text-brand-text-muted">Writes only</span>
            </div>
            <div className="text-[9px] text-brand-text-muted">replicates to</div>
            <div className="flex gap-2">
              {["Replica 1", "Replica 2", "Replica 3"].map((r) => (
                <div key={r} className="px-3 py-2 rounded-xl border border-brand-border bg-white text-[9px] font-medium text-center">
                  🗄️
                  <br />
                  {r}
                  <br />
                  <span className="text-brand-text-muted">Reads</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[11px] text-brand-text-muted space-y-2 sm:max-w-[200px]">
            <p>
              App servers route <strong className="text-brand-text">writes</strong> to primary
            </p>
            <p>
              App servers route <strong className="text-brand-text">reads</strong> to any replica
            </p>
            <p>
              Replicas lag primary by <strong className="text-brand-text">milliseconds</strong> (async replication)
            </p>
          </div>
        </div>
      </div>

      <div className="border-l-2 border-brand-warning bg-brand-warning/5 pl-4 py-3 rounded-r-lg mb-8">
        <p className="text-[13px] text-brand-text-muted">
          <strong>Replication lag trap:</strong> Replicas are eventually consistent with the primary.
          If a user writes a record and immediately reads it, they might hit a stale replica that
          hasn&apos;t received the update yet. For reads that must be fresh after a write, route to the
          primary or use &quot;read-your-own-writes&quot; consistency with a short primary bypass window.
        </p>
      </div>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">The caching layer: skip the database entirely</h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The most effective scaling technique is not doing work at all. If a response can be served from
        cache, the database never sees the request. Redis or Memcached sitting between your app servers
        and database can absorb 90%+ of read traffic for read-heavy workloads.
      </p>

      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        {[
          { label: "Cache-aside", desc: "App checks cache first. Miss? Read from DB, write to cache. Most common pattern. App code is cache-aware.", when: "General-purpose" },
          { label: "Write-through", desc: "Every write goes to DB and cache simultaneously. Cache is always warm. Write latency doubles.", when: "Read-heavy, tolerate write latency" },
          { label: "Write-behind", desc: "Write to cache immediately, async-flush to DB. Fast writes, risk of data loss if cache node dies.", when: "Write-heavy, can tolerate staleness" },
        ].map(({ label, desc, when }) => (
          <div key={label} className="p-4 bg-white border border-brand-border rounded-xl">
            <div className="text-[12px] font-semibold text-brand-text mb-1.5">{label}</div>
            <p className="text-[11px] text-brand-text-muted mb-2 leading-relaxed">{desc}</p>
            <span className="text-[9px] text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full">{when}</span>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">Sharding: horizontal database scaling</h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        When a single database (even with replicas) can&apos;t handle write volume, you split data across
        multiple independent databases, each owning a <strong>shard</strong> of the keyspace.
      </p>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="border-b border-brand-border">
              <th className="text-left py-2 pr-4 text-brand-text-muted font-medium">Shard key</th>
              <th className="text-left py-2 pr-4 text-brand-text-muted font-medium">Example</th>
              <th className="text-left py-2 text-brand-text-muted font-medium">Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/50">
            {[
              { key: "User ID", ex: "user_id % 4 -> Shard 0-3", risk: "Hot users (celebrities) create hot shards" },
              { key: "Geographic region", ex: "EU -> Shard A, US -> Shard B", risk: "Uneven growth; US might outgrow EU 3x" },
              { key: "Consistent hash", ex: "hash(user_id) mod N", risk: "Complex rebalancing when adding shards" },
              { key: "Date range", ex: "2024 data -> Shard C, 2025 -> Shard D", risk: "Recent shards are always hottest (writes)" },
            ].map((r) => (
              <tr key={r.key}>
                <td className="py-2 pr-4 font-medium text-brand-text/80">{r.key}</td>
                <td className="py-2 pr-4 text-brand-text-muted font-mono text-[10px]">{r.ex}</td>
                <td className="py-2 text-brand-warning text-[10px]">{r.risk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-l-2 border-brand-warning bg-brand-warning/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-brand-text-muted">
          <strong>Sharding is a last resort.</strong> It adds massive complexity: cross-shard queries
          are expensive, transactions spanning shards require distributed coordination, and rebalancing
          is painful. Exhaust read replicas, connection pooling, caching, and vertical scaling before
          reaching for sharding. Most applications never need it.
        </p>
      </div>
    </section>
  );
}
