import { CodeDiff } from "@/components/blog/interactive/code-diff";
import type { DiffLine } from "@/components/blog/interactive/code-diff";

const BEFORE = `from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import Base, engine, get_db
from models import Task
from schemas import TaskCreate, TaskResponse

Base.metadata.create_all(bind=engine)
app = FastAPI(title="Task API")

@app.post("/tasks", status_code=201, response_model=TaskResponse)
def create_task(payload: TaskCreate, db: Session = Depends(get_db)):
    task = Task(**payload.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@app.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.get("/tasks", response_model=list[TaskResponse])
def list_tasks(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(Task).offset(skip).limit(limit).all()`;

const AFTER = `from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import Base, engine, get_db
from models import Task
from schemas import TaskCreate, TaskResponse

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(title="Task API", lifespan=lifespan)

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/tasks", status_code=201, response_model=TaskResponse)
async def create_task(payload: TaskCreate, db: AsyncSession = Depends(get_db)):
    task = Task(**payload.model_dump())
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task

@app.get("/tasks/{task_id}", response_model=TaskResponse)
async def get_task(task_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.get("/tasks", response_model=list[TaskResponse])
async def list_tasks(
    skip: int = 0, limit: int = 20, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Task).offset(skip).limit(limit))
    return result.scalars().all()`;

const DIFF: DiffLine[] = [
  { type: "added",   content: "from contextlib import asynccontextmanager" },
  { type: "context", content: "from fastapi import FastAPI, Depends, HTTPException" },
  { type: "removed", content: "from sqlalchemy.orm import Session" },
  { type: "added",   content: "from sqlalchemy.ext.asyncio import AsyncSession" },
  { type: "added",   content: "from sqlalchemy import select" },
  { type: "context", content: "from database import Base, engine, get_db" },
  { type: "context", content: "from models import Task" },
  { type: "context", content: "from schemas import TaskCreate, TaskResponse" },
  { type: "context", content: "" },
  { type: "removed", content: "Base.metadata.create_all(bind=engine)" },
  { type: "removed", content: "app = FastAPI(title=\"Task API\")" },
  { type: "added",   content: "@asynccontextmanager" },
  { type: "added",   content: "async def lifespan(app: FastAPI):" },
  { type: "added",   content: "    async with engine.begin() as conn:" },
  { type: "added",   content: "        await conn.run_sync(Base.metadata.create_all)" },
  { type: "added",   content: "    yield" },
  { type: "context", content: "" },
  { type: "added",   content: 'app = FastAPI(title="Task API", lifespan=lifespan)' },
  { type: "context", content: "" },
  { type: "added",   content: '@app.get("/health")' },
  { type: "added",   content: "async def health():" },
  { type: "added",   content: '    return {"status": "ok"}' },
  { type: "context", content: "" },
  { type: "context", content: '@app.post("/tasks", status_code=201, response_model=TaskResponse)' },
  { type: "removed", content: "def create_task(payload: TaskCreate, db: Session = Depends(get_db)):" },
  { type: "added",   content: "async def create_task(payload: TaskCreate, db: AsyncSession = Depends(get_db)):" },
  { type: "context", content: "    task = Task(**payload.model_dump())" },
  { type: "context", content: "    db.add(task)" },
  { type: "removed", content: "    db.commit()" },
  { type: "removed", content: "    db.refresh(task)" },
  { type: "added",   content: "    await db.commit()" },
  { type: "added",   content: "    await db.refresh(task)" },
  { type: "context", content: "    return task" },
  { type: "context", content: "" },
  { type: "context", content: '@app.get("/tasks/{task_id}", response_model=TaskResponse)' },
  { type: "removed", content: "def get_task(task_id: int, db: Session = Depends(get_db)):" },
  { type: "removed", content: "    task = db.query(Task).filter(Task.id == task_id).first()" },
  { type: "added",   content: "async def get_task(task_id: int, db: AsyncSession = Depends(get_db)):" },
  { type: "added",   content: "    result = await db.execute(select(Task).where(Task.id == task_id))" },
  { type: "added",   content: "    task = result.scalar_one_or_none()" },
  { type: "context", content: "    if not task:" },
  { type: "context", content: '        raise HTTPException(status_code=404, detail="Task not found")' },
  { type: "context", content: "    return task" },
];

export function AsyncSection() {
  return (
    <section id="async-handlers">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">Async Handlers and Health Check</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Three changes to <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">main.py</code>: every
        handler becomes <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">async def</code>,
        the SQLAlchemy query syntax switches from the legacy ORM style to the 2.x
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded"> select()</code> API,
        and a <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">/health</code> endpoint is added.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">lifespan</code> context
        manager replaces the module-level <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">create_all</code> call.
        With an async engine, schema creation must run inside an async context -- and
        the lifespan hook is the correct place for startup work in modern FastAPI.
      </p>

      <CodeDiff filename="main.py" before={BEFORE} after={AFTER} diff={DIFF} />

      <div className="mt-6 bg-muted/30 border border-border rounded-xl p-4 text-[11px] space-y-2">
        <p className="font-semibold text-foreground/80">Why the query syntax changed</p>
        <p className="text-muted-foreground">
          The legacy <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">db.query(Task).filter(...)</code> syntax
          is synchronous and not supported by the async session. The 2.x
          <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]"> select(Task).where(...)</code> form
          returns an awaitable that the async session executes without blocking.
          The difference is not cosmetic -- the old form will raise a
          <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]"> MissingGreenlet</code> error
          if called on an async session.
        </p>
      </div>
    </section>
  );
}
