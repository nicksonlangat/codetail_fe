import { CodeBlock } from "@/components/blog/interactive/code-block";

export function FstringEvolutionSection() {
  return (
    <section>
      <h2
        id="fstring-evolution"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        f-string evolution: from % to {"{x=}"}
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Python has had four string formatting systems. Only one is still worth writing.
      </p>

      <CodeBlock
        code={`name = "Alice"
score = 42.7654

# % formatting (Python 1.x): C-style, confusing width/precision syntax
print("%-10s: %.2f" % (name, score))

# str.format() (Python 2.6): verbose, hard to read with many values
print("{:<10}: {:.2f}".format(name, score))

# f-strings (Python 3.6): inline expressions, direct and readable
print(f"{name:<10}: {score:.2f}")`}
        output={`Alice     : 42.77
Alice     : 42.77
Alice     : 42.77`}
      />

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        The debug shorthand: f"{"{x=}"}" (3.8)
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Adding{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          =
        </code>{" "}
        after a variable name prints both the expression and its value. Saves you from writing
        the variable name twice every time you debug.
      </p>

      <CodeBlock
        code={`# Before 3.8: the tedious way to debug
x = 42
result = x * 3.14
print("x =", x)
print("result =", result)

# After 3.8: = suffix does both in one shot
x = 42
result = x * 3.14
print(f"{x=}")
print(f"{result=}")
print(f"{x=}, {result=:.2f}")`}
        output={`x = 42
result = 131.88
x=42
result=131.88
x=42, result=131.88`}
      />

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Expressions inside f-strings
      </h3>

      <CodeBlock
        code={`from datetime import date

items = [1, 2, 3, 4, 5]
today = date.today()

# Any expression works between the braces
print(f"total: {sum(items)}")
print(f"average: {sum(items) / len(items):.1f}")
print(f"year: {today.year}")
print(f"upper: {'hello world'.upper()}")`}
        output={`total: 15
average: 3.0
year: 2026
upper: HELLO WORLD`}
      />
    </section>
  );
}
