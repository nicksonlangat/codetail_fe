import { CodeBlock } from "@/components/blog/interactive/code-block";

export function TypeAliasesSection() {
  return (
    <section>
      <h2
        id="type-aliases"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Type aliases: from assignment to first-class syntax
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The old way to create a type alias was a plain assignment. It worked, but nothing
        distinguished it from a regular variable assignment. Type checkers had to guess from
        context whether you meant a value or a type.
      </p>

      <CodeBlock
        code={`# 3.5-3.9: just an assignment, no signal that this is a type alias
from typing import List, Tuple

Coordinate = Tuple[float, float]
Matrix = List[List[float]]
UserId = int   # is this a new type or just an alias? ambiguous.

def translate(point: Coordinate, delta: Coordinate) -> Coordinate:
    return (point[0] + delta[0], point[1] + delta[1])`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        Python 3.10 introduced{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          TypeAlias
        </code>{" "}
        to make intent explicit. The annotation tells both the type checker and any human reading
        the code: this name is a type alias, not a value.
      </p>

      <CodeBlock
        code={`# 3.10: TypeAlias makes intent unambiguous
from typing import TypeAlias

Coordinate: TypeAlias = tuple[float, float]
Matrix: TypeAlias = list[list[float]]
UserId: TypeAlias = int

def translate(point: Coordinate, delta: Coordinate) -> Coordinate:
    return (point[0] + delta[0], point[1] + delta[1])`}
      />

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        3.12: the type statement
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Python 3.12 went further and added a dedicated statement for type aliases. No import
        needed. The alias is lazy: the right-hand side is not evaluated until the alias is used,
        which means forward references and recursive types work without strings.
      </p>

      <CodeBlock
        code={`# 3.12: type statement, no import, lazy evaluation
type Coordinate = tuple[float, float]
type Matrix = list[list[float]]
type JsonValue = str | int | float | bool | None | list[JsonValue] | dict[str, JsonValue]

# Recursive type works without quotes because evaluation is deferred
type Tree[T] = T | list[Tree[T]]   # generic type alias, also new in 3.12`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        The progression: plain assignment (ambiguous) → annotated with{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          TypeAlias
        </code>{" "}
        (explicit) →{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">type</code>{" "}
        statement (first-class syntax). If you are on 3.12, use the{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">type</code>{" "}
        statement. On 3.10-3.11, use{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          TypeAlias
        </code>
        . On older, the plain assignment is still understood by every major type checker.
      </p>
    </section>
  );
}
