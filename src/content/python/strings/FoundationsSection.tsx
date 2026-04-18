import { CodeBlock } from "@/components/blog/interactive/code-block";
import { Term } from "@/components/blog/interactive/term";

export function FoundationsSection() {
  return (
    <section>
      <h2 id="what-is-a-string" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        What is a string?
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A string is an ordered,{" "}
        <Term term="immutable">immutable</Term>{" "}
        <Term term="sequence">sequence</Term> of{" "}
        <Term term="unicode">Unicode</Term>{" "}
        <Term term="code point">code points</Term>. Each character
        has a position, and the whole thing is locked down the moment it&apos;s created.
        That immutability shapes everything about how you use strings in Python.
      </p>

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-foreground/70 italic">
          Think of a string like a printed book page. You can read any word by its position,
          but you can&apos;t erase and rewrite a single letter. You&apos;d have to reprint the
          whole page. Python strings work the same way.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        This has a real consequence: every time you &ldquo;change&rdquo; a string, Python creates
        an entirely new string object. The original is untouched.
      </p>

      <CodeBlock
        code={`s = "hello"
print(id(s))        # memory address, e.g. 140234568

s = s + " world"    # creates a new string object
print(id(s))        # different address, new object
print(s)            # "hello world"`}
        output={`140234568
140235024
hello world`}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-6 mb-4">
        Try to mutate a character directly and Python refuses:
      </p>

      <CodeBlock
        code={`s = "hello"
s[0] = "H"  # Python won't allow this`}
        output={`TypeError: 'str' object does not support item assignment`}
        highlightLines={[2]}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-6 mb-4">
        Strings are also <Term term="sequence">sequences</Term>, so everything you know about Python sequences
        applies:{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">len()</code>,
        indexing, slicing, <Term term="iterable">iteration</Term>, and the{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">in</code>{" "}
        operator all work out of the box.
      </p>

      <CodeBlock
        code={`s = "Python"

print(len(s))           # 6
print("y" in s)         # True
print("x" in s)         # False

for char in s:
    print(char, end=" ")  # P y t h o n`}
        output={`6
True
False
P y t h o n`}
      />
    </section>
  );
}
