import { CodeBlock } from "@/components/blog/interactive/code-block";

export function PatternsSection() {
  return (
    <section>
      <h2 id="patterns" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Loop patterns
      </h2>

      <h3 className="text-base font-semibold mb-3">Accumulate</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Start with an identity value (0 for sum, 1 for product, [] for a list) and update
        it on every iteration. Built-ins like{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">sum()</code>,{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">min()</code>, and{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">max()</code>{" "}
        handle the common cases.
      </p>

      <CodeBlock
        code={`nums = [3, 1, 4, 1, 5, 9, 2, 6]

# Use built-ins when you can
total   = sum(nums)
biggest = max(nums)
print(total, biggest)    # 31 9

# Manual accumulation — running product
product = 1
for n in nums:
    product *= n
print(product)           # 6480

# Collect into a structure
evens = []
for n in nums:
    if n % 2 == 0:
        evens.append(n)
print(evens)             # [4, 2, 6]`}
        output={`31 9
6480
[4, 2, 6]`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Find first</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Return as soon as you find what you need. Continuing to iterate after finding
        the answer wastes time. Use{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">next()</code>{" "}
        with a generator for a one-liner version.
      </p>

      <CodeBlock
        code={`nums = [4, 7, 2, 9, 1, 5]

# Loop version
def first_odd(items):
    for n in items:
        if n % 2 != 0:
            return n
    return None

print(first_odd(nums))   # 7

# One-liner with next()
first = next((n for n in nums if n % 2 != 0), None)
print(first)             # 7`}
        output={`7
7`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Sliding window</h3>

      <CodeBlock
        code={`def windows(seq, size):
    for i in range(len(seq) - size + 1):
        yield seq[i : i + size]

data = [1, 2, 3, 4, 5]
for w in windows(data, 3):
    print(w)   # [1,2,3]  [2,3,4]  [3,4,5]`}
        output={`[1, 2, 3]
[2, 3, 4]
[3, 4, 5]`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Chunking</h3>

      <CodeBlock
        code={`def chunks(lst, size):
    for i in range(0, len(lst), size):
        yield lst[i : i + size]

data = list(range(10))
for chunk in chunks(data, 3):
    print(chunk)
# [0,1,2]  [3,4,5]  [6,7,8]  [9]`}
        output={`[0, 1, 2]
[3, 4, 5]
[6, 7, 8]
[9]`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Pairwise iteration</h3>

      <CodeBlock
        code={`from itertools import pairwise   # Python 3.10+

temps = [20, 23, 19, 25, 22]
for prev, curr in pairwise(temps):
    change = curr - prev
    sign   = "+" if change > 0 else ""
    print(f"{prev} -> {curr}  ({sign}{change})")`}
        output={`20 -> 23  (+3)
23 -> 19  (-4)
19 -> 25  (+6)
25 -> 22  (-3)`}
      />
    </section>
  );
}
