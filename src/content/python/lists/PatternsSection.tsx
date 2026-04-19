import { CodeBlock } from "@/components/blog/interactive/code-block";

export function PatternsSection() {
  return (
    <section>
      <h2 id="real-world-patterns" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Real-world patterns
      </h2>

      <h3 className="text-base font-semibold mt-8 mb-3">Deduplicate while preserving order</h3>
      <p className="text-[14px] text-foreground/80 mb-3">
        Converting to a set removes duplicates but loses order.
        This pattern preserves it.
      </p>
      <CodeBlock
        code={`items = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]

# set() - fast but unordered
unique_unordered = list(set(items))

# dict.fromkeys() - preserves insertion order (Python 3.7+)
unique_ordered = list(dict.fromkeys(items))
print(unique_ordered)    # [3, 1, 4, 5, 9, 2, 6]`}
        output={`[3, 1, 4, 5, 9, 2, 6]`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Chunk a list into batches</h3>
      <CodeBlock
        code={`def chunks(lst, size):
    return [lst[i:i + size] for i in range(0, len(lst), size)]

data = list(range(10))
print(chunks(data, 3))
# [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9]]`}
        output={`[[0, 1, 2], [3, 4, 5], [6, 7, 8], [9]]`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Use a list as a stack</h3>
      <p className="text-[14px] text-foreground/80 mb-3">
        Lists make an efficient stack with{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">append()</code> and{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">pop()</code>.
        Both are O(1).
      </p>
      <CodeBlock
        code={`stack = []

stack.append("first")
stack.append("second")
stack.append("third")

print(stack.pop())   # "third"  - last in, first out
print(stack.pop())   # "second"
print(stack)         # ["first"]

# Practical: undo history
history = []
history.append(("type", "H"))
history.append(("type", "i"))
history.append(("delete",))

last = history.pop()   # undo last action`}
        output={`third
second
['first']`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">zip: iterate two lists in parallel</h3>
      <CodeBlock
        code={`names  = ["Alice", "Bob", "Charlie"]
scores = [92, 85, 78]

for name, score in zip(names, scores):
    print(f"{name}: {score}")

# zip stops at the shorter list
# Use itertools.zip_longest to pad with a fill value
from itertools import zip_longest
for a, b in zip_longest([1, 2, 3], [10, 20], fillvalue=0):
    print(a, b)`}
        output={`Alice: 92
Bob: 85
Charlie: 78
1 10
2 20
3 0`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">enumerate: index and value together</h3>
      <CodeBlock
        code={`fruits = ["apple", "banana", "cherry"]

# Never do this
for i in range(len(fruits)):
    print(i, fruits[i])

# Do this instead
for i, fruit in enumerate(fruits):
    print(i, fruit)

# Start from a different index
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

      <h3 className="text-base font-semibold mt-8 mb-3">Flatten and group</h3>
      <CodeBlock
        code={`from itertools import groupby

# Flatten one level deep
nested = [[1, 2], [3, 4], [5, 6]]
flat = [x for sublist in nested for x in sublist]
print(flat)   # [1, 2, 3, 4, 5, 6]

# Group consecutive equal items
data = ["a", "a", "b", "b", "b", "a"]
groups = [(key, list(group)) for key, group in groupby(data)]
print(groups)
# [('a', ['a', 'a']), ('b', ['b', 'b', 'b']), ('a', ['a'])]`}
        output={`[1, 2, 3, 4, 5, 6]
[('a', ['a', 'a']), ('b', ['b', 'b', 'b']), ('a', ['a'])]`}
      />
    </section>
  );
}
