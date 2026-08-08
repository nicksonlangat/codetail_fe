import { KVCacheVisualizer } from "@/components/blog/interactive/kv-cache-visualizer";

export function WhyDoublingContextIsntFreeSection() {
  return (
    <section>
      <h2
        id="why-doubling-context-isnt-free"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Why doubling context length isn&apos;t a free upgrade
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Put the last three sections together and a &ldquo;we now support 128K context&rdquo;
        announcement stops reading like a config change and starts reading like a capacity planning
        decision. Every long conversation pays two separate costs, on two separate curves, at the
        same time.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The first cost is <strong>prefill</strong>: processing the initial prompt, all at once, pays
        the full <em>n</em>&sup2; attention cost from the first section, up front, before the model
        writes a single word of reply. Doubling the prompt length roughly quadruples that one-time
        bill. The second cost is the <strong>cache</strong>: once generation starts, each new token
        is cheap thanks to the KV cache, but the cache itself grows linearly with total sequence
        length, and it sits in GPU memory for the entire time that conversation stays open,
        multiplied by however many conversations are running at once. A longer context window is a
        quadratic compute commitment at the start and a linear, but large and long-lived, memory
        commitment for the whole conversation after that.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Slide the sequence length below and watch the two costs pull apart. At small n they look
        similar. By 32K tokens they don&apos;t, and neither curve is exaggerated, they&apos;re the
        same n&sup2; and n from the first three sections, just plotted side by side.
      </p>

      <KVCacheVisualizer />

      <div className="border-l-2 border-brand-warning bg-brand-warning/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted">
          <strong>In practice:</strong> this is exactly why context-window increases in real
          products come with real infrastructure cost, rationed rollout, or a higher price per
          token at long context, not just a flag flipped in a config file. It&apos;s also why
          techniques like sliding-window attention, capping how far back a token can attend, and
          grouped-query attention, sharing key and value projections across multiple query heads to
          shrink the cache&apos;s head-count multiplier, exist. Both are active research areas
          aimed squarely at bending these two curves back down, not covered in depth here.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        None of this changes what a language model fundamentally is, a next-word guesser, or how it
        decides which word comes next, covered in the Sampling and Generation article. It changes
        what that guesser costs to run at scale, and it&apos;s the reason context length shows up as
        a pricing tier, not just a feature flag. Next, the series turns from cost to correctness:
        how do you actually know if a model is good, covered in Evaluating LLMs.
      </p>
    </section>
  );
}
