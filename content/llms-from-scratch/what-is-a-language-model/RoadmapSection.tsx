const ROADMAP = [
  { title: "What Is a Language Model", note: "Next-token prediction, the objective everything else is built on." },
  { title: "Tokenization", note: "How text becomes the numbers a model can actually operate on." },
  { title: "Embeddings", note: "Turning token IDs into points in space that capture meaning." },
  { title: "Neural Network Foundations", note: "Neurons, weights, and matrix multiplication, the machinery underneath." },
  { title: "Attention", note: "The mechanism that lets a model decide what to focus on." },
  { title: "The Transformer Block", note: "Attention, feedforward, and residuals, assembled into one architecture." },
  { title: "Positional Encoding", note: "How word order gets injected back in." },
  { title: "Loss and Backpropagation", note: "How a model learns from being wrong." },
  { title: "Pretraining at Scale", note: "What a real training run looks like." },
  { title: "From Base Model to Assistant", note: "Instruction tuning and RLHF, why raw models don't chat." },
  { title: "Sampling and Generation", note: "Temperature, top-k, top-p, why output varies." },
  { title: "Context Windows and the KV Cache", note: "Why longer conversations cost more." },
  { title: "Evaluating LLMs", note: "Perplexity, benchmarks, and why eval is hard." },
  { title: "Scaling Laws", note: "Why bigger models predictably work better." },
  { title: "Build a Tiny LLM From Scratch", note: "Every prior article, tied into working code." },
];

export function RoadmapSection() {
  return (
    <section>
      <h2 id="roadmap" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Where this series goes from here
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Fifteen articles, each one building directly on the last. No article assumes anything
        beyond what came before it. By the end, you will have built a working, if small, GPT-style
        model yourself, and understood every line of it.
      </p>

      <div className="space-y-1.5">
        {ROADMAP.map(({ title, note }, i) => {
          const isCurrent = i === 0;
          const isNext = i === 1;
          return (
            <div
              key={title}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${
                isCurrent ? "border-brand-primary/40 bg-brand-primary/5" : "border-brand-border bg-white"
              }`}
            >
              <span
                className={`shrink-0 size-6 rounded-lg flex items-center justify-center text-[11px] font-mono font-semibold ${
                  isCurrent ? "bg-brand-primary text-white" : "bg-brand-surface text-brand-text-muted"
                }`}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[12px] font-semibold text-brand-text truncate">{title}</p>
                  {isCurrent && (
                    <span className="text-[9px] uppercase tracking-wider text-brand-primary shrink-0">You are here</span>
                  )}
                  {isNext && (
                    <span className="text-[9px] uppercase tracking-wider text-brand-text-subtle shrink-0">Next up</span>
                  )}
                </div>
                <p className="text-[11px] text-brand-text-muted truncate">{note}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
