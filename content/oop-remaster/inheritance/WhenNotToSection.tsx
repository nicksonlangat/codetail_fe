import { CodeBlock } from "@/components/blog/interactive/code-block";

export function WhenNotToSection() {
  return (
    <section>
      <h2
        id="when-not-to"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        When not to use inheritance
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        There is a principle called the Liskov Substitution Principle. In plain English: if{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Dog</code>{" "}
        IS-A{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Animal</code>
        , then anywhere you use an{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Animal</code>
        , a{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Dog</code>{" "}
        should work without anything breaking. If that is not true, the inheritance is wrong.
      </p>

      <CodeBlock
        code={`class Rectangle:
    def __init__(self, width, height):
        self.width  = width
        self.height = height

    def area(self):
        return self.width * self.height

class Square(Rectangle):
    def __init__(self, side):
        super().__init__(side, side)

    # Problem: if someone sets width on a Square, height stays the same
    # A square is no longer a square.

s = Square(5)
s.width = 10   # now s.height is still 5
print(s.area())  # 50 -- but a 10x5 thing is not a square`}
        output={`50`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        A square IS-A rectangle mathematically, but in code, making{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Square</code>{" "}
        inherit from{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Rectangle</code>{" "}
        creates a footgun. Code that works with rectangles might adjust width and height
        independently, which breaks the square constraint.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Inherit for IS-A, compose for HAS-A
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Another common mistake is inheriting just to reuse code:
      </p>

      <CodeBlock
        code={`# Inheriting for code reuse, not IS-A
class Logger:
    def log(self, msg):
        print(f"[LOG] {msg}")

class UserService(Logger):   # UserService IS-A Logger? No.
    def create_user(self, name):
        self.log(f"Creating user: {name}")
        # ... actual user creation

# Better: HAS-A Logger
class UserService:
    def __init__(self):
        self._logger = Logger()

    def create_user(self, name):
        self._logger.log(f"Creating user: {name}")
        # ... actual user creation`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        A{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          UserService
        </code>{" "}
        is not a kind of{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Logger</code>
        . It uses a logger. When the relationship is HAS-A, the right pattern is to hold the
        dependency as an attribute, not to inherit from it. This is composition, covered in the last
        article of this series.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted">
          When in doubt, ask the IS-A question. If you cannot say "X is a kind of Y" naturally,
          do not use inheritance.
        </p>
      </div>
    </section>
  );
}
