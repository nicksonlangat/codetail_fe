import { CodeBlock } from "@/components/blog/interactive/code-block";

export function TheArchitectureSection() {
  return (
    <section>
      <h2 id="the-architecture" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        The request path, and everything running alongside it
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Follow one message from the user through the system, and almost every article in this
        series shows up as one step in the path.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          The request path
        </p>
        <CodeBlock
          code={`user message
  -> assemble context (system prompt + retrieved docs + trimmed history)   [Context Engineering]
  -> retrieve relevant doc chunks for this question                        [Embeddings, RAG]
  -> model call, may request the account-lookup tool                       [Tool Calling]
  -> execute tool if requested, feed result back, model call again          [Agents and Tool Use]
  -> output filter checks the response before it's shown                    [Guardrails]
  -> stream the response to the user                                       [Latency and Streaming]`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        None of that runs in isolation. A background pipeline keeps the documentation index
        current every time the docs change, chunking and embedding new content the same way the
        original corpus was built. Every step in the request path emits a trace, the full request,
        which tool was called and with what arguments, what got retrieved, so a wrong answer is
        something you can actually investigate. Every change to the system prompt or the retrieval
        setup runs against a golden set before it ships, the same discipline this series has
        applied to every article that touched a prompt.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        The account-lookup tool only exists in this session because this feature genuinely needs
        it, and it exposes nothing beyond read access to the current user&apos;s own account,
        least-privilege scoping applied for exactly the reason the Guardrails article argued for
        it.
      </p>
    </section>
  );
}
