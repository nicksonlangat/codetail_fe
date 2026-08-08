export function WhyAgentsFailSilentlySection() {
  return (
    <section>
      <h2 id="why-agents-fail-silently" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        A wrong turn doesn&apos;t throw an exception
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A traditional program that hits a bug tends to announce it, a stack trace, a crash, an
        obviously malformed output. An agent that goes down the wrong reasoning path does none of
        that. It keeps calling tools, keeps getting real results back, keeps producing plausible
        intermediate steps, and can arrive at a confidently wrong final answer that reads exactly
        like a correct one.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Worse failure modes are quieter still: a loop that calls the same tool repeatedly with
        minor variations, chasing a solution that isn&apos;t there, or one that never recognizes
        it has enough information and keeps gathering more. None of these look like an error from
        the outside. They look like an agent doing exactly what agents do, working through a
        problem step by step, right up until someone checks whether the steps actually led
        anywhere.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        The practical response is instrumentation, not optimism: a maximum iteration count so a
        confused loop terminates instead of running indefinitely, and real visibility into every
        step it took, not just the final answer, which is exactly what the Observability article
        later in this series is built around.
      </p>
    </section>
  );
}
