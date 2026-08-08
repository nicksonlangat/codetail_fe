export function SupervisedFineTuningSection() {
  return (
    <section>
      <h2
        id="supervised-fine-tuning"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Supervised fine-tuning: teaching the format
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The fix for the problem above isn&apos;t a new architecture and isn&apos;t a new loss
        function. It&apos;s the exact same cross-entropy next-token loss from{" "}
        <strong>Loss and Backpropagation</strong>, computing the exact same gradients through the
        exact same transformer blocks. What changes is the data. Instead of a scrape of the open
        web, the model keeps training on a curated set of{" "}
        <span className="font-mono">(instruction, ideal response)</span> pairs, written or vetted
        by humans specifically to demonstrate what a good answer looks like.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        This step is called <strong>supervised fine-tuning</strong>, SFT for short, and
        &ldquo;fine&rdquo; is doing real work in that name. Pretraining runs over trillions of
        tokens of whatever text was available. SFT runs over a dataset that might be tens of
        thousands to a few million examples, tiny by comparison, but built for exactly one purpose:
        show the model, over and over, what &ldquo;answer the question directly&rdquo; looks like
        instead of &ldquo;continue the text however the web tends to continue it.&rdquo; Each
        example is typically wrapped with role markers, something like a{" "}
        <span className="font-mono">user</span> turn followed by an{" "}
        <span className="font-mono">assistant</span> turn, so the model also picks up the
        conversational structure itself: where a turn starts, where it ends, whose voice is
        speaking.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          Rule: SFT doesn&apos;t teach the model new facts or new capabilities, it teaches the
          model a new default behavior for old capabilities it already has. The knowledge came
          from pretraining. The habit of answering directly comes from SFT.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        After SFT, a prompt like &ldquo;How do I bake bread?&rdquo; reliably gets a direct recipe
        instead of a list of related forum questions, because every training example the model saw
        at this stage ended a question with a direct answer, never with more questions. That&apos;s
        imitation learning: the model is copying the shape of good behavior from examples of it.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        But imitation has a ceiling. SFT data has one ideal response per prompt, written by one
        labeler on one day. It has nothing to say about the harder question: given two responses
        that are both reasonable, both correctly formatted, both factually fine, which one is
        actually better. There&apos;s no single &ldquo;correct&rdquo; token sequence to imitate for
        a judgment call like that, and next-token loss has no way to express &ldquo;this one, but
        only slightly more than that one.&rdquo; That gap is what the next technique closes.
      </p>
    </section>
  );
}
