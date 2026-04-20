import { CodeBlock } from "@/components/blog/interactive/code-block";
import { InteractiveArgs } from "@/components/blog/interactive/interactive-args";

export function ParametersSection() {
  return (
    <section>
      <h2 id="parameters" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Parameters
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Python has five kinds of parameters. Understanding when to use each one makes
        function signatures clearer and more flexible.
      </p>

      <h3 className="text-base font-semibold mb-3">Positional and keyword arguments</h3>

      <CodeBlock
        code={`def connect(host, port, timeout=30):
    print(f"connecting to {host}:{port} (timeout={timeout}s)")

# Positional — order matters
connect("localhost", 5432)

# Keyword — order does not matter
connect(port=5432, host="localhost")

# Mix — positional first, then keyword
connect("localhost", timeout=60, port=5432)`}
        output={`connecting to localhost:5432 (timeout=30s)
connecting to localhost:5432 (timeout=30s)
connecting to localhost:5432 (timeout=60s)`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mt-2 mb-6">
        <p className="text-[13px] text-foreground/70 italic">
          Never use a mutable object as a default value. Default values are created once
          when the function is defined, not on each call.{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">
            def f(items=[])
          </code>{" "}
          shares the same list across all calls. Use{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">
            def f(items=None)
          </code>{" "}
          and set the default inside the body.
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">*args and **kwargs</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">*args</code>{" "}
        collects extra positional arguments into a tuple.{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">**kwargs</code>{" "}
        collects extra keyword arguments into a dict. The names{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">args</code>{" "}
        and{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">kwargs</code>{" "}
        are conventions — the{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">*</code>{" "}
        and{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">**</code>{" "}
        are what matter.
      </p>

      <CodeBlock
        code={`def summarise(*args, **kwargs):
    print("args:", args)
    print("kwargs:", kwargs)

summarise(1, 2, 3, name="Alice", role="admin")
# args: (1, 2, 3)
# kwargs: {'name': 'Alice', 'role': 'admin'}

# Forwarding — pass everything through to another function
def wrapper(*args, **kwargs):
    print("before")
    result = original(*args, **kwargs)
    print("after")
    return result`}
        output={`args: (1, 2, 3)
kwargs: {'name': 'Alice', 'role': 'admin'}`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Keyword-only and positional-only</h3>

      <CodeBlock
        code={`# After * — keyword-only (must be passed by name)
def create_user(name, *, role="viewer", active=True):
    print(f"{name} | role={role} | active={active}")

create_user("Alice", role="admin")
# create_user("Alice", "admin")  # TypeError — role is keyword-only

# Before / — positional-only (must be passed by position)
def distance(x, y, /):
    return (x ** 2 + y ** 2) ** 0.5

print(distance(3, 4))     # 5.0
# distance(x=3, y=4)  # TypeError — x, y are positional-only`}
        output={`Alice | role=admin | active=True
5.0`}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-6 mb-4">
        See how different call patterns pack into{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">args</code>{" "}
        and{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">kwargs</code>.
      </p>

      <InteractiveArgs />
    </section>
  );
}
