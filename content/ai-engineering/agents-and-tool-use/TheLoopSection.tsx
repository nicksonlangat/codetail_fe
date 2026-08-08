import { CodeBlock } from "@/components/blog/interactive/code-block";

export function TheLoopSection() {
  return (
    <section>
      <h2 id="the-plan-call-observe-loop" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        An agent is the tool-calling loop from three articles ago, repeated
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Structured Output and Tool Calling covered one round of this: the model decides to call a
        function, your code runs it, the result goes back as a message. An agent is that same
        exchange, just not stopped after one round. It keeps going until the model stops asking
        for tools and returns a plain answer instead.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          The loop, not just the single exchange
        </p>
        <CodeBlock
          code={`messages = [{"role": "user", "content": user_request}]

while True:
    response = client.chat.completions.create(model="gpt-4o", messages=messages, tools=tools)
    message = response.choices[0].message
    messages.append(message)

    if not message.tool_calls:
        return message.content  # the model is done, this is the final answer

    for call in message.tool_calls:
        result = execute_tool(call)
        messages.append({
            "role": "tool", "tool_call_id": call.id, "content": json.dumps(result),
        })`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Nothing about this loop is exotic, it&apos;s the same request/response exchange from
        earlier in this series wrapped in a{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">while</code>{" "}
        that keeps feeding tool results back until the model decides it has enough to answer. The
        word &quot;agentic&quot; describes this loop, not some separate piece of machinery.
      </p>
    </section>
  );
}
