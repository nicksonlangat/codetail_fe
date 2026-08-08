import { CodeBlock } from "@/components/blog/interactive/code-block";

export function PromptAsSpecSection() {
  return (
    <section>
      <h2 id="a-prompt-is-a-spec" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        A prompt is a spec, and inconsistent output usually means an incomplete one
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Ask for a summary and leave everything else unstated, and you get whatever shape the
        model feels like producing on that particular call: three sentences this time, five
        bullets next time, an unrequested intro paragraph the time after that.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A request with no actual specification in it
        </p>
        <CodeBlock code={`Summarize this article.`} />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        That inconsistency isn&apos;t the model being unreliable. Nothing in the prompt specified
        a contract for it to satisfy, so there&apos;s nothing to be consistent about. Compare it
        to a function with no type signature and no docstring, the caller can&apos;t complain the
        return value is unpredictable when nothing ever said what it should look like.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          The same request, written as an actual spec
        </p>
        <CodeBlock
          code={`Summarize the following article in exactly 3 bullet points, each under 20
words. Do not include an introductory sentence before the bullets. If the
article does not contain enough substantive content to summarize, respond
with exactly: "Not enough content to summarize."

Article:
{article_text}`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Same task, same model, dramatically less variance in the output, because the second
        version actually specifies a shape (exactly 3 bullets, a length cap, no preamble) and an
        edge case (what to do with thin input). None of this is a wording trick or a clever
        phrase, it&apos;s the same discipline as writing a function signature: say what goes in,
        say what comes out, say what happens at the edges.
      </p>
    </section>
  );
}
