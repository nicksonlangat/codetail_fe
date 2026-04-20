import { CodeBlock } from "@/components/blog/interactive/code-block";
import { InteractiveEnumerateZip } from "@/components/blog/interactive/interactive-enumerate-zip";

export function EnumerateZipSection() {
  return (
    <section>
      <h2 id="enumerate-zip" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        enumerate and zip
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Two built-in functions that make loops cleaner.{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">enumerate()</code>{" "}
        gives you both the index and value without manual counter management.{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">zip()</code>{" "}
        pairs items from two or more iterables.
      </p>

      <h3 className="text-base font-semibold mb-3">enumerate()</h3>

      <CodeBlock
        code={`fruits = ["apple", "banana", "cherry"]

# Without enumerate — error-prone counter
for i in range(len(fruits)):
    print(i, fruits[i])

# With enumerate — cleaner and safer
for i, fruit in enumerate(fruits):
    print(i, fruit)

# Start index at 1
for i, fruit in enumerate(fruits, start=1):
    print(f"{i}. {fruit}")`}
        output={`0 apple
1 banana
2 cherry
0 apple
1 banana
2 cherry
1. apple
2. banana
3. cherry`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">zip()</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">zip()</code>{" "}
        stops at the shortest iterable. If you need to continue to the longest and fill
        missing values with a default, use{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">itertools.zip_longest()</code>.
      </p>

      <CodeBlock
        code={`names  = ["Alice", "Bob", "Carol"]
scores = [92, 78, 85]
grades = ["A", "C+", "B"]

# Pair two lists
for name, score in zip(names, scores):
    print(f"{name}: {score}")

# Three lists at once
for name, score, grade in zip(names, scores, grades):
    print(f"{name}: {score} ({grade})")

# zip stops at the shortest
short = [1, 2]
long  = [10, 20, 30, 40]
print(list(zip(short, long)))    # [(1, 10), (2, 20)]

# zip_longest fills missing values
from itertools import zip_longest
print(list(zip_longest(short, long, fillvalue=0)))
# [(1, 10), (2, 20), (0, 30), (0, 40)]`}
        output={`Alice: 92
Bob: 78
Carol: 85
Alice: 92 (A)
Bob: 78 (C+)
Carol: 85 (B)
[(1, 10), (2, 20)]
[(1, 10), (2, 20), (0, 30), (0, 40)]`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Combining enumerate and zip</h3>

      <CodeBlock
        code={`fruits = ["apple", "banana", "cherry", "date"]
prices = [1.20, 0.50, 3.00, 4.50]

for i, (fruit, price) in enumerate(zip(fruits, prices), start=1):
    print(f"{i}. {fruit} — {price:.2f}")`}
        output={`1. apple — 1.20
2. banana — 0.50
3. cherry — 3.00
4. date — 4.50`}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-6 mb-4">
        See every iteration pattern side by side below.
      </p>

      <InteractiveEnumerateZip />
    </section>
  );
}
