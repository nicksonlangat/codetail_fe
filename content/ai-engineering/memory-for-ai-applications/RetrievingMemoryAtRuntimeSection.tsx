export function RetrievingMemoryAtRuntimeSection() {
  return (
    <section>
      <h2 id="retrieving-memory-at-runtime" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Pulling in the right memories is context engineering all over again
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A store of remembered facts is only useful if the right ones show up in this
        conversation, at the moment they&apos;re relevant, without dragging in everything else
        that&apos;s ever been stored about this user.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        That&apos;s the same embedding-based retrieval from earlier in this series, aimed at a
        memory store instead of a document corpus, and it inherits the same failure modes. Pull in
        too little and the assistant &quot;forgets&quot; something that mattered, the exact
        complaint memory features exist to prevent. Pull in too much and every one of those facts
        is competing for attention against the actual question being asked right now, the same
        context rot from earlier in this series, just caused by old memories instead of an
        oversized pasted document.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Memory isn&apos;t a separate subsystem that gets to skip the token budget. It&apos;s one
        more source competing for the same limited context window as retrieved documents, tool
        results, and conversation history, and it earns its place in that budget the same way
        everything else has to: by actually being relevant to what&apos;s being asked right now.
      </p>
    </section>
  );
}
