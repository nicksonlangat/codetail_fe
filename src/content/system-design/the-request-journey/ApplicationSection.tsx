export function ApplicationSection() {
  return (
    <section>
      <h2 id="application-layer" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Steps 3–5: Load Balancer, Server & Database
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Once the TCP connection is established, the browser sends an HTTP request. For any service at
        scale, this request doesn't go straight to an application server — it first hits a
        <strong> load balancer</strong>.
      </p>

      {/* Load Balancer */}
      <h3 className="text-base font-semibold mt-8 mb-3">The load balancer</h3>

      <div className="bg-card border border-border rounded-xl p-5 mb-6 not-prose">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">⚖️</div>
          <div>
            <div className="text-[13px] font-semibold">Load Balancer</div>
            <div className="text-[11px] text-muted-foreground">Reverse proxy that distributes requests across backend servers</div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
          {[
            { label: "Health checks", desc: "Continuously polls /health endpoints. Pulls unhealthy servers from rotation automatically." },
            { label: "Sticky sessions", desc: "Routes a user to the same server via cookie. Needed for stateful apps (avoid this when possible)." },
            { label: "SSL termination", desc: "Decrypts HTTPS at the LB edge. Backend servers communicate over plain HTTP inside the VPC." },
          ].map(({ label, desc }) => (
            <div key={label} className="p-3 rounded-lg bg-secondary/60">
              <div className="font-semibold text-foreground mb-1">{label}</div>
              <div className="text-muted-foreground leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* App server */}
      <h3 className="text-base font-semibold mt-8 mb-3">The application server</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The app server receives the HTTP request and runs your code. A well-architected request handler
        follows a predictable sequence:
      </p>

      <div className="space-y-2 mb-6">
        {[
          { step: "1", label: "Authenticate", desc: "Verify the JWT or session token. Reject invalid requests early — before doing any real work." },
          { step: "2", label: "Authorize", desc: "Check that this user is allowed to perform this action on this resource (RBAC/ABAC)." },
          { step: "3", label: "Cache check", desc: "Query Redis or Memcached. A cache hit returns immediately — no DB query needed." },
          { step: "4", label: "Business logic", desc: "The actual work: validate input, compute results, call other services if needed." },
          { step: "5", label: "Database query", desc: "Only if the cache missed. Construct a parameterized query and send it over the connection pool." },
          { step: "6", label: "Cache write", desc: "Store the result in cache for subsequent requests. Set an appropriate TTL." },
          { step: "7", label: "Serialize + respond", desc: "JSON-serialize the response, set headers (Content-Type, Cache-Control, CORS), return 200." },
        ].map(({ step, label, desc }) => (
          <div key={step} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              {step}
            </span>
            <div>
              <span className="text-[12px] font-semibold text-foreground">{label} </span>
              <span className="text-[12px] text-muted-foreground">{desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Database */}
      <h3 className="text-base font-semibold mt-8 mb-3">The database: the slow step</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The database is almost always the bottleneck. A query without an index performs a full table
        scan — O(n) — reading every row to find matches. An indexed query is O(log n) — orders of
        magnitude faster at scale. The difference between a 5ms query and a 5-second query is often
        a missing index.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        {[
          { icon: "🐌", label: "Full table scan", code: "SELECT * FROM orders WHERE user_id = 42", note: "O(n) — reads every row. Fine at 1k rows, catastrophic at 10M.", bad: true },
          { icon: "⚡", label: "Index lookup", code: "SELECT * FROM orders WHERE user_id = 42\n-- (with index on user_id)", note: "O(log n) — B-tree traversal. Fast at any scale.", bad: false },
        ].map(({ icon, label, code, note, bad }) => (
          <div key={label} className={`p-4 rounded-xl border ${bad ? "border-destructive/30 bg-destructive/5" : "border-primary/30 bg-primary/5"}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{icon}</span>
              <span className="text-[12px] font-semibold">{label}</span>
            </div>
            <pre className="text-[10px] font-mono bg-muted rounded p-2 mb-2 whitespace-pre-wrap">{code}</pre>
            <p className="text-[10px] text-muted-foreground">{note}</p>
          </div>
        ))}
      </div>

      <div className="border-l-2 border-warning bg-warning/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-foreground/70">
          <strong>N+1 problem:</strong> Fetching a list of 100 users then querying each user's orders
          separately = 101 queries. Use a JOIN or batch fetch instead. N+1 queries are the most common
          database performance bug and often invisible until production load.
        </p>
      </div>
    </section>
  );
}
