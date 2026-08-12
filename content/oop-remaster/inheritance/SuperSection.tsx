import { CodeBlock } from "@/components/blog/interactive/code-block";

export function SuperSection() {
  return (
    <section>
      <h2
        id="super"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        super(): calling the parent without hardcoding it
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        When you override a method in a subclass, you often still want the parent's version to run.
        The naive approach is to hardcode the parent class name:
      </p>

      <CodeBlock
        code={`class Animal:
    def __init__(self, name):
        self.name = name

class Dog(Animal):
    def __init__(self, name, breed):
        Animal.__init__(self, name)   # works, but brittle
        self.breed = breed`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        This breaks the moment you restructure the hierarchy. If{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Dog</code>{" "}
        stops inheriting from{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Animal</code>{" "}
        directly, every hardcoded reference breaks. Use{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          super()
        </code>{" "}
        instead:
      </p>

      <CodeBlock
        code={`class Animal:
    def __init__(self, name):
        self.name = name
        print(f"Animal.__init__ called for {name}")

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)   # calls Animal.__init__, passes self automatically
        self.breed = breed
        print(f"Dog.__init__ added breed={breed}")

class GuideDog(Dog):
    def __init__(self, name, breed, handler):
        super().__init__(name, breed)   # calls Dog.__init__
        self.handler = handler
        print(f"GuideDog.__init__ added handler={handler}")

g = GuideDog("Rex", "Labrador", "Alice")`}
        output={`Animal.__init__ called for Rex
Dog.__init__ added breed=Labrador
GuideDog.__init__ added handler=Alice`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        Each class calls{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          super().__init__()
        </code>{" "}
        and the chain runs upward. You never hardcode a class name. If you restructure the
        hierarchy, the calls still work correctly.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted">
          <strong>Rule:</strong> whenever you override{" "}
          <code className="font-mono text-[12px]">__init__</code>, call{" "}
          <code className="font-mono text-[12px]">super().__init__()</code> first, before doing any
          of your own setup. This ensures the parent's state is initialized before you build on top
          of it.
        </p>
      </div>
    </section>
  );
}
