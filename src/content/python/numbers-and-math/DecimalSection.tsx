import { CodeBlock } from "@/components/blog/interactive/code-block";

export function DecimalSection() {
  return (
    <section>
      <h2 id="decimal" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Decimal: when you need exact math
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        For money, taxes, and anything where a penny of error is unacceptable, use{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">decimal.Decimal</code>.
        It stores numbers as exact decimal values — no binary approximation.
      </p>

      <CodeBlock
        code={`from decimal import Decimal

# floats lie about money
price = 1.10
tax_rate = 0.0825
total = price * (1 + tax_rate)
print(total)                  # 1.1907500000000002 — wrong

# Decimal gives exact results
price = Decimal("1.10")       # use strings, not floats
tax_rate = Decimal("0.0825")
total = price * (1 + tax_rate)
print(total)                  # 1.19075 — correct`}
        output={`1.1907500000000002
1.19075`}
      />

      <div className="border-l-2 border-warning bg-warning/5 pl-4 py-3 rounded-r-lg mt-4 mb-6">
        <p className="text-[13px] text-foreground/70">
          Always construct Decimal from a <strong>string</strong>, not a float.{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">Decimal(0.1)</code>{" "}
          captures the imprecise float value.{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">Decimal("0.1")</code>{" "}
          gives you the exact decimal 0.1.
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Controlling precision and rounding</h3>

      <CodeBlock
        code={`from decimal import Decimal, ROUND_HALF_UP, getcontext

# Set global precision (default is 28 significant digits)
getcontext().prec = 6

result = Decimal("1") / Decimal("3")
print(result)    # 0.333333 — respects precision setting

# Round to 2 decimal places for display
price = Decimal("19.999")
rounded = price.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
print(rounded)   # 20.00

# All arithmetic operations return Decimal
a = Decimal("0.10")
b = Decimal("0.20")
print(a + b)     # 0.30 — exact`}
        output={`0.333333
20.00
0.30`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">fractions.Fraction: exact rational math</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        For exact fraction arithmetic (1/3 + 1/6 = 1/2), use{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">fractions.Fraction</code>.
        Less common than Decimal, but useful in geometry and statistics.
      </p>

      <CodeBlock
        code={`from fractions import Fraction

a = Fraction(1, 3)    # exactly 1/3
b = Fraction(1, 6)    # exactly 1/6

print(a + b)          # 1/2 — exact
print(a * b)          # 1/18
print(float(a + b))   # 0.5`}
        output={`1/2
1/18
0.5`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mt-4">
        <p className="text-[13px] text-foreground/70 italic">
          Use <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">float</code> for
          science, graphics, and performance-critical code.
          Use <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">Decimal</code> for
          money and anything that will be displayed to users as a dollar amount.
          Use <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">Fraction</code> for
          exact rational arithmetic where the denominator matters.
        </p>
      </div>
    </section>
  );
}
