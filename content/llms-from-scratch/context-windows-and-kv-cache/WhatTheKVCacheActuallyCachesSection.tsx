import { CodeBlock } from "@/components/blog/interactive/code-block";

export function WhatTheKVCacheActuallyCachesSection() {
  return (
    <section>
      <h2
        id="what-the-kv-cache-actually-caches"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        What the KV cache actually caches
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Here&apos;s the naive picture of generating a long reply: the model writes token 500, then
        to write token 501 it reruns the full forward pass over all 500 tokens again, from scratch,
        just to produce one more word. Token 502 reruns the whole thing over 501 tokens. If that were
        actually how it worked, a thousand-token reply would cost roughly as much as generating a
        thousand separate prompts of increasing length, and the Sampling and Generation article&apos;s
        one-token-at-a-time loop would be brutally expensive in practice, not just in theory.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        That&apos;s not what happens, because most of that rerun is wasted work. When generating
        token 501, the new query only needs to be computed once, for the new token. But attending to
        the sequence still means comparing that new query against the key of every earlier token,
        and taking a weighted sum using the value of every earlier token, exactly the mechanism from
        the Attention article. Those earlier keys and values are a fixed function of tokens that
        already exist and never change again. Recomputing them at every single step recomputes the
        exact same numbers, over and over, forever, for the life of the conversation.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The <strong>KV cache</strong> is the fix, and it&apos;s almost embarrassingly simple: the
        first time a token&apos;s key and value vectors get computed, store them. On every later
        step, reuse the stored versions instead of recomputing them, and only do fresh work for the
        one new token: compute its query, key, and value, append its key and value to the cache, and
        attend the new query against the full cache, old entries plus the one just added.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Generation loop, reusing cached keys and values
        </p>
        <CodeBlock
          code={`def generate(prompt_tokens, model, max_new_tokens):
    # first pass: process the whole prompt at once, cache builds up here
    logits, kv_cache = model.forward(prompt_tokens, kv_cache=None)
    generated = []

    for _ in range(max_new_tokens):
        next_token = sample(logits)
        generated.append(next_token)

        # only the new token runs through the model, cache supplies the rest
        logits, kv_cache = model.forward([next_token], kv_cache=kv_cache)

    return generated`}
          output={``}
        />
      </div>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          Rule: the KV cache doesn&apos;t shrink the attention computation itself, the new token
          still compares against every previous key. What it eliminates is redundant
          re-projection, recomputing the same old tokens&apos; key and value vectors again and
          again. Without it, generating a 1,000-token reply would redo token 1&apos;s key and value
          projection a thousand times over, for no new information.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        This is why generation is described as having two distinct phases with two different cost
        shapes: <strong>prefill</strong>, processing the whole prompt at once and building the
        initial cache, and <strong>decode</strong>, generating one token at a time afterward, each
        step doing new work proportional to one token, not the whole sequence. The cache is what
        makes decode cheap per step. It is not, however, free to keep around.
      </p>
    </section>
  );
}
