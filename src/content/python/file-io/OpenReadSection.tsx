import { CodeBlock } from "@/components/blog/interactive/code-block";
import { InteractiveFileModes } from "@/components/blog/interactive/interactive-file-modes";

export function OpenReadSection() {
  return (
    <section>
      <h2 id="open-read" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Opening and reading files
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">open()</code>{" "}
        returns a file object. Always use it as a context manager with{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">with</code>{" "}
        so the file is closed automatically, even if an exception occurs.
      </p>

      <CodeBlock
        code={`# Read the entire file as one string
with open("notes.txt", "r") as f:
    content = f.read()
    print(content)

# Read line by line — memory-efficient for large files
with open("notes.txt") as f:    # "r" is the default mode
    for line in f:
        print(line, end="")     # lines already include \n

# Read all lines into a list
with open("notes.txt") as f:
    lines = f.readlines()       # ['line 1\n', 'line 2\n', ...]

# Read one line at a time
with open("notes.txt") as f:
    first = f.readline()        # 'line 1\n'`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Encoding</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Always specify{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">encoding="utf-8"</code>{" "}
        explicitly. The default depends on the operating system and can vary between
        machines, causing silent data corruption on non-ASCII characters.
      </p>

      <CodeBlock
        code={`# Explicit encoding — always do this
with open("data.txt", encoding="utf-8") as f:
    content = f.read()

# Common encodings
# utf-8      — universal, handles all Unicode
# utf-8-sig  — UTF-8 with BOM (common in Windows-generated CSVs)
# latin-1    — legacy Western European files`}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-6 mb-4">
        Each mode controls what operations are allowed and how the file is opened.
      </p>

      <InteractiveFileModes />
    </section>
  );
}
