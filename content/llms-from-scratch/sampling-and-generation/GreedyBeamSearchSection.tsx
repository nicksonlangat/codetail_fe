import { CodeBlock } from "@/components/blog/interactive/code-block";

export function GreedyBeamSearchSection() {
  return (
    <section>
      <h2
        id="greedy-beam-search"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Greedy decoding, beam search, and why chatbots use neither
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The obvious answer to &ldquo;why sample at all&rdquo; is: don&apos;t. Always take the
        single highest-probability token, every step, no dice roll. That&apos;s{" "}
        <strong>greedy decoding</strong>, and it is deterministic, the same prompt really does give
        the same output every time. It also produces some of the dullest text an LLM can generate.
        Greedy decoding has no mechanism for escaping a locally safe choice, so it tends to fall
        into loops, the same phrase, or a close variant of it, repeated because at every step
        repeating was still the single most probable next token given what it just said.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Greedy decoding, one line
        </p>
        <CodeBlock
          code={`def greedy_decode(distribution):
    return max(range(len(distribution)), key=lambda i: distribution[i])`}
          output={``}
        />
      </div>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Beam search: hedging by tracking several sequences at once
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Greedy decoding&apos;s real flaw isn&apos;t any single step, it&apos;s that a token which
        looks slightly suboptimal right now can lead to a much better sentence two words later, and
        greedy has already committed and can&apos;t go back. <strong>Beam search</strong> hedges
        against that by tracking several candidate sequences in parallel, called beams, instead of
        one. At each step, every beam gets extended by its most likely next tokens, all of those
        extensions get scored by their running total probability, and only the top few survive
        into the next step. It&apos;s a breadth-limited search for the highest-scoring whole
        sequence, not just the highest-scoring next token.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        That makes beam search genuinely better than greedy for tasks with a fairly well-defined
        correct answer, translation, summarization, where there&apos;s a right ballpark and the
        job is finding the best-scoring sequence inside it. It costs a lot more, though. Tracking{" "}
        <em>b</em> beams multiplies the forward passes per step by <em>b</em>, and for open-ended
        conversation it doesn&apos;t even pay off: beam search is still, at its core, maximizing
        probability. It converges on the same kind of bland, generically-safe phrasing greedy
        decoding does, just with a wider search around it. A tie between five polished, forgettable
        sentences is still a forgettable sentence.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          Rule: greedy and beam search both optimize for the highest-probability sequence. That
          objective is right for tasks with a correct answer, it&apos;s wrong for open-ended
          conversation, where the highest-probability continuation is usually the blandest one in
          the distribution, not the best one.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        This is why essentially every production chat model samples instead, temperature to shape
        the distribution, top-k and top-p to cut off the tail before rolling the dice, exactly the
        stack covered in this article. Not because sampling is fancier than search, but because the
        goal is different. A translation has a target to converge on. A conversation doesn&apos;t,
        it has a wide range of reasonable next things to say, and the whole point of sampling is
        refusing to collapse that range down to one &ldquo;best&rdquo; answer every single time.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Every one of these strategies, greedy, beam, temperature, top-k, top-p, still runs the
        model fresh at every generated token, recomputing attention over the entire sequence so
        far. That recomputation is expensive, and it&apos;s avoidable in a specific, clever way.
        That&apos;s the KV cache, and what it caches, and why it exists, is next.
      </p>
    </section>
  );
}
