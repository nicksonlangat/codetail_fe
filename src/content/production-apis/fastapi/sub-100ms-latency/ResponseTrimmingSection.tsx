import { CodeDiff } from "@/components/blog/interactive/code-diff";
import type { DiffLine } from "@/components/blog/interactive/code-diff";

const MODELS_BEFORE = `from pydantic import BaseModel, Field
from datetime import datetime


class TaskDetail(BaseModel):
    id: int
    title: str
    description: str | None
    completed: bool
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# List endpoint used the same model
@app.get("/tasks", response_model=list[TaskDetail])
async def list_tasks(...):
    ...`;

const MODELS_AFTER = `from pydantic import BaseModel, Field
from datetime import datetime


class TaskSummary(BaseModel):
    id: int
    title: str
    completed: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class TaskDetail(BaseModel):
    id: int
    title: str
    description: str | None
    completed: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# List uses lightweight summary; detail endpoint is unchanged
@app.get("/tasks", response_model=list[TaskSummary])
async def list_tasks(...):
    ...`;

const MODELS_DIFF: DiffLine[] = [
  { type: "context", content: "from pydantic import BaseModel, Field" },
  { type: "context", content: "from datetime import datetime" },
  { type: "context", content: "" },
  { type: "context", content: "" },
  { type: "added",   content: "class TaskSummary(BaseModel):" },
  { type: "added",   content: "    id: int" },
  { type: "added",   content: "    title: str" },
  { type: "added",   content: "    completed: bool" },
  { type: "added",   content: "    created_at: datetime" },
  { type: "context", content: "" },
  { type: "added",   content: "    model_config = {\"from_attributes\": True}" },
  { type: "context", content: "" },
  { type: "context", content: "" },
  { type: "context", content: "class TaskDetail(BaseModel):" },
  { type: "context", content: "    id: int" },
  { type: "context", content: "    title: str" },
  { type: "context", content: "    description: str | None" },
  { type: "context", content: "    completed: bool" },
  { type: "removed", content: "    user_id: int" },
  { type: "context", content: "    created_at: datetime" },
  { type: "context", content: "    updated_at: datetime" },
  { type: "context", content: "" },
  { type: "context", content: "    model_config = {\"from_attributes\": True}" },
  { type: "context", content: "" },
  { type: "context", content: "" },
  { type: "removed", content: "@app.get(\"/tasks\", response_model=list[TaskDetail])" },
  { type: "added",   content: "@app.get(\"/tasks\", response_model=list[TaskSummary])" },
  { type: "context", content: "async def list_tasks(...):" },
  { type: "context", content: "    ..." },
];

export function ResponseTrimmingSection() {
  return (
    <section id="response-trimming">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">Response Model Trimming</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The list endpoint currently returns full{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">TaskDetail</code>{" "}
        objects including description, user_id, and both timestamps. A list view rarely
        needs any of those fields. Serializing and transmitting them wastes CPU and
        bandwidth on every list request.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The fix is a{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">TaskSummary</code>{" "}
        model with only the fields the list view needs. Pydantic handles the projection:
        fields present on the ORM object but absent from{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">TaskSummary</code>{" "}
        are not serialized. The database query does not change — the projection happens
        at the serialization layer.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Also remove{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">user_id</code>{" "}
        from{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">TaskDetail</code>.
        The API is user-scoped; the caller already knows their own user ID. Returning it
        on every record is unnecessary data that also slightly widens the API surface.
      </p>

      <CodeDiff filename="models.py" before={MODELS_BEFORE} after={MODELS_AFTER} diff={MODELS_DIFF} />

      <div className="mt-4 p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
        <p className="font-semibold text-foreground/80">SELECT * in SQL, SELECT * in serialization</p>
        <p className="text-muted-foreground">
          Fetching all ORM fields and projecting in Python is not as efficient as projecting
          in SQL. For large result sets, using{" "}
          <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">select(Task.id, Task.title, Task.completed, Task.created_at)</code>{" "}
          reduces the data read from the database. At 20 rows per page the difference is
          negligible. At 1,000 rows it matters. The Pydantic approach is correct here;
          SQL projection is the next optimization if profiling shows the database is
          the bottleneck.
        </p>
      </div>
    </section>
  );
}
