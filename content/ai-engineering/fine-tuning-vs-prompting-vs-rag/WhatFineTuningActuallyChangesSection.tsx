import { CodeBlock } from "@/components/blog/interactive/code-block";

export function WhatFineTuningActuallyChangesSection() {
  return (
    <section>
      <h2 id="what-fine-tuning-actually-changes" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Fine-tuning teaches a pattern of behavior, not a fact
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The most common misconception about fine-tuning is treating it like a way to teach a
        model new facts, upload your company&apos;s documentation and the model will
        &quot;know&quot; it. That&apos;s RAG&apos;s job, and fine-tuning is a genuinely bad tool
        for it, a model fine-tuned on a set of facts doesn&apos;t reliably recall them any better
        than an unmodified model with those same facts retrieved and placed in context.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        What fine-tuning changes is behavior: shifting the model&apos;s default response pattern
        given hundreds or thousands of examples of input paired with the exact output you want.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          One example from a fine-tuning dataset, teaching a specific output format
        </p>
        <CodeBlock
          code={`{"messages": [
    {"role": "user", "content": "Customer says the app crashes on login."},
    {"role": "assistant", "content": "{\\"category\\": \\"bug\\", \\"severity\\": \\"high\\", \\"component\\": \\"auth\\"}"}
]}`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        A thousand examples like this teach the model to default to this exact triage format for
        this exact kind of input, reliably, without a lengthy system prompt spelling out the
        schema on every call. That&apos;s a real, valuable shift. It&apos;s a shift in behavior
        pattern, not an injection of new facts, and treating it as the latter is how a team ends up
        disappointed that their fine-tuned model still doesn&apos;t know something that was never
        going to stick this way in the first place.
      </p>
    </section>
  );
}
