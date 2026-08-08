export function BenchmarkSuitesSection() {
  return (
    <section>
      <h2
        id="benchmark-suites"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Benchmark suites: MMLU and friends
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        MMLU, short for Massive Multitask Language Understanding, is not a clever new evaluation
        technique. It&apos;s a fixed quiz: roughly 14,000 multiple-choice questions spread across
        57 subjects, high school chemistry, US law, abstract algebra, professional medicine, world
        religions. Each question has four answer choices and exactly one correct one. Run a model
        over the whole set, count what fraction it got right, and that percentage is the score.
        Nothing more sophisticated is happening underneath.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Other benchmarks follow the same shape with a different focus. HellaSwag scores whether a
        model picks the sensible ending to a scenario. GSM8K scores grade-school math word problems.
        HumanEval scores whether generated code actually passes its test cases. Different content,
        same idea: a fixed set of questions with known right answers, scored automatically, no human
        judgment required per question.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        That fixed, automatic scoring is exactly why benchmarks matter. Perplexity can&apos;t be
        compared across different test sets, but a benchmark score can be compared across every
        model that ever gets run against it, on the same questions, every time. That&apos;s why a
        model release announcement leads with &ldquo;improved from 68% to 74% on MMLU&rdquo;
        instead of a perplexity number nobody outside the lab can interpret.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        But a fixed quiz has a fixed set of questions, and those questions live on the internet,
        which is also where pretraining data comes from. <strong>Benchmark contamination</strong>{" "}
        is what happens when MMLU questions, or close paraphrases of them, end up scraped into a
        model&apos;s training data along with the rest of the web. The model isn&apos;t reasoning
        its way to the right answer anymore, it&apos;s recalling one it already saw, and the score
        goes up without the underlying capability improving at all.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        There&apos;s a subtler version of the same problem even without direct contamination. When
        every lab reports the same handful of benchmark numbers in every release, there&apos;s
        pressure, explicit or not, to optimize specifically for those numbers. A model can genuinely
        improve on MMLU without getting any better at the messy, unbenchmarked tasks a real user
        actually cares about. The yardstick is useful precisely because it&apos;s fixed, and that
        same fixedness is what makes it gameable.
      </p>
    </section>
  );
}
