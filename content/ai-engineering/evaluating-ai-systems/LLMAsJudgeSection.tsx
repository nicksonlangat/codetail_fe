import { CodeBlock } from "@/components/blog/interactive/code-block";

export function LLMAsJudgeSection() {
  return (
    <section>
      <h2 id="llm-as-judge" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        For output with no single correct answer, a second model call can grade it
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">expect_contains</code>{" "}
        works for facts and format. It doesn&apos;t work for judging whether a summary is genuinely
        good, whether a tone is appropriately warm, whether an open-ended answer actually addressed
        the question, there&apos;s no fixed string to check for. The common approach is having
        another model call score the output against a rubric.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A judge prompt, scoring rather than answering
        </p>
        <CodeBlock
          code={`judge_prompt = f"""Rate this summary from 1-5 on accuracy and conciseness.
Respond with only a number.

Original: {original_text}
Summary: {summary}"""

score = int(client.chat.completions.create(
    model="gpt-4o", messages=[{"role": "user", "content": judge_prompt}],
).choices[0].message.content)`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Treat the judge&apos;s score as a useful signal, not ground truth. LLM judges have measurable
        biases of their own, a documented tendency to score longer answers higher regardless of
        actual quality is one of the most common, and a judge prompt inherits the same
        specification problem as any other prompt in this series: a vague rubric produces
        inconsistent scores for the same reason a vague summarization prompt produces inconsistent
        summaries.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Calibrate it before trusting it: run the judge against a handful of outputs a person has
        already scored by hand, and check that the two rankings actually agree before wiring the
        judge into an automated pipeline that gates real changes.
      </p>
    </section>
  );
}
