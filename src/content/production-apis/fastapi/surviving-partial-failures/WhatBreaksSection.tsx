import { Clock, Wifi, RotateCcw } from "lucide-react";

const FAILURES = [
  {
    Icon: Clock,
    title: "A 5-second database timeout cascades to every open connection",
    trigger: "Any database slowdown: long-running query, autovacuum, replication lag, network hiccup",
    symptom: "All endpoint handlers queue behind the slow connection. p99 goes from 200ms to 5000ms. Connection pool exhausts. New requests return 503.",
    detail:
      "Without per-operation timeouts, a single slow database query holds a connection pool slot for the duration of the database's default statement timeout — which may be minutes or disabled entirely. 10 slow queries exhaust a 10-connection pool. Every subsequent request waits. The API is effectively down while the database is merely slow.",
  },
  {
    Icon: Wifi,
    title: "Redis being unavailable crashes the GET /tasks/{id} handler",
    trigger: "Redis restart, network partition between app and Redis, Redis OOM",
    symptom: "GET /tasks/{id} returns 500 with a Redis connection error. The database is healthy. Cache unavailability makes the endpoint fail completely.",
    detail:
      "The cache-aside pattern from article 7 calls redis_client.get() before the database. If Redis raises a connection error, the exception propagates unhandled and the handler returns 500. The fix is a try/except that falls through to the database on any Redis error — cache unavailability should never cause a request failure.",
  },
  {
    Icon: RotateCcw,
    title: "A transient network error makes a safe retry a 500",
    trigger: "Any brief network interruption between the app and the database or Redis",
    symptom: "GET /tasks/{id} returns 500. One second later, the same request succeeds. The failure was a dropped TCP packet, not a real error.",
    detail:
      "Transient failures are a fact of distributed systems. DNS resolution hiccups, TCP resets, brief connection timeouts all appear as exceptions in Python. Without retry logic on idempotent operations, these transient errors become user-visible errors. The fix is exponential backoff with jitter on GET operations — never on mutating operations.",
  },
];

export function WhatBreaksSection() {
  return (
    <section id="what-breaks">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">What Breaks</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        The API currently treats all external dependencies as reliable. If the database
        is slow, it waits. If Redis is down, it crashes. If a transient error occurs, it
        returns 500. Three patterns address these failure modes independently.
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
