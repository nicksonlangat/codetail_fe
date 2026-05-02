const PROFILER_SETUP = `from pyinstrument import Profiler
from fastapi import Request
import os


async def profiling_middleware(request: Request, call_next):
    # Only profile when ?profile=1 is present in the URL.
    # Never leave this enabled in production without auth.
    if "profile" not in request.query_params:
        return await call_next(request)

    profiler = Profiler(async_mode="enabled")
    profiler.start()
    response = await call_next(request)
    profiler.stop()

    print(profiler.output_text(unicode=True, color=True))
    return response`;

const FLAMEGRAPH_EXPLANATION = [
  {
    element: "Wide bars",
    meaning: "Functions that consumed significant wall-clock time. These are the optimization targets.",
    example: "json.dumps taking 18ms on a large list serialization",
  },
  {
    element: "Tall call stacks",
    meaning: "Deep function call chains. Usually framework code — not an optimization target unless it is unexpectedly deep.",
    example: "SQLAlchemy's lazy loader chain before async patches were applied",
  },
  {
    element: "Narrow bars near the top",
    meaning: "Fast operations called frequently. Usually fine, but watch for N+1 patterns.",
    example: "get_password_hash called once per auth request — expected",
  },
  {
    element: "Time in asyncio internals",
    meaning: "The event loop is spending time context-switching. Usually indicates too many small awaits or blocking calls on the async thread.",
    example: "run_in_executor wrapping a synchronous function — blocking the thread",
  },
];

const PYINSTRUMENT_OUTPUT = `  _     ._   __/__   _ _  _  _ _/_   Recorded: 10:42:31  Samples:  47
 /_//_/// /_/ / /_'/ / //_'/ //     Duration: 0.148     CPU time: 0.031
/   _/                      v4.6.1

0.148 list_tasks  main.py:87
   0.089 execute  sqlalchemy/ext/asyncio/session.py
   └── 0.089 <execute db query>
   0.051 model_validate  pydantic/...
   ├── 0.031 _serialize_task  models.py:44
   └── 0.020 json_encoder  ...
   0.006 get_current_user  auth.py:62
   └── 0.006 jwt.decode  ...
   0.002 [other]`;

export function ProfilingSection() {
  return (
    <section id="profiling">
      <h2 className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">Reading a Flamegraph</h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Traces tell you a request took 148ms. Flamegraphs tell you that 89ms of that was
        spent in the database query, 51ms was Pydantic serialization, and 6ms was JWT
        decoding. The difference matters: you cannot optimize the 51ms serialization cost
        by adding a database index.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="text-[13px] font-mono bg-muted px-1 py-0.5 rounded">pyinstrument</code>{" "}
        is a statistical profiler. It samples the call stack every millisecond and aggregates
        the samples. Add it as optional middleware — triggered by a query parameter — so you
        can profile specific endpoints in staging without affecting production traffic.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          requirements.txt + profiling middleware
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {`pyinstrument==4.6.1  # statistical profiler for Python\n\n`}{PROFILER_SETUP}
        </pre>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
          pyinstrument text output for GET /tasks
        </p>
        <pre className="text-[10px] font-mono bg-muted rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
          {PYINSTRUMENT_OUTPUT}
        </pre>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        How to read the output:
      </p>

      <div className="space-y-3">
        {FLAMEGRAPH_EXPLANATION.map(({ element, meaning, example }) => (
          <div key={element} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-muted/30">
              <span className="text-[11px] font-semibold font-mono">{element}</span>
            </div>
            <div className="px-4 py-3 space-y-1.5">
              <p className="text-[11px] text-muted-foreground leading-relaxed">{meaning}</p>
              <p className="text-[11px]">
                <span className="font-medium text-foreground/80">Example: </span>
                <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">{example}</code>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-muted/30 border border-border rounded-xl text-[11px] space-y-2">
        <p className="font-semibold text-foreground/80">Profile in staging, not production</p>
        <p className="text-muted-foreground">
          Sampling adds overhead. The middleware above gates on a query parameter which
          is low-friction for developers but exposes profiling data to anyone who knows the
          flag. In production, gate behind an admin check or disable the middleware entirely.
          Profile representative traffic in a staging environment that matches production
          data volume.
        </p>
      </div>
    </section>
  );
}
