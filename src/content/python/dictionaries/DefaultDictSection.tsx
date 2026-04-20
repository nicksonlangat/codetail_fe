import { CodeBlock } from "@/components/blog/interactive/code-block";
import { InteractiveCounter } from "@/components/blog/interactive/interactive-counter";

export function DefaultDictSection() {
  return (
    <section>
      <h2 id="defaultdict" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        defaultdict and Counter
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">collections</code>{" "}
        module ships two dict subclasses that handle the most common dict patterns
        with less boilerplate.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">defaultdict</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">defaultdict</code>{" "}
        never raises a{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">KeyError</code>.
        When you access a missing key, it calls a factory function to create the default
        value and inserts it automatically. The factory is any callable:{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">list</code>,{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">int</code>,{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">set</code>, or a lambda.
      </p>

      <CodeBlock
        code={`from collections import defaultdict

# Group items by category
items = [("fruit", "apple"), ("veg", "carrot"), ("fruit", "banana")]

# Without defaultdict — requires setdefault or an if-check
groups = {}
for cat, item in items:
    groups.setdefault(cat, []).append(item)

# With defaultdict — cleaner
groups = defaultdict(list)
for cat, item in items:
    groups[cat].append(item)   # no KeyError, list created automatically

print(dict(groups))
# {'fruit': ['apple', 'banana'], 'veg': ['carrot']}

# defaultdict(int) for counting
text = "hello world"
freq = defaultdict(int)
for char in text:
    freq[char] += 1   # starts at 0 automatically

print(dict(freq))`}
        output={`{'fruit': ['apple', 'banana'], 'veg': ['carrot']}
{'h': 1, 'e': 1, 'l': 3, 'o': 2, ' ': 1, 'w': 1, 'r': 1, 'd': 1}`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Counter</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">Counter</code>{" "}
        is a dict subclass built for counting. Pass it any iterable and it tallies
        the occurrences of each element. The{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">.most_common(n)</code>{" "}
        method returns the top n items sorted by frequency.
      </p>

      <CodeBlock
        code={`from collections import Counter

words = "the cat sat on the mat the cat".split()
c     = Counter(words)

print(c)
# Counter({'the': 3, 'cat': 2, 'sat': 1, 'on': 1, 'mat': 1})

print(c.most_common(2))
# [('the', 3), ('cat', 2)]

print(c["cat"])    # 2
print(c["dog"])    # 0  — missing keys return 0, no KeyError

# Counters support arithmetic
a = Counter("aab")
b = Counter("abc")
print(a + b)       # Counter({'a': 3, 'b': 2, 'c': 1})
print(a - b)       # Counter({'a': 1})  — removes non-positive counts`}
        output={`Counter({'the': 3, 'cat': 2, 'sat': 1, 'on': 1, 'mat': 1})
[('the', 3), ('cat', 2)]
2
0
Counter({'a': 3, 'b': 2, 'c': 1})
Counter({'a': 1})`}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-6 mb-4">
        See Counter in action below. Pick a text and toggle between word and character
        frequency.
      </p>

      <InteractiveCounter />
    </section>
  );
}
