export function PastTrainedContextLengthSection() {
  return (
    <section>
      <h2
        id="past-trained-context-length"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        What happens past the trained context length
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Train a model on sequences up to 4,096 tokens and something predictable happens at token
        4,097: quality falls off, sometimes gently, sometimes into outright incoherence. This
        isn&apos;t a bug, it&apos;s the direct consequence of how the positional encodings above
        get learned and used.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Sinusoidal encoding is computed by a fixed formula, so technically nothing stops you from
        plugging in position 5,000 even if training never went past 4,096. But the weight matrices
        that turn those encoded vectors into useful attention behavior were only ever adjusted
        against encoding patterns the model actually saw during training. Position 5,000&apos;s
        specific sine and cosine values are, mathematically, valid outputs the formula can produce,
        but they&apos;re patterns the attention weights never learned to interpret. It&apos;s the
        same failure mode as asking a model to classify a type of image it never saw in training,
        the function still runs, the output is still a number, it&apos;s just not a meaningful one.
        Learned positional embeddings, an alternative some models use instead of the sinusoidal
        formula, fail even more bluntly: there is no vector at all for a position past the trained
        range, nothing to look up.
      </p>

      <div className="border-l-2 border-brand-warning bg-brand-warning/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted">
          <strong>Gotcha:</strong> a context length limit isn&apos;t a policy setting somebody
          typed into a config file. It&apos;s a direct consequence of which positions the model
          actually trained against. Raising it after the fact means retraining or patching the
          positional scheme, not flipping a switch.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        RoPE degrades too, but more gracefully, and the reason traces straight back to the relative
        distance property from the previous section. Because attention scores depend on the
        distance between two positions rather than their absolute values, a RoPE model that trained
        on distances up to 4,096 has at least seen most of the relative distances it will encounter
        even in a longer sequence, a pair of tokens 50 apart look the same to it whether they sit at
        positions 10 and 60 or positions 4,000 and 4,050. But the largest distances, and the sheer
        volume of tokens competing for attention at once, still push the model outside what it
        trained on, and quality still slips.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Production teams do stretch models past their trained length, interpolating the rotation
        angles so a longer sequence maps back into the range of distances the model already knows,
        or rescaling frequencies so the fastest and slowest &ldquo;clock hands&rdquo; still land in
        familiar territory. Both are patches on the positional scheme, not a different mechanism.
        The full story of context length, what actually gets stored and recomputed token by token,
        and why it&apos;s expensive, is covered in full later in this series, in the Context
        Windows and the KV Cache article.
      </p>
    </section>
  );
}
