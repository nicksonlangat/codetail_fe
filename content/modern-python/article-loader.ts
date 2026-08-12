type TocItem = { id: string; title: string };

type ArticleModule = {
  default: React.ComponentType;
  toc: TocItem[];
};

const loaders: Record<string, () => Promise<ArticleModule>> = {
  "type-hints": () => import("./type-hints") as Promise<ArticleModule>,
  "pattern-matching": () => import("./pattern-matching") as Promise<ArticleModule>,
  "modern-data-containers": () => import("./modern-data-containers") as Promise<ArticleModule>,
  "f-strings-and-strings": () => import("./f-strings-and-strings") as Promise<ArticleModule>,
  "modern-functions": () => import("./modern-functions") as Promise<ArticleModule>,
  "modern-exceptions": () => import("./modern-exceptions") as Promise<ArticleModule>,
  "modern-collections": () => import("./modern-collections") as Promise<ArticleModule>,
  "standard-library-modern": () => import("./standard-library-modern") as Promise<ArticleModule>,
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
