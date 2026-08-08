import { CodeBlock } from "@/components/blog/interactive/code-block";

export function QueryKeyValueSection() {
  return (
    <section>
      <h2 id="query-key-value" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Query, key, and value: three questions per token
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Every token&apos;s embedding gets multiplied by three separate, learned weight matrices,
        exactly the matrix multiplication from the previous article, producing three different
        vectors per token: a <strong>query</strong>, a <strong>key</strong>, and a{" "}
        <strong>value</strong>. A useful, if imperfect, analogy: the query is what this token is
        looking for, the key is what each token, including itself, has to offer, and the value is
        what that token actually contributes once it&apos;s chosen as relevant.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Computing attention is three steps, and the first one should look familiar. Take the dot
        product of one token&apos;s query with every token&apos;s key, the exact same operation the
        Embeddings article used to measure how close two vectors are. A high dot product means
        &ldquo;this key matches what I&apos;m looking for.&rdquo; That gives one raw compatibility
        score per pair of tokens.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Second, turn those raw scores into a proper probability distribution with{" "}
        <strong>softmax</strong>, the same reweighting function from the very first article in this
        series, the one that turned raw model scores into next-token probabilities. Here it turns
        raw compatibility scores into <strong>attention weights</strong> that sum to exactly 1
        across every token in the sequence.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Third, use those weights to take a weighted sum of every token&apos;s value vector. A token
        that scored a high attention weight contributes most of its value to the result, a token
        that scored near zero contributes almost nothing. That weighted sum is the output, a new
        vector for the query token that now carries information pulled in from wherever in the
        sequence it turned out to be relevant.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Self-attention for one query token, against every key
        </p>
        <CodeBlock
          code={`import math

def attention(query, keys, values):
    d_k = len(query)
    scores = [dot(query, k) / math.sqrt(d_k) for k in keys]
    weights = softmax(scores)
    output = [0.0] * len(values[0])
    for w, v in zip(weights, values):
        for d in range(len(v)):
            output[d] += w * v[d]
    return output, weights`}
          output={``}
        />
      </div>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg">
        <p className="text-[13px] text-brand-text-muted italic">
          Rule: the divide-by-square-root-of-d_k step keeps the dot products from growing too large
          as vector dimensions increase, large scores push softmax toward an almost all-or-nothing
          distribution, which makes training unstable. This is the &ldquo;scaled&rdquo; in &ldquo;scaled
          dot-product attention,&rdquo; the name this mechanism goes by in the original transformer
          paper.
        </p>
      </div>
    </section>
  );
}
