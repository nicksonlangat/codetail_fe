import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ModifyingSection() {
  return (
    <section>
      <h2 id="modifying-sets" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Modifying sets
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Sets are mutable. You can add and remove elements after creation. The in-place
        operators (
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">|=</code>,{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">&=</code>,{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">-=</code>,{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">^=</code>)
        update a set in place.
      </p>

      <CodeBlock
        code={`s = {1, 2, 3}

# add() — adds one element, no-op if already present
s.add(4)
s.add(2)          # duplicate — silently ignored
print(s)          # {1, 2, 3, 4}

# remove() — raises KeyError if missing
s.remove(4)
print(s)          # {1, 2, 3}

# discard() — same as remove, but never raises
s.discard(99)     # no error even though 99 is not in s
print(s)          # {1, 2, 3}

# pop() — removes and returns an arbitrary element
item = s.pop()
print(item)       # 1 (or any element — order is undefined)

# clear() — empties the set
s.clear()
print(s)          # set()`}
        output={`{1, 2, 3, 4}
{1, 2, 3}
{1, 2, 3}
1
set()`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">In-place operations</h3>

      <CodeBlock
        code={`permissions = {"read", "write"}

# |= union update — add all items from another set
permissions |= {"delete", "admin"}
print(permissions)     # {'read', 'write', 'delete', 'admin'}

# -= difference update — remove items found in another set
permissions -= {"admin"}
print(permissions)     # {'read', 'write', 'delete'}

# &= intersection update — keep only shared items
permissions &= {"read", "write", "execute"}
print(permissions)     # {'read', 'write'}

# update() accepts any iterable (like |= but more flexible)
permissions.update(["append", "read"])
print(permissions)     # {'read', 'write', 'append'}`}
        output={`{'read', 'write', 'delete', 'admin'}
{'read', 'write', 'delete'}
{'read', 'write'}
{'read', 'write', 'append'}`}
      />
    </section>
  );
}
