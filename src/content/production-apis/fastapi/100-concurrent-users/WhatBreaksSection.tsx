import { Lock, Cpu, Server } from "lucide-react";

const FAILURES = [
  {
    Icon: Lock,
    title: "SQLite raises database is locked",
    trigger: "2 or more simultaneous writes",
    symptom: `sqlalchemy.exc.OperationalError: (sqlite3.OperationalError) database is locked`,
    detail:
      "SQLite serializes all writes with a file-level exclusive lock. A second writer does not wait -- it raises immediately. At five concurrent users creating tasks you will see this in the logs. At fifty, the majority of POST requests fail.",
  },
  {
    Icon: Cpu,
    title: "Sync handlers block the ASGI worker pool",
    trigger: "30+ concurrent requests",
    symptom: "p99 latency climbs linearly with concurrency; workers queue up",
    detail:
      "FastAPI runs on Starlette, which is built on ASGI -- an async-native interface. When handlers are plain def instead of async def, each database call blocks the thread for the entire duration of the query. Under load, all available threads are held waiting for I/O and new requests queue behind them.",
  },
  {
    Icon: Server,
    title: "No health endpoint means blind load balancing",
    trigger: "On deployment or pod restart",
    symptom: "Load balancer routes live traffic to an instance that is still starting up",
    detail:
      "There is no /health route. Every load balancer, container orchestrator, and deployment pipeline needs an endpoint to poll before sending traffic. Without one, a pod that is still running database migrations receives requests the moment it starts -- and returns 500s until setup completes.",
  },
];

export function WhatBreaksSection() {
  return (
    <section id="what-breaks">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">What Breaks</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Run the baseline under 100 concurrent requests -- a trivial load -- and three
        failures appear immediately. Each has a distinct root cause and a distinct fix.
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
                triggers at: {trigger}
              </span>
            </div>
            <div className="px-4 py-3 space-y-2">
              <p className="text-[11px]">
                <span className="font-medium text-foreground/80">Symptom: </span>
                <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px] break-all">
                  {symptom}
                </code>
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
