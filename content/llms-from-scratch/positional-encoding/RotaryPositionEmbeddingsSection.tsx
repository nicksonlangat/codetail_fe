import { CodeBlock } from "@/components/blog/interactive/code-block";

export function RotaryPositionEmbeddingsSection() {
  return (
    <section>
      <h2
        id="rotary-position-embeddings"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Rotary position embeddings (RoPE): encoding position as rotation
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Most current open-weight models, Llama, Mistral, and plenty of others, don&apos;t add a
        positional vector at all. They use <strong>rotary position embeddings</strong>, RoPE for
        short, which throws out the &ldquo;add a fixed vector&rdquo; idea entirely and instead{" "}
        <strong>rotates</strong> the query and key vectors by an angle proportional to their
        position, right before the dot product in attention runs.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Picture each pair of dimensions in a query vector as a point on a 2D plane. RoPE spins that
        point around the origin by an angle equal to <span className="font-mono">position &times; &theta;</span>,
        for some fixed frequency <span className="font-mono">&theta;</span>, the same frequency
        schedule idea as the sine and cosine waves above, just applied as a rotation instead of an
        addition. A token at position 0 doesn&apos;t rotate at all. A token at position 10 rotates
        ten steps around. Different dimension pairs rotate at different speeds, fast pairs and slow
        pairs, exactly like the clock hands from the previous section.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Rotating a 2D vector by position &times; theta
        </p>
        <CodeBlock
          code={`import math

def rotate(v, pos, theta):
    angle = pos * theta
    c, s = math.cos(angle), math.sin(angle)
    return (v[0] * c - v[1] * s, v[0] * s + v[1] * c)

def dot(a, b):
    return a[0] * b[0] + a[1] * b[1]

q, k, theta = (1.0, 0.0), (0.0, 1.0), 0.5

# same relative distance, three different absolute positions
print(dot(rotate(q, 0, theta),   rotate(k, 3, theta)))
print(dot(rotate(q, 5, theta),   rotate(k, 8, theta)))
print(dot(rotate(q, 105, theta), rotate(k, 108, theta)))`}
          output={`-0.997495
-0.997495
-0.997495`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        That&apos;s the entire point of RoPE, made concrete. Query at position 0 against key at
        position 3, query at position 5 against key at position 8, query at position 105 against
        key at position 108: three completely different absolute positions, but every pair sits
        exactly 3 apart, and every one produces the identical dot product. Rotating both vectors by
        their own position and then taking the dot product cancels out the absolute positions
        algebraically and leaves only the distance between them. Sinusoidal encoding hands the model
        relative structure it has to learn to use. RoPE makes relative distance the only thing the
        attention score can see in the first place.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          In practice: RoPE is applied only to queries and keys, never to values. It changes how
          strongly two tokens attend to each other, not what content gets passed through once
          they&apos;re chosen. It also adds no extra parameters and doesn&apos;t change the
          embedding dimension, the rotation happens in place, right before the QK^T dot product
          inside every attention head.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        This relative-distance property is also why RoPE tolerates longer sequences better than
        sinusoidal or learned encodings, a claim the next section puts to the test.
      </p>
    </section>
  );
}
