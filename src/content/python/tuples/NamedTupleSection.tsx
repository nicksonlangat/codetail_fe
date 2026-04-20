import { CodeBlock } from "@/components/blog/interactive/code-block";
import { InteractiveNamedTuple } from "@/components/blog/interactive/interactive-namedtuple";

export function NamedTupleSection() {
  return (
    <section>
      <h2 id="named-tuples" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Named tuples
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A plain tuple forces you to remember that index 0 is the x coordinate and
        index 1 is the y coordinate. A named tuple gives each position a name so
        you can write{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">p.x</code>{" "}
        instead of{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">p[0]</code>.
        It is still a tuple underneath and has no extra memory cost.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">collections.namedtuple</h3>

      <CodeBlock
        code={`from collections import namedtuple

Point = namedtuple("Point", ["x", "y"])

p = Point(3, 7)
print(p)         # Point(x=3, y=7)
print(p.x)       # 3
print(p[0])      # 3 — index access still works
print(p.y)       # 7

# It is a real tuple
print(isinstance(p, tuple))    # True
print(len(p))                  # 2
x, y = p                       # unpacking works too`}
        output={`Point(x=3, y=7)
3
3
7
True
2`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">typing.NamedTuple (preferred)</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The modern way uses class syntax with type annotations. It reads more clearly,
        supports default values, and plays well with type checkers.
      </p>

      <CodeBlock
        code={`from typing import NamedTuple

class Point(NamedTuple):
    x: float
    y: float
    label: str = ""    # default value — optional field

p1 = Point(3.0, 7.0)
p2 = Point(x=1.5, y=2.5, label="origin")

print(p1)           # Point(x=3.0, y=7.0, label='')
print(p2.label)     # origin

# Methods work normally
def distance(p: Point) -> float:
    return (p.x ** 2 + p.y ** 2) ** 0.5

print(distance(p1))   # 7.615773105863909`}
        output={`Point(x=3.0, y=7.0, label='')
origin
7.615773105863909`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">_replace() for immutable updates</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        You cannot modify a named tuple in place, but{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">_replace()</code>{" "}
        returns a new instance with specific fields changed. The original is untouched.
      </p>

      <CodeBlock
        code={`from typing import NamedTuple

class Employee(NamedTuple):
    name: str
    dept: str
    salary: int

alice = Employee("Alice", "Engineering", 90000)
promoted = alice._replace(salary=110000, dept="Engineering Lead")

print(alice)     # Employee(name='Alice', dept='Engineering', salary=90000)
print(promoted)  # Employee(name='Alice', dept='Engineering Lead', salary=110000)`}
        output={`Employee(name='Alice', dept='Engineering', salary=90000)
Employee(name='Alice', dept='Engineering Lead', salary=110000)`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mt-2 mb-6">
        <p className="text-[13px] font-semibold text-foreground/80 mb-1">Named tuple vs dataclass</p>
        <p className="text-[13px] text-foreground/70">
          If you need immutability and interoperability with tuple operations (unpacking,
          iteration, len), use a named tuple. If you need mutability, inheritance, or
          custom methods, use a dataclass. Named tuples use less memory and have zero
          overhead compared to a plain tuple.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Explore field access below. Click any field to see both the name-based and
        index-based access side by side.
      </p>

      <InteractiveNamedTuple />
    </section>
  );
}
