export function TheProductSection() {
  return (
    <section>
      <h2 id="the-product-were-building" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        A support assistant that answers from docs and can actually look things up
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        One concrete feature, to tie fourteen articles of individual pieces into a single system:
        a customer support assistant. It answers questions from product documentation, can look up
        a real customer&apos;s account and billing status when a question needs it, and hands off
        to a human when it isn&apos;t confident or the request is out of scope.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Nothing about that description is exotic, which is the point. It needs an LLM API call at
        its core, a system prompt that actually specifies its behavior instead of vaguely asking it
        to &quot;be helpful,&quot; retrieval over a documentation corpus that changes every time a
        product update ships, and one tool for account lookups. It does not need a five-agent
        orchestration or a fine-tuned model, and deciding that up front, deliberately, is itself
        part of the architecture.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        The rest of this article walks the request end to end, then works backward through what
        has to exist before any of it can ship responsibly.
      </p>
    </section>
  );
}
