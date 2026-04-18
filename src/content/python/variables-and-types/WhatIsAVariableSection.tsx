import { CodeBlock } from "@/components/blog/interactive/code-block";

export function WhatIsAVariableSection() {
  return (
    <section>
      <h2 id="names-not-boxes" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Names, not boxes
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Most programming tutorials describe variables as "boxes that store values." That mental
        model works for a while, then breaks in confusing ways. Python's model is different.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        In Python, a variable is a <strong>name bound to an object</strong>. Think of it as a
        sticky note you put on an object, not a box you pour a value into. The object lives
        somewhere in memory. The variable is just a label pointing to it.
      </p>

      <CodeBlock
        code={`x = 42`}
        output={``}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-4 mb-4">
        This line does two things: creates an integer object with value 42, then binds the name
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded mx-1">x</code>
        to it. The object exists independently. The name is just how you refer to it.
      </p>

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-foreground/70 italic">
          A variable is a sticky note on an object. Multiple sticky notes can point to the same
          object. Moving a sticky note doesn&apos;t change the object.
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Where this matters: aliasing</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        When you assign one variable to another, you get two names pointing to the same object,
        not two copies. This is called <strong>aliasing</strong>, and it surprises almost every
        new Python programmer at some point.
      </p>

      <CodeBlock
        code={`a = [1, 2, 3]
b = a           # b points to the SAME list, not a copy

b.append(4)
print(a)        # [1, 2, 3, 4] - a sees the change
print(b)        # [1, 2, 3, 4]
print(a is b)   # True - same object`}
        output={`[1, 2, 3, 4]
[1, 2, 3, 4]
True`}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-6 mb-4">
        Both names point to the same list, so a change through either name is visible from both.
        If you want a copy, you have to ask for one explicitly.
      </p>

      <CodeBlock
        code={`a = [1, 2, 3]
b = a.copy()    # a real copy, new object

b.append(4)
print(a)        # [1, 2, 3] - unchanged
print(b)        # [1, 2, 3, 4]
print(a is b)   # False - different objects`}
        output={`[1, 2, 3]
[1, 2, 3, 4]
False`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Why integers feel different</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Aliasing seems alarming until you notice that integers and strings don&apos;t have this
        problem. That&apos;s because they&apos;re immutable: you can&apos;t change them in place,
        so there&apos;s no way to affect one name through another.
      </p>

      <CodeBlock
        code={`a = 10
b = a

b = b + 1       # creates a NEW integer object
print(a)        # 10 - unchanged
print(b)        # 11 - b now points to a different object`}
        output={`10
11`}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">b = b + 1</code>{" "}
        doesn&apos;t modify the integer <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">10</code>.
        It creates a new integer <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">11</code>{" "}
        and moves the sticky note. The object <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">a</code>{" "}
        still points to is untouched.
      </p>
    </section>
  );
}
