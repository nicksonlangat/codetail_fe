import { CodeBlock } from "@/components/blog/interactive/code-block";

export function AssignmentPatternsSection() {
  return (
    <section>
      <h2 id="assignment-patterns" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Assignment patterns
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Python has several assignment forms beyond the basic{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">x = value</code>.
        Each one has a specific use case.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Augmented assignment</h3>
      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A shorthand for updating a variable in terms of its current value.
      </p>
      <CodeBlock
        code={`count = 0
count += 1     # same as count = count + 1
count += 1
print(count)   # 2

total = 100
total -= 20    # subtract
total *= 1.1   # multiply (apply 10% markup)
print(total)   # 88.0

text = "hello"
text += " world"   # works on strings too
print(text)`}
        output={`2
88.0
hello world`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Multiple assignment</h3>
      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Assign the same value to several names in one line. Note that this binds all names to
        the <em>same</em> object — fine for immutables, potentially confusing for mutables.
      </p>
      <CodeBlock
        code={`x = y = z = 0      # all three names point to the same 0
print(x, y, z)     # 0 0 0

# Fine for immutables — 0 can't be mutated
x += 1
print(x, y, z)     # 1 0 0 — x now points to a different object

# Be careful with mutables
a = b = []         # both point to the SAME list
a.append(1)
print(a, b)        # [1] [1] — surprise!`}
        output={`0 0 0
1 0 0
[1] [1]`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Tuple unpacking</h3>
      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Assign multiple values in one line by unpacking from a tuple, list, or any iterable.
        The number of names must match the number of values — unless you use a star to capture
        the rest.
      </p>
      <CodeBlock
        code={`# Basic unpacking
x, y = 10, 20
print(x, y)         # 10 20

# Swap without a temp variable
x, y = y, x
print(x, y)         # 20 10

# Unpack a list
first, second, third = [1, 2, 3]

# Star captures the remainder
head, *tail = [1, 2, 3, 4, 5]
print(head)         # 1
print(tail)         # [2, 3, 4, 5]

first, *middle, last = [1, 2, 3, 4, 5]
print(first, last)  # 1 5
print(middle)       # [2, 3, 4]`}
        output={`10 20
20 10
1
[2, 3, 4, 5]
1 5
[2, 3, 4]`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Walrus operator (Python 3.8+)</h3>
      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">:=</code> operator
        assigns a value and returns it at the same time. Useful when you want to test a value
        and use it in the same expression.
      </p>
      <CodeBlock
        code={`import re

text = "Order #12345 placed"

# Without walrus — runs the regex twice
if re.search(r"\d+", text):
    match = re.search(r"\d+", text)
    print(match.group())

# With walrus — assign and test in one step
if match := re.search(r"\d+", text):
    print(match.group())    # "12345"

# Also useful in while loops
data = [3, 7, 1, 9, 2]
while (n := data.pop()) > 2:
    print(n)    # 2 < threshold, stops after 9`}
        output={`12345
12345
9`}
      />
    </section>
  );
}
