import { CodeBlock } from "@/components/blog/interactive/code-block";

export function BetterErrorsSection() {
  return (
    <section>
      <h2
        id="better-errors"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Smarter built-in error messages (3.10+)
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Python 3.10 through 3.12 significantly improved the error messages from the interpreter
        itself. The code does not change: the same mistake that gave you a cryptic message in
        3.9 now gives you a helpful suggestion in 3.11.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        AttributeError with suggestions (3.10)
      </h3>

      <CodeBlock
        code={`# Python 3.9 and earlier:
# AttributeError: 'list' object has no attribute 'appendd'

# Python 3.10+:
items = [1, 2, 3]
items.appendd(4)`}
        output={`AttributeError: 'list' object has no attribute 'appendd'. Did you mean: 'append'?`}
      />

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        NameError with suggestions (3.10)
      </h3>

      <CodeBlock
        code={`# Python 3.9:
# NameError: name 'lenght' is not defined

# Python 3.10+: checks builtins and local scope
my_list = [1, 2, 3]
print(lenght(my_list))`}
        output={`NameError: name 'lenght' is not defined. Did you mean: 'len'?`}
      />

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        SyntaxError improvements (3.10)
      </h3>

      <CodeBlock
        code={`# Python 3.9 and earlier:
# SyntaxError: invalid syntax (pointing at the wrong token)

# Python 3.10+ gives precise pointers and explanations
# Example: missing colon after if
# if x > 0
#         ^
# SyntaxError: expected ':'

# Example: using = instead of == in comparison
# if x = 5:
# SyntaxError: invalid syntax. Maybe you meant '==' or ':=' instead of '='?`}
      />

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Tracebacks with exact column highlighting (3.11)
      </h3>

      <CodeBlock
        code={`# Python 3.11 highlights the exact subexpression that failed, not just the line

def compute(a, b, c):
    return a + b * c

result = compute(1, None, 3)`}
        output={`TypeError: unsupported operand type(s) for *: 'NoneType' and 'int'
    return a + b * c
               ^^^^^ <-- exact subexpression highlighted`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        These improvements compound. A junior developer reading a 3.11 traceback gets substantially
        more information than the same crash on 3.9. If you are supporting Python 3.9 or 3.10,
        upgrading is often worth it for the debugging experience alone.
      </p>
    </section>
  );
}
