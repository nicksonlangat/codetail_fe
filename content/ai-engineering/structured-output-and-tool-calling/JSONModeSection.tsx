import { CodeBlock } from "@/components/blog/interactive/code-block";

export function JSONModeSection() {
  return (
    <section>
      <h2 id="json-mode-and-schema-validation" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        JSON mode fixes syntax. It doesn&apos;t fix shape.
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Most providers offer a structured output mode that constrains generation itself, not the
        wording of the prompt, so that the model is only allowed to produce tokens that form valid
        JSON. No code fence, no preamble, no trailing comma, because those aren&apos;t reachable
        outputs anymore.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          The constraint lives in the API call, not the wording
        </p>
        <CodeBlock
          code={`response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{
        "role": "user",
        "content": "Extract the name and age from: 'John is 34 years old.'",
    }],
    response_format={"type": "json_object"},
)
print(response.choices[0].message.content)`}
          output={`{"name": "John", "age": 34}`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Guaranteed valid JSON is not the same as guaranteed matching JSON. Nothing stops this mode
        from returning{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">{`{"person_name": "John", "years_old": 34}`}</code>{" "}
        instead, syntactically perfect, and still not the shape your code downstream expects. The
        model is free-forming the keys unless you constrain those too.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Validate the shape the same way you&apos;d validate any external API response
        </p>
        <CodeBlock
          code={`class PersonExtraction(BaseModel):
    name: str
    age: int

data = PersonExtraction.model_validate_json(response.choices[0].message.content)`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Two separate layers, doing two separate jobs: the API&apos;s structured output mode guarantees
        syntax, a schema validator guarantees shape. Skipping the second layer because the first
        one already sounds like &quot;structured&quot; is how a wrong field name reaches
        production instead of failing loudly in a validator where it belongs.
      </p>
    </section>
  );
}
