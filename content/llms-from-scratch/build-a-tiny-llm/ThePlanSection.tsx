export function ThePlanSection() {
  return (
    <section>
      <h2 id="the-plan" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        The plan: every piece, in one file
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Fourteen articles is a lot of surface area, and it&apos;s tempting to assume a real GPT
        implementation must match it: thousands of lines spread across a dozen files, a research
        codebase you&apos;d need a week to onboard onto. It isn&apos;t. The entire architecture,
        tokenizer, embeddings, positional encoding, a stack of transformer blocks, a loss function,
        an optimizer, and a sampling loop, fits in well under 300 lines, small enough to read start
        to finish in one sitting and hold the whole thing in your head at once.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A Cessna and a 747 are both, mechanically, wings, an engine, and control surfaces. Nobody
        confuses the two, but if you understand how the Cessna flies, you understand the shape of
        how the 747 flies too, the differences are in scale and refinement, not in kind. That&apos;s
        the relationship between what gets built in this article and a production model. Same
        operations, same tensor shapes, same training loop, same sampling logic. The only thing that
        changes going from here to a frontier model is size: more parameters, more data, more
        compute, applied to the identical mechanism.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          Rule: everything built in this article is mechanically identical to a production LLM.
          Same tokenizer job, same embedding lookup, same attention arithmetic, same cross-entropy
          loss, same Adam optimizer, same temperature and top-k and top-p sampling. What changes
          when you scale up is size, not shape.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The target for this build: a character-level tokenizer, a <code>d_model</code> of 128, 4
        attention heads, 6 stacked transformer blocks, and a context window of 128 tokens. That
        works out to roughly 1.2 million tunable parameters, small enough to train on a plain text
        corpus a few hundred kilobytes in size, on a laptop CPU, in minutes rather than days.
        Obviously nowhere near a real model, a frontier LLM runs somewhere between four and five
        orders of magnitude more parameters and roughly nine orders of magnitude more training
        tokens. But every operation this tiny model performs is the same operation a 400-billion
        parameter model performs. Nothing about the mechanism knows or cares how big the numbers
        get.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Here&apos;s how the last fourteen articles map onto the four sections that follow.
        Tokenization and Embeddings and Positional Encoding become the input pipeline, next. Neural
        Network Foundations and Attention and The Transformer Block become the model itself, the
        section after that. Loss and Backpropagation, and the toy-scale version of Pretraining at
        Scale, become the training loop. And Sampling and Generation, closing the loop first opened
        by What Is a Language Model, becomes the function that actually produces text. From Base
        Model to Assistant and Scaling Laws don&apos;t have a toy-scale equivalent worth building,
        instruction tuning needs a preference dataset this corpus doesn&apos;t have, and scaling
        laws are an empirical claim about trends across many models, not something one model
        demonstrates on its own, so both are set aside here. Context Windows and the KV Cache gets
        one direct mention, in the generation function where the tradeoff it describes actually
        shows up in code. Everything else gets used, by name, exactly where it belongs.
      </p>
    </section>
  );
}
