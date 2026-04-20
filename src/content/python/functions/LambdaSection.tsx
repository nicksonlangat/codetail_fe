import { CodeBlock } from "@/components/blog/interactive/code-block";

export function LambdaSection() {
  return (
    <section>
      <h2 id="lambda" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Lambda and higher-order functions
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">lambda</code>{" "}
        is a small anonymous function defined in one expression. It can take any number
        of arguments but can only have a single expression as its body. Use it when a
        function is short, used once, and the name would add no clarity.
      </p>

      <CodeBlock
        code={`# Lambda syntax: lambda params: expression
double = lambda x: x * 2
add    = lambda x, y: x + y

print(double(5))    # 10
print(add(3, 4))    # 7

# Most common use — as a key function
pairs = [(3, "banana"), (1, "apple"), (2, "cherry")]
pairs.sort(key=lambda item: item[0])
print(pairs)    # [(1, 'apple'), (2, 'cherry'), (3, 'banana')]

words = ["banana", "fig", "apple", "kiwi"]
words.sort(key=lambda w: len(w))
print(words)    # ['fig', 'kiwi', 'apple', 'banana']`}
        output={`10
7
[(1, 'apple'), (2, 'cherry'), (3, 'banana')]
['fig', 'kiwi', 'apple', 'banana']`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mt-2 mb-6">
        <p className="text-[13px] text-foreground/70 italic">
          If you assign a lambda to a variable and reuse it, write a real{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">def</code>{" "}
          instead. Lambdas are for inline, one-off use. Assigning to a variable defeats
          the purpose and makes stack traces harder to read.
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Functions as arguments</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Python functions are first-class objects — you can pass them as arguments,
        return them, and store them in data structures. This enables a clean style
        where behaviour is passed in rather than hardcoded.
      </p>

      <CodeBlock
        code={`def apply(func, items):
    return [func(x) for x in items]

print(apply(str.upper, ["hello", "world"]))  # ['HELLO', 'WORLD']
print(apply(abs, [-3, 1, -5, 2]))            # [3, 1, 5, 2]

# sorted with key= is the canonical example
students = [
    {"name": "Alice", "grade": 92},
    {"name": "Bob",   "grade": 78},
    {"name": "Carol", "grade": 85},
]
ranked = sorted(students, key=lambda s: s["grade"], reverse=True)
for s in ranked:
    print(s["name"], s["grade"])`}
        output={`['HELLO', 'WORLD']
[3, 1, 5, 2]
Alice 92
Carol 85
Bob 78`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">functools.partial</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">partial()</code>{" "}
        creates a new function with some arguments pre-filled. It is cleaner than a
        lambda wrapper and preserves the original function&apos;s metadata.
      </p>

      <CodeBlock
        code={`from functools import partial

def power(base, exp):
    return base ** exp

square = partial(power, exp=2)
cube   = partial(power, exp=3)

print(square(4))      # 16
print(cube(3))        # 27

# Useful for callbacks that need extra context
def log(level, message):
    print(f"[{level}] {message}")

info  = partial(log, "INFO")
error = partial(log, "ERROR")

info("server started")     # [INFO] server started
error("connection lost")   # [ERROR] connection lost`}
        output={`16
27
[INFO] server started
[ERROR] connection lost`}
      />
    </section>
  );
}
