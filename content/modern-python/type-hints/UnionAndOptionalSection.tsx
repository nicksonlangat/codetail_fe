import { CodeBlock } from "@/components/blog/interactive/code-block";

export function UnionAndOptionalSection() {
  return (
    <section>
      <h2
        id="union-and-optional"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Optional[str] is str | None. Write it that way.
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          Optional[str]
        </code>{" "}
        is not a distinct concept. It is an alias for{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          Union[str, None]
        </code>
        . The name "Optional" is actively misleading: it implies the parameter is optional
        (has a default), when all it means is the value can be{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">None</code>.
        Python 3.10 gave us the syntax to say that plainly.
      </p>

      <CodeBlock
        code={`# 3.5-3.9: two separate imports, verbose nesting
from typing import Optional, Union

def find_user(user_id: int) -> Optional[str]:
    ...

def parse(value: Union[str, int, bytes]) -> str:
    ...

def fetch(url: str, timeout: Optional[float] = None) -> Optional[bytes]:
    ...`}
      />

      <CodeBlock
        code={`# 3.10+: | operator, no imports, reads like English
def find_user(user_id: int) -> str | None:
    ...

def parse(value: str | int | bytes) -> str:
    ...

def fetch(url: str, timeout: float | None = None) -> bytes | None:
    ...`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        The{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">|</code>{" "}
        syntax works at runtime in 3.10+, meaning you can use it in{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          isinstance()
        </code>{" "}
        checks too:
      </p>

      <CodeBlock
        code={`# 3.10+: isinstance() with union types
def process(value: str | int) -> str:
    if isinstance(value, str | int):   # works at runtime
        return str(value)
    raise TypeError(value)

# isinstance still also accepts tuples, which is the pre-3.10 way
isinstance(value, (str, int))   # old
isinstance(value, str | int)    # new`}
        output={``}
      />

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Using 3.10 syntax on older runtimes
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        If your code runs on 3.8 or 3.9 but you want the cleaner syntax in annotations, add this
        import at the top of the file. It makes all annotations lazy strings instead of evaluated
        expressions, so the runtime never sees the{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">|</code>{" "}
        syntax and does not choke.
      </p>

      <CodeBlock
        code={`from __future__ import annotations  # top of file

# Now you can write 3.10-style hints on 3.8+
def find_user(user_id: int) -> str | None:
    ...

# Caveat: annotations are now strings, not evaluated.
# inspect.get_annotations() or typing.get_type_hints() evaluates them.
# Direct access via __annotations__ gives the raw string.`}
      />
    </section>
  );
}
