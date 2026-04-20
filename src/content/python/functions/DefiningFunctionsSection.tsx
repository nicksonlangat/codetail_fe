import { CodeBlock } from "@/components/blog/interactive/code-block";
import { Term } from "@/components/blog/interactive/term";

export function DefiningFunctionsSection() {
  return (
    <section>
      <h2 id="defining" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Defining functions
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A function is defined with{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">def</code>,
        a name, parameters in parentheses, and a body. It runs only when called.
        Every function returns a value — if there is no{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">return</code>,
        it returns{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">None</code>.
      </p>

      <CodeBlock
        code={`def greet(name):
    return f"Hello, {name}!"

message = greet("Alice")
print(message)    # Hello, Alice!

# No return statement — implicitly returns None
def log(text):
    print(f"[LOG] {text}")

result = log("started")
print(result)     # None`}
        output={`Hello, Alice!
[LOG] started
None`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Type hints</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Type hints annotate what types parameters and return values should be. They are
        not enforced at runtime — Python ignores them during execution — but they make
        code clearer, enable editor autocompletion, and let type checkers like{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">mypy</code>{" "}
        catch bugs before you run the code.
      </p>

      <CodeBlock
        code={`def add(x: int, y: int) -> int:
    return x + y

def greet(name: str, loud: bool = False) -> str:
    msg = f"Hello, {name}!"
    return msg.upper() if loud else msg

def first_even(nums: list[int]) -> int | None:
    return next((n for n in nums if n % 2 == 0), None)

print(add(3, 4))                      # 7
print(greet("Alice", loud=True))      # HELLO, ALICE!
print(first_even([1, 3, 5, 4, 6]))   # 4
print(first_even([1, 3, 5]))          # None`}
        output={`7
HELLO, ALICE!
4
None`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Early return</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Returning early on guard conditions keeps the main logic unindented and easy
        to read. Sometimes called the{" "}
        <Term term="guard clause">guard clause</Term>{" "}
        pattern.
      </p>

      <CodeBlock
        code={`# Nested version — hard to follow
def process(data):
    if data is not None:
        if len(data) > 0:
            return data[0] * 2
    return None

# Guard clause version — flat and clear
def process(data):
    if data is None:
        return None
    if len(data) == 0:
        return None
    return data[0] * 2

print(process([5, 10]))   # 10
print(process([]))        # None`}
        output={`10
None`}
      />
    </section>
  );
}
