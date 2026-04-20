import { CodeBlock } from "@/components/blog/interactive/code-block";
import { InteractiveDictLookup } from "@/components/blog/interactive/interactive-dict-lookup";

export function AccessingSection() {
  return (
    <section>
      <h2 id="accessing" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Accessing values
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Square bracket access is the direct way to read a value. It is fast and readable.
        The cost is that it raises a{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">KeyError</code>{" "}
        if the key does not exist. When you are not sure if a key is present,{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">.get()</code>{" "}
        is safer.
      </p>

      <CodeBlock
        code={`config = {"host": "localhost", "port": 5432}

# Direct access — fast, but raises KeyError if missing
print(config["host"])     # localhost

# .get() — returns None if key is absent
print(config.get("user"))           # None
print(config.get("user", "root"))   # root  (custom default)

# Check membership before accessing
if "port" in config:
    print(config["port"])           # 5432

# KeyError example
config["missing"]   # KeyError: 'missing'`}
        output={`localhost
None
root
5432`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">setdefault()</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">.setdefault(key, default)</code>{" "}
        returns the value if the key exists and inserts the default if it does not.
        It is the one-liner for the common pattern of{" "}
        &quot;give me the value, or insert and return this default.&quot;
      </p>

      <CodeBlock
        code={`# Building a grouped dict without setdefault
groups = {}
items  = [("fruit", "apple"), ("veg", "carrot"), ("fruit", "banana")]

for category, item in items:
    if category not in groups:
        groups[category] = []
    groups[category].append(item)

# With setdefault — same result, less code
groups = {}
for category, item in items:
    groups.setdefault(category, []).append(item)

print(groups)
# {'fruit': ['apple', 'banana'], 'veg': ['carrot']}`}
        output={`{'fruit': ['apple', 'banana'], 'veg': ['carrot']}`}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-6 mb-4">
        Try the lookup modes below. Keys marked with{" "}
        <code className="font-mono text-[12px] bg-muted px-1.5 py-0.5 rounded">?</code>{" "}
        are not in the dict. Switch between{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">d["key"]</code>{" "}
        and{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">d.get("key")</code>{" "}
        to see the difference.
      </p>

      <InteractiveDictLookup />
    </section>
  );
}
