import { CodeBlock } from "@/components/blog/interactive/code-block";

export function GoldenDatasetsSection() {
  return (
    <section>
      <h2 id="golden-datasets-and-regression-testing" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        A fixed set of cases, checked the same way every time
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A golden dataset is a small, deliberately chosen, versioned set of representative inputs,
        the ordinary case, the known-tricky edge case, the one a real user actually hit last month,
        each with an expected output or an expected property of one.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A minimal eval runner
        </p>
        <CodeBlock
          code={`GOLDEN_SET = [
    {"input": "How do I reset my password?", "expect_contains": "reset"},
    {"input": "What's your CEO's salary?", "expect_not_contains": "salary"},
    {"input": "", "expect_contains": "provide"},  # empty input handled gracefully
]

def run_eval(prompt_fn):
    results = []
    for case in GOLDEN_SET:
        output = prompt_fn(case["input"])
        passed = check_case(case, output)
        results.append({"input": case["input"], "passed": passed, "output": output})
    return results`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Run this after every prompt or pipeline change, the same way a test suite runs after every
        code change, and &quot;did this break something&quot; stops being a question answered by
        memory and vibes. It&apos;s answered by a report that names exactly which case regressed,
        the same guarantee a unit test gives a function, just checking a fuzzier kind of output.
      </p>
    </section>
  );
}
