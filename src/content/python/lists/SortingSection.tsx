import { CodeBlock } from "@/components/blog/interactive/code-block";

export function SortingSection() {
  return (
    <section>
      <h2 id="sorting" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Sorting
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Python gives you two ways to sort. The difference matters:{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">sort()</code> modifies
        the list in place and returns{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">None</code>.{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">sorted()</code> returns
        a new sorted list and leaves the original untouched.
      </p>

      <CodeBlock
        code={`nums = [3, 1, 4, 1, 5, 9, 2]

# sorted() - returns new list, original unchanged
ordered = sorted(nums)
print(ordered)    # [1, 1, 2, 3, 4, 5, 9]
print(nums)       # [3, 1, 4, 1, 5, 9, 2] - unchanged

# sort() - in-place, returns None
nums.sort()
print(nums)       # [1, 1, 2, 3, 4, 5, 9]

# Reverse order
print(sorted(nums, reverse=True))   # [9, 5, 4, 3, 2, 1, 1]`}
        output={`[1, 1, 2, 3, 4, 5, 9]
[3, 1, 4, 1, 5, 9, 2]
[1, 1, 2, 3, 4, 5, 9]
[9, 5, 4, 3, 2, 1, 1]`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Sorting with a key</h3>
      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">key</code>{" "}
        parameter takes a function applied to each item before comparison. The items themselves
        are not changed. Only the comparison uses the key.
      </p>
      <CodeBlock
        code={`words = ["banana", "fig", "apple", "date", "elderberry"]

# Sort by length
print(sorted(words, key=len))
# ['fig', 'date', 'apple', 'banana', 'elderberry']

# Sort alphabetically, case-insensitive
names = ["alice", "Bob", "charlie", "Dave"]
print(sorted(names, key=str.lower))
# ['alice', 'Bob', 'charlie', 'Dave']

# Sort a list of dicts by a field
people = [
    {"name": "Charlie", "age": 30},
    {"name": "Alice",   "age": 25},
    {"name": "Bob",     "age": 35},
]
by_age = sorted(people, key=lambda p: p["age"])
print([p["name"] for p in by_age])   # ['Alice', 'Charlie', 'Bob']

# Sort by multiple fields: age ascending, then name alphabetically
by_age_then_name = sorted(people, key=lambda p: (p["age"], p["name"]))
print([p["name"] for p in by_age_then_name])`}
        output={`['fig', 'date', 'apple', 'banana', 'elderberry']
['alice', 'Bob', 'charlie', 'Dave']
['Alice', 'Charlie', 'Bob']
['Alice', 'Charlie', 'Bob']`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mt-4">
        <p className="text-[13px] text-foreground/70 italic">
          Python&apos;s sort is stable: items that compare equal keep their original order. This
          matters when sorting by multiple criteria in sequence: sort by a secondary
          key first, then by the primary key, and ties in the primary key will preserve the
          secondary order.
        </p>
      </div>
    </section>
  );
}
