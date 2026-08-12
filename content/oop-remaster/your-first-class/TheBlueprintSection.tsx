import { CodeBlock } from "@/components/blog/interactive/code-block";

export function TheBlueprintSection() {
  return (
    <section>
      <h2
        id="the-blueprint"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        The class is a blueprint, not the thing itself
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Think of a cookie cutter and cookies. The cookie cutter is the blueprint. It defines the
        shape. You press it into dough and get a cookie. Then another. Then another. Every cookie
        came from the same cutter, so they all have the same shape, but each cookie is its own
        independent thing. You can put sprinkles on one without affecting the others.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A class is the cookie cutter. An instance is a cookie.
      </p>

      <CodeBlock
        code={`class Dog:
    pass   # an empty class for now

# Creating instances: call the class like a function
rex   = Dog()
luna  = Dog()
buddy = Dog()

# Three separate Dog objects
print(type(rex))          # <class '__main__.Dog'>
print(rex is luna)        # False, completely different objects
print(type(rex) is type(luna))  # True, same class`}
        output={`<class '__main__.Dog'>
False
True`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        You can create as many instances as you want. The class itself is defined once. Each
        instance gets its own independent data. Changing one does not touch the others.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The class name is capitalized by convention (
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Dog</code>,
        not{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">dog</code>).
        This is not a rule Python enforces, but every Python codebase follows it. When you see a
        capitalized name being called like a function, you are looking at a class being instantiated.
      </p>
    </section>
  );
}
