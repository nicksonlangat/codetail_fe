export function WhatToCutSection() {
  return (
    <section>
      <h2 id="deciding-what-to-cut-first" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        When the budget doesn&apos;t fit everything, something has to lose first
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Given a fixed budget and more candidate content than fits, the order you cut in isn&apos;t
        arbitrary. Some rules hold up across almost every application.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The system instruction and the user&apos;s current message are the two things that never
        get cut, they&apos;re small and they define what the request even is. Older conversation
        turns are usually the safest thing to trim first, the tenth message back is rarely as
        load-bearing as the first one or the most recent one, and a summary of what was cut can
        recover most of the value at a fraction of the token cost, the exact technique the Memory
        article in this series covers in depth.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Large reference material is the trickier case: dropping it entirely loses information the
        user might actually need, but including all of it is what caused the problem in the first
        place. The better move, in almost every case, is retrieving only the relevant slice
        instead of choosing between &quot;all of it&quot; and &quot;none of it&quot;, which is
        precisely the problem the rest of this series turns to next.
      </p>
    </section>
  );
}
