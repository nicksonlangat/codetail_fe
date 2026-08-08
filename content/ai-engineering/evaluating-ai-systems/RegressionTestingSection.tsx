export function RegressionTestingSection() {
  return (
    <section>
      <h2 id="regression-testing-a-prompt-change" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        An average score can hide the one case that actually regressed
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Wiring the golden set and the judge together into an actual workflow: every prompt or
        pipeline change runs against the full set before shipping, and the resulting scores get
        compared case by case against the previous version, not just averaged into one number.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        An aggregate average is exactly the kind of number that hides the failure this whole
        article is about. A change that improves nine cases and badly breaks a tenth can still
        raise the average, and shipping on the strength of that average means shipping a real
        regression nobody noticed because it was outvoted.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        A regression on any individual case should block the change the same way a failing unit
        test blocks a merge, with a human deciding whether the regression is acceptable, not a
        script deciding for them by rolling everything into one pass or fail number. The value of
        the golden set was never the average, it was always the ability to point at the specific
        case that broke.
      </p>
    </section>
  );
}
