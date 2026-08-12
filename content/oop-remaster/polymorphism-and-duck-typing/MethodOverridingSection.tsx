import { CodeBlock } from "@/components/blog/interactive/code-block";

export function MethodOverridingSection() {
  return (
    <section>
      <h2
        id="method-overriding"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Method overriding
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        When a subclass defines a method that already exists on the parent, the subclass version
        replaces the parent's version for instances of that subclass. This is method overriding.
      </p>

      <CodeBlock
        code={`class Shape:
    def area(self):
        return 0

    def describe(self):
        return f"I am a {type(self).__name__} with area {self.area():.2f}"

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):             # overrides Shape.area
        import math
        return math.pi * self.radius ** 2

class Rectangle(Shape):
    def __init__(self, w, h):
        self.w, self.h = w, h

    def area(self):             # overrides Shape.area
        return self.w * self.h

shapes = [Circle(5), Rectangle(3, 4)]
for s in shapes:
    print(s.describe())  # describe() is inherited, area() is overridden`}
        output={`I am a Circle with area 78.54
I am a Rectangle with area 12.00`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        Notice{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          describe()
        </code>{" "}
        is defined once on{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Shape</code>{" "}
        and calls{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          self.area()
        </code>
        . When called on a{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Circle</code>
        ,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          self.area()
        </code>{" "}
        dispatches to{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          Circle.area()
        </code>
        , not{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          Shape.area()
        </code>
        . The parent's method benefits from the child's override. This is called dynamic dispatch,
        and it is how polymorphism works in practice.
      </p>
    </section>
  );
}
