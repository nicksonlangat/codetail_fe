import { NextTokenPredictor } from "@/components/blog/interactive/next-token-predictor";
import { CodeBlock } from "@/components/blog/interactive/code-block";

export function AutoregressiveLoopSection() {
  return (
    <section>
      <h2 id="autoregressive-loop" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        The distribution, the sample, the loop
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A single forward pass through the model produces one probability distribution over the
        entire vocabulary, tens of thousands of possible next tokens, each with a probability.
        Generating an entire paragraph is that same step, repeated. Pick one token from the
        distribution, append it to the input, run the model again on the new, slightly longer
        sequence. This is called <strong>autoregressive generation</strong>: each output becomes
        part of the input for the next step.
      </p>

      <NextTokenPredictor />

      <p className="text-[13px] text-brand-text-subtle mb-6">
        These probabilities are hand-authored to illustrate the shape of a real distribution, not
        pulled from a running model. Adjust the temperature slider and watch the bars sharpen
        toward one token or spread out across many, that reshaping is a real, verifiable
        calculation (softmax with temperature scaling), covered in full in the Sampling and
        Generation article later in this series.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">Why "pick one" and not "pick the best"</h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        You might expect the model to always output the single highest-probability token. Some
        systems do exactly that (it's called greedy decoding), but it tends to produce dull,
        repetitive text. Most production systems sample: they roll a weighted die over the
        distribution, so a token with 20% probability gets chosen roughly one time in five. Same
        underlying model, different generations, every time you run it. That's why asking the same
        question twice can give you two different answers with plausible-sounding confidence in
        both.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          The generation loop, stripped to its essence
        </p>
        <CodeBlock
          code={`tokens = tokenize(prompt)

for _ in range(max_new_tokens):
    distribution = model(tokens)      # probabilities over the whole vocabulary
    next_token = sample(distribution) # weighted random pick, not always the top one
    tokens.append(next_token)
    if next_token == END_OF_TEXT:
        break

return detokenize(tokens)`}
          output={``}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Every capability that feels intelligent, writing a function, explaining a concept,
        carrying on a conversation, is this loop running thousands of times, one token guessed
        after another, each guess conditioned on everything generated so far.
      </p>
    </section>
  );
}
