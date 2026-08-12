import { CodeBlock } from "@/components/blog/interactive/code-block";

export function OperatorOverloadingSection() {
  return (
    <section>
      <h2
        id="operator-overloading"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Operator overloading
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        When you write{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">a + b</code>
        , Python calls{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          a.__add__(b)
        </code>
        . When you write{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">a &lt; b</code>
        , Python calls{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          a.__lt__(b)
        </code>
        . You can define these methods on your own classes to make operators work naturally.
      </p>

      <CodeBlock
        code={`class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __sub__(self, other):
        return Vector(self.x - other.x, self.y - other.y)

    def __mul__(self, scalar):
        return Vector(self.x * scalar, self.y * scalar)

    def __abs__(self):
        return (self.x ** 2 + self.y ** 2) ** 0.5

v1 = Vector(1, 2)
v2 = Vector(3, 4)

print(v1 + v2)    # Vector(4, 6)
print(v2 - v1)    # Vector(2, 2)
print(v1 * 3)     # Vector(3, 6)
print(abs(v2))    # 5.0`}
        output={`Vector(4, 6)
Vector(2, 2)
Vector(3, 6)
5.0`}
      />

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Reflected operators
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        If you write{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">3 * v1</code>{" "}
        instead of{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">v1 * 3</code>
        , Python first tries{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          (3).__mul__(v1)
        </code>
        . That returns{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          NotImplemented
        </code>{" "}
        because integers do not know about vectors. Python then tries the reflected version:{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          v1.__rmul__(3)
        </code>
        .
      </p>

      <CodeBlock
        code={`class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

    def __mul__(self, scalar):
        return Vector(self.x * scalar, self.y * scalar)

    def __rmul__(self, scalar):   # 3 * v calls this
        return self.__mul__(scalar)

v = Vector(1, 2)
print(v * 3)   # Vector(3, 6)  -- uses __mul__
print(3 * v)   # Vector(3, 6)  -- uses __rmul__`}
        output={`Vector(3, 6)
Vector(3, 6)`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        Common operator methods: arithmetic (
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          __add__, __sub__, __mul__, __truediv__, __mod__, __pow__
        </code>
        ), comparison (
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          __lt__, __le__, __gt__, __ge__
        </code>
        ), and bitwise (
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          __and__, __or__, __xor__
        </code>
        ). Only implement the ones that make semantic sense for your class.
      </p>
    </section>
  );
}
