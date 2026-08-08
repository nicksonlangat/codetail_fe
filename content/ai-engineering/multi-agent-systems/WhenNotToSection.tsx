export function WhenNotToSection() {
  return (
    <section>
      <h2 id="when-multi-agent-is-the-wrong-call" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Signs it&apos;s time to collapse back down to one
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A few concrete signals, worth checking against honestly rather than assuming the
        architecture is fine because it was designed carefully.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        If the &quot;agents&quot; always run in the same fixed order with no branching based on
        what the previous one returned, that&apos;s not a multi-agent system, it&apos;s a regular
        pipeline of function calls wearing agent framing, and it should probably be written as
        one. If debugging a bad outcome requires reasoning about the interaction between two
        agents rather than either one individually, that&apos;s an emergent failure mode, and
        emergent failure modes are exactly what a single-agent system doesn&apos;t have to worry
        about. If latency and cost have multiplied across the extra hops without a matching
        improvement in output quality, the coordination overhead is a pure cost with no offsetting
        benefit.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Any of these showing up is a reason to collapse back to one agent with a bigger toolset,
        or a fixed pipeline with the model called once or twice inside it, not a reason to add a
        third agent to fix what the second one is doing wrong.
      </p>
    </section>
  );
}
