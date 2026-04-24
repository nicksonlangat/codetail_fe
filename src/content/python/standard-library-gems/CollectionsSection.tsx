import { CodeBlock } from "@/components/blog/interactive/code-block";

export function CollectionsSection() {
  return (
    <section>
      <h2 id="collections" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        collections
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">collections</code>{" "}
        module provides specialized container types that solve problems you would
        otherwise solve with boilerplate. Four of them come up constantly.
      </p>

      <h3 className="text-base font-semibold mt-6 mb-3">Counter</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">Counter</code>{" "}
        counts occurrences of elements in any iterable. It is a dict subclass, so
        missing keys return 0 instead of raising{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">KeyError</code>.
      </p>

      <CodeBlock
        code={`from collections import Counter

words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
counts = Counter(words)

print(counts)                # Counter({'apple': 3, 'banana': 2, 'cherry': 1})
print(counts["apple"])       # 3
print(counts["grape"])       # 0  — missing keys return 0
print(counts.most_common(2)) # [('apple', 3), ('banana', 2)]

# Arithmetic between counters
a = Counter(cats=3, dogs=1)
b = Counter(cats=1, dogs=4, fish=2)
print(a + b)   # Counter({'dogs': 5, 'cats': 4, 'fish': 2})
print(a - b)   # Counter({'cats': 2})  — negative counts are dropped`}
        output={`Counter({'apple': 3, 'banana': 2, 'cherry': 1})
3
0
[('apple', 3), ('banana', 2)]
Counter({'dogs': 5, 'cats': 4, 'fish': 2})
Counter({'cats': 2})`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">defaultdict</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">defaultdict</code>{" "}
        takes a factory function. When you access a missing key, it calls the factory,
        stores the result, and returns it. No more{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">if key not in d: d[key] = []</code>.
      </p>

      <CodeBlock
        code={`from collections import defaultdict

words = ["ant", "bear", "alligator", "bee", "crow", "cat"]

# Group by first letter
grouped = defaultdict(list)
for word in words:
    grouped[word[0]].append(word)

print(dict(grouped))
# {'a': ['ant', 'alligator'], 'b': ['bear', 'bee'], 'c': ['crow', 'cat']}

# Count occurrences
counts = defaultdict(int)
for word in words:
    counts[word[0]] += 1   # missing key starts at 0

print(dict(counts))   # {'a': 2, 'b': 2, 'c': 2}`}
        output={`{'a': ['ant', 'alligator'], 'b': ['bear', 'bee'], 'c': ['crow', 'cat']}
{'a': 2, 'b': 2, 'c': 2}`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">deque</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">deque</code>{" "}
        (double-ended queue) supports O(1) appends and pops from both ends. List
        operations on the left side are O(n) because every element shifts.
        Use{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">deque</code>{" "}
        for queues, breadth-first search, or sliding windows.
      </p>

      <CodeBlock
        code={`from collections import deque

q = deque([1, 2, 3])
q.append(4)       # add right  — O(1)
q.appendleft(0)   # add left   — O(1)  (list.insert(0, x) is O(n))
print(q)          # deque([0, 1, 2, 3, 4])

q.pop()           # remove right — O(1)
q.popleft()       # remove left  — O(1)
print(q)          # deque([1, 2, 3])

# Fixed-size window: old items are automatically discarded
recent = deque(maxlen=3)
for x in range(6):
    recent.append(x)
print(recent)     # deque([3, 4, 5], maxlen=3)`}
        output={`deque([0, 1, 2, 3, 4])
deque([1, 2, 3])
deque([3, 4, 5], maxlen=3)`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">namedtuple</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">namedtuple</code>{" "}
        creates a tuple subclass with named fields. It is as memory-efficient as
        a plain tuple but as readable as an object. Use it for lightweight,
        immutable data containers.
      </p>

      <CodeBlock
        code={`from collections import namedtuple

Point = namedtuple("Point", ["x", "y"])
p = Point(3, 4)

print(p.x, p.y)    # 3 4  — attribute access
print(p[0], p[1])  # 3 4  — index access still works
print(p)           # Point(x=3, y=4)

x, y = p           # unpacking works too

# As a return type — far clearer than returning a plain tuple
Color = namedtuple("Color", ["red", "green", "blue"])

def get_brand_color():
    return Color(31, 173, 135)

c = get_brand_color()
print(c.green)   # 173  — c[1] would be confusing`}
        output={`3 4
3 4
Point(x=3, y=4)
173`}
      />
    </section>
  );
}
