import { CodeBlock } from "@/components/blog/interactive/code-block";

export function WriteSection() {
  return (
    <section>
      <h2 id="writing" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Writing files
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Mode{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">&quot;w&quot;</code>{" "}
        creates the file if it does not exist and overwrites it if it does.
        Mode{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">&quot;a&quot;</code>{" "}
        appends to the end, preserving existing content. Both create the file if absent.
      </p>

      <CodeBlock
        code={`# Write — creates or overwrites
with open("output.txt", "w", encoding="utf-8") as f:
    f.write("Hello, world!\n")
    f.write("Second line\n")

# writelines — no automatic newlines added
lines = ["one\n", "two\n", "three\n"]
with open("output.txt", "w", encoding="utf-8") as f:
    f.writelines(lines)

# Append — adds to end without truncating
with open("log.txt", "a", encoding="utf-8") as f:
    f.write("2024-01-15 server started\n")`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Writing structured data</h3>

      <CodeBlock
        code={`# Write a table of data cleanly
headers = ["name", "score", "grade"]
rows    = [
    ["Alice", "92", "A"],
    ["Bob",   "78", "C+"],
    ["Carol", "85", "B"],
]

with open("results.txt", "w", encoding="utf-8") as f:
    f.write("\t".join(headers) + "\n")
    for row in rows:
        f.write("\t".join(row) + "\n")`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Binary files</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Add{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">&quot;b&quot;</code>{" "}
        to the mode for binary files. The file object reads and writes{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">bytes</code>{" "}
        instead of strings. No encoding conversion happens.
      </p>

      <CodeBlock
        code={`# Copy a file byte-for-byte
with open("image.png", "rb") as src:
    with open("copy.png", "wb") as dst:
        dst.write(src.read())

# Read in chunks — for large files
with open("large.bin", "rb") as f:
    while chunk := f.read(8192):    # walrus operator, Python 3.8+
        process(chunk)`}
      />
    </section>
  );
}
