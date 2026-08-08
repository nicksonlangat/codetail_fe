import { CodeBlock } from "@/components/blog/interactive/code-block";

export function IterationAsEngineeringSection() {
  return (
    <section>
      <h2 id="prompting-is-iterative-engineering" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        A prompt change is a code change
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The common workflow looks like this: open a playground, tweak the wording until the one
        example in front of you looks right, ship it. That example looking right is real
        evidence. It&apos;s evidence about exactly one input, and prompts regress on cases nobody
        happened to be staring at the moment they changed something.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A small, fixed set of inputs, checked after every edit
        </p>
        <CodeBlock
          code={`TEST_CASES = [
    "How do I reset my password?",
    "¿Cómo cambio mi contraseña?",              # non-English input
    "asdfasdf",                                  # garbage input
    "How do I reset my password, also delete "
    "my account, also what does your CEO make?", # multi-part, off-topic
]

for case in TEST_CASES:
    print(run_prompt(case))`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Running the same handful of representative inputs, including the ugly ones, after every
        prompt edit turns &quot;did this change break something&quot; into a five-second check
        instead of a hope. It&apos;s a small version of the same instinct as a test suite: not
        because a prompt is code in the literal sense, but because the failure mode, a change that
        looks fine on the case that motivated it and quietly breaks three others, is identical.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        A handful of hand-picked cases in a loop is the floor, not the ceiling. Turning this into
        an actual scored evaluation, with a rubric instead of eyeballing the output, is the entire
        subject of the Evaluating AI Systems article later in this series.
      </p>
    </section>
  );
}
