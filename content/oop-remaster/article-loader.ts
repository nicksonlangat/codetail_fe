type TocItem = { id: string; title: string };

type ArticleModule = {
  default: React.ComponentType;
  toc: TocItem[];
};

const loaders: Record<string, () => Promise<ArticleModule>> = {
  "objects-everywhere": () => import("./objects-everywhere") as Promise<ArticleModule>,
  "your-first-class": () => import("./your-first-class") as Promise<ArticleModule>,
  encapsulation: () => import("./encapsulation") as Promise<ArticleModule>,
  inheritance: () => import("./inheritance") as Promise<ArticleModule>,
  "polymorphism-and-duck-typing": () =>
    import("./polymorphism-and-duck-typing") as Promise<ArticleModule>,
  "abstraction-with-abcs": () => import("./abstraction-with-abcs") as Promise<ArticleModule>,
  "magic-methods": () => import("./magic-methods") as Promise<ArticleModule>,
  "composition-and-modern-oop": () =>
    import("./composition-and-modern-oop") as Promise<ArticleModule>,
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
