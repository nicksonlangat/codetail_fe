export function JailbreaksSection() {
  return (
    <section>
      <h2 id="jailbreaks" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        A jailbreak comes from the user asking directly, not content hiding a command
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Prompt injection is a third party smuggling instructions in through content the model
        reads. A jailbreak is different: the person actually talking to the model is trying,
        directly, to get it to ignore its own operator&apos;s instructions, through a roleplay
        framing, a hypothetical wrapper, an encoding trick, whatever currently works.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Model providers invest heavily in resisting this at the training level, and that arms race
        is mostly out of an individual application&apos;s hands. What is in an application&apos;s
        hands is not relying on that training as the only layer. The same defense-in-depth
        instinct from the Web Security series applies directly here: least-privilege tool access
        so a successful jailbreak has less to actually do damage with, and output filtering, the
        next section, as a check that doesn&apos;t depend on the model&apos;s training holding up
        every single time.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Assume some fraction of attempts will eventually get past whatever the model was trained
        to resist. The question worth designing around isn&apos;t whether that happens, it&apos;s
        what the model actually has access to when it does.
      </p>
    </section>
  );
}
