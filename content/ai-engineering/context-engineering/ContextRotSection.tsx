export function ContextRotSection() {
  return (
    <section>
      <h2 id="context-rot" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        A bigger window doesn&apos;t mean every token in it gets equal attention
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The natural response to a model losing track of something is to paste in more context,
        the whole document instead of a page of it, the whole conversation instead of a summary.
        Research on long-context models keeps finding the same shape of problem: performance on
        information in the middle of a long context degrades measurably compared to information
        near the start or end, well before the model hits its stated context limit.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Put a clear system instruction first, fifty pages of pasted reference material next, and
        the user&apos;s actual question last, and the instruction from the very start of the
        prompt is exactly the thing most likely to get followed loosely by the time the model
        reaches the end. Not because the model &quot;forgot&quot;, everything is still technically
        in the context, but because more tokens competing for the same attention mechanism means
        every individual token gets a thinner slice of it.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        This is the actual argument for context engineering as its own discipline. The context
        window isn&apos;t a bucket you fill until it&apos;s full. It&apos;s a limited resource
        where what you put in it, and in what order, changes how reliably the model uses any of
        it.
      </p>
    </section>
  );
}
