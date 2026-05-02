import { CodeDiff } from "@/components/blog/interactive/code-diff";
import type { DiffLine } from "@/components/blog/interactive/code-diff";

const HEALTH_BEFORE = `@app.get("/health")
async def health():
    return {"status": "ok"}`;

const HEALTH_AFTER = `from sqlalchemy import text
import redis.asyncio as redis


@app.get("/health/live")
async def liveness():
    # Process is alive. No dependency checks.
    # If this fails, the orchestrator restarts the pod.
    return {"status": "ok"}


@app.get("/health/ready")
async def readiness():
    # Process is ready to serve traffic.
    # Check dependencies. If any fail, return 503 to stop routing.
    errors: list[str] = []

    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
    except Exception as e:
        errors.append(f"database: {e}")

    try:
        await redis_client.ping()
    except Exception as e:
        errors.append(f"redis: {e}")

    if errors:
        return JSONResponse(
            status_code=503,
            content={"status": "not_ready", "errors": errors},
        )

    return {"status": "ready"}`;

const HEALTH_DIFF: DiffLine[] = [
  { type: "removed", content: "@app.get(\"/health\")" },
  { type: "removed", content: "async def health():" },
  { type: "removed", content: "    return {\"status\": \"ok\"}" },
  { type: "added",   content: "@app.get(\"/health/live\")" },
  { type: "added",   content: "async def liveness():" },
  { type: "added",   content: "    return {\"status\": \"ok\"}" },
  { type: "context", content: "" },
  { type: "context", content: "" },
  { type: "added",   content: "@app.get(\"/health/ready\")" },
  { type: "added",   content: "async def readiness():" },
  { type: "added",   content: "    errors: list[str] = []" },
  { type: "added",   content: "    try:" },
  { type: "added",   content: "        async with engine.connect() as conn:" },
  { type: "added",   content: "            await conn.execute(text(\"SELECT 1\"))" },
  { type: "added",   content: "    except Exception as e:" },
  { type: "added",   content: "        errors.append(f\"database: {e}\")" },
  { type: "added",   content: "    ..." },
  { type: "added",   content: "    if errors:" },
  { type: "added",   content: "        return JSONResponse(status_code=503, content={...})" },
  { type: "added",   content: "    return {\"status\": \"ready\"}" },
];

const KUBERNETES_CONFIG = `# kubernetes deployment excerpt
livenessProbe:
  httpGet:
    path: /health/live
    port: 8000
  initialDelaySeconds: 5
  periodSeconds: 10
  failureThreshold: 3    # restart after 3 consecutive failures

readinessProbe:
  httpGet:
    path: /health/ready
    port: 8000
  initialDelaySeconds: 10
  periodSeconds: 5
  failureThreshold: 2    # stop routing after 2 consecutive failures`;

export function HealthChecksSection() {
  return (
    <section id="health-checks">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">Readiness vs Liveness</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The existing{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">/health</code>{" "}
        endpoint always returns 200. It does not check the database connection or the
        Redis connection. A newly started pod that cannot reach the database will report
        healthy and receive traffic until the first actual request fails.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Split into two endpoints. Liveness is a heartbeat: is the process alive? If
        liveness fails, the orchestrator restarts the pod — so keep it simple and never
        check external dependencies. Readiness is a capability check: can this pod accept
        traffic right now? If readiness fails, the load balancer stops routing to this
        instance until it recovers.
      </p>

      <CodeDiff filename="main.py" before={HEALTH_BEFORE} after={HEALTH_AFTER} diff={HEALTH_DIFF} />

      <div className="bg-card border border-border rounded-xl p-4 mt-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          kubernetes probe configuration
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {KUBERNETES_CONFIG}
        </pre>
      </div>

      <div className="mt-4 p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
        <p className="font-semibold text-foreground/80">Never add external dependency checks to liveness</p>
        <p className="text-muted-foreground">
          If liveness checks the database and the database is temporarily slow, liveness
          fails, Kubernetes restarts the pod, the new pod also checks the database, also
          fails, and Kubernetes restarts it again — a restart loop that makes the outage
          worse. Liveness answers only "is this process functioning." Readiness answers
          "should traffic be routed here."
        </p>
      </div>
    </section>
  );
}
