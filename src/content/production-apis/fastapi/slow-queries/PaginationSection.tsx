import { CodeDiff } from "@/components/blog/interactive/code-diff";
import type { DiffLine } from "@/components/blog/interactive/code-diff";

const SCHEMA_BEFORE = `class TaskCreate(BaseModel):
    title: str
    description: str | None = None

class TaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    done: bool
    created_at: datetime`;

const SCHEMA_AFTER = `from datetime import datetime

class TaskCreate(BaseModel):
    title: str
    description: str | None = None

class TaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    done: bool
    created_at: datetime

class TaskListResponse(BaseModel):
    items: list[TaskResponse]
    next_cursor: datetime | None`;

const SCHEMA_DIFF: DiffLine[] = [
  { type: "added",   content: "from datetime import datetime" },
  { type: "context", content: "" },
  { type: "context", content: "class TaskCreate(BaseModel):" },
  { type: "context", content: "    title: str" },
  { type: "context", content: "    description: str | None = None" },
  { type: "context", content: "" },
  { type: "context", content: "class TaskResponse(BaseModel):" },
  { type: "context", content: "    model_config = ConfigDict(from_attributes=True)" },
  { type: "context", content: "" },
  { type: "context", content: "    id: int" },
  { type: "context", content: "    title: str" },
  { type: "context", content: "    description: str | None" },
  { type: "context", content: "    done: bool" },
  { type: "context", content: "    created_at: datetime" },
  { type: "context", content: "" },
  { type: "added",   content: "class TaskListResponse(BaseModel):" },
  { type: "added",   content: "    items: list[TaskResponse]" },
  { type: "added",   content: "    next_cursor: datetime | None" },
];

const ENDPOINT_BEFORE = `@app.get("/tasks", response_model=list[TaskResponse])
async def list_tasks(
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Task).offset(skip).limit(limit))
    return result.scalars().all()`;

const ENDPOINT_AFTER = `@app.get("/tasks", response_model=TaskListResponse)
async def list_tasks(
    cursor: datetime | None = Query(default=None),
    limit: int = Query(default=20, le=100),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Task)
        .order_by(Task.created_at.desc())
        .limit(limit + 1)
    )
    if cursor:
        stmt = stmt.where(Task.created_at < cursor)
    result = await db.execute(stmt)
    tasks = result.scalars().all()
    has_more = len(tasks) > limit
    items = tasks[:limit]
    return TaskListResponse(
        items=items,
        next_cursor=items[-1].created_at if has_more else None,
    )`;

const ENDPOINT_DIFF: DiffLine[] = [
  { type: "removed", content: "@app.get(\"/tasks\", response_model=list[TaskResponse])" },
  { type: "added",   content: "@app.get(\"/tasks\", response_model=TaskListResponse)" },
  { type: "context", content: "async def list_tasks(" },
  { type: "removed", content: "    skip: int = 0," },
  { type: "removed", content: "    limit: int = 20," },
  { type: "added",   content: "    cursor: datetime | None = Query(default=None)," },
  { type: "added",   content: "    limit: int = Query(default=20, le=100)," },
  { type: "context", content: "    db: AsyncSession = Depends(get_db)," },
  { type: "context", content: "):" },
  { type: "removed", content: "    result = await db.execute(select(Task).offset(skip).limit(limit))" },
  { type: "removed", content: "    return result.scalars().all()" },
  { type: "added",   content: "    stmt = (" },
  { type: "added",   content: "        select(Task)" },
  { type: "added",   content: "        .order_by(Task.created_at.desc())" },
  { type: "added",   content: "        .limit(limit + 1)" },
  { type: "added",   content: "    )" },
  { type: "added",   content: "    if cursor:" },
  { type: "added",   content: "        stmt = stmt.where(Task.created_at < cursor)" },
  { type: "added",   content: "    result = await db.execute(stmt)" },
  { type: "added",   content: "    tasks = result.scalars().all()" },
  { type: "added",   content: "    has_more = len(tasks) > limit" },
  { type: "added",   content: "    items = tasks[:limit]" },
  { type: "added",   content: "    return TaskListResponse(" },
  { type: "added",   content: "        items=items," },
  { type: "added",   content: "        next_cursor=items[-1].created_at if has_more else None," },
  { type: "added",   content: "    )" },
];

export function PaginationSection() {
  return (
    <section id="cursor-pagination">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Cursor-Based Pagination
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The index fixes the sort cost. It does not fix offset pagination.
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded"> OFFSET 10000 LIMIT 20</code> tells
        PostgreSQL to find and skip the first 10,000 matching rows before returning 20.
        Even with an index, the database must traverse 10,020 index entries -- and this
        cost grows linearly with the page number.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Cursor-based pagination replaces the numeric offset with a position in the
        result set. The client receives the <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">created_at</code> timestamp
        of the last item on the current page as a cursor. The next request passes that
        timestamp as a <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">WHERE created_at &lt; cursor</code> condition.
        PostgreSQL uses the index to jump directly to that position -- page 500 costs
        the same as page 1.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        {[
          {
            heading: "Offset pagination",
            rows: [
              "Page 1: OFFSET 0 -- reads 20 rows",
              "Page 2: OFFSET 20 -- reads 40 rows",
              "Page 100: OFFSET 1980 -- reads 2,000 rows",
              "Page 500: OFFSET 9980 -- reads 10,000 rows",
              "Cost: O(page_number x limit)",
            ],
            accent: "border-red-500/30",
          },
          {
            heading: "Cursor pagination",
            rows: [
              "Page 1: WHERE TRUE -- reads 21 rows",
              "Page 2: WHERE created_at < t1 -- reads 21 rows",
              "Page 100: WHERE created_at < t99 -- reads 21 rows",
              "Page 500: WHERE created_at < t499 -- reads 21 rows",
              "Cost: O(limit) regardless of page number",
            ],
            accent: "border-emerald-500/30",
          },
        ].map(({ heading, rows, accent }) => (
          <div key={heading} className={`bg-card border rounded-xl p-3 ${accent}`}>
            <p className="text-[11px] font-semibold mb-2">{heading}</p>
            <ul className="space-y-1">
              {rows.map((row, i) => (
                <li key={i} className="text-[10px] font-mono text-muted-foreground">{row}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-[13px] font-semibold mb-2 mt-6">schemas.py</p>
      <CodeDiff filename="schemas.py" before={SCHEMA_BEFORE} after={SCHEMA_AFTER} diff={SCHEMA_DIFF} />

      <p className="text-[13px] font-semibold mb-2 mt-6">main.py (list endpoint)</p>
      <CodeDiff filename="main.py" before={ENDPOINT_BEFORE} after={ENDPOINT_AFTER} diff={ENDPOINT_DIFF} />

      <div className="mt-4 p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
        <p className="font-semibold text-foreground/80">The limit + 1 trick</p>
        <p className="text-muted-foreground">
          Fetching <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">limit + 1</code> rows
          lets the handler determine whether a next page exists without a separate
          <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]"> COUNT(*)</code> query.
          If 21 rows come back when the client asked for 20, there is a next page.
          The 21st row is discarded -- it is only used to detect the boundary.
          COUNT(*) on a large table requires its own full scan and should be avoided in the hot path.
        </p>
      </div>
    </section>
  );
}
