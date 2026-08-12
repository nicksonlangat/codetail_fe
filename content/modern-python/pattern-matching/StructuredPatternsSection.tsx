import { CodeBlock } from "@/components/blog/interactive/code-block";

export function StructuredPatternsSection() {
  return (
    <section>
      <h2
        id="structured-patterns"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Class, sequence, and mapping patterns
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The real power is matching on structure. Class patterns check the type and extract
        attributes. Sequence patterns destructure lists and tuples. Mapping patterns pull keys
        from dicts.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Class patterns
      </h3>

      <CodeBlock
        code={`from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float

def describe_point(p: Point) -> str:
    match p:
        case Point(x=0, y=0):
            return "origin"
        case Point(x=0, y=y):
            return f"on y-axis at {y}"
        case Point(x=x, y=0):
            return f"on x-axis at {x}"
        case Point(x=x, y=y) if x == y:
            return f"on diagonal at {x}"
        case Point(x=x, y=y):
            return f"at ({x}, {y})"

print(describe_point(Point(0, 0)))    # origin
print(describe_point(Point(0, 5)))    # on y-axis at 5.0
print(describe_point(Point(3, 3)))    # on diagonal at 3.0
print(describe_point(Point(2, 7)))    # at (2.0, 7.0)`}
        output={`origin
on y-axis at 5.0
on diagonal at 3.0
at (2.0, 7.0)`}
      />

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Sequence patterns
      </h3>

      <CodeBlock
        code={`def parse_command(tokens: list[str]) -> str:
    match tokens:
        case []:
            return "empty"
        case ["quit"]:
            return "quitting"
        case ["go", direction]:
            return f"going {direction}"
        case ["go", direction, speed]:
            return f"going {direction} at {speed}"
        case ["say", *words]:          # * captures remaining elements
            return f"saying: {' '.join(words)}"
        case _:
            return f"unknown: {tokens}"

print(parse_command([]))                      # empty
print(parse_command(["go", "north"]))         # going north
print(parse_command(["go", "north", "fast"])) # going north at fast
print(parse_command(["say", "hello", "world"])) # saying: hello world`}
        output={`empty
going north
going north at fast
saying: hello world`}
      />

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Mapping patterns
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Mapping patterns are partial: the dict only needs to contain the listed keys. Extra keys
        are ignored unless you capture them with{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">**rest</code>.
      </p>

      <CodeBlock
        code={`def handle_event(event: dict) -> str:
    match event:
        case {"type": "click", "x": x, "y": y, "button": "left"}:
            return f"left-click at ({x}, {y})"
        case {"type": "click", "x": x, "y": y}:
            return f"click at ({x}, {y})"
        case {"type": "keypress", "key": ("Enter" | "Return")}:
            return "submit"
        case {"type": "keypress", "key": key}:
            return f"key: {key}"
        case {"type": t, **rest}:
            return f"unknown event type {t!r} with {rest}"

print(handle_event({"type": "click", "x": 10, "y": 20, "button": "left"}))
print(handle_event({"type": "keypress", "key": "Enter"}))`}
        output={`left-click at (10, 20)
submit`}
      />
    </section>
  );
}
