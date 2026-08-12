import { CodeBlock } from "@/components/blog/interactive/code-block";

export function StateAndBehaviorSection() {
  return (
    <section>
      <h2
        id="state-and-behavior"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        State and behavior
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Every object has two things: <strong>state</strong> (data it holds) and{" "}
        <strong>behavior</strong> (things it can do). A string's state is the characters it contains.
        Its behavior is methods like{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">upper()</code>{" "}
        and{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">split()</code>
        . A list's state is the items it holds. Its behavior is{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          append()
        </code>
        ,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">sort()</code>
        , and so on.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        You can inspect state and call behavior on any object:
      </p>

      <CodeBlock
        code={`# A list object
scores = [88, 72, 95, 61, 90]

# Its state: the items it holds
print(scores)          # [88, 72, 95, 61, 90]

# Its behavior: what it can do
scores.append(77)
scores.sort()
print(scores)          # [61, 72, 77, 88, 90, 95]
print(len(scores))     # 6

# You can also ask it about itself
print(type(scores))    # <class 'list'>
print(id(scores))      # memory address, unique per object`}
        output={`[88, 72, 95, 61, 90]
[61, 72, 77, 88, 90, 95]
6
<class 'list'>
140234567890`}
      />

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6 mt-6">
        <p className="text-[13px] text-brand-text-muted">
          <strong>Rule:</strong> state is the data an object holds. Behavior is what you can ask it
          to do. Every object has both.
        </p>
      </div>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Two objects of the same class, independent state
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Here is something that trips beginners up. Two lists are both instances of{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">list</code>,
        but they do not share data. Each has its own independent state.
      </p>

      <CodeBlock
        code={`a = [1, 2, 3]
b = [1, 2, 3]

# Same class, same initial values
print(type(a) == type(b))   # True
print(a == b)               # True, same contents

# But completely independent objects
a.append(99)
print(a)   # [1, 2, 3, 99]
print(b)   # [1, 2, 3]  -- b is untouched

# Different locations in memory
print(id(a) == id(b))   # False`}
        output={`True
True
[1, 2, 3, 99]
[1, 2, 3]
False`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        This is the key property of objects. The class is one thing, a shared description. Every
        instance you create from it gets its own private copy of state. Changing one does not affect
        the other.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        When you define your own classes later, your objects work the same way. One class definition,
        unlimited independent instances.
      </p>
    </section>
  );
}
