import { Server, Database, Clock } from "lucide-react";

const FAILURES = [
  {
    Icon: Server,
    title: "A single process cannot saturate 10,000 RPS",
    trigger: "Load testing beyond the single-process throughput ceiling (~800-1500 RPS for typical FastAPI)",
    symptom: "CPU pegged at 100% on one core. p95 climbs past 200ms at 1,500 RPS. Throughput plateaus regardless of how many concurrent connections are added.",
    detail:
      "Python's GIL means a single process runs one thread at a time. Even with async I/O, CPU-bound work (Pydantic serialization, JWT validation, bcrypt) blocks the event loop. Horizontal scaling — multiple processes across multiple machines — is the only path past the single-process ceiling. For horizontal scaling to work, the app must be stateless: no in-process state, no local sessions.",
  },
  {
    Icon: Database,
    title: "Write-heavy paths saturate the primary database",
    trigger: "POST /tasks at scale, or any endpoint that writes on every request",
    symptom: "Database CPU at 80-90%. Write latency grows from 2ms to 40ms. Connection pool exhausted. Reads and writes queue behind each other.",
    detail:
      "A single PostgreSQL primary can handle roughly 5,000-10,000 simple writes per second, depending on hardware and write amplification. At 10k RPS, if even 20% of requests are writes, the database approaches saturation. Read replicas offload all reads from the primary. Background job queues move non-urgent work out of the request path entirely.",
  },
  {
    Icon: Clock,
    title: "Slow synchronous work in POST /tasks adds latency to every create request",
    trigger: "Any non-trivial post-create work: sending a webhook, triggering a notification, running validation that hits an external service",
    symptom: "POST /tasks p95 is 380ms. The database write takes 4ms. The remaining 376ms is a synchronous webhook call that the client is waiting for unnecessarily.",
    detail:
      "Clients do not need to wait for work that happens after the resource is created. A POST /tasks that sends a webhook can return 202 Accepted immediately after writing to the database, then process the webhook in a background worker. The client gets a faster response; the webhook still fires; the work is not lost.",
  },
];

export function WhatBreaksSection() {
  return (
    <section id="what-breaks">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">What Breaks</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Ten thousand requests per second with p95 under 100ms and zero 5xx errors requires
        changes at every layer: the application must be stateless and horizontally scalable,
        the database must be split into read and write paths, and any slow work must leave
        the request path.
      </p>

      <div className="space-y-3">
        {FAILURES.map(({ Icon, title, trigger, symptom, detail }) => (
          <div key={title} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[11px] font-semibold">{title}</span>
              </div>
              <span className="text-[9px] text-muted-foreground font-mono hidden sm:block">
                triggers: {trigger}
              </span>
            </div>
            <div className="px-4 py-3 space-y-2">
              <p className="text-[11px]">
                <span className="font-medium text-foreground/80">Observable: </span>
                <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">{symptom}</code>
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
