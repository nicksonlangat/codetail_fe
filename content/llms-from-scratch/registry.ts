import type { ArticleMeta } from "@/content/python/registry";

export const llmsFromScratchArticles: ArticleMeta[] = [
  {
    slug: "what-is-a-language-model",
    title: "What Is a Language Model",
    subtitle: "Next-token prediction is the whole game.",
    description:
      "Strip away the hype. A language model is a function that predicts the next token from the tokens before it. Understand why that simple objective produces something that looks like reasoning.",
    order: 1,
    estimatedMinutes: 18,
    tags: ["language-model", "next-token-prediction", "probability", "gpt"],
    relatedChallenges: [],
    icon: "🧠",
  },
  {
    slug: "tokenization",
    title: "Tokenization",
    subtitle: "Models don't see words. They see numbers.",
    description:
      "Why raw text can't be fed to a neural network, how byte-pair encoding builds a vocabulary, and why tokenization quietly explains half of what looks like a model's weird behavior.",
    order: 2,
    estimatedMinutes: 20,
    tags: ["tokenization", "bpe", "vocabulary", "subwords"],
    relatedChallenges: [],
    icon: "🔤",
  },
  {
    slug: "embeddings",
    title: "Embeddings",
    subtitle: "Turning tokens into points in space.",
    description:
      "How a token ID becomes a vector, why 'king minus man plus woman' lands near 'queen', and what an embedding table actually is under the hood.",
    order: 3,
    estimatedMinutes: 20,
    tags: ["embeddings", "vectors", "semantic-similarity", "embedding-table"],
    relatedChallenges: [],
    icon: "📍",
  },
  {
    slug: "neural-network-foundations",
    title: "Neural Network Foundations",
    subtitle: "Neurons, weights, and matrix multiplication.",
    description:
      "The minimum machinery you need before attention makes sense: what a neuron actually computes, why activation functions exist, and how layers stack into a function that learns.",
    order: 4,
    estimatedMinutes: 24,
    tags: ["neural-networks", "weights", "activation-functions", "matrix-multiplication"],
    relatedChallenges: [],
    icon: "🕸️",
  },
  {
    slug: "attention",
    title: "Attention",
    subtitle: "How a model decides what to focus on.",
    description:
      "The mechanism that made transformers possible. Query, key, and value vectors, why attention replaced recurrence, and a worked example you can trace by hand.",
    order: 5,
    estimatedMinutes: 26,
    tags: ["attention", "self-attention", "query-key-value", "transformers"],
    relatedChallenges: [],
    icon: "🎯",
  },
  {
    slug: "the-transformer-block",
    title: "The Transformer Block",
    subtitle: "Attention plus feedforward plus residuals, assembled.",
    description:
      "The full architecture diagram, piece by piece: multi-head attention, feedforward layers, residual connections, and layer normalization, and why each piece is load-bearing.",
    order: 6,
    estimatedMinutes: 24,
    tags: ["transformer", "multi-head-attention", "residual-connections", "layer-norm"],
    relatedChallenges: [],
    icon: "🧱",
  },
  {
    slug: "positional-encoding",
    title: "Positional Encoding",
    subtitle: "Attention alone can't tell word order.",
    description:
      "Why a transformer without positional information sees 'dog bites man' and 'man bites dog' as identical, and how sinusoidal and rotary encodings fix that.",
    order: 7,
    estimatedMinutes: 16,
    tags: ["positional-encoding", "rope", "sequence-order"],
    relatedChallenges: [],
    icon: "📐",
  },
  {
    slug: "loss-and-backpropagation",
    title: "Loss and Backpropagation",
    subtitle: "How a model actually learns from being wrong.",
    description:
      "Cross-entropy loss, gradient descent, and backpropagation explained without hand-waving. What a training step really does to the weights.",
    order: 8,
    estimatedMinutes: 24,
    tags: ["loss-function", "cross-entropy", "gradient-descent", "backpropagation"],
    relatedChallenges: [],
    icon: "📉",
  },
  {
    slug: "pretraining-at-scale",
    title: "Pretraining at Scale",
    subtitle: "What a training run actually is.",
    description:
      "Datasets, compute budgets, batch sizes, and the next-token-prediction objective at the scale of billions of tokens. What 'pretraining' means in practice, not just in theory.",
    order: 9,
    estimatedMinutes: 20,
    tags: ["pretraining", "compute", "datasets", "batch-size"],
    relatedChallenges: [],
    icon: "🏭",
  },
  {
    slug: "from-base-model-to-assistant",
    title: "From Base Model to Assistant",
    subtitle: "Why raw pretrained models don't chat.",
    description:
      "Instruction tuning, RLHF, and DPO explained: how a model that only predicts the next token turns into one that follows instructions and refuses harmful requests.",
    order: 10,
    estimatedMinutes: 22,
    tags: ["fine-tuning", "rlhf", "dpo", "instruction-tuning"],
    relatedChallenges: [],
    icon: "🎓",
  },
  {
    slug: "sampling-and-generation",
    title: "Sampling and Generation",
    subtitle: "Why the same prompt gives different answers.",
    description:
      "Temperature, top-k, top-p, greedy decoding, and beam search. How a model turns a probability distribution over the vocabulary into the next word on your screen.",
    order: 11,
    estimatedMinutes: 18,
    tags: ["sampling", "temperature", "top-k", "top-p", "decoding"],
    relatedChallenges: [],
    icon: "🎲",
  },
  {
    slug: "context-windows-and-kv-cache",
    title: "Context Windows and the KV Cache",
    subtitle: "Why longer conversations cost more.",
    description:
      "Attention's quadratic cost, what the KV cache actually caches, and why doubling your context window is not a free upgrade.",
    order: 12,
    estimatedMinutes: 20,
    tags: ["context-window", "kv-cache", "attention-complexity", "inference"],
    relatedChallenges: [],
    icon: "🗂️",
  },
  {
    slug: "evaluating-llms",
    title: "Evaluating LLMs",
    subtitle: "Perplexity, benchmarks, and why eval is genuinely hard.",
    description:
      "What perplexity measures and what it misses, how benchmarks like MMLU work, why hallucination resists easy detection, and how to think about model comparisons.",
    order: 13,
    estimatedMinutes: 18,
    tags: ["evaluation", "perplexity", "benchmarks", "hallucination"],
    relatedChallenges: [],
    icon: "📊",
  },
  {
    slug: "scaling-laws",
    title: "Scaling Laws",
    subtitle: "Why bigger models just work better.",
    description:
      "Chinchilla and the parameters-versus-data tradeoff, compute-optimal training, and why scaling laws let researchers predict a model's performance before training it.",
    order: 14,
    estimatedMinutes: 18,
    tags: ["scaling-laws", "chinchilla", "compute-optimal", "emergent-behavior"],
    relatedChallenges: [],
    icon: "📈",
  },
  {
    slug: "build-a-tiny-llm",
    title: "Build a Tiny LLM From Scratch",
    subtitle: "Every prior article, tied into working code.",
    description:
      "The capstone: a complete, minimal GPT implementation walked through end to end. Tokenizer, embeddings, transformer blocks, training loop, and text generation, all in one place.",
    order: 15,
    estimatedMinutes: 35,
    tags: ["gpt", "implementation", "capstone", "pytorch"],
    relatedChallenges: [],
    icon: "🛠️",
  },
];

export function getArticleBySlug(slug: string): ArticleMeta | undefined {
  return llmsFromScratchArticles.find((a) => a.slug === slug);
}

export function getAdjacentArticles(slug: string) {
  const idx = llmsFromScratchArticles.findIndex((a) => a.slug === slug);
  return {
    prev: idx > 0 ? llmsFromScratchArticles[idx - 1] : null,
    next: idx < llmsFromScratchArticles.length - 1 ? llmsFromScratchArticles[idx + 1] : null,
  };
}
