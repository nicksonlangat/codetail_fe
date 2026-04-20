import { CodeBlock } from "@/components/blog/interactive/code-block";

export function WhileLoopsSection() {
  return (
    <section>
      <h2 id="while-loops" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        While loops
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">while</code>{" "}
        loop runs as long as its condition is true. Use it when you do not know how many
        iterations you need — user input, polling a state, reading until a sentinel value.
        When you know the count or have a sequence, a{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">for</code>{" "}
        loop is almost always cleaner.
      </p>

      <CodeBlock
        code={`# Count down
n = 5
while n > 0:
    print(n, end=" ")
    n -= 1
print()    # 5 4 3 2 1

# Consume a queue
from collections import deque
queue = deque([1, 2, 3, 4])
while queue:
    item = queue.popleft()
    print(item, end=" ")   # 1 2 3 4
print()`}
        output={`5 4 3 2 1
1 2 3 4`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">break and while / else</h3>

      <CodeBlock
        code={`# Retry loop with break
import random
random.seed(42)

attempts = 0
while True:
    attempts += 1
    value = random.randint(1, 10)
    if value == 7:
        print(f"Found 7 after {attempts} attempts")
        break

# while / else — else runs only if no break occurred
n = 10
while n > 0:
    if n == 3:
        print("stopped at 3")
        break
    n -= 1
else:
    print("counted all the way down")   # not printed here`}
        output={`Found 7 after 2 attempts
stopped at 3`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Infinite loops with controlled exit</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">while True</code>{" "}
        with a{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">break</code>{" "}
        is the canonical pattern for event loops, REPLs, and retry logic. It is more
        readable than duplicating the exit condition.
      </p>

      <CodeBlock
        code={`# Read lines until empty input
lines = []
# In real code: line = input("Enter text (blank to stop): ")
# Simulated here:
inputs = ["hello", "world", "", "ignored"]
idx = 0
while True:
    line = inputs[idx]; idx += 1
    if not line:
        break
    lines.append(line)

print(lines)   # ['hello', 'world']

# Exponential backoff retry
import time

def fetch_with_retry(url, max_retries=3):
    delay = 1
    for attempt in range(max_retries):
        try:
            # result = requests.get(url)
            return "success"
        except Exception:
            if attempt == max_retries - 1:
                raise
            time.sleep(delay)
            delay *= 2`}
        output={`['hello', 'world']`}
      />
    </section>
  );
}
