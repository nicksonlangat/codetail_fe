type TocItem = { id: string; title: string };

type ArticleModule = {
  default: React.ComponentType;
  toc: TocItem[];
};

// Add an entry here as each article's content folder is written.
// Slugs without an entry fall back to "coming soon" in the article page.
const loaders: Record<string, () => Promise<ArticleModule>> = {
  "what-is-a-language-model": () => import("./what-is-a-language-model") as Promise<ArticleModule>,
  "tokenization": () => import("./tokenization") as Promise<ArticleModule>,
  "embeddings": () => import("./embeddings") as Promise<ArticleModule>,
  "neural-network-foundations": () => import("./neural-network-foundations") as Promise<ArticleModule>,
  "attention": () => import("./attention") as Promise<ArticleModule>,
  "pretraining-at-scale": () => import("./pretraining-at-scale") as Promise<ArticleModule>,
  "from-base-model-to-assistant": () => import("./from-base-model-to-assistant") as Promise<ArticleModule>,
  "sampling-and-generation": () => import("./sampling-and-generation") as Promise<ArticleModule>,
  "evaluating-llms": () => import("./evaluating-llms") as Promise<ArticleModule>,
  "loss-and-backpropagation": () => import("./loss-and-backpropagation") as Promise<ArticleModule>,
  "the-transformer-block": () => import("./the-transformer-block") as Promise<ArticleModule>,
  "context-windows-and-kv-cache": () => import("./context-windows-and-kv-cache") as Promise<ArticleModule>,
  "build-a-tiny-llm": () => import("./build-a-tiny-llm") as Promise<ArticleModule>,
  "scaling-laws": () => import("./scaling-laws") as Promise<ArticleModule>,
  "positional-encoding": () => import("./positional-encoding") as Promise<ArticleModule>,
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
