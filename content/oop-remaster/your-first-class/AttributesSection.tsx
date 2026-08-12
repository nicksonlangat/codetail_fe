import { CodeBlock } from "@/components/blog/interactive/code-block";

export function AttributesSection() {
  return (
    <section>
      <h2
        id="attributes"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Instance attributes vs class attributes
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Attributes set on{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">self</code>{" "}
        inside{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          __init__
        </code>{" "}
        are called <strong>instance attributes</strong>. Every instance gets its own copy, separate
        from every other instance.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Attributes defined directly on the class body (not inside any method) are{" "}
        <strong>class attributes</strong>. They are shared across all instances.
      </p>

      <CodeBlock
        code={`class Dog:
    species = "Canis lupus familiaris"   # class attribute, shared by all

    def __init__(self, name):
        self.name = name   # instance attribute, unique per dog

rex  = Dog("Rex")
luna = Dog("Luna")

# Instance attributes are independent
print(rex.name)    # Rex
print(luna.name)   # Luna

# Class attribute is the same for all
print(rex.species)   # Canis lupus familiaris
print(luna.species)  # Canis lupus familiaris
print(Dog.species)   # Canis lupus familiaris  (access directly on class)`}
        output={`Rex
Luna
Canis lupus familiaris
Canis lupus familiaris
Canis lupus familiaris`}
      />

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Gotcha: mutable class attributes
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Class attributes that are mutable objects (lists, dicts) are a trap. Because they are
        shared, modifying one instance's view of the attribute changes it for everyone.
      </p>

      <CodeBlock
        code={`class Kennel:
    dogs = []   # shared list, BAD idea

    def add(self, dog):
        self.dogs.append(dog)

k1 = Kennel()
k2 = Kennel()

k1.add("Rex")
print(k1.dogs)   # ['Rex']
print(k2.dogs)   # ['Rex']  -- k2 sees it too! Same list object.`}
        output={`['Rex']
['Rex']`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        The fix: initialize mutable attributes inside{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          __init__
        </code>
        , not on the class body.
      </p>

      <CodeBlock
        code={`class Kennel:
    def __init__(self):
        self.dogs = []   # each instance gets its own list

    def add(self, dog):
        self.dogs.append(dog)

k1 = Kennel()
k2 = Kennel()

k1.add("Rex")
print(k1.dogs)   # ['Rex']
print(k2.dogs)   # []  -- k2 is untouched`}
        output={`['Rex']
[]`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        Use class attributes for constants shared by all instances (like{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          species
        </code>{" "}
        above, or a tax rate, or a default timeout). Use instance attributes for anything that
        varies per object or could be mutated.
      </p>
    </section>
  );
}
