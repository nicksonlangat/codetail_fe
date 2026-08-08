export function DPOSection() {
  return (
    <section>
      <h2 id="dpo" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        DPO: getting RLHF&apos;s result without the reinforcement learning
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Look at what RLHF actually needs as input: pairs of responses to the same prompt, with a
        label saying which one humans preferred. Look at what it produces: a language model
        that&apos;s more likely to generate the preferred kind of response. RLHF gets from one to
        the other through a reward model and a reinforcement learning loop, but that path is not
        the only way to connect those two points. <strong>Direct Preference Optimization</strong>,
        DPO, takes the same chosen-versus-rejected preference data and skips straight to the
        destination.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        DPO reformulates the preference as a direct loss function on the language model itself. For
        each training example, that&apos;s a prompt, a preferred response, and a rejected one, the
        loss pushes the model to increase the relative probability it assigns to the preferred
        response versus the rejected one. No reward model gets trained. No PPO rollouts get sampled.
        No separate scoring pass happens at all. It&apos;s still gradient descent on a loss function
        computed from the model&apos;s own output probabilities, the same mechanics as every other
        training step in this series, just shaped around pairs of outputs instead of pointed at one
        ideal target per prompt like SFT.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          Rule: RLHF trains a judge, then runs a separate, unstable optimization process to satisfy
          the judge. DPO proves you can skip training the judge and update the model directly from
          the verdicts instead, mathematically, and get a comparable result.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        This is why DPO became the more common choice for most teams doing preference tuning.
        There&apos;s one model to train instead of two, one stable supervised-style loss instead of
        an RL loop that needs careful tuning to avoid collapsing, and the infrastructure looks much
        closer to the SFT step that already precedes it. RLHF and PPO haven&apos;t disappeared,
        some frontier labs still lean on the extra flexibility a learned reward model provides, but
        for the large majority of instruction-tuned models released since DPO&apos;s introduction,
        it&apos;s the default path from preference data to a finished model.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Put the three stages together and the picture is complete. Pretraining teaches the model
        language and knowledge. SFT teaches it the shape of a direct answer. RLHF or DPO teaches it
        which of several correct-shaped answers humans actually prefer, tone, safety, refusals
        included. Three different training runs, three different datasets, and in every case, at
        the bottom, the same gradient descent machinery from the Loss and Backpropagation article,
        just pointed at a different objective each time.
      </p>
    </section>
  );
}
