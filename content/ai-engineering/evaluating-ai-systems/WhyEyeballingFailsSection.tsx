export function WhyEyeballingFailsSection() {
  return (
    <section>
      <h2 id="why-eyeballing-a-few-examples-fails" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Looking good on one example is weaker evidence than it feels like
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Prompting as Interface Design ended on this exact problem: a change that looks right on
        the case in front of you can quietly break three others you weren&apos;t looking at. With
        LLM output specifically, that risk is worse than it is for ordinary software, because a
        wrong answer rarely looks wrong. It reads fluently, confidently, in the same voice as a
        correct one.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A traditional bug tends to announce itself, a stack trace, a null pointer, an obviously
        malformed response. A subtly wrong summary, a hallucinated field, an edge case handled
        with the wrong tone, all of these pass a glance. &quot;It looks fine&quot; from a person
        skimming a playground is a real signal and a weak one, exactly proportional to how many
        cases they actually looked at, which for a quick check is approximately one.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        None of this means the instinct to check output before shipping is wrong. It means
        checking has to survive being repeated automatically, at scale, against more cases than a
        person will patiently reread every time something changes.
      </p>
    </section>
  );
}
