import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ContextWindowSection() {
  return (
    <section>
      <h2 id="the-context-window-is-the-resource-you-manage" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        The context window is the one resource you actually manage
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The API call in the first section had no memory of anything. Every model behind one of
        these APIs is stateless between calls: it doesn&apos;t remember your last message, your
        last conversation, or that you exist at all, unless you send that history back yourself,
        every single time.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A four-message conversation, resent in full on the next call
        </p>
        <CodeBlock
          code={`messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What's 2+2?"},
    {"role": "assistant", "content": "4."},
    {"role": "user", "content": "And that times 10?"},
]
# every one of these four messages gets sent, and billed, on this call`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        By turn ten of a real conversation, you&apos;re resending and re-paying for the first
        nine turns on every single call, not just the newest message. This is what the context
        window actually is: the maximum number of tokens, input and output combined, that one
        call can hold. It varies by model, and it&apos;s a hard limit, not a soft one.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Some providers offer a &quot;thread&quot; or &quot;session&quot; API as a convenience
        wrapper, where you don&apos;t manually resend history yourself. Underneath, the same
        thing is still happening: the full history is still being assembled and sent to the
        model on your behalf, still counted, still billed, still bounded by the same limit. The
        wrapper hides the bookkeeping. It doesn&apos;t change what the model actually receives.
      </p>
    </section>
  );
}
