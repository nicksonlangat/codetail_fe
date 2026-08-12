import { CodeBlock } from "@/components/blog/interactive/code-block";

export function BatchedAndPairwiseSection() {
  return (
    <section>
      <h2
        id="batched-and-pairwise"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        itertools.batched (3.12) and itertools.pairwise (3.10)
      </h2>

      <h3 className="text-base font-semibold text-brand-text mt-6 mb-3">
        batched: fixed-size chunks without the slice gymnastics
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Splitting a list into fixed-size chunks was a famous Python interview snippet because there
        was no built-in for it. Now there is.
      </p>

      <CodeBlock
        code={`# Before 3.12: the classic chunk recipe
def chunked(iterable, n):
    lst = list(iterable)
    return [lst[i:i + n] for i in range(0, len(lst), n)]

items = range(10)
for batch in chunked(items, 3):
    print(batch)`}
        output={`[0, 1, 2]
[3, 4, 5]
[6, 7, 8]
[9]`}
      />

      <CodeBlock
        code={`from itertools import batched

# Python 3.12: lazy, no need to materialise the list first
items = range(10)
for batch in batched(items, 3):
    print(batch)   # each batch is a tuple

# Practical: insert rows in batches of 1000
def insert_rows(rows: list[dict]) -> None:
    for batch in batched(rows, 1000):
        db.bulk_insert(batch)`}
        output={`(0, 1, 2)
(3, 4, 5)
(6, 7, 8)
(9,)`}
      />

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        pairwise: consecutive overlapping pairs
      </h3>

      <CodeBlock
        code={`from itertools import pairwise

# Before 3.10: zip with offset slice
points = [0, 10, 25, 30, 50]
deltas_old = [b - a for a, b in zip(points, points[1:])]

# Python 3.10: pairwise -- cleaner, lazy
deltas = [b - a for a, b in pairwise(points)]
print(deltas)   # [10, 15, 5, 20]

# Useful for: consecutive diffs, sliding window checks, path lengths
path = ["A", "B", "C", "D"]
edges = list(pairwise(path))
print(edges)   # [('A', 'B'), ('B', 'C'), ('C', 'D')]`}
        output={`[10, 15, 5, 20]
[('A', 'B'), ('B', 'C'), ('C', 'D')]`}
      />
    </section>
  );
}
