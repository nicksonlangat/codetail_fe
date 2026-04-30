import { WhatBreaksSection } from "./observability/WhatBreaksSection";
import { LoggingSection } from "./observability/LoggingSection";
import { MetricsSection } from "./observability/MetricsSection";
import { TracingSection } from "./observability/TracingSection";
import { SignupBanner } from "@/components/blog/promo/signup-banner";

export const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "what-breaks", title: "What Breaks" },
  { id: "structured-logging", title: "Structured Logging with Request IDs" },
  { id: "metrics", title: "Prometheus Metrics" },
  { id: "tracing", title: "OpenTelemetry Tracing" },
  { id: "summary", title: "Summary" },
];

export default function ObservabilityArticle() {
  return (
    <div className="space-y-2">
      <section id="introduction">
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          Article 4 added authentication: every request now has an identity, and every query
          is scoped to the authenticated user. The new constraint is diagnosability. The API
          will misbehave in production -- a slow query, an unexpected 500, a spike in auth
          failures. Without observability, diagnosing any of these takes hours. With it, five
          minutes.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
          This article adds three independent layers: structured JSON logs with request IDs
          that make log correlation possible, a Prometheus{" "}
          <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">/metrics</code>{" "}
          endpoint that makes alerting possible, and OpenTelemetry tracing that makes latency
          attribution possible. Each layer is useful without the others; together they give
          you the full picture.
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          The rule: logs answer "what happened," metrics answer "how often and how bad," traces
          answer "where did the time go." All three questions arise in the first week of
          production traffic.
        </p>
      </section>

      <WhatBreaksSection />

      <div className="my-10">
        <SignupBanner />
      </div>

      <LoggingSection />
      <MetricsSection />
      <TracingSection />

      <section>
        <h2 id="summary" className="text-xl font-semibold mt-12 mb-6 scroll-mt-24">
          Summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              title: "Structured logs beat print statements",
              desc: "JSON log entries are parseable by every log aggregation tool (Loki, Datadog, CloudWatch). Free-text logs require fragile regex extraction. Structure the output from day one -- retrofitting it later requires touching every log call.",
            },
            {
              title: "Request IDs are the minimum viable correlation primitive",
              desc: "A request ID shared across all log lines for a single request lets you reconstruct the full lifecycle in any log viewer. Return it in the X-Request-ID response header so clients can include it in bug reports.",
            },
            {
              title: "prometheus-fastapi-instrumentator is one line",
              desc: "Automatic HTTP metrics cover 80% of what you need to alert on: error rate, p95 latency, request volume. Add custom counters only for domain-specific events (auth failures, cache misses) that HTTP-level metrics can't capture.",
            },
            {
              title: "Auto-instrumentation covers routes and queries",
              desc: "FastAPIInstrumentor and SQLAlchemyInstrumentor create spans without per-handler code. Every route and every query appears in the trace automatically. Add manual spans only when you need to attribute time within a handler.",
            },
            {
              title: "Bind trace_id to every log line",
              desc: "Including the OpenTelemetry trace ID in structured logs connects your two observability systems. In Grafana, a single click jumps from a log entry to the full distributed trace. Without this bridge, logs and traces are isolated.",
            },
            {
              title: "Next: security hardening",
              desc: "Article 6 runs an OWASP API Top 10 audit against the current API and fixes the findings: input length limits, CORS policy, security headers, user enumeration prevention, and rate limiting on auth endpoints.",
            },
          ].map(({ title, desc }) => (
            <div key={title} className="flex gap-3 p-4 bg-card border border-border rounded-xl">
              <div>
                <p className="text-[13px] font-semibold mb-0.5">{title}</p>
                <p className="text-[12px] text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
