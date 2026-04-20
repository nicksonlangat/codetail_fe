import { CodeBlock } from "@/components/blog/interactive/code-block";
import { Term } from "@/components/blog/interactive/term";

export function ComprehensionsSection() {
  return (
    <section>
      <h2 id="comprehensions" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        List comprehensions
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A list comprehension builds a new list from an{" "}
        <Term term="iterable">iterable</Term>{" "}
        in a single expression. It is faster than a loop, more readable for simple
        transformations, and one of the most distinctly Pythonic features in the language.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The speed difference comes from how Python runs them. A regular loop calls{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">.append()</code>{" "}
        on every iteration. Each call is a Python-level method lookup and function
        invocation. A comprehension skips that entirely. Python handles the whole loop
        internally in C, using a single optimized bytecode instruction to add each item.
        The more items you process, the wider the gap.
      </p>

      <CodeBlock
        code={`# Loop version
squares = []
for x in range(6):
    squares.append(x ** 2)

# Comprehension version - same result, one line
squares = [x ** 2 for x in range(6)]
print(squares)    # [0, 1, 4, 9, 16, 25]`}
        output={`[0, 1, 4, 9, 16, 25]`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-foreground/70 italic">
          Syntax:{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">
            [expression for item in iterable if condition]
          </code>.
          The{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">if condition</code>{" "}
          part is optional.
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">With a filter condition</h3>
      <CodeBlock
        code={`nums = range(20)

evens  = [x for x in nums if x % 2 == 0]
print(evens)   # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# Transform and filter at the same time
even_squares = [x ** 2 for x in nums if x % 2 == 0]
print(even_squares)   # [0, 4, 16, 36, 64, 100, 144, 196, 256, 324]

# Filter a list of strings
words = ["hello", "", "world", "  ", "python"]
non_empty = [w for w in words if w.strip()]
print(non_empty)   # ['hello', 'world', 'python']`}
        output={`[0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
[0, 4, 16, 36, 64, 100, 144, 196, 256, 324]
['hello', 'world', 'python']`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Nested comprehensions</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        When a comprehension has multiple{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">for</code>{" "}
        clauses, the order trips people up. The rule is simple: write the{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">for</code>{" "}
        clauses in exactly the same order you would write the nested loops, top to bottom.
        Outer loop first, inner loop second.
      </p>

      <CodeBlock
        code={`# Flatten a 2D list
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flat = [x for row in matrix for x in row]
print(flat)   # [1, 2, 3, 4, 5, 6, 7, 8, 9]

# Cartesian product
colors = ["red", "green"]
sizes  = ["S", "M", "L"]
variants = [(c, s) for c in colors for s in sizes]
print(variants)
# [('red','S'),('red','M'),('red','L'),('green','S'),('green','M'),('green','L')]`}
        output={`[1, 2, 3, 4, 5, 6, 7, 8, 9]
[('red', 'S'), ('red', 'M'), ('red', 'L'), ('green', 'S'), ('green', 'M'), ('green', 'L')]`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mt-4">
        <p className="text-[13px] font-semibold text-foreground/80 mb-2">Formula</p>
        <p className="text-[13px] text-foreground/70 mb-3">
          Translate stacked loops into a comprehension by reading top to bottom, left to right.
          The expression you want to collect goes at the front.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50 mb-1.5">Nested loops</p>
            <pre className="font-mono text-[12px] text-foreground/80 leading-relaxed bg-muted px-3 py-2.5 rounded-lg">{`for row in matrix:   # outer
    for x in row:    # inner
        result.append(x)`}</pre>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50 mb-1.5">Comprehension</p>
            <pre className="font-mono text-[12px] text-foreground/80 leading-relaxed bg-muted px-3 py-2.5 rounded-lg">{`[x                   # expression
  for row in matrix  # outer
  for x in row]      # inner`}</pre>
          </div>
        </div>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">When not to use comprehensions</h3>
      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The readability advantage disappears when the logic gets complex. If you need
        multiple conditions, nested calls, or side effects, a plain loop communicates
        intent more clearly. Cleverness is not a virtue here.
      </p>
      <CodeBlock
        code={`# Too complex - use a regular loop
result = [
    process(item)
    for item in get_items()
    if item.is_valid()
    if item.category in allowed_categories
    if item.price < max_price
]

# Clear loop version
result = []
for item in get_items():
    if not item.is_valid():
        continue
    if item.category not in allowed_categories:
        continue
    if item.price >= max_price:
        continue
    result.append(process(item))`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mt-3">
        <p className="text-[13px] text-foreground/70 italic">
          If the comprehension does not fit on one readable line, write a loop. The goal
          is code that communicates clearly, not the fewest lines.
        </p>
      </div>
    </section>
  );
}
