import { CodeBlock } from "@/components/blog/interactive/code-block";

export function GuardsAndRealWorldSection() {
  return (
    <section>
      <h2
        id="guards-and-real-world"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Guards and a real-world example
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A guard adds a condition to a pattern with{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">if</code>.
        The pattern must match <em>and</em> the guard must be true for the case to run.
      </p>

      <CodeBlock
        code={`def classify(n: int) -> str:
    match n:
        case 0:
            return "zero"
        case n if n % 2 == 0 and n > 0:
            return f"{n} is even and positive"
        case n if n % 2 != 0 and n > 0:
            return f"{n} is odd and positive"
        case n:
            return f"{n} is negative"

print(classify(0))    # zero
print(classify(4))    # 4 is even and positive
print(classify(7))    # 7 is odd and positive
print(classify(-3))   # -3 is negative`}
        output={`zero
4 is even and positive
7 is odd and positive
-3 is negative`}
      />

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        The isinstance ladder, rewritten
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Back to the event handler from the opening section. The same logic in{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          match/case
        </code>
        : type checking, field extraction, and conditional logic all in one place, with no nesting.
      </p>

      <CodeBlock
        code={`from dataclasses import dataclass

@dataclass
class MouseClick:
    x: int
    y: int
    button: str

@dataclass
class KeyPress:
    key: str

@dataclass
class WindowResize:
    width: int
    height: int

def handle_event(event) -> str:
    match event:
        case MouseClick(x=x, y=y, button="left"):
            return f"left-click at ({x}, {y})"
        case MouseClick(x=x, y=y, button="right"):
            return f"right-click at ({x}, {y})"
        case KeyPress(key="Escape"):
            return "close dialog"
        case KeyPress(key="Enter"):
            return "submit form"
        case KeyPress(key=k):
            return f"buffer: {k}"
        case WindowResize(width=w, height=h):
            return f"reflow to {w}x{h}"
        case _:
            raise ValueError(f"unknown event: {event!r}")

print(handle_event(MouseClick(100, 200, "left")))
print(handle_event(KeyPress("Enter")))
print(handle_event(WindowResize(1920, 1080)))`}
        output={`left-click at (100, 200)
submit form
reflow to 1920x1080`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        The nesting is gone. Each case is a complete thought: type, fields, condition, action.
        Adding a new event type means adding a new case. Nothing else changes.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted">
          <strong>When to reach for match/case:</strong> any time you are branching on type,
          shape, or the content of a value. It is not a replacement for all conditionals, just
          the ones that would otherwise require a chain of isinstance checks and manual field
          extraction.
        </p>
      </div>
    </section>
  );
}
