import { CodeDiff } from "@/components/blog/interactive/code-diff";
import type { DiffLine } from "@/components/blog/interactive/code-diff";

const FALLTHROUGH_BEFORE = `@app.get("/tasks/{task_id}", response_model=TaskDetail)
async def get_task(
    task_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cache_key = f"task:{current_user.id}:{task_id}"
    cached = await redis_client.get(cache_key)
    if cached:
        return json.loads(cached)

    task = await db.get(Task, task_id)
    if not task or task.user_id != current_user.id:
        raise HTTPException(status_code=404)

    await redis_client.setex(cache_key, TASK_CACHE_TTL, json.dumps(...))
    return task`;

const FALLTHROUGH_AFTER = `@app.get("/tasks/{task_id}", response_model=TaskDetail)
async def get_task(
    task_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cache_key = f"task:{current_user.id}:{task_id}"

    try:
        cached = await redis_breaker.call(redis_client.get, cache_key)
        if cached:
            return json.loads(cached)
    except (redis.RedisError, CircuitOpenError):
        # Cache unavailable -- fall through to the database.
        # Log it; don't fail the request.
        logger.warning("cache_miss_fallthrough", task_id=task_id)

    task = await db.get(Task, task_id)
    if not task or task.user_id != current_user.id:
        raise HTTPException(status_code=404)

    try:
        await redis_breaker.call(
            redis_client.setex, cache_key, TASK_CACHE_TTL, json.dumps(...)
        )
    except (redis.RedisError, CircuitOpenError):
        pass  # failed to cache; serve from db, log separately

    return task`;

const FALLTHROUGH_DIFF: DiffLine[] = [
  { type: "context", content: "    cache_key = f\"task:{current_user.id}:{task_id}\"" },
  { type: "context", content: "" },
  { type: "removed", content: "    cached = await redis_client.get(cache_key)" },
  { type: "removed", content: "    if cached:" },
  { type: "removed", content: "        return json.loads(cached)" },
  { type: "added",   content: "    try:" },
  { type: "added",   content: "        cached = await redis_breaker.call(redis_client.get, cache_key)" },
  { type: "added",   content: "        if cached:" },
  { type: "added",   content: "            return json.loads(cached)" },
  { type: "added",   content: "    except (redis.RedisError, CircuitOpenError):" },
  { type: "added",   content: "        logger.warning(\"cache_miss_fallthrough\", task_id=task_id)" },
  { type: "context", content: "" },
  { type: "context", content: "    task = await db.get(Task, task_id)" },
  { type: "context", content: "    if not task or task.user_id != current_user.id:" },
  { type: "context", content: "        raise HTTPException(status_code=404)" },
  { type: "context", content: "" },
  { type: "removed", content: "    await redis_client.setex(cache_key, TASK_CACHE_TTL, json.dumps(...))" },
  { type: "added",   content: "    try:" },
  { type: "added",   content: "        await redis_breaker.call(redis_client.setex, ...)" },
  { type: "added",   content: "    except (redis.RedisError, CircuitOpenError):" },
  { type: "added",   content: "        pass" },
  { type: "context", content: "" },
  { type: "context", content: "    return task" },
];

export function CacheFallthroughSection() {
  return (
    <section id="cache-fallthrough">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">Cache Fallthrough</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The cache is optional. The database is authoritative. If Redis is unavailable, the
        correct behavior is to fall through to the database and serve the request, not to
        fail the request. A cache outage should cause a latency increase, not an error rate
        increase.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Wrap both the cache read and the cache write in try/except. Catch Redis errors
        and{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">CircuitOpenError</code>{" "}
        (from the circuit breaker). Log the fallthrough so you can see when it is
        happening. Silently eating the exception without logging it makes cache outages
        invisible — you need to know when p95 is creeping up because every request is a
        cache miss.
      </p>

      <CodeDiff filename="main.py" before={FALLTHROUGH_BEFORE} after={FALLTHROUGH_AFTER} diff={FALLTHROUGH_DIFF} />

      <div className="mt-4 p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
        <p className="font-semibold text-foreground/80">What to alert on vs what to log</p>
        <p className="text-muted-foreground">
          Log every cache fallthrough at WARNING level. Alert when the fallthrough rate
          exceeds a threshold (e.g., more than 10% of detail requests are cache misses for
          more than 2 minutes). A brief spike during a Redis restart is expected. A
          sustained high miss rate means either Redis is down or the circuit is stuck open.
          The Prometheus metric from article 5 makes this alertable without code changes.
        </p>
      </div>
    </section>
  );
}
