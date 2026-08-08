export function HorizontalSection() {
  return (
    <section>
      <h2 id="horizontal-scaling" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Horizontal Scaling: More Servers
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Instead of one big server, use many smaller ones. <strong>Horizontal scaling</strong>, or
        scaling out, adds capacity by adding instances. Each server handles a fraction of the traffic.
        Together, they handle the whole.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          Horizontal scaling is like building more lanes on more roads in parallel cities, rather than
          making one road infinitely wide. It trades single-point-of-failure risk for distributed
          complexity.
        </p>
      </div>

      <div className="bg-white border border-brand-border rounded-xl p-5 mb-6 not-prose">
        <div className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle mb-4">
          Horizontal scaling architecture
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-[11px] text-brand-text-muted">
            <span>🌐</span>
            <span>Incoming traffic (1000 RPS)</span>
          </div>
          <div className="w-px h-4 bg-brand-border" />
          <div className="px-4 py-2 rounded-xl border border-brand-primary/30 bg-brand-primary/5 text-[11px] font-semibold text-brand-primary">
            ⚖️ Load Balancer
          </div>
          <div className="flex items-start gap-4">
            {["Server 1\n~333 RPS", "Server 2\n~333 RPS", "Server 3\n~334 RPS"].map((label) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div className="w-px h-4 bg-brand-border" />
                <div className="px-3 py-2 rounded-xl border border-brand-border bg-white text-[10px] font-medium text-brand-text text-center whitespace-pre-line">
                  🖥️{"\n"}
                  {label}
                </div>
              </div>
            ))}
          </div>
          <div className="w-px h-4 bg-brand-border" />
          <div className="px-4 py-2 rounded-xl border border-brand-border bg-white text-[11px] font-medium text-brand-text">
            🗄️ Shared Database (with read replicas)
          </div>
        </div>
      </div>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">The stateless requirement</h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Horizontal scaling only works when any server can handle any request. This requires your
        application servers to be <strong>stateless</strong>, they don&apos;t store anything in
        memory between requests. All state lives in shared, external systems.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        {[
          { label: "Sessions", bad: "In-memory session store", good: "Redis session store, any server can read any session" },
          { label: "User data", bad: "Local file uploads", good: "S3 or object storage, any server can access any file" },
          { label: "Cache", bad: "Local in-process cache", good: "Redis, shared cache visible to all servers" },
          { label: "Config", bad: "Per-server config files", good: "Environment variables or config service, consistent across all servers" },
        ].map(({ label, bad, good }) => (
          <div key={label} className="p-4 bg-white border border-brand-border rounded-xl">
            <div className="text-[11px] font-semibold text-brand-text mb-2">{label}</div>
            <div className="flex items-start gap-1.5 mb-1.5">
              <span className="text-[10px] text-brand-destructive font-mono mt-0.5">✗</span>
              <span className="text-[10px] text-brand-text-muted">{bad}</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-[10px] text-brand-primary font-mono mt-0.5">✓</span>
              <span className="text-[10px] text-brand-text/80">{good}</span>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">Auto-scaling: elastic capacity</h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Cloud platforms can automatically add or remove servers based on load metrics. This is
        <strong> auto-scaling</strong>, you define the rules, the platform adjusts capacity.
        This means you pay for what you use and handle traffic spikes without manual intervention.
      </p>

      <div className="space-y-2 mb-6">
        {[
          { trigger: "CPU > 70% for 2 min", action: "Add 2 servers", note: "Common for CPU-bound workloads (image processing, ML inference)" },
          { trigger: "Request queue depth > 100", action: "Add 1 server", note: "For async worker pools, keep queue shallow" },
          { trigger: "Custom metric (orders/sec)", action: "Scale predictively", note: "Scale before the spike (e.g., before a product launch)" },
          { trigger: "CPU < 20% for 10 min", action: "Remove 1 server", note: "Scale in to save cost during quiet periods" },
        ].map(({ trigger, action, note }) => (
          <div key={trigger} className="grid grid-cols-[1fr_auto] gap-4 p-3 rounded-xl border border-brand-border bg-white text-[11px]">
            <div>
              <span className="font-mono text-brand-primary">IF </span>
              <span className="font-semibold text-brand-text">{trigger}</span>
              <span className="font-mono text-brand-primary"> → </span>
              <span className="text-brand-text">{action}</span>
              <p className="text-brand-text-muted mt-0.5">{note}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-l-2 border-brand-warning bg-brand-warning/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-brand-text-muted">
          <strong>The database bottleneck:</strong> Horizontal scaling is straightforward for stateless
          app servers, but databases are harder. A single primary DB can become the bottleneck.
          Solutions: read replicas for read-heavy workloads, connection pooling (PgBouncer), sharding
          for write-heavy workloads, or switching to databases designed for distribution (Cassandra, DynamoDB).
        </p>
      </div>
    </section>
  );
}
