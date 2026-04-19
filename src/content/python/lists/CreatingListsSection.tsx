import { CodeBlock } from "@/components/blog/interactive/code-block";

export function CreatingListsSection() {
  return (
    <section>
      <h2 id="creating-lists" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Creating lists
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A list is an ordered, mutable collection. You can put anything in a list: numbers,
        strings, booleans, other lists, even functions. Items don&apos;t have to be the same type.
      </p>

      <CodeBlock
        code={`# Literal syntax
fruits = ["apple", "banana", "cherry"]
nums   = [1, 2, 3, 4, 5]
empty  = []

# Mixed types are fine
mixed = [1, "hello", True, None, 3.14]

# Nested lists
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]
print(matrix[1][2])   # 6 - row 1, column 2`}
        output={`6`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">
        <code className="font-mono text-primary">list()</code> constructor
      </h3>
      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Convert any iterable to a list.
      </p>
      <CodeBlock
        code={`list("hello")           # ['h', 'e', 'l', 'l', 'o']
list(range(5))          # [0, 1, 2, 3, 4]
list((1, 2, 3))         # [1, 2, 3] - tuple to list
list({3, 1, 2})         # [1, 2, 3] - set to list (order varies)

# range() is common for generating sequences
evens = list(range(0, 10, 2))
print(evens)    # [0, 2, 4, 6, 8]`}
        output={`[0, 2, 4, 6, 8]`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Initializing with a default value</h3>
      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">*</code> operator
        repeats a list. Use it to pre-fill a list with a known size. Works for immutables only.
        See the gotcha below.
      </p>
      <CodeBlock
        code={`zeros = [0] * 5
print(zeros)    # [0, 0, 0, 0, 0]

flags = [False] * 3
print(flags)    # [False, False, False]`}
        output={`[0, 0, 0, 0, 0]
[False, False, False]`}
      />
      <div className="border-l-2 border-warning bg-warning/5 pl-4 py-3 rounded-r-lg mt-3">
        <p className="text-[13px] text-foreground/70">
          <strong>Gotcha:</strong>{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">[[]] * 3</code>{" "}
          creates three references to the <em>same</em> inner list, not three separate lists.
          Modifying one modifies all. Use a comprehension instead:{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">[[] for _ in range(3)]</code>.
        </p>
      </div>
    </section>
  );
}
