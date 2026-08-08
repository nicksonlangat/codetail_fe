export function IdToVectorSection() {
  return (
    <section>
      <h2 id="id-to-vector" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        A token ID is not a meaningful number
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The previous article ended with text turned into a sequence of token IDs, integers like{" "}
        <span className="font-mono">464</span> or <span className="font-mono">2368</span>. It is
        tempting to think the model can now just go to work on those numbers. It can&apos;t, not
        yet, because a token ID is only an index into a lookup table. It carries no information
        about what the token means. Token 464 is not &ldquo;less than&rdquo; token 2368 in any
        sense that matters, and two tokens with nearby IDs are not more related than two tokens with
        distant ones. The ID is assigned by whatever order the vocabulary happened to be built in.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Feeding a raw ID straight into a neural network would be actively harmful. Networks learn by
        adjusting weights based on numeric relationships: bigger numbers, closer numbers, and
        proportional numbers all carry implicit signal to a network doing arithmetic on them. An ID
        has none of the relationships it would imply. The network needs, instead, a representation
        where distance and direction actually mean something. That representation is an{" "}
        <strong>embedding</strong>: a vector of real numbers assigned to each token, positioned in
        space so that similar tokens end up near each other.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          A language model is a next-word guesser, extraordinarily well trained. An embedding table
          is the part that turns &ldquo;which word&rdquo; into &ldquo;where that word sits, relative
          to every other word the model knows.&rdquo;
        </p>
      </div>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">What the embedding table actually is</h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Mechanically, it is a single matrix. One row per vocabulary entry, so a 50,000-token
        vocabulary has 50,000 rows. Looking up a token&apos;s embedding is nothing more than reading
        row number <span className="font-mono">token_id</span> out of that matrix. Real models use
        hundreds to a few thousand columns per row, meaning each token becomes a vector of that many
        numbers. Those numbers are not hand-assigned by anyone. They start out random and are learned
        during training, the same way every other weight in the network is learned, covered in the
        Loss and Backpropagation article later in this series.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        For now, the important shift is conceptual: stop thinking of a token as a symbol, and start
        thinking of it as a point in space. Every operation the rest of the network performs, from
        here through the final probability distribution, operates on that point, never on the
        original word or ID again.
      </p>
    </section>
  );
}
