import { CodeBlock } from "@/components/blog/interactive/code-block";
import { InteractiveContextManager } from "@/components/blog/interactive/interactive-context-manager";

export function ContextManagersSection() {
  return (
    <section>
      <h2 id="context-managers" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Context managers
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">with</code>{" "}
        statement guarantees cleanup. Whatever happens inside the block — normal exit or
        an exception — the context manager&apos;s exit code always runs. This replaces
        the{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">try/finally</code>{" "}
        pattern for resource management.
      </p>

      <CodeBlock
        code={`# File — most common use case
with open("data.txt", "w") as f:
    f.write("hello")
# file is closed here, even if write raised

# Multiple context managers on one line (Python 3.10+ prefers parentheses)
with open("input.txt") as src, open("output.txt", "w") as dst:
    dst.write(src.read().upper())`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">contextlib.contextmanager</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">@contextmanager</code>{" "}
        decorator lets you write a context manager as a generator. Everything before
        the{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">yield</code>{" "}
        is setup (called on entry), the yielded value becomes the{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">as</code>{" "}
        variable, and everything after is teardown (called on exit).
      </p>

      <CodeBlock
        code={`from contextlib import contextmanager
import time

@contextmanager
def timer(label: str):
    start = time.perf_counter()
    try:
        yield                          # block runs here
    finally:
        elapsed = time.perf_counter() - start
        print(f"{label}: {elapsed:.4f}s")

with timer("sorting"):
    data = sorted(range(1_000_000), reverse=True)

# Timer prints even if the body raises
@contextmanager
def managed_connection(host: str):
    conn = connect(host)              # setup
    try:
        yield conn                    # body gets the connection
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()                  # always runs`}
        output={`sorting: 0.0821s`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">contextlib utilities</h3>

      <CodeBlock
        code={`from contextlib import suppress, nullcontext

# suppress — silently ignore specific exceptions
with suppress(FileNotFoundError):
    import os
    os.remove("temp.txt")   # no error if the file does not exist

# nullcontext — placeholder when you conditionally need a context manager
def process(file=None):
    ctx = open(file) if file else nullcontext()
    with ctx as f:
        data = f.read() if f else get_default_data()
        return data`}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-6 mb-4">
        Step through what happens inside a{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">with</code>{" "}
        block when the body succeeds or raises.
      </p>

      <InteractiveContextManager />
    </section>
  );
}
