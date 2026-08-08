import { CodeBlock } from "@/components/blog/interactive/code-block";

export function RequestResponseShapeSection() {
  return (
    <section>
      <h2 id="request-response-shape" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        A chat completion is a list of messages in, one message out
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Most people&apos;s first mental model of &quot;calling an LLM&quot; is calling any other API:
        send a request, get a response, done. That model holds up right up until the bill
        arrives, or the fifth message in a conversation costs noticeably more than the first one
        did. An LLM API isn&apos;t a function that answers a question. It&apos;s a function that
        continues a list of messages, and everything in this article follows from that.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A single chat completion call
        </p>
        <CodeBlock
          code={`response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What's the capital of France?"},
    ],
)

print(response.choices[0].message.content)`}
          output={`The capital of France is Paris.`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Three things worth noticing before the rest of this series builds on them.{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">messages</code>{" "}
        is a list, not a single prompt string, each entry tagged with a role (
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">system</code>,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">user</code>,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">assistant</code>
        ), the actual subject of the next article in this series.{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">model</code>{" "}
        picks which model answers, and different models on the same API can vary wildly in cost,
        speed, and capability.{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">choices</code>{" "}
        is a list too, because you can ask for more than one candidate completion back from a
        single call.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        This shape isn&apos;t universal by accident. Most providers converged on something close
        to it, and plenty of open-weight model servers deliberately expose an
        OpenAI-compatible endpoint even when the model underneath has nothing to do with OpenAI,
        specifically so existing client code keeps working unchanged. Learn this shape once and
        most of what you build transfers across providers with a changed base URL and a changed
        model name, not a rewrite.
      </p>
    </section>
  );
}
