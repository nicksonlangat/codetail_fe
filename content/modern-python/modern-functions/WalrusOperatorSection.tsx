import { CodeBlock } from "@/components/blog/interactive/code-block";

export function WalrusOperatorSection() {
  return (
    <section>
      <h2
        id="walrus-operator"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        The walrus operator := (3.8)
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          :=
        </code>{" "}
        assigns and returns a value in a single expression. It removes the pattern of
        assigning a value, checking it on the next line, then using it again.
      </p>

      <CodeBlock
        code={`import re

# Before: assign, check, use -- three separate lines
line = "Error: disk full at /var/log"
match = re.search(r"Error: (.+)", line)
if match:
    print(match.group(1))

# After: assign and check in one expression
if match := re.search(r"Error: (.+)", line):
    print(match.group(1))`}
        output={`disk full at /var/log
disk full at /var/log`}
      />

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        While loops that process chunks
      </h3>

      <CodeBlock
        code={`import io

data = b"hello world this is a stream of bytes for testing purposes"
stream = io.BytesIO(data)

# Before: sentinel pattern, duplicated read call
chunk = stream.read(8)
while chunk:
    print(chunk)
    chunk = stream.read(8)

print("---")
stream.seek(0)

# After: walrus keeps the read in the condition
while chunk := stream.read(8):
    print(chunk)`}
        output={`b'hello wo'
b'rld this'
b' is a st'
b'ream of '
b'bytes fo'
b'r testin'
b'g purpos'
b'es'
---
b'hello wo'
b'rld this'
b' is a st'
b'ream of '
b'bytes fo'
b'r testin'
b'g purpos'
b'es'`}
      />

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        List comprehensions with expensive calls
      </h3>

      <CodeBlock
        code={`# Before: call process() twice -- once to filter, once to use
def process(n: int) -> int | None:
    return n * 2 if n % 3 == 0 else None

results = [process(n) for n in range(10) if process(n) is not None]
print(results)

# After: call once, keep the result
results = [y for n in range(10) if (y := process(n)) is not None]
print(results)`}
        output={`[0, 6, 12, 18]
[0, 6, 12, 18]`}
      />
    </section>
  );
}
