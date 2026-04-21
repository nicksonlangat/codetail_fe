import { CodeBlock } from "@/components/blog/interactive/code-block";

export function DunderSection() {
  return (
    <section>
      <h2 id="dunder" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Dunder methods
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Dunder (double-underscore) methods let your class hook into Python&apos;s
        built-in operators and functions. Python calls them automatically — you
        never call{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">__str__</code>{" "}
        yourself.
      </p>

      <CodeBlock
        code={`class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"   # for debuggers and repls

    def __str__(self):
        return f"({self.x}, {self.y})"          # for print()

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __len__(self):
        return 2   # dimensionality

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

v1 = Vector(1, 2)
v2 = Vector(3, 4)
print(v1)          # (1, 2)        — __str__
print(repr(v1))    # Vector(1, 2)  — __repr__
print(v1 + v2)     # (4, 6)        — __add__
print(len(v1))     # 2             — __len__
print(v1 == v1)    # True          — __eq__`}
        output={`(1, 2)
Vector(1, 2)
(4, 6)
2
True`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">__repr__ vs __str__</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Always define{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">__repr__</code>.
        It shows up in the REPL, inside collections, and in error messages.{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">__str__</code>{" "}
        is optional — Python falls back to{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">__repr__</code>{" "}
        when it is absent.
      </p>

      <CodeBlock
        code={`class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Point({self.x!r}, {self.y!r})"

points = [Point(1, 2), Point(3, 4)]
print(points)   # [Point(1, 2), Point(3, 4)]  — __repr__ used inside list`}
        output={`[Point(1, 2), Point(3, 4)]`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Sortable objects with @total_ordering</h3>

      <CodeBlock
        code={`from functools import total_ordering

@total_ordering       # fills in <=, >, >= from __eq__ and __lt__
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    def __repr__(self):
        return f"Temperature({self.celsius})"

    def __eq__(self, other):
        return self.celsius == other.celsius

    def __lt__(self, other):
        return self.celsius < other.celsius

temps = [Temperature(30), Temperature(10), Temperature(20)]
print(sorted(temps))    # [Temperature(10), Temperature(20), Temperature(30)]
print(max(temps))       # Temperature(30)`}
        output={`[Temperature(10), Temperature(20), Temperature(30)]
Temperature(30)`}
      />
    </section>
  );
}
