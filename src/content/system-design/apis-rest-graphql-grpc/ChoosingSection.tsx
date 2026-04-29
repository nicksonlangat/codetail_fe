const DECISION_ROWS = [
  {
    signal: "Public API for third-party developers",
    rest: "best",
    graphql: "ok",
    grpc: "poor",
    notes: "REST is universally accessible. No toolchain required. GraphQL works but requires clients to learn SDL.",
  },
  {
    signal: "Mobile app with varying data needs",
    rest: "poor",
    graphql: "best",
    grpc: "ok",
    notes: "GraphQL eliminates over-fetching. Mobile on slow networks benefits most from exact-fit responses.",
  },
  {
    signal: "Internal microservice-to-microservice",
    rest: "ok",
    graphql: "poor",
    grpc: "best",
    notes: "gRPC binary serialization and HTTP/2 multiplexing reduce latency and CPU at high RPS between services.",
  },
  {
    signal: "Real-time streaming (server push)",
    rest: "poor",
    graphql: "ok",
    grpc: "best",
    notes: "gRPC server streaming is built in. GraphQL subscriptions work via WebSocket. REST requires SSE or polling.",
  },
  {
    signal: "Browser clients (no proxy)",
    rest: "best",
    graphql: "best",
    grpc: "poor",
    notes: "Browsers cannot call gRPC directly. gRPC-Web needs an Envoy proxy. REST and GraphQL work natively.",
  },
  {
    signal: "Team needs discoverable, self-documenting API",
    rest: "ok",
    graphql: "best",
    grpc: "ok",
    notes: "GraphQL is introspectable. GraphiQL and Apollo Studio generate docs from the schema automatically.",
  },
  {
    signal: "Strict latency budget, high throughput",
    rest: "ok",
    graphql: "ok",
    grpc: "best",
    notes: "Binary frames, header compression, and multiplexed streams give gRPC a measurable edge at scale.",
  },
  {
    signal: "Strongly typed cross-language clients",
    rest: "ok",
    graphql: "ok",
    grpc: "best",
    notes: "protoc generates type-safe stubs in 10+ languages from a single .proto. No manual type sync.",
  },
  {
    signal: "Simple CRUD with standard HTTP caching",
    rest: "best",
    graphql: "poor",
    grpc: "ok",
    notes: "REST GET responses are cached by CDNs and browsers out of the box. GraphQL POST requests are not.",
  },
  {
    signal: "Aggregating data from many services",
    rest: "poor",
    graphql: "best",
    grpc: "ok",
    notes: "GraphQL's federation model (Apollo Federation, GraphQL Mesh) was built for this pattern.",
  },
];

const SCORE_STYLE: Record<string, string> = {
  best: "text-primary bg-primary/10 border-primary/20",
  ok: "text-muted-foreground bg-muted border-border",
  poor: "text-orange-500 bg-orange-400/10 border-orange-400/20",
};

const SCORE_LABEL: Record<string, string> = {
  best: "best fit",
  ok: "workable",
  poor: "avoid",
};

const HYBRID_PATTERNS = [
  {
    pattern: "REST for public + gRPC internally",
    desc: "External clients get REST endpoints. Internal services communicate via gRPC. A thin gateway translates. This is the approach used by Google, Netflix, and Uber.",
    example: "Public: POST /orders  |  Internal: OrderService.CreateOrder (gRPC)",
  },
  {
    pattern: "GraphQL BFF + gRPC backends",
    desc: "A Backend for Frontend layer (GraphQL) aggregates data from multiple gRPC microservices. Clients get the ergonomics of GraphQL. Services get the performance of gRPC.",
    example: "Browser -> GraphQL BFF -> [UserService, PostService, CommentService] (gRPC)",
  },
  {
    pattern: "REST for writes + GraphQL for reads",
    desc: "Mutations go through REST endpoints where HTTP semantics (201 Created, 409 Conflict, idempotency keys) are well understood. Queries go through GraphQL for flexible read patterns.",
    example: "POST /payments (REST) + query { paymentHistory { ... } } (GraphQL)",
  },
];

export function ChoosingSection() {
  return (
    <section>
      <h2 id="choosing" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Choosing the Right Paradigm
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        REST, GraphQL, and gRPC are not competing alternatives where one wins. They are tools
        with different strengths that often coexist in the same system. The right choice depends
        on your client type, latency requirements, team experience, and schema complexity.
        No architecture uses a single paradigm end-to-end at scale.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Decision matrix</h3>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Signal</th>
              <th className="text-left py-2 pr-2 text-muted-foreground font-medium">REST</th>
              <th className="text-left py-2 pr-2 text-muted-foreground font-medium">GraphQL</th>
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">gRPC</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {DECISION_ROWS.map(({ signal, rest, graphql, grpc, notes }) => (
              <tr key={signal}>
                <td className="py-2.5 pr-4 text-foreground/80 align-top">{signal}</td>
                {[rest, graphql, grpc].map((score, i) => (
                  <td key={i} className="py-2.5 pr-2 align-top">
                    <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border whitespace-nowrap ${SCORE_STYLE[score]}`}>
                      {SCORE_LABEL[score]}
                    </span>
                  </td>
                ))}
                <td className="py-2.5 text-muted-foreground align-top">{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Hybrid architectures</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Production systems rarely use one paradigm throughout. The most common hybrid patterns
        combine paradigms to get the best properties of each at the right layer of the stack.
      </p>

      <div className="space-y-4 mb-8">
        {HYBRID_PATTERNS.map(({ pattern, desc, example }) => (
          <div key={pattern} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-muted/30">
              <p className="text-[11px] font-semibold">{pattern}</p>
            </div>
            <div className="px-4 py-3 space-y-2">
              <p className="text-[11px] text-muted-foreground">{desc}</p>
              <pre className="text-[10px] font-mono bg-muted/50 rounded-lg px-3 py-2 overflow-x-auto text-muted-foreground">
                {example}
              </pre>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Rules of thumb</h3>

      <div className="space-y-2">
        {[
          {
            rule: "Start with REST",
            detail: "Unless you have a specific reason not to. REST is the path of least resistance: universal tooling, no build step, every developer knows it. Reach for GraphQL or gRPC when REST's limitations are actively hurting you.",
          },
          {
            rule: "Switch to GraphQL when over-fetching or waterfall fetching is measurable",
            detail: "If mobile clients are downloading 10x more data than they display, or if a page requires three sequential requests before it can render, GraphQL solves those problems directly.",
          },
          {
            rule: "Switch to gRPC for service-to-service at volume",
            detail: "When internal services are making thousands of calls per second to each other, gRPC's binary serialization and multiplexing pay for the operational cost of managing .proto files.",
          },
          {
            rule: "Never expose gRPC directly to browsers without a proxy",
            detail: "gRPC-Web via Envoy works, but it is an operational dependency. For browser-facing APIs, REST or GraphQL is always simpler.",
          },
          {
            rule: "Match the paradigm to the boundary, not the team preference",
            detail: "The public API boundary calls for REST. The inter-service boundary calls for gRPC. The frontend-to-aggregation boundary calls for GraphQL. These are engineering decisions, not personal style choices.",
          },
        ].map(({ rule, detail }) => (
          <div key={rule} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="text-primary font-bold text-sm flex-shrink-0 mt-0.5">→</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5">{rule}</p>
              <p className="text-[11px] text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
