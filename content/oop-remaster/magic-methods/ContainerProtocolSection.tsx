import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ContainerProtocolSection() {
  return (
    <section>
      <h2
        id="container-protocol"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        The container protocol
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        When you write{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">len(x)</code>
        , Python calls{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          x.__len__()
        </code>
        . When you write{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">x[key]</code>
        , Python calls{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          x.__getitem__(key)
        </code>
        . When you write{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          for item in x
        </code>
        , Python calls{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          x.__iter__()
        </code>
        . Implement these and your object behaves like a built-in container.
      </p>

      <CodeBlock
        code={`class Stack:
    def __init__(self):
        self._items = []

    def push(self, item):
        self._items.append(item)

    def pop(self):
        return self._items.pop()

    def __len__(self):
        return len(self._items)

    def __getitem__(self, index):
        return self._items[index]

    def __iter__(self):
        return iter(self._items)

    def __contains__(self, item):   # 'in' operator
        return item in self._items

    def __repr__(self):
        return f"Stack({self._items})"

s = Stack()
s.push(10)
s.push(20)
s.push(30)

print(len(s))       # 3
print(s[0])         # 10
print(s[-1])        # 30

for item in s:
    print(item)     # 10, 20, 30

print(20 in s)      # True
print(99 in s)      # False`}
        output={`3
10
30
10
20
30
True
False`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        Once your class implements{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          __iter__
        </code>
        , you also get list comprehensions and unpacking for free:
      </p>

      <CodeBlock
        code={`s = Stack()
s.push(1)
s.push(2)
s.push(3)

doubled = [x * 2 for x in s]
print(doubled)       # [2, 4, 6]

a, b, c = s          # unpacking works
print(a, b, c)       # 1 2 3`}
        output={`[2, 4, 6]
1 2 3`}
      />
    </section>
  );
}
