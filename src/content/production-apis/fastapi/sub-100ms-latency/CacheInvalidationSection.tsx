import { CodeDiff } from "@/components/blog/interactive/code-diff";
import type { DiffLine } from "@/components/blog/interactive/code-diff";

const UPDATE_BEFORE = `@app.patch("/tasks/{task_id}", response_model=TaskDetail)
async def update_task(
    task_id: int,
    updates: TaskUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = await db.get(Task, task_id)
    if not task or task.user_id != current_user.id:
        raise HTTPException(status_code=404)
    for field, value in updates.model_dump(exclude_unset=True).items():
        setattr(task, field, value)
    await db.commit()
    await db.refresh(task)
    return task`;

const UPDATE_AFTER = `@app.patch("/tasks/{task_id}", response_model=TaskDetail)
async def update_task(
    task_id: int,
    updates: TaskUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = await db.get(Task, task_id)
    if not task or task.user_id != current_user.id:
        raise HTTPException(status_code=404)
    for field, value in updates.model_dump(exclude_unset=True).items():
        setattr(task, field, value)
    await db.commit()
    await db.refresh(task)

    cache_key = f"task:{current_user.id}:{task_id}"
    await redis_client.delete(cache_key)

    return task`;

const UPDATE_DIFF: DiffLine[] = [
  { type: "context", content: "    await db.commit()" },
  { type: "context", content: "    await db.refresh(task)" },
  { type: "context", content: "" },
  { type: "added",   content: "    cache_key = f\"task:{current_user.id}:{task_id}\"" },
  { type: "added",   content: "    await redis_client.delete(cache_key)" },
  { type: "context", content: "" },
  { type: "context", content: "    return task" },
];

const DELETE_DIFF: DiffLine[] = [
  { type: "context", content: "    await db.delete(task)" },
  { type: "context", content: "    await db.commit()" },
  { type: "context", content: "" },
  { type: "added",   content: "    cache_key = f\"task:{current_user.id}:{task_id}\"" },
  { type: "added",   content: "    await redis_client.delete(cache_key)" },
  { type: "context", content: "" },
  { type: "context", content: "    return Response(status_code=204)" },
];

const INVALIDATION_STRATEGIES = [
  {
    name: "TTL expiry",
    when: "Stale reads are acceptable for N seconds",
    tradeoff: "Simple to implement. Cache serves stale data until TTL expires. Suitable for infrequently updated resources.",
  },
  {
    name: "Explicit delete on write",
    when: "Reads must see the latest write immediately",
    tradeoff: "Next read after a write always misses the cache (cold miss). Adds one Redis call to every update and delete handler.",
  },
  {
    name: "Write-through",
    when: "You want cache hits immediately after writes",
    tradeoff: "Write handler must populate the cache, not just invalidate it. Adds serialization cost to the write path. Cache is always warm but writes are slightly slower.",
  },
];

export function CacheInvalidationSection() {
  return (
    <section id="invalidation">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">Cache Invalidation</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A cache without invalidation is wrong. Readers will see the old version of a task
        for up to TTL seconds after it is updated. For read-heavy, write-infrequent
        workloads, TTL alone is often acceptable. For this API, task updates should be
        immediately visible, so invalidation on write is the right choice.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The pattern is the same for update and delete: commit the database change, then
        delete the cache key. The next read finds no cached entry and fetches the fresh
        record from the database.
      </p>

      <CodeDiff filename="main.py (PATCH /tasks/{id})" before={UPDATE_BEFORE} after={UPDATE_AFTER} diff={UPDATE_DIFF} />

      <div className="mt-4 mb-6">
        <CodeDiff filename="main.py (DELETE /tasks/{id})" before="" after="" diff={DELETE_DIFF} />
      </div>

      <div className="space-y-3">
        {INVALIDATION_STRATEGIES.map(({ name, when, tradeoff }) => (
          <div key={name} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
              <span className="text-[11px] font-semibold">{name}</span>
              <span className="text-[9px] text-muted-foreground font-mono hidden sm:block">
                use when: {when}
              </span>
            </div>
            <div className="px-4 py-3">
              <p className="text-[11px] text-muted-foreground leading-relaxed">{tradeoff}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
        <p className="font-semibold text-foreground/80">What about the list endpoint</p>
        <p className="text-muted-foreground">
          Caching list responses is harder than caching individual records because any
          write to any task in the user's set invalidates the list. The simplest approach
          is not to cache list responses at all and rely on the index and cursor pagination
          from article 3 to keep list queries fast. Cache the leaf nodes (individual tasks);
          let the index serve the list.
        </p>
      </div>
    </section>
  );
}
