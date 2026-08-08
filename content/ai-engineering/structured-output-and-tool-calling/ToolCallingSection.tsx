import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ToolCallingSection() {
  return (
    <section>
      <h2 id="tool-calling-is-the-same-mechanism" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Tool calling is the same mechanism, aimed at a decision instead of a blob
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Instead of constraining the model to any valid JSON object, tool calling constrains it to
        one of a specific set of named functions, called with arguments matching that
        function&apos;s own schema.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Describing a function the model is allowed to call
        </p>
        <CodeBlock
          code={`tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "Get the current weather for a city",
        "parameters": {
            "type": "object",
            "properties": {"city": {"type": "string"}},
            "required": ["city"],
        },
    },
}]

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "What's the weather in Lisbon?"}],
    tools=tools,
)

call = response.choices[0].message.tool_calls[0]
print(call.function.name, call.function.arguments)`}
          output={`get_weather {"city": "Lisbon"}`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The model didn&apos;t answer the weather question, it isn&apos;t connected to a weather
        service and has no way to know today&apos;s forecast. It decided which function answers
        this kind of question and produced the arguments to call it with. Nothing has executed
        yet, the model only emitted a structured decision.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Your code runs the real function, and the result goes back into the message history as
        its own message, not folded into the model&apos;s output:
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Closing the loop
        </p>
        <CodeBlock
          code={`result = get_weather("Lisbon")
messages.append({"role": "assistant", "tool_calls": [call]})
messages.append({
    "role": "tool",
    "tool_call_id": call.id,
    "content": json.dumps(result),
})
# call the API again with this appended; the model now has a real result to answer from`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Decide, execute, feed the result back, let the model continue: that loop, repeated, is the
        entire mechanism behind an agent. Agents and Tool Use, later in this series, builds
        directly on it.
      </p>
    </section>
  );
}
