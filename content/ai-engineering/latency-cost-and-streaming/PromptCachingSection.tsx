export function PromptCachingSection() {
  return (
    <section>
      <h2 id="prompt-caching" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Paying full price to reprocess the same system prompt on every call is a choice
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A long system prompt, or a large document included as context, is often identical across
        many calls, the same instructions, the same reference material, only the user&apos;s
        message actually changing. Reprocessing that identical prefix from scratch on every single
        call is wasted work, and most providers offer prompt caching specifically to avoid it.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A cache hit is both cheaper and faster for the cached portion, but only for the exact
        prefix that matches, byte for byte, a previous call. That constraint changes how a prompt
        gets structured in practice: the stable content, system instructions, reference documents,
        tool definitions, belongs at the start, and the part that changes every call, the
        user&apos;s actual message, belongs at the end. Put the variable part first and every call
        invalidates the cache before it can help.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        This is the same discipline as the prompt assembly pipeline from Context Engineering, just
        with an extra constraint: order isn&apos;t only about what the model attends to well, it
        also decides whether you&apos;re paying to reprocess the same ten thousand tokens on every
        one of ten thousand calls.
      </p>
    </section>
  );
}
