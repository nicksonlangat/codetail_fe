import { CodeBlock } from "@/components/blog/interactive/code-block";

export function WhatPolymorphismSection() {
  return (
    <section>
      <h2
        id="what-polymorphism"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Same call, different behavior
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Polymorphism sounds academic. The idea is not. You are using it every time you call{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">len()</code>{" "}
        on different things:
      </p>

      <CodeBlock
        code={`print(len("hello"))        # 5  -- counts characters
print(len([1, 2, 3]))      # 3  -- counts elements
print(len({"a": 1}))       # 1  -- counts keys`}
        output={`5
3
1`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        The same function call (
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">len(x)</code>
        ) does something different depending on what{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">x</code> is.
        You do not write{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          string_len()
        </code>{" "}
        and{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          list_len()
        </code>{" "}
        separately. One name, behavior determined by the object.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The word comes from Greek: poly (many) morphism (forms). The same interface, many
        implementations. The caller does not need to know or care which implementation is running.
      </p>

      <CodeBlock
        code={`class Dog:
    def speak(self):
        return "Woof!"

class Cat:
    def speak(self):
        return "Meow."

class Duck:
    def speak(self):
        return "Quack."

# This function works with any object that has .speak()
def make_noise(animal):
    print(animal.speak())

make_noise(Dog())    # Woof!
make_noise(Cat())    # Meow.
make_noise(Duck())   # Quack.`}
        output={`Woof!
Meow.
Quack.`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          make_noise()
        </code>{" "}
        never asks what type it received. It just calls{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          speak()
        </code>
        . The right thing happens because each class knows what{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          speak()
        </code>{" "}
        means for it. That is polymorphism.
      </p>
    </section>
  );
}
