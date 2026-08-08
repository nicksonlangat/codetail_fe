type TocItem = { id: string; title: string };

type ArticleModule = {
  default: React.ComponentType;
  toc: TocItem[];
};

// Add an entry here as each article's content folder is written.
// Slugs without an entry fall back to "coming soon" in the article page.
const loaders: Record<string, () => Promise<ArticleModule>> = {
  "what-is-an-llm-api": () => import("./what-is-an-llm-api") as Promise<ArticleModule>,
  "prompting-as-interface-design": () => import("./prompting-as-interface-design") as Promise<ArticleModule>,
  "structured-output-and-tool-calling": () => import("./structured-output-and-tool-calling") as Promise<ArticleModule>,
  "context-engineering": () => import("./context-engineering") as Promise<ArticleModule>,
  "embeddings-and-vector-search-in-practice": () => import("./embeddings-and-vector-search-in-practice") as Promise<ArticleModule>,
  "retrieval-augmented-generation": () => import("./retrieval-augmented-generation") as Promise<ArticleModule>,
  "agents-and-tool-use": () => import("./agents-and-tool-use") as Promise<ArticleModule>,
  "multi-agent-systems": () => import("./multi-agent-systems") as Promise<ArticleModule>,
  "memory-for-ai-applications": () => import("./memory-for-ai-applications") as Promise<ArticleModule>,
  "evaluating-ai-systems": () => import("./evaluating-ai-systems") as Promise<ArticleModule>,
  "fine-tuning-vs-prompting-vs-rag": () => import("./fine-tuning-vs-prompting-vs-rag") as Promise<ArticleModule>,
  "latency-cost-and-streaming": () => import("./latency-cost-and-streaming") as Promise<ArticleModule>,
  "guardrails-safety-and-prompt-injection": () => import("./guardrails-safety-and-prompt-injection") as Promise<ArticleModule>,
  "observability-for-llm-applications": () => import("./observability-for-llm-applications") as Promise<ArticleModule>,
  "shipping-an-ai-product": () => import("./shipping-an-ai-product") as Promise<ArticleModule>,
};

export async function loadArticle(slug: string): Promise<ArticleModule | null> {
  const loader = loaders[slug];
  if (!loader) return null;
  try {
    return await loader();
  } catch {
    return null;
  }
}
