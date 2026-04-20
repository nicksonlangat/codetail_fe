import { CodeBlock } from "@/components/blog/interactive/code-block";
import { InteractiveFilter } from "@/components/blog/interactive/interactive-filter";

export function FilterSection() {
  return (
    <section>
      <h2 id="filter" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Filtering lists
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Filtering means keeping only the items that satisfy a condition and discarding
        the rest. The original list is never touched. You get back a new, shorter list.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        The clearest way to filter in Python is a comprehension with an{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">if</code>{" "}
        clause. You read it left to right:{" "}
        <em>give me each x from nums, but only if the condition is true.</em>
      </p>

      <CodeBlock
        code={`nums = [1, 2, 3, 4, 5, 6, 7, 8]

# Keep only even numbers
evens = [x for x in nums if x % 2 == 0]
print(evens)   # [2, 4, 6, 8]

# Keep numbers greater than 4
big = [x for x in nums if x > 4]
print(big)     # [5, 6, 7, 8]

# Works on strings too - keep non-empty values
words = ["hello", "", "world", "  ", "python"]
non_empty = [w for w in words if w.strip()]
print(non_empty)   # ['hello', 'world', 'python']`}
        output={`[2, 4, 6, 8]
[5, 6, 7, 8]
['hello', 'world', 'python']`}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-6 mb-3">
        Python also has a built-in{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">filter()</code>{" "}
        function that does the same thing. Comprehensions are preferred because they
        don&apos;t require a{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">lambda</code>{" "}
        and read more naturally.
      </p>

      <CodeBlock
        code={`nums = [1, 2, 3, 4, 5]

# These produce identical results
evens_comp   = [x for x in nums if x % 2 == 0]
evens_filter = list(filter(lambda x: x % 2 == 0, nums))

print(evens_comp)    # [2, 4]
print(evens_filter)  # [2, 4]`}
        output={`[2, 4]
[2, 4]`}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-6 mb-4">
        See it live. Pick a condition below and watch which items survive.
      </p>

      <InteractiveFilter />
    </section>
  );
}
