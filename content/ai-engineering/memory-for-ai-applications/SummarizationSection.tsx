import { CodeBlock } from "@/components/blog/interactive/code-block";

export function SummarizationSection() {
  return (
    <section>
      <h2 id="summarization-as-compression" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Summarizing the oldest turns instead of dropping or keeping them whole
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The naive chat function from the first article in this series keeps every turn forever
        until a call fails outright. The two obvious alternatives, drop the oldest turns entirely
        or keep resending everything, both lose something: dropping loses whatever those turns
        actually established, keeping everything is the problem this is meant to solve.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Compress the oldest chunk instead of choosing between keeping it and losing it
        </p>
        <CodeBlock
          code={`if count_tokens(history) > SUMMARIZE_THRESHOLD:
    oldest_chunk = history[1:OLDEST_N]  # keep index 0, the system message
    summary = summarize(oldest_chunk)
    history = (
        [history[0]]
        + [{"role": "system", "content": f"Earlier conversation summary: {summary}"}]
        + history[OLDEST_N:]
    )`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        The oldest turns become one condensed note instead of disappearing or costing full price
        forever. It&apos;s lossy on purpose, a summary drops detail the same way any compression
        does, and that&apos;s the actual tradeoff being made: most of what a summary would drop
        from ten turns ago was never going to matter again, and the rare exception is a cost worth
        paying for keeping every conversation from eventually hitting a hard wall.
      </p>
    </section>
  );
}
