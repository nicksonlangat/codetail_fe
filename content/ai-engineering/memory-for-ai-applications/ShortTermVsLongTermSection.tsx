export function ShortTermVsLongTermSection() {
  return (
    <section>
      <h2 id="short-term-context-vs-long-term-memory" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        The message list is not memory, it&apos;s the current conversation
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Everything about resending history from What Is an LLM API and trimming it in Context
        Engineering was about one conversation, bounded, growing turn by turn, gone the moment
        the session ends. &quot;Memory&quot; as a product feature means something that survives
        past that: a fact from last week&apos;s conversation still being true in today&apos;s.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        That&apos;s not a bigger version of the same message list, it&apos;s a genuinely
        different mechanism. A new conversation starts with an empty history by default, nothing
        automatically carries over, so surfacing a relevant fact from three weeks ago means
        actively retrieving it and inserting it into this conversation&apos;s context, before the
        user has said anything that would obviously trigger it.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        That retrieval step looks a lot like RAG, because structurally it is: a store of
        candidate facts, an embedding-based or rule-based lookup for what&apos;s relevant right
        now, and a decision about how much of it actually earns a place in this conversation&apos;s
        limited budget.
      </p>
    </section>
  );
}
