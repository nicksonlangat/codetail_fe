import { CodeBlock } from "@/components/blog/interactive/code-block";

export function JsonSection() {
  return (
    <section>
      <h2 id="json" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        json
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Python&apos;s{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">json</code>{" "}
        module converts between Python objects and JSON text. The four functions you
        need:{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">loads</code>{" "}
        and{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">dumps</code>{" "}
        work with strings;{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">load</code>{" "}
        and{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">dump</code>{" "}
        work with file objects.
      </p>

      <CodeBlock
        code={`import json

# loads: JSON string → Python object
raw = '{"name": "Alice", "age": 30, "active": true}'
data = json.loads(raw)
print(data)          # {'name': 'Alice', 'age': 30, 'active': True}
print(type(data))    # <class 'dict'>

# dumps: Python object → JSON string
obj = {"scores": [95, 87, 91], "passed": True}
s = json.dumps(obj)
print(s)             # {"scores": [95, 87, 91], "passed": true}

# Pretty print with indentation
print(json.dumps(obj, indent=2))`}
        output={`{'name': 'Alice', 'age': 30, 'active': True}
<class 'dict'>
{"scores": [95, 87, 91], "passed": true}
{
  "scores": [
    95,
    87,
    91
  ],
  "passed": true
}`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Reading and writing files</h3>

      <CodeBlock
        code={`import json

config = {"host": "localhost", "port": 8080, "debug": False}

# Write JSON to a file
with open("config.json", "w", encoding="utf-8") as f:
    json.dump(config, f, indent=2)

# Read JSON from a file
with open("config.json", encoding="utf-8") as f:
    loaded = json.load(f)

print(loaded["port"])   # 8080`}
        output={`8080`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Type mapping</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        JSON has fewer types than Python. Know what maps to what — the differences
        bite you when you least expect it.
      </p>

      <CodeBlock
        code={`import json

# Python → JSON conversions
print(json.dumps(None))     # null
print(json.dumps(True))     # true     (lowercase!)
print(json.dumps(42))       # 42
print(json.dumps(3.14))     # 3.14
print(json.dumps("hello"))  # "hello"
print(json.dumps([1, 2]))   # [1, 2]
print(json.dumps({"a": 1})) # {"a": 1}

# tuples become arrays; sets and custom objects fail by default
print(json.dumps((1, 2)))   # [1, 2]  — tuple → array

try:
    json.dumps({1, 2})   # set is not JSON-serializable
except TypeError as e:
    print(e)`}
        output={`null
true
42
3.14
"hello"
[1, 2]
{"a": 1}
[1, 2]
Object of type set is not JSON serializable`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Custom encoders</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Subclass{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">json.JSONEncoder</code>{" "}
        to serialize types that JSON does not support natively.
      </p>

      <CodeBlock
        code={`import json
import datetime
from decimal import Decimal

class AppEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.date):
            return obj.isoformat()
        if isinstance(obj, Decimal):
            return float(obj)
        return super().default(obj)

data = {
    "created": datetime.date(2024, 3, 15),
    "price":   Decimal("19.99"),
}

print(json.dumps(data, cls=AppEncoder, indent=2))`}
        output={`{
  "created": "2024-03-15",
  "price": 19.99
}`}
      />
    </section>
  );
}
