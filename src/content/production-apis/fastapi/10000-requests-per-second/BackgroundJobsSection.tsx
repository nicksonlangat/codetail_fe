import { CodeDiff } from "@/components/blog/interactive/code-diff";
import type { DiffLine } from "@/components/blog/interactive/code-diff";

const CELERY_SETUP = `# worker.py
from celery import Celery
import os

celery_app = Celery(
    "tasks",
    broker=os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/1"),
    backend=os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/2"),
)

celery_app.conf.task_serializer = "json"
celery_app.conf.result_expires = 3600  # 1 hour


@celery_app.task(
    bind=True,
    max_retries=3,
    default_retry_delay=60,
    acks_late=True,  # only ack after the task completes (not on receipt)
)
def process_task_created(self, task_id: int, user_id: int):
    try:
        # Example: send webhook, trigger notification, run enrichment
        send_task_created_webhook(task_id, user_id)
    except Exception as exc:
        raise self.retry(exc=exc)`;

const POST_BEFORE = `@app.post("/tasks", status_code=201, response_model=TaskDetail)
async def create_task(
    body: TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = Task(
        title=body.title,
        description=body.description,
        user_id=current_user.id,
    )
    db.add(task)
    await db.commit()
    await db.refresh(task)

    # Synchronous -- client waits for this
    await send_task_created_webhook(task.id, current_user.id)

    return task`;

const POST_AFTER = `@app.post("/tasks", status_code=202, response_model=TaskCreatedResponse)
async def create_task(
    body: TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = Task(
        title=body.title,
        description=body.description,
        user_id=current_user.id,
    )
    db.add(task)
    await db.commit()
    await db.refresh(task)

    # Async -- enqueue and return immediately
    job = process_task_created.delay(task.id, current_user.id)

    return TaskCreatedResponse(
        id=task.id,
        title=task.title,
        status_url=f"/tasks/{task.id}/status",
        job_id=job.id,
    )`;

const POST_DIFF: DiffLine[] = [
  { type: "removed", content: "@app.post(\"/tasks\", status_code=201, response_model=TaskDetail)" },
  { type: "added",   content: "@app.post(\"/tasks\", status_code=202, response_model=TaskCreatedResponse)" },
  { type: "context", content: "async def create_task(" },
  { type: "context", content: "    body: TaskCreate," },
  { type: "context", content: "    db: AsyncSession = Depends(get_db)," },
  { type: "context", content: "    current_user: User = Depends(get_current_user)," },
  { type: "context", content: "):" },
  { type: "context", content: "    task = Task(...)" },
  { type: "context", content: "    db.add(task)" },
  { type: "context", content: "    await db.commit()" },
  { type: "context", content: "    await db.refresh(task)" },
  { type: "context", content: "" },
  { type: "removed", content: "    await send_task_created_webhook(task.id, current_user.id)" },
  { type: "removed", content: "    return task" },
  { type: "added",   content: "    job = process_task_created.delay(task.id, current_user.id)" },
  { type: "added",   content: "    return TaskCreatedResponse(id=task.id, job_id=job.id, ...)" },
];

export function BackgroundJobsSection() {
  return (
    <section id="background-jobs">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">Background Job Queue</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Any work that does not need to complete before the client receives a response
        should not run in the request handler. Webhooks, notification emails, downstream
        API calls, enrichment logic — these are not the client's concern. They belong in
        a background worker that processes them asynchronously.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The pattern changes the HTTP contract: POST /tasks returns 202 Accepted instead
        of 201 Created. The response includes the resource ID and a{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">status_url</code>{" "}
        the client can poll if it needs to track job completion. The task is written to
        the database synchronously before the response returns, so the resource is
        immediately available via GET.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          requirements.txt + worker.py
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {`celery[redis]==5.3.6   # distributed task queue backed by Redis\n\n`}{CELERY_SETUP}
        </pre>
      </div>

      <CodeDiff filename="main.py" before={POST_BEFORE} after={POST_AFTER} diff={POST_DIFF} />

      <div className="mt-4 p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
        <p className="font-semibold text-foreground/80">acks_late prevents work loss on worker crash</p>
        <p className="text-muted-foreground">
          By default, Celery acknowledges a task when the worker receives it (before
          processing). If the worker crashes mid-task, the message is lost. With{" "}
          <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">acks_late=True</code>,
          the message is acknowledged only after the task completes successfully. A crashed
          worker returns the unacknowledged message to the queue for another worker to retry.
          Combine with idempotent task implementations to avoid double-processing on retry.
        </p>
      </div>
    </section>
  );
}
