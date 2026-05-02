import { CodeDiff } from "@/components/blog/interactive/code-diff";
import type { DiffLine } from "@/components/blog/interactive/code-diff";

const ERROR_BEFORE = `@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

# Unhandled exceptions return a bare 500 with no body
# or FastAPI's default {"detail": "Internal Server Error"}`;

const ERROR_AFTER = `from pydantic import BaseModel
from fastapi.responses import JSONResponse
import traceback


class ErrorResponse(BaseModel):
    error: str
    code: str
    request_id: str | None = None


ERROR_CODES = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    409: "CONFLICT",
    422: "VALIDATION_ERROR",
    429: "RATE_LIMITED",
    503: "SERVICE_UNAVAILABLE",
}


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error=str(exc.detail),
            code=ERROR_CODES.get(exc.status_code, "UNKNOWN_ERROR"),
            request_id=getattr(request.state, "request_id", None),
        ).model_dump(),
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger = getattr(request.state, "logger", structlog.get_logger())
    logger.error("unhandled_exception", exc=str(exc), tb=traceback.format_exc())

    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="An unexpected error occurred",
            code="INTERNAL_ERROR",
            request_id=getattr(request.state, "request_id", None),
        ).model_dump(),
    )`;

const ERROR_DIFF: DiffLine[] = [
  { type: "added",   content: "class ErrorResponse(BaseModel):" },
  { type: "added",   content: "    error: str" },
  { type: "added",   content: "    code: str" },
  { type: "added",   content: "    request_id: str | None = None" },
  { type: "context", content: "" },
  { type: "context", content: "" },
  { type: "context", content: "@app.exception_handler(HTTPException)" },
  { type: "context", content: "async def http_exception_handler(request, exc):" },
  { type: "removed", content: "    return JSONResponse(" },
  { type: "removed", content: "        status_code=exc.status_code," },
  { type: "removed", content: "        content={\"detail\": exc.detail}," },
  { type: "removed", content: "    )" },
  { type: "added",   content: "    return JSONResponse(" },
  { type: "added",   content: "        status_code=exc.status_code," },
  { type: "added",   content: "        content=ErrorResponse(" },
  { type: "added",   content: "            error=str(exc.detail)," },
  { type: "added",   content: "            code=ERROR_CODES.get(exc.status_code, \"UNKNOWN_ERROR\")," },
  { type: "added",   content: "            request_id=getattr(request.state, \"request_id\", None)," },
  { type: "added",   content: "        ).model_dump()," },
  { type: "added",   content: "    )" },
];

const ERROR_EXAMPLES = [
  {
    scenario: "Missing auth token",
    status: "401",
    response: `{ "error": "Not authenticated", "code": "UNAUTHORIZED", "request_id": "a3f9c1d2" }`,
  },
  {
    scenario: "Task not found",
    status: "404",
    response: `{ "error": "Task not found", "code": "NOT_FOUND", "request_id": "b7e2d4f1" }`,
  },
  {
    scenario: "Database timeout",
    status: "503",
    response: `{ "error": "Database timeout", "code": "SERVICE_UNAVAILABLE", "request_id": "c1a8e3b5" }`,
  },
];

export function StructuredErrorsSection() {
  return (
    <section id="structured-errors">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">Structured Error Responses</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Errors are part of your API contract. Clients parse error responses. The current
        API returns inconsistent shapes:{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">{"{ \"detail\": \"...\" }"}</code>{" "}
        from FastAPI's default handler,{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">{"{ \"error\": \"...\" }"}</code>{" "}
        from some rate-limit responses, and a raw HTML 500 page from unhandled exceptions.
        Clients cannot reliably parse errors without a consistent schema.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A structured error model with a{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">code</code>{" "}
        field gives clients something stable to branch on. Include the{" "}
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">request_id</code>{" "}
        so users can paste it into a bug report and you can find the full trace in seconds.
      </p>

      <CodeDiff filename="main.py" before={ERROR_BEFORE} after={ERROR_AFTER} diff={ERROR_DIFF} />

      <div className="mt-6 space-y-3">
        {ERROR_EXAMPLES.map(({ scenario, status, response }) => (
          <div key={scenario} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
              <span className="text-[11px] font-semibold">{scenario}</span>
              <code className="text-[9px] font-mono text-muted-foreground">{status}</code>
            </div>
            <div className="p-4">
              <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
                {response}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
