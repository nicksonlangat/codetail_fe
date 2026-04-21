import { CodeBlock } from "@/components/blog/interactive/code-block";

export function TryExceptSection() {
  return (
    <section>
      <h2 id="try-except" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        try / except
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Wrap code that might fail in a{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">try</code>{" "}
        block. If an exception is raised, Python jumps to the matching{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">except</code>{" "}
        clause and runs it. Execution continues after the entire try/except structure.
      </p>

      <CodeBlock
        code={`# Basic form
try:
    result = 10 / 0
except ZeroDivisionError:
    print("cannot divide by zero")

# Catch multiple exception types separately
def parse_int(value):
    try:
        return int(value)
    except ValueError:
        print(f"not a valid integer: {value!r}")
        return None
    except TypeError:
        print(f"expected a string, got {type(value).__name__}")
        return None

print(parse_int("42"))     # 42
print(parse_int("hello"))  # not a valid integer: 'hello'
print(parse_int(None))     # expected a string, got NoneType`}
        output={`cannot divide by zero
42
not a valid integer: 'hello'
expected a string, got NoneType`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Accessing the exception object</h3>

      <CodeBlock
        code={`try:
    data = {"key": "value"}
    print(data["missing"])
except KeyError as e:
    print(f"key not found: {e}")          # key not found: 'missing'
    print(f"type: {type(e).__name__}")    # type: KeyError

# Catching multiple types in one clause
try:
    result = int("bad") + None
except (ValueError, TypeError) as e:
    print(f"{type(e).__name__}: {e}")`}
        output={`key not found: 'missing'
type: KeyError
ValueError: invalid literal for int() with base 10: 'bad'`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">else and finally</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">else</code>{" "}
        block runs only if no exception was raised.{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">finally</code>{" "}
        always runs — exception or not — making it the right place for cleanup code.
      </p>

      <CodeBlock
        code={`def read_config(path):
    f = None
    try:
        f = open(path)
        data = f.read()
    except FileNotFoundError:
        print(f"config not found: {path}")
        return {}
    else:
        print("config loaded successfully")
        return data          # only reached if no exception
    finally:
        if f:
            f.close()        # always runs, even if return is hit in else`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mt-2">
        <p className="text-[13px] text-foreground/70 italic">
          In practice, use{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">with open(path) as f</code>{" "}
          instead of manual{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">finally: f.close()</code>.
          Context managers handle this automatically.
        </p>
      </div>
    </section>
  );
}
