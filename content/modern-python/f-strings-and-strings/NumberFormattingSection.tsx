import { CodeBlock } from "@/components/blog/interactive/code-block";

export function NumberFormattingSection() {
  return (
    <section>
      <h2
        id="number-formatting"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Number formatting in f-strings
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        f-strings inherit the full format spec from{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          str.format()
        </code>
        , which means you can express complex number formatting without importing anything.
      </p>

      <CodeBlock
        code={`revenue = 1_234_567.89
ratio = 0.04267
count = 42

# Thousands separator
print(f"{revenue:,.2f}")    # 1,234,567.89

# Percentage
print(f"{ratio:.1%}")       # 4.3%

# Zero-padded integers
print(f"{count:05d}")       # 00042

# Scientific notation
print(f"{revenue:e}")       # 1.234568e+06

# Right-aligned in a field
for label, val in [("sales", 1234), ("returns", 56), ("net", 1178)]:
    print(f"{label:>10}: {val:>6,}")`}
        output={`1,234,567.89
4.3%
00042
1.234568e+06
     sales:  1,234
   returns:     56
       net:  1,178`}
      />

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Underscore separators in numeric literals (3.6)
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Not technically a string feature, but pairs naturally with number formatting. Underscores
        in numeric literals are purely cosmetic and ignored by Python:
      </p>

      <CodeBlock
        code={`# Old: squinting at digit groups
max_connections = 1000000
file_size_bytes = 10485760

# Modern: visual grouping
max_connections = 1_000_000
file_size_bytes = 10_485_760

# Works for hex, binary, octal too
color = 0xFF_A5_00       # orange as hex
flags = 0b0001_1100      # binary nibble grouping

print(f"connections: {max_connections:,}")   # 1,000,000
print(f"hex: {color:#010x}")                # 0x00ffa500`}
        output={`connections: 1,000,000
hex: 0x00ffa500`}
      />
    </section>
  );
}
