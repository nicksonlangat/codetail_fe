import { CodeBlock } from "@/components/blog/interactive/code-block";

export function BuiltinGenericsSection() {
  return (
    <section>
      <h2
        id="builtin-generics"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        List, Dict, Tuple: the imports you no longer need
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Before 3.9, annotating a function that takes a list of integers required importing{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">List</code>{" "}
        from{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">typing</code>{" "}
        because{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">list[int]</code>{" "}
        was a syntax error. The built-in{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">list</code>{" "}
        type did not support subscripting at runtime.
      </p>

      <CodeBlock
        code={`# 3.5-3.8: you had to import capitalized wrappers
from typing import Dict, FrozenSet, List, Optional, Set, Tuple

def process(items: List[int]) -> Dict[str, List[int]]:
    ...

def coords() -> Tuple[float, float, float]:
    ...

def unique(values: List[str]) -> Set[str]:
    ...`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        Python 3.9 made built-in collection types subscriptable directly. The{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">typing</code>{" "}
        versions still work, but they are deprecated for this purpose and will eventually be removed.
        Delete the import, lowercase everything.
      </p>

      <CodeBlock
        code={`# 3.9+: no import needed, use the built-ins directly
def process(items: list[int]) -> dict[str, list[int]]:
    ...

def coords() -> tuple[float, float, float]:
    ...

def unique(values: list[str]) -> set[str]:
    ...`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        The full list of types that gained subscript support in 3.9:{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">list</code>,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">dict</code>,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">tuple</code>,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">set</code>,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          frozenset
        </code>
        ,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">type</code>,
        plus stdlib types in{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          collections
        </code>
        ,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          collections.abc
        </code>
        , and others.
      </p>

      <CodeBlock
        code={`# stdlib types also work directly now
from collections import defaultdict, deque
from collections.abc import Callable, Iterator, Generator

def pipeline(steps: list[Callable[[int], int]]) -> Callable[[int], int]:
    def run(value: int) -> int:
        for step in steps:
            value = step(value)
        return value
    return run

def count_up(start: int) -> Iterator[int]:
    while True:
        yield start
        start += 1`}
      />
    </section>
  );
}
