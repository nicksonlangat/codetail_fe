import { CodeBlock } from "@/components/blog/interactive/code-block";
import { Term } from "@/components/blog/interactive/term";

export function CreatingDictsSection() {
  return (
    <section>
      <h2 id="creating-dicts" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Creating dictionaries
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A dictionary maps{" "}
        <Term term="key">keys</Term>{" "}
        to values. Every key is unique. Looking up a value by key takes the same
        time whether the dictionary has 10 items or 10 million, because dictionaries
        are backed by a{" "}
        <Term term="hash table">hash table</Term>.
      </p>

      <CodeBlock
        code={`# Literal syntax — most common
user = {
    "name":  "Alice",
    "age":   30,
    "admin": True,
}

# dict() constructor with keyword arguments
config = dict(host="localhost", port=5432, debug=False)

# Empty dict
cache = {}
cache = dict()

print(user["name"])    # Alice
print(config["port"])  # 5432`}
        output={`Alice
5432`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">dict.fromkeys()</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        When you need a dict with a fixed set of keys and a default value for each,{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">dict.fromkeys()</code>{" "}
        is cleaner than a loop.
      </p>

      <CodeBlock
        code={`# Initialize all scores to zero
players  = ["Alice", "Bob", "Carol"]
scores   = dict.fromkeys(players, 0)
print(scores)
# {'Alice': 0, 'Bob': 0, 'Carol': 0}

# Initialize a config with None
fields   = ["host", "port", "password"]
template = dict.fromkeys(fields)
print(template)
# {'host': None, 'port': None, 'password': None}`}
        output={`{'Alice': 0, 'Bob': 0, 'Carol': 0}
{'host': None, 'port': None, 'password': None}`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mt-2">
        <p className="text-[13px] text-foreground/70 italic">
          Do not use a mutable default like{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">
            dict.fromkeys(keys, [])
          </code>.
          All keys would share the same list object. Use a dict comprehension
          instead:{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">
            {"{ k: [] for k in keys }"}
          </code>.
        </p>
      </div>
    </section>
  );
}
