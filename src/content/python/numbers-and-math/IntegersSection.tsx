import { CodeBlock } from "@/components/blog/interactive/code-block";

export function IntegersSection() {
  return (
    <section>
      <h2 id="integers" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Integers
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Python integers are exact and have no upper bound. Most languages give you a fixed
        number of bits (32 or 64) and overflow silently. Python integers grow as large as your
        memory allows.
      </p>

      <CodeBlock
        code={`# No overflow in Python
x = 2 ** 64
print(x)          # 18446744073709551616 — bigger than any 64-bit int

# Factorial of 100 — try this in C
import math
print(math.factorial(100))
# 93326215443944152681699238856266700490715968264381621468592963895217599993229915608941463976156518286253697920827223758251185210916864000000000000000000000000`}
        output={`18446744073709551616
93326215443944152681699238856266700490715968264381621468592963895217599993229915608941463976156518286253697920827223758251185210916864000000000000000000000000`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Integer literals</h3>
      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Python lets you write integer literals in four bases. All four produce the same kind
        of object — the base only affects how you write the number, not how Python stores it.
      </p>

      <CodeBlock
        code={`decimal = 255          # base 10 (default)
hexadecimal = 0xFF     # base 16 — common for colors, bitmasks
octal = 0o377          # base 8 — file permissions (chmod 644)
binary = 0b11111111    # base 2 — bitwise operations

print(decimal == hexadecimal == octal == binary)   # True — all 255
print(hex(255))    # '0xff'
print(bin(255))    # '0b11111111'
print(oct(255))    # '0o377'`}
        output={`True
0xff
0b11111111
0o377`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Underscore separators</h3>
      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Underscores in numeric literals are ignored by Python. Use them to make large numbers
        readable — the same way you&apos;d use commas in prose.
      </p>

      <CodeBlock
        code={`population = 8_100_000_000     # 8.1 billion — easy to read
max_int_32 = 2_147_483_647     # clear grouping
hex_color = 0xFF_A5_00         # orange in hex — grouped by channel

print(population)    # 8100000000 — underscores stripped`}
        output={`8100000000`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Bitwise operators</h3>
      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Python supports bitwise operations on integers. You&apos;ll use these for flags,
        permissions, and low-level data manipulation.
      </p>

      <CodeBlock
        code={`a = 0b1010   # 10
b = 0b1100   # 12

print(bin(a & b))    # AND:  0b1000 (8)  — bits set in both
print(bin(a | b))    # OR:   0b1110 (14) — bits set in either
print(bin(a ^ b))    # XOR:  0b0110 (6)  — bits set in exactly one
print(bin(~a))       # NOT:  -0b1011     — flip all bits
print(bin(a << 1))   # left shift:  0b10100 (20) — multiply by 2
print(bin(a >> 1))   # right shift: 0b0101  (5)  — divide by 2`}
        output={`0b1000
0b1110
0b110
-0b1011
0b10100
0b101`}
      />
    </section>
  );
}
