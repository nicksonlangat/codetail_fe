import { CodeDiff } from "@/components/blog/interactive/code-diff";
import type { DiffLine } from "@/components/blog/interactive/code-diff";

const GET_BEFORE = `@app.get("/tasks/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    if task is None:
        raise HTTPException(status_code=404, detail="Not found")
    return task`;

const GET_AFTER = `@app.get("/tasks/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    if task is None:
        raise HTTPException(status_code=404, detail="Not found")
    if task.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    return task`;

const GET_DIFF: DiffLine[] = [
  { type: "context", content: "@app.get(\"/tasks/{task_id}\", response_model=TaskResponse)" },
  { type: "context", content: "async def get_task(" },
  { type: "context", content: "    task_id: int," },
  { type: "context", content: "    db: AsyncSession = Depends(get_db)," },
  { type: "context", content: "    current_user: User = Depends(get_current_user)," },
  { type: "context", content: "):" },
  { type: "context", content: "    result = await db.execute(select(Task).where(Task.id == task_id))" },
  { type: "context", content: "    task = result.scalar_one_or_none()" },
  { type: "context", content: "    if task is None:" },
  { type: "context", content: "        raise HTTPException(status_code=404, detail=\"Not found\")" },
  { type: "added",   content: "    if task.user_id != current_user.id:" },
  { type: "added",   content: "        raise HTTPException(status_code=403, detail=\"Forbidden\")" },
  { type: "context", content: "    return task" },
];

const PATCH_DIFF: DiffLine[] = [
  { type: "context", content: "@app.patch(\"/tasks/{task_id}\", response_model=TaskResponse)" },
  { type: "context", content: "async def update_task(" },
  { type: "context", content: "    task_id: int," },
  { type: "context", content: "    body: TaskUpdate," },
  { type: "context", content: "    db: AsyncSession = Depends(get_db)," },
  { type: "context", content: "    current_user: User = Depends(get_current_user)," },
  { type: "context", content: "):" },
  { type: "context", content: "    result = await db.execute(select(Task).where(Task.id == task_id))" },
  { type: "context", content: "    task = result.scalar_one_or_none()" },
  { type: "context", content: "    if task is None:" },
  { type: "context", content: "        raise HTTPException(status_code=404, detail=\"Not found\")" },
  { type: "added",   content: "    if task.user_id != current_user.id:" },
  { type: "added",   content: "        raise HTTPException(status_code=403, detail=\"Forbidden\")" },
  { type: "context", content: "    for field, value in body.model_dump(exclude_unset=True).items():" },
  { type: "context", content: "        setattr(task, field, value)" },
  { type: "context", content: "    await db.commit()" },
  { type: "context", content: "    await db.refresh(task)" },
  { type: "context", content: "    return task" },
];

export function IdorSection() {
  return (
    <section id="idor">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Object-Level Authorization and IDOR
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Scoping the list endpoint is not sufficient. Any authenticated user who knows or guesses
        a task ID can access it directly. This class of vulnerability is called an
        Insecure Direct Object Reference (IDOR): the API exposes an internal object ID and
        uses it to fetch a record without verifying the caller owns it.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        {[
          {
            heading: "The attack",
            lines: [
              "User A registers, creates a task.",
              "Task is assigned id=1 by the database.",
              "User B registers, authenticates, has a valid JWT.",
              "User B sends GET /tasks/1.",
              "Server fetches the row, finds it, returns it.",
              "User B sees User A's task.",
            ],
            accent: "border-red-500/30",
          },
          {
            heading: "The fix",
            lines: [
              "Fetch the row by id as before.",
              "Return 404 if no row exists.",
              "Compare task.user_id to current_user.id.",
              "Return 403 if they differ.",
              "Return the task only if they match.",
              "Two lines added, IDOR eliminated.",
            ],
            accent: "border-emerald-500/30",
          },
        ].map(({ heading, lines, accent }) => (
          <div key={heading} className={`bg-card border rounded-xl p-3 ${accent}`}>
            <p className="text-[11px] font-semibold mb-2">{heading}</p>
            <ol className="space-y-1">
              {lines.map((line, i) => (
                <li key={i} className="text-[10px] font-mono text-muted-foreground">
                  {i + 1}. {line}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <p className="text-[13px] font-semibold mb-2">GET /tasks/{"{task_id}"}</p>
      <CodeDiff filename="main.py" before={GET_BEFORE} after={GET_AFTER} diff={GET_DIFF} />

      <p className="text-[13px] font-semibold mb-2 mt-6">PATCH /tasks/{"{task_id}"} and DELETE /tasks/{"{task_id}"}</p>
      <p className="text-[15px] leading-relaxed text-foreground/90 mb-3">
        The same two-line check applies to every endpoint that accepts an ID. The pattern
        is identical: fetch, 404 if missing, 403 if wrong owner, proceed if correct.
      </p>
      <CodeDiff filename="main.py" before="" after="" diff={PATCH_DIFF} />

      <div className="mt-6 space-y-3">
        <div className="p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
          <p className="font-semibold text-foreground/80">Why 403, not 404, when the owner is wrong</p>
          <p className="text-muted-foreground">
            Returning 404 when a record exists but belongs to another user leaks no information
            about whether the resource exists at all -- a security-conscious choice sometimes
            called "security through obscurity." Returning 403 is more informative: it tells
            the client the resource exists but access is denied. Both are defensible; 403 is
            semantically correct and makes client-side debugging easier. The tradeoff:
            a 404 response prevents enumeration attacks (an attacker cannot confirm that
            id=1 exists), while 403 makes authorization errors debuggable without
            server-side log access.
          </p>
        </div>

        <div className="p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
          <p className="font-semibold text-foreground/80">IDs that are hard to guess do not fix IDOR</p>
          <p className="text-muted-foreground">
            A common response to IDOR reports is "we use UUIDs, so they can't guess the ID."
            This is not a fix. UUIDs are hard to guess in isolation, but they appear in URLs,
            logs, response bodies, and shared links. Once an ID leaks through any channel,
            the authorization check is the only thing standing between the caller and the record.
            Always check ownership -- never rely on ID unpredictability.
          </p>
        </div>
      </div>
    </section>
  );
}
