import { Database, Package, Search } from "lucide-react";

const FAILURES = [
  {
    Icon: Database,
    title: "GET /tasks/{id} hits the database on every request",
    trigger: "Any traffic above a few RPS on the detail endpoint",
    symptom: "p95 latency is 120-180ms at 100 RPS. Every request pays the full database round-trip cost even when the same task is requested repeatedly.",
    detail:
      "Task records are immutable between updates. Fetching the same record from the database on every request wastes connection pool capacity and adds consistent latency. The detail endpoint is the most cache-friendly endpoint in the API: reads are frequent, writes are infrequent, and records are user-scoped.",
  },
  {
    Icon: Package,
    title: "List endpoint serializes more fields than the client uses",
    trigger: "Any list response with more than a handful of results",
    symptom: "GET /tasks returns full Task objects including description, metadata, and timestamps that the list view never renders. Serialization time grows with result set size.",
    detail:
      "JSON serialization is rarely the bottleneck on a small API, but it becomes measurable when the response model is large and the list is long. Returning a TaskSummary (id, title, completed, created_at) from the list endpoint instead of the full Task record reduces serialization time and response payload size.",
  },
  {
    Icon: Search,
    title: "No profiling instrumentation -- you cannot find the slow line",
    trigger: "Any latency regression without an obvious cause",
    symptom: "p95 goes from 80ms to 140ms after a deploy. Structured logs show duration_ms but not which operation caused the increase. Traces show the DB span is fast. The bottleneck is somewhere in Python.",
    detail:
      "OpenTelemetry traces attribute time to named spans. They do not show you which Python function within a span is slow. A profiler like pyinstrument records a call stack sample every N milliseconds and produces a flamegraph: time attributed to every function in the call chain. You cannot optimize what you cannot measure.",
  },
];

export function WhatBreaksSection() {
  return (
    <section id="what-breaks">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">What Breaks</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        The p95 latency target is 100ms at 100 RPS. The current API misses it. Three
        issues each contribute: every read hits the database, responses carry unnecessary
        fields, and there is no way to identify which operation is responsible when
        latency regresses.
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
