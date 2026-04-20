import { CodeBlock } from "@/components/blog/interactive/code-block";
import { InteractiveScope } from "@/components/blog/interactive/interactive-scope";

export function ScopeSection() {
  return (
    <section>
      <h2 id="scope" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Scope
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        When Python sees a name, it searches four scope levels in order:{" "}
        <strong>L</strong>ocal,{" "}
        <strong>E</strong>nclosing,{" "}
        <strong>G</strong>lobal,{" "}
        <strong>B</strong>uilt-in. It uses the first match it finds. If the name is not
        found in any scope, a{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">NameError</code>{" "}
        is raised.
      </p>

      <CodeBlock
        code={`x = "global"          # Global scope

def outer():
    x = "enclosing"       # Enclosing scope

    def inner():
        x = "local"       # Local scope
        print(x)          # local — found in Local first

    inner()
    print(x)              # enclosing

outer()
print(x)                  # global`}
        output={`local
enclosing
global`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">global and nonlocal</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        By default, assigning to a name inside a function creates a local variable.
        Use{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">global</code>{" "}
        to modify a module-level variable, and{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">nonlocal</code>{" "}
        to modify a variable in the enclosing function. Both are needed rarely — prefer
        returning values over modifying external state.
      </p>

      <CodeBlock
        code={`count = 0

def increment():
    global count        # declare intent to modify the global
    count += 1

increment()
increment()
print(count)   # 2

# nonlocal — modifying a variable in the enclosing function
def make_counter():
    n = 0
    def tick():
        nonlocal n
        n += 1
        return n
    return tick

counter = make_counter()
print(counter())   # 1
print(counter())   # 2
print(counter())   # 3`}
        output={`2
1
2
3`}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-6 mb-4">
        Click any variable below to see which scope Python resolves it from.
      </p>

      <InteractiveScope />
    </section>
  );
}
