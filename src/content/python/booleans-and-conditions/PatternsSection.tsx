import { CodeBlock } from "@/components/blog/interactive/code-block";

export function PatternsSection() {
  return (
    <section>
      <h2 id="real-world-patterns" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Real-world patterns
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Conditional logic you&apos;ll write constantly — and the cleaner way to write it.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Guard clauses: exit early</h3>
      <p className="text-[14px] text-foreground/80 mb-3">
        Handle error cases and edge cases at the top of a function, then write the happy path
        without nesting. Deeply nested conditions are hard to read. Flat is better.
      </p>
      <CodeBlock
        code={`# Nested — hard to follow
def process_order(order):
    if order is not None:
        if order.items:
            if order.total > 0:
                # actual logic buried three levels deep
                return order.submit()

# Flat with guard clauses — easy to follow
def process_order(order):
    if order is None:
        return None
    if not order.items:
        return None
    if order.total <= 0:
        return None
    return order.submit()`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">all() and any()</h3>
      <p className="text-[14px] text-foreground/80 mb-3">
        Check conditions across a collection without writing a loop.{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">all()</code> returns
        True if every item is truthy.{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">any()</code> returns
        True if at least one is. Both short-circuit.
      </p>
      <CodeBlock
        code={`scores = [88, 92, 74, 95, 81]

# Did everyone pass?
print(all(s >= 60 for s in scores))    # True

# Did anyone get a perfect score?
print(any(s == 100 for s in scores))   # False

# Validate a form — all fields filled?
fields = {"name": "Alice", "email": "alice@example.com", "age": ""}
print(all(fields.values()))            # False - "age" is empty

# Check file extensions
files = ["report.pdf", "data.csv", "image.png"]
all_docs = all(f.endswith((".pdf", ".doc", ".txt")) for f in files)
print(all_docs)    # False`}
        output={`True
False
False
False`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Conditional imports</h3>
      <CodeBlock
        code={`import sys

# Use different implementations depending on Python version
if sys.version_info >= (3, 11):
    import tomllib
else:
    try:
        import tomllib
    except ImportError:
        import tomli as tomllib   # fallback library

# Platform-specific code
if sys.platform == "win32":
    import winreg
else:
    winreg = None`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Conditions that read like English</h3>
      <p className="text-[14px] text-foreground/80 mb-3">
        Python&apos;s operators are words, which lets you write conditions that read almost
        like prose. Prefer readable over clever.
      </p>
      <CodeBlock
        code={`age = 25
is_member = True
has_coupon = False

# Hard to read
if (age >= 18 and age <= 65) and (is_member or has_coupon):
    apply_discount()

# Cleaner with named variables
is_eligible_age = 18 <= age <= 65
has_discount_access = is_member or has_coupon

if is_eligible_age and has_discount_access:
    apply_discount()

# Python reads naturally
items = ["apple", "banana", "cherry"]
if "banana" in items and len(items) > 2:
    print("found banana in a full cart")`}
        output={`found banana in a full cart`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Avoid comparing to True or False</h3>
      <CodeBlock
        code={`is_active = True

# Redundant — don't do this
if is_active == True:
    print("active")

# Idiomatic
if is_active:
    print("active")

# For explicit None checks, is/is not is the right tool
value = None

if value is None:     # correct
    print("no value")
if not value:         # wrong — also catches 0, "", [], etc.
    print("falsy")`}
        output={`active
no value
no value
falsy`}
      />
    </section>
  );
}
