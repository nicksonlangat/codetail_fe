import { CodeBlock } from "@/components/blog/interactive/code-block";

export function InitAndSelfSection() {
  return (
    <section>
      <h2
        id="init-and-self"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        __init__ and self
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        An empty class is not very useful. You need a way to give each instance its own data when
        it is created. That is what{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          __init__
        </code>{" "}
        is for.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        When you write{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          Dog("Rex", "Labrador")
        </code>
        , Python creates a new empty object and immediately calls{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          __init__
        </code>{" "}
        on it. That method receives the new object as its first argument, which by convention is
        always named{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">self</code>.
        You use{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">self</code>{" "}
        to attach data to that specific instance.
      </p>

      <CodeBlock
        code={`class Dog:
    def __init__(self, name, breed):
        self.name  = name    # attach 'name' to this specific Dog
        self.breed = breed   # attach 'breed' to this specific Dog

rex  = Dog("Rex", "Labrador")
luna = Dog("Luna", "Poodle")

print(rex.name)    # Rex
print(luna.name)   # Luna
print(rex.breed)   # Labrador
print(luna.breed)  # Poodle`}
        output={`Rex
Luna
Labrador
Poodle`}
      />

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        What self actually is
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        In many languages,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">this</code>{" "}
        (the equivalent of{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">self</code>)
        is hidden and automatic. Python makes it explicit. Every method on a class receives the
        instance as the first argument. Python passes it for you when you call the method on the
        instance.
      </p>

      <CodeBlock
        code={`class Dog:
    def __init__(self, name):
        self.name = name

    def bark(self):
        print(f"{self.name} says: Woof!")

rex = Dog("Rex")

# These two lines do exactly the same thing
rex.bark()          # Python passes rex as self automatically
Dog.bark(rex)       # you pass rex explicitly`}
        output={`Rex says: Woof!
Rex says: Woof!`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        When you write{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          rex.bark()
        </code>
        , Python translates it to{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          Dog.bark(rex)
        </code>{" "}
        behind the scenes. The{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">self</code>{" "}
        parameter is not special syntax. It is just the first parameter, and Python fills it in for
        you. You could name it anything, but nobody does, because{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">self</code>{" "}
        is the universal convention.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted">
          <strong>Rule:</strong> every method in a class (including{" "}
          <code className="font-mono text-[12px]">__init__</code>) must have{" "}
          <code className="font-mono text-[12px]">self</code> as its first parameter. Forgetting it
          is the single most common mistake beginners make.
        </p>
      </div>
    </section>
  );
}
