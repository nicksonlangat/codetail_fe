import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ExceptionChainingSection() {
  return (
    <section>
      <h2
        id="exception-chaining"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Exception chaining with raise ... from
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        When a low-level exception causes a high-level one, you want both in the traceback. Without
        explicit chaining, you get either a confusing implicit chain or a completely lost original
        cause.
      </p>

      <CodeBlock
        code={`# Before: implicit chaining -- Python shows both but with messy wording
def load_config(path: str) -> dict:
    try:
        with open(path) as f:
            import json
            return json.load(f)
    except Exception as e:
        raise RuntimeError(f"Failed to load config: {path}")
        # The original FileNotFoundError/JSONDecodeError is shown but
        # Python says "During handling of the above exception, another exception occurred"
        # That phrasing implies something went wrong in the handler, not a deliberate wrap`}
      />

      <CodeBlock
        code={`import json

# After: explicit chaining with "raise X from Y"
def load_config(path: str) -> dict:
    try:
        with open(path) as f:
            return json.load(f)
    except FileNotFoundError as e:
        raise RuntimeError(f"Config file not found: {path}") from e
    except json.JSONDecodeError as e:
        raise RuntimeError(f"Config file is not valid JSON: {path}") from e

# Python now says "The above exception was the direct cause of the following exception"
# Clean signal: this was intentional, not an accidental second failure

# Suppress the chain entirely when you don't want the cause shown
def safe_parse(value: str) -> int:
    try:
        return int(value)
    except ValueError:
        raise ValueError(f"Expected an integer, got: {value!r}") from None`}
      />

      <div className="border-l-2 border-brand-primary pl-4 py-2 mb-6 mt-6">
        <p className="text-[14px] text-brand-text/80">
          <code className="font-mono text-[12px] bg-brand-surface px-1 py-0.5 rounded">
            raise X from Y
          </code>{" "}
          — explicit cause, shows "The above exception was the direct cause."
          <br />
          <code className="font-mono text-[12px] bg-brand-surface px-1 py-0.5 rounded">
            raise X from None
          </code>{" "}
          — suppress the chain entirely. Use when the original error leaks implementation details
          that callers should not see.
        </p>
      </div>
    </section>
  );
}
