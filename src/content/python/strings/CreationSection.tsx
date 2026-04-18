import { CodeBlock } from "@/components/blog/interactive/code-block";

export function CreationSection() {
  return (
    <section>
      <h2 id="creating-strings" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Creating strings
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Python gives you four ways to write string literals, each with a practical reason to exist.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Single and double quotes</h3>
      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        They&apos;re interchangeable. Pick one style and be consistent. The only reason to mix
        them is to avoid backslash escapes:
      </p>
      <CodeBlock
        code={`name = 'Alice'
msg  = "Hello, world!"

# Avoid escaping by choosing the right outer quote
quote = "It's a beautiful day"    # single quote inside, no escape
html  = 'She said "hello"'        # double quote inside, no escape`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Triple quotes</h3>
      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        For multi-line strings. Newlines and indentation are preserved literally. Useful for
        SQL queries, HTML templates, and docstrings.
      </p>
      <CodeBlock
        code={`sql = """
    SELECT id, name
    FROM users
    WHERE active = true
    ORDER BY name
"""

haiku = '''
An old silent pond...
A frog jumps into the pond.
Splash! Silence again.
'''`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Raw strings</h3>
      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Prefix with{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">r</code> to treat
        backslashes literally. Essential for Windows file paths and regex patterns.
      </p>
      <CodeBlock
        code={`# Without raw, backslash is an escape sequence
path = "C:\\Users\\alice\\Documents"   # ugly, error-prone

# With raw, backslash is just a backslash
path = r"C:\Users\alice\Documents"   # clean

# Regex without raw requires four backslashes for \\d
import re
pattern = r"\d+"   # matches one or more digits`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">f-strings (Python 3.6+)</h3>
      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mb-4">
        <p className="text-[13px] text-foreground/70 italic">
          If you&apos;re building strings with dynamic content and you&apos;re not using f-strings,
          you&apos;re doing it the hard way. They&apos;re the clearest and fastest option Python has.
        </p>
      </div>
      <CodeBlock
        code={`name = "Alice"
age  = 30

# Old approaches (avoid these)
greeting = "Hello, " + name + ". You are " + str(age) + " years old."
greeting = "Hello, %s. You are %d years old." % (name, age)

# f-string (use this)
greeting = f"Hello, {name}. You are {age} years old."

# Expressions work inside {}
print(f"Next year: {age + 1}")
print(f"Uppercase: {name.upper()}")
print(f"Pi: {3.14159:.2f}")       # format spec inside the braces`}
        output={`Next year: 31
Uppercase: ALICE
Pi: 3.14`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">str() constructor</h3>
      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Converts any object to its string representation. You&apos;ll use this when joining
        non-string values into a string.
      </p>
      <CodeBlock
        code={`str(42)         # "42"
str(3.14)       # "3.14"
str(True)       # "True"
str([1, 2, 3])  # "[1, 2, 3]"
str(None)       # "None"

# join() requires strings, so convert first
nums = [1, 2, 3, 4, 5]
print(", ".join(str(n) for n in nums))`}
        output={`1, 2, 3, 4, 5`}
      />
    </section>
  );
}
