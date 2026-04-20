import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ClosuresSection() {
  return (
    <section>
      <h2 id="closures" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Closures
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A closure is a function that remembers the variables from the scope where it
        was defined, even after that scope has finished executing. The inner function
        &quot;closes over&quot; the variables it references. This is how Python implements
        stateful functions without classes.
      </p>

      <CodeBlock
        code={`def make_multiplier(factor):
    def multiply(x):
        return x * factor    # factor is captured from the enclosing scope
    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)

print(double(5))    # 10
print(triple(5))    # 15

# Each closure has its own captured variable
print(double(10))   # 20
print(triple(10))   # 30`}
        output={`10
15
20
30`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Closures with nonlocal state</h3>

      <CodeBlock
        code={`def make_accumulator(initial=0):
    total = initial

    def add(n):
        nonlocal total
        total += n
        return total

    return add

acc = make_accumulator()
print(acc(10))    # 10
print(acc(5))     # 15
print(acc(20))    # 35

# Independent accumulators
a = make_accumulator(100)
b = make_accumulator()
print(a(10))      # 110
print(b(10))      # 10`}
        output={`10
15
35
110
10`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">The loop closure gotcha</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Closures capture variables by reference, not by value. Inside a loop, all
        the closures share the same variable — and by the time they run, the loop
        has finished and the variable holds its final value.
      </p>

      <CodeBlock
        code={`# Bug — all functions print 3
funcs = []
for i in range(4):
    funcs.append(lambda: i)    # all capture the same 'i'

print([f() for f in funcs])   # [3, 3, 3, 3]

# Fix 1 — default argument captures the current value
funcs = []
for i in range(4):
    funcs.append(lambda i=i: i)

print([f() for f in funcs])   # [0, 1, 2, 3]

# Fix 2 — factory function
def make_fn(n):
    return lambda: n

funcs = [make_fn(i) for i in range(4)]
print([f() for f in funcs])   # [0, 1, 2, 3]`}
        output={`[3, 3, 3, 3]
[0, 1, 2, 3]
[0, 1, 2, 3]`}
      />
    </section>
  );
}
