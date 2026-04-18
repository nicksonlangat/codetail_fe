import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ConditionalsSection() {
  return (
    <section>
      <h2 id="conditionals" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Conditionals
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">if</code> statements
        execute a block when a condition is truthy. Any expression can be a condition — Python
        calls <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">bool()</code>{" "}
        on it automatically.
      </p>

      <CodeBlock
        code={`score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

print(grade)    # B`}
        output={`B`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-foreground/70 italic">
          Python uses indentation to define blocks, not curly braces. The standard indent is
          4 spaces. Be consistent — mixing tabs and spaces causes a{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">TabError</code>.
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Truthiness in conditions</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        You don&apos;t need to write explicit comparisons for empty/zero checks. Python evaluates
        the value directly.
      </p>

      <CodeBlock
        code={`items = []
name = ""
count = 0

# Verbose (unnecessary)
if len(items) == 0:
    print("no items")
if name == "":
    print("no name")

# Idiomatic
if not items:
    print("no items")
if not name:
    print("no name")
if not count:
    print("zero count")`}
        output={`no items
no name
no items
no name
zero count`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Conditional expressions (ternary)</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A conditional expression picks one of two values in a single line. Use it for simple
        assignments. For anything with side effects or multiple branches, use a full{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">if</code> statement.
      </p>

      <CodeBlock
        code={`age = 20

# Syntax: value_if_true if condition else value_if_false
status = "adult" if age >= 18 else "minor"
print(status)    # adult

# Useful inline
def describe(n):
    return "positive" if n > 0 else "negative" if n < 0 else "zero"

print(describe(5))    # positive
print(describe(-3))   # negative
print(describe(0))    # zero

# In f-strings
score = 73
print(f"Result: {'pass' if score >= 60 else 'fail'}")`}
        output={`adult
positive
negative
zero
Result: pass`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">match statements (Python 3.10+)</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Python 3.10 added structural pattern matching. It&apos;s more powerful than a chain
        of{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">elif</code>s
        because it matches structure, not just values.
      </p>

      <CodeBlock
        code={`command = "quit"

match command:
    case "quit" | "exit" | "q":
        print("Goodbye!")
    case "help":
        print("Available commands: quit, help, run")
    case "run":
        print("Running...")
    case _:
        print(f"Unknown command: {command}")

# Matching on structure
point = (0, 5)

match point:
    case (0, 0):
        print("origin")
    case (x, 0):
        print(f"on x-axis at {x}")
    case (0, y):
        print(f"on y-axis at {y}")    # this matches
    case (x, y):
        print(f"point at {x}, {y}")`}
        output={`Goodbye!
on y-axis at 5`}
      />
    </section>
  );
}
