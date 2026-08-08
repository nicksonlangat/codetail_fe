import { CodeBlock } from "@/components/blog/interactive/code-block";

export function GenerationSamplingSection() {
  return (
    <section>
      <h2
        id="generation-sampling-text"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Generation: sampling text from the trained model
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The obvious way to turn logits into text is to always take the highest-scoring token,
        argmax, and repeat. Try it on a trained model and the output degrades fast: loops,
        &ldquo;the the the the,&rdquo; the same safe phrase recurring every few words. Argmax is
        deterministic and greedy, and greedy decoding walks straight into the most probable
        immediate next word at every step without ever considering whether a slightly less probable
        word now leads somewhere better later. The Sampling and Generation article covered the fix:
        don&apos;t always take the top token, sample from the distribution, shaped by temperature,
        top-k, and top-p so the sampling stays sensible instead of picking uniformly at random.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Generation itself is the loop that What Is a Language Model first described at the very
        start of this series: feed in a prompt, get a probability distribution over the next token,
        pick one, append it, and feed the whole thing back in for the next step.{" "}
        <code>TinyGPT</code>&apos;s forward pass already returns exactly that distribution, as
        logits, one per position. The <code>generate</code> function below only needs the last
        position&apos;s logits, reshapes them with temperature, filters them with top-k and top-p,
        and samples.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Autoregressive generation with temperature, top-k, and top-p
        </p>
        <CodeBlock
          code={`@torch.no_grad()
def generate(
    model: TinyGPT,
    tokenizer: CharTokenizer,
    prompt: str,
    max_new_tokens: int = 200,
    temperature: float = 1.0,
    top_k: int | None = None,
    top_p: float | None = None,
) -> str:
    model.eval()
    token_ids = torch.tensor([tokenizer.encode(prompt)], dtype=torch.long)

    for _ in range(max_new_tokens):
        context = token_ids[:, -model.block_size :]
        logits = model(context)
        next_logits = logits[:, -1, :] / temperature   # (1, vocab_size)

        if top_k is not None:
            values, _ = torch.topk(next_logits, top_k)
            threshold = values[:, -1, None]
            next_logits = next_logits.masked_fill(next_logits < threshold, float("-inf"))

        if top_p is not None:
            sorted_logits, sorted_idx = torch.sort(next_logits, descending=True)
            probs = F.softmax(sorted_logits, dim=-1)
            cumulative = torch.cumsum(probs, dim=-1)
            drop = cumulative > top_p
            drop[:, 1:] = drop[:, :-1].clone()
            drop[:, 0] = False
            sorted_logits[drop] = float("-inf")
            next_logits = torch.full_like(next_logits, float("-inf"))
            next_logits.scatter_(1, sorted_idx, sorted_logits)

        probs = F.softmax(next_logits, dim=-1)
        next_id = torch.multinomial(probs, num_samples=1)
        token_ids = torch.cat([token_ids, next_id], dim=1)

    return tokenizer.decode(token_ids[0].tolist())`}
          output={``}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Temperature divides the logits before softmax, below 1.0 it sharpens the distribution
        toward the model&apos;s favorite tokens, above 1.0 it flattens it toward uniform, more
        surprises, more incoherence past a point. Top-k keeps only the k highest-scoring tokens and
        zeroes out the rest before sampling, a hard cutoff on how many candidates get considered.
        Top-p, nucleus sampling, is the adaptive version: keep the smallest set of top tokens whose
        cumulative probability crosses <code>p</code>, so a confident distribution keeps only one or
        two candidates and an uncertain one keeps many, the cutoff width adjusts itself instead of
        staying fixed. Run with a prompt and reasonable settings for both:
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Sampling from the trained model
        </p>
        <CodeBlock
          code={`print(generate(
    model,
    tokenizer,
    prompt="the meaning of ",
    max_new_tokens=120,
    temperature=0.8,
    top_k=40,
    top_p=0.9,
))`}
          output={`the meaning of the story is not what it seems at first, and the
old man said nothing more than that the world was wide and the
road went on ahead of them both`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        One honest limitation worth naming: <code>generate</code> recomputes the entire forward
        pass, through all six blocks, on every single new token, feeding the whole growing sequence
        back in each time. Production models don&apos;t do this, they cache the key and value
        tensors from every previous step instead of recomputing them, exactly the KV cache the
        Context Windows article covered. At <code>block_size</code> = 128 the cost of not caching is
        trivial. At the 32,000-token context windows real deployments run, it&apos;s the difference
        between a response that streams back in seconds and one that doesn&apos;t. And if you wanted
        to know precisely how well this model is doing, not just eyeballing its output, the
        Evaluating LLMs article&apos;s answer is sitting right there in the training loop already:
        perplexity is just <code>e</code> raised to the average cross-entropy loss, computed on held-out
        text the model never trained on.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          Rule: every piece built across this article is replaceable independently of every other
          piece. Swap the character tokenizer for BPE, the learned position table for rotary
          encoding, Adam for a different optimizer, and the rest keeps working unmodified. That
          modularity, not any single trick, is why this architecture scaled from a script that fits
          in one article to systems that cost hundreds of millions of dollars to train, without ever
          changing shape.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Read back over what just ran. A tokenizer turned raw text into integers. An embedding table
        turned those integers into vectors, and a positional table told the model where each one
        sat in the sequence. Multi-head attention let every token look at every earlier token and
        decide what mattered. Feedforward layers gave the model somewhere to actually transform what
        attention gathered. Residual connections let all of that stack six layers deep without the
        signal degrading, and layer norm kept the numbers flowing through it well-behaved. Cross-entropy
        loss measured exactly how wrong each prediction was, backpropagation traced that error back
        through every one of those layers to every parameter responsible for it, and gradient
        descent, by way of Adam, nudged each one to be less wrong next time. And sampling, temperature
        and top-k and top-p together, turned the trained model&apos;s output distribution back into
        the one thing this entire series has been building toward from its very first sentence: the
        next word.
      </p>
    </section>
  );
}
