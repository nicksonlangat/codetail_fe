import { CodeBlock } from "@/components/blog/interactive/code-block";

export function DecodingProblemSection() {
  return (
    <section>
      <h2
        id="the-decoding-problem"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        From probability distribution to one word: the decoding problem
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        It&apos;s tempting to think of the model as &ldquo;deciding&rdquo; the next word, the same
        way you&apos;d decide the next word in a sentence you&apos;re writing. It doesn&apos;t. A
        forward pass through the network ends at a fixed point every single time: a raw score for
        every entry in the vocabulary, tens of thousands of them, run through softmax to become a
        proper probability distribution that sums to 1. The model&apos;s job stops exactly there.
        Nothing in the weights picks a winner.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Turning that distribution into one emitted token is a separate, deliberate algorithm called{" "}
        <strong>decoding</strong>. It runs after the network, on top of the network&apos;s output,
        and it&apos;s where every question you&apos;ve ever had about LLM behavior, why the same
        prompt gives different answers, why some models sound repetitive and others ramble,
        actually lives. Same model, same weights, same prompt, same probability distribution, and
        the decoding step still gets to choose differently every time.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Where the model&apos;s job ends and decoding begins
        </p>
        <CodeBlock
          code={`logits = model(tokens)          # one raw score per vocabulary entry
distribution = softmax(logits)  # now sums to 1, a real probability distribution

next_token = decode(distribution)  # greedy, temperature, top-k, top-p, or beam search
                                    # this line is a different algorithm each time`}
          output={``}
        />
      </div>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          Rule: the distribution is the model&apos;s output. The token is the decoder&apos;s
          output. Everything in this article, temperature, top-k, top-p, greedy decoding, beam
          search, is a choice about that second step, not a retraining of the network.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        This matters because it means the &ldquo;personality&rdquo; of a model&apos;s output,
        careful and consistent versus loose and varied, isn&apos;t fixed at training time the way
        its knowledge is. It&apos;s a knob you can turn after the fact, on the exact same set of
        weights. The rest of this article is about what that knob actually does, one decoding
        strategy at a time.
      </p>
    </section>
  );
}
