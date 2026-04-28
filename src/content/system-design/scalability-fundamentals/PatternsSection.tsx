export function PatternsSection() {
  return (
    <section>
      <h2 id="scaling-patterns" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Real-World Scaling Patterns
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Every high-scale system uses a combination of techniques rather than a single scaling strategy.
        Here are the patterns that appear repeatedly across large-scale architectures.
      </p>

      {/* Read replicas */}
      <h3 className="text-base font-semibold mt-8 mb-3">Database read replicas</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Most applications read far more than they write (read:write ratio often 10:1 or higher).
        Horizontal scaling the app tier is easy, but the database becomes a chokepoint because
        every server hits the same primary. <strong>Read replicas</strong> solve the read side.
      </p>

      <div className="bg-card border border-border rounded-xl p-5 mb-6 not-prose">
        <div className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60 mb-4">
          Read replica architecture
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <div className="px-4 py-2.5 rounded-xl border border-primary/30 bg-primary/5 text-[11px] font-semibold text-primary text-center">
              🗄️ Primary DB<br />
              <span className="font-normal text-[9px] text-muted-foreground">Writes only</span>
            </div>
            <div className="text-[9px] text-muted-foreground">replicates to</div>
            <div className="flex gap-2">
              {["Replica 1", "Replica 2", "Replica 3"].map((r) => (
                <div key={r} className="px-3 py-2 rounded-xl border border-border bg-card text-[9px] font-medium text-center">
                  🗄️<br />{r}<br />
                  <span className="text-muted-foreground">Reads</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground space-y-2 sm:max-w-[200px]">
            <p>App servers route <strong className="text-foreground">writes</strong> to primary</p>
            <p>App servers route <strong className="text-foreground">reads</strong> to any replica</p>
            <p>Replicas lag primary by <strong className="text-foreground">milliseconds</strong> (async replication)</p>
          </div>
        </div>
      </div>

      <div className="border-l-2 border-warning bg-warning/5 pl-4 py-3 rounded-r-lg mb-8">
        <p className="text-[13px] text-foreground/70">
          <strong>Replication lag trap:</strong> Replicas are eventually consistent with the primary.
          If a user writes a record and immediately reads it, they might hit a stale replica that
          hasn't received the update yet. For reads that must be fresh after a write, route to the
          primary or use "read-your-own-writes" consistency with a short primary bypass window.
        </p>
      </div>

      {/* Caching layer */}
      <h3 className="text-base font-semibold mt-8 mb-3">The caching layer: skip the database entirely</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
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
          <div key={label} className="p-4 bg-card border border-border rounded-xl">
            <div className="text-[12px] font-semibold mb-1.5">{label}</div>
            <p className="text-[11px] text-muted-foreground mb-2 leading-relaxed">{desc}</p>
            <span className="text-[9px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">{when}</span>
          </div>
        ))}
      </div>

      {/* Sharding */}
      <h3 className="text-base font-semibold mt-8 mb-3">Sharding: horizontal database scaling</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        When a single database (even with replicas) can't handle write volume, you split data across
        multiple independent databases — each owning a <strong>shard</strong> of the keyspace.
      </p>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Shard key</th>
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Example</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {[
              { key: "User ID", ex: "user_id % 4 → Shard 0–3", risk: "Hot users (celebrities) create hot shards" },
              { key: "Geographic region", ex: "EU → Shard A, US → Shard B", risk: "Uneven growth; US might outgrow EU 3×" },
              { key: "Consistent hash", ex: "hash(user_id) mod N", risk: "Complex rebalancing when adding shards" },
              { key: "Date range", ex: "2024 data → Shard C, 2025 → Shard D", risk: "Recent shards are always hottest (writes)" },
            ].map((r) => (
              <tr key={r.key}>
                <td className="py-2 pr-4 font-medium text-foreground/80">{r.key}</td>
                <td className="py-2 pr-4 text-muted-foreground font-mono text-[10px]">{r.ex}</td>
                <td className="py-2 text-orange-500 dark:text-orange-400 text-[10px]">{r.risk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-l-2 border-warning bg-warning/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-foreground/70">
          <strong>Sharding is a last resort.</strong> It adds massive complexity: cross-shard queries
          are expensive, transactions spanning shards require distributed coordination, and rebalancing
          is painful. Exhaust read replicas, connection pooling, caching, and vertical scaling before
          reaching for sharding. Most applications never need it.
        </p>
      </div>
    </section>
  );
}
