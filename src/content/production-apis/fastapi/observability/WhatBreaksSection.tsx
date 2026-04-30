import { Hash, Activity, Layers } from "lucide-react";

const FAILURES = [
  {
    Icon: Hash,
    title: "No request IDs -- log lines from different requests are indistinguishable",
    trigger: "The first time two requests overlap in the logs",
    symptom: "Logs show errors but you cannot tell which request caused them or what the user was doing.",
    detail:
      "Without a request ID, every log line is isolated. You cannot reconstruct a request's lifecycle: which query ran, how long it took, whether it hit the cache, which user triggered it. You end up grepping for timestamps and hoping the entries interleave in a readable way.",
  },
  {
    Icon: Activity,
    title: "No metrics -- you find out the API is down when a user reports it",
    trigger: "The first outage after launch",
    symptom: "Error rate spikes to 40% for six minutes. Nobody notices until a user emails.",
    detail:
      "Without a metrics endpoint, there is nothing to alert on. You cannot set a threshold on error rate, p95 latency, or connection pool exhaustion. Prometheus scrapes /metrics every 15 seconds -- without it, dashboards are empty and alerts cannot fire.",
  },
  {
    Icon: Layers,
    title: "No traces -- you know a request is slow but not which operation caused it",
    trigger: "A slow request that touches the database, cache, and an external service",
    symptom: "p95 is 800ms. Logs show the request completed. Nothing shows where the 800ms went.",
    detail:
      "A trace records every span within a request: the database query, the cache lookup, the serialization step. Without tracing, you cannot attribute latency to a specific function. You can add timing logs manually, but they only measure what you thought to instrument in advance.",
  },
];

export function WhatBreaksSection() {
  return (
    <section id="what-breaks">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">What Breaks</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Observability failures are not crashes -- they are gaps in information. The API keeps
        running, but when something goes wrong, you cannot diagnose it. Each of the three
        layers below is independently valuable and independently absent by default.
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
