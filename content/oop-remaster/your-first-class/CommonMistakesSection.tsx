import { CodeBlock } from "@/components/blog/interactive/code-block";

export function CommonMistakesSection() {
  return (
    <section>
      <h2
        id="common-mistakes"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        The four mistakes everyone makes at first
      </h2>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        1. Forgetting self in the method signature
      </h3>

      <CodeBlock
        code={`class Dog:
    def __init__(self, name):
        self.name = name

    def bark():   # missing self
        print("Woof!")

rex = Dog("Rex")
rex.bark()   # TypeError: bark() takes 0 positional arguments but 1 was given`}
        output={`TypeError: Dog.bark() takes 0 positional arguments but 1 was given`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-4 mb-4">
        Python passes the instance automatically, so the method needs a parameter to receive it.
        Every method needs{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">self</code>{" "}
        as the first parameter. No exceptions.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        2. Accessing an attribute that does not exist yet
      </h3>

      <CodeBlock
        code={`class Dog:
    def __init__(self, name):
        self.name = name

    def get_owner(self):
        return self.owner   # never set in __init__

rex = Dog("Rex")
print(rex.get_owner())   # AttributeError`}
        output={`AttributeError: 'Dog' object has no attribute 'owner'`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-4 mb-4">
        Python does not pre-declare attributes. If you try to read{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          self.owner
        </code>{" "}
        before setting it somewhere,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          AttributeError
        </code>{" "}
        is what you get. Set all attributes your object will ever use inside{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          __init__
        </code>
        , even if the initial value is{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">None</code>.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        3. Calling a method without parentheses
      </h3>

      <CodeBlock
        code={`class Dog:
    def __init__(self, name):
        self.name = name

    def bark(self):
        print("Woof!")

rex = Dog("Rex")
rex.bark    # no parens: this is the method object, not the call
rex.bark()  # this actually calls it`}
        output={`<bound method Dog.bark of <__main__.Dog object at 0x...>>
Woof!`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-4 mb-4">
        Without parentheses you get a reference to the method, not its result. This often surfaces
        as a bug where a conditional like{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          if rex.bark
        </code>{" "}
        always evaluates to{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">True</code>{" "}
        because method objects are truthy, regardless of what the method would return if called.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        4. Returning self when the method should return nothing
      </h3>

      <CodeBlock
        code={`class Counter:
    def __init__(self):
        self.count = 0

    def increment(self):
        self.count += 1
        return self.count   # probably not what you want

c = Counter()
result = c.increment()
print(result)    # 1 -- you got the count back, but why?
print(c.count)   # 1 -- and the object still has the updated value`}
        output={`1
1`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-4 mb-4">
        Methods that modify the object's state usually return{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">None</code>{" "}
        (no return statement). The caller reads the updated state by accessing the attribute
        afterward. Returning state values from mutating methods is not wrong, but it muddles the
        intention and can encourage callers to ignore the object and just work with the return value.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The exception is the builder pattern, where methods return{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">self</code>{" "}
        so you can chain calls. But that is a deliberate design choice, not an accident.
      </p>
    </section>
  );
}
