import { CodeBlock } from "@/components/blog/interactive/code-block";

export function EqualityAndHashingSection() {
  return (
    <section>
      <h2
        id="equality-and-hashing"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        __eq__ and __hash__: the pair you must keep together
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        By default,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">==</code>{" "}
        checks identity: are these the same object in memory? Two separate objects with identical
        data are not equal:
      </p>

      <CodeBlock
        code={`class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

a = Point(3, 4)
b = Point(3, 4)

print(a == b)   # False! Same data, different objects
print(a is b)   # False, obviously different objects`}
        output={`False
False`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        Implement{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          __eq__
        </code>{" "}
        to define what equality means for your class:
      </p>

      <CodeBlock
        code={`class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return self.x == other.x and self.y == other.y

a = Point(3, 4)
b = Point(3, 4)
c = Point(1, 2)

print(a == b)   # True
print(a == c)   # False
print(a == "not a point")  # False, not NotImplemented raised`}
        output={`True
False
False`}
      />

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        The gotcha: defining __eq__ silently breaks __hash__
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        When you define{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          __eq__
        </code>
        , Python automatically sets{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          __hash__
        </code>{" "}
        to{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">None</code>.
        This makes your object unhashable. You cannot use it in a set or as a dict key.
      </p>

      <CodeBlock
        code={`# With only __eq__ defined:
a = Point(3, 4)
s = {a}   # TypeError`}
        output={`TypeError: unhashable type: 'Point'`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        Always define{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          __hash__
        </code>{" "}
        alongside{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          __eq__
        </code>
        . The rule: objects that compare equal must have the same hash.
      </p>

      <CodeBlock
        code={`class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return self.x == other.x and self.y == other.y

    def __hash__(self):
        return hash((self.x, self.y))   # tuple hash is stable and correct

a = Point(3, 4)
b = Point(3, 4)

print(a == b)              # True
print(hash(a) == hash(b))  # True
print({a, b})              # {Point(3, 4)} -- deduplicated in a set`}
        output={`True
True
{Point(3, 4)}`}
      />
    </section>
  );
}
