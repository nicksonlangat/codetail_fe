import { CodeBlock } from "@/components/blog/interactive/code-block";

export function StreamingSection() {
  return (
    <section>
      <h2 id="streaming-responses" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        The tokens exist one at a time, so the user can see them one at a time
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        What Is an LLM API covered output being generated token by token, which is also why a
        response can be shown to the user as it&apos;s generated instead of held until the whole
        thing finishes. Total generation time doesn&apos;t change, the model still takes as long
        as it takes, but perceived latency drops sharply: the first token appearing in a few
        hundred milliseconds reads as fast, even for a response that takes ten full seconds to
        finish.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Consuming a streamed response as it arrives
        </p>
        <CodeBlock
          code={`stream = client.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    stream=True,
)

for chunk in stream:
    token = chunk.choices[0].delta.content
    if token:
        print(token, end="", flush=True)`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Streaming trades one thing for the perceived-speed win: you can&apos;t validate or parse
        the full response until it&apos;s done arriving, which matters for the structured-output
        and tool-calling cases from earlier in this series, where the output needs to be complete
        and valid JSON before anything downstream can safely act on it. Stream for a chat interface
        a person is reading. Wait for the full response where something else is about to parse it.
      </p>
    </section>
  );
}
