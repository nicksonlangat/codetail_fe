import { CodeBlock } from "@/components/blog/interactive/code-block";
import { InteractiveUnpack } from "@/components/blog/interactive/interactive-unpack";

export function UnpackingSection() {
  return (
    <section>
      <h2 id="unpacking" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Packing and unpacking
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Putting values into a tuple is called packing. Pulling them back out into
        separate variables is called unpacking. Both happen in a single assignment
        line and both are used constantly in real Python code.
      </p>

      <CodeBlock
        code={`# Packing
point = 3, 7          # packs 3 and 7 into a tuple

# Unpacking
x, y = point          # assigns 3 to x and 7 to y
print(x, y)           # 3 7

# Pack and unpack in one line
x, y = 3, 7           # the right side creates a temporary tuple
print(x, y)           # 3 7`}
        output={`3 7
3 7`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Swap without a temp variable</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The classic interview trick. Python evaluates the right side completely before
        doing any assignment, so this works cleanly with no temporary variable needed.
      </p>

      <CodeBlock
        code={`a, b = 10, 20
print(a, b)    # 10 20

a, b = b, a    # right side (b, a) = (20, 10) is packed first, then unpacked
print(a, b)    # 20 10`}
        output={`10 20
20 10`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Starred unpacking</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">*</code>{" "}
        prefix in an unpacking assignment collects all remaining items into a list.
        It can go anywhere in the assignment, not just at the end.
      </p>

      <CodeBlock
        code={`nums = (1, 2, 3, 4, 5)

first, *rest = nums
print(first)    # 1
print(rest)     # [2, 3, 4, 5]

*init, last = nums
print(init)     # [1, 2, 3, 4]
print(last)     # 5

first, *middle, last = nums
print(middle)   # [2, 3, 4]`}
        output={`1
[2, 3, 4, 5]
[1, 2, 3, 4]
5
[2, 3, 4]`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mt-2 mb-6">
        <p className="text-[13px] text-foreground/70 italic">
          Starred unpacking always produces a list, even when collecting from a tuple.
          Only one starred variable is allowed per unpacking expression.
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Ignoring values with _</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        When a tuple has values you do not need, assign them to{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">_</code>.
        It is a legal variable name but signals to any reader that the value is
        intentionally discarded.
      </p>

      <CodeBlock
        code={`# Only care about the score, not name or city
_, score, _ = ("Alice", 95, "NYC")
print(score)    # 95

# Unpack a 3-tuple but only use the first value
x, *_ = (10, 20, 30, 40)
print(x)        # 10`}
        output={`95
10`}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-6 mb-4">
        See it live. Pick a pattern below and watch how the tuple items map to variables.
      </p>

      <InteractiveUnpack />
    </section>
  );
}
