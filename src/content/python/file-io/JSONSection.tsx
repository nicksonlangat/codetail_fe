import { CodeBlock } from "@/components/blog/interactive/code-block";
import { InteractiveJSON } from "@/components/blog/interactive/interactive-json";

export function JSONSection() {
  return (
    <section>
      <h2 id="json" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        JSON files
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Python&apos;s{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">json</code>{" "}
        module serialises Python objects to JSON strings and back. The four functions
        you need:{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">dump</code>{" "}
        (to file),{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">dumps</code>{" "}
        (to string),{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">load</code>{" "}
        (from file),{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">loads</code>{" "}
        (from string).
      </p>

      <CodeBlock
        code={`import json

# Write to a file
config = {"host": "localhost", "port": 5432, "debug": False}
with open("config.json", "w", encoding="utf-8") as f:
    json.dump(config, f, indent=2)

# Read from a file
with open("config.json", encoding="utf-8") as f:
    loaded = json.load(f)
print(loaded["port"])    # 5432

# Serialise to/from strings (e.g. for HTTP responses)
json_str = json.dumps(config, indent=2)
print(type(json_str))    # <class 'str'>

back = json.loads(json_str)
print(type(back))        # <class 'dict'>`}
        output={`5432
<class 'str'>
<class 'dict'>`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Type mapping</h3>

      <CodeBlock
        code={`# Python  →  JSON
# dict    →  object  {}
# list    →  array   []
# tuple   →  array   []   (round-trips as list)
# str     →  string  ""
# int     →  number
# float   →  number
# True    →  true
# False   →  false
# None    →  null

data = {"items": (1, 2, 3), "flag": True, "value": None}
print(json.dumps(data))
# {"items": [1, 2, 3], "flag": true, "value": null}

# json cannot serialise: sets, datetimes, custom classes
import datetime
# json.dumps(datetime.date.today())   # TypeError

# Fix: convert manually or use a custom encoder
print(json.dumps(datetime.date.today(), default=str))
# "2024-01-15"`}
        output={`{"items": [1, 2, 3], "flag": true, "value": null}
"2024-01-15"`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Useful options</h3>

      <CodeBlock
        code={`data = {"z": 3, "a": 1, "m": 2}

# sort_keys — deterministic output (good for testing and diffs)
print(json.dumps(data, sort_keys=True))
# {"a": 1, "m": 2, "z": 3}

# indent — human-readable formatting
print(json.dumps(data, indent=2))
# {
#   "z": 3,
#   "a": 1,
#   "m": 2
# }

# ensure_ascii=False — keep Unicode characters as-is
print(json.dumps({"city": "Zürich"}, ensure_ascii=False))
# {"city": "Zürich"}`}
        output={`{"a": 1, "m": 2, "z": 3}
{
  "z": 3,
  "a": 1,
  "m": 2
}
{"city": "Zürich"}`}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-6 mb-4">
        See how Python objects serialise to JSON and back, with different indent settings.
      </p>

      <InteractiveJSON />
    </section>
  );
}
