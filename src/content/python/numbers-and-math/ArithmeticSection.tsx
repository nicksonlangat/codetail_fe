import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ArithmeticSection() {
  return (
    <section>
      <h2 id="arithmetic" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Arithmetic operators
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Python has seven arithmetic operators. Most behave as expected, but three have
        gotchas worth knowing upfront.
      </p>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-6 font-medium text-muted-foreground/70 text-[11px] uppercase tracking-wider">Operator</th>
              <th className="text-left py-2 pr-6 font-medium text-muted-foreground/70 text-[11px] uppercase tracking-wider">Name</th>
              <th className="text-left py-2 pr-6 font-medium text-muted-foreground/70 text-[11px] uppercase tracking-wider">Example</th>
              <th className="text-left py-2 font-medium text-muted-foreground/70 text-[11px] uppercase tracking-wider">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {[
              ["+", "Addition", "3 + 2", "5"],
              ["-", "Subtraction", "3 - 2", "1"],
              ["*", "Multiplication", "3 * 2", "6"],
              ["/", "Division", "7 / 2", "3.5 (always float)"],
              ["//", "Floor division", "7 // 2", "3 (integer result)"],
              ["%", "Modulo", "7 % 2", "1 (remainder)"],
              ["**", "Exponentiation", "2 ** 10", "1024"],
            ].map(([op, name, ex, result]) => (
              <tr key={op}>
                <td className="py-2.5 pr-6">
                  <code className="font-mono text-primary font-semibold">{op}</code>
                </td>
                <td className="py-2.5 pr-6 text-foreground/80">{name}</td>
                <td className="py-2.5 pr-6">
                  <code className="font-mono text-foreground/70">{ex}</code>
                </td>
                <td className="py-2.5 text-foreground/70">{result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">
        Division always returns a float
      </h3>
      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        In Python 3, <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">/</code> always
        returns a float, even when dividing two integers evenly. Use{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">//</code> when
        you need an integer result.
      </p>
      <CodeBlock
        code={`print(10 / 2)     # 5.0 — float, even though it divides evenly
print(10 // 2)    # 5   — integer (floor division)
print(7 / 2)      # 3.5
print(7 // 2)     # 3   — rounds toward negative infinity, not zero`}
        output={`5.0
5
3.5
3`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Floor division rounds toward negative infinity</h3>
      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">//</code> always
        rounds <em>down</em>, meaning toward negative infinity, not toward zero. This matters
        with negative numbers.
      </p>
      <CodeBlock
        code={`print(7 // 2)      # 3   — expected
print(-7 // 2)     # -4  — rounds toward -inf, not -3
print(7 // -2)     # -4  — same rule

# Compare with int() which truncates toward zero
print(int(-7 / 2)) # -3  — truncates toward zero
print(-7 // 2)     # -4  — floors toward -infinity`}
        output={`3
-4
-4
-3
-4`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Modulo: remainder after division</h3>
      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">%</code> operator
        gives the remainder after floor division. Classic uses: checking for even/odd, wrapping
        around a range, extracting digits.
      </p>
      <CodeBlock
        code={`# Even/odd
print(10 % 2)   # 0 — even
print(7 % 2)    # 1 — odd

# Wrapping: keep index in range 0..n-1
index = 7
n = 5
print(index % n)   # 2 — wraps around

# Extract last two digits of a year
year = 2025
print(year % 100)  # 25

# Check divisibility
for n in range(1, 16):
    if n % 3 == 0 and n % 5 == 0:
        print("FizzBuzz")
    elif n % 3 == 0:
        print("Fizz")
    elif n % 5 == 0:
        print("Buzz")`}
        output={`0
1
2
25
Fizz
Buzz
Fizz
Fizz
Buzz
Fizz
FizzBuzz`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Exponentiation</h3>
      <CodeBlock
        code={`print(2 ** 10)      # 1024
print(2 ** 0.5)     # 1.4142... — square root via fractional exponent
print((-1) ** 0.5)  # (6.123233995736766e-17+1j) — complex number!

# Faster for large exponents: pow() with three arguments does modular exponentiation
print(pow(2, 100, 1000))   # 2^100 mod 1000 = 376 — fast even for huge exponents`}
        output={`1024
1.4142135623730951
(6.123233995736766e-17+1j)
376`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Operator precedence</h3>
      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Python follows standard math precedence. When in doubt, use parentheses — they
        make intent explicit and are never wrong.
      </p>
      <CodeBlock
        code={`# PEMDAS/BODMAS applies
print(2 + 3 * 4)      # 14, not 20 — * before +
print((2 + 3) * 4)    # 20 — parens override

# ** binds tighter than unary minus — this surprises people
print(-2 ** 2)        # -4, not 4 — reads as -(2**2)
print((-2) ** 2)      # 4  — use parens when you mean negative base`}
        output={`14
20
-4
4`}
      />
    </section>
  );
}
