import { CodeBlock } from "@/components/blog/interactive/code-block";

export function WhenTheWindowRunsOutSection() {
  return (
    <section>
      <h2 id="when-the-window-runs-out" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        What happens when a naive chat loop hits the limit
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Put the last two sections together and the failure mode writes itself.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A chat function that keeps every message forever
        </p>
        <CodeBlock
          code={`history = [{"role": "system", "content": "You are a helpful assistant."}]

def chat(user_message):
    history.append({"role": "user", "content": user_message})
    response = client.chat.completions.create(model="gpt-4o", messages=history)
    reply = response.choices[0].message.content
    history.append({"role": "assistant", "content": reply})
    return reply`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">history</code>{" "}
        only ever grows. Cost per call climbs turn over turn, long before anything breaks, because
        every earlier turn is still being resent. Eventually a call doesn&apos;t come back slower
        or more expensive, it fails outright: the request gets rejected for exceeding the
        model&apos;s maximum context length. Not a warning on the way there, a hard error, usually
        arriving exactly when a long-running conversation has become the most valuable to
        whoever&apos;s having it.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Nothing about this function is unreasonable to write, it&apos;s the first version almost
        anyone building a chat feature writes, and it&apos;s exactly why the rest of this series
        exists. Deciding what actually belongs in that growing message list, instead of everything
        that&apos;s ever been said, is its own discipline, covered in{" "}
        <span className="text-brand-text font-medium">Context Engineering</span> two articles
        from here. Deciding what to remember across an entire relationship with a user, not just
        within one growing list, is covered later in{" "}
        <span className="text-brand-text font-medium">Memory for AI Applications</span>. Both
        exist because of the one constraint this article has been building to: the window is
        finite, and something has to decide what fills it.
      </p>
    </section>
  );
}
