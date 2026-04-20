import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ForLoopsSection() {
  return (
    <section>
      <h2 id="for-loops" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        For loops
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">for</code>{" "}
        loop in Python iterates over any iterable — a list, string, tuple, dict, set,
        range, file, or any object that implements{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">__iter__</code>.
        There is no index by default. If you need one, use{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">enumerate()</code>.
      </p>

      <CodeBlock
        code={`# Iterating a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# Iterating a string
for char in "Python":
    print(char, end=" ")    # P y t h o n
print()

# Iterating a dict — gives keys by default
scores = {"Alice": 92, "Bob": 78}
for name in scores:
    print(name, scores[name])`}
        output={`apple
banana
cherry
P y t h o n
Alice 92
Bob 78`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">range()</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">range()</code>{" "}
        generates integers on demand. It does not build a list — it produces one number
        at a time. Use it when you need to repeat something N times or loop over numeric
        indices.
      </p>

      <CodeBlock
        code={`# range(stop) — 0 up to stop-1
for i in range(5):
    print(i, end=" ")   # 0 1 2 3 4
print()

# range(start, stop) — start up to stop-1
for i in range(2, 8):
    print(i, end=" ")   # 2 3 4 5 6 7
print()

# range(start, stop, step)
for i in range(0, 20, 5):
    print(i, end=" ")   # 0 5 10 15
print()

# Countdown
for i in range(5, 0, -1):
    print(i, end=" ")   # 5 4 3 2 1
print()`}
        output={`0 1 2 3 4
2 3 4 5 6 7
0 5 10 15
5 4 3 2 1`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">break and continue</h3>

      <CodeBlock
        code={`# break — exit the loop immediately
for n in range(10):
    if n == 5:
        break
    print(n, end=" ")   # 0 1 2 3 4
print()

# continue — skip the rest of this iteration
for n in range(10):
    if n % 2 == 0:
        continue
    print(n, end=" ")   # 1 3 5 7 9
print()`}
        output={`0 1 2 3 4
1 3 5 7 9`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">for / else</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">for</code>{" "}
        loop can have an{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">else</code>{" "}
        clause. It runs if and only if the loop completed without hitting a{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">break</code>.
        This is the cleanest way to express the &quot;search and report if not found&quot; pattern.
      </p>

      <CodeBlock
        code={`def find_prime(numbers):
    for n in numbers:
        if all(n % i != 0 for i in range(2, n)):
            print(f"First prime: {n}")
            break
    else:
        print("No primes found")

find_prime([4, 6, 8, 7, 10])    # First prime: 7
find_prime([4, 6, 8, 10])       # No primes found`}
        output={`First prime: 7
No primes found`}
      />
    </section>
  );
}
