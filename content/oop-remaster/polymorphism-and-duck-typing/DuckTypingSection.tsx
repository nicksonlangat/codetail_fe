import { CodeBlock } from "@/components/blog/interactive/code-block";

export function DuckTypingSection() {
  return (
    <section>
      <h2
        id="duck-typing"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Duck typing: Python's approach
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        In Java, for polymorphism to work, your classes must share a common parent or implement a
        declared interface. Python does not require that. It asks a simpler question: does this
        object have the method I want to call?
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The name comes from a saying: "If it walks like a duck and quacks like a duck, treat it as
        a duck." Python does not care what class an object belongs to. It cares whether the object
        can do the thing you are asking it to do.
      </p>

      <CodeBlock
        code={`class Dog:
    def speak(self):
        return "Woof!"

class Robot:
    def speak(self):
        return "Bzzzt... hello, human."

class TrafficLight:
    def speak(self):
        return "Please stop."

def make_noise(thing):
    print(thing.speak())

# None of these share a parent class or interface
# Python only cares that they all have .speak()
make_noise(Dog())
make_noise(Robot())
make_noise(TrafficLight())`}
        output={`Woof!
Bzzzt... hello, human.
Please stop.`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        A{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Dog</code>,
        a{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Robot</code>,
        and a{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          TrafficLight
        </code>{" "}
        have nothing in common except a{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          speak()
        </code>{" "}
        method. That is all{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          make_noise()
        </code>{" "}
        needs.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        If the object does not have the method, you get an{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          AttributeError
        </code>{" "}
        at the point of the call. Python does not check ahead of time. This is the trade-off: you
        get flexibility, you lose early detection. Abstract base classes (covered next) can give you
        earlier errors when you need them.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted">
          Duck typing is why Python code is often more flexible than equivalent Java or C++ code.
          You can write a function that accepts any object that satisfies an informal interface,
          without declaring anything upfront.
        </p>
      </div>
    </section>
  );
}
