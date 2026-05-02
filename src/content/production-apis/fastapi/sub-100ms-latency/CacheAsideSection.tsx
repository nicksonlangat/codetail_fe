import { CodeDiff } from "@/components/blog/interactive/code-diff";
import type { DiffLine } from "@/components/blog/interactive/code-diff";

const REDIS_SETUP = `import redis.asyncio as redis
import json
import os

redis_client = redis.from_url(
    os.getenv("REDIS_URL", "redis://localhost:6379"),
    encoding="utf-8",
    decode_responses=True,
)

TASK_CACHE_TTL = 300  # seconds`;

const GET_BEFORE = `@app.get("/tasks/{task_id}", response_model=TaskDetail)
async def get_task(
    task_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = await db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404)
    if task.user_id != current_user.id:
        raise HTTPException(status_code=403)
    return task`;

const GET_AFTER = `@app.get("/tasks/{task_id}", response_model=TaskDetail)
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
    if not task:
        raise HTTPException(status_code=404)
    if task.user_id != current_user.id:
        raise HTTPException(status_code=403)

    await redis_client.setex(
        cache_key,
        TASK_CACHE_TTL,
        json.dumps(TaskDetail.model_validate(task).model_dump(mode="json")),
    )
    return task`;

const GET_DIFF: DiffLine[] = [
  { type: "context", content: "@app.get(\"/tasks/{task_id}\", response_model=TaskDetail)" },
  { type: "context", content: "async def get_task(" },
  { type: "context", content: "    task_id: int," },
  { type: "context", content: "    db: AsyncSession = Depends(get_db)," },
  { type: "context", content: "    current_user: User = Depends(get_current_user)," },
  { type: "context", content: "):" },
  { type: "added",   content: "    cache_key = f\"task:{current_user.id}:{task_id}\"" },
  { type: "context", content: "" },
  { type: "added",   content: "    cached = await redis_client.get(cache_key)" },
  { type: "added",   content: "    if cached:" },
  { type: "added",   content: "        return json.loads(cached)" },
  { type: "context", content: "" },
  { type: "context", content: "    task = await db.get(Task, task_id)" },
  { type: "context", content: "    if not task:" },
  { type: "context", content: "        raise HTTPException(status_code=404)" },
  { type: "context", content: "    if task.user_id != current_user.id:" },
  { type: "context", content: "        raise HTTPException(status_code=403)" },
  { type: "context", content: "" },
  { type: "added",   content: "    await redis_client.setex(" },
  { type: "added",   content: "        cache_key," },
  { type: "added",   content: "        TASK_CACHE_TTL," },
  { type: "added",   content: "        json.dumps(TaskDetail.model_validate(task).model_dump(mode=\"json\"))," },
  { type: "added",   content: "    )" },
  { type: "context", content: "    return task" },
];

export function CacheAsideSection() {
  return (
    <section id="cache-aside">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">Redis Cache-Aside</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Cache-aside is the simplest correct caching pattern. The handler checks the cache
        first. On a miss, it reads from the database, writes to the cache, and returns the
        result. On a hit, it returns the cached value directly. The cache is never written
        without a preceding database read.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The cache key includes the{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">user_id</code>.
        This is not just a performance detail — it is a security requirement. Without the
        user ID in the key, user A's cached task would be served to user B if they request
        the same task ID. The authorization check in the handler would never run on a cache hit.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          requirements.txt + cache setup
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {`redis[asyncio]==5.0.1  # async Redis client\n\n`}{REDIS_SETUP}
        </pre>
      </div>

      <CodeDiff filename="main.py" before={GET_BEFORE} after={GET_AFTER} diff={GET_DIFF} />

      <div className="mt-4 p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
        <p className="font-semibold text-foreground/80">Why 300 seconds (5 minutes)</p>
        <p className="text-muted-foreground">
          A task record changes infrequently relative to how often it is read. A 5-minute
          TTL means a viewer sees a stale update for at most 5 minutes after a write. For
          most task management workloads this is acceptable. If your use case requires
          immediate consistency after writes, use explicit invalidation (covered next)
          and a longer TTL as the safety net.
        </p>
      </div>
    </section>
  );
}
