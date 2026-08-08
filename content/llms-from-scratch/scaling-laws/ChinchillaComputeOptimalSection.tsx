import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ChinchillaComputeOptimalSection() {
  return (
    <section>
      <h2
        id="chinchilla-compute-optimal"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Chinchilla: parameters versus data, the compute-optimal tradeoff
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The scaling law in the previous section tells you loss falls as compute grows. It does not
        tell you how to spend that compute. Given a fixed FLOPs budget, you can buy a bigger model
        trained on less data, or a smaller model trained on more data, and{" "}
        <span className="font-mono">total_flops ≈ 6 × num_parameters × total_tokens</span> lets
        both trade off against each other freely. For years, the industry&apos;s answer, set by
        GPT-3 and the models that followed its lead, was: spend it on parameters. Scale the model up
        aggressively, keep dataset size roughly fixed or growing much slower.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        In 2022, DeepMind&apos;s Chinchilla paper checked that assumption directly and it broke. The
        team trained over 400 models across a wide range of sizes and token counts, fit the scaling
        law from actual data, and found that GPT-3-era models were undertrained for their size, not
        undertrained in some vague sense, undertrained in a specific, quantifiable way: for the
        compute they cost, a substantially smaller model trained on far more data would have reached
        lower loss. Their own 70-billion-parameter Chinchilla model, trained on 1.4 trillion tokens,
        beat Gopher, a 280-billion-parameter model from the same lab trained on far fewer tokens, on
        the same compute budget.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          Rule: the Chinchilla-optimal ratio is roughly 20 training tokens per parameter. A
          10-billion-parameter model wants on the order of 200 billion tokens to be compute-optimal,
          not 30 billion, not 2 trillion. Below that ratio you&apos;re leaving loss on the table with
          a model too big for its diet, above it you&apos;re past the point of useful returns for
          this fixed budget.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The derivation is short enough to run yourself. Take the compute formula from Pretraining at
        Scale, substitute the 20-tokens-per-parameter ratio for total_tokens, and solve for the
        parameter count that&apos;s optimal at a given compute budget.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Compute-optimal split, derived from C ≈ 6 × N × D and D ≈ 20 × N
        </p>
        <CodeBlock
          code={`def compute_optimal_split(flops_budget):
    # C ~= 6 * N * D, and Chinchilla found D ~= 20 * N
    # substituting: C ~= 6 * N * (20 * N) = 120 * N^2
    n_opt = (flops_budget / 120) ** 0.5
    d_opt = 20 * n_opt
    return n_opt, d_opt

n, d = compute_optimal_split(1e24)
print(f"{n:.2e} parameters, {d:.2e} tokens")`}
          output={`9.13e+10 parameters, 1.83e+12 tokens`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        That single result reshaped how frontier labs plan training runs. Instead of asking
        &ldquo;how many parameters can we afford to serve&rdquo; and then training whatever data was
        on hand, labs now start from a compute budget, solve for the compute-optimal parameter and
        token counts, and then go build a dataset large enough to hit that token target, which is
        why the years after Chinchilla saw a scramble for more training data, not just more GPUs.
        Later models like LLaMA deliberately trained smaller models on far more tokens than the
        Chinchilla ratio strictly required, because a smaller model that&apos;s cheaper to run at
        inference time can be worth slightly worse compute efficiency during training. That&apos;s a
        real tradeoff labs make on top of the compute-optimal point, not a rejection of it.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Notice what this section and the last one have in common: both come from fitting a curve to
        real training runs and reading off a prediction, not from theory alone. The next section
        looks at a place where reading a curve incorrectly produced a conclusion that looked
        dramatic and turned out to be mostly an illusion of the metric being used.
      </p>
    </section>
  );
}
