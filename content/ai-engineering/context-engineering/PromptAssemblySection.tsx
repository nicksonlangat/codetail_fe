import { CodeBlock } from "@/components/blog/interactive/code-block";

export function PromptAssemblySection() {
  return (
    <section>
      <h2 id="prompt-assembly-as-a-pipeline" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        The final prompt is assembled, not typed
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Past a simple chatbot, the messages sent to the model rarely come from one place. A system
        instruction, retrieved documents, conversation history, and a tool result all need to
        land in the same request, and gluing them together with string concatenation wherever
        they happen to be needed is how a token budget gets blown without anyone deciding it
        should.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Assembly with an explicit budget per section
        </p>
        <CodeBlock
          code={`def assemble_prompt(system, retrieved_docs, history, user_message, max_tokens=8000):
    reserved_for_system = 300
    reserved_for_user_message = count_tokens(user_message) + 50
    remaining = max_tokens - reserved_for_system - reserved_for_user_message

    docs_budget = int(remaining * 0.6)
    history_budget = remaining - docs_budget

    docs = fit_to_budget(retrieved_docs, docs_budget)
    trimmed_history = fit_to_budget(history, history_budget, keep="most_recent")

    return build_messages(system, docs, trimmed_history, user_message)`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Nothing here is complicated, it&apos;s arithmetic. The point is that the budget is
        decided once, explicitly, as part of building the prompt, instead of discovered later as
        a context-length error in production or, worse, never discovered at all because
        everything technically still fit under the limit while quietly diluting the parts that
        actually mattered.
      </p>
    </section>
  );
}
