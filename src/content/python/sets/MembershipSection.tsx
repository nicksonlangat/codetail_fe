import { CodeBlock } from "@/components/blog/interactive/code-block";

export function MembershipSection() {
  return (
    <section>
      <h2 id="membership" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Membership testing
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">in</code>{" "}
        operator is the main reason to reach for a set. Checking whether an item exists
        in a list is O(n) — Python scans every element until it finds a match or runs
        out of items. Checking membership in a set is O(1) — the hash is computed once
        and Python jumps directly to the right slot.
      </p>

      <CodeBlock
        code={`banned = {"spam", "abuse", "malware"}

# O(1) — same speed for 3 items or 3 million
print("spam"    in banned)   # True
print("python"  in banned)   # False
print("malware" not in banned)  # False

# Lists use O(n) linear scan — slower for large collections
banned_list = ["spam", "abuse", "malware"]
print("spam" in banned_list)  # True — but scans from the start`}
        output={`True
False
False
True`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">When to use a set for lookups</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        If you have a fixed collection and need to test membership repeatedly, convert it
        to a set once. The upfront cost is paid back immediately on the first lookup.
      </p>

      <CodeBlock
        code={`import time

items = list(range(1_000_000))
items_set = set(items)
target = 999_999

# List lookup — scans up to 1M elements
start = time.perf_counter()
found = target in items
list_time = time.perf_counter() - start

# Set lookup — O(1) hash check
start = time.perf_counter()
found = target in items_set
set_time = time.perf_counter() - start

print(f"list: {list_time * 1000:.3f} ms")
print(f"set:  {set_time * 1000:.3f} ms")`}
        output={`list: 8.241 ms
set:  0.001 ms`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Subset and superset tests</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Sets support subset and superset comparisons with operators and methods. These
        are more expressive than manually checking every element.
      </p>

      <CodeBlock
        code={`required = {"read", "write"}
user_perms = {"read", "write", "delete"}

# Is required a subset of user_perms?
print(required <= user_perms)           # True  (required ⊆ user_perms)
print(required.issubset(user_perms))    # True

# Is user_perms a superset of required?
print(user_perms >= required)           # True
print(user_perms.issuperset(required))  # True

# Disjoint — no elements in common
admin = {"sudo", "root"}
print(required.isdisjoint(admin))       # True`}
        output={`True
True
True
True
True`}
      />
    </section>
  );
}
