import { CodeBlock } from "@/components/blog/interactive/code-block";

export function WhyJSONIsHardSection() {
  return (
    <section>
      <h2 id="why-getting-json-out-is-hard" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Asking nicely for JSON isn&apos;t the same as requiring it
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Ask a model to &quot;return JSON&quot; in plain English, and most of the time it will,
        wrapped in a markdown code fence, prefaced with &quot;Sure, here&apos;s the JSON:&quot;, or
        one trailing comma away from actually parsing.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A request for JSON, made the way it reads in a tutorial
        </p>
        <CodeBlock
          code={`response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{
        "role": "user",
        "content": "Extract the name and age from: 'John is 34 years old.' Return as JSON.",
    }],
)
print(response.choices[0].message.content)`}
          output={`Sure! Here's the JSON:

\`\`\`json
{
  "name": "John",
  "age": 34,
}
\`\`\``}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Feed that string straight to{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">json.loads()</code>{" "}
        and it throws, not because the model misunderstood the task, the extracted values are
        both correct, but because a trailing comma after{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">34</code>{" "}
        isn&apos;t valid JSON, and the code fence and preamble around it aren&apos;t JSON at all.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        The model is predicting the next token of text, the same as it does for any other
        request. &quot;Return JSON&quot; is a request made in English, and English requests get
        interpreted, not enforced. Getting output a parser can actually rely on means moving the
        requirement out of the prompt and into the API call itself.
      </p>
    </section>
  );
}
