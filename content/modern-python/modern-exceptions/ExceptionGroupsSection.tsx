import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ExceptionGroupsSection() {
  return (
    <section>
      <h2
        id="exception-groups"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        ExceptionGroup and except* (3.11)
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Concurrent code can fail in multiple places at once. Before 3.11, the standard approach
        was to collect errors in a list and raise one summary exception. That made it impossible
        for callers to catch specific sub-errors without parsing the message. Python 3.11
        introduced{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          ExceptionGroup
        </code>{" "}
        and{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          except*
        </code>{" "}
        to handle this properly.
      </p>

      <CodeBlock
        code={`# Before: collect-and-summarize pattern -- callers can't easily introspect
def validate_all(data: list[dict]) -> None:
    errors = []
    for i, item in enumerate(data):
        if "name" not in item:
            errors.append(ValueError(f"item {i}: missing 'name'"))
        if "age" not in item:
            errors.append(KeyError(f"item {i}: missing 'age'"))
    if errors:
        raise RuntimeError(f"{len(errors)} validation errors: {errors}")`}
      />

      <CodeBlock
        code={`# Python 3.11: ExceptionGroup carries multiple exceptions properly
def validate_all(data: list[dict]) -> None:
    errors = []
    for i, item in enumerate(data):
        if "name" not in item:
            errors.append(ValueError(f"item {i}: missing 'name'"))
        if "age" not in item:
            errors.append(KeyError(f"item {i}: missing 'age'"))
    if errors:
        raise ExceptionGroup("validation failed", errors)

# except* routes each exception type to its own handler
try:
    validate_all([
        {"name": "Alice", "age": 30},
        {"age": 25},               # missing name
        {"name": "Charlie"},       # missing age
        {},                        # missing both
    ])
except* ValueError as eg:
    print(f"ValueError group ({len(eg.exceptions)} errors):")
    for e in eg.exceptions:
        print(f"  {e}")
except* KeyError as eg:
    print(f"KeyError group ({len(eg.exceptions)} errors):")
    for e in eg.exceptions:
        print(f"  {e}")`}
        output={`ValueError group (2 errors):
  item 1: missing 'name'
  item 3: missing 'name'
KeyError group (2 errors):
  item 2: missing 'age'
  item 3: missing 'age'`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        Unlike regular{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          except
        </code>{" "}
        which stops at the first matching clause,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          except*
        </code>{" "}
        runs all matching handlers. Each handler receives an{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          ExceptionGroup
        </code>{" "}
        containing only the exceptions of the matching type. Both handlers above run because the
        group contained both{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          ValueError
        </code>{" "}
        and{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          KeyError
        </code>
        .
      </p>
    </section>
  );
}
