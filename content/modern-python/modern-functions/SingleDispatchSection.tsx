import { CodeBlock } from "@/components/blog/interactive/code-block";

export function SingleDispatchSection() {
  return (
    <section>
      <h2
        id="single-dispatch"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        @singledispatch: type-based function routing
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        When a function needs to behave differently for different types, the naive solution is a
        chain of{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          isinstance
        </code>{" "}
        checks. It works, but adding new types means editing the original function.
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          @singledispatch
        </code>{" "}
        lets you register handlers separately and extend without modifying the base.
      </p>

      <CodeBlock
        code={`# Before: isinstance ladder that grows with every new type
def serialize(obj):
    if isinstance(obj, int):
        return str(obj)
    elif isinstance(obj, float):
        return f"{obj:.6g}"
    elif isinstance(obj, list):
        return "[" + ", ".join(serialize(x) for x in obj) + "]"
    elif isinstance(obj, dict):
        pairs = ", ".join(f"{k}: {serialize(v)}" for k, v in obj.items())
        return "{" + pairs + "}"
    else:
        raise TypeError(f"Cannot serialize {type(obj)}")`}
      />

      <CodeBlock
        code={`from functools import singledispatch

@singledispatch
def serialize(obj):
    raise TypeError(f"Cannot serialize {type(obj)}")

@serialize.register(int)
def _(obj: int) -> str:
    return str(obj)

@serialize.register(float)
def _(obj: float) -> str:
    return f"{obj:.6g}"

@serialize.register(list)
def _(obj: list) -> str:
    return "[" + ", ".join(serialize(x) for x in obj) + "]"

@serialize.register(dict)
def _(obj: dict) -> str:
    pairs = ", ".join(f"{k}: {serialize(v)}" for k, v in obj.items())
    return "{" + pairs + "}"

print(serialize(42))
print(serialize(3.14159))
print(serialize([1, 2.5, 3]))
print(serialize({"a": 1, "b": [2, 3]}))`}
        output={`42
3.14159
[1, 2.5, 3]
{a: 1, b: [2, 3]}`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        The real benefit: if a library defines{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          serialize
        </code>
        , you can add support for your own types without touching its source. Just import the
        function and register your handler.
      </p>
    </section>
  );
}
