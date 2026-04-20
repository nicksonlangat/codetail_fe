import { CodeBlock } from "@/components/blog/interactive/code-block";
import { InteractiveVenn } from "@/components/blog/interactive/interactive-venn";

export function SetOperationsSection() {
  return (
    <section>
      <h2 id="set-operations" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Set operations
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Sets support the four classic math operations: union, intersection, difference,
        and symmetric difference. Each produces a new set without modifying the originals.
        Python provides both operator syntax and method syntax — they are equivalent.
      </p>

      <CodeBlock
        code={`A = {1, 2, 3, 4, 5}
B = {4, 5, 6, 7, 8}

# Union — all items from either set
print(A | B)             # {1, 2, 3, 4, 5, 6, 7, 8}
print(A.union(B))        # same

# Intersection — items in both
print(A & B)             # {4, 5}
print(A.intersection(B)) # same

# Difference — in A but not B
print(A - B)             # {1, 2, 3}
print(A.difference(B))   # same

# Symmetric difference — in exactly one set
print(A ^ B)                        # {1, 2, 3, 6, 7, 8}
print(A.symmetric_difference(B))    # same`}
        output={`{1, 2, 3, 4, 5, 6, 7, 8}
{1, 2, 3, 4, 5, 6, 7, 8}
{4, 5}
{4, 5}
{1, 2, 3}
{1, 2, 3}
{1, 2, 3, 6, 7, 8}
{1, 2, 3, 6, 7, 8}`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mt-2 mb-6">
        <p className="text-[13px] text-foreground/70 italic">
          The method forms (
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">.union()</code>,{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">.intersection()</code>, etc.)
          accept any iterable, not just sets. The operators (
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">|</code>,{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">&</code>, etc.)
          require both sides to be sets.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Pick an operation below to see which region of the Venn diagram it selects.
      </p>

      <InteractiveVenn />
    </section>
  );
}
