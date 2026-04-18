import { CodeBlock } from "@/components/blog/interactive/code-block";

export function DynamicTypingSection() {
  return (
    <section>
      <h2 id="dynamic-typing" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Dynamic typing
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        In languages like Java or C++, you declare the type of a variable upfront and it
        can never hold anything else. Python works differently: the <strong>type lives with
        the object, not the variable</strong>. A name can point to any type of object at any time.
      </p>

      <CodeBlock
        code={`x = 42
print(type(x))    # <class 'int'>

x = "hello"
print(type(x))    # <class 'str'>

x = [1, 2, 3]
print(type(x))    # <class 'list'>

# x didn't change type — x just points to a different object each time`}
        output={`<class 'int'>
<class 'str'>
<class 'list'>`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mt-4 mb-6">
        <p className="text-[13px] text-foreground/70 italic">
          Python is dynamically typed, not untyped. Objects always have a type. Variables
          don&apos;t. The distinction is important.
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Type annotations: hints, not rules</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Python 3.5+ lets you annotate variables and function signatures with types. This is
        purely for documentation and tooling. Python itself ignores annotations at runtime —
        they don&apos;t enforce anything. Tools like{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">mypy</code> and
        your IDE use them to catch type errors before you run the code.
      </p>

      <CodeBlock
        code={`# Annotations add clarity and enable editor autocomplete
name: str = "Alice"
age: int = 30
scores: list[int] = [95, 87, 91]

# Function annotations
def greet(name: str, times: int = 1) -> str:
    return (f"Hello, {name}! " * times).strip()

print(greet("Alice", 2))`}
        output={`Hello, Alice! Hello, Alice!`}
      />

      <CodeBlock
        code={`# Annotations don't stop you from doing the "wrong" thing at runtime
def double(n: int) -> int:
    return n * 2

print(double(5))        # 10 — works as intended
print(double("ha"))     # "haha" — Python doesn't enforce the annotation
print(double([1, 2]))   # [1, 2, 1, 2] — same`}
        output={`10
haha
[1, 2, 1, 2]`}
      />

      <div className="border-l-2 border-warning bg-warning/5 pl-4 py-3 rounded-r-lg mt-3">
        <p className="text-[13px] text-foreground/70">
          <strong>In practice:</strong> annotate your functions and class attributes. Skip
          annotations on local variables inside functions unless the type is non-obvious.
          Run <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">mypy</code>{" "}
          or use an IDE that checks types as you write. The earlier you catch type errors, the
          cheaper they are to fix.
        </p>
      </div>
    </section>
  );
}
