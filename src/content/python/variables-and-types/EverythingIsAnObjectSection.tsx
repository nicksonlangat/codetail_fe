import { CodeBlock } from "@/components/blog/interactive/code-block";
import { Term } from "@/components/blog/interactive/term";

export function EverythingIsAnObjectSection() {
  return (
    <section>
      <h2 id="everything-is-an-object" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Everything is an object
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        In Python, every value is an object: numbers, strings, functions, classes, modules.
        This isn&apos;t just philosophy: it means every value in Python has three
        things attached to it.
      </p>

      <div className="grid gap-3 sm:grid-cols-3 mb-8">
        {[
          {
            label: "Identity",
            fn: "id(x)",
            desc: "A unique integer identifying this object. Think of it as its memory address. Guaranteed unique for the lifetime of the object.",
          },
          {
            label: "Type",
            fn: "type(x)",
            desc: "What kind of object it is. The type determines which operations are valid and what the data means.",
          },
          {
            label: "Value",
            fn: "x",
            desc: "The actual data. For an integer it's the number. For a string it's the characters. For a list it's the elements.",
          },
        ].map(({ label, fn, desc }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground/50 mb-1">
              {label}
            </p>
            <code className="font-mono text-[13px] text-primary font-semibold block mb-2">{fn}</code>
            <p className="text-[12px] text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <CodeBlock
        code={`x = 42

print(id(x))      # memory address, e.g. 9788576
print(type(x))    # <class 'int'>
print(x)          # 42

# Works for every object, even functions
def greet(): pass

print(type(greet))   # <class 'function'>
print(id(greet))     # functions have identities too`}
        output={`9788576
<class 'int'>
42
<class 'function'>
140234567890`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Identity vs equality</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Python gives you two ways to compare things. They test different questions.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <code className="font-mono text-[13px] text-primary font-semibold block mb-2">a == b</code>
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            Do they have the same <strong>value</strong>? Two separate lists with the same
            contents are equal.
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <code className="font-mono text-[13px] text-primary font-semibold block mb-2">a is b</code>
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            Are they the <strong>same object</strong>? Same identity (id). Like asking whether
            two people have the same name vs are literally the same person.
          </p>
        </div>
      </div>

      <CodeBlock
        code={`a = [1, 2, 3]
b = [1, 2, 3]   # same values, different object
c = a           # same object

print(a == b)   # True  - same value
print(a is b)   # False - different objects

print(a == c)   # True  - same value
print(a is c)   # True  - same object`}
        output={`True
False
True
True`}
      />

      <div className="border-l-2 border-warning bg-warning/5 pl-4 py-3 rounded-r-lg mt-6">
        <p className="text-[13px] text-foreground/70">
          <strong>Rule:</strong> use <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">==</code> to
          compare values. Use{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">is</code> only when
          you specifically mean "same object", most commonly{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">x is None</code>.
          Using <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">is</code> to
          compare integers or strings can silently give wrong answers due to{" "}
          <Term term="string interning">interning</Term>.
        </p>
      </div>
    </section>
  );
}
