import { CodeBlock } from "@/components/blog/interactive/code-block";

export function PatternsSection() {
  return (
    <section>
      <h2 id="patterns" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Real-world patterns
      </h2>

      <h3 className="text-base font-semibold mb-3">Fast duplicate detection</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Comparing{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">len(items)</code>{" "}
        against{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">len(set(items))</code>{" "}
        tells you instantly whether any duplicates exist, with no explicit loop.
      </p>

      <CodeBlock
        code={`def has_duplicates(items) -> bool:
    return len(items) != len(set(items))

print(has_duplicates([1, 2, 3, 4]))      # False
print(has_duplicates([1, 2, 2, 3]))      # True
print(has_duplicates("abcde"))           # False
print(has_duplicates("hello"))           # True`}
        output={`False
True
False
True`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Finding common and unique elements</h3>

      <CodeBlock
        code={`users_a = {"alice", "bob", "carol", "dan"}
users_b = {"carol", "dan", "eve", "frank"}

# Who is in both groups?
both   = users_a & users_b
print("both:", both)         # {'carol', 'dan'}

# Who is only in group A?
a_only = users_a - users_b
print("A only:", a_only)     # {'alice', 'bob'}

# Who appears in either group, just once?
exclusive = users_a ^ users_b
print("exclusive:", exclusive)  # {'alice', 'bob', 'eve', 'frank'}

# Everyone combined
everyone = users_a | users_b
print("total:", len(everyone))  # 6`}
        output={`both: {'carol', 'dan'}
A only: {'alice', 'bob'}
exclusive: {'alice', 'bob', 'eve', 'frank'}
total: 6`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">frozenset as a dict key</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Sets are mutable, so they cannot be used as dict keys or placed inside sets.{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">frozenset</code>{" "}
        is the immutable version — hashable, usable anywhere a set&apos;s structure is needed
        but mutability is not.
      </p>

      <CodeBlock
        code={`# frozenset is immutable and hashable
fs = frozenset([1, 2, 3])
print(fs)              # frozenset({1, 2, 3})

# Can be used as a dict key
pair_scores = {
    frozenset({"Alice", "Bob"}):   10,
    frozenset({"Alice", "Carol"}): 7,
}
key = frozenset({"Bob", "Alice"})   # order does not matter
print(pair_scores[key])             # 10

# Can be placed inside a set
seen_pairs = set()
seen_pairs.add(frozenset({"Alice", "Bob"}))
print(frozenset({"Bob", "Alice"}) in seen_pairs)  # True`}
        output={`frozenset({1, 2, 3})
10
True`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Set comprehensions</h3>

      <CodeBlock
        code={`words = ["hello", "world", "hello", "python", "world"]

# Unique lengths
lengths = {len(w) for w in words}
print(lengths)     # {5, 6}

# Unique first letters
initials = {w[0].upper() for w in words}
print(initials)    # {'H', 'W', 'P'}

# Filter and deduplicate in one step
long_words = {w for w in words if len(w) > 4}
print(long_words)  # {'hello', 'world', 'python'}`}
        output={`{5, 6}
{'H', 'W', 'P'}
{'hello', 'world', 'python'}`}
      />
    </section>
  );
}
