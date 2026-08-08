export function MeasuringWhatMattersSection() {
  return (
    <section>
      <h2 id="measuring-the-right-numbers" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        The average latency was fine. The users complaining weren&apos;t hitting the average.
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        An average latency number can look completely healthy while a real fraction of requests
        take five times as long, and those are exactly the requests a frustrated user remembers.
        Track p50 and p95 separately, not just the mean, the same way any latency-sensitive system
        does, an LLM call is no exception just because the workload is different.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Cost deserves the same scrutiny past the raw total spend. Cost per request is easy to
        track and easy to misread: a cheap pipeline that&apos;s wrong often enough to generate
        support tickets and manual review can cost more in total than a slightly pricier one that&apos;s
        reliable, which is why cost per successful outcome, not cost per call, is the number
        actually worth optimizing.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        None of these numbers are useful without somewhere to actually see them, per request, over
        time, broken down by which model handled it. That instrumentation is the subject of the
        Observability article later in this series.
      </p>
    </section>
  );
}
