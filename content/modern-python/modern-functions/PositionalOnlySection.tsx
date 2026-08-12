import { CodeBlock } from "@/components/blog/interactive/code-block";

export function PositionalOnlySection() {
  return (
    <section>
      <h2
        id="positional-only"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Positional-only parameters with / (3.8)
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Before 3.8, Python had no way to say "this parameter cannot be passed as a keyword." Every
        parameter was callable either way, which meant callers could write{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          f(x=1)
        </code>{" "}
        instead of{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          f(1)
        </code>{" "}
        and you could not stop them. That made parameter names part of your public API whether
        you intended it or not.
      </p>

      <CodeBlock
        code={`# Python 3.8+: parameters before / are positional-only
def circle_area(radius, /, precision=2):
    import math
    return round(math.pi * radius ** 2, precision)

# OK: positional
print(circle_area(5))         # 78.54

# OK: precision as keyword
print(circle_area(5, precision=4))  # 78.5398

# Error: radius as keyword
circle_area(radius=5)         # TypeError: positional-only`}
        output={`78.54
78.5398
TypeError: circle_area() got some positional-only arguments passed as keyword arguments: 'radius'`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        The{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          *
        </code>{" "}
        separator forces everything after it to be keyword-only. You can use both in one
        signature:
      </p>

      <CodeBlock
        code={`def transfer(from_account, to_account, /, *, amount, currency="USD"):
    # from_account and to_account: positional-only (avoid ambiguity with 'from' keyword)
    # amount and currency: keyword-only (must be explicit for clarity)
    print(f"Transfer {amount} {currency} from {from_account} to {to_account}")

transfer("ACC-001", "ACC-002", amount=500)
# transfer(from_account="ACC-001", to_account="ACC-002", amount=500)  # TypeError
# transfer("ACC-001", "ACC-002", 500)  # TypeError: amount is keyword-only`}
        output={`Transfer 500 USD from ACC-001 to ACC-002`}
      />
    </section>
  );
}
