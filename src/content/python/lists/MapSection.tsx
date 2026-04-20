import { CodeBlock } from "@/components/blog/interactive/code-block";
import { InteractiveMap } from "@/components/blog/interactive/interactive-map";

export function MapSection() {
  return (
    <section>
      <h2 id="map" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Transforming lists
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Transforming means applying the same operation to every item and collecting the
        results into a new list. The length never changes. Every item goes in, every
        item comes out changed.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        In a comprehension, the expression before{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">for</code>{" "}
        is the transform. Whatever that expression evaluates to becomes the item in the
        new list.
      </p>

      <CodeBlock
        code={`nums = [1, 2, 3, 4, 5]

# Double every number
doubled = [x * 2 for x in nums]
print(doubled)   # [2, 4, 6, 8, 10]

# Square every number
squared = [x ** 2 for x in nums]
print(squared)   # [1, 4, 9, 16, 25]

# Convert to strings
as_strings = [str(x) for x in nums]
print(as_strings)   # ['1', '2', '3', '4', '5']

# Works on any type - uppercase every word
words = ["hello", "world", "python"]
upper = [w.upper() for w in words]
print(upper)   # ['HELLO', 'WORLD', 'PYTHON']`}
        output={`[2, 4, 6, 8, 10]
[1, 4, 9, 16, 25]
['1', '2', '3', '4', '5']
['HELLO', 'WORLD', 'PYTHON']`}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-6 mb-3">
        Python&apos;s built-in{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">map()</code>{" "}
        does the same job. It takes a function and an iterable and applies the function
        to each item. Comprehensions are generally preferred because the expression is
        written inline, no{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">lambda</code>{" "}
        needed.
      </p>

      <CodeBlock
        code={`nums = [1, 2, 3, 4, 5]

# These produce identical results
doubled_comp = [x * 2 for x in nums]
doubled_map  = list(map(lambda x: x * 2, nums))

print(doubled_comp)  # [2, 4, 6, 8, 10]
print(doubled_map)   # [2, 4, 6, 8, 10]

# map() shines when you already have a named function
def fahrenheit(c):
    return c * 9/5 + 32

temps_c = [0, 20, 37, 100]
temps_f = list(map(fahrenheit, temps_c))
print(temps_f)   # [32.0, 68.0, 98.6, 212.0]`}
        output={`[2, 4, 6, 8, 10]
[2, 4, 6, 8, 10]
[32.0, 68.0, 98.6, 212.0]`}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-6 mb-4">
        Pick a transform below and watch every item change at once.
      </p>

      <InteractiveMap />
    </section>
  );
}
