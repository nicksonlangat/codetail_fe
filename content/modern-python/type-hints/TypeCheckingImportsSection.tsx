import { CodeBlock } from "@/components/blog/interactive/code-block";

export function TypeCheckingImportsSection() {
  return (
    <section>
      <h2
        id="type-checking-imports"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        TYPE_CHECKING: imports that only exist for the type checker
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Some imports exist purely for type annotations. At runtime, they are unnecessary and may
        even create circular import problems. The{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          TYPE_CHECKING
        </code>{" "}
        constant is{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">False</code>{" "}
        at runtime and{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">True</code>{" "}
        only when a static type checker is analysing the code. Wrap annotation-only imports in it.
      </p>

      <CodeBlock
        code={`# 3.5-3.8: import everything at the top, including things only used in annotations
from myapp.models import User      # heavy import, causes circular deps
from myapp.services import Report  # another heavy import

def get_report(user: User) -> Report:
    ...`}
      />

      <CodeBlock
        code={`# Modern: conditional import, zero runtime cost
from __future__ import annotations   # makes annotations strings, defers evaluation
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from myapp.models import User      # only imported during type checking
    from myapp.services import Report  # not imported at runtime

def get_report(user: User) -> Report:   # fine because annotations are strings
    ...`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        The{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          from __future__ import annotations
        </code>{" "}
        is required here: without it, Python would try to evaluate the annotation at function
        definition time and hit a{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          NameError
        </code>{" "}
        because{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">User</code>{" "}
        was never imported at runtime.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Putting the modern type hint style together
      </h3>

      <CodeBlock
        code={`# A modern Python 3.12 module header
from __future__ import annotations  # only needed if supporting < 3.10

from collections.abc import Callable, Iterator
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from myapp.db import Connection

type UserId = int
type Callback[T] = Callable[[T], None]

def find_users(
    db: Connection,
    *,
    active: bool = True,
    limit: int | None = None,
) -> Iterator[UserId]:
    ...`}
      />

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6 mt-6">
        <p className="text-[13px] text-brand-text-muted">
          The rule: lowercase built-ins for generic types (3.9+), <code className="font-mono text-[12px]">|</code> for
          unions (3.10+), <code className="font-mono text-[12px]">type</code> for aliases (3.12+),{" "}
          <code className="font-mono text-[12px]">TYPE_CHECKING</code> for annotation-only imports.
          Pick the floor version your project targets and use everything above it.
        </p>
      </div>
    </section>
  );
}
