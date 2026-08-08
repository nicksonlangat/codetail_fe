import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ModelCascadesSection() {
  return (
    <section>
      <h2 id="model-cascades-and-routing" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Most requests are easy. Only the hard ones need the expensive model.
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Sending every request to the largest, most capable, most expensive model available is the
        simplest thing to build and often the most wasteful, because most real traffic is the easy
        majority of cases a cheaper, faster model already handles correctly.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Try cheap first, escalate only when needed
        </p>
        <CodeBlock
          code={`result = run_with_model("gpt-4o-mini", request)

if not passes_confidence_check(result):
    result = run_with_model("gpt-4o", request)  # escalate only the hard cases

return result`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        The confidence check is doing the real work here, and it&apos;s the same kind of check
        this series has already covered elsewhere: a schema validation failure, a low score from
        an LLM-as-judge pass, or a rule specific to the task, like an unusually short or generic
        response. Get that check wrong and a cascade either escalates almost everything, erasing
        the cost savings, or escalates almost nothing, quietly shipping the cheap model&apos;s
        mistakes. It&apos;s worth tuning against the same golden set the rest of this series builds
        pipelines around, not set once and left alone.
      </p>
    </section>
  );
}
