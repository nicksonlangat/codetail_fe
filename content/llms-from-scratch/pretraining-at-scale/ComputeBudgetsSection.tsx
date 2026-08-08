import { PretrainingComputeCalculator } from "@/components/blog/interactive/pretraining-compute-calculator";

export function ComputeBudgetsSection() {
  return (
    <section>
      <h2
        id="compute-budgets"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Compute budgets: what a training run costs in practice
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        &ldquo;We trained it on a big dataset&rdquo; makes pretraining sound like a data problem.
        It&apos;s also, unavoidably, a hardware and money problem. Every one of those training steps
        from the previous section is a fixed amount of arithmetic, matrix multiplications for every
        layer, forward and backward, and that arithmetic has to physically happen on a GPU, one
        floating-point operation at a time. Compute budget is just: how many of those operations
        does this run need, and how fast can the hardware you have actually do them.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        There&apos;s a rule of thumb worth memorizing, because it turns &ldquo;train a big model&rdquo;
        into an actual number: training a transformer costs roughly{" "}
        <strong>6 FLOPs per parameter per token</strong>. Not 1, because a forward pass touches
        every parameter once but training also needs a backward pass to compute gradients, which
        costs roughly twice the forward pass, and there&apos;s a further pass to propagate those
        gradients back through every layer. Add it up and the constant that falls out is close to 6.
        So total training FLOPs is approximately:
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          The compute rule of thumb behind every model card&apos;s FLOPs number
        </p>
        <p className="font-mono text-[13px] text-brand-text bg-brand-surface/40 rounded-lg px-3 py-2.5">
          total_flops ≈ 6 &times; num_parameters &times; total_tokens
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Plug in real numbers and the scale of &ldquo;frontier model&rdquo; training stops being
        abstract. A 70-billion-parameter model trained on 15 trillion tokens needs roughly{" "}
        6 &times; 70 &times; 10<sup>9</sup> &times; 15 &times; 10<sup>12</sup>, about{" "}
        6.3 &times; 10<sup>24</sup> floating-point operations, total. A single high-end GPU today
        delivers on the order of a few hundred trillion floating-point operations per second in
        practice, not the marketing number on the spec sheet, real utilization is closer to 30 to
        50 percent of peak once you account for communication between GPUs and the parts of the
        computation that just aren&apos;t matrix multiplication. Divide the first number by the
        second and you land on GPU-time measured in the hundreds of thousands of GPU-days. That is
        the actual reason frontier labs run training on thousands of GPUs for months rather than one
        machine for a weekend: the arithmetic itself demands it, no amount of clever engineering
        makes 10<sup>24</sup> floating-point operations fast on one card.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The calculator below runs that same arithmetic live. Move the parameter count and token
        count sliders and watch total FLOPs, the single-GPU-equivalent time, and the wall-clock time
        at a chosen GPU count all update together. Try dragging token count up while holding
        parameters fixed, that&apos;s literally what &ldquo;train longer on more data&rdquo; means in
        terms of cost, and it isn&apos;t free just because the model itself didn&apos;t get bigger.
      </p>

      <PretrainingComputeCalculator />

      <div className="border-l-2 border-brand-warning bg-brand-warning/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-brand-text-muted">
          <strong>In practice:</strong> the 400 TFLOPS/GPU figure in the calculator is an assumption,
          not a universal constant, real achieved throughput depends on GPU generation, interconnect
          speed, numeric precision, and how well the training code overlaps computation with
          communication. Labs report a metric called Model FLOPs Utilization, the ratio of achieved
          throughput to a GPU&apos;s theoretical peak, precisely because that gap is large and worth
          tracking. A well-optimized run at 50% MFU finishes in roughly half the wall-clock time of
          the same run at 25% MFU, on identical hardware.
        </p>
      </div>
    </section>
  );
}
