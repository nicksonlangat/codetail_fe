import { CodeBlock } from "@/components/blog/interactive/code-block";

export function IsARelationshipSection() {
  return (
    <section>
      <h2
        id="is-a-relationship"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Inheritance models IS-A relationships
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Before reaching for inheritance, ask one question: is this actually an IS-A relationship?
        A Dog IS-A Animal. A Car IS-A Vehicle. A SavingsAccount IS-A BankAccount. When you can say
        that cleanly, inheritance is probably the right tool.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The subclass inherits everything from the parent. Every method, every attribute. It can add
        new ones, and it can replace (override) ones that need different behavior.
      </p>

      <CodeBlock
        code={`class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        raise NotImplementedError("subclasses must implement speak()")

    def describe(self):
        return f"I am {self.name}"

class Dog(Animal):
    def speak(self):
        return f"{self.name} says: Woof!"

class Cat(Animal):
    def speak(self):
        return f"{self.name} says: Meow."

class Duck(Animal):
    def speak(self):
        return f"{self.name} says: Quack."

animals = [Dog("Rex"), Cat("Luna"), Duck("Donald")]
for animal in animals:
    print(animal.speak())
    print(animal.describe())   # inherited from Animal, works on all`}
        output={`Rex says: Woof!
I am Rex
Luna says: Meow.
I am Luna
Donald says: Quack.
I am Donald`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        Every animal shares the{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          describe()
        </code>{" "}
        method, which was written once on the parent class. Each has its own{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          speak()
        </code>{" "}
        that overrides the parent's placeholder. This is inheritance doing what it is supposed to
        do: share common code, allow specialization where needed.
      </p>
    </section>
  );
}
