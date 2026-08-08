import { CodeBlock } from "@/components/blog/interactive/code-block";

export function MultiHeadAttentionSection() {
  return (
    <section>
      <h2
        id="multi-head-attention"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Multi-head attention: running several attentions in parallel
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The self-attention from the previous article used one query matrix, one key matrix, one
        value matrix, learned once and applied to the whole embedding at a time. That&apos;s a
        real, working attention mechanism. It&apos;s also a bottleneck: a single set of weights
        can only learn a single notion of &ldquo;relevant.&rdquo; Force every relationship in a
        sentence, syntax, coreference, negation, tone, through one shared lens and most of them
        get blurred together.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <strong>Multi-head attention</strong> fixes this by splitting the embedding dimension into
        several smaller slices, called <strong>heads</strong>, and running an independent
        attention computation on each one. A model with a 512-dimensional embedding and 8 heads
        doesn&apos;t run 8 full 512-dimensional attentions, it slices each token&apos;s vector
        into 8 pieces of 64 dimensions, gives each slice its own learned query, key, and value
        matrices, and runs the same scaled dot-product attention from the previous article on each
        slice separately. The 8 results, each still 64-dimensional, get concatenated back into one
        512-dimensional vector, then passed through one more learned matrix that mixes the heads
        back together into a single output per token.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Each head ends up specializing on its own, nobody assigns it a job. One head might learn to
        track which word modifies which noun, a syntax pattern. Another might learn coreference,
        tracking which pronoun points back to which earlier noun. A third might latch onto
        something with no clean grammatical name at all. The specialization falls out of gradient
        descent the same way embedding clusters did in an earlier article, driven purely by what
        reduces the loss.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Splitting one attention into several smaller heads
        </p>
        <CodeBlock
          code={`def multi_head_attention(x, num_heads, d_model):
    d_k = d_model // num_heads
    heads = []
    for h in range(num_heads):
        q = x @ W_q[h]   # project to this head's (seq_len, d_k) slice
        k = x @ W_k[h]
        v = x @ W_v[h]
        heads.append(attention(q, k, v))
    concatenated = concat(heads, axis=-1)   # back to (seq_len, d_model)
    return concatenated @ W_o   # mix the heads back together`}
          output={``}
        />
      </div>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-brand-text-muted italic">
          Rule: splitting one 512-dimensional attention into 8 heads of 64 dimensions each costs
          roughly the same compute as running one 512-dimensional head, not eight times as much.
          The heads run in parallel, on slices of the same total width, not on top of it.
        </p>
      </div>
    </section>
  );
}
