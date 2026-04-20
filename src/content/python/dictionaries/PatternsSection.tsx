import { CodeBlock } from "@/components/blog/interactive/code-block";

export function PatternsSection() {
  return (
    <section>
      <h2 id="patterns" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Real-world patterns
      </h2>

      <h3 className="text-base font-semibold mb-3">Grouping records</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The most common dict pattern: start with a flat list, group it by some attribute.
        A{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">defaultdict(list)</code>{" "}
        or{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">setdefault</code>{" "}
        both work.
      </p>

      <CodeBlock
        code={`from collections import defaultdict

employees = [
    {"name": "Alice", "dept": "Engineering"},
    {"name": "Bob",   "dept": "Design"},
    {"name": "Carol", "dept": "Engineering"},
    {"name": "Dan",   "dept": "Design"},
]

by_dept = defaultdict(list)
for e in employees:
    by_dept[e["dept"]].append(e["name"])

print(dict(by_dept))
# {'Engineering': ['Alice', 'Carol'], 'Design': ['Bob', 'Dan']}`}
        output={`{'Engineering': ['Alice', 'Carol'], 'Design': ['Bob', 'Dan']}`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Memoization / caching</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Store results you have already computed so you never redo expensive work. A dict
        keyed by the function&apos;s arguments is the simplest cache.
      </p>

      <CodeBlock
        code={`def fib(n: int, cache: dict = {}) -> int:
    if n in cache:
        return cache[n]
    if n <= 1:
        return n
    result      = fib(n - 1) + fib(n - 2)
    cache[n]    = result
    return result

print([fib(i) for i in range(10)])
# [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

# functools.lru_cache does this automatically and is preferred
from functools import lru_cache

@lru_cache(maxsize=None)
def fib2(n: int) -> int:
    if n <= 1:
        return n
    return fib2(n - 1) + fib2(n - 2)`}
        output={`[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Safe nested access</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Deeply nested dicts are common in API responses. Chaining{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">.get()</code>{" "}
        avoids{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">KeyError</code>{" "}
        at every level.
      </p>

      <CodeBlock
        code={`response = {
    "user": {
        "profile": {
            "city": "Berlin",
        }
    }
}

# Unsafe — any missing key raises KeyError
# city = response["user"]["profile"]["city"]

# Safe — returns None at the first missing key
city = (response
        .get("user", {})
        .get("profile", {})
        .get("city"))

print(city)    # Berlin

missing = (response
           .get("user", {})
           .get("address", {})
           .get("zip"))

print(missing)   # None`}
        output={`Berlin
None`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Dispatch table</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Replace long if-elif chains with a dict that maps keys to callables. Cleaner,
        easier to extend, and lookups are O(1).
      </p>

      <CodeBlock
        code={`def handle_create(data):  return f"created {data}"
def handle_update(data):  return f"updated {data}"
def handle_delete(data):  return f"deleted {data}"

handlers = {
    "CREATE": handle_create,
    "UPDATE": handle_update,
    "DELETE": handle_delete,
}

def dispatch(action: str, data: str) -> str:
    handler = handlers.get(action)
    if handler is None:
        return f"unknown action: {action}"
    return handler(data)

print(dispatch("CREATE", "user-42"))   # created user-42
print(dispatch("DELETE", "post-7"))    # deleted post-7
print(dispatch("RESET",  "db"))        # unknown action: RESET`}
        output={`created user-42
deleted post-7
unknown action: RESET`}
      />
    </section>
  );
}
