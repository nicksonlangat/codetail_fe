export function DefenseInDepthForAgentsSection() {
  return (
    <section>
      <h2 id="defense-in-depth-for-agents" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        No single layer here is the fix, the same as everywhere else in this series
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Put the last three sections together and a pattern from the Web Security series shows up
        again: every layer catches what the others miss, and none of them is sufficient alone.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Least-privilege tool access is the one that does the most quiet work. An agent built to
        summarize email doesn&apos;t need a send-email tool available in the same session just
        because it would be convenient to add later, the exact same reasoning as a database
        account holding only the permissions its job requires. If a prompt injection or a
        jailbreak does get through, the blast radius is bounded by what tools were actually in
        reach, not by how well the model resisted.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Human confirmation for high-stakes actions, from Bounding the Loop earlier in this series,
        is the layer that catches what both the model and the output filter miss: a proposed
        action that&apos;s well-formed, plausible, and still wrong to execute without someone
        actually looking at it first.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        None of this is unique to AI systems. It&apos;s the same logic as treating every input at
        a trust boundary as untrusted until checked, the entire premise of the Web Security series.
        An LLM app just has more boundaries than a traditional one, every document it reads and
        every tool result it receives is one, and each of them needs the same posture the rest of
        that series already argued for.
      </p>
    </section>
  );
}
