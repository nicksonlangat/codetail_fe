import { CodeBlock } from "@/components/blog/interactive/code-block";

export function OutputFilteringSection() {
  return (
    <section>
      <h2 id="output-filtering" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        A check on the way out catches what a check on the way in can&apos;t
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Everything so far has been about what the model reads. Output filtering is the other side:
        checking what the model is about to produce, before it reaches the user or before a tool
        call it requested actually executes.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A check between the model&apos;s decision and the action taking effect
        </p>
        <CodeBlock
          code={`response_text = generate_response(messages)

if contains_pii(response_text) or is_flagged_toxic(response_text):
    return "I can't share that. Let me connect you with a person who can help."

return response_text`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        For a tool-calling agent, the same idea applies to actions, not just text: a proposed tool
        call that looks obviously out of scope for what the user asked, deleting a record when
        they asked a question, gets caught here rather than trusted because the model requested
        it.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        A fast rules-based check or a small classifier model both work for this, the goal is speed
        and a low false-negative rate on the specific things you&apos;re checking for, not a
        second, slower LLM call second-guessing every response. It&apos;s a filter, not a
        conversation.
      </p>
    </section>
  );
}
