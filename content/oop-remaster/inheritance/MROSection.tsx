import { CodeBlock } from "@/components/blog/interactive/code-block";

export function MROSection() {
  return (
    <section>
      <h2
        id="mro"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        MRO: the order Python searches for methods
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        When you call a method on an object, Python searches through a list of classes to find it.
        That list is the Method Resolution Order (MRO). For simple single inheritance it is obvious:
        check the instance's class, then the parent, then the parent's parent, up to{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">object</code>
        .
      </p>

      <CodeBlock
        code={`class Animal:
    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):
        return "Woof"

class GuideDog(Dog):
    pass   # no speak() override

g = GuideDog("Rex", "Labrador", "Alice")
print(GuideDog.__mro__)`}
        output={`(<class '__main__.GuideDog'>, <class '__main__.Dog'>, <class '__main__.Animal'>, <class 'object'>)`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        When you call{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          g.speak()
        </code>
        , Python checks{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          GuideDog
        </code>{" "}
        first (no{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">speak</code>
        ), then{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Dog</code>{" "}
        (found it), and uses that. The{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Animal</code>{" "}
        version is never reached because{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Dog</code>{" "}
        already has it.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Multiple inheritance and the diamond problem
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Python allows a class to inherit from more than one parent. This creates ambiguity when both
        parents define the same method. The MRO resolves this unambiguously using an algorithm called
        C3 linearization.
      </p>

      <CodeBlock
        code={`class A:
    def hello(self):
        return "A"

class B(A):
    def hello(self):
        return "B"

class C(A):
    def hello(self):
        return "C"

class D(B, C):
    pass

d = D()
print(d.hello())       # B -- not A, not C
print(D.__mro__)`}
        output={`B
(<class '__main__.D'>, <class '__main__.B'>, <class '__main__.C'>, <class '__main__.A'>, <class 'object'>)`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        The MRO for{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">D</code> is{" "}
        D, B, C, A, object. When{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">hello()</code>{" "}
        is called, Python finds it in{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">B</code>{" "}
        first and stops there. The order of parent classes in the class definition (
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          D(B, C)
        </code>
        ) determines the search order.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        In practice, multiple inheritance is rarely needed and often a sign that composition would
        be a better fit. Use it sparingly, and when you do, keep the MRO in mind.
      </p>
    </section>
  );
}
