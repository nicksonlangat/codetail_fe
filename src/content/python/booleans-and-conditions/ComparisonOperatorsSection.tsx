import { CodeBlock } from "@/components/blog/interactive/code-block";
import { Term } from "@/components/blog/interactive/term";

export function ComparisonOperatorsSection() {
  return (
    <section>
      <h2 id="comparison-operators" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Comparison operators
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Comparisons evaluate to{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">True</code> or{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">False</code>.
        Python has eight comparison operators, and a few behave in ways worth calling out.
      </p>

      <CodeBlock
        code={`x = 5

print(x == 5)    # True  - equal in value
print(x != 3)    # True  - not equal
print(x > 3)     # True  - greater than
print(x < 3)     # False - less than
print(x >= 5)    # True  - greater than or equal
print(x <= 4)    # False - less than or equal`}
        output={`True
True
True
False
True
False`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Chained comparisons</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Python lets you chain comparisons the way you write them in math. This is unique
        among mainstream languages and makes range checks read naturally.
      </p>

      <CodeBlock
        code={`x = 5

# Other languages need: x > 0 and x < 10
# Python lets you write it directly:
print(0 < x < 10)      # True
print(1 <= x <= 5)     # True
print(0 < x < 3)       # False

# Chains can be longer than two
print(1 < 2 < 3 < 4)   # True - all links must hold
print(1 < 2 < 2 < 4)   # False - 2 < 2 fails`}
        output={`True
True
False
True
False`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-foreground/70 italic">
          Python evaluates each link once and short-circuits on the first false comparison.
          In <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">0 &lt; x &lt; 10</code>,
          if <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">0 &lt; x</code> is
          False, Python doesn&apos;t evaluate{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">x &lt; 10</code> at all.
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">
        <code className="font-mono text-primary">is</code> and{" "}
        <code className="font-mono text-primary">is not</code>: identity, not equality
      </h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">is</code> checks
        whether two names point to the same object in memory, not whether they have the same
        value. Use it only for{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">None</code>,{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">True</code>, and{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">False</code>.
      </p>

      <CodeBlock
        code={`# Correct use of is: checking for None
result = None
if result is None:
    print("no result yet")

if result is not None:
    print("got a result")

# Do NOT use is to compare values — it's unreliable
a = 1000
b = 1000
print(a == b)    # True  - always correct
print(a is b)    # False - different objects (may vary by interpreter)`}
        output={`no result yet
True
False`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">
        <code className="font-mono text-primary">in</code> and{" "}
        <code className="font-mono text-primary">not in</code>: membership
      </h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">in</code> operator
        tests membership. It works on strings, lists, tuples, sets, dicts, and any{" "}
        <Term term="iterable">iterable</Term>.
      </p>

      <CodeBlock
        code={`# Strings - checks substring
print("py" in "python")          # True
print("Java" in "python")        # False

# Lists - checks element
primes = [2, 3, 5, 7, 11]
print(5 in primes)               # True
print(4 not in primes)           # True

# Dicts - checks keys by default
config = {"debug": True, "port": 8080}
print("debug" in config)         # True
print("host" not in config)      # True

# Sets - O(1) lookup, fastest for membership tests
valid_extensions = {".jpg", ".png", ".gif", ".webp"}
print(".jpg" in valid_extensions)   # True`}
        output={`True
False
True
True
True
True
True`}
      />
    </section>
  );
}
