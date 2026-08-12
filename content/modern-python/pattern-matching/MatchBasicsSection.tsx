import { CodeBlock } from "@/components/blog/interactive/code-block";

export function MatchBasicsSection() {
  return (
    <section>
      <h2
        id="match-basics"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        match/case basics
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">match</code>{" "}
        takes a value. Each{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">case</code>{" "}
        specifies a pattern. The first pattern that matches runs its block. If nothing matches, the
        block is skipped.
      </p>

      <CodeBlock
        code={`# Literal patterns: match exact values
def http_status(code: int) -> str:
    match code:
        case 200:
            return "OK"
        case 201:
            return "Created"
        case 404:
            return "Not Found"
        case 500:
            return "Internal Server Error"
        case _:              # wildcard: matches anything
            return "Unknown"

print(http_status(200))   # OK
print(http_status(418))   # Unknown`}
        output={`OK
Unknown`}
      />

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Capture patterns
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A bare name in a pattern is a <strong>capture</strong>: it matches anything and binds
        the value to that name in the case block.
      </p>

      <CodeBlock
        code={`def describe(value):
    match value:
        case 0:
            print("zero")
        case n if n < 0:     # capture + guard (covered next section)
            print(f"negative: {n}")
        case n:              # capture: matches anything else
            print(f"positive: {n}")

describe(0)    # zero
describe(-5)   # negative: -5
describe(42)   # positive: 42`}
        output={`zero
negative: -5
positive: 42`}
      />

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        OR patterns
      </h3>

      <CodeBlock
        code={`def classify_status(code: int) -> str:
    match code:
        case 200 | 201 | 202 | 204:
            return "success"
        case 301 | 302 | 307 | 308:
            return "redirect"
        case 400 | 401 | 403 | 404 | 422:
            return "client error"
        case 500 | 502 | 503 | 504:
            return "server error"
        case _:
            return "other"

print(classify_status(201))   # success
print(classify_status(503))   # server error`}
        output={`success
server error`}
      />
    </section>
  );
}
