import { CodeBlock } from "@/components/blog/interactive/code-block";

export function CounterArithmeticSection() {
  return (
    <section>
      <h2
        id="counter-arithmetic"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Counter arithmetic and most_common
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          collections.Counter
        </code>{" "}
        is a dict subclass for counting. It has been in Python since 2.7, but most people use
        it as a plain tally and miss its arithmetic operators.
      </p>

      <CodeBlock
        code={`from collections import Counter

words = "the quick brown fox jumps over the lazy dog the fox".split()
c = Counter(words)

# Frequency table in one line
print(c.most_common(3))   # top 3

# Add two counters
morning = Counter(["coffee", "tea", "coffee", "juice"])
afternoon = Counter(["coffee", "water", "tea", "coffee"])
total = morning + afternoon
print(total.most_common())`}
        output={`[('the', 3), ('fox', 2), ('quick', 1)]
[('coffee', 4), ('tea', 2), ('juice', 1), ('water', 1)]`}
      />

      <CodeBlock
        code={`from collections import Counter

inventory = Counter({"apple": 10, "banana": 5, "cherry": 3})
sold      = Counter({"apple": 4, "banana": 8, "cherry": 1})

# Subtraction: removes negative/zero counts
remaining = inventory - sold
print(dict(remaining))   # banana drops out (5 - 8 = -3, removed)

# intersection: minimum of each count
shared = inventory & sold
print(dict(shared))

# union: maximum of each count
combined = inventory | sold
print(dict(combined))`}
        output={`{'apple': 6, 'cherry': 2}
{'apple': 4, 'banana': 5, 'cherry': 1}
{'apple': 10, 'banana': 8, 'cherry': 3}`}
      />
    </section>
  );
}
