export function DeduplicationFilteringAndDataQualitySection() {
  return (
    <section>
      <h2
        id="deduplication-filtering-and-data-quality"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Deduplication, filtering, and why more data isn&apos;t automatically better
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The obvious assumption is that more tokens always means a better model, since the compute
        rule of thumb from the previous section has total_tokens sitting right there as a
        multiplier. Feed it more, get more compute credit, get a better model. That assumption
        breaks down once you notice what a web crawl actually contains: the same terms-of-service
        boilerplate copy-pasted across ten million different sites, the same press release
        syndicated to five hundred news aggregators, the same Stack Overflow answer scraped by a
        dozen different tutorial sites. None of those repeats are new information. They&apos;re the
        same tokens, counted multiple times.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Train on that without deduplicating and the model doesn&apos;t just waste compute re-reading
        the same sentence. It actively learns the wrong lesson: a phrase that appears ten thousand
        times across near-identical pages looks, statistically, ten thousand times more important
        than it actually is. The model starts assigning that boilerplate a higher probability than
        it deserves, and in the worst cases it memorizes long exact stretches of it verbatim, the
        same way a student who reads one over-repeated practice question ten times can recite the
        answer without having learned the underlying method. That&apos;s overfitting to duplication,
        and it looks like good performance on the training data while actively hurting how well the
        model generalizes to text it hasn&apos;t seen.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          Rule: a duplicate isn&apos;t free extra training signal, it&apos;s a vote for the model to
          weight that content more heavily than it should. Deduplication isn&apos;t a nice-to-have
          cleanup pass, it&apos;s what keeps the token count in the compute formula honest.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        So real pipelines run several layers of cleanup before a token ever reaches a training
        step. Exact and near-duplicate detection removes pages that are identical or a few words
        apart, usually with hashing techniques that can compare billions of documents against each
        other without doing a full pairwise comparison. Quality filtering scores documents on
        things like sentence structure, vocabulary diversity, and the ratio of real prose to
        boilerplate, and drops the ones that look like link farms or keyword-stuffed spam rather
        than actual writing. And <strong>data mixing</strong> decides the proportion of each source
        in the final blend by hand, code and books get deliberately upweighted far beyond their
        raw share of the crawl, because a page of clean Python or a well-edited book chapter
        teaches the model more per token than an average scraped web page does.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Put together, this is why two labs training the same architecture on the same total token
        count can end up with meaningfully different models, and why the field has largely stopped
        chasing raw token count as the headline number. Past a certain scale, the marginal token
        from a sloppy crawl is worth less than the marginal token from a carefully filtered and
        deduplicated one, and no amount of extra compute fixes that. Article 14 (Scaling Laws) picks
        this back up with the formal relationship between data, model size, and compute, this
        section is just the operational version: what the filtering pipeline is actually doing to
        the dataset before any of that math applies.
      </p>
    </section>
  );
}
