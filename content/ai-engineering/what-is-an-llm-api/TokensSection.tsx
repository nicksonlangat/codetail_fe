import { CodeBlock } from "@/components/blog/interactive/code-block";

export function TokensSection() {
  return (
    <section>
      <h2 id="tokens-are-the-unit" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Tokens are what you&apos;re billed for, and what you&apos;re waiting on
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A traditional API charges per request, or doesn&apos;t charge per call at all. An LLM API
        charges per token, for both the tokens you sent and the tokens it generated back, and a
        token isn&apos;t a word.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Counting tokens, not words
        </p>
        <CodeBlock
          code={`enc = tiktoken.encoding_for_model("gpt-4o")
print(len(enc.encode("Hello, world!")))`}
          output={`4`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Two words, four tokens: the tokenizer (covered in depth in the LLMs from Scratch series if
        you want the internals) splits text into subword chunks, not words, and punctuation and
        whitespace often get their own tokens too. A rough working estimate for English text is
        about four characters per token, close enough to reason about cost and context limits day
        to day, not close enough to bill against precisely.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The pricing split matters as much as the count. Output tokens are typically several times
        more expensive per token than input tokens, because generating each one requires a full
        forward pass through the model, one token at a time, while input tokens get processed in
        parallel in a single pass. A request that reads a long document and answers in one word is
        cheap. A request that reads one sentence and writes three paragraphs back is not, even
        though the second one &quot;feels&quot; like less work went into the prompt.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-brand-text-muted italic">
          Tokens are also the latency unit, not just the cost unit. Output is generated one token
          at a time, so asking for a longer response doesn&apos;t just cost more, it takes
          proportionally longer to finish, in a way a traditional API call generally doesn&apos;t.
        </p>
      </div>
    </section>
  );
}
