import { CodeBlock } from "@/components/blog/interactive/code-block";

export function MathFunctionsSection() {
  return (
    <section>
      <h2 id="math-functions" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Math functions
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Python gives you math tools in two places: built-in functions available everywhere,
        and the{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">math</code>{" "}
        module for everything else.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Built-in functions</h3>

      <CodeBlock
        code={`# abs() — absolute value
print(abs(-7))        # 7
print(abs(3.14))      # 3.14

# round() — round to n decimal places
print(round(3.14159, 2))   # 3.14
print(round(3.14159, 0))   # 3.0 — still a float
print(round(3.14159))      # 3   — integer when no ndigits

# min() and max()
print(min(3, 1, 4, 1, 5))      # 1
print(max(3, 1, 4, 1, 5))      # 5
print(min([3, 1, 4, 1, 5]))    # 1 — also accepts a list

# sum()
print(sum([1, 2, 3, 4, 5]))    # 15
print(sum(range(1, 101)))      # 5050 — Gauss's formula check

# divmod() — quotient and remainder in one call
q, r = divmod(17, 5)
print(q, r)    # 3 2 — same as (17 // 5, 17 % 5)

# pow() — same as ** but accepts an optional modulus
print(pow(2, 10))         # 1024
print(pow(2, 10, 1000))   # 24 — 1024 mod 1000`}
        output={`7
3.14
3.14
3.0
3
1
5
1
15
5050
3 2
1024
24`}
      />

      <div className="border-l-2 border-warning bg-warning/5 pl-4 py-3 rounded-r-lg mt-4 mb-8">
        <p className="text-[13px] text-foreground/70">
          <strong>Gotcha with round():</strong> Python uses banker&apos;s rounding (round
          half to even). So{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">round(0.5)</code> is{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">0</code> and{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">round(1.5)</code> is{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">2</code>. This
          reduces cumulative rounding error in statistical calculations, but it surprises
          people expecting standard rounding.
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">The math module</h3>

      <CodeBlock
        code={`import math

# Constants
print(math.pi)    # 3.141592653589793
print(math.e)     # 2.718281828459045
print(math.tau)   # 6.283... — 2 * pi
print(math.inf)   # inf

# Rounding
print(math.floor(3.9))    # 3 — always rounds down
print(math.ceil(3.1))     # 4 — always rounds up
print(math.trunc(3.9))    # 3 — truncates toward zero
print(math.trunc(-3.9))   # -3 — toward zero (unlike floor)

# Roots and powers
print(math.sqrt(16))      # 4.0
print(math.isqrt(17))     # 4 — integer square root (floor)

# Logarithms
print(math.log(math.e))   # 1.0 — natural log
print(math.log(100, 10))  # 2.0 — log base 10
print(math.log2(1024))    # 10.0 — log base 2
print(math.log10(1000))   # 3.0`}
        output={`3.141592653589793
2.718281828459045
6.283185307179586
inf
3
4
3
-3
4.0
4
1.0
2.0
10.0
3.0`}
      />

      <CodeBlock
        code={`import math

# Trig (angles in radians)
print(math.sin(math.pi / 2))    # 1.0
print(math.cos(0))              # 1.0
print(math.degrees(math.pi))    # 180.0
print(math.radians(180))        # 3.14159...

# Useful utilities
print(math.factorial(10))       # 3628800
print(math.gcd(48, 18))         # 6 — greatest common divisor
print(math.lcm(4, 6))           # 12 — least common multiple (Python 3.9+)
print(math.comb(10, 3))         # 120 — "10 choose 3" combinations
print(math.perm(10, 3))         # 720 — permutations

# Float comparison (the right way)
print(math.isclose(0.1 + 0.2, 0.3))   # True
print(math.isfinite(math.inf))         # False
print(math.isinf(math.inf))            # True
print(math.isnan(float('nan')))        # True`}
        output={`1.0
1.0
180.0
3.141592653589793
3628800
6
12
120
720
True
False
True
True`}
      />
    </section>
  );
}
