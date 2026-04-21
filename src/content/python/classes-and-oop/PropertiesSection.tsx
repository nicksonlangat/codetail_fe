import { CodeBlock } from "@/components/blog/interactive/code-block";

export function PropertiesSection() {
  return (
    <section>
      <h2 id="properties" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Properties
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">@property</code>{" "}
        turns a method into attribute-style access. Callers write{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">obj.radius</code>{" "}
        instead of{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">obj.radius()</code>,
        but you can add validation or computation behind it.
      </p>

      <CodeBlock
        code={`class Circle:
    def __init__(self, radius):
        self._radius = radius   # private by convention

    @property
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, value):
        if value < 0:
            raise ValueError("radius must be non-negative")
        self._radius = value

    @property
    def area(self):            # computed — no setter
        import math
        return math.pi * self._radius ** 2

c = Circle(5)
print(c.radius)   # 5   — looks like attribute access
print(c.area)     # 78.53...

c.radius = 10
print(c.area)     # 314.15...

c.radius = -1     # ValueError: radius must be non-negative`}
        output={`5
78.53981633974483
314.1592653589793
Traceback (most recent call last):
  ...
ValueError: radius must be non-negative`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Two-way conversion</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A property with both getter and setter lets callers set via either
        representation — useful for unit conversion.
      </p>

      <CodeBlock
        code={`class Temperature:
    def __init__(self, celsius=0.0):
        self.celsius = celsius    # plain attribute is fine to start

    @property
    def fahrenheit(self):
        return self.celsius * 9 / 5 + 32

    @fahrenheit.setter
    def fahrenheit(self, value):
        self.celsius = (value - 32) * 5 / 9

t = Temperature(100)
print(t.fahrenheit)   # 212.0

t.fahrenheit = 32
print(t.celsius)      # 0.0`}
        output={`212.0
0.0`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mt-2">
        <p className="text-[13px] text-foreground/70">
          Start with a plain attribute. Only add{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">@property</code>{" "}
          when you need to enforce a constraint or derive a value. Do not use
          properties just to follow a Java-style getter/setter pattern.
        </p>
      </div>
    </section>
  );
}
