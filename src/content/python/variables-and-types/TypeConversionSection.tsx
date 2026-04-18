import { CodeBlock } from "@/components/blog/interactive/code-block";

export function TypeConversionSection() {
  return (
    <section>
      <h2 id="type-conversion" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Checking and converting types
      </h2>

      <h3 className="text-base font-semibold mt-8 mb-3">Checking types</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        You have two tools:{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">type()</code> returns
        the exact type.{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">isinstance()</code>{" "}
        checks whether an object is an instance of a type or any of its subclasses. Use
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded mx-1">isinstance()</code>
        almost everywhere.
      </p>

      <CodeBlock
        code={`x = True

# type() checks the exact type
print(type(x) == bool)    # True
print(type(x) == int)     # False — even though True is stored as 1

# isinstance() checks the type and its parents
print(isinstance(x, bool))   # True
print(isinstance(x, int))    # Also True — bool is a subclass of int

# isinstance() handles multiple types at once
def process(value):
    if isinstance(value, (int, float)):
        return value * 2
    if isinstance(value, str):
        return value.upper()

print(process(5))       # 10
print(process("hi"))    # "HI"`}
        output={`True
False
True
True
10
HI`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Converting types</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Python won&apos;t silently convert types for you. When you need a different type, you
        ask for it explicitly.
      </p>

      <CodeBlock
        code={`# str → int
int("42")       # 42
int("  10  ")   # 10 — strips whitespace

# str → float
float("3.14")   # 3.14

# number → str
str(42)         # "42"
str(3.14)       # "3.14"

# int ↔ float
int(3.9)        # 3 — truncates toward zero, does NOT round
float(7)        # 7.0

# anything → bool
bool(1)         # True
bool(0)         # False
bool("hello")   # True
bool("")        # False — empty string is falsy
bool([1, 2])    # True
bool([])        # False — empty list is falsy`}
      />

      <div className="border-l-2 border-warning bg-warning/5 pl-4 py-3 rounded-r-lg mt-4 mb-6">
        <p className="text-[13px] text-foreground/70">
          <strong>Gotcha:</strong>{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">int(3.9)</code> is{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">3</code>, not{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">4</code>. It
          truncates toward zero, not rounds. Use{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">round(3.9)</code> if
          you want rounding.
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Conversions that fail</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Not every conversion makes sense. Python raises an exception rather than silently
        producing a wrong result.
      </p>

      <CodeBlock
        code={`int("hello")    # ValueError: invalid literal for int()
int("3.14")     # ValueError — use float() first, then int()
int(None)       # TypeError: int() argument must be a string or number

# The safe pattern: try/except
def safe_int(value):
    try:
        return int(value)
    except (ValueError, TypeError):
        return None

print(safe_int("42"))      # 42
print(safe_int("hello"))   # None
print(safe_int(None))      # None`}
        output={`42
None
None`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Truthiness: what counts as True</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Every Python object has a boolean interpretation. You don&apos;t have to write{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">if len(items) &gt; 0</code>{" "}
        — you can write{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">if items</code>.
        The rule is simple: empty and zero-like values are falsy, everything else is truthy.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground/50 mb-3">
            Falsy values
          </p>
          <div className="space-y-1.5">
            {[
              ["False", "the boolean False"],
              ["None", "no value"],
              ["0", "zero integer"],
              ["0.0", "zero float"],
              ['""', "empty string"],
              ["[]", "empty list"],
              ["{}", "empty dict"],
              ["set()", "empty set"],
            ].map(([val, desc]) => (
              <div key={val} className="flex items-center gap-2">
                <code className="font-mono text-[12px] text-foreground/70 w-16 flex-shrink-0">{val}</code>
                <span className="text-[11px] text-muted-foreground">{desc}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground/50 mb-3">
            Truthy values
          </p>
          <div className="space-y-1.5">
            {[
              ["True", "the boolean True"],
              ["1", "any non-zero int"],
              ['"hello"', "any non-empty string"],
              ["[0]", "list with items (even if 0)"],
              ["{'a': 1}", "dict with items"],
              ["{0}", "set with items"],
              ["object()", "any object instance"],
            ].map(([val, desc]) => (
              <div key={val} className="flex items-center gap-2">
                <code className="font-mono text-[12px] text-primary/80 w-20 flex-shrink-0">{val}</code>
                <span className="text-[11px] text-muted-foreground">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CodeBlock
        code={`items = []
if items:
    print("has items")
else:
    print("empty")         # this runs

name = "  "
if name.strip():
    print("has name")
else:
    print("blank name")    # this runs — "  ".strip() → ""

# Common pattern: default value
user_input = ""
display = user_input or "Anonymous"
print(display)             # "Anonymous"`}
        output={`empty
blank name
Anonymous`}
      />
    </section>
  );
}
