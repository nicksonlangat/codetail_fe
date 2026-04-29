import { BaselineApiExplorer } from "@/components/blog/interactive/baseline-api-explorer";

export function EndpointsSection() {
  return (
    <section id="the-endpoints">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">The Three Endpoints</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Three endpoints, each as simple as possible. Every handler is synchronous, uses a
        SQLAlchemy session injected via <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">Depends(get_db)</code>,
        and returns Pydantic models directly. FastAPI handles the serialization.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        The list endpoint uses offset pagination: skip N rows and return the next M.
        This is the most common first implementation and the first thing that will need replacing
        once the table grows past a few hundred thousand rows.
      </p>

      <BaselineApiExplorer />

      <div className="bg-card border border-border rounded-xl p-4 mt-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          main.py
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
{`from fastapi import FastAPI, Depends, HTTPException
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
def list_tasks(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    return db.query(Task).offset(skip).limit(limit).all()`}
        </pre>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-4">
        Start the server with <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">uvicorn main:app --reload</code>.
        The API is available at <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">http://localhost:8000</code>
        and the auto-generated docs at <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">/docs</code>.
        It works. On your laptop, it is fast.
      </p>
    </section>
  );
}
