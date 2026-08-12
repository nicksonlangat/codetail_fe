import { CodeBlock } from "@/components/blog/interactive/code-block";

export function EverythingIsAnObjectSection() {
  return (
    <section>
      <h2
        id="everything-is-an-object"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        You already have objects
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Run this before we go any further:
      </p>

      <CodeBlock
        code={`x = 42
print(type(x))

name = "alice"
print(type(name))

items = [1, 2, 3]
print(type(items))`}
        output={`<class 'int'>
<class 'str'>
<class 'list'>`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        You wrote three lines of Python you already know. The output is telling you something most
        people miss until much later: every value belongs to a class.{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">42</code> is
        an instance of{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">int</code>.{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">"alice"</code>{" "}
        is an instance of{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">str</code>.
        This is not a detail. It is the entire design philosophy of Python.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Objects carry their behavior with them
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        In languages like C, a string is just a block of memory. You pass it to separate functions
        to do anything with it.{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          strlen(s)
        </code>
        ,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          toupper(s)
        </code>
        . The data and the functions that operate on it are separate things.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Python strings carry their operations with them:
      </p>

      <CodeBlock
        code={`name = "alice"

print(name.upper())        # ALICE
print(name.capitalize())   # Alice
print(name.replace("a", "@"))  # @lice
print(name.startswith("a"))    # True`}
        output={`ALICE
Alice
@lice
True`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        Those methods are not standalone functions floating somewhere. They live on the string object.
        Every string object has them. That is what makes something an object: it bundles data and the
        operations that work on that data into one thing.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        dir() shows you everything an object knows how to do
      </h3>

      <CodeBlock
        code={`x = 42
print(dir(x))`}
        output={`['__abs__', '__add__', '__and__', '__bool__', '__ceil__', '__class__',
 '__delattr__', '__dir__', '__divmod__', '__doc__', '__eq__', '__float__',
 '__floor__', '__floordiv__', '__format__', '__ge__', '__getattribute__',
 '__gcd__', '__gt__', '__hash__', '__index__', '__init__', '__init_subclass__',
 '__int__', '__invert__', '__le__', '__lshift__', '__lt__', '__mod__',
 '__mul__', '__ne__', '__neg__', '__new__', '__or__', '__pos__', '__pow__',
 '__radd__', '__rand__', '__rdivmod__', '__reduce__', '__reduce_ex__',
 '__repr__', '__rfloordiv__', '__rlshift__', '__rmod__', '__rmul__', '__ror__',
 '__round__', '__rpow__', '__rrshift__', '__rshift__', '__rsub__', '__rtruediv__',
 '__rxor__', '__setattr__', '__sizeof__', '__str__', '__sub__', '__subclasshook__',
 '__truediv__', '__trunc__', '__xor__', 'bit_count', 'bit_length', 'conjugate',
 'denominator', 'from_bytes', 'imag', 'numerator', 'real', 'to_bytes']`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        A plain integer knows 77 things about itself. The ones with double underscores (
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">__add__</code>
        ,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">__mul__</code>
        ) are what Python calls when you write{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">x + y</code>{" "}
        or{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">x * y</code>.
        There is a whole article on those later in this series. For now, the point is: integers are
        not simple numbers. They are objects with dozens of built-in behaviors.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Even functions are objects:
      </p>

      <CodeBlock
        code={`def greet(name):
    return f"Hello, {name}"

print(type(greet))
print(greet.__name__)
print(greet.__doc__)`}
        output={`<class 'function'>
greet
None`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        Everything. Functions, classes themselves, modules. All objects. This is why Python can do
        things like pass a function as an argument to another function, store a function in a list,
        or return a function from a function. Objects can go anywhere.
      </p>
    </section>
  );
}
