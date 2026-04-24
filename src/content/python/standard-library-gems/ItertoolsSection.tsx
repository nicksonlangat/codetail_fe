import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ItertoolsSection() {
  return (
    <section>
      <h2 id="itertools" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        itertools
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">itertools</code>{" "}
        is a collection of fast, memory-efficient building blocks for working with
        iterables. Every function returns an iterator — it generates values on demand
        rather than building a full list in memory first.
      </p>

      <h3 className="text-base font-semibold mt-6 mb-3">chain and chain.from_iterable</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Concatenate any number of iterables without building intermediate lists.
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded"> chain.from_iterable</code>{" "}
        flattens one level of nesting.
      </p>

      <CodeBlock
        code={`from itertools import chain

# Concatenate multiple iterables
letters = chain("abc", "def", "ghi")
print(list(letters))   # ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']

# Flatten one level of nesting
nested = [[1, 2], [3, 4], [5, 6]]
flat = list(chain.from_iterable(nested))
print(flat)   # [1, 2, 3, 4, 5, 6]`}
        output={`['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
[1, 2, 3, 4, 5, 6]`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">islice</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Slice any iterator, not just sequences. Essential when working with
        generators or infinite sequences.
      </p>

      <CodeBlock
        code={`from itertools import islice, count

# count() produces an infinite sequence: 0, 1, 2, ...
first_ten = list(islice(count(), 10))
print(first_ten)   # [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

# islice(iterable, start, stop, step)
evens = list(islice(count(), 0, 20, 2))
print(evens)   # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# Read only the first 5 lines of a large file without loading all of it
with open("large_file.txt") as f:
    head = list(islice(f, 5))`}
        output={`[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
[0, 2, 4, 6, 8, 10, 12, 14, 16, 18]`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">product, combinations, permutations</h3>

      <CodeBlock
        code={`from itertools import product, combinations, permutations

# Cartesian product — all pairs from two sequences
for size, color in product(["S", "M", "L"], ["red", "blue"]):
    print(f"{size}-{color}", end="  ")
# S-red  S-blue  M-red  M-blue  L-red  L-blue

print()

# All 2-element combinations (order doesn't matter, no repeats)
print(list(combinations("ABCD", 2)))
# [('A','B'), ('A','C'), ('A','D'), ('B','C'), ('B','D'), ('C','D')]

# All 2-element permutations (order matters)
print(list(permutations("ABC", 2)))
# [('A','B'), ('A','C'), ('B','A'), ('B','C'), ('C','A'), ('C','B')]`}
        output={`S-red  S-blue  M-red  M-blue  L-red  L-blue
[('A', 'B'), ('A', 'C'), ('A', 'D'), ('B', 'C'), ('B', 'D'), ('C', 'D')]
[('A', 'B'), ('A', 'C'), ('B', 'A'), ('B', 'C'), ('C', 'A'), ('C', 'B')]`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">groupby</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">groupby</code>{" "}
        groups consecutive elements by a key function. Sort the data by that key
        first — it only groups adjacent equal keys, not all matching keys in the
        sequence.
      </p>

      <CodeBlock
        code={`from itertools import groupby

data = [
    {"name": "Alice", "dept": "eng"},
    {"name": "Bob",   "dept": "eng"},
    {"name": "Carol", "dept": "hr"},
    {"name": "Dave",  "dept": "hr"},
    {"name": "Eve",   "dept": "eng"},
]

# Sort first, then group
data.sort(key=lambda r: r["dept"])

for dept, members in groupby(data, key=lambda r: r["dept"]):
    names = [m["name"] for m in members]
    print(f"{dept}: {names}")`}
        output={`eng: ['Alice', 'Bob', 'Eve']
hr: ['Carol', 'Dave']`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">takewhile and dropwhile</h3>

      <CodeBlock
        code={`from itertools import takewhile, dropwhile

nums = [2, 4, 6, 7, 8, 10]

# Take elements while condition holds, stop at first failure
evens_prefix = list(takewhile(lambda x: x % 2 == 0, nums))
print(evens_prefix)   # [2, 4, 6]

# Skip elements while condition holds, then yield the rest
rest = list(dropwhile(lambda x: x % 2 == 0, nums))
print(rest)           # [7, 8, 10]`}
        output={`[2, 4, 6]
[7, 8, 10]`}
      />
    </section>
  );
}
