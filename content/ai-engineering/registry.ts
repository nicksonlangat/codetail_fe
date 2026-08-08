import type { ArticleMeta } from "@/content/python/registry";

export const aiEngineeringArticles: ArticleMeta[] = [
  {
    slug: "what-is-an-llm-api",
    title: "What Is an LLM API",
    subtitle: "You're not training a model, you're renting one, by the token.",
    description:
      "The request/response shape of a hosted LLM, tokens as the billing and latency unit, and the context window as the one resource you actually manage.",
    order: 1,
    estimatedMinutes: 18,
    tags: ["llm-api", "tokens", "context-window", "inference"],
    relatedChallenges: [],
    icon: "🔌",
  },
  {
    slug: "prompting-as-interface-design",
    title: "Prompting as Interface Design",
    subtitle: "A prompt is a spec, not a magic spell.",
    description:
      "System, user, and assistant roles, few-shot examples, and why 'just be clearer' is most of the actual skill of prompting.",
    order: 2,
    estimatedMinutes: 20,
    tags: ["prompting", "few-shot", "system-prompt", "prompt-engineering"],
    relatedChallenges: [],
    icon: "✍️",
  },
  {
    slug: "structured-output-and-tool-calling",
    title: "Structured Output and Tool Calling",
    subtitle: "Getting reliable JSON out of a model that predicts text.",
    description:
      "Tool and function schemas, forced JSON modes, and why tool calling is the real API surface underneath every agent.",
    order: 3,
    estimatedMinutes: 22,
    tags: ["tool-calling", "function-calling", "structured-output", "json-mode"],
    relatedChallenges: [],
    icon: "🧩",
  },
  {
    slug: "context-engineering",
    title: "Context Engineering",
    subtitle: "Why 'just paste more text in' fails.",
    description:
      "What actually belongs in the context window, context rot, and prompt assembly as a first-class engineering problem.",
    order: 4,
    estimatedMinutes: 18,
    tags: ["context-engineering", "context-window", "prompt-assembly"],
    relatedChallenges: [],
    icon: "📦",
  },
  {
    slug: "embeddings-and-vector-search-in-practice",
    title: "Embeddings and Vector Search in Practice",
    subtitle: "Chunking is where RAG quality is actually won or lost.",
    description:
      "Chunking strategy, embedding model choice, and ANN indexes: the engineering of retrieval, not the math behind it.",
    order: 5,
    estimatedMinutes: 22,
    tags: ["embeddings", "vector-search", "chunking", "ann-index"],
    relatedChallenges: [],
    icon: "🧭",
  },
  {
    slug: "retrieval-augmented-generation",
    title: "Retrieval-Augmented Generation",
    subtitle: "The pipeline everyone draws as one box.",
    description:
      "Ingest, chunk, embed, retrieve, rerank, generate, and where each stage of a RAG pipeline quietly breaks.",
    order: 6,
    estimatedMinutes: 24,
    tags: ["rag", "retrieval", "reranking", "pipeline"],
    relatedChallenges: [],
    icon: "📚",
  },
  {
    slug: "agents-and-tool-use",
    title: "Agents and Tool Use",
    subtitle: "Plan, call a tool, observe, repeat.",
    description:
      "The ReAct-style agent loop, why agents fail silently instead of loudly, and what 'agentic' actually buys you over a single call.",
    order: 7,
    estimatedMinutes: 24,
    tags: ["agents", "react", "tool-use", "autonomy"],
    relatedChallenges: [],
    icon: "🤖",
  },
  {
    slug: "multi-agent-systems",
    title: "Multi-Agent Systems",
    subtitle: "When one agent stops being enough.",
    description:
      "Orchestrator/worker patterns, handoffs, shared state, and the case for staying single-agent longer than you think.",
    order: 8,
    estimatedMinutes: 22,
    tags: ["multi-agent", "orchestration", "handoffs"],
    relatedChallenges: [],
    icon: "🪢",
  },
  {
    slug: "memory-for-ai-applications",
    title: "Memory for AI Applications",
    subtitle: "'Memory' is a product decision, not a feature flag.",
    description:
      "Short-term context versus a real long-term memory store, summarization strategies, and what to persist versus what to forget.",
    order: 9,
    estimatedMinutes: 18,
    tags: ["memory", "summarization", "personalization"],
    relatedChallenges: [],
    icon: "🗄️",
  },
  {
    slug: "evaluating-ai-systems",
    title: "Evaluating AI Systems",
    subtitle: "'It feels better' is not an eval.",
    description:
      "LLM-as-judge, golden datasets, and regression-testing a prompt change the same way you'd regression-test code.",
    order: 10,
    estimatedMinutes: 22,
    tags: ["evals", "llm-as-judge", "golden-dataset", "regression-testing"],
    relatedChallenges: [],
    icon: "🧪",
  },
  {
    slug: "fine-tuning-vs-prompting-vs-rag",
    title: "Fine-Tuning vs. Prompting vs. RAG",
    subtitle: "A decision framework, not a tutorial.",
    description:
      "When fine-tuning actually earns its cost, what instruction tuning and LoRA practically look like, and when better prompting wins outright.",
    order: 11,
    estimatedMinutes: 20,
    tags: ["fine-tuning", "lora", "decision-framework"],
    relatedChallenges: [],
    icon: "⚖️",
  },
  {
    slug: "latency-cost-and-streaming",
    title: "Latency, Cost, and Streaming",
    subtitle: "Token economics is a real budget line, treat it like one.",
    description:
      "Streaming responses, prompt caching, and model cascades or routing to cut cost without cutting quality.",
    order: 12,
    estimatedMinutes: 18,
    tags: ["latency", "cost", "streaming", "prompt-caching", "model-routing"],
    relatedChallenges: [],
    icon: "⚡",
  },
  {
    slug: "guardrails-safety-and-prompt-injection",
    title: "Guardrails, Safety, and Prompt Injection",
    subtitle: "The attack surface of an LLM app isn't the model, it's everything feeding it.",
    description:
      "Jailbreaks, prompt injection via tool output and RAG documents, and output filtering for AI-specific failure modes.",
    order: 13,
    estimatedMinutes: 20,
    tags: ["prompt-injection", "guardrails", "jailbreaks", "safety"],
    relatedChallenges: [],
    icon: "🛡️",
  },
  {
    slug: "observability-for-llm-applications",
    title: "Observability for LLM Applications",
    subtitle: "Debugging something non-deterministic.",
    description:
      "Tracing a request through an agent loop, and logging prompts and completions without leaking secrets or PII.",
    order: 14,
    estimatedMinutes: 18,
    tags: ["observability", "tracing", "logging"],
    relatedChallenges: [],
    icon: "🔭",
  },
  {
    slug: "shipping-an-ai-product",
    title: "Shipping an AI Product",
    subtitle: "Every prior article, tied into one working system.",
    description:
      "The capstone: end-to-end architecture of a real AI feature, API, retrieval, tools, evals, cost controls, and guardrails, deployed.",
    order: 15,
    estimatedMinutes: 32,
    tags: ["capstone", "architecture", "deployment"],
    relatedChallenges: [],
    icon: "🚀",
  },
];

export function getArticleBySlug(slug: string): ArticleMeta | undefined {
  return aiEngineeringArticles.find((a) => a.slug === slug);
}

export function getAdjacentArticles(slug: string) {
  const idx = aiEngineeringArticles.findIndex((a) => a.slug === slug);
  return {
    prev: idx > 0 ? aiEngineeringArticles[idx - 1] : null,
    next: idx < aiEngineeringArticles.length - 1 ? aiEngineeringArticles[idx + 1] : null,
  };
}
