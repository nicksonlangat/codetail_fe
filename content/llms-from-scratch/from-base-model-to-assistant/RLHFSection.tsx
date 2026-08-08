export function RLHFSection() {
  return (
    <section>
      <h2 id="rlhf" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        RLHF: learning from human preference rankings
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        SFT teaches format. It can&apos;t teach taste. Whether a response is appropriately concise,
        whether its tone lands right, whether it should refuse a request instead of attempting it,
        none of those are things you can write down as one ground-truth token sequence and train a
        next-token loss against. They&apos;re comparative judgments: given two candidate answers,
        which one is better. <strong>Reinforcement learning from human feedback</strong>, RLHF, is
        built specifically to learn from comparisons instead of single correct answers.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The process runs in two stages. First, take the SFT model and generate multiple candidate
        responses to the same prompt. Human raters look at pairs of those responses and pick which
        one they prefer, thousands of times over, across thousands of prompts. That preference
        data trains a second, separate model called the <strong>reward model</strong>: given a
        prompt and a response, it outputs a single number, its estimate of how much a human would
        like that response. The reward model never generates text, its only job is scoring it.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Second, use that reward model to actually update the language model, through reinforcement
        learning. The language model generates a response, the reward model scores it, and an
        algorithm called <strong>PPO</strong>, proximal policy optimization, adjusts the language
        model&apos;s weights to make highly-scored outputs more likely and poorly-scored ones less
        likely. Do this over millions of generated responses and the model&apos;s behavior shifts
        toward whatever the reward model has learned humans tend to prefer, tone, thoroughness,
        appropriate refusals, all of it, without any of those qualities ever being written down as
        an explicit rule.
      </p>

      <div className="border-l-2 border-brand-warning bg-brand-warning/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted">
          <strong>Gotcha:</strong> a reward model is a proxy, not the real thing, and PPO is very
          good at finding cracks in a proxy. Left unchecked, this produces{" "}
          <strong>reward hacking</strong>, responses that score high on the reward model without
          actually being better, padding an answer with unnecessary length because the reward model
          has a slight bias toward verbosity, for example. Real RLHF pipelines add a penalty that
          keeps the updated model&apos;s outputs statistically close to the original SFT model, to
          keep this kind of drift in check.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        RLHF works, and it&apos;s the process behind the first wave of assistant-style models that
        felt meaningfully different from a raw completion engine. It&apos;s also expensive and
        fiddly to run correctly: you&apos;re training and maintaining two separate models, the
        reward model and the policy, and PPO has a reputation for being sensitive to its own
        hyperparameters, unstable in ways that are hard to diagnose. That cost is exactly what the
        next technique was built to avoid.
      </p>
    </section>
  );
}
