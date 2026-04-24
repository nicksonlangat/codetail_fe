import { CodeBlock } from "@/components/blog/interactive/code-block";

export function WhatIsAModuleSection() {
  return (
    <section>
      <h2 id="what-is-a-module" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        What is a module?
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A module is any{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">.py</code> file.
        When you write{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">import math</code>,
        Python finds{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">math.py</code>{" "}
        somewhere on its search path, executes it, and returns the result as a
        module object. Everything defined at the top level of that file becomes
        an attribute on the object.
      </p>

      <CodeBlock
        code={`import math

print(math.pi)          # 3.141592653589793
print(math.sqrt(16))    # 4.0
print(math.floor(3.7))  # 3

# The module is an object you can inspect
print(type(math))       # <class 'module'>`}
        output={`3.141592653589793
4.0
3
<class 'module'>`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Your own modules</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Any file you write is importable as a module. Save this as{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">utils.py</code>{" "}
        and import it from any file in the same directory.
      </p>

      <CodeBlock
        code={`# utils.py
def add(a, b):
    return a + b

def clamp(value, lo, hi):
    return max(lo, min(value, hi))

TIMEOUT = 30   # module-level constant`}
      />

      <CodeBlock
        code={`# main.py  (same directory as utils.py)
import utils

print(utils.add(2, 3))           # 5
print(utils.clamp(150, 0, 100))  # 100
print(utils.TIMEOUT)             # 30`}
        output={`5
100
30`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">The __name__ guard</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Every module has a built-in{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">__name__</code>{" "}
        attribute. When Python runs a file directly,{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">__name__</code>{" "}
        is set to{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">"__main__"</code>.
        When the same file is imported by another module,{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">__name__</code>{" "}
        is set to the module&apos;s name instead.
      </p>

      <CodeBlock
        code={`# utils.py
def add(a, b):
    return a + b

if __name__ == "__main__":
    # This block only runs when executing utils.py directly.
    # It does NOT run when utils is imported.
    assert add(2, 3) == 5
    assert add(-1, 1) == 0
    print("All tests passed.")`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mb-6 mt-6">
        <p className="text-[13px] text-foreground/70 italic">
          This guard is the standard way to make a file work as both an importable
          library and a runnable script. Without it, any demo or test code at the
          bottom of your file runs every time someone imports the module.
        </p>
      </div>
    </section>
  );
}
