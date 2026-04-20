import { CodeBlock } from "@/components/blog/interactive/code-block";

export function WhenToUseSection() {
  return (
    <section>
      <h2 id="when-to-use" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Tuples vs lists
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Both are sequences. The difference is intent. Use a list when you have a
        collection of items that can grow, shrink, or be reordered. Use a tuple when
        you have a fixed structure where each position has a specific meaning.
      </p>

      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        {[
          {
            icon: "📋",
            label: "List",
            desc: "A collection of items of the same kind. The number of items can change. Position is arbitrary.",
            example: "users = ['Alice', 'Bob', 'Carol']",
          },
          {
            icon: "🔒",
            label: "Tuple",
            desc: "A record where each position has fixed meaning. The structure is part of the design.",
            example: "point = (x, y)",
          },
        ].map(({ icon, label, desc, example }) => (
          <div key={label} className="flex gap-3 p-4 bg-card border border-border rounded-xl">
            <span className="text-lg flex-shrink-0">{icon}</span>
            <div>
              <p className="text-[13px] font-semibold mb-0.5">{label}</p>
              <p className="text-[12px] text-muted-foreground mb-2">{desc}</p>
              <code className="text-[11px] font-mono text-primary/80">{example}</code>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Returning multiple values</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Functions that return multiple values return a tuple. Python packs the return
        values automatically. The caller unpacks them. This is one of the most common
        tuple patterns in real code.
      </p>

      <CodeBlock
        code={`def min_max(nums):
    return min(nums), max(nums)   # returns a tuple

lo, hi = min_max([3, 1, 4, 1, 5, 9, 2, 6])
print(lo, hi)    # 1 9

# Works with any iterable
def split_name(full_name: str) -> tuple[str, str]:
    parts = full_name.split(" ", 1)
    return parts[0], parts[1] if len(parts) > 1 else ""

first, last = split_name("Ada Lovelace")
print(first, last)    # Ada Lovelace`}
        output={`1 9
Ada Lovelace`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Structured records</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        When data has a fixed schema, a tuple makes that structure explicit. A database
        row, a coordinate, a color channel, a key-value pair. All are natural tuples.
      </p>

      <CodeBlock
        code={`# Database rows
rows = [
    ("Alice", "Engineering", 90000),
    ("Bob",   "Design",      80000),
    ("Carol", "Product",     95000),
]

for name, dept, salary in rows:
    print(f"{name} ({dept}): {salary}")

# Coordinates on a grid
DIRECTIONS = {
    "up":    (0, -1),
    "down":  (0,  1),
    "left":  (-1, 0),
    "right": (1,  0),
}`}
        output={`Alice (Engineering): 90000
Bob (Design): 80000
Carol (Product): 95000`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Signal immutability to the reader</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Choosing a tuple is also a signal. When a function returns a tuple, the caller
        knows the structure is fixed. When a constant is a tuple, it is clear that
        nobody should add to or modify it. The choice communicates intent even before
        anyone reads the code.
      </p>

      <CodeBlock
        code={`# Constants as tuples — clearly not meant to grow
WEEKDAYS  = ("Mon", "Tue", "Wed", "Thu", "Fri")
HTTP_OK   = (200, 201, 202, 204)
RGB_BLACK = (0, 0, 0)

# Using a list here would mislead the reader into thinking
# this collection is meant to be modified`}
      />
    </section>
  );
}
