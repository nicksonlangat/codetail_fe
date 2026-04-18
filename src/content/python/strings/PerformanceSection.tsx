import { CodeBlock } from "@/components/blog/interactive/code-block";
import { ComplexityGraph } from "@/components/blog/interactive/complexity-graph";

export function PerformanceSection() {
  return (
    <section>
      <h2 id="performance" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Performance
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        There&apos;s one performance trap that catches every Python developer at least once:
        building a string by concatenating inside a loop.
      </p>

      <CodeBlock
        code={`# Don't do this
result = ""
for word in words:
    result += word + " "   # creates a brand new string every time`}
        highlightLines={[4]}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-6 mb-4">
        Because strings are immutable, each{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">+=</code> copies
        the entire existing string plus the new piece into a new object. For a loop over n
        words, you copy 1 char, then 2, then 3... the total work is proportional to n². Fine
        for 10 items, genuinely painful at 10,000.
      </p>

      <div className="my-6">
        <ComplexityGraph title='String building: "+=" loop vs join()' nMax={100} />
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The fix is{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">str.join()</code>.
        Collect all pieces in a list, then join once. Python pre-calculates the total length
        and allocates memory in a single pass.
      </p>

      <CodeBlock
        code={`# Do this instead (O(n))
parts = []
for word in words:
    parts.append(word)
result = " ".join(parts)

# Even better: list comprehension + join
result = " ".join(word.strip() for word in words)

# For large-scale text assembly: io.StringIO
from io import StringIO
buf = StringIO()
for chunk in data_stream:
    buf.write(chunk)
result = buf.getvalue()`}
        highlightLines={[5, 8]}
      />

      <div className="border-l-2 border-blue-400 bg-blue-400/5 pl-4 py-3 rounded-r-lg mt-6">
        <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mb-1">
          Performance note
        </p>
        <p className="text-[13px] text-foreground/70">
          CPython has an optimization that sometimes makes{" "}
          <code className="font-mono bg-muted px-1 rounded">+=</code> reuse the buffer when the
          string has only one reference. Don&apos;t rely on it. The optimization disappears
          with aliasing and isn&apos;t guaranteed. Use{" "}
          <code className="font-mono bg-muted px-1 rounded">join()</code> and never think about
          it again.
        </p>
      </div>
    </section>
  );
}
