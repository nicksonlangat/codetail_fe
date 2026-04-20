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

      <p className="text-[14px] text-foreground/80 mb-3">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">zip()</code>{" "}
        pairs up items from two or more lists by position and lets you unpack them together
        in a loop. Index zero from each list, then index one, then index two. No manual
        indexing required.
      </p>

      <CodeBlock
        code={`names  = ["Alice", "Bob", "Charlie"]
scores = [92, 85, 78]

for name, score in zip(names, scores):
    print(f"{name}: {score}")`}
        output={`Alice: 92
Bob: 85
Charlie: 78`}
      />

      <p className="text-[14px] text-foreground/80 mt-5 mb-3">
        <strong className="font-semibold text-foreground">Shortest wins by default.</strong>{" "}
        When the lists are different lengths,{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">zip()</code>{" "}
        stops as soon as the shorter one runs out. The extra items in the longer list are
        silently ignored.
      </p>

      <CodeBlock
        code={`letters = ["a", "b", "c", "d"]
nums    = [1, 2]

for letter, num in zip(letters, nums):
    print(letter, num)
# "c" and "d" are never reached`}
        output={`a 1
b 2`}
      />

      <p className="text-[14px] text-foreground/80 mt-5 mb-3">
        <strong className="font-semibold text-foreground">Longest with a fill value.</strong>{" "}
        If you need every item from every list, use{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">zip_longest</code>{" "}
        from{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">itertools</code>.
        It pads the shorter list with a fill value you choose instead of stopping early.
      </p>

      <CodeBlock
        code={`from itertools import zip_longest

letters = ["a", "b", "c", "d"]
nums    = [1, 2]

for letter, num in zip_longest(letters, nums, fillvalue=0):
    print(letter, num)`}
        output={`a 1
b 2
c 0
d 0`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mt-4">
        <p className="text-[13px] text-foreground/70">
          Use{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">zip()</code>{" "}
          when mismatched lengths are a bug and you want to fail fast.
          Use{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">zip_longest()</code>{" "}
          when shorter lists are expected and a default value makes sense.
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">enumerate: index and value together</h3>

      <p className="text-[14px] text-foreground/80 mb-3">
        When you need both the position and the value while looping,{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">enumerate()</code>{" "}
        gives you both at once as a pair. It is the standard Python way to track position
        inside a loop without reaching for the index manually.
      </p>

      <p className="text-[14px] text-foreground/80 mb-3">
        The common alternative,{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">range(len(fruits))</code>,
        works but forces you to index back into the list on every iteration. It is
        noisier, easier to get wrong, and signals to other Python developers that you
        are not yet thinking in Python idioms.
      </p>

      <CodeBlock
        code={`fruits = ["apple", "banana", "cherry"]

# Avoid: manual index lookup on every iteration
for i in range(len(fruits)):
    print(i, fruits[i])

# Prefer: enumerate gives you both directly
for i, fruit in enumerate(fruits):
    print(i, fruit)`}
        output={`0 apple
1 banana
2 cherry
0 apple
1 banana
2 cherry`}
      />

      <p className="text-[14px] text-foreground/80 mt-5 mb-3">
        The{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">start</code>{" "}
        parameter lets you begin counting from any number. Useful for user-facing
        output where 0-based numbering looks wrong.
      </p>

      <CodeBlock
        code={`fruits = ["apple", "banana", "cherry"]

for i, fruit in enumerate(fruits, start=1):
    print(f"{i}. {fruit}")`}
        output={`1. apple
2. banana
3. cherry`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mt-4">
        <p className="text-[13px] text-foreground/70">
          If you catch yourself writing{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">range(len(...))</code>{" "}
          to get an index, stop and use{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">enumerate()</code>{" "}
          instead. It is almost always the right call.
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Flatten and group</h3>

      <p className="text-[14px] text-foreground/80 mb-3">
        Flattening collapses a list of lists into a single list. The nested comprehension
        pattern works for one level deep. You iterate over each sublist, then over each
        item inside it. Outer loop first, inner loop second. The same rule as always.
      </p>

      <CodeBlock
        code={`nested = [[1, 2], [3, 4], [5, 6]]
flat = [x for sublist in nested for x in sublist]
print(flat)   # [1, 2, 3, 4, 5, 6]`}
        output={`[1, 2, 3, 4, 5, 6]`}
      />

      <p className="text-[14px] text-foreground/80 mt-5 mb-3">
        Grouping collects consecutive equal items together.{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">itertools.groupby()</code>{" "}
        works like SQL{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">GROUP BY</code>{" "}
        but only on runs of identical adjacent values. If you want to group all matching
        values regardless of position, sort the list first.
      </p>

      <CodeBlock
        code={`from itertools import groupby

data = ["a", "a", "b", "b", "b", "a"]
groups = [(key, list(group)) for key, group in groupby(data)]
print(groups)
# [('a', ['a', 'a']), ('b', ['b', 'b', 'b']), ('a', ['a'])]

# Sort first to group all matching values together
data_sorted = sorted(data)
all_groups = [(key, list(group)) for key, group in groupby(data_sorted)]
print(all_groups)
# [('a', ['a', 'a', 'a']), ('b', ['b', 'b', 'b'])]`}
        output={`[('a', ['a', 'a']), ('b', ['b', 'b', 'b']), ('a', ['a'])]
[('a', ['a', 'a', 'a']), ('b', ['b', 'b', 'b'])]`}
      />
    </section>
  );
}
