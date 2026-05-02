import { CodeDiff } from "@/components/blog/interactive/code-diff";
import type { DiffLine } from "@/components/blog/interactive/code-diff";

const MODELS_BEFORE = `from pydantic import BaseModel
from datetime import datetime


class TaskCreate(BaseModel):
    title: str
    description: str | None = None


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    completed: bool | None = None`;

const MODELS_AFTER = `from pydantic import BaseModel, Field
from datetime import datetime


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=2000)


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=2000)
    completed: bool | None = None`;

const MODELS_DIFF: DiffLine[] = [
  { type: "removed", content: "from pydantic import BaseModel" },
  { type: "added",   content: "from pydantic import BaseModel, Field" },
  { type: "context", content: "from datetime import datetime" },
  { type: "context", content: "" },
  { type: "context", content: "" },
  { type: "context", content: "class TaskCreate(BaseModel):" },
  { type: "removed", content: "    title: str" },
  { type: "removed", content: "    description: str | None = None" },
  { type: "added",   content: "    title: str = Field(..., min_length=1, max_length=200)" },
  { type: "added",   content: "    description: str | None = Field(default=None, max_length=2000)" },
  { type: "context", content: "" },
  { type: "context", content: "" },
  { type: "context", content: "class TaskUpdate(BaseModel):" },
  { type: "removed", content: "    title: str | None = None" },
  { type: "removed", content: "    description: str | None = None" },
  { type: "added",   content: "    title: str | None = Field(default=None, min_length=1, max_length=200)" },
  { type: "added",   content: "    description: str | None = Field(default=None, max_length=2000)" },
  { type: "context", content: "    completed: bool | None = None" },
];

const BODY_LIMIT_CODE = `from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError

app = FastAPI(title="Tasks API")

# Reject request bodies larger than 64KB
@app.middleware("http")
async def limit_body_size(request: Request, call_next):
    content_length = request.headers.get("content-length")
    if content_length and int(content_length) > 65_536:
        from fastapi.responses import JSONResponse
        return JSONResponse(
            status_code=413,
            content={"error": "Request body too large", "code": "BODY_TOO_LARGE"},
        )
    return await call_next(request)`;

const VALIDATION_ERROR = `# FastAPI returns 422 by default for Pydantic validation errors
# Response body:
{
  "detail": [
    {
      "type": "string_too_long",
      "loc": ["body", "title"],
      "msg": "String should have at most 200 characters",
      "input": "aaaa...aaaa",
      "ctx": {"max_length": 200}
    }
  ]
}`;

export function InputValidationSection() {
  return (
    <section id="input-validation">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">Input Validation</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Pydantic validates types. It does not validate lengths or sizes unless you tell it to.
        A{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">str</code>{" "}
        field without constraints will accept a string of any length. The fix is one import
        and a{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">Field</code>{" "}
        call per field.
      </p>

      <CodeDiff filename="models.py" before={MODELS_BEFORE} after={MODELS_AFTER} diff={MODELS_DIFF} />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-6 mb-4">
        Field constraints are enforced before any handler code runs. A{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">title</code>{" "}
        longer than 200 characters returns a 422 immediately. The database never sees the
        request. The handler never allocates memory for the string.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Field validation catches oversized field values. It does not catch oversized request
        bodies. A caller can send a single valid field with a 100MB value by not triggering
        the length limit — for example, a description that is exactly 2000 characters but
        embedded in a body with thousands of unknown extra keys. Add a body size middleware
        as a second line of defense.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          main.py -- body size middleware
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {BODY_LIMIT_CODE}
        </pre>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          validation error response (422)
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {VALIDATION_ERROR}
        </pre>
      </div>

      <div className="mt-4 p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
        <p className="font-semibold text-foreground/80">OWASP API4: Unrestricted Resource Consumption</p>
        <p className="text-muted-foreground">
          This finding covers endpoints that allow callers to trigger resource-intensive
          operations without limits. Length constraints, body size limits, and pagination
          limits (the{" "}
          <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">le=100</code>{" "}
          on the list endpoint) all address different surfaces of the same vulnerability class.
        </p>
      </div>
    </section>
  );
}
