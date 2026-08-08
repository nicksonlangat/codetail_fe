export function PredictingBeforeTrainingSection() {
  return (
    <section>
      <h2
        id="predicting-before-training"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Using scaling laws to predict a model before training it
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Put the last three sections together and you get an actual planning process, not just three
        independently interesting facts. A lab deciding whether to attempt a frontier training run
        doesn&apos;t start by training it and seeing what happens, that would mean risking tens of
        millions of dollars on a guess. It starts by running a series of much smaller, much cheaper
        training jobs across a range of compute budgets, exactly the kind of runs that produced the
        straight line in the first section, and fitting a scaling law to the results.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        From there the process is mechanical. Pick the compute budget you&apos;re willing to spend.
        Use the Chinchilla-style tradeoff to solve for the compute-optimal split between parameter
        count and token count, the same arithmetic from the second section. Plug that compute figure
        into the fitted scaling law and read off a predicted loss, before a single dollar goes toward
        the actual full-scale run. If that predicted loss isn&apos;t meaningfully better than the
        lab&apos;s last model, the run doesn&apos;t get greenlit, no matter how much hardware is
        sitting idle. If it is, the prediction becomes the number the training team is held to, and a
        real run that lands far off that line is treated as a sign something went wrong in training,
        not just a disappointing result to shrug off.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        This is also where the emergent abilities caveat from the previous section earns its keep.
        The scaling law predicts loss reliably. It does not, by itself, promise that a specific
        downstream capability will appear at a specific scale, because as you just saw, capability
        benchmarks can hide or exaggerate what the loss curve is actually doing. A careful prediction
        distinguishes the two: &ldquo;loss will land around here&rdquo; is a claim scaling laws are
        good at, &ldquo;the model will suddenly be able to do X&rdquo; is a claim that needs its own
        evidence, not just an extrapolated line.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Predicting a model&apos;s loss before spending the money to train it used to be closer to a
        research curiosity than an operational tool. It&apos;s now a standard input into how large
        training runs get planned and approved at every lab running them, sitting right alongside the
        engineering questions from the Pretraining at Scale article about datasets and batches and
        GPU-time. That closes out the theory side of this series. The next and final article, Build a
        Tiny LLM From Scratch, takes every mechanism covered across the fourteen articles before it,
        tokenization, embeddings, attention, the transformer block, loss, sampling, and everything in
        between, and wires them together into working code you can actually run.
      </p>
    </section>
  );
}
