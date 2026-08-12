import { CodeBlock } from "@/components/blog/interactive/code-block";

export function DataclassBasicsSection() {
  return (
    <section>
      <h2
        id="dataclass-basics"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        The boilerplate tax
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A simple data-holding class in pre-3.7 Python cost you roughly twenty lines before you
        could do anything useful with it. Here is a point with two coordinates:
      </p>

      <CodeBlock
        code={`# Pre-3.7: every class you wrote looked like this
class Point:
    def __init__(self, x: float, y: float, label: str = "") -> None:
        self.x = x
        self.y = y
        self.label = label

    def __repr__(self) -> str:
        return f"Point(x={self.x!r}, y={self.y!r}, label={self.label!r})"

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Point):
            return NotImplemented
        return self.x == other.x and self.y == other.y and self.label == other.label

    def __hash__(self) -> int:
        return hash((self.x, self.y, self.label))

p1 = Point(1.0, 2.0)
p2 = Point(1.0, 2.0)
print(p1)           # Point(x=1.0, y=2.0, label='')
print(p1 == p2)     # True`}
        output={`Point(x=1.0, y=2.0, label='')
True`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        The same class as a dataclass:
      </p>

      <CodeBlock
        code={`from dataclasses import dataclass

@dataclass(frozen=True)   # frozen=True gives you __hash__ automatically
class Point:
    x: float
    y: float
    label: str = ""

p1 = Point(1.0, 2.0)
p2 = Point(1.0, 2.0)
print(p1)           # Point(x=1.0, y=2.0, label='')
print(p1 == p2)     # True
print(hash(p1))     # works, because frozen=True`}
        output={`Point(x=1.0, y=2.0, label='')
True
3713081631934410656`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          @dataclass
        </code>{" "}
        generates{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          __init__
        </code>
        ,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          __repr__
        </code>
        , and{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          __eq__
        </code>{" "}
        by default. Add{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          frozen=True
        </code>{" "}
        and you also get{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          __hash__
        </code>{" "}
        and immutability. The fields are declared as class-level annotations, not assignments
        inside{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          __init__
        </code>
        . Defaults go directly on the annotation line.
      </p>
    </section>
  );
}
