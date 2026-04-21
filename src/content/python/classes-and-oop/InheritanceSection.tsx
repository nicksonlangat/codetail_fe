import { CodeBlock } from "@/components/blog/interactive/code-block";
import { InteractiveInheritance } from "@/components/blog/interactive/interactive-inheritance";

export function InheritanceSection() {
  return (
    <section>
      <h2 id="inheritance" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Inheritance
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A subclass inherits all methods from its parent. Override only the ones
        that need to change. Use{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">super()</code>{" "}
        to call the parent implementation rather than duplicating it.
      </p>

      <CodeBlock
        code={`class Animal:
    def __init__(self, name, sound):
        self.name  = name
        self.sound = sound

    def speak(self):
        return f"{self.name} says {self.sound}"

    def __repr__(self):
        return f"{type(self).__name__}({self.name!r})"

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name, sound="Woof")   # delegate to Animal
        self.breed = breed

    def fetch(self):
        return f"{self.name} fetches!"

class Cat(Animal):
    def __init__(self, name, indoor=True):
        super().__init__(name, sound="Meow")
        self.indoor = indoor

    def speak(self):                            # override
        return f"{self.name} says Meow... or maybe not."

d = Dog("Rex", "Labrador")
c = Cat("Luna")
print(d.speak())    # Rex says Woof
print(c.speak())    # Luna says Meow... or maybe not.
print(d.fetch())    # Rex fetches!
print(d)            # Dog('Rex')`}
        output={`Rex says Woof
Luna says Meow... or maybe not.
Rex fetches!
Dog('Rex')`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">isinstance and issubclass</h3>

      <CodeBlock
        code={`d = Dog("Rex", "Labrador")

print(isinstance(d, Dog))     # True
print(isinstance(d, Animal))  # True — Dog is a subclass of Animal
print(isinstance(d, Cat))     # False

print(issubclass(Dog, Animal))  # True
print(issubclass(Cat, Dog))     # False`}
        output={`True
True
False
True
False`}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-6 mb-4">
        Explore the hierarchy and method resolution order:
      </p>

      <InteractiveInheritance />
    </section>
  );
}
