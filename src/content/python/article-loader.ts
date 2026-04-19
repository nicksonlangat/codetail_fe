import type React from "react";

type TocItem = { id: string; title: string };

type ArticleModule = {
  default: React.ComponentType;
  toc: TocItem[];
};

const loaders: Record<string, () => Promise<ArticleModule>> = {
  "variables-and-types": () => import("./variables-and-types") as Promise<ArticleModule>,
  strings: () => import("./strings") as Promise<ArticleModule>,
  "numbers-and-math": () => import("./numbers-and-math") as Promise<ArticleModule>,
  "booleans-and-conditions": () => import("./booleans-and-conditions") as Promise<ArticleModule>,
  lists: () => import("./lists") as Promise<ArticleModule>,
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
