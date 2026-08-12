import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ReprAndStrSection() {
  return (
    <section>
      <h2
        id="repr-and-str"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        __repr__ and __str__
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Without a{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          __repr__
        </code>
        , printing your object gives you something useless:
      </p>

      <CodeBlock
        code={`class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

p = Point(3, 4)
print(p)    # <__main__.Point object at 0x0000...>`}
        output={`<__main__.Point object at 0x7f2b4c1d3a90>`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        That tells you nothing useful.{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          __repr__
        </code>{" "}
        is the method Python calls when it needs to represent an object as a string for developers:
        in the REPL, in debuggers, in log output, and when you call{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">repr()</code>
        .{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">__str__</code>{" "}
        is the human-readable version, used by{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">print()</code>{" "}
        and{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">str()</code>.
      </p>

      <CodeBlock
        code={`class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

    def __str__(self):
        return f"({self.x}, {self.y})"

p = Point(3, 4)

print(repr(p))   # Point(3, 4)  -- developer view
print(str(p))    # (3, 4)       -- user view
print(p)         # (3, 4)       -- print() uses __str__

points = [Point(1, 2), Point(3, 4)]
print(points)    # [Point(1, 2), Point(3, 4)]  -- list uses __repr__`}
        output={`Point(3, 4)
(3, 4)
(3, 4)
[Point(1, 2), Point(3, 4)]`}
      />

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6 mt-6">
        <p className="text-[13px] text-brand-text-muted">
          <strong>Rule:</strong> always implement{" "}
          <code className="font-mono text-[12px]">__repr__</code>. If you only need one, it is this
          one. When{" "}
          <code className="font-mono text-[12px]">__str__</code> is not defined, Python falls back to{" "}
          <code className="font-mono text-[12px]">__repr__</code>. The reverse is not true.
        </p>
      </div>
    </section>
  );
}
