import { CodeBlock } from "@/components/blog/interactive/code-block";

export function WhatBelongsSection() {
  return (
    <section>
      <h2 id="what-actually-belongs-in-the-window" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Paste the relevant ten lines, not the file they live in
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Asking a question about one function and pasting the ten-thousand-line file it lives in
        is the path-of-least-resistance move, and it&apos;s the exact shape of problem the last
        section described: the function you care about is one small island in a sea of tokens the
        model has to weigh against everything else in the file.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          What actually needs to be in context to answer &quot;why does this function fail on
          empty input&quot;
        </p>
        <CodeBlock
          code={`# not needed: the other 200 functions in the file
# needed: the function itself, and the two callers that invoke it
# needed: the type definitions its arguments and return value use
# not needed: the import statements for unrelated modules`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        The discipline is deciding, deliberately, what&apos;s actually relevant to the question
        being asked, not what&apos;s easiest to copy and paste. At small scale that&apos;s a
        judgment call you make by hand. At the scale of an entire codebase or document library,
        making that judgment call automatically, for every query, is exactly what retrieval
        systems exist to do, covered starting with the next two articles in this series.
      </p>
    </section>
  );
}
