import { CodeBlock } from "@/components/blog/interactive/code-block";

export function LogicalOperatorsSection() {
  return (
    <section>
      <h2 id="logical-operators" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Logical operators
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Python has three logical operators:{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">and</code>,{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">or</code>, and{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">not</code>.
        Most tutorials show them as boolean combiners — true, but the real behavior is more
        useful than that.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">
        <code className="font-mono text-primary">and</code> and{" "}
        <code className="font-mono text-primary">or</code> return values, not booleans
      </h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">and</code> returns
        the first falsy value it finds, or the last value if all are truthy.{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">or</code> returns
        the first truthy value it finds, or the last value if all are falsy. This is what
        makes short-circuit patterns work.
      </p>

      <CodeBlock
        code={`# and: returns first falsy, or last value
print(1 and 2)        # 2   - both truthy, returns last
print(0 and 2)        # 0   - 0 is falsy, returned immediately
print("" and "hi")   # ""  - "" is falsy, returned immediately

# or: returns first truthy, or last value
print(0 or 2)         # 2   - 0 is falsy, tries next, returns 2
print(1 or 2)         # 1   - 1 is truthy, returned immediately
print(0 or "")        # ""  - both falsy, returns last

# not: always returns True or False
print(not True)       # False
print(not 0)          # True
print(not "")         # True
print(not "hello")    # False`}
        output={`2
0

2
1

False
True
True
False`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Short-circuit evaluation</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Python stops evaluating as soon as the result is certain.{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">and</code> stops
        on the first falsy value.{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">or</code> stops
        on the first truthy value. Expressions to the right never run.
      </p>

      <CodeBlock
        code={`def expensive():
    print("running expensive check...")
    return True

# and: if left side is falsy, right side never runs
result = False and expensive()   # expensive() is never called
print(result)                    # False

# or: if left side is truthy, right side never runs
result = True or expensive()     # expensive() is never called
print(result)                    # True

# Practical: guard against None before accessing attributes
user = None
name = user and user.name    # safe — user.name never evaluated if user is None
print(name)                  # None`}
        output={`False
True
None`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">The default value pattern</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Because <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">or</code> returns
        the first truthy value, it&apos;s used to provide fallback defaults. This is idiomatic
        Python you&apos;ll see everywhere.
      </p>

      <CodeBlock
        code={`# Return value or a default
name = ""
display = name or "Anonymous"
print(display)    # "Anonymous"

name = "Alice"
display = name or "Anonymous"
print(display)    # "Alice"

# Function parameter defaults
def connect(host, port=None):
    port = port or 443
    print(f"Connecting to {host}:{port}")

connect("example.com")         # Connecting to example.com:443
connect("example.com", 8080)   # Connecting to example.com:8080`}
        output={`Anonymous
Alice
Connecting to example.com:443
Connecting to example.com:8080`}
      />

      <div className="border-l-2 border-warning bg-warning/5 pl-4 py-3 rounded-r-lg mt-4">
        <p className="text-[13px] text-foreground/70">
          <strong>Gotcha:</strong> the{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">or</code> default
          pattern fails when <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">0</code>,{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">False</code>, or an
          empty list are legitimate values. For example,{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">count = user_count or 0</code>{" "}
          replaces a valid{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">0</code> with{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">0</code>. In those
          cases, use an explicit{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">if value is None</code> check.
        </p>
      </div>
    </section>
  );
}
