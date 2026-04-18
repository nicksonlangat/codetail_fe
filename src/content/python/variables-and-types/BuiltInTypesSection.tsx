import { CodeBlock } from "@/components/blog/interactive/code-block";
import { Term } from "@/components/blog/interactive/term";

export function BuiltInTypesSection() {
  return (
    <section>
      <h2 id="built-in-types" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        The five fundamental types
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Python has five types you&apos;ll use in nearly every program. Everything else is built
        on top of them.
      </p>

      {/* int */}
      <h3 className="text-base font-semibold mt-8 mb-3">
        <code className="font-mono text-primary">int</code>: whole numbers
      </h3>
      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Python integers are exact and have no size limit. Unlike most languages, you
        can&apos;t overflow an int in Python. It grows to fit whatever you need.
      </p>
      <CodeBlock
        code={`age = 30
count = -7
big = 1_000_000_000   # underscores for readability, same as 1000000000

# No overflow: Python handles arbitrarily large integers
factorial_20 = 2432902008176640000
print(factorial_20 * 100)`}
        output={`243290200817664000000`}
      />

      {/* float */}
      <h3 className="text-base font-semibold mt-8 mb-3">
        <code className="font-mono text-primary">float</code>: decimal numbers
      </h3>
      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Floats represent numbers with decimal points using IEEE 754 double precision. They&apos;re
        fast and cover an enormous range, but they can&apos;t represent every decimal exactly.
      </p>
      <CodeBlock
        code={`price = 9.99
ratio = 0.5
scientific = 1.5e10   # 15000000000.0

# The classic float gotcha
print(0.1 + 0.2)           # not 0.3
print(0.1 + 0.2 == 0.3)    # False!`}
        output={`0.30000000000000004
False`}
      />
      <div className="border-l-2 border-warning bg-warning/5 pl-4 py-3 rounded-r-lg mt-3 mb-4">
        <p className="text-[13px] text-foreground/70">
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">0.1 + 0.2 != 0.3</code>{" "}
          because floats are stored in binary. 0.1 in binary is a repeating fraction, like 1/3
          in decimal. The full story is in the Numbers article. For money, use{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">decimal.Decimal</code>.
        </p>
      </div>

      {/* str */}
      <h3 className="text-base font-semibold mt-8 mb-3">
        <code className="font-mono text-primary">str</code>: text
      </h3>
      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        An <Term term="immutable">immutable</Term> <Term term="sequence">sequence</Term> of{" "}
        <Term term="unicode">Unicode</Term> characters. Covered in depth in the Strings article.
      </p>
      <CodeBlock
        code={`name    = "Alice"
message = 'Hello, world!'
multi   = """Line one
Line two"""

print(type(name))   # <class 'str'>`}
        output={`<class 'str'>`}
      />

      {/* bool */}
      <h3 className="text-base font-semibold mt-8 mb-3">
        <code className="font-mono text-primary">bool</code>: true or false
      </h3>
      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Booleans represent truth values. There are exactly two:{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">True</code> and{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">False</code>.
        The capitalization matters: lowercase versions are just undefined names.
      </p>
      <CodeBlock
        code={`is_active = True
has_error = False

# Surprising: bool is a subclass of int
print(True + True)    # 2
print(True * 5)       # 5
print(int(True))      # 1
print(int(False))     # 0`}
        output={`2
5
1
0`}
      />
      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mt-3 mb-4">
        <p className="text-[13px] text-foreground/70 italic">
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">True</code> and{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">False</code> are
          literally just <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">1</code> and{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">0</code> with extra
          behavior. This is occasionally useful for counting: summing a list of booleans gives
          you the count of True values.
        </p>
      </div>

      {/* None */}
      <h3 className="text-base font-semibold mt-8 mb-3">
        <code className="font-mono text-primary">None</code>: the absence of a value
      </h3>
      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">None</code> is
        Python&apos;s way of saying "no value here." It&apos;s not zero, not an empty string,
        not False. It&apos;s the explicit absence of a value. There is exactly one{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">None</code> object
        in all of Python.
      </p>
      <CodeBlock
        code={`result = None       # no value yet

# Functions that don't return a value implicitly return None
def say_hello():
    print("Hello")

x = say_hello()
print(x)            # None
print(x is None)    # True - use "is", not "=="

# Common pattern: optional parameter
def connect(host, port=None):
    if port is None:
        port = 443`}
        output={`Hello
None
True`}
      />
    </section>
  );
}
