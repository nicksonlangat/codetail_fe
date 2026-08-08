export function WhatsActuallyInAPretrainingDatasetSection() {
  return (
    <section>
      <h2
        id="whats-actually-in-a-pretraining-dataset"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        What&apos;s actually in a pretraining dataset
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Most explanations of pretraining skip straight to &ldquo;the model reads a huge amount of
        text.&rdquo; That&apos;s true, and it hides the part that actually determines how good the
        model turns out: what &ldquo;a huge amount of text&rdquo; means once you go look at it.
        It&apos;s not a curated library. It&apos;s a scrape of the public internet, filtered code
        repositories, digitized books, and academic papers, mixed together in specific proportions
        that someone chose on purpose. Change the mix and you change the model, even with the exact
        same architecture and the exact same number of tokens.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Open a random page from an uncleaned web crawl and it looks nothing like the fluent prose
        you&apos;d expect a language model to learn from. A lot of it is navigation menus repeated
        on every page of a site, cookie consent banners, &ldquo;Subscribe to our newsletter&rdquo;
        boilerplate, auto-generated product listings that are 90% identical to the listing next to
        them, and pages that are technically English but are really just keyword-stuffed SEO spam
        with no real sentence structure underneath. Some of it isn&apos;t language at all: minified
        JavaScript embedded in a page, base64-encoded images, table-of-contents pages that are
        nothing but links. None of that teaches a model to write or reason well, and a large chunk
        of the raw crawl is exactly that.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          The dataset is not an input you feed into the real work of designing an architecture.
          Past a certain point of scale, the dataset <em>is</em> the work. Two teams training the
          identical transformer architecture on differently filtered data end up with models that
          behave differently in ways no amount of tuning the attention mechanism will fix.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        So real pretraining corpora are built, not just collected. Common Crawl, a continuously
        updated dump of the public web running into hundreds of billions of pages, is the base
        layer for most of them. On top of that, teams add filtered GitHub repositories for code
        (with license and quality filters applied, not every repo makes the cut), books from
        digitized libraries, Wikipedia, and academic papers from sources like arXiv and PubMed.
        Each of those sources gets its own cleaning pipeline, because the junk in a code repo
        (auto-generated boilerplate, vendored dependencies, minified bundles) looks nothing like the
        junk in a web crawl.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        The end result, after all that filtering, is measured in trillions of tokens, not gigabytes.
        A modern frontier model&apos;s training set commonly runs to ten trillion tokens or more.
        That number, and what&apos;s actually inside it, matters as much as anything about the model
        itself, which is exactly what the next section starts putting precise units on.
      </p>
    </section>
  );
}
