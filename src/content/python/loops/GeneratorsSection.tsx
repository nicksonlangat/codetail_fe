import { CodeBlock } from "@/components/blog/interactive/code-block";
import { InteractiveGenerator } from "@/components/blog/interactive/interactive-generator";

export function GeneratorsSection() {
  return (
    <section>
      <h2 id="generators" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Generators
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A list comprehension builds the entire list in memory before you start using
        it. A generator expression looks the same but produces values one at a time,
        only when asked. Swap the square brackets for parentheses and you have a
        generator. No list is ever built.
      </p>

      <CodeBlock
        code={`# List comprehension — all 1M items created immediately
squares_list = [x ** 2 for x in range(1_000_000)]

# Generator expression — nothing computed yet
squares_gen  = (x ** 2 for x in range(1_000_000))

import sys
print(sys.getsizeof(squares_list))   # ~8 MB
print(sys.getsizeof(squares_gen))    # 104 bytes`}
        output={`8448728
104`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Consuming a generator</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Generators are lazy — they only compute the next value when you ask for it.
        You can pass them directly to{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">sum()</code>,{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">list()</code>,{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">max()</code>,
        or any function that accepts an iterable. They can only be consumed once.
      </p>

      <CodeBlock
        code={`gen = (x ** 2 for x in range(5))

# Iterate directly
for v in gen:
    print(v, end=" ")   # 0 1 4 9 16
print()

# Useful with built-ins — no intermediate list needed
total = sum(x ** 2 for x in range(1000))
print(total)    # 332833500

biggest = max(len(word) for word in ["hello", "world", "python"])
print(biggest)  # 6

# Generators are exhausted after one pass
gen = (x for x in range(3))
print(list(gen))   # [0, 1, 2]
print(list(gen))   # []  — exhausted`}
        output={`0 1 4 9 16
332833500
6
[0, 1, 2]
[]`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Generator functions with yield</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A function with{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">yield</code>{" "}
        is a generator function. Calling it returns a generator object without running
        any code. Each{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">next()</code>{" "}
        call runs until the next{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">yield</code>,
        then pauses with its state intact.
      </p>

      <CodeBlock
        code={`def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

fib = fibonacci()
print([next(fib) for _ in range(10)])
# [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

# Reading a large file line by line — never loads the whole file
def read_lines(path):
    with open(path) as f:
        for line in f:
            yield line.rstrip()`}
        output={`[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-6 mb-4">
        Compare eager vs lazy evaluation below. In generator mode, each{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">next()</code>{" "}
        computes exactly one value.
      </p>

      <InteractiveGenerator />
    </section>
  );
}
