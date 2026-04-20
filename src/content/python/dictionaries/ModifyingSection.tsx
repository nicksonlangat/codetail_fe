import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ModifyingSection() {
  return (
    <section>
      <h2 id="modifying" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Modifying dictionaries
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Dicts are mutable. Assignment adds or updates a key. Deletion removes one.
        These operations are all O(1).
      </p>

      <CodeBlock
        code={`user = {"name": "Alice", "age": 30}

# Add a new key
user["email"] = "alice@example.com"

# Update an existing key
user["age"] = 31

# Delete a key
del user["email"]

# pop() removes and returns the value
age = user.pop("age")
print(age)     # 31
print(user)    # {'name': 'Alice'}

# pop() with a default avoids KeyError
role = user.pop("role", "viewer")
print(role)    # viewer`}
        output={`31
{'name': 'Alice'}
viewer`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Merging dicts</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Python 3.9 introduced the{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">|</code>{" "}
        operator for merging two dicts into a new one. The{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">|=</code>{" "}
        operator updates in place. For older Python, use{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">.update()</code>.
        In all cases, the right-hand dict wins on key conflicts.
      </p>

      <CodeBlock
        code={`defaults = {"theme": "dark", "lang": "en", "timeout": 30}
overrides = {"lang": "fr", "timeout": 60}

# | creates a new dict (Python 3.9+)
config = defaults | overrides
print(config)
# {'theme': 'dark', 'lang': 'fr', 'timeout': 60}

# .update() modifies in place (all Python versions)
defaults.update(overrides)
print(defaults)
# {'theme': 'dark', 'lang': 'fr', 'timeout': 60}

# Original defaults are modified — use | if you need to preserve them`}
        output={`{'theme': 'dark', 'lang': 'fr', 'timeout': 60}
{'theme': 'dark', 'lang': 'fr', 'timeout': 60}`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Useful methods</h3>

      <CodeBlock
        code={`d = {"a": 1, "b": 2, "c": 3}

# popitem() removes and returns the last inserted item
key, val = d.popitem()
print(key, val)    # c 3

# clear() empties the dict
d.clear()
print(d)           # {}

# copy() creates a shallow copy
original = {"x": [1, 2]}
shallow  = original.copy()
shallow["x"].append(3)
print(original)    # {'x': [1, 2, 3]} — inner list is shared`}
        output={`c 3
{}
{'x': [1, 2, 3]}`}
      />
    </section>
  );
}
