import { CodeBlock } from "@/components/blog/interactive/code-block";

export function IteratingSection() {
  return (
    <section>
      <h2 id="iterating" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Iterating
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Dictionaries have three view objects:{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">.keys()</code>,{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">.values()</code>, and{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">.items()</code>.
        They are live — they reflect any changes to the dict without being rebuilt.
        Iterating a dict directly gives you its keys, same as{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">.keys()</code>.
      </p>

      <CodeBlock
        code={`scores = {"Alice": 92, "Bob": 78, "Carol": 85}

# Keys (default)
for name in scores:
    print(name)           # Alice, Bob, Carol

# Values
for score in scores.values():
    print(score)          # 92, 78, 85

# Both — .items() is the most common loop
for name, score in scores.items():
    print(f"{name}: {score}")`}
        output={`Alice
Bob
Carol
92
78
85
Alice: 92
Bob: 78
Carol: 85`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Sorted iteration</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Python 3.7+ guarantees that dicts preserve insertion order. If you need a
        different order, wrap the iteration in{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">sorted()</code>.
        The dict itself is never modified.
      </p>

      <CodeBlock
        code={`scores = {"Alice": 92, "Bob": 78, "Carol": 85}

# Sort by name (alphabetical)
for name, score in sorted(scores.items()):
    print(f"{name}: {score}")

print()

# Sort by score (descending)
for name, score in sorted(scores.items(), key=lambda item: item[1], reverse=True):
    print(f"{name}: {score}")`}
        output={`Alice: 92
Bob: 78
Carol: 85

Alice: 92
Carol: 85
Bob: 78`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Never modify during iteration</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Adding or removing keys while iterating raises a{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">RuntimeError</code>.
        If you need to filter a dict, iterate a copy of the keys or build a new dict.
      </p>

      <CodeBlock
        code={`scores = {"Alice": 92, "Bob": 45, "Carol": 85, "Dan": 38}

# Remove failing scores — iterate a snapshot of keys
for name in list(scores.keys()):
    if scores[name] < 50:
        del scores[name]

print(scores)   # {'Alice': 92, 'Carol': 85}

# Or build a new dict with a comprehension (cleaner)
passing = {name: s for name, s in scores.items() if s >= 50}
print(passing)  # {'Alice': 92, 'Carol': 85}`}
        output={`{'Alice': 92, 'Carol': 85}
{'Alice': 92, 'Carol': 85}`}
      />
    </section>
  );
}
