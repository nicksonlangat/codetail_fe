import { CodeBlock } from "@/components/blog/interactive/code-block";
import { StringSlicer } from "@/components/blog/interactive/string-slicer";

export function SlicingSection() {
  return (
    <section>
      <h2 id="indexing-slicing" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Indexing &amp; slicing
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Every character has two addresses: a positive index from the front (starting at 0) and
        a negative index from the back (starting at -1). Slicing lets you extract any
        subsequence with{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">
          [start:stop:step]
        </code>
        .
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Adjust the sliders to see how start, stop, and step interact. Selected characters
        highlight in real time.
      </p>

      <div className="my-6">
        <StringSlicer initialString="hello world" />
      </div>

      <div className="space-y-2 mb-6 mt-8">
        {[
          ["start", "defaults to 0 (beginning of string)"],
          ["stop", "defaults to end, excluded from the result"],
          ["step", "defaults to 1, use -1 to reverse"],
        ].map(([term, desc]) => (
          <div key={term} className="flex gap-3 items-baseline">
            <code className="font-mono text-[12px] bg-muted px-2 py-0.5 rounded text-primary flex-shrink-0">
              {term}
            </code>
            <span className="text-[13px] text-foreground/80">{desc}</span>
          </div>
        ))}
      </div>

      <div className="border-l-2 border-orange-400 bg-orange-400/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[11px] text-orange-600 dark:text-orange-400 font-medium mb-1">Gotcha</p>
        <p className="text-[13px] text-foreground/70">
          <code className="font-mono bg-muted px-1 rounded">s[start:stop]</code> includes{" "}
          <code className="font-mono bg-muted px-1 rounded">start</code> but excludes{" "}
          <code className="font-mono bg-muted px-1 rounded">stop</code>. So{" "}
          <code className="font-mono bg-muted px-1 rounded">s[0:5]</code> gives characters at
          indices 0, 1, 2, 3, 4. Never 5.
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Patterns you&apos;ll use constantly</h3>
      <CodeBlock
        code={`s = "Hello, World!"

s[:5]        # "Hello"          first 5 characters
s[-6:]       # "orld!"          last 6 characters
s[7:12]      # "World"          middle slice
s[::-1]      # "!dlroW ,olleH"  reverse the string
s[::2]       # "Hlo ol!"        every other character
s[1:-1]      # "ello, World"    strip first and last

# Negative indices count from the end
s[-1]        # "!"   last character
s[-3]        # "l"   third from end`}
        output={`Hello
orld!
World
!dlroW ,olleH
Hlo ol!
ello, World
!
l`}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-6">
        Out-of-range slice indices are silently clamped, no IndexError. But out-of-range
        single indices (like{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">s[99]</code>{" "}
        on a short string) do raise IndexError.
      </p>
    </section>
  );
}
