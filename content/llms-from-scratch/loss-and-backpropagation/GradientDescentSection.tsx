import { LossLandscape } from "@/components/blog/interactive/loss-landscape";

export function GradientDescentSection() {
  return (
    <section>
      <h2
        id="gradient-descent"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Gradient descent: which direction reduces the loss
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        It&apos;s tempting to imagine training as solving for the right weights directly, algebra,
        set the loss to zero, solve. That works for a line of best fit with two parameters. It
        does not work here. The loss from the last section is a function of every single weight in
        the model at once, the same weights from the neural network article, and a real model has
        billions of them. That&apos;s not a curve, it&apos;s a landscape with billions of
        dimensions, and there is no algebra that solves it in one step.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        What you can compute, at any specific point in that landscape, is the <strong>gradient</strong>:
        the direction that increases the loss fastest, for every weight simultaneously. Since you
        want the loss to go down, not up, you move each weight a small step in the opposite
        direction. That&apos;s the entire idea. Not solve, just repeatedly ask &ldquo;which way is
        downhill from here&rdquo; and take a step.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Picture hiking down a mountain in thick fog. You can&apos;t see the valley, you can&apos;t
        see the whole terrain, but you can feel which way the ground slopes under your feet right
        now. So you take a step in the steepest downhill direction, feel the new slope, take
        another step. The size of each stride is the <strong>learning rate</strong>. Too large a
        stride and you don&apos;t settle into the valley, you step clean over it and land partway
        up the opposite slope, sometimes farther from the bottom than where you started. Too small
        a stride and you&apos;ll get there eventually, but eventually might mean more compute than
        anyone is willing to pay for. This is iterative by nature. One step is not training, it is
        one update out of the hundreds of thousands a real run performs.
      </p>

      <LossLandscape />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Start the weight above away from the valley floor and hit Step a few times with the
        learning rate left low. Each click nudges the point downhill and the loss number ticks
        down. Now drag the learning rate slider up past where the stride overshoots the bottom of
        the curve. Keep clicking. Instead of settling, the point starts bouncing from one side of
        the valley to the other, and if the rate is high enough each bounce lands farther out than
        the last, the exact mechanical shape of a training run that diverges instead of converges.
      </p>

      <div className="border-l-2 border-brand-warning bg-brand-warning/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-brand-text-muted">
          <strong>In practice:</strong> this demo plots one weight against loss so the curve fits
          on screen and the slope is something you can see. A real model&apos;s loss landscape has
          one axis per parameter, billions of them, and no human has ever seen its actual shape.
          The directional logic doesn&apos;t change, compute the slope, step opposite it, but real
          training also varies the learning rate on a schedule over the course of a run rather than
          holding it fixed, a detail this article sets aside to keep the mechanism visible.
        </p>
      </div>
    </section>
  );
}
