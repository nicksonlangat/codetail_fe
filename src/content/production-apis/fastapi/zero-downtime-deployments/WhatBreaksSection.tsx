import { Zap, GitBranch, Activity } from "lucide-react";

const FAILURES = [
  {
    Icon: Zap,
    title: "Killing the process mid-request drops in-flight work",
    trigger: "Any deployment that sends SIGKILL or SIGTERM to the running process",
    symptom: "Clients receive connection reset errors. POST /tasks requests disappear. The task was never written.",
    detail:
      "When a deployment replaces a process, the OS sends SIGTERM to signal shutdown. Without a handler, the process exits immediately — mid-request. Depending on the database transaction state, the write may or may not have committed. Clients see a network error or 502 from the load balancer.",
  },
  {
    Icon: GitBranch,
    title: "Running migration before deploying new code breaks the live version",
    trigger: "Any migration that renames, removes, or changes the type of a column in use",
    symptom: "Alembic upgrade runs successfully. Within seconds, the live API starts returning 500s because the column it reads no longer exists.",
    detail:
      "There is always a period when old code and new code are both running: during the rollout itself. If the migration changes a column that old code depends on, old instances fail immediately after the migration runs. The safe sequence is additive first, code second, cleanup third.",
  },
  {
    Icon: Activity,
    title: "No readiness probe means traffic hits a pod before it is ready",
    trigger: "Any deployment with a slow startup (loading models, warming caches, establishing connections)",
    symptom: "New pods receive traffic before their database connection pool is initialized. First requests return 503 or fail with connection errors.",
    detail:
      "Liveness and readiness are different signals. Liveness answers 'is the process alive'. Readiness answers 'is the process ready to serve traffic'. Kubernetes (and most orchestrators) use both. Without a readiness endpoint, the load balancer routes to newly started instances before they are capable of handling requests.",
  },
];

export function WhatBreaksSection() {
  return (
    <section id="what-breaks">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">What Breaks</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Zero downtime means zero dropped requests and zero data loss during a deployment.
        Three independent failure modes prevent this today: in-flight requests die when the
        process is replaced, schema changes break the running version, and new instances
        receive traffic before they are ready.
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
