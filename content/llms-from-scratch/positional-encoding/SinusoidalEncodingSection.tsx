import { CodeBlock } from "@/components/blog/interactive/code-block";
import { PositionalEncodingExplorer } from "@/components/blog/interactive/positional-encoding-explorer";

export function SinusoidalEncodingSection() {
  return (
    <section>
      <h2
        id="sinusoidal-positional-encoding"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Sinusoidal positional encoding: a unique fingerprint per position
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The original transformer paper&apos;s fix is almost embarrassingly simple: build a fixed
        vector for each position and <strong>add it</strong> to that token&apos;s embedding before
        anything else happens. Position 0 gets one vector, position 1 gets a different vector,
        position 2 a different one again, all the way out. Add position&apos;s vector into the
        embedding and every downstream computation, attention included, now has access to
        &ldquo;where,&rdquo; because it&apos;s baked directly into the numbers it&apos;s already
        operating on.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The question is how to build a vector per position that&apos;s actually useful. A naive
        option, just use the integer position value itself, breaks immediately: raw position
        numbers grow unbounded and swamp the embedding at long sequence lengths. The paper&apos;s
        answer is sine and cosine waves at a different frequency for every pair of dimensions in
        the embedding. Think of each dimension pair as a clock hand: the first pair spins once
        almost every position, a fast hand. The last pair barely moves at all across thousands of
        positions, a slow hand. Read off every hand&apos;s position at once and you get a reading
        that never repeats for a very long time, exactly like how the hour, minute, and second hand
        together tell you the exact time, not just the second.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Sinusoidal positional encoding for one position
        </p>
        <CodeBlock
          code={`import math

def positional_encoding(pos, d_model):
    pe = [0.0] * d_model
    for i in range(0, d_model, 2):
        freq = 1 / (10000 ** (i / d_model))
        pe[i] = math.sin(pos * freq)
        if i + 1 < d_model:
            pe[i + 1] = math.cos(pos * freq)
    return pe

positional_encoding(0, 8)
positional_encoding(1, 8)
positional_encoding(2, 8)`}
          output={`[0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0]
[0.8415, 0.5403, 0.0998, 0.995, 0.01, 1.0, 0.001, 1.0]
[0.9093, -0.4161, 0.1987, 0.9801, 0.02, 0.9998, 0.002, 1.0]`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Look at those three outputs. Every one is a different pattern, and the early dimensions
        (fast hands, high frequency) swing wildly between positions 0, 1, and 2, while the late
        dimensions (slow hands, low frequency) barely budge. That&apos;s deliberate. It also means
        the encoding needs no training at all, it&apos;s pure math, computed once and reused for
        every sequence the model ever sees.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Slide through the positions below and watch both views update: the wave across one
        position&apos;s dimensions on top, and every position from 0 to 20 stacked as a grid on the
        bottom. No two rows in that grid ever match.
      </p>

      <PositionalEncodingExplorer />

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          Rule: sine and cosine also give the model relative position almost for free. Because of
          the trigonometric angle-addition identities, the encoding for position{" "}
          <span className="font-mono">pos + k</span> can be written as a fixed linear function of
          the encoding for position <span className="font-mono">pos</span>, for any offset{" "}
          <span className="font-mono">k</span>. A model can, in principle, learn to attend to
          &ldquo;the token three positions back&rdquo; using a consistent transformation regardless
          of where in the sequence it is.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        This scheme shipped in the original transformer and worked well enough to prove the
        architecture. But &ldquo;in principle&rdquo; is doing real work in that rule above, a model
        has to learn to exploit that relative structure, it isn&apos;t handed a relative distance
        directly. The next section covers a newer approach that builds relative position into the
        attention arithmetic itself.
      </p>
    </section>
  );
}
