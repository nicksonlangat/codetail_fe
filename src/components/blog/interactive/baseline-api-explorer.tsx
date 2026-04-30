"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

const ENDPOINTS = [
  {
    method: "POST",
    path: "/tasks",
    description: "Create a new task",
    code: `@app.post("/tasks", status_code=201, response_model=TaskResponse)
def create_task(payload: TaskCreate, db: Session = Depends(get_db)):
    task = Task(**payload.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task`,
    request: `POST /tasks
Content-Type: application/json

{
  "title": "Write the baseline article",
  "description": "Keep it simple"
}`,
    response: `HTTP 201 Created

{
  "id": 1,
  "title": "Write the baseline article",
  "description": "Keep it simple",
  "done": false,
  "created_at": "2026-04-29T09:00:00Z"
}`,
  },
  {
    method: "GET",
    path: "/tasks/{id}",
    description: "Fetch a task by ID",
    code: `@app.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task`,
    request: `GET /tasks/1`,
    response: `HTTP 200 OK

{
  "id": 1,
  "title": "Write the baseline article",
  "description": "Keep it simple",
  "done": false,
  "created_at": "2026-04-29T09:00:00Z"
}`,
  },
  {
    method: "GET",
    path: "/tasks",
    description: "List tasks (offset paginated)",
    code: `@app.get("/tasks", response_model=list[TaskResponse])
def list_tasks(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    return db.query(Task).offset(skip).limit(limit).all()`,
    request: `GET /tasks?skip=0&limit=20`,
    response: `HTTP 200 OK

[
  {
    "id": 1,
    "title": "Write the baseline article",
    "done": false,
    "created_at": "2026-04-29T09:00:00Z"
  }
]`,
  },
];

type Tab = "code" | "request" | "response";

export function BaselineApiExplorer() {
  const [activeEndpoint, setActiveEndpoint] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>("code");

  const endpoint = ENDPOINTS[activeEndpoint];

  const methodColor = (method: string) =>
    method === "POST"
      ? { bg: "bg-emerald-500/10 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" }
      : { bg: "bg-blue-500/10 dark:bg-blue-500/10", text: "text-blue-600 dark:text-blue-400" };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden not-prose">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/30">
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground/50">
          Baseline API Explorer
        </span>
      </div>

      <div className="flex border-b border-border overflow-x-auto">
        {ENDPOINTS.map((ep, i) => {
          const colors = methodColor(ep.method);
          return (
            <button
              key={ep.path}
              onClick={() => { setActiveEndpoint(i); setActiveTab("code"); }}
              className={`flex items-center gap-2 px-4 py-2.5 text-[11px] whitespace-nowrap transition-all duration-200 cursor-pointer border-b-2 ${
                activeEndpoint === i
                  ? "border-primary text-foreground bg-secondary/30"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/20"
              }`}
            >
              <span className={`font-mono text-[9px] font-semibold px-1.5 py-0.5 rounded ${colors.bg} ${colors.text}`}>
                {ep.method}
              </span>
              <span className="font-mono">{ep.path}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4">
        <p className="text-[11px] text-muted-foreground mb-3">{endpoint.description}</p>

        <div className="flex gap-1 mb-3">
          {(["code", "request", "response"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-3 py-1 text-[10px] font-medium rounded-md transition-all duration-200 cursor-pointer ${
                activeTab === tab
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {activeTab === tab && (
                <motion.span
                  layoutId="tab-indicator"
                  className="absolute inset-0 bg-secondary rounded-md"
                  transition={spring}
                />
              )}
              <span className="relative capitalize">{tab}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeEndpoint}-${activeTab}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={spring}
          >
            <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed whitespace-pre">
              {activeTab === "code" ? endpoint.code
                : activeTab === "request" ? endpoint.request
                : endpoint.response}
            </pre>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
