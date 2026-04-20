import { CodeBlock } from "@/components/blog/interactive/code-block";
import { Term } from "@/components/blog/interactive/term";

export function CreatingTuplesSection() {
  return (
    <section>
      <h2 id="creating-tuples" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Creating tuples
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A tuple is a sequence of values grouped together. Unlike lists, you cannot add,
        remove, or change items after creation. That constraint is the whole point.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The most common syntax uses parentheses, but the parentheses are not what makes
        a tuple. The{" "}
        <Term term="comma">comma</Term>{" "}
        is what makes a tuple. Parentheses are just punctuation that improves readability.
      </p>

      <CodeBlock
        code={`# Standard syntax
point = (3, 7)
rgb   = (255, 128, 0)
empty = ()

# Parentheses are optional — the comma creates the tuple
point = 3, 7        # same as (3, 7)
x = 1, 2, 3         # same as (1, 2, 3)

print(type(point))  # <class 'tuple'>
print(type(x))      # <class 'tuple'>`}
        output={`<class 'tuple'>
<class 'tuple'>`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">The single-element gotcha</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Creating a tuple with exactly one item trips up almost everyone the first time.
        Writing{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">(42)</code>{" "}
        gives you the integer 42, not a tuple. The parentheses are just grouping. You need
        the trailing comma.
      </p>

      <CodeBlock
        code={`not_a_tuple = (42)       # just the integer 42
single      = (42,)      # a tuple containing 42
also_single = 42,        # same thing, no parens needed

print(type(not_a_tuple))  # <class 'int'>
print(type(single))       # <class 'tuple'>
print(single)             # (42,)
print(len(single))        # 1`}
        output={`<class 'int'>
<class 'tuple'>
(42,)
1`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mt-2 mb-6">
        <p className="text-[13px] text-foreground/70 italic">
          Python always displays single-element tuples with the trailing comma:{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">(42,)</code>.
          That is a reminder that the comma is the real syntax, not the parentheses.
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">The tuple() constructor</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">tuple()</code>{" "}
        converts any iterable into a tuple. This is how you freeze a list, range, or
        string into an immutable sequence.
      </p>

      <CodeBlock
        code={`from_list  = tuple([1, 2, 3])     # (1, 2, 3)
from_range = tuple(range(5))      # (0, 1, 2, 3, 4)
from_str   = tuple("abc")         # ('a', 'b', 'c')
from_set   = tuple({3, 1, 2})     # (1, 2, 3) — order not guaranteed

print(from_list)   # (1, 2, 3)
print(from_range)  # (0, 1, 2, 3, 4)
print(from_str)    # ('a', 'b', 'c')`}
        output={`(1, 2, 3)
(0, 1, 2, 3, 4)
('a', 'b', 'c')`}
      />
    </section>
  );
}
