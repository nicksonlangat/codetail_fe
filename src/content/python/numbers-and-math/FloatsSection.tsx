import { CodeBlock } from "@/components/blog/interactive/code-block";

export function FloatsSection() {
  return (
    <section>
      <h2 id="floats" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Floats and why they lie
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Floats are Python&apos;s decimal numbers. They&apos;re fast and cover an enormous range,
        but they have a fundamental limitation that trips up almost every programmer.
      </p>

      <CodeBlock
        code={`print(0.1 + 0.2)           # 0.30000000000000004
print(0.1 + 0.2 == 0.3)    # False`}
        output={`0.30000000000000004
False`}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-6 mb-4">
        This isn&apos;t a Python bug. It&apos;s how floating-point math works in every
        language — C, Java, JavaScript, Go. Python is just honest about it.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Why it happens</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Computers store numbers in binary (base 2). Just like 1/3 has no exact decimal
        representation (0.333...), 1/10 has no exact binary representation. It&apos;s a
        repeating fraction in binary: 0.0001100110011...
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Python stores floats using 64 bits (the IEEE 754 double precision standard). That
        gives you about 15-17 significant digits. The closest 64-bit float to 0.1 is not
        exactly 0.1 — it&apos;s:
      </p>

      <CodeBlock
        code={`# The actual value Python stores for 0.1
from decimal import Decimal
print(Decimal(0.1))`}
        output={`0.1000000000000000055511151231257827021181583404541015625`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-foreground/70 italic">
          When you add two slightly-off approximations of 0.1, you get an approximation
          of 0.2 that&apos;s slightly different from the closest approximation of 0.3. The
          errors compound. This is expected behavior, not a bug.
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Comparing floats correctly</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Never use <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">==</code> to
        compare floats. Use{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">math.isclose()</code>,
        which checks whether two floats are close enough to be considered equal given the
        inherent imprecision.
      </p>

      <CodeBlock
        code={`import math

a = 0.1 + 0.2
b = 0.3

print(a == b)                     # False - never use == for floats
print(math.isclose(a, b))         # True
print(math.isclose(a, b, rel_tol=1e-9))   # True - default tolerance
print(abs(a - b) < 1e-9)          # True - manual version of the same check`}
        output={`False
True
True
True`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Special float values</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Python floats can represent infinity and "not a number." These arise from
        certain operations rather than being written directly in most code.
      </p>

      <CodeBlock
        code={`import math

inf = math.inf        # positive infinity
print(inf)            # inf
print(-inf)           # -inf
print(inf + 1)        # inf — infinity absorbs addition
print(inf > 1e308)    # True — larger than any finite float

nan = math.nan        # "not a number"
print(nan)            # nan
print(nan == nan)     # False — nan is never equal to anything, even itself
print(math.isnan(nan))  # True — correct way to check

# These operations produce inf or nan
print(1.0 / 0.0)      # ZeroDivisionError for floats
print(float('inf'))   # construct from string
print(float('nan'))`}
        output={`inf
-inf
inf
True
nan
False
True
ZeroDivisionError: float division by zero
inf
nan`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Float precision in practice</h3>

      <CodeBlock
        code={`# Rounding for display — doesn't change the stored value
x = 3.141592653589793
print(round(x, 2))    # 3.14
print(f"{x:.4f}")     # "3.1416" — formatted string

# repr() shows enough digits to reconstruct the float exactly
print(repr(0.1))      # 0.1 — Python is smart about display
print(repr(0.10000000000000001))   # 0.1 — same float, same repr

# sys.float_info shows the limits of your platform's floats
import sys
print(sys.float_info.max)    # ~1.8e+308
print(sys.float_info.epsilon)  # ~2.2e-16, smallest difference from 1.0`}
        output={`3.14
3.1416
0.1
0.1
1.7976931348623157e+308
2.220446049250313e-16`}
      />
    </section>
  );
}
