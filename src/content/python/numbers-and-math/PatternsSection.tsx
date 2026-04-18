import { CodeBlock } from "@/components/blog/interactive/code-block";

export function PatternsSection() {
  return (
    <section>
      <h2 id="real-world-patterns" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Real-world patterns
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        The numeric operations you&apos;ll reach for constantly in production.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Clamp a value to a range</h3>
      <p className="text-[14px] text-foreground/80 mb-3">
        Keep a value between a minimum and maximum. Common in UI (slider values, opacity),
        game logic (health points), and input validation.
      </p>
      <CodeBlock
        code={`def clamp(value, low, high):
    return max(low, min(high, value))

print(clamp(5, 0, 10))    # 5   — already in range
print(clamp(-3, 0, 10))   # 0   — below min, snapped to 0
print(clamp(15, 0, 10))   # 10  — above max, snapped to 10

# Python 3.9+ has math.clamped equivalent in many contexts
# but the above is idiomatic and clear`}
        output={`5
0
10`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Percentage calculations</h3>
      <CodeBlock
        code={`original = 120
discounted = 90

# What percentage is discounted of original?
pct = (discounted / original) * 100
print(f"{pct:.1f}%")    # 75.0%

# How much was discounted?
saving_pct = ((original - discounted) / original) * 100
print(f"Saved {saving_pct:.0f}%")   # Saved 25%

# Apply a percentage increase
price = 100
markup = 1.15   # 15% markup
print(price * markup)    # 115.0`}
        output={`75.0%
Saved 25%
115.0`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Safe division</h3>
      <p className="text-[14px] text-foreground/80 mb-3">
        Division by zero raises an exception. Guard against it when the denominator comes
        from user input or data.
      </p>
      <CodeBlock
        code={`def safe_divide(a, b, fallback=0):
    return a / b if b != 0 else fallback

print(safe_divide(10, 2))     # 5.0
print(safe_divide(10, 0))     # 0
print(safe_divide(10, 0, fallback=None))  # None`}
        output={`5.0
0
None`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Format numbers for display</h3>
      <CodeBlock
        code={`# Thousands separator
print(f"{1_234_567:,}")        # 1,234,567
print(f"{1_234_567.89:,.2f}") # 1,234,567.89

# Fixed decimal places
print(f"{3.14159:.2f}")        # 3.14
print(f"{0.0042:.4f}")         # 0.0042
print(f"{0.0042:.2e}")         # 4.20e-03 — scientific notation

# Padding for alignment
for n in [1, 10, 100, 1000]:
    print(f"{n:>6,}")           # right-aligned, 6 wide`}
        output={`1,234,567
1,234,567.89
3.14
0.0042
4.20e-03
     1
    10
   100
 1,000`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Integer math tricks</h3>
      <CodeBlock
        code={`# Check if a number is a power of two
def is_power_of_two(n):
    return n > 0 and (n & (n - 1)) == 0

print(is_power_of_two(8))     # True
print(is_power_of_two(10))    # False

# Count digits without converting to string
import math
def count_digits(n):
    return math.floor(math.log10(abs(n))) + 1 if n != 0 else 1

print(count_digits(12345))    # 5
print(count_digits(0))        # 1

# Round up to the nearest multiple
def round_up_to(n, multiple):
    return math.ceil(n / multiple) * multiple

print(round_up_to(23, 5))     # 25
print(round_up_to(20, 5))     # 20`}
        output={`True
False
5
1
25
20`}
      />
    </section>
  );
}
