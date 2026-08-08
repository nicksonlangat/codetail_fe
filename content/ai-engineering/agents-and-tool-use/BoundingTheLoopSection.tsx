import { CodeBlock } from "@/components/blog/interactive/code-block";

export function BoundingTheLoopSection() {
  return (
    <section>
      <h2 id="bounding-the-loop" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Every loop needs a way to stop that isn&apos;t &quot;trust the model to know when&quot;
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The loop from the first section has no ceiling. Left alone, a confused run keeps calling
        tools, and every call costs tokens and time whether or not it&apos;s making progress.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A hard ceiling on iterations, not a suggestion
        </p>
        <CodeBlock
          code={`MAX_ITERATIONS = 8

for i in range(MAX_ITERATIONS):
    response = client.chat.completions.create(model="gpt-4o", messages=messages, tools=tools)
    message = response.choices[0].message
    messages.append(message)
    if not message.tool_calls:
        return message.content
    # ... execute tools, append results ...

return "Couldn't complete this within the allowed steps, escalating to a human."`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A cost ceiling per run and a hard timeout belong next to it, for the same reason: a loop
        that&apos;s technically still making progress but has already burned ten times the
        expected budget is its own kind of failure, whether or not it eventually gets there.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        For any tool call with a real cost if it&apos;s wrong, sending an email, refunding a
        charge, deleting a record, a hard pause for human confirmation before execution is worth
        more than any amount of tuning the agent&apos;s judgment. This is the same instinct as
        requiring a second confirmation step for a high-impact action in any other system, an
        agent doesn&apos;t get a pass on that just because the decision came from a model instead
        of a person clicking a button. The Guardrails article later in this series covers this,
        and the broader safety picture, in depth.
      </p>
    </section>
  );
}
