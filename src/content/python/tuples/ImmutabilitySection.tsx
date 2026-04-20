import { CodeBlock } from "@/components/blog/interactive/code-block";
import { InteractiveMutability } from "@/components/blog/interactive/interactive-mutability";

export function ImmutabilitySection() {
  return (
    <section>
      <h2 id="immutability" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Immutability
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A tuple is immutable. Once created, you cannot change its contents. You cannot
        add items, remove items, or replace an item at a given index. Any attempt raises
        a{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">TypeError</code>.
      </p>

      <CodeBlock
        code={`t = (1, 2, 3)

t[0] = 99       # TypeError: 'tuple' object does not support item assignment
t.append(4)     # AttributeError: 'tuple' object has no attribute 'append'
del t[0]        # TypeError: 'tuple' object doesn't support item deletion`}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-6 mb-4">
        Reading, slicing, and searching all work the same as with lists.
      </p>

      <CodeBlock
        code={`t = (10, 20, 30, 40, 50)

print(t[0])          # 10
print(t[-1])         # 50
print(t[1:3])        # (20, 30)
print(30 in t)       # True
print(len(t))        # 5
print(t.count(20))   # 1
print(t.index(40))   # 3`}
        output={`10
50
(20, 30)
True
5
1
3`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">The mutable-inside gotcha</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A tuple cannot be changed, but if it contains a mutable object, that object can
        still be changed. The tuple holds a reference to the object, not a frozen copy
        of it. This surprises people, and it is worth understanding clearly.
      </p>

      <CodeBlock
        code={`t = ([1, 2], [3, 4])   # a tuple of two lists

# The tuple itself is immutable
# t[0] = [9, 9]  # TypeError — can't reassign the reference

# But the list inside can be mutated
t[0].append(99)
print(t)               # ([1, 2, 99], [3, 4])
print(t[0])            # [1, 2, 99]`}
        output={`([1, 2, 99], [3, 4])
[1, 2, 99]`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mt-2 mb-6">
        <p className="text-[13px] text-foreground/70 italic">
          Immutability means the tuple&apos;s references cannot change. The objects those
          references point to follow their own rules. A tuple of lists is not deeply frozen.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Try the operations below to see exactly what a tuple allows and what it blocks.
      </p>

      <InteractiveMutability />
    </section>
  );
}
