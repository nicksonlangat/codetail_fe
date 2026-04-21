import { CodeBlock } from "@/components/blog/interactive/code-block";
import { InteractiveException } from "@/components/blog/interactive/interactive-exception";

export function ExceptionHierarchySection() {
  return (
    <section>
      <h2 id="hierarchy" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Exception hierarchy
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Python exceptions form a class hierarchy.{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">except SomeType</code>{" "}
        catches that type and all its subclasses. Catching{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">Exception</code>{" "}
        catches almost everything — but not{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">SystemExit</code>,{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">KeyboardInterrupt</code>, or{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">GeneratorExit</code>,
        which all inherit from{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">BaseException</code>{" "}
        directly. This is intentional — those three should almost never be silenced.
      </p>

      <CodeBlock
        code={`# Catching a parent catches all children
try:
    open("missing.txt")
except OSError as e:
    # catches FileNotFoundError, PermissionError, etc.
    print(type(e).__name__, e)   # FileNotFoundError: ...

# Specific before general — Python checks clauses top to bottom
try:
    result = {}["key"]
except KeyError:
    print("specific: key not found")
except Exception:
    print("general: something went wrong")   # not reached

# Never do this — swallows everything including bugs
try:
    do_something()
except:             # bare except catches BaseException — avoid
    pass`}
        output={`FileNotFoundError [Errno 2] No such file or directory: 'missing.txt'
specific: key not found`}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-6 mb-4">
        Click any exception class below to see exactly what that{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">except</code>{" "}
        clause would catch.
      </p>

      <InteractiveException />
    </section>
  );
}
