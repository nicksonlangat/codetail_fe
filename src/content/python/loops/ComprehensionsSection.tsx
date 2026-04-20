import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ComprehensionsSection() {
  return (
    <section>
      <h2 id="comprehensions" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Comprehensions
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Comprehensions are compact loop expressions that produce a collection. Python
        has three kinds: list, dict, and set. All follow the same structure — expression
        first, then the loop, then an optional filter.
      </p>

      <CodeBlock
        code={`numbers = range(10)

# List comprehension — [expression for item in iterable if condition]
evens   = [x for x in numbers if x % 2 == 0]
squares = [x ** 2 for x in numbers]
print(evens)    # [0, 2, 4, 6, 8]
print(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# Dict comprehension — {key: value for item in iterable}
sq_map = {x: x ** 2 for x in range(6)}
print(sq_map)   # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# Set comprehension — {expression for item in iterable}
words   = ["hello", "world", "hello", "python"]
lengths = {len(w) for w in words}
print(lengths)  # {5, 6}`}
        output={`[0, 2, 4, 6, 8]
[0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
{0: 0, 1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
{5, 6}`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Nested comprehensions</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Multiple{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">for</code>{" "}
        clauses are written in the same order as nested loops — outer first, inner second.
      </p>

      <CodeBlock
        code={`# Flatten a 2D list
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flat = [x for row in matrix for x in row]
print(flat)     # [1, 2, 3, 4, 5, 6, 7, 8, 9]

# Cartesian product
sizes  = ["S", "M", "L"]
colors = ["red", "blue"]
variants = [(s, c) for s in sizes for c in colors]
print(variants)`}
        output={`[1, 2, 3, 4, 5, 6, 7, 8, 9]
[('S', 'red'), ('S', 'blue'), ('M', 'red'), ('M', 'blue'), ('L', 'red'), ('L', 'blue')]`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">When not to use a comprehension</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Comprehensions lose their readability advantage as complexity grows. If the
        expression or condition is long, or if you need side effects, a plain loop
        communicates intent more clearly.
      </p>

      <CodeBlock
        code={`# Too complex — use a plain loop
result = [
    transform(item)
    for item in get_items()
    if item.is_valid()
    if item.price < threshold
]

# Clearer as a loop
result = []
for item in get_items():
    if not item.is_valid():
        continue
    if item.price >= threshold:
        continue
    result.append(transform(item))`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mt-2">
        <p className="text-[13px] text-foreground/70 italic">
          If it does not fit on one readable line, write a loop. Fewer lines is not the goal.
          Readable code is.
        </p>
      </div>
    </section>
  );
}
