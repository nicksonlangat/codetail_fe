export function CostAndLatencyBudgetSection() {
  return (
    <section>
      <h2 id="setting-a-cost-and-latency-budget" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        The budget is a product decision, not an afterthought found in a bill
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        This is a chat interface a person is actively waiting on, which sets the latency target
        directly: streaming makes a multi-second total response feel immediate, from Latency,
        Cost, and Streaming earlier in this series, so the target is a fast first token, not a
        fast total completion.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Cost per conversation gets a real number attached to it too, not left as
        &quot;whatever it ends up being.&quot; Most questions here are routine enough for a
        cheaper, faster model to handle correctly, and only the fraction that needs deeper
        reasoning or a longer tool-use chain justifies the more expensive one, the cascade pattern
        from earlier in this series, evaluated against this product&apos;s own golden set rather
        than assumed to transfer from somewhere else.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Prompt caching applies directly here too: the system prompt and the retrieved documentation
        are the stable part of every call, structured to sit first so repeated calls against the
        same context actually benefit from it, instead of paying full price to reprocess the same
        instructions on every single message in a conversation.
      </p>
    </section>
  );
}
